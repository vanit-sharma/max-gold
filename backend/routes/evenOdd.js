const express = require("express");
const router = express.Router();
const {
  getUserHierarchy,
  UpdateBalance,
  get_user_latest_points_byid,
} = require("../utils/function");
const getSportsLimit = require("../lib/getSportsLimit");

const auth = require("../middleware/auth");

const BetLock = require("../models/BetLock");
const EvenOddDetail = require("../models/EvenOddDetail");
const BetStart = require("../models/AdmBetStart");
const BtMatchEvenOdd = require("../models/BtMatchEvenOdd");
const BtBets = require("../models/BtBets");
const Punter = require("../models/Punter");
const UserLoginHistory = require("../models/BzUserLoginHistory");
const UserLogs = require("../models/UserLogs");
const BetfairEvent = require("../models/BetfairEvent");
const BetlockByMarket = require("../models/BetlockByMarket");

//router.use(auth);

router.get("/", async (req, res) => {
  //try {

  const currency = req.user.currency;
  const userid = req.user._id;
  let mat_mlimit, min_amount;

  if (currency === 1 || currency === 2) {
    mat_mlimit = await getSportsLimit("cricket", userid);
    min_amount = await getSportsLimit("cricket_min", userid);
  } else {
    mat_mlimit = await getSportsLimit("cricket", userid);
    min_amount = await getSportsLimit("cricket_min", userid);
  }

  const user_role = req.user.user_role;
  const ip_address = req.ip;
  const postArray = req.body;

  if (user_role != 8) {
    return res.json({ status: false, message: "Betting Not allowed!!!" });
  }

  const requiredFields = ["catmid", "bet_type", "odds", "amount", "sid"];
  if (!requiredFields.every((f) => postArray[f] !== undefined)) {
    return res.json({
      status: false,
      message: `One Time Maximum bet amount ${
        currency === 1 ? "$" : ""
      }${mat_mlimit}`,
    });
  }

  const lid = postArray.eventId?.trim();
  if (!lid || lid.length > 20)
    return res.json({ status: false, message: "EventId length Error." });

  const marketid = postArray.marketid?.trim();
  const mid = postArray.sid?.trim();
  if (!mid || mid.length > 70)
    return res.json({ status: false, message: "Market Id Not Valid" });

  const typ = postArray.bet_type?.trim();
  if (!typ || typ.length > 10)
    return res.json({ status: false, message: "Bet Type not valid" });

  let rnr = typ === "B" ? "b1" : "l1";
  const rat = Number(postArray.odds);
  const amt = Number(postArray.amount);
  const uid = req.user.uname?.trim();

  // User controls
  const userControl = await Punter.findOne({ _id: userid }, "c_enble");
  if (userControl?.c_enble === 0)
    return res.json({
      status: false,
      message: "Bet not allow for your account.",
    });

  if (amt > mat_mlimit)
    return res.json({ status: false, message: `Max Size is: ${mat_mlimit}` });
  if (amt < min_amount)
    return res.json({
      status: false,
      message: `Minimum Amount should be ${min_amount}`,
    });

  const sid = postArray.sid?.trim();
  const price = Number(postArray.price);

  // Betting enable check
  const betStart = await BetStart.findOne({ sno: "1" });
  if (!betStart?.IsBettingStart)
    return res.json({
      status: false,
      message: "Betting not open for this match.",
    });

  // User bet lock
  const betLock = await BetLock.findOne({ user_id: userid });
  if (betLock && betLock.cric_fancy === 0) {
    return res.json({
      status: false,
      message:
        "Your betting is locked for this market. Please contact your upline.",
    });
  }

  const betfairEvent = await BetfairEvent.findOne({ evt_id: lid });
  if (!betfairEvent) {
    return res.json({
      status: false,
      message: "Even odd not open for this match.",
    });
  }
  const { fancy_type, cat_mid, fancy, inplay, evenodd } = betfairEvent;

  if (!(inplay === 1 && evenodd === 1)) {
    return res.json({
      status: false,
      message: "Even odd not open for this match.",
    });
  }

  const betlockByMarket = await BetlockByMarket.findOne({
    market_type: 1,
    selected_users: userid,
    cat_mid: cat_mid,
  });
  if (betlockByMarket) {
    return res.json({
      status: false,
      message: "Bet not allowed in this market",
    });
  }

  // Event details
  const event = await EvenOddDetail.findOne({ id: marketid });
  if (!event) return res.json({ status: false, message: "Market not found." });
  const {
    evt_id,
    title: m_nam,
    status,
    cat_mid: cat_mid_even_odd,
    back_odd,
    lay_odd,
  } = event;

  if (status === 0)
    return res.json({ status: false, message: "Market closed." });

  let liverate = 0,
    liveprice = 0;
  if (typ === "B") {
    liverate = back_odd;
    liveprice = 98;
    rnr = "b1";
  } else if (typ === "L") {
    liverate = lay_odd;
    liveprice = 102;
    rnr = "l1";
  }

  const t0 = status === 1 ? "OPEN" : "SUSPENDED";

  // User history

  const userLogin = await Punter.aggregate([
    {
      $match: { _id: req.user._id },
    },
    {
      $lookup: {
        from: "bz_user_login_history", // the collection name
        localField: "_id", // Punter’s _id
        foreignField: "userAutoId", // history’s userAutoId
        as: "loginHistory", // output array field
      },
    },
    {
      $unwind: {
        path: "$loginHistory",
        preserveNullAndEmptyArrays: true, // keeps the user even if no history
      },
    },

    {
      $project: {
        plimit: 1,
        opin_bal: 1,
        bz_balance: 1,
        stat: 1,
        user_role: 1,
        bet_status: 1,
        "loginHistory.logon": 1,
        "loginHistory.ipaddr": 1,
        sponsor: 1,
        sponser_id: 1,
        full_chain: 1,
        "loginHistory.site_toke": 1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  if (!userLogin)
    return res.json({
      status: false,
      message: "Session not valid to place this bet",
    });

  let errorMessage = "";
  if (req.user.stat !== "1") errorMessage += "Account not active. ";
  if (req.user.bet_status !== "1")
    errorMessage += "Bet is not allowed for your account. ";
  if (req.user.user_role !== "8")
    errorMessage += "Bet is not active for this account. ";
  if (errorMessage) return res.json({ status: false, message: errorMessage });

  if (t0 !== "OPEN")
    return res.json({ status: false, message: "Status not open." });

  let ratok = 0,
    pro = 0,
    lib = 0,
    ta = 0,
    tb = 0,
    tc = 0;
  if (typ === "B") {
    if (rat >= liverate && price === liveprice && liverate !== 0) {
      if (!liverate || !liveprice) {
        ratok = 0;
      } else {
        ratok = 1;
        pro = liverate * amt - amt;
        lib = amt;
        if (rnr === "b1") {
          ta += pro;
          tb -= lib;
          tc -= lib;
        }
        if (rnr === "b2") {
          ta -= lib;
          tb += pro;
          tc -= lib;
        }
        if (rnr === "b3") {
          ta -= lib;
          tb -= lib;
          tc += pro;
        }
      }
    } else {
      ratok = 0;
    }
  }

  if (typ === "L") {
    if (rat <= liverate && price === liveprice && liverate !== 0) {
      if (!liverate) {
        ratok = 0;
      } else {
        ratok = 1;
        pro = amt;
        lib = liverate * amt - amt;

        if (rnr === "l1") {
          ta -= lib;
          tb += pro;
          tc += pro;
        }
        if (rnr === "l2") {
          ta += pro;
          tb -= lib;
          tc += pro;
        }
        if (rnr === "l3") {
          ta += pro;
          tb += pro;
          tc -= lib;
        }
      }
    } else {
      ratok = 0;
    }
  }

  if (ratok !== 1) return res.json({ status: false, message: "Odd Change" });

  // Bet summary
  let betSummary = await BtMatchEvenOdd.findOne({
    mid_mid: mid,
    user_id: userid,
    evt_id,
    b_nam: m_nam,
    stld: 0,
    cat_mid: cat_mid_even_odd,
  });
  let pointok = 0,
    cla = 0,
    bet_summery_id = betSummary._id;

  if (betSummary) {
    let limit = 0;
    const limita = betSummary.lockamt + betSummary.bak + user.bz_balance;
    const limitb = betSummary.lockamt + betSummary.lay + user.bz_balance;
    if (rnr === "b1") limit = limitb;
    if (rnr === "b2") limit = limita;
    if (rnr === "l1") limit = limita;
    if (rnr === "l2") limit = limitb;

    if (lib <= limit) {
      const nla1 = betSummary.bak + ta;
      const nla2 = betSummary.lay + tb;
      let nla;
      if (Math.min(nla1, nla2) < 0) {
        nla = Math.abs(Math.min(nla1, nla2));
      } else {
        nla = 0;
      }

      cla = betSummary.lockamt - nla;
      pointok = 1;
      if (req.user.bz_balance - req.user.plimit + cla >= 0) {
        await BtMatchEvenOdd.updateOne(
          {
            cat_mid: cat_mid_even_odd,
            uname: uid,
            mid_mid: mid,
            user_id: userid,
          },
          {
            $inc: {
              bak: ta,
              lay: tb,
            },
            $set: { lockamt: nla },
          }
        );
      } else {
        pointok = 2;
      }
    }
  } else {
    if (lib <= req.user.bz_balance) {
      // Fetch event details for the given market _id (mid)
      const drsts = await EvenOddDetail.findOne({
        _id: mongoose.ObjectId(mid),
      });
      cla = -lib;
      if (req.user.bz_balance - cla >= 0) {
        const newBet = new BtMatchEvenOdd({
          mid_mid: mid,
          uname: uid,
          cat_mid: cat_mid_even_odd,
          bak: ta,
          rnr_sid: mid,
          lay: tb,
          lockamt: lib,
          evt_id,
          b_nam: m_nam,
          user_id: userid,
        });
        await newBet.save();
        bet_summery_id = newBet._id;
        pointok = 1;
      } else {
        pointok = 2;
      }
    }
  }

  if (pointok === 1) {
    const inp = 1;
    const ttpp = typ === "B" ? "Y" : "N";
    const bet = new BtBets({
      uname: uid,
      cat_mid: cat_mid_even_odd,
      rnr,
      rate: rat,
      amnt: amt,
      pro,
      lib,
      inplay: inp,
      type: ttpp,
      cla,
      rnrsid: sid,
      evt_id,
      m_nam,
      bet_type: "eo",
      is_settled: 0,
      is_loss: 0,
      stmp: new Date(),
      section: m_nam,
      user_id: userid,
      bet_summery_id,
      ip_address,
    });
    await bet.save();
    const bet_id = bet._id;
    await UpdateBalance(uid, cla);

    const after_bet_balance = await get_user_latest_points_byid(userid);

    // Log
    await UserLogs.create({
      page: "livebet_fancy",
      linkid: bet_id,
      ptrans: cla,
      otrans: "",
      points: after_bet_balance,
      obal: req.user.opin_bal,
      uname: uid,
      date: new Date(),
      ptype: "bet",
    });

    return res.json({
      status: true,
      message: "Even Odd Bet Place Successfully.",
    });
  } else if (pointok === 2) {
    return res.json({ status: false, message: `LIMIT_EX,${req.user.plimit}` });
  } else {
    return res.json({ status: false, message: "Insufficent Balance" });
  }

  // } catch (err) {
  //     return res.json({ status: false, message: 'There is something wrong to place this bet.' });
  // }
});

module.exports = router;
