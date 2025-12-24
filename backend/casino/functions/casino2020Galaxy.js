const { default: mongoose } = require("mongoose");
const Lucky7GalaxyRate = require("../models/Lucky7GalaxyRate");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzUserBetTp20Galaxy = require("../models/BzUserBetTp20Galaxy");
const BetTeenpattiT20Galaxy = require("../models/BetTeenpattiT20Galaxy");
const BzUserBetTp20HistoryGalaxy = require("../models/BzUserBetTp20HistoryGalaxy");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeBetT20(session, bets) {
  let result = {};
  let currency = String(session.currency || "1").trim();
  let user_id = session._id;
  let min_amount;
  if (currency == "1") {
    /// 1=INR,2=PKR,3=AED,4= BDT
    min_amount = 100;
  } else if (currency == "2") {
    min_amount = 100;
  } else if (currency == "3") {
    min_amount = 2;
  } else if (currency == "4") {
    min_amount = 500;
  }
  let betLimitDoc = await BetLimit.findOne({ user_id: user_id });
  let limit_bet = betLimitDoc.casino;

  let eid = bets.catmid;
  let mnam = bets.teamname;
  let rnr = bets.bettype;
  let rat = bets.odds;
  let amt = bets.amount;

  if (amt > limit_bet) {
    result.status = false;
    result.message = `min ${min_amount} and max ${limit_bet} point bet allow`;
    return result;
  }
  if (amt < min_amount) {
    result.status = false;
    result.message = `min ${min_amount} and max ${limit_bet} point bet allow`;
    return result;
  }
  if (session.user_role != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  if (
    eid &&
    mnam &&
    rnr &&
    rat > 0 &&
    rat !== "SUSPENDED" &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    let mid = bets.catmid;
    let typ = bets.bettype;
    mnam = bets.teamname;
    rnr = bets.bettype;
    rat = bets.odds;
    amt = amt;

    let uid = bets.uname;

    let sid = bets.mid || bets.catmid;
    mnam = String(mnam).trim().toLowerCase();
    let userId = bets.user_id;

    if (mnam.length > 35) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }
    if (String(sid).length > 20) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }
    if (String(rat).length > 5) {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }
    if (rat > 50) {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }
    if (String(rnr).length > 20) {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }
    if (String(mid).length > 40) {
      result.status = false;
      result.message = "Mid not valid";
      return result;
    }
    if (String(typ).length > 10) {
      result.status = false;
      result.message = "Type not valid";
      return result;
    }

    let typeVal = 1;
    if (mnam === "player a") {
      if (typ === "b") rnr = "b1";
      if (typ === "l") rnr = "l1";
      sid = eid + "-1";
    } else if (mnam === "player b") {
      if (typ === "b") rnr = "b2";
      if (typ === "l") rnr = "l2";
      sid = eid + "-2";
    } else if (mnam === "player a plus") {
      if (typ === "b") rnr = "pairA";
      sid = eid + "-3";
      typeVal = 2;
    } else if (mnam === "player b plus") {
      if (typ === "b") rnr = "pairB";
      sid = eid + "-4";
      typeVal = 2;
    } else if (mnam === "greaterthan21a") {
      if (typ === "b") rnr = "greaterthan21a";
      sid = eid + "-5";
      typeVal = 3;
    } else if (mnam === "21yesa") {
      if (typ === "b") rnr = "21yesa";
      sid = eid + "-6";
      typeVal = 3;
    } else if (mnam === "lessthan21a") {
      if (typ === "b") rnr = "lessthan21a";
      sid = eid + "-7";
      typeVal = 3;
    } else if (mnam === "greaterthan21b") {
      if (typ === "b") rnr = "greaterthan21b";
      sid = eid + "-8";
      typeVal = 3;
    } else if (mnam === "21yesb") {
      if (typ === "b") rnr = "21yesb";
      sid = eid + "-9";
      typeVal = 3;
    } else if (mnam === "lessthan21b") {
      if (typ === "b") rnr = "lessthan21b";
      sid = eid + "-10";
      typeVal = 3;
    } else if (mnam === "ablack") {
      if (typ === "b") rnr = "ablack";
      sid = eid + "-11";
      typeVal = 3;
    } else if (mnam === "ared") {
      if (typ === "b") rnr = "ared";
      sid = eid + "-12";
      typeVal = 3;
    } else if (mnam === "bblack") {
      if (typ === "b") rnr = "bblack";
      sid = eid + "-13";
      typeVal = 3;
    } else if (mnam === "bred") {
      if (typ === "b") rnr = "bred";
      sid = eid + "-14";
      typeVal = 3;
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    let qds = await BetTeenpattiT20Galaxy.findOne({
      cat_mid: mid,
      evt_od: { $lt: new Date() },
      result: "",
    }).lean();

    if (!qds) {
      result.status = false;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    let stld = qds.stld;
    let match_status = qds.evt_status;
    let evt_id = qds.cat_mid;
    let cat_sid1 = qds.cat_sid1;
    let cat_sid2 = qds.cat_sid2;
    let cat_sid3 = qds.cat_sid3;
    let cat_sid4 = qds.cat_sid4;
    let timeLeft = moment().diff(moment(qds.evt_od), "seconds");

    let ds = await AdmBetStart.findOne({ sno: "1" }).lean();
    let isBettingEnable = ds ? ds.virtual_tp20 : false;

    if (!isBettingEnable) {
      result.status = false;
      result.message = "Betting not open for this casino.";
      return result;
    }

    if (timeLeft > 28) {
      result.status = false;
      result.message = "Bet not placed. Time is up!!";
      return result;
    }

    if (String(match_status).trim() !== "CLOSED" || stld == 1) {
      result.status = false;
      result.message = "Status not open";
      return result;
    }

    let st = await Punter.aggregate([
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
    let liverate = 0;

    if (st && st.logon == 1) {
      liverate = rat;
      let ta = 0;
      let tb = 0;
      let ratok = 0;
      let pro = 0;
      let lib = 0;

      if (typ === "b") {
        if (rat <= liverate && liverate > 0) {
          ratok = 1;
          pro = Math.round((rat - 1) * amt);
          lib = amt;
          if (rnr === "b1") {
            ta = pro;
            tb = -lib;
          }
          if (rnr === "b2") {
            ta = -lib;
            tb = pro;
          }
          if (rnr === "pairA") {
            ta = pro;
            tb = -lib;
          }
          if (rnr === "pairB") {
            ta = -lib;
            tb = pro;
          }
        }
      } else if (typ === "l") {
        if (rat >= liverate && liverate > 0) {
          ratok = 1;
          pro = amt;
          lib = Math.round((rat * amt) / 100);
          if (rnr === "l1") {
            ta = -lib;
            tb = pro;
          }
          if (rnr === "l2") {
            ta = pro;
            tb = -lib;
          }
        }
      }

      if (ratok === 1) {
        if (typeVal === 1) {
          try {
            let pointok = 0;
            let stc = await BzUserBetTp20Galaxy.findOne({
              cat_mid: mid,
              user_id: session._id,
              typeMain: typeVal,
            }).lean();
            if (stc) {
              let limit = 0;
              let limita = stc.lockamt + stc.rnr1s + st.bz_balance;
              let limitb = stc.lockamt + stc.rnr2s + st.bz_balance;
              if (rnr === "b1") limit = limitb;
              if (rnr === "b2") limit = limita;
              if (rnr === "l1") limit = limita;
              if (rnr === "l2") limit = limitb;
              if (rnr === "pairA") limit = limitb;
              if (rnr === "pairB") limit = limita;

              if (lib <= limit) {
                let pla = stc.lockamt;
                let nla1 = stc.rnr1s + ta;
                let nla2 = stc.rnr2s + tb;
                let nla =
                  Math.min(nla1, nla2) < 0 ? Math.abs(Math.min(nla1, nla2)) : 0;
                let cla = pla - nla;
                pointok = 1;

                if (st.bz_balance - cla >= 0) {
                  await BzUserBetTp20Galaxy.updateOne(
                    { cat_mid: mid, user_id: session._id, typeMain: typeVal },
                    { $set: { rnr1s: nla1, rnr2s: nla2, lockamt: nla } }
                  );
                } else {
                  pointok = 2;
                }
              } else {
                pointok = 0;
              }
            } else {
              if (lib <= st.bz_balance) {
                let drsts = await BetTeenpattiT20Galaxy.findOne({
                  cat_mid: mid,
                }).lean();
                let rnr1Val, rnr2Val, sidVal1, sidVal2;
                if (typeVal === 1) {
                  rnr1Val = drsts.cat_rnr1;
                  rnr2Val = drsts.cat_rnr2;
                  sidVal1 = drsts.cat_sid1;
                  sidVal2 = drsts.cat_sid2;
                } else if (typeVal === 2) {
                  rnr1Val = drsts.cat_rnr3;
                  rnr2Val = drsts.cat_rnr4;
                  sidVal1 = drsts.cat_sid3;
                  sidVal2 = drsts.cat_sid4;
                }
                let cla = -lib;
                let cla2 = lib;
                if (st.bz_balance - cla >= 0) {
                  if (cla2 <= limit_bet) {
                    await BzUserBetTp20Galaxy.create({
                      cat_mid: mid,
                      uname: uid,
                      rnr1: rnr1Val,
                      rnr1s: ta,
                      rnr2: rnr2Val,
                      rnr2s: tb,
                      lockamt: cla2,
                      rnr1sid: sidVal1,
                      rnr2sid: sidVal2,
                      typeMain: typeVal,
                      user_id: session._id,
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
              await BetTeenpattiT20Galaxy.updateOne(
                { evt_id: mid },
                { $set: { is_bet_place: "1" } }
              );
              let betHistory = await BzUserBetTp20HistoryGalaxy.create({
                uname: uid,
                cat_mid: mid,
                rnr: rnr,
                rate: rat,
                amnt: amt,
                pro: pro,
                lib: lib,
                type: typ,
                cla: cla,
                rnrsid: sid,
                typeMain: typeVal,
                user_id: session._id,
                market_type: "m",
              });

              const st2 = await UpdateBalance(session._id, cla);
              await pushExposure(req, res, sid, cla, "20 20 teenpatti");
              if (st2) {
                // Log user action
                await UserLogs.create({
                  page: "livebet_teenpatti_20",
                  linkid: betHistory._id,
                  ptrans: cla,
                  otrans: "",
                  points: st.bz_balance + cla,
                  obal: st.opin_bal,
                  uname: uid,
                  date: new Date(),
                  ptype: "bet",
                });
                await Notifications.create({
                  evt_id: "20 20 teenpatti",
                  user_id: userId,
                  game_type: "6",
                  description: `${uid} placed bet on ${mnam} in 20 20 teenpatti casino games.`,
                });
                result.status = true;
                result.message = "Bet Placed.";
                return result;
              } else {
                result.status = false;
                result.message = "Error while placing bet";
                return result;
              }
            } else if (pointok === 2 || pointok === 3) {
              result.status = false;
              result.message = `Bet limit error ${pointok}`;
              return result;
            } else {
              result.status = false;
              result.message = "Insufficient funds!!";
              return result;
            }
          } catch (ex) {
            result.status = false;
            result.message = "Some error occurred while placing this bet.";
            return result;
          }
        } else if (typeVal === 2 || typeVal === 3) {
          let pointok = 0;
          let cla = -amt;
          if (amt <= st.bz_balance) {
            pointok = 1;
          }
          if (pointok === 1) {
            await BetTeenpattiT20Galaxy.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: "1" } }
            );
            let betHistory = await BzUserBetTp20HistoryGalaxy.create({
              uname: uid,
              cat_mid: mid,
              rnr: rnr,
              rate: rat,
              amnt: amt,
              pro: pro,
              lib: -lib,
              type: typ,
              cla: cla,
              rnrsid: sid,
              typeMain: typeVal,
              user_id: session._id,
              market_type: "f",
            });

            const st2 = await UpdateBalance(session._id, cla);
            await pushExposure(req, res, sid, cla, "20 20 teenpatti");
            if (st2) {
              await UserLogs.create({
                page: "livebet_teenpatti_20",
                linkid: betHistory._id,
                ptrans: cla,
                otrans: "",
                points: st.bz_balance + cla,
                obal: st.opin_bal,
                uname: uid,
                date: new Date(),
                ptype: "bet",
              });
              await Notifications.create({
                evt_id: "Live 20 20 teenpatti",
                user_id: session._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Live 20 20 teenpatti casino games.`,
              });
              result.status = true;
              result.message = "Bet Place Successfully.";
              return result;
            } else {
              result.status = false;
              result.message = "Bet error while placing bet";
              return result;
            }
          } else {
            result.status = false;
            result.message = "Bet error while placing bet";
            return result;
          }
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
  } else {
    result.status = false;
    result.message = "Some parameters missing. Please try again.";
    return result;
  }
}
async function placeT20GameBetMultiple(req, session) {
  const userRole = session.user_role;
  const userId = session._id;
  let result = {};

  if (userRole != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  const betPlaceArr = req.body.betPlaceArr;
  let placeBetSuccess = 0;
  let message = "";

  if (Array.isArray(betPlaceArr) && betPlaceArr.length > 0) {
    for (const bets of betPlaceArr) {
      const marketType = bets.market_type;
      if (marketType === "m" || marketType === "f") {
        // Assuming placeBetT20 returns a promise and result object with status/message
        const val = await placeBetT20(session, bets);
        placeBetSuccess = val.status;
        message = val.message;
      }
    }
    if (placeBetSuccess === 1) {
      result.status = true;
      result.message = "Bet Place Successfully.";
      return result;
    } else {
      result.status = false;
      result.message = message;
      return result;
    }
  } else {
    result.status = false;
    result.message = "Some information is missing to place this bet.";
    return result;
  }
}

module.exports = placeT20GameBetMultiple;
