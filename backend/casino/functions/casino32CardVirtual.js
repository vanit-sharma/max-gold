const mongoose = require("mongoose");
const BzBetRates32cardsVirtual = require("../models/BzBetRates32cardsVirtual");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzUserBetTp32cardsVirtual = require("../models/BzUserBetTp32cardsVirtual");
const BzUserBetTp32cardsVirtualHistory = require("../models/BzUserBetTp32cardsVirtualHistory");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function place32CardBet(req) {
  let user_id = req.user.user_id;
  let result = {};
  if (req.user.user_role != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  let eid = req.body.catmid; // catmid = 18.220808091932

  let mnam = req.body.teamname; // teamname
  let rnr = req.body.bettype; //b =back , l= lay
  let rat = req.body.odds;
  let amt = req.body.amount; // amount

  let currency = req.user.currency;

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
  let limit_bet = await BetLimit.findOne({ user_id: user_id }).select("casino");
  //$max_expouser = 600;

  if (amt > limit_bet) {
    result.status = false;
    result.message = "Bet Limit is min " + min_amount + " and max " + limit_bet;
    return result;
  }

  if (amt < min_amount) {
    result.status = false;
    result.message = "Bet Limit is min " + min_amount + " and max " + limit_bet;
    return result;
  }

  if (
    eid &&
    mnam &&
    rnr &&
    rat &&
    rat > 0 &&
    rat != "SUSPENDED" &&
    amt &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    let mid = req.body.catmid; // catmid = 18.220808091932
    let typ = req.body.bettype; //b =back , l= lay
    let rnr = req.body.bettype;
    let rat = req.body.odds;
    let amt = req.body.amount;

    if (amt > limit_bet) {
      result.status = false;
      result.message =
        "Bet Limit is min " + min_amount + " and max " + limit_bet;
      return result;
    }

    if (amt < min_amount) {
      result.status = false;
      result.message =
        "Bet Limit is min " + min_amount + " and max " + limit_bet;
      return result;
    }

    let uid = req.user.userdata.uname;
    let upt = req.user.userdata.point;

    //$sid = bz_form_value($_POST['mid']);
    let mnam = String(mnam).trim().toLowerCase();
    if (mnam.length > 35) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

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

    if (mnam == "player 8") {
      if (typ == "b") {
        rnr = "b1";
      }
      if (typ == "l") {
        rnr = "l1";
      }
      sid = eid + "-1";
    } else if (mnam == "player 9") {
      if (typ == "b") {
        rnr = "b2";
      }
      if (typ == "l") {
        rnr = "l2";
      }
      sid = eid + "-2";
    } else if (mnam == "player 10") {
      if (typ == "b") {
        rnr = "b3";
      }
      if (typ == "l") {
        rnr = "l3";
      }
      sid = eid + "-3";
    } else if (mnam == "player 11") {
      if (typ == "b") {
        rnr = "b4";
      }
      if (typ == "l") {
        rnr = "l4";
      }
      sid = eid + "-4";
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    let qdr = await BzBetRates32cardsVirtual.findOne({
      evt_status: "OPEN",
      cat_mid: mid,
      evt_od: { $lt: new Date() },
    }).lean();

    if (qdr) {
      qdr.difftm = Math.floor((new Date() - new Date(qdr.evt_od)) / 1000);
    }

    if (qdr) {
      let stld = qdr.stld;
      let match_status = qdr.evt_status;
      //$pending = $qdr[0]['pending'];
      let evt_id = qdr.cat_mid;
      let cat_sid1 = qdr.cat_sid1;
      let cat_sid2 = qdr.cat_sid2;
      let cat_sid3 = qdr.cat_sid3;
      let cat_sid4 = qdr.cat_sid4;
      let timeLeft = qdr.difftm;
    } else {
      result.status = false;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    isBettingEnable = false;
    let ds = await AdmBetStart.findOne({ sno: 1 }).lean();
    let isBettingEnable = ds?.virtual_card32;

    if (!isBettingEnable) {
      result.status = false;
      result.message = "Betting not open for Card 32.";
      return result;
    }

    // If event creation time is greater then 56 then stop the event betting.
    if (timeLeft > 27) {
      result.status = false;
      result.message = "Round closed. Bet not placed";
      return result;
    }

    if (
      (sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
      (sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
      (sid == cat_sid3 && (rnr == "l3" || rnr == "b3")) ||
      (sid == cat_sid4 && (rnr == "l4" || rnr == "b4"))
    ) {
    } else {
      result.status = false;
      result.message = "Type not valid.";
      return result;
    }

    if (
      (rnr === "b1" && [12.2, 1.97, 2.93, 3.9].includes(rat)) ||
      (rnr === "b2" && [5.95, 1.97, 2.93, 3.9].includes(rat)) ||
      (rnr === "b3" && [3.2, 1.97, 2.93, 3.9].includes(rat)) ||
      (rnr === "b4" && [2.08, 1.97, 2.93, 3.9].includes(rat)) ||
      (rnr === "l1" && [13.7, 3.07, 4.1].includes(rat)) ||
      (rnr === "l2" && [6.45, 3.07, 4.1].includes(rat)) ||
      (rnr === "l3" && [3.45, 3.07, 4.1].includes(rat)) ||
      (rnr === "l4" && [2.18, 3.07, 4.1].includes(rat))
    ) {
      // Valid odds
    } else {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }

    if (String(match_status).trim() != "OPEN" || stld == 1) {
      result.status = false;
      result.message = "Round status not open";
      return result;
    }

    let dr = await Punter.aggregate([
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

    if (dr && dr.logon == 1) {
      let return_array = {};
      return_array["game_name"] = "32cards";
      return_array["result"] = false;
      let json_array = JSON.stringify(return_array);
      let jsonds = await BzBetRates32cardsVirtual.findOne({
        cat_mid: eid,
      }).lean();

      if ($jsonds) {
        levt_id = jsonds.cat_mid;
        lcat_mid = levt_id;
        lcat_sid1 = lcat_mid + "-1";
        lcat_sid2 = lcat_mid + "-2";
        lcat_sid3 = lcat_mid + "-3";
        lcat_sid4 = lcat_mid + "-4";

        lcat_rnr1_status = jsonds.evt_status;
        lcat_rnr2_status = jsonds.evt_status;
        lcat_rnr3_status = jsonds.evt_status;
        lcat_rnr4_status = jsonds.evt_status;

        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          if (lcat_sid1 == sid && lcat_rnr1_status == "OPEN") {
            if (typ == "b") {
              liverate = jsonds.b1;
            } else if (typ == "l") {
              liverate = jsonds.l1;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid2 == sid && lcat_rnr2_status == "OPEN") {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = jsonds.l2;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid3 == sid && lcat_rnr3_status == "OPEN") {
            if (typ == "b") {
              liverate = jsonds.b3;
            } else if (typ == "l") {
              liverate = jsonds.l3;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid4 == sid && lcat_rnr4_status == "OPEN") {
            if (typ == "b") {
              liverate = jsonds.b4;
            } else if (typ == "l") {
              liverate = jsonds.l4;
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
      }

      ta = 0;
      tb = 0;
      tc = 0;
      td = 0;

      if (typ == "b") {
        if (rat <= liverate && liverate > 0 && liverate) {
          ratok = 1;
          pro = Math.round(rat * amt - amt);
          lib = amt;
          if (rnr == "b1") {
            ta += pro;
            tb -= lib;
            tc -= lib;
            td -= lib;
          }
          if (rnr == "b2") {
            ta -= lib;
            tb += pro;
            tc -= lib;
            td -= lib;
          }
          if (rnr == "b3") {
            ta -= lib;
            tb -= lib;
            tc += pro;
            td -= lib;
          }
          if (rnr == "b4") {
            ta -= lib;
            tb -= lib;
            tc -= lib;
            td += pro;
          }
        } else {
          ratok = 0;
        }
      } else if (typ == "l") {
        if (rat >= liverate && liverate > 0 && !empty(liverate)) {
          ratok = 1;
          pro = amt;
          lib = Math.round(rat * amt - amt, 2);
          if (rnr == "l1") {
            ta -= lib;
            tb += pro;
            tc += pro;
            td += pro;
          }
          if (rnr == "l2") {
            ta += pro;
            tb -= lib;
            tc += pro;
            td += pro;
          }
          if (rnr == "l3") {
            ta += pro;
            tb += pro;
            tc -= lib;
            td += pro;
          }
          if (rnr == "l4") {
            ta += pro;
            tb += pro;
            tc += pro;
            td -= lib;
          }
        } else {
          ratok = 0;
        }
      }

      if (ratok == 1) {
        try {
          pointok = 0;

          let drstc = await BzUserBetTp32cardsVirtual.findOne({
            cat_mid: mid,
            uname: uid,
          });
          if (drstc) {
            limit = 0;

            limita = drstc.lockamt + drstc.rnr1s + drstc.bz_balance;
            limitb = drstc.lockamt + drstc.rnr2s + drstc.bz_balance;
            limitc = drstc.lockamt + drstc.rnr3s + drstc.bz_balance;
            limitd = drstc.lockamt + drstc.rnr4s + drstc.bz_balance;

            if (rnr == "b1") {
              limit = Math.min(limitb, limitc, limitd);
            }
            if (rnr == "b2") {
              limit = Math.min(limita, limitc, limitd);
            }
            if (rnr == "b3") {
              limit = Math.min(limitb, limita, limitd);
            }
            if (rnr == "b4") {
              limit = Math.min(limitb, limitc, limita);
            }

            if (rnr == "l1") {
              limit = limita;
            }
            if (rnr == "l2") {
              limit = limitb;
            }
            if (rnr == "l3") {
              limit = limitc;
            }
            if (rnr == "l4") {
              limit = limitd;
            }

            if (lib <= limit) {
              //update bt_match_teenpatti
              pla = drstc.lockamt;
              nla1 = drstc.rnr1s + ta;
              nla2 = drstc.rnr2s + tb;
              nla3 = drstc.rnr3s + tc;
              nla4 = drstc.rnr4s + td;

              if (Math.min(nla1, nla2, nla3, nla4) < 0)
                nla = Math.abs(Math.min(nla1, nla2, nla3, nla4));
              else nla = 0;

              cla = pla - nla;
              pointok = 1;

              maxPL = Math.max(nla1, nla2, nla3, nla4);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - cla >= 0) {
                /*if($nla <= $max_expouser)
		    							{*/
                await BzUserBetTp32cardsVirtual.updateOne(
                  { cat_mid: mid, uname: uid },
                  {
                    $inc: {
                      rnr1s: ta,
                      rnr2s: tb,
                      rnr3s: tc,
                      rnr4s: td,
                    },
                    $set: {
                      lockamt: nla,
                    },
                  }
                );
                /*}
		    							else
		    							    $pointok = 3;*/
              } else pointok = 2;
            } else pointok = 0;
          } else {
            if (lib <= dr.bz_balance) {
              let drsts = await BzBetRates32cardsVirtual.find({
                cat_mid: mid,
              }).lean();
              cla = -lib;
              nla = cla2 = lib;

              maxPL = Math.max(ta, tb, tc, td);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - cla >= 0) {
                pla = 0;
                if (cla2 <= limit_bet) {
                  sti = await BzUserBetTp32cardsVirtual.create({
                    cat_mid: mid,
                    uname: uid,
                    rnr1: drsts[0].cat_rnr1,
                    rnr1s: ta,
                    rnr2: drsts[0].cat_rnr2,
                    rnr2s: tb,
                    rnr3: drsts[0].cat_rnr3,
                    rnr3s: tc,
                    rnr4: drsts[0].cat_rnr4,
                    rnr4s: td,
                    lockamt: cla2,
                    rnr1sid: drsts[0].cat_sid1,
                    rnr2sid: drsts[0].cat_sid2,
                    rnr3sid: drsts[0].cat_sid3,
                    rnr4sid: drsts[0].cat_sid4,
                    user_id: user_id,
                  });
                  pointok = 1;
                } else pointok = 3;
              } else pointok = 2;
            } else {
              pointok = 0;
            }
          }

          if ($pointok == 1) {
            ///
            await BzBetRates32cardsVirtual.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: "1" } }
            );

            const betHistory = new BzUserBetTp32cardsVirtualHistory({
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
              user_id: user_id,
            });
            await betHistory.save();

            const updateBalanceResult = await UpdateBalance(req.user._id, cla);
            await pushExposure(req, res, sid, cla, "Live 32 cards");

            if (updateBalanceResult) {
              balance_point = dr.bz_balance + cla;

              const dt = new Date().toISOString();

              claVal = dr.bz_balance + cla;

              //New Logs
              const userLog = new UserLogs({
                page: "livebet_32cards",
                linkid: betHistory._id,
                ptrans: cla,
                otrans: "",
                points: updateBalanceResult.newBalance,
                obal: dr[0].opin_bal,
                uname: uid,
                date: new Date(),
                ptype: "bet",
              });
              await userLog.save();

              //echo "BET_OK,$balance_point";

              const notificationData = {
                evt_id: "Live 32 cards",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Live 32 Cards casino games.`,
              };
              await Notifications.create(notificationData);

              result.status = true;
              result.message = "Bet placed successfully.";
              //$result['message'] = "Your bet has been placed successfully.";
              return $result;
            } else {
              //$db->rollBack();
              result.status = false;
              result.message = "Bet error while placing bet";
              return result;
            }
          } else if (pointok == 2) {
            result.status = false;
            result.message = "Insufficient balance for placing this bet.";
            return result;
          } else if (pointok == 3) {
            result.status = false;
            result.message = "Insufficient balance for placing this bet.";
            return result;
          } else {
            result.status = false;
            result.message = "Insufficient balance for placing this bet.";
            return result;
          }
        } catch (error) {
          //$db->rollBack();
          result.status = false;
          result.message = "Bet Roll back.";
          return result;
        }
      } else {
        result.status = false;
        result.message = "Live Rate Not Matched.";
        return result;
      }
    } else {
      result.status = false;
      result.message = "It's showing you are not login to place this bet";
      return result;
    }
  } else {
    return {
      status: false,
      message: "Something went wrong.Try again to palce bet.",
    };
  }
}

module.exports = { place32CardBet };
