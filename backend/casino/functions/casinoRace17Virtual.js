const mongoose = require("mongoose");
const BzBetRatesRace17Virtual = require("../models/BzBetRatesRace17Virtual");
const BzUserBetTpRace17VirtualHistory = require("../models/BzUserBetTpRace17VirtualHistory");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzUserBetTpRace17Virtual = require("../models/BzUserBetTpRace17Virtual");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeBet(req) {
  const user_id = req.user._id;

  if (req.user._id !== 8) {
    return {
      status: false,
      message: "Betting Not allowed!!!",
    };
  }

  const eid = req.body.catmid; // catmid = 18.220808091932
  const mnam = req.body.teamname; // teamname
  const rnr = req.body.bettype; // b = back, l = lay
  const rat = req.body.odds;
  const amt = req.body.amount; // amount

  const currency = req.user.currency;

  let min_amount, maxWinning;
  if (currency === 1) {
    /// 1=INR,2=PKR,3=AED,4= BDT
    min_amount = 100;
    maxWinning = 10000;
  } else if (currency === 2) {
    min_amount = 100;
    maxWinning = 100000;
  } else if (currency === 3) {
    min_amount = 2;
    maxWinning = 1000;
  } else if (currency === 4) {
    min_amount = 500;
    maxWinning = 100000;
  }
  limit_bet = await BetLimit.findOne({ user_id: user_id }).select("casino");
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
    rat !== "SUSPENDED" &&
    amt &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    mid = eid;
    typ = rnr;
    rnr = rat;
    rat = amt;

    marketVal = req.body.marketVal;
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

    uid = req.user.uname;
    upt = req.user.point;

    //$sid = bz_form_value($_POST['mid']);
    mnam = mnam.toLowerCase();

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

    if (mnam == "race to 17") {
      if (typ == "b") {
        rnr = "b1";
        sid = eid + "-1";
      }
      if (typ == "l") {
        rnr = "l1";
        sid = eid + "-2";
      }
    } else if (mnam == "any zero card") {
      if (typ == "b") {
        rnr = "b2";
        sid = eid + "-3";
      }
      if (typ == "l") {
        rnr = "l2";
        sid = eid + "-4";
      }
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    const qdr = await BzBetRatesRace17Virtual.findOne({
      evt_status: "OPEN",
      cat_mid: mid,
      evt_od: { $lt: new Date() },
    }).lean();

    if (qdr) {
      const difftm = Math.floor((new Date() - qdr.evt_od) / 1000); // Calculate time difference in seconds
      qdr.difftm = difftm;

      stld = qdr.stld;
      match_status = qdr.evt_status;
      //pending = qdr.pending;
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

    const dr = await AdmBetStart.findOne({ sno: "1" }).lean();
    const isBettingEnable = dr.virtual_race17;

    if (isBettingEnable == false) {
      result.status = false;
      result.message = "Betting not open for Race To 17.";
      return result;
    }

    // If event creation time is greater then 56 then stop the event betting.
    if (timeLeft > 27) {
      result.status = false;
      result.message = "Round closed. Bet not placed";
      return result;
    }

    if (
      (sid == cat_sid1 && rnr == "b1") ||
      (sid == cat_sid2 && rnr == "l1") ||
      (sid == cat_sid3 && rnr == "b2") ||
      (sid == cat_sid4 && rnr == "l2")
    ) {
    } else {
      result.status = false;
      result.message = "Type not valid.";
      return result;
    }

    if (
      ($rnr == "b1" && [1.84].includes(rat)) ||
      ($rnr == "l1" && [1.88].includes(rat)) ||
      ($rnr == "b2" && [1.3].includes(rat)) ||
      ($rnr == "l2" && [1.34].includes(rat))
    ) {
    } else {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }

    if (String(match_status).trim().toUpperCase() != "OPEN" || stld == 1) {
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
      let return_array = {};
      return_array.game_name = "race17";
      return_array.result = false;
      let json_array = JSON.stringify(return_array);

      let jsonds = await BzBetRatesRace17Virtual.findOne({
        cat_mid: eid,
      }).lean();

      if (jsonds.length >= 1) {
        let levt_id = jsonds.cat_mid;
        let lcat_mid = levt_id;
        let lcat_sid1 = lcat_mid + "-1";
        let lcat_sid2 = lcat_mid + "-2";
        let lcat_sid3 = lcat_mid + "-3";
        let lcat_sid4 = lcat_mid + "-4";

        let lcat_rnr1_status = jsonds.evt_status;
        let lcat_rnr2_status = jsonds.evt_status;

        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          if (
            (lcat_sid1 == sid || lcat_sid2 == sid) &&
            lcat_rnr1_status == "OPEN"
          ) {
            if (typ == "b") {
              liverate = jsonds.b1;
            } else if (typ == "l") {
              liverate = jsonds.l1;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (
            (lcat_sid3 == sid || lcat_sid4 == sid) &&
            lcat_rnr2_status == "OPEN"
          ) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = jsonds.l2;
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
          pro = Math.round(rat * amt - amt);
          lib = amt;
          if (marketVal == 1) {
            if (rnr == "b1") {
              ta += pro;
              tb -= lib;
            }
          } else if (marketVal == 2) {
            if (rnr == "b2") {
              ta += pro;
              tb -= lib;
            }
          }
        } else {
          ratok = 0;
        }
      } else if (typ == "l") {
        if (rat >= liverate && liverate > 0 && liverate) {
          ratok = 1;
          pro = amt;
          lib = Math.round(rat * amt - amt);
          if (marketVal == 1) {
            if (rnr == "l1") {
              ta -= lib;
              tb += pro;
            }
          } else if (marketVal == 2) {
            if (rnr == "l2") {
              ta -= lib;
              tb += pro;
            }
          }
        } else {
          ratok = 0;
        }
      }

      if (ratok == 1) {
        try {
          pointok = 0;

          const drstc = await BzUserBetTpRace17Virtual.findOne({
            cat_mid: mid,
            uname: uid,
            market_type: marketVal,
          }).lean();

          if (drstc) {
            const drstc = drstc;
            limit = 0;

            limita = drstc.lockamt + drstc.rnr1s + dr[0].bz_balance;
            limitb = drstc.lockamt + drstc.rnr2s + dr[0].bz_balance;

            if (rnr == "b1") {
              limit = limitb;
            }
            if (rnr == "b2") {
              limit = limitb;
            }

            if (rnr == "l1") {
              limit = limita;
            }
            if (rnr == "l2") {
              limit = limita;
            }

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
                await BzUserBetTpRace17Virtual.updateOne(
                  {
                    cat_mid: mid,
                    user_id: req.user._id,
                    market_type: marketVal,
                  },
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
              } else pointok = 2;
            } else pointok = 0;
          } else {
            if (lib <= dr.bz_balance) {
              const drsts = await BzBetRatesRace17Virtual.find({
                cat_mid: mid,
              }).lean();
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
                  name1 = "";
                  name2 = "";

                  sidVal1 = "";
                  sidVal2 = "";
                  if (marketVal == 1) {
                    name1 = drsts[0].cat_rnr1;
                    name2 = drsts[0].cat_rnr2;

                    sidVal1 = lcat_mid + "-1";
                    sidVal2 = lcat_mid + "-2";
                  } else if (marketVal == 2) {
                    name1 = drsts[0].cat_rnr3;
                    name2 = drsts[0].cat_rnr4;

                    sidVal1 = lcat_mid + "-3";
                    sidVal2 = lcat_mid + "-4";
                  }

                  await BzUserBetTpRace17Virtual.create({
                    cat_mid: mid,
                    uname: uid,
                    rnr1: name1,
                    rnr1s: ta,
                    rnr2: name2,
                    rnr2s: tb,
                    lockamt: cla2,
                    rnr1sid: sidVal1,
                    rnr2sid: sidVal2,
                    market_type: marketVal,
                    user_id: user_id,
                  });
                  //echo $this->db->last_query();
                  pointok = 1;
                } else pointok = 3;
              } else pointok = 2;
            } else {
              pointok = 0;
            }
          }

          if (pointok == 1) {
            ///
            await BzBetRatesRace17Virtual.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: "1" } }
            );

            const betHistory = new BzUserBetTpRace17VirtualHistory({
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

            const st2 = await UpdateBalance(req.user._id, cla);
            await pushExposure(req, res, sid, cla, "Live Race 17");

            if (st2) {
              balance_point = dr.bz_balance + cla;

              const dt = new Date().toISOString();

              claVal = dr.bz_balance + cla;

              //New Logs
              await UserLogs.create({
                page: "livebet_race17",
                linkid: betHistory._id,
                ptrans: cla,
                otrans: "",
                points: claVal,
                obal: dr[0]["opin_bal"],
                uname: uid,
                date: dt,
                ptype: "bet",
              });

              await Notifications.create({
                evt_id: "Live Race 17",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Live Race 17 casino games.`,
              });

              result.status = true;
              result.message = "Bet Place Successfully.";
              return result;
            } else {
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
    return {
      status: false,
      message: "Something went wrong.Try again to palce bet.",
    };
  }
}

module.exports = { placeBet };
