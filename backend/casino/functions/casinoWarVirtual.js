const mongoose = require("mongoose");
const BzBetRatesCasinowarVirtual = require("../models/BzBetRatesCasinowarVirtual");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const btMatchHiloGalaxy = require("../models/btMatchHiloGalaxy");
const BzUserBetTpCasinowarVirtualHistory = require("../models/BzUserBetTpCasinowarVirtualHistory");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeBet(req) {
  let user_id = req.user._id;
  let result = {};

  if (req.user.user_role != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return $result;
  }

  let eid = req.body.catmid; // catmid = 18.220808091932
  let mnam = req.body.teamname; // teamname
  let rnr = req.body.bettype; //b =back , l= lay
  let rat = req.body.odds;
  let amt = req.body.amount; // amount

  let currency = req.user.currency; // 1=INR,2=PKR,3=AED,4= BDT

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
  let betLimit = await BetLimit.findOne({ user_id: user_id }).select(
    "casino"
  );
  let limit_bet = betLimit.casino;

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
    rat !== "SUSPENDED" &&
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

    let uid = req.user.uname;
    let upt = req.user.point;
    mnam = mnam.trim().toLowerCase();

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
    rnr_val = 0;

    if (mnam == "player 1") {
      if (typ == "b") {
        rnr = "b1";
      }
      if (typ == "l") {
        rnr = "l1";
      }
      sid = eid + "-1";
      rnr_val = 1;
    } else if (mnam == "player 2") {
      if (typ == "b") {
        rnr = "b2";
      }
      if (typ == "l") {
        rnr = "l2";
      }
      sid = eid + "-2";
      rnr_val = 2;
    } else if (mnam == "player 3") {
      if (typ == "b") {
        rnr = "b3";
      }
      if (typ == "l") {
        rnr = "l3";
      }
      sid = eid + "-3";
      rnr_val = 3;
    } else if (mnam == "player 4") {
      if (typ == "b") {
        rnr = "b4";
      }
      if (typ == "l") {
        rnr = "l4";
      }
      sid = eid + "-4";
      rnr_val = 4;
    } else if (mnam == "player 5") {
      if (typ == "b") {
        rnr = "b5";
      }
      if (typ == "l") {
        rnr = "l5";
      }
      sid = eid + "-5";
      rnr_val = 5;
    } else if (mnam == "player 6") {
      if (typ == "b") {
        rnr = "b6";
      }
      if (typ == "l") {
        rnr = "l6";
      }
      sid = eid + "-6";
      rnr_val = 6;
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    let qdr = await BzBetRatesCasinowarVirtual.findOne({
      evt_status: "OPEN",
      cat_mid: mid,
      evt_od: { $lt: new Date() },
    }).lean();

    if (qdr) {
      let timeDiff = Math.abs(new Date() - new Date(qdr.evt_od)) / 1000; // Calculate time difference in seconds
      qdr.difftm = timeDiff;
    }

    if (qdr) {
      stld = qdr.stld;
      $match_status = $qdr.evt_status;
      //$pending = $qdr.pending;
      $evt_id = $qdr.cat_mid;
      $cat_sid1 = $qdr.cat_sid1;
      $cat_sid2 = $qdr.cat_sid2;
      $cat_sid3 = $qdr.cat_sid3;
      $cat_sid4 = $qdr.cat_sid4;
      $cat_sid5 = $qdr.cat_sid5;
      $cat_sid6 = $qdr.cat_sid6;
      $timeLeft = $qdr.difftm;
    } else {
      result.status = false;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    isBettingEnable = false;
    let dr = await AdmBetStart.findOne({ sno: 1 });

    isBettingEnable = dr.virtual_casinowar;

    if (isBettingEnable == false) {
      result.status = false;
      result.message = "Betting not open for Casino War.";
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
      (sid == cat_sid4 && (rnr == "l4" || rnr == "b4")) ||
      (sid == cat_sid5 && (rnr == "l5" || rnr == "b5")) ||
      (sid == cat_sid6 && (rnr == "l6" || rnr == "b6"))
    ) {
    } else {
      result.status = false;
      result.message = "Type not valid.";
      return result;
    }

    if (
      (rnr === "b1" && [1.98].includes(rat)) ||
      (rnr === "b2" && [1.98].includes(rat)) ||
      (rnr === "b3" && [1.98].includes(rat)) ||
      (rnr === "b4" && [1.98].includes(rat)) ||
      (rnr === "b5" && [1.98].includes(rat)) ||
      (rnr === "b6" && [1.98].includes(rat))
    ) {
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
      return_array = {};

      return_array.game_name = "casinowar";
      return_array["result"] = false;
      let json_array = JSON.stringify(return_array);
      let jsonds = await BzBetRatesCasinowarVirtual.findOne({
        cat_mid: eid,
      }).lean();

      if (jsonds.length) {
        levt_id = jsonds.cat_mid;
        lcat_mid = levt_id;
        lcat_sid1 = lcat_mid + "-1";
        lcat_sid2 = lcat_mid + "-2";
        lcat_sid3 = lcat_mid + "-3";
        lcat_sid4 = lcat_mid + "-4";
        lcat_sid5 = lcat_mid + "-5";
        lcat_sid6 = lcat_mid + "-6";

        lcat_rnr1_status = jsonds.evt_status;
        lcat_rnr2_status = jsonds.evt_status;
        lcat_rnr3_status = jsonds.evt_status;
        lcat_rnr4_status = jsonds.evt_status;
        lcat_rnr5_status = jsonds.evt_status;
        lcat_rnr6_status = jsonds.evt_status;

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
          } else if (lcat_sid5 == sid && lcat_rnr5_status == "OPEN") {
            if (typ == "b") {
              liverate = jsonds.b5;
            } else if (typ == "l") {
              liverate = jsonds.l5;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid6 == sid && lcat_rnr6_status == "OPEN") {
            if (typ == "b") {
              liverate = jsonds.b6;
            } else if (typ == "l") {
              liverate = jsonds.l6;
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
      te = 0;
      tf = 0;

      if (typ == "b") {
        if (rat <= liverate && liverate > 0 && liverate) {
          ratok = 1;
          pro = Math.round(rat * amt - amt, 2);
          lib = amt;
          if (rnr == "b1") {
            ta += pro;
            tb -= lib;
            tc -= lib;
            td -= lib;
            te -= lib;
            tf -= lib;
          }
          if (rnr == "b2") {
            ta -= lib;
            tb += pro;
            tc -= lib;
            td -= lib;
            te -= lib;
            tf -= lib;
          }
          if (rnr == "b3") {
            ta -= lib;
            tb -= lib;
            tc += pro;
            td -= lib;
            te -= lib;
            tf -= lib;
          }
          if (rnr == "b4") {
            ta -= lib;
            tb -= lib;
            tc -= lib;
            td += pro;
            te -= lib;
            tf -= lib;
          }
          if (rnr == "b5") {
            ta -= lib;
            tb -= lib;
            tc -= lib;
            td -= pro;
            te += lib;
            tf -= lib;
          }
          if (rnr == "b6") {
            ta -= lib;
            tb -= lib;
            tc -= lib;
            td -= pro;
            te -= lib;
            tf += lib;
          }
        } else {
          ratok = 0;
        }
      } else if (typ == "l") {
        if (rat >= liverate && liverate > 0 && liverate) {
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
          cla = -amt;

          if (amt <= $dr.bz_balance) {
            pointok = 1;
          }
          ///
          if (pointok == 1) {
            ///
            await BzBetRatesCasinowarVirtual.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: "1" } }
            );
            ///
            maxPL = pro;
            if (maxPL > maxWinning) {
              result.status = false;
              result.message = "Max Winning Limit " + maxWinning;
              return result;
              exit;
            }

            let st = await BzUserBetTpCasinowarVirtualHistory.create({
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
              rnr_val: rnr_val,
              user_id: req.user._id,
            });

            let bet_id = st._id;

            let st2 = await UpdateBalance(req.user_id, cla);
            await pushExposure(req, res, sid, cla, "Live Casinowar");

            if (st2) {
              balance_point = dr.bz_balance + cla;

              let dt = new Date().toISOString();

              claVal = dr.bz_balance + cla;

              //New Logs
              await UserLogs.create({
                page: "livebet_casinowar",
                linkid: bet_id,
                ptrans: cla,
                otrans: "",
                points: claVal,
                obal: dr.opin_bal,
                uname: uid,
                date: dt,
                ptype: "bet",
              });

              //echo "BET_OK,$balance_point";

              let notificationsData = {
                evt_id: "Live Casinowar",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Live Casinowar casino games.`,
              };
              await Notifications.create(notificationsData);

              result.status = true;
              result.message = "Bet placed successfully.";
              return result;
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
            return $result;
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
    result.status = false;
    result.message = "Something went wrong.Try again to palce bet.";
    return result;
  }
}

module.exports = { placeBet };
