const mongoose = require("mongoose");
const BetTeenpattiT20MuflisVirtual = require("../models/BetTeenpattiT20MuflisVirtual");
const BzUserBetTp20MuflisVirtual = require("../models/BzUserBetTp20MuflisVirtual");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzUserBetTp20MuflisHistoryVirtual = require("../models/BzUserBetTp20MuflisHistoryVirtual");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeBetT20(req) {
  const currency = req.user.currency;
  const user_id = req.user._id;

  let min_amount = 0;
  let maxWinning = 0;
  let result = {};
  if (currency == 1) {
    /// 1=INR,2=PKR,3=AED,4= BDT
    min_amount = 100;
    maxWinning = 10000;
  } else if (currency == 2) {
    min_amount = 100;
    maxWinning = 100000;
  } else if (currency == 3) {
    min_amount = 2;
    maxWinning = 1000;
  } else if (currency == 4) {
    min_amount = 500;
    maxWinning = 100000;
  }

  const limitBet = await BetLimit.findOne({ user_id: user_id })
    .select("casino")
    .lean();
  const limit_bet = limitBet.casino;

  let eid = req.body.catmid; // catmid = 18.220808091932
  let mnam = req.body.teamname; // teamname
  let rnr = req.body.bettype; // b = back, l = lay
  let rat = req.body.odds;
  let amt = req.body.amount; // amount

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

  if (req.user.user_role != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  if (
    eid &&
    mnam &&
    rnr &&
    rat > 0 &&
    rat != "SUSPENDED" &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    mid = req.body.catmid;
    typ = req.body.bettype;
    rnr = req.body.bettype;
    rat = req.body.odds;
    amt = req.body.amount;

    uid = req.user.username;
    upt = req.user.points;
    uss = req.sessionID;
    //sid = req.body.mid;
    mnam = req.body.teamname.toLowerCase();
    userId = req.user._id;

    if (mnam.length > 35) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    // if (sid.length > 20) {
    //   result.status = false;
    //   result.message = "Runner name not valid";
    //   return result;
    // }

    if (rat.length < 5) {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }

    if (rat > 50) {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }

    if (rnr.length > 20) {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }

    if (mid.length > 40) {
      result.status = false;
      result.message = "Mid not valid";
      return result;
    }

    if (typ.length > 10) {
      result.status = false;
      result.message = "Type not valid";
      return $result;
    }

    typeVal = 1;
    if (mnam == "player a") {
      if (typ == "b") {
        rnr = "b1";
      }
      if (typ == "l") {
        rnr = "l1";
      }
      sid = eid + "-1";
    } else if (mnam == "player b") {
      if (typ == "b") {
        rnr = "b2";
      }
      if (typ == "l") {
        rnr = "l2";
      }
      sid = eid + "-2";
    } else if (mnam == "player a plus") {
      if (typ == "b") {
        rnr = "pairA";
      }

      sid = eid + "-3";
      typeVal = 2;
    } else if (mnam == "player b plus") {
      if (typ == "b") {
        rnr = "pairB";
      }

      sid = eid + "-4";
      typeVal = 2;
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    const qdr = await BetTeenpattiT20MuflisVirtual.findOne({
      cat_mid: mid,
      evt_od: { $lt: new Date() },
    }).lean();

    if (qdr) {
      let timeDiff = Math.abs(new Date() - new Date(qdr.evt_od)) / 1000; // Calculate time difference in seconds
      qdr.difftm = timeDiff;
      stld = qdr.stld;
      match_status = qdr.evt_status;
      evt_id = qdr.cat_mid;
      cat_sid1 = qdr.cat_sid1;
      cat_sid2 = qdr.cat_sid2;
      cat_sid3 = qdr.cat_sid3;
      cat_sid4 = qdr.cat_sid4;
      timeLeft = qdr.difftm;
    } else {
      result.status = false;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    let isBettingEnable = false;

    const admBetStart = await AdmBetStart.findOne({ sno: 1 }).lean();
    isBettingEnable = admBetStart.virtual_tp20muflis;

    if (!isBettingEnable) {
      result.status = false;
      result.message = "Betting not open for this casino.";
      return result;
    }

    // If event creation time is greater then 28 then stop the event betting.
    if (timeLeft > 28) {
      result.status = false;
      result.message = "Bet not placed. Time is up!!";
      return result;
    }

    if (
      (sid === cat_sid1 && (rnr === "l1" || rnr === "b1")) ||
      (sid === cat_sid2 && (rnr === "l2" || rnr === "b2")) ||
      (sid === cat_sid3 && rnr === "pairA") ||
      (sid === cat_sid4 && rnr === "pairB")
    ) {
    } else {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }

    if (match_status.trim() !== "OPEN" || stld === 1) {
      result.status = false;
      result.message = "Status not open";
      return result;
    }

    dr = await Punter.aggregate([
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

    if (dr && dr.logon == 1) {
      const returnArray = {};
      returnArray.game_name = "t20";
      returnArray.result = false;
      const jsonArray = JSON.stringify(returnArray);
      let jsonds = await BetTeenpattiT20MuflisVirtual.findOne({
        cat_mid: eid,
      }).lean();

      if (jsonds) {
        //$lcat_mid = ($jsonds['data']['t1'][0]['mid'] + 1.99);
        let evt_id = jsonds.cat_mid;
        let lcat_mid = evt_id;
        let lcat_sid1 = lcat_mid + "-1";
        let lcat_sid2 = lcat_mid + "-2";
        let lcat_sid3 = lcat_mid + "-3";
        let lcat_sid4 = lcat_mid + "-4";

        //echo $lcat_mid.' == '.$evt_id;
        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          if (lcat_sid1 == sid) {
            if (typ == "b") {
              liverate = jsonds.b1;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid2 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid3 == sid) {
            if (typ == "b") {
              liverate = jsonds.pairA;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid4 == sid) {
            if (typ == "b") {
              liverate = jsonds.pairB;
            } else if (typ == "l") {
              liverate = 0;
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

      ta = 0;
      tb = 0;
      ratok = 0;

      if (typ == "b") {
        if (rat <= liverate && liverate > 0 && liverate) {
          ratok = 1;
          pro = Math.round((rat - 1) * amt);
          lib = amt;
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
        if (rat >= liverate && liverate > 0 && liverate) {
          ratok = 1;
          pro = amt;
          lib = Math.round((rat * amt) / 100);
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
        if (typeVal == 1) {
          //try {
            pointok = 0;

            const drstc = await BzUserBetTp20MuflisVirtual.findOne({
              cat_mid: mid,
              user_id: req.user._id,
              typeMain: typeVal,
            }).lean();

            if (drstc) {
              limit = 0;

              limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
              limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;

              if (rnr == "b1") limit = limitb;
              if (rnr == "b2") limit = limita;

              if (rnr == "l1") limit = limita;
              if (rnr == "l2") limit = limitb;

              if (rnr == "pairA") limit = limitb;
              if (rnr == "pairB") limit = limita;

              if (lib <= limit) {
                //update bt_match_teenpatti
                pla = drstc.lockamt;
                nla1 = drstc.rnr1s + ta;
                nla2 = drstc.rnr2s + tb;

                if (Math.min(nla1, nla2) < 0)
                  nla = Math.abs(Math.min(nla1, nla2));
                else nla = 0;

                cla = pla - nla;
                pointok = 1;

                maxPL = Math.max(nla1, nla2);
                if (maxPL > maxWinning) {
                  result.status = false;
                  result.message = "Max Winning Limit " + maxWinning;
                  return result;
                }

                if (dr.bz_balance - cla >= 0) {
                  await BzUserBetTp20MuflisVirtual.updateOne(
                    { cat_mid: mid, uname: uid, typeMain: typeVal },
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
              if (lib <= dr.bz_balance) {
                const drsts = await BetTeenpattiT20MuflisVirtual.findOne({
                  cat_mid: mid,
                }).lean();
                let rnr1Val, rnr2Val;
                if (typeVal == 1) {
                  rnr1Val = drsts.cat_rnr1;
                  rnr2Val = drsts.cat_rnr2;
                } else if (typeVal == 2) {
                  rnr1Val = drsts.cat_rnr3;
                  rnr2Val = drsts.cat_rnr4;
                }
                const cla = -lib;
                const nla = (cla2 = lib);

                const maxPL = Math.max(ta, tb);
                if (maxPL > maxWinning) {
                  result.status = false;
                  result.message = "Max Winning Limit " + maxWinning;
                  return result;
                }
                if (dr.bz_balance - cla >= 0) {
                  pla = 0;
                  if (nla <= limit_bet) {
                    await BzUserBetTp20MuflisVirtual.create({
                      cat_mid: mid,
                      uname: uid,
                      rnr1: rnr1Val,
                      rnr1s: ta,
                      rnr2: rnr2Val,
                      rnr2s: tb,
                      lockamt: cla2,
                      rnr1sid: drsts.cat_sid1,
                      rnr2sid: drsts.cat_sid2,
                      typeMain: typeVal,
                      user_id: user_id,
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

            if (pointok == 1) {
              ///
              await BetTeenpattiT20MuflisVirtual.updateOne(
                { cat_mid: mid },
                { $set: { is_bet_place: "1" } }
              );

              // Insert bet history
              const betHistory = await BzUserBetTp20MuflisHistoryVirtual.create(
                {
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
                  user_id: userId,
                }
              );
              const bet_id = betHistory._id;

              // Update balance
              const st2 = await UpdateBalance(req.user._id, cla);
              await pushExposure(req, res, sid, cla, "Live 20 20 Muflis teenpatti");

              if (st2) {
                
                
                const dt = new Date()
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19);
                

                claVal = dr.bz_balance + cla;

                //New Logs
                ///
                let maxPL = pro;
                if (maxPL > maxWinning) {
                  result.status = false;
                  result.message = "Max Winning Limit " + maxWinning;
                  return result;
                }
                ///
                // Insert user log
                await UserLogs.create({
                  page: "livebet_teenpatti_muflis_20",
                  linkid: bet_id,
                  ptrans: cla,
                  otrans: "",
                  points: claVal,
                  obal: dr.opin_bal,
                  uname: uid,
                  date: dt,
                  ptype: "bet",
                });

                // Insert notification
                await Notifications.create({
                  evt_id: "20 20 Muflis teenpatti",
                  user_id: req.user._id,
                  game_type: "6",
                  description: `${uid} placed bet on ${mnam} in 20 20 Muflis teenpatti casino games.`,
                });

                result.status = true;
                result.message = "Bet Placed.";
                return result;
              } else {
                result.status = false;
                result.message = "Error while placing bet";
                return result;
              }
            } else if (pointok == 2) {
              result.status = false;
              result.message = "Bet limit error " + pointok;
              return result;
            } else if (pointok == 3) {
              result.status = false;
              result.message = "Bet limit error " + pointok;
              return result;
            } else {
              result.status = false;
              result.message = "Insufficient funds!!";
              return result;
            }
        //   } catch (error) {
        //     //$db->rollBack();
        //     result.status = false;
        //     result.message = "Some error occurred while placing this bet.";
        //     return result;
        //   }
        } else if (typeVal == 2) {
          // pair

          pointok = 0;
          cla = -amt;
          if (amt <= dr.bz_balance) {
            pointok = 1;
          }
          if (pointok == 1) {
            ///
            // Update bet status
            await BetTeenpattiT20MuflisVirtual.updateOne(
              { cat_mid: mid },
              { $set: { is_bet_place: "1" } }
            );

            // Insert bet history
            const betHistory = await BzUserBetTp20MuflisHistoryVirtual.create({
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
              user_id: userId,
            });
            const bet_id = betHistory._id;

            // Update balance
            const st2 = await UpdateBalance(req.user._id, cla);
            await pushExposure(req, res, sid, cla, "Live 20 20 Muflis teenpatti");

            if (st2) {
              balance_point = dr.bz_balance + cla;
              //$this->session->set_userdata('point',$balance_point);
              const dt = new Date()
                .toISOString()
                .replace("T", " ")
                .substring(0, 19);

              claVal = dr.bz_balance + cla;

              //New Logs
              // Insert user log
              await UserLogs.create({
                page: "livebet_teenpatti_muflis_20",
                linkid: bet_id,
                ptrans: cla,
                otrans: "",
                points: claVal,
                obal: dr.opin_bal,
                uname: uid,
                date: dt,
                ptype: "bet",
              });

              // Insert notification
              await Notifications.create({
                evt_id: "Live 20 20 Muflis teenpatti",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Live 20 20 Muflis teenpatti casino games.`,
              });

              result.status = true;
              result.message = "Bet Place Successfully.";
              return result;
            } else {
              //$db->rollBack();
              result.status = false;
              result.message = "Bet error while placing bet";
              return result;
            }
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

module.exports = { placeBetT20 };
