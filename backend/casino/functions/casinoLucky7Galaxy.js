const { default: mongoose } = require("mongoose");
const Lucky7GalaxyRate = require("../models/Lucky7GalaxyRate");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzBetMatchLucky7Galaxy = require("../models/BzBetMatchLucky7Galaxy");
const BzBetsLucky7GalaxyHistory = require("../models/BzBetsLucky7GalaxyHistory");
const UserLogs = require("../../models/UserLogs");
const {
  UpdateBalance, pushExposure
} = require("../../utils/function");

async function placeLucky7GalaxyGameBetMultiple(req, session) {
  const userId = session._id;

  if (session.user_role != 8) {
    return { status: false, message: "Betting Not allowed!!!" };
  }

  let placeBetSuccess = 0;
  const betPlaceArr = req.body.betPlaceArr;
  if (Array.isArray(betPlaceArr) && betPlaceArr.length > 0) {
    for (const bets of betPlaceArr) {
      const eid = bets.catmid;
      const mnam = bets.teamname;
      let rnr = bets.bettype;
      let rat = bets.odds;
      let amt = bets.amount;
      const currency = (session.currency || "").toString();

      let minAmount = 100;
      if (currency === "3") minAmount = 2;
      else if (currency === "4") minAmount = 500;

      const betLimitDoc = await BetLimit.findOne({ user_id: userId });
      const limitBet = betLimitDoc ? betLimitDoc.casino : 0;

      if (amt > limitBet || amt < minAmount) {
        return {
          status: false,
          message: `min ${minAmount} and max ${limitBet} point bet allow`,
        };
      }

      // Validate bet fields
      if (
        eid &&
        mnam &&
        rnr &&
        rat > 0 &&
        rat !== "SUSPENDED" &&
        amt >= minAmount &&
        amt <= limitBet
      ) {
        const mid = eid;
        const typ = rnr;
        const gameType = req.body.game_type;

        if (amt > limitBet || amt < minAmount) {
          return {
            status: false,
            message: `min ${minAmount} and max ${limitBet} point bet allow`,
          };
        }

        if (mid.length > 40) {
          return { status: false, message: "No Betting Time Up!!! " };
        }

        if (mnam == "low card") {
          sid = eid + "-1";
          intSid = 1;
          rateField = "b1";
        } else if (mnam == "high card") {
          sid = eid + "-2";
          intSid = 2;
          rateField = "b2";
        } else if (mnam == "tie card") {
          sid = eid + "-3";
          intSid = 3;
          rateField = "b3";
        } else if (mnam == "red") {
          sid = eid + "-4";
          intSid = 4;
          rateField = "b4";
        } else if (mnam == "black") {
          sid = eid + "-5";
          intSid = 5;
          rateField = "b5";
        } else if (mnam == "odd") {
          sid = eid + "-6";
          intSid = 6;
          rateField = "b6";
        } else if (mnam == "even") {
          sid = eid + "-7";
          intSid = 7;
          rateField = "b7";
        } else if (mnam == "club") {
          sid = eid + "-8";
          intSid = 8;
          rateField = "b8";
        } else if (mnam == "diamond") {
          sid = eid + "-9";
          intSid = 9;
          rateField = "b9";
        } else if (mnam == "heart") {
          sid = eid + "-10";
          intSid = 10;
          rateField = "b10";
        } else if (mnam == "spade") {
          sid = eid + "-11";
          intSid = 11;
          rateField = "b11";
        } else if (mnam == "a23") {
          sid = eid + "-12";
          intSid = 12;
          rateField = "b12";
        } else if (mnam == "456") {
          sid = eid + "-13";
          intSid = 13;
          rateField = "b12";
        } else if (mnam == "8910") {
          sid = eid + "-14";
          intSid = 14;
          rateField = "b12";
        } else if (mnam == "jqk") {
          sid = eid + "-15";
          intSid = 15;
          rateField = "b12";
        } else if (mnam == "card 1") {
          sid = eid + "-16";
          intSid = 16;
          rateField = "b13";
        } else if (mnam == "card 2") {
          sid = eid + "-17";
          intSid = 17;
          rateField = "b13";
        } else if (mnam == "card 3") {
          sid = eid + "-18";
          intSid = 18;
          rateField = "b13";
        } else if (mnam == "card 4") {
          sid = eid + "-19";
          intSid = 19;
          rateField = "b13";
        } else if (mnam == "card 5") {
          sid = eid + "-20";
          intSid = 20;
          rateField = "b13";
        } else if (mnam == "card 6") {
          sid = eid + "-21";
          intSid = 21;
          rateField = "b13";
        } else if (mnam == "card 7") {
          sid = eid + "-22";
          intSid = 22;
          rateField = "b13";
        } else if (mnam == "card 8") {
          sid = eid + "-23";
          intSid = 23;
          rateField = "b13";
        } else if (mnam == "card 9") {
          sid = eid + "-24";
          intSid = 24;
          rateField = "b13";
        } else if (mnam == "card 10") {
          sid = eid + "-25";
          intSid = 25;
          rateField = "b13";
        } else if (mnam == "card 11") {
          sid = eid + "-26";
          intSid = 26;
          rateField = "b13";
        } else if (mnam == "card 12") {
          sid = eid + "-27";
          intSid = 27;
          rateField = "b13";
        } else if (mnam == "card 13") {
          sid = eid + "-28";
          intSid = 28;
          rateField = "b13";
        } else {
          return { status: false, message: "Runner name not valid" };
        }

        const uid = session.uname;
        const userBalance = session.point;

        if (typ == "b") {
          rnr = "b1";
        }
        // Get round info
        // const roundDoc = await Lucky7GalaxyRate.findOne({
        //   evt_status: "CLOSED",
        //   cat_mid: mid,
        //   result: "",
        // });
        const now = new Date();
        var pipeline = [
          {
            $match: {
              evt_status: "CLOSED",
              cat_mid: mid,
              evt_od: { $lt: new Date() }, // still keeps the 'evt_od < now()' guard
              result: "",
            },
          },
          {
            $addFields: {
              // TIME_TO_SEC(TIMEDIFF(now(), evt_od))
              difftm: {
                $dateDiff: {
                  startDate: "$evt_od",
                  endDate: "$$NOW",
                  unit: "second",
                },
              },
            },
          },
        ];
        const roundDoc = await Lucky7GalaxyRate.aggregate(pipeline).exec();
        if (!roundDoc) {
          return { status: false, message: "This Round is closed" };
        }
        const stld = roundDoc.stld;
        const matchStatus = roundDoc.evt_status;
        const evtId = roundDoc.cat_mid;
        const timeLeft = Math.floor(
          (Date.now() - new Date(roundDoc.evt_od).getTime()) / 1000
        );

        // Betting enable check
        const betStartDoc = await AdmBetStart.findOne({ sno: "1" });
        const isBettingEnable = betStartDoc ? betStartDoc.galaxy_lucky7 : false;
        if (!isBettingEnable) {
          return {
            status: false,
            message: "Betting not open for this casino.",
          };
        }
        if (timeLeft > 30) {
          return { status: false, message: "Bet not placed. Time is up!!" };
        }
        if (matchStatus !== "CLOSED" || stld === 1) {
          return { status: false, message: "Status not open" };
        }

        // Get user info
        const userDoc = await Punter.aggregate([
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

        if (!userDoc || userDoc.logon !== 1) {
          return {
            status: false,
            message: "Unable to place this bet. Kindly login again.",
          };
        }

        // Get live rate
        // const liveRateDoc = await Lucky7GalaxyRate.findOne({ cat_mid: eid });
        // const liverate = liveRateDoc ? liveRateDoc[rateField] || rat : rat;

        liveRate = rat; // because the above code was commented out in php

        let ratok = 0,
          pro = 0,
          lib = amt;
        let ta = 0;
        let tb = 0;
        let tc = 0;
        let td = 0;

        if (typ === "b" && rat <= liverate && liverate > 0) {
          ratok = 1;
          pro = Math.round(rat * amt - amt);
          if (rnr == "b1") {
            ta += pro;
            tb -= lib;
          }
        }

        if (ratok === 1) {
          let pointok = 0;
          // Check if user already has a bet
          const matchDoc = await BzBetMatchLucky7Galaxy.findOne({
            mid_mid: mid,
            user_id: session._id,
            rnr_nam: mnamKey,
          });
          if (matchDoc) {
            if (userDoc.bz_balance > lib) {
              pointok = 1;
              await BzBetMatchLucky7Galaxy.updateOne(
                { mid_mid: mid, uname: uid, rnr_nam: mnamKey },
                { $inc: { bak: pro, lay: -lib, lockamt: lib } }
              );
            } else {
              return { status: false, message: "Insufficient funds!!" };
            }
          } else {
            if (lib <= userDoc.bz_balance) {
              const cla = -lib;
              if (userDoc.bz_balance - cla >= 0 && lib <= limitBet) {
                await BzBetMatchLucky7Galaxy.insertOne({
                  mid_mid: mid,
                  uname: uid,
                  rnr_nam: mnamKey,
                  rnr_sid: sid,
                  bak: pro,
                  lay: cla,
                  lockamt: lib,
                  evt_id: mid,
                  user_id: userId,
                });
              } else {
                return { status: false, message: "Bet limit error" };
              }
            } else {
              return { status: false, message: "Insufficient funds!!" };
            }
          }

          // Update is_bet_place
          await Lucky7GalaxyRate.updateOne(
            { evt_id: mid },
            { $set: { is_bet_place: "1" } }
          );

          // Insert bet history
          const cla = -lib;
          await BzBetsLucky7GalaxyHistory.insertOne({
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
          UpdateBalance(session._id, cla);
          await pushExposure(req, res, sid, cla, "Lucky 7 Galaxy");

          await UserLogs.create({
            page: "livebet_Lucky7_galaxy",
            linkid: bet_id,
            ptrans: cla,
            otrans: "",
            points: claVal,
            obal: session.opin_bal,
            uname: uid,
            date: new Date(),
            ptype: "bet",
          });

          // Insert notification
          await Notifications.insertOne({
            evt_id: "Lucky 7 Virtual",
            user_id: session.uid,
            game_type: "6",
            description: `${uid} placed bet on ${mnam} in Lucky 7 Virtual casino games.`,
          });

          placeBetSuccess = 1;
        } else {
          return { status: false, message: "Live rate not matched." };
        }
      }
    }
    if (placeBetSuccess === 1) {
      return { status: true, message: "Bet Place Successfully." };
    }
  } else {
    return {
      status: false,
      message: "Some information is missing to place this bet.",
    };
  }
}

module.exports = placeLucky7GalaxyGameBetMultiple;
