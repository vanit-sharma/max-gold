const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BetAndarbaharGalaxy = require("../models/BetAndarbaharGalaxy");
const BzUserBetAndarbaharGalaxy = require("../models/BzUserBetAndarbaharGalaxy");
const BzUserBetAndarbaharHistoryGalaxy = require("../models/BzUserBetAndarbaharHistoryGalaxy");
const UserLogs = require("../../models/UserLogs");
const { UpdateBalance, pushExposure } = require("../../utils/function");

// Express handler for placing multiple Andar Bahar Galaxy bets
const placeAndarBaharGalaxyGameBetMultiple = async function (req) {
  const result = {};
  const user_role = req.user.user;

  if (user_role != 8) {
    result.status = req.user._id;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  let indexVal = 0;
  let placeBetSuccess = 0;
  const betPlaceArr = req.body && req.body.betPlaceArr;

  if (Array.isArray(betPlaceArr) && betPlaceArr.length > 0) {
    for (const bets of betPlaceArr) {
      indexVal++;
      const eid = bets["catmid"];
      let mnam = bets["teamname"];
      let rnr = bets["bettype"];
      let rat = bets["odds"];
      let amt = bets["amount"];

      const currency = String(req.user.currency).trim();
      let user_id = req.user._id;

      let min_amount;
      if (currency == 1) {
        min_amount = 100;
      } else if (currency == 2) {
        min_amount = 100;
      } else if (currency == 3) {
        min_amount = 2;
      } else if (currency == 4) {
        min_amount = 500;
      }

      const betLimitDoc = await BetLimit.findOne(
        { user_id: String(user_id) },
        { projection: { casino: 1 } }
      ).lean();
      const limit_bet = betLimitDoc && betLimitDoc.casino;

      if (amt > limit_bet) {
        result.status = false;
        result.message =
          "min " + min_amount + " and max " + limit_bet + " point bet allow";
        return result;
      }

      if (amt < min_amount) {
        result.status = false;
        result.message =
          "min " + min_amount + " and max " + limit_bet + " point bet allow";
        return result;
      }

      if (
        eid !== undefined &&
        mnam !== undefined &&
        rnr !== undefined &&
        rat !== undefined &&
        rat > 0 &&
        rat !== "SUSPENDED" &&
        amt !== undefined &&
        amt >= min_amount &&
        amt <= limit_bet
      ) {
        const mid = bets.catmid;
        const typ = bets.bettype;
        mnam = bets.teamname;
        rnr = bets.bettype;
        rat = bets.odds;
        const gameType = req.body.game_type;

        if (amt > limit_bet) {
          result.status = false;
          result.message =
            "min " + min_amount + " and max " + limit_bet + " point bet allow";
          return result;
        }

        if (amt < min_amount) {
          result.status = false;
          result.message =
            "min " + min_amount + " and max " + limit_bet + " point bet allow";
          return result;
        }

        if (String(mid).length > 40) {
          result.status = false;
          result.message = "No Betting Time Up!!! ";
          return result;
        }
        let rateField = "";
        let typeVal = 1;
        let sid;
        if (mnam == "Bahar") {
          if (typ == "b") {
            rnr = "b1";
          }
          if (typ == "l") {
            rnr = "l1";
          }
          sid = eid + "-1";
        } else if (mnam == "Andar") {
          if (typ == "b") {
            rnr = "b2";
          }
          if (typ == "l") {
            rnr = "l2";
          }
          sid = eid + "-2";
        } else {
          result.status = false;
          result.message = "Runner name not valid";
          return result;
        }

        const uid = req.user.uname;
        const upt = req.user.point;
        user_id = req.user.user_id;
        const uss = req.userID;

        mnam = String(mnam || "")
          .trim()
          .toLowerCase();
        const bet_type = gameType;
        const gameRate = rat;
        let gameProfit = 0;

        const qdr = await BetAndarbaharGalaxy.findOne({
          evt_status: "CLOSED",
          cat_mid: String(mid),
          evt_od: { $lt: new Date() },
          result: "",
        });

        if (qdr) {
          var stld = qdr.stld;
          var match_status = qdr.evt_status;
          var evt_id = qdr.cat_mid;
          var cat_sid1 = qdr.cat_sid1;
          var cat_sid2 = qdr.cat_sid2;
          var cat_sid3 = qdr.cat_sid3;
          var cat_sid4 = qdr.cat_sid4;
          var timeLeft = Math.floor(
            (Date.now() - new Date(qdr["evt_od"]).getTime()) / 1000
          );
        } else {
          result.status = false;
          result.message = "This Round is closed";
          return result;
        }

        let isBettingEnable = false;

        const drStart = await AdmBetStart.findOne({ sno: 1 });
        isBettingEnable = drStart && drStart.galaxy_andarbahar;

        if (isBettingEnable == false) {
          result.status = false;
          result.message = "Betting not open for this casino.";
          return result;
        }

        if (timeLeft > 18) {
          result.status = false;
          result.message = "Bet not placed. Time is up!!";
          return result;
        }

        if (
          !(
            (sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
            (sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
            (sid == cat_sid3 && rnr == "pairA") ||
            (sid == cat_sid4 && rnr == "pairB")
          )
        ) {
          result.status = false;
          result.message = "Odd not valid";
          return result;
        }

        if (String(match_status).trim() != "CLOSED" || stld == 1) {
          result.status = false;
          result.message = "Status not open";
          return result;
        }

        const drLogin = await Punter.aggregate([
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
        if (drLogin && drLogin.logon == 1) {
          const return_array = {};
          return_array.game_name = "t20";
          return_array.result = false;
          const jsonds = await BetAndarbaharGalaxy.findOne({
            cat_mid: String(eid),
          });

          if (jsonds) {
            const levt_id = jsonds.cat_mid;
            const lcat_mid = levt_id;
            const lcat_sid1 = lcat_mid + "-1";
            const lcat_sid2 = lcat_mid + "-2";
            const lcat_sid3 = lcat_mid + "-3";
            const lcat_sid4 = lcat_mid + "-4";

            if (String(lcat_mid).trim() == String(evt_id).trim()) {
              if (lcat_sid1 == sid) {
                if (typ == "b") {
                  var liverate = jsonds.b1;
                } else if (typ == "l") {
                  var liverate = 0;
                } else {
                  result.status = false;
                  result.message = "Type not valid";
                  return result;
                }
              } else if (lcat_sid2 == sid) {
                if (typ == "b") {
                  var liverate = jsonds.b2;
                } else if (typ == "l") {
                  var liverate = 0;
                } else {
                  result.status = false;
                  result.message = "Type not valid";
                  return result;
                }
              } else if (lcat_sid3 == sid) {
                if (typ == "b") {
                  var liverate = jsonds.pairA;
                } else if (typ == "l") {
                  var liverate = 0;
                } else {
                  result.status = false;
                  result.message = "Type not valid";
                  return result;
                }
              } else if (lcat_sid4 == sid) {
                if (typ == "b") {
                  var liverate = jsonds.pairB;
                } else if (typ == "l") {
                  var liverate = 0;
                } else {
                  result.status = false;
                  result.message = "Type not valid";
                  return result;
                }
              } else {
                result.status = false;
                result.message = "Round not open";
                return result;
              }
            }
          } else {
            result.status = false;
            result.message = "This Round is suspended now.";
            return result;
          }

          let ta = 0;
          let tb = 0;
          let ratok = 0;

          liverate = 1.98;

          if (typ == "b") {
            if (
              rat <= liverate &&
              liverate > 0 &&
              liverate !== undefined &&
              liverate !== null
            ) {
              ratok = 1;
              const pro = Math.round((rat - 1) * amt * 100) / 100;
              const lib = amt;
              if (rnr == "b1") {
                ta = pro;
                tb = -1 * lib;
              }
              if (rnr == "b2") {
                ta = -1 * lib;
                tb = pro;
              }
              if (rnr == "pairA") {
                ta = pro;
                tb = -1 * lib;
              }
              if (rnr == "pairB") {
                ta = -1 * lib;
                tb = pro;
              }
            } else {
              ratok = 0;
            }
          } else if (typ == "l") {
            if (
              rat >= liverate &&
              liverate > 0 &&
              liverate !== undefined &&
              liverate !== null
            ) {
              ratok = 1;
              const pro = amt;
              const lib = Math.round(((rat * amt) / 100) * 100) / 100;
              if (rnr == "l1") {
                ta = -1 * lib;
                tb = pro;
              }
              if (rnr == "l2") {
                ta = pro;
                tb = -1 * lib;
              }
            } else {
              ratok = 0;
            }
          }

          if (ratok == 1) {
            let pointok = 0;

            const stc = await BzUserBetAndarbaharGalaxy.findOne({
              cat_mid: String(mid),
              user_id: req.user._id,
              typeMain: String(typeVal),
            });

            if (stc) {
              const drstc = stc;
              let limit = 0;

              const limita =
                Number(drstc.lockamt) +
                Number(drstc.rnr1s) +
                Number(req.user.bz_balance);
              const limitb =
                Number(drstc.lockamt) +
                Number(drstc.rnr2s) +
                Number(req.user.bz_balance);

              if (rnr == "b1") limit = limitb;
              if (rnr == "b2") limit = limita;
              if (rnr == "l1") limit = limita;
              if (rnr == "l2") limit = limitb;
              if (rnr == "pairA") limit = limitb;
              if (rnr == "pairB") limit = limita;

              if (lib <= limit) {
                const pla = Number(drstc.lockamt);
                const nla1 = Number(drstc.rnr1s) + ta;
                const nla2 = Number(drstc.rnr2s) + tb;

                let nla;
                if (Math.min(nla1, nla2) < 0)
                  nla = Math.abs(Math.min(nla1, nla2));
                else nla = 0;

                const cla = pla - nla;
                pointok = 1;

                if (Number(req.user.bz_balance) - cla >= 0) {
                  await BzUserBetAndarbaharGalaxy.updateOne(
                    {
                      cat_mid: String(mid),
                      typeMain: String(typeVal),
                      user_id: req.user._id,
                      uname: String(uid),
                    },
                    {
                      $inc: { rnr1s: ta, rnr2s: tb },
                      $set: { lockamt: nla },
                    }
                  );
                } else {
                  pointok = 2;
                }
              } else {
                pointok = 0;
              }
            } else {
              if (lib <= req.user.bz_balance) {
                const betAndarbaharGalaxyDoc =
                  await BetAndarbaharGalaxy.findOne({
                    cat_mid: String(mid),
                  }).lean();
                let rnr1Val, rnr2Val;
                if (typeVal === 1) {
                  rnr1Val = betAndarbaharGalaxyDoc.cat_rnr1;
                  rnr2Val = betAndarbaharGalaxyDoc.cat_rnr2;
                } else if (typeVal === 2) {
                  rnr1Val = betAndarbaharGalaxyDoc.cat_rnr3;
                  rnr2Val = betAndarbaharGalaxyDoc.cat_rnr4;
                }
                let cla2;
                const cla = -lib;
                const nla = (cla2 = lib);

                if (req.user.bz_balance - cla >= 0) {
                  const pla = 0;
                  if (cla2 <= limit_bet) {
                    await BzUserBetAndarbaharGalaxy.create({
                      cat_mid: String(mid),
                      uname: String(uid),
                      rnr1: rnr1Val,
                      rnr1s: ta,
                      rnr2: rnr2Val,
                      rnr2s: tb,
                      lockamt: cla2,
                      rnr1sid: betAndarbaharGalaxyDoc.cat_sid1,
                      rnr2sid: betAndarbaharGalaxyDoc.cat_sid2,
                      typeMain: typeVal,
                      user_id: req.user._id,
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
              // Update bet_andarbahar_galaxy to mark bet placed
              await BetAndarbaharGalaxy.updateOne(
                { evt_id: String(mid) },
                { $set: { is_bet_place: "1" } }
              );

              // Insert into bz_user_bet_andarbahar_history_galaxy
              const historyDoc = await BzUserBetAndarbaharHistoryGalaxy.create({
                uname: String(uid),
                cat_mid: String(mid),
                rnr: String(rnr),
                rate: rat,
                amnt: amt,
                pro: pro,
                lib: lib,
                type: typ,
                cla: cla,
                rnrsid: sid,
                user_id: req.user._id,
              });

              // Update user balance

              await UpdateBalance(req.user._id, cla);
              await pushExposure(
                req,
                res,
                sid,
                cla,
                "Andar Bahar Galaxy Virtual"
              );

              if (updateBalanceResult.modifiedCount > 0) {
                const dt = moment().format("YYYY-MM-DD HH:mm:ss");
                let claVal;

                claVal = req.user.bz_balance + cla;

                // Insert into users_logs
                await UserLogs.create({
                  page: "livebet_andarbahar",
                  linkid: historyDoc._id,
                  ptrans: cla,
                  otrans: "",
                  points: claVal,
                  obal: req.user.opin_bal,
                  uname: String(uid),
                  date: dt,
                  ptype: "bet",
                });

                // Insert notification
                await Notifications.create({
                  evt_id: "andarbahar",
                  user_id: req.user._id,
                  game_type: "6",
                  description: `${uid} placed bet on ${mnam} in andarbahar casino games.`,
                });

                placeBetSuccess = 1;
              } else {
                result.status = false;
                result.message = "Error while placing bet";
                return result;
              }
            } if (pointok === 2) {
                result.status = false;
                result.message = "Bet limit error " + pointok;
                return result;
            } else if (pointok === 3) {
                result.status = false;
                result.message = "Bet limit error " + pointok;
                return result;
            } else {
                result.status = false;
                result.message = "Insufficient funds!!";
                return result;
            }
          } else {
            result.status = false;
            result.message = "Live rate not matched.";
            return result;
          }
        } else {
          result.status = false;
          result.message = "Unable to place this bet. Kindly login again.";
          return result;
        }
      }
    }
    if (placeBetSuccess == 1) {
      result.status = true;
      result.message = "Bet Place Successfully.";
      return result;
    }
  } else {
    const response = {
      status: false,
      message: "Some information is missing to place this bet.",
    };
    return response;
  }
};

module.exports = placeAndarBaharGalaxyGameBetMultiple;
