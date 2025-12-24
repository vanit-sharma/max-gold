const mongoose = require("mongoose");
const BzBetHiloGalaxyRate = require("../models/BzBetHiloGalaxyRate");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const btMatchHiloGalaxy = require("../models/btMatchHiloGalaxy");
const BzUserBetHiloGalaxyHistory = require("../models/BzUserBetHiloGalaxyHistory");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeHiloBet(bets, session) {
  // Get currency and user info
  const currency = session.currency || "1";
  const userId = session._id;
  let minAmount = 0;
  if (currency == 1) {
    /// 1=INR,2=PKR,3=AED,4= BDT
    minAmount = 100;
  } else if (currency == 2) {
    minAmount = 100;
  } else if (currency == 3) {
    minAmount = 2;
  } else if (currency == 4) {
    minAmount = 500;
  }

  // Get bet limit from DB
  const betLimitDoc = await BetLimit.findOne({ user_id: session._id }).lean();
  const limitBet = betLimitDoc?.casino || 0;

  // Check admin role
  if (session.user_role != 8) {
    return { status: false, message: "Betting Not allowed!!!" };
  }

  const eid = bets.catmid;
  const mnam = bets.teamname?.toLowerCase();
  let rnr = bets.bettype;
  const rat = bets.odds;
  const amt = bets.amount;
  const marketType = bets.market_type;

  // Validate amount
  if (amt > limitBet) {
    return {
      status: false,
      message: `min ${minAmount} and max ${limitBet} point bet allow.`,
    };
  }
  if (amt < minAmount) {
    return {
      status: false,
      message: `min ${minAmount} and max ${limitBet} point bet allow..`,
    };
  }
  if (rat > 50) {
    return { status: false, message: "Odd not valid" };
  }

  // Validate required fields
  if (
    !eid ||
    !mnam ||
    !rnr ||
    !rat ||
    rat <= 0 ||
    !amt ||
    amt < minAmount ||
    amt > limitBet
  ) {
    return {
      status: false,
      message: "Some parameters missing. Please try again.",
    };
  }

  // Map runner and rateField
  let sid, intSid, rateField;
  if (mnam === "high") {
    rnr = rnr === "b" ? "b1" : "l1";
    sid = `${eid}-1`;
    intSid = 1;
    rateField = "b1";
  } else if (mnam === "low") {
    rnr = rnr === "b" ? "b2" : "l2";
    sid = `${eid}-2`;
    intSid = 2;
    rateField = "b2";
  } else if (mnam === "snap") {
    rnr = rnr === "b" ? "b3" : "l3";
    sid = `${eid}-3`;
    intSid = 3;
    rateField = "b3";
  } else if (mnam === "red") {
    sid = `${eid}-4`;
    intSid = 4;
    rateField = "b4";
  } else if (mnam === "black") {
    sid = `${eid}-5`;
    intSid = 5;
    rateField = "b5";
  } else if (mnam === "2345") {
    sid = `${eid}-6`;
    intSid = 6;
    rateField = "b6";
  } else if (mnam === "6789") {
    sid = `${eid}-7`;
    intSid = 7;
    rateField = "b7";
  } else if (mnam === "jqka") {
    sid = `${eid}-8`;
    intSid = 8;
    rateField = "b8";
  } else {
    return { status: false, message: "Runner not valid" };
  }

  // Get market info
  console.log("eid:", eid);
  const market = await BzBetHiloGalaxyRate.findOne({
    evt_status: "CLOSED",
    cat_mid: eid,
    evt_od: { $lt: new Date() },
    result: "",
  }).lean();

  if (!market) {
    return { status: false, mid: eid, message: "No Betting Time Up!!!" };
  }

  const {
    stld,
    evt_status: matchStatus,
    cat_mid: evtId,
    cat_sid1,
    cat_sid2,
    cat_sid3,
    evt_od,
  } = market;
  const timeLeft = moment().diff(moment(evt_od), "seconds");

  if (timeLeft > 27) {
    return { status: false, message: "Bet not placed. Time is up!!" };
  }

  // Validate runner
  if (
    !(
      (sid === cat_sid1 && (rnr === "l1" || rnr === "b1")) ||
      (sid === cat_sid2 && (rnr === "l2" || rnr === "b2")) ||
      (sid === cat_sid3 && (rnr === "l3" || rnr === "b3")) ||
      [4, 5, 6, 7, 8].includes(intSid)
    )
  ) {
    return { status: false, message: "Runner not valid" };
  }

  if (matchStatus !== "CLOSED" || stld === 1) {
    return { status: false, message: "Status not open" };
  }

  // Get user info
  const punter = await Punter.aggregate([
    {
      $match: { _id: session._id },
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
  if (!punter || punter.logon !== 1) {
    return {
      status: false,
      message: "Unable to place this bet. Kindly login again.",
    };
  }

  // Get live rate
  let liverate;
  console.log("Reached here");
  if (marketType === "m") {
    // Get live rate from DB
    const jsonds = await BzBetHiloGalaxyRate.findOne({ cat_mid: eid }).lean();

    if (jsonds && Object.keys(jsonds).length >= 1) {
      const lcat_mid = jsonds.cat_mid;
      const levt_id = lcat_mid;

      // Assuming data structure: jsonds.data.t2[1].gstatus
      const lcat_rnr2_status =
        jsonds.data &&
        jsonds.data.t2 &&
        Array.isArray(jsonds.data.t2) &&
        jsonds.data.t2[1] &&
        jsonds.data.t2[1].gstatus
          ? jsonds.data.t2[1].gstatus
          : undefined;

      console.log(
        "lcat_mid:",
        lcat_mid,
        "evtId:",
        evtId,
        "lcat_rnr2_status:",
        lcat_rnr2_status
      );
      if (String(lcat_mid).trim() === String(evtId).trim()) {
        if (bets.bettype === "b") {
          liverate = jsonds[rateField];
        } else {
          return { status: false, message: "Round not open" };
        }
      } else {
        return { status: false, message: "Round not open" };
      }
    }
  } else {
    liverate = rat;
  }
  //---------------
  // Calculate profit/loss
  let ta = 0,
    tb = 0,
    tc = 0,
    td = 0,
    ratok = 0,
    pro = 0,
    lib = 0;

  if (bets.bettype === "b") {
    if (rat <= liverate && liverate > 0) {
      ratok = 1;
      pro = Math.round(rat * amt - amt);
      lib = amt;
      if (rnr === "b1") {
        ta += pro;
        tb -= lib;
        tc -= lib;
        td -= lib;
      }
      if (rnr === "b2") {
        ta -= lib;
        tb += pro;
        tc -= lib;
        td -= lib;
      }
      if (rnr === "b3") {
        ta -= lib;
        tb -= lib;
        tc += pro;
        td -= lib;
      }
      if (rnr === "b4") {
        ta -= lib;
        tb -= lib;
        tc -= lib;
        td += pro;
      }
    }
  } else if (bets.bettype === "l") {
    if (rat >= liverate && liverate > 0) {
      ratok = 1;
      pro = amt;
      lib = Math.round(rat * amt - amt);
      if (rnr === "l1") {
        ta -= lib;
        tb += pro;
        tc += pro;
        td += pro;
      }
      if (rnr === "l2") {
        ta += pro;
        tb -= lib;
        tc += pro;
        td += pro;
      }
      if (rnr === "l3") {
        ta += pro;
        tb += pro;
        tc -= lib;
        td += pro;
      }
      if (rnr === "l4") {
        ta += pro;
        tb += pro;
        tc += pro;
        td -= lib;
      }
    }
  }

  if (ratok !== 1) {
    return { status: false, message: "Live rate not matched." };
  }

  // Check balance and limits
  let pointok = 0;
  let cla = 0;
  if (marketType === "m") {
    const match = await btMatchHiloGalaxy
      .findOne({
        cat_mid: eid,
        user_id: session._id,
      })
      .lean();
    if (match) {
      // Existing match, update
      let limit = 0;
      const limita = match.lockamt + match.rnr1s + punter.bz_balance;
      const limitb = match.lockamt + match.rnr2s + punter.bz_balance;
      const limitc = match.lockamt + match.rnr3s + punter.bz_balance;
      const limitd = match.lockamt + match.rnr4s + punter.bz_balance;
      if (rnr === "b1") limit = Math.min(limitb, limitc, limitd);
      if (rnr === "b2") limit = Math.min(limita, limitc, limitd);
      if (rnr === "b3") limit = Math.min(limitb, limita, limitd);
      if (rnr === "l1") limit = limita;
      if (rnr === "l2") limit = limitb;
      if (rnr === "l3") limit = limitc;
      if (rnr === "l4") limit = limitd;

      if (lib <= limit) {
        const pla = match.lockamt;
        const nla1 = match.rnr1s + ta;
        const nla2 = match.rnr2s + tb;
        const nla3 = match.rnr3s + tc;
        const nla4 = match.rnr4s + td;

        let nla;
        if (Math.min(nla1, nla2) < 0) {
          nla = Math.abs(Math.min(nla1, nla2));
        } else {
          nla = 0;
        }

        cla = pla - nla;
        pointok = 1;

        if (punter.bz_balance - cla >= 0) {
          // Update record
          await btMatchHiloGalaxy.updateOne(
            { cat_mid: eid, uname: bets.uname },
            { $inc: { rnr1s: ta, rnr2s: tb, rnr3s: tc } },
            { $set: { lockamt: nla } }
          );
        } else {
          pointok = 2;
        }
      } else {
        pointok = 0;
      }
    } else {
      if (lib <= punter.bz_balance) {
        cla = -lib;
        const cla2 = lib;
        if (punter.bz_balance - cla < 0) pointok = 2;
        else if (cla2 > limitBet) pointok = 3;
        else {
          await btMatchHiloGalaxy.create({
            cat_mid: eid,
            uname: bets.uname,
            rnr1: market.cat_rnr1,
            rnr1s: ta,
            rnr2: market.cat_rnr2,
            rnr2s: tb,
            rnr3: market.cat_rnr3,
            rnr3s: tc,
            lockamt: cla2,
            rnr1sid: market.cat_sid1,
            rnr2sid: market.cat_sid2,
            rnr3sid: market.cat_sid3,
            user_id: userId,
          });
          pointok = 1;
        }
      } else {
        pointok = 0;
      }
    }
  } else {
    if (lib <= punter.bz_balance) {
      pointok = 1;
    }
  }

  // Finalize bet
  if (pointok === 1) {
    if (marketType === "f") cla = -lib;
    await BzBetHiloGalaxyRate.updateOne({ evt_id: eid }, { is_bet_place: "1" });

    await BzUserBetHiloGalaxyHistory.insertOne({
      uname: uid,
      cat_mid: mid,
      rnr: mnamKey,
      rate: rat,
      amnt: amt,
      pro: pro,
      lib: lib,
      type: typ,
      cla: cla,
      rnrsid: sid,
      sid: intSid,
      user_id: userId,
    });

    // Update balance
    await Punter.updateOne({ uname: uid }, { $inc: { bz_balance: cla } });

    UpdateBalance(uid, cla);
    await pushExposure(req, res, sid, cla, "HILO Virtual");
    
    await UserLogs.create({
      page: "livebet_hilo_virtual",
      linkid: bet_id,
      ptrans: cla,
      otrans: "",
      points: claVal,
      obal: session.opin_bal,
      uname: uid,
      date: new Date(),
      ptype: "bet",
    });
    await Notifications.create({
      evt_id: "HILO Virtual",
      user_id: bets.uid,
      game_type: "6",
      description: `${bets.uname} placed bet on ${mnam} in HILO Virtual casino games.`,
    });
    return { status: true, message: "Bet Placed." };
  } else if (pointok === 2 || pointok === 3) {
    return { status: false, message: "Bet limit error" };
  } else {
    return { status: false, message: "Insufficient funds!!" };
  }
}

async function placeHiLoGalaxyGameBetMultiple(req, session) {
  const userId = req.session?._id;

  if (session.user_role != 8) {
    return { status: false, message: "Betting Not allowed!!!" };
  }

  const betPlaceArr = req.body.betPlaceArr;
  if (!Array.isArray(betPlaceArr) || betPlaceArr.length === 0) {
    return res.json({
      status: false,
      message: "Some information is missing to place this bet.",
    });
  }

  let placeBetSuccess = 0;
  let message = "";

  for (const bets of betPlaceArr) {
    const marketType = bets.market_type;
    let val;
    if (marketType === "m" || marketType === "f") {
      val = await placeHiloBet(bets, session);
      placeBetSuccess = val.status;
      message = val.message;
    }
  }

  if (placeBetSuccess === 1) {
    return { status: true, message: "Bet Place Successfully." };
  } else {
    return { status: false, message };
  }
}

module.exports = placeHiLoGalaxyGameBetMultiple;
