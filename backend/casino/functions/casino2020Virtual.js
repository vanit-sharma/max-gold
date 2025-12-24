const mongoose = require("mongoose");
const BetTeenpattiT20Virtual = require("../models/BetTeenpattiT20Virtual");
const BzUserBetTp20HistoryVirtual = require("../models/BzUserBetTp20HistoryVirtual");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzUserBetTp20Virtual = require("../models/BzUserBetTp20Virtual");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeBetT20(req) {
    
  const currency = req.user.currency;
  const user_id = req.user._id;
  let result = {};

  let min_amount, maxWinning;

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

  const limitBetQuery = await BetLimit.findOne({ user_id: user_id });
  const limit_bet = limitBetQuery ? limitBetQuery.casino : 0;

  let eid = req.body.catmid; // catmid = 18.220808091932
  let mnam = req.body.teamname; // teamname
  let rnr = req.body.bettype; // b = back, l = lay
  let rat = req.body.odds;
  let amt = req.body.amount; // amount

  if (amt > limit_bet) {
    return {
      status: false,
      message: `min ${min_amount} and max ${limit_bet} point bet allowed`,
    };
  }

  if (amt < min_amount) {
    return {
      status: false,
      message: `min ${min_amount} and max ${limit_bet} point bet allowed`,
    };
  }

  if (req.user.user_role != 8) {
    return {
      status: false,
      message: "Betting Not allowed!!!",
    };
  }
console.log("+++++++++++++")
  if (
    eid &&
    mnam &&
    rnr &&
    rat &&
    rat > 0 &&
    rat !== "SUSPENDED" &&
    amt &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    
    let mid = req.body.catmid; // catmid = 18.220808091932
    let typ = req.body.bettype; // b = back, l = lay
    let rnr = req.body.bettype;
    let rat = req.body.odds;
    let amt = req.body.amount;

    const uid = req.user.username;
    const upt = req.user.point;
    const uss = req.sessionID;
    //const sid = req.body.mid;
    const mnam = String(req.body.teamname).trim().toLowerCase();
    const userId = req.user._id;

    if (mnam.length > 35) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }
// console.log("sid->", sid);
//     if (sid.length > 20) {
//       result.status = false;
//       result.message = "Runner name not valid";
//       return result;
//     }

    if (rat.length > 5) {
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
      return result;
    }

    let typeVal = 1;
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
console.log('mid:', mid, 'eid:', eid);
    const qdr = await BetTeenpattiT20Virtual.aggregate([
      {
        $match: {
          cat_mid: mid,
          evt_od: { $lt: new Date() },
        },
      },
      {
        $addFields: {
          difftm: {
            $divide: [
              { $subtract: [new Date(), "$evt_od"] },
              1000, // Convert milliseconds to seconds
            ],
          },
        },
      },
    ]);
    // $qds = $this->db->query("SELECT *,TIME_TO_SEC(TIMEDIFF(now(), evt_od)) as difftm FROM bet_teenpatti_t20_virtual WHERE cat_mid = '".$mid."' and evt_od<now()"); 

    if (qdr.length) {
      stld = qdr.stld;
      match_status = qdr.evt_status;
      //$pending = $qdr[0]['pending'];
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

    const ds = await AdmBetStart.findOne({ sno: "1" });
    const isBettingEnable = ds.virtual_tp20;

    if (isBettingEnable == false) {
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
console.log("Reached here--0");
console.log("cat_sid1:", cat_sid1, "cat_sid2:", cat_sid2, "cat_sid3:", cat_sid3, "cat_sid4:", cat_sid4);
console.log("sid:", sid, "rnr:", rnr);
    if (
      (sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
      (sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
      (sid == cat_sid3 && rnr == "pairA") ||
      (sid == cat_sid4 && rnr == "pairB")
    ) {
    } else {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }
console.log("Reached here--1");
    if (String(match_status).trim() != "OPEN" || stld == 1) {
      result.status = false;
      result.message = "Status not open";
      return result;
    }
console.log("Reached here--2");
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
      let return_array = {};
      return_array.game_name = "t20";
      return_array.result = false;
      json_array = JSON.stringify(return_array);
      jsonds = await BetTeenpattiT20Virtual.findOne({ cat_mid: eid }).lean();
console.log("Reached here+");
      if (jsonds) {
        //$lcat_mid = ($jsonds['data']['t1'][0]['mid'] + 1.99);
        levt_id = jsonds.cat_mid;
        lcat_mid = levt_id;
        lcat_sid1 = lcat_mid + "-1";
        lcat_sid2 = lcat_mid + "-2";
        lcat_sid3 = lcat_mid + "-3";
        lcat_sid4 = lcat_mid + "-4";

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
          lib = Math.round((rat * amt) / 100, 2);
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
          try {
            $pointok = 0;

            const drstc = await BzUserBetTp20Virtual.findOne({
              cat_mid: mid,
              user_id: req.user._id,
              typeMain: typeVal,
            });

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
                  exit;
                }

                if (dr.bz_balance - cla >= 0) {
                  /*if($nla <= $max_expouser)
										{*/

                  const updateResult = await BzUserBetTp20Virtual.updateOne(
                    { cat_mid: mid, uname: uid, typeMain: typeVal },
                    {
                      $inc: {
                        rnr1s: ta,
                        rnr2s: tb,
                      },
                      $set: {
                        lockamt: nla,
                      },
                    }
                  );
                  /*}
										else {
											$pointok = 3;
										}*/
                } else {
                  pointok = 2;
                }
              } else {
                pointok = 0;
              }
            } else {
              if (lib <= dr.bz_balance) {
                const drsts = await BetTeenpattiT20Virtual.findOne({
                  cat_mid: mid,
                }).lean();
                if ($typeVal == 1) {
                  rnr1Val = drsts.cat_rnr1;
                  rnr2Val = drsts.cat_rnr2;
                  sidVal1 = drsts.cat_sid1;
                  sidVal2 = drsts.cat_sid2;
                } else if (typeVal == 2) {
                  rnr1Val = drsts.cat_rnr3;
                  rnr2Val = drsts.cat_rnr4;
                  sidVal1 = drsts.cat_sid3;
                  sidVal2 = drsts.cat_sid4;
                }
                cla = -lib;
                nla = cla2 = lib;

                maxPL = Math.max(ta, tb);
                if (maxPL > maxWinning) {
                  result.status = false;
                  result.message = "Max Winning Limit " + maxWinning;
                  return result;
                  exit;
                }

                if (dr.bz_balance - cla >= 0) {
                  pla = 0;
                  if (cla2 <= limit_bet) {
                    sti = await BzUserBetTp20Virtual.create({
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
                      user_id: user_id,
                    });

                    pointok = 1;
                  } else pointok = 3;
                } else pointok = 2;
              } else {
                pointok = 0;
              }
            }

            if (pointok == 1) {
              ///
              await BetTeenpattiT20Virtual.updateOne(
                { evt_id: mid },
                { is_bet_place: "1" }
              );
              ///

              const betUserRec = await BzUserBetTp20HistoryVirtual.create({
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
              });
              //echo $this->db->last_query();
              const bet_id = betUserRec._id;

              st2 = await UpdateBalance(req.user._id, cla);
              await pushExposure(req, res, sid, cla, "20 20 teenpatti");

              if (st2) {
                balance_point = dr.bz_balance + cla;

                const dt = new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");

                claVal = dr.bz_balance + cla;

                //New Logs
                // Insert user logs
                await UserLogs.create({
                  page: "livebet_teenpatti_20",
                  linkid: bet_id,
                  ptrans: cla,
                  otrans: "",
                  points: claVal,
                  obal: dr.opin_bal,
                  uname: uid,
                  date: dt,
                  ptype: "bet",
                });

                // Insert notification data
                await Notifications.create({
                  evt_id: "20 20 teenpatti",
                  user_id: req.user._id,
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
          } catch (error) {
            //$db->rollBack();
            result.status = false;
            result.message = "Some error occurred while placing this bet.";
            return result;
          }
        } else if (typeVal == 2) {
          // pair
          pointok = 0;
          cla = -amt;
          if (amt <= dr[0].bz_balance) {
            pointok = 1;
          }
          if (pointok == 1) {
            ///
            await BetTeenpattiT20Virtual.updateOne(
              { evt_id: mid },
              { is_bet_place: "1" }
            );
            ///
            ///
            maxPL = pro;
            if (maxPL > maxWinning) {
              result.status = false;
              result.message = "Max Winning Limit " + maxWinning;
              return result;
              exit;
            }
            ///
            const betUserRec = await BzUserBetTp20HistoryVirtual.create({
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
            // Retrieve the inserted bet ID
            const bet_id = betUserRec._id;

            st2 = UpdateBalance(req.user._id, cla);

            if (st2) {
              balance_point = dr.bz_balance + cla;

              const dt = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

              claVal = dr.bz_balance + cla;

              //New Logs
              // Insert user logs
              await UserLogs.create({
                page: "livebet_teenpatti_20",
                linkid: bet_id,
                ptrans: cla,
                otrans: "",
                points: claVal,
                obal: dr[0].opin_bal,
                uname: uid,
                date: dt,
                ptype: "bet",
              });

              // Insert notification data
              await Notifications.create({
                evt_id: "Live 20 20 teenpatti",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Live 20 20 teenpatti casino games.`,
              });
              //$this->db->insert(NOTIFICATIONS_TABLE, $notificationsData);

              result.status = true;
              result.message = "Bet Place Successfully.";
              //$result['message'] = "Your bet has been placed successfully.";
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
