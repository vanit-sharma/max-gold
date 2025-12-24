const { default: mongoose } = require("mongoose");
const BzBetDragonTigerGalaxyRate = require("../models/BzBetDragonTigerGalaxyRate");
const BtMatchDragonTigerGalaxyOther = require("../models/BtMatchDragonTigerGalaxyOther");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BtMatchDragonTigerGalaxy = require("../models/BtMatchDragonTigerGalaxy");
const {
  UpdateBalance, pushExposure
} = require("../../utils/function");


async function placeDragonTigerBet(bets, session) {
  // Currency mapping
  const currency = session.currency;
  const userId = session._id;

  let minAmount = 100;
  if (currency === "3") minAmount = 2;
  if (currency === "4") minAmount = 500;

  // Get bet limit
  const betLimitDoc = await BetLimit.findOne({ user_id: userId }).lean();
  const limitBet = betLimitDoc.casino;

  // Check admin role
  if (session.user_role != 8) {
    return { status: false, message: "Betting Not allowed!!!" };
  }

  const eid = bets.catmid;
  const mnam = bets.mnamname;
  let rnr = bets.bettype;
  const rat = bets.odds;
  const amt = bets.amount;

  if (amt > limitBet || amt < minAmount) {
    return {
      status: false,
      message: `min ${minAmount} and max ${limitBet} point bet allow`,
    };
  }

  if (rat > 50) {
    return { status: false, message: "Odd not valid" };
  }

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

  // Prepare runner and side
  let typ = rnr;
  let sid = "";
  let intSid = 0;
  let rateField = "";
  mnam = String(mnam).toLowerCase();

  if (mnam == "dragon") {
    if (typ == "b") {
      rnr = "b1";
    }
    if (typ == "l") {
      rnr = "l1";
    }
    sid = eid + "-1";
    intSid = 1;
    rateField = "b1";
  } else if (mnam == "tiger") {
    if (typ == "b") {
      rnr = "b2";
    }
    if (typ == "l") {
      rnr = "l2";
    }
    sid = eid + "-2";
    intSid = 2;
    rateField = "b2";
  } else {
    return { status: false, message: "Runner not valid" };
  }
  // Get match info
  const match = await BzBetDragonTigerGalaxyRate.findOne({
    evt_status: "CLOSED",
    cat_mid: eid,
    evt_od: { $lt: new Date() },
    result: "",
  }).lean();

  if (!match) {
    return { status: false, mid: eid, message: "No Betting Time Up!!!" };
  }

  const stld = match.stld;
  const matchStatus = match.evt_status;
  const evtId = match.cat_mid;
  const cat_sid1 = match.cat_sid1;
  const cat_sid2 = match.cat_sid2;
  const timeLeft = moment().diff(moment(match.evt_od), "seconds");

  // Check betting enabled
  const betStart = await AdmBetStart.findOne({ sno: "1" }).lean();
  const isBettingEnable = betStart ? betStart.galaxy_dt : false;
  if (!isBettingEnable) {
    return { status: false, message: "Betting not open for this casino." };
  }

  if (timeLeft > 30) {
    return { status: false, message: "Bet not placed. Time is up!!" };
  }

  if (
    !(
      (sid === cat_sid1 && (rnr === "l1" || rnr === "b1")) ||
      (sid === cat_sid2 && (rnr === "l2" || rnr === "b2"))
    )
  ) {
    return { status: false, message: "Runner not valid" };
  }

  if (String(matchStatus) !== "CLOSED" || stld === 1) {
    return { status: false, message: "Status not open" };
  }

  // Get user info
  const punter = await Punter.aggregate([
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
  if (!punter || punter.logon !== 1) {
    return {
      status: false,
      message: "Unable to place this bet. Kindly login again.",
    };
  }

  // Get live rate
  const liverate = rat;

  let ta = 0,
    tb = 0,
    tc = 0,
    td = 0;
  let ratok = 0,
    pro = 0,
    lib = 0;

  if (typ === "b") {
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
  } else if (typ === "l") {
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

  // Check existing bet
  let pointok = 0;
  const existingBet = await BtMatchDragonTigerGalaxy.findOne({
    cat_mid: eid,
    uname: session.uname,
  }).lean();

  let cla = 0;
  if (existingBet) {
    let limit = 0;
    const limita = existingBet.lockamt + existingBet.rnr1s + punter.bz_balance;
    const limitb = existingBet.lockamt + existingBet.rnr2s + punter.bz_balance;
    const limitc =
      existingBet.lockamt + (existingBet.rnr3s || 0) + punter.bz_balance;
    const limitd =
      existingBet.lockamt + (existingBet.rnr4s || 0) + punter.bz_balance;

    if (rnr === "b1") limit = Math.min(limitb, limitc, limitd);
    if (rnr === "b2") limit = Math.min(limita, limitc, limitd);
    // if (rnr === "b3") limit = Math.min(limitb, limita, limitd);
    // if (rnr === "b4") limit = Math.min(limitb, limitc, limita);

    if (rnr === "l1") limit = limita;
    if (rnr === "l2") limit = limitb;
    if (rnr === "l3") limit = limitc;
    if (rnr === "l4") limit = limitd;

    if (lib <= limit) {
      const pla = existingBet.lockamt;
      const nla1 = existingBet.rnr1s + ta;
      const nla2 = existingBet.rnr2s + tb;
      let nla = 0;

      if (Math.min(nla1, nla2) < 0) {
        nla = Math.abs(Math.min(nla1, nla2));
      } else {
        nla = 0;
      }
      cla = pla - nla;
      pointok = 1;

      if (punter.bz_balance - cla < 0) {
        pointok = 2;
      } else {
        await BtMatchDragonTigerGalaxy.updateOne(
          { cat_mid: eid, user_id: session._id },
          { $inc: { rnr1s: ta, rnr2s: tb }, $set: { lockamt: nla } }
        );
      }
    } else {
      pointok = 0;
    }
  } else {
    if (lib <= punter.bz_balance) {
      // Fetch match rate info
      const matchRate = await BzBetDragonTigerGalaxyRate.findOne({
        cat_mid: eid,
      }).lean();
      let cla2 = 0;
      const cla = -lib;
      const nla = (cla2 = lib);
      if (punter.bz_balance - cla < 0) {
        pointok = 2;
      } else {
        let pla = 0;
        if (lib <= limitBet) {
          await BtMatchDragonTigerGalaxy.create({
            cat_mid: eid,
            user_id: session._id,
            uname: session.uname,
            rnr1: match.cat_rnr1,
            rnr1s: ta,
            rnr2: match.cat_rnr2,
            rnr2s: tb,
            lockamt: lib,
            rnr1sid: match.cat_sid1,
            rnr2sid: match.cat_sid2,
          });
          pointok = 1;
        } else {
          pointok = 3;
        }
      }
    } else {
      pointok = 0;
    }
  }

  if (pointok === 1) {
    await BzBetDragonTigerGalaxyRate.updateOne(
      { evt_id: eid },
      { $set: { is_bet_place: "1" } }
    );

    const betHistory = await BzUserBetDraganTigerGalaxyHistory.insertOne({
      uname: session.uname,
      cat_mid: eid,
      rnr: mnam,
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

    const bet_id = betHistory._id;
    //
    await UpdateBalance(req.user._id, cla);
    await pushExposure(req, res, sid, cla, "Dragon Tiger Galaxy");

    // Calculate new balance after bet

    let claVal = punter.bz_balance + cla;

    // Insert new log entry
    await UsersLogs.create({
      page: "livebet_dragontiger_galaxy",
      linkid: bet_id, //
      ptrans: cla,
      otrans: "",
      points: claVal,
      obal: punter.opin_bal,
      uname: session.uname,
      date: new Date(),
      ptype: "bet",
    });

    await Notifications.create({
      evt_id: "Dragon Tiger Galaxy",
      user_id: session.uid,
      game_type: "6",
      description:
        session.uname +
        " placed bet on " +
        mnam +
        " in Dragon Tiger Virtual casino games.",
    });

    return { status: true, message: "Bet Placed." };
  } else if (pointok === 2 || pointok === 3) {
    return { status: false, message: "Bet limit error" };
  } else {
    return { status: false, message: "Insufficient funds!!" };
  }
}

async function placeDragonTigerBetFancy(bets, session) {
  const userId = session._id;
  const currency = session.currency;
  console.log(userId, currency);
  let minAmount = 100;
  if (currency === "3") minAmount = 2;
  if (currency === "4") minAmount = 500;

  // Get bet limit
  console.log("Featured userId:", userId);
  const betLimitDoc = await BetLimit.findOne({ user_id: userId }).lean();
  console.log("+++++++betLimitDoc", betLimitDoc);
  const limitBet = betLimitDoc.casino;

  // Check admin role
  if (session.user_role != 8) {
    return { status: false, message: "Betting Not allowed!!!" };
  }

  const eid = bets.catmid;
  let mnam = bets.teamname;
  let rnr = bets.bettype;
  const rat = bets.odds;
  const amt = bets.amount;

  if (amt > limitBet || amt < minAmount) {
    return {
      status: false,
      message: `min ${minAmount} and max ${limitBet} point bet allow`,
    };
  }

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

  // Map mnam to sid and rateField
  const mnamLower = String(mnam).toLowerCase();
  let newSid, rateField;

  if (mnam == "tie") {
    newSid = 3;
    rateField = "b3";
  } else if (mnam == "pair") {
    newSid = 4;
    rateField = "b4";
  } else if (mnam == "dragon even") {
    newSid = 5;
    rateField = "b5";
  } else if (mnam == "dragon odd") {
    newSid = 6;
    rateField = "b6";
  } else if (mnam == "dragon red") {
    newSid = 7;
    rateField = "b7";
  } else if (mnam == "dragon black") {
    newSid = 8;
    rateField = "b8";
  } else if (mnam == "dragon card 1") {
    newSid = 9;
    rateField = "b9";
  } else if (mnam == "dragon card 2") {
    newSid = 10;
    rateField = "b9";
  } else if (mnam == "dragon card 3") {
    newSid = 11;
    rateField = "b9";
  } else if (mnam == "dragon card 4") {
    newSid = 12;
    rateField = "b9";
  } else if (mnam == "dragon card 5") {
    newSid = 13;
    rateField = "b9";
  } else if (mnam == "dragon card 6") {
    newSid = 14;
    rateField = "b9";
  } else if (mnam == "dragon card 7") {
    newSid = 15;
    rateField = "b9";
  } else if (mnam == "dragon card 8") {
    newSid = 16;
    rateField = "b9";
  } else if (mnam == "dragon card 9") {
    newSid = 17;
    rateField = "b9";
  } else if (mnam == "dragon card 10") {
    newSid = 18;
    rateField = "b9";
  } else if (mnam == "dragon card 11") {
    newSid = 19;
    rateField = "b9";
  } else if (mnam == "dragon card 12") {
    newSid = 20;
    rateField = "b9";
  } else if (mnam == "dragon card 13") {
    newSid = 21;
    rateField = "b9";
  } else if (mnam == "tiger even") {
    newSid = 22;
    rateField = "b10";
  } else if (mnam == "tiger odd") {
    newSid = 23;
    rateField = "b11";
  } else if (mnam == "tiger red") {
    newSid = 24;
    rateField = "b12";
  } else if (mnam == "tiger black") {
    newSid = 25;
    rateField = "b13";
  } else if (mnam == "tiger card 1") {
    newSid = 26;
    rateField = "b14";
  } else if (mnam == "tiger card 2") {
    newSid = 27;
    rateField = "b14";
  } else if (mnam == "tiger card 3") {
    newSid = 28;
    rateField = "b14";
  } else if (mnam == "tiger card 4") {
    newSid = 29;
    rateField = "b14";
  } else if (mnam == "tiger card 5") {
    newSid = 30;
    rateField = "b14";
  } else if (mnam == "tiger card 6") {
    newSid = 31;
    rateField = "b14";
  } else if (mnam == "tiger card 7") {
    newSid = 32;
    rateField = "b14";
  } else if (mnam == "tiger card 8") {
    newSid = 33;
    rateField = "b14";
  } else if (mnam == "tiger card 9") {
    newSid = 34;
    rateField = "b14";
  } else if (mnam == "tiger card 10") {
    newSid = 35;
    rateField = "b14";
  } else if (mnam == "tiger card 11") {
    newSid = 36;
    rateField = "b14";
  } else if (mnam == "tiger card 12") {
    newSid = 37;
    rateField = "b14";
  } else if (mnam == "tiger card 13") {
    newSid = 38;
    rateField = "b14";
  } else {
    return { status: false, message: "Runner name not valid" };
  }
  const intSid = newSid;
  const sid = eid + "-" + newSid;
  const typ = "b";
  rnr = "b1";

  // Get match info
  const match = await BzBetDragonTigerGalaxyRate.findOne({
    evt_status: "CLOSED",
    cat_mid: eid,
    evt_od: { $lt: new Date() },
    result: "",
  }).lean();

  if (!match) {
    return { status: false, mid: eid, message: "This Round is closed" };
  }

  const stld = match.stld;
  const matchStatus = match.evt_status;
  const evtId = match.cat_mid;
  const cat_sid1 = match.cat_sid1;
  const cat_sid2 = match.cat_sid2;
  const timeLeft = moment().diff(moment(match.evt_od), "seconds");

  // Check betting enabled
  const betStart = await AdmBetStart.findOne({ sno: "1" }).lean();
  const isBettingEnable = betStart ? betStart.galaxy_dt : false;
  if (!isBettingEnable) {
    return { status: false, message: "Betting not open for this casino." };
  }

  if (timeLeft > 30) {
    return { status: false, message: "Bet not placed. Time is up!!" };
  }

  if (String(matchStatus) !== "CLOSED" || stld === 1) {
    return { status: false, message: "Status not open" };
  }

  // Get user info
  const punter = await Punter.aggregate([
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
  if (!punter || punter.logon !== 1) {
    return {
      status: false,
      message: "Unable to place this bet. Kindly login again.",
    };
  }

  // Get live rate
  const liverate = rat;

  let ta = 0,
    tb = 0;
  let ratok = 0,
    pro = 0,
    lib = 0;

  if (typ === "b") {
    if (rat <= liverate && liverate > 0) {
      ratok = 1;
      pro = Math.round(rat * amt - amt);
      lib = amt;
      if (rnr === "b1") {
        ta += pro;
        tb -= lib;
      }
    }
  }

  if (ratok === 1) {
    let pointok = 0;
    const existingBet = await BtMatchDragonTigerGalaxyOther.findOne({
      mid_mid: eid,
      user_id: session._id,
      rnr_nam: mnam,
    });

    if (existingBet) {
      if (punter.bz_balance > lib) {
        pointok = 1;
        await BtMatchDragonTigerGalaxyOther.updateOne(
          { mid_mid: eid, uname: session.uname, rnr_nam: mnam },
          { $inc: { bak: ta, lay: tb, lockamt: lib } }
        );
      } else {
        pointok = 0;
      }
    } else {
      if (lib <= punter.bz_balance) {
        const cla = -lib;
        if (punter.bz_balance - cla >= 0) {
          if (lib <= limitBet) {
            await BtMatchDragonTigerGalaxyOther.insertOne({
              mid_mid: eid,
              uname: session.uname,
              rnr_nam: mnam,
              rnr_sid: sid,
              bak: pro,
              lay: cla,
              lockamt: lib,
              evt_id: eid,
              user_id: userId,
            });
            pointok = 1;
          } else {
            pointok = 3;
          }
        } else {
          pointok = 2;
        }
      } else {
        pointok = 0;
      }
    }

    if (pointok === 1) {
      await BzBetDragonTigerGalaxyRate.updateOne(
        { evt_id: eid },
        { $set: { is_bet_place: "1" } }
      );

      cla = -lib;
      // Save bet history
      const betHistory = await BzUserBetDraganTigerGalaxyHistory.insertOne({
        uname: session.uname,
        cat_mid: eid,
        rnr: mnam,
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
      const bet_id = betHistory._id;
      //
      await updateBalance(req.user._id, cla);
      await pushExposure(req, res, sid, cla, "Dragon Tiger Galaxy");

      // Calculate new balance after bet

      let claVal = punter.bz_balance + cla;

      // Insert new log entry
      await UsersLogs.create({
        page: "livebet_dragontiger_galaxy",
        linkid: bet_id,
        ptrans: cla,
        otrans: "",
        points: claVal,
        obal: punter.opin_bal,
        uname: session.uname,
        date: new Date(),
        ptype: "bet",
      });

      await Notifications.create({
        evt_id: "Dragon Tiger Galaxy",
        user_id: session.uid,
        game_type: "6",
        description:
          session.uname +
          " placed bet on " +
          mnam +
          " in Dragon Tiger Virtual casino games.",
      });

      return { status: true, message: "Bet Placed." };
    } else if (pointok === 2 || pointok === 3) {
      return { status: false, message: "Bet limit error" };
    } else {
      return { status: false, message: "Insufficient funds!!" };
    }
  } else {
    return { status: false, message: "Live rate not matched." };
  }
}
async function placeDragonTigerGalaxyGameBetMultiple(req, session) {
  const userId = session.user_id;

  if (session.user_role != 8) {
    return { status: false, message: "Betting Not allowed!!!" };
  }

  let placeBetSuccess = 0;
  let message = "";
  const betPlaceArr = req.body.betPlaceArr;

  if (Array.isArray(betPlaceArr) && betPlaceArr.length > 0) {
    for (const bets of betPlaceArr) {
      const marketType = bets.market_type;
      let val;
      console.log("Session:", session);
      if (marketType === "m") {
        val = await placeDragonTigerBet(bets, session);
      } else if (marketType === "f") {
        val = await placeDragonTigerBetFancy(bets, session);
      }
      placeBetSuccess = val.status;
      message = val.message;
    }
    if (placeBetSuccess === 1) {
      return { status: true, message: "Bet Place Successfully." };
    } else {
      return { status: false, message: message };
    }
  } else {
    return {
      status: false,
      message: "Some information is missing to place this bet.",
    };
  }
}
module.exports = placeDragonTigerGalaxyGameBetMultiple;
