const mongoose = require("mongoose");
const BzBollywoodVirtualMatch = require("../models/BzBollywoodVirtualMatch");
const BzBollywoodVirtualRates = require("../models/BzBollywoodVirtualRates");
const BzBollywoodVirtualRatesOdd = require("../models/BzBollywoodVirtualRatesOdd");
const BzBollywoodVirtualFancyBet = require("../models/BzBollywoodVirtualFancyBet");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzBollywoodVirtualBetHistory = require("../models/BzBollywoodVirtualBetHistory");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeBollywoodBet(req) {
  const amt = req.body.amount;
  const eid = req.body.catmid;
  const mid = req.body.mid;
  let mnam = req.body.teamname;
  let rnr = req.body.bettype;
  const rat = req.body.odds;
  const sid = req.body.sid;

  const RoundId = req.body.RoundId;
  const currency = req.user.currency;
  const user_id = req.user.user_id;

  console.log("Inside placeBollywoodBet function");
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
  limit_bet = await BetLimit.findOne({ user_id: req.user._id }).select(
    "casino"
  );
  limit_bet = limit_bet.casino;
  //$max_expouser = 600;
  console.log("amt:", amt, "limit_bet:", limit_bet);
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
  console.log("Outside if");
  console.log(
    "eid:",
    eid,
    "mnam:",
    mnam,
    "rnr:",
    rnr,
    "rat:",
    rat,
    "amt:",
    amt
  );
  console.log("min_amount:", min_amount, "limit_bet:", limit_bet);
  if (
    eid &&
    mnam &&
    rnr &&
    rat > 0 &&
    rat !== "SUSPENDED" &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    console.log("Inside if");
    const mid = req.body.catmid; // catmid = 18.220808091932
    const typ = req.body.bettype; // b = back, l = lay
    const rat = req.body.odds;
    const amt = req.body.amount;

    const RoundId = mid;

    if (!mid) {
      return {
        status: false,
        message: "Round Not Found",
      };
    }

    if (!sid) {
      return {
        status: false,
        message: "Runner name not found.",
      };
    }

    const uid = req.user.uame;
    const upt = req.user.points;

    mnam = mnam.toLowerCase();

    if (mnam.length > 35) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    if (sid.length > 50) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    if (rat.toString().length > 5) {
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
      result.message = "Runner name not valid";
      return result;
    }

    if (mid.length > 40) {
      result.status = false;
      result.message = "Mid not valid";
      return result;
    }

    if (typ.length > 10) {
      result.status = false;
      result.message = "Type not valid...";
      return result;
    }

    if (mnam == "don") {
      if (typ == "b") rnr = "b1";
      if (typ == "l") rnr = "l1";
    } else if (mnam == "amar akbar anthony") {
      if (typ == "b") rnr = "b2";
      if (typ == "l") rnr = "l2";
    } else if (mnam == "sahib bibi aur ghulam") {
      if (typ == "b") rnr = "b3";
      if (typ == "l") rnr = "l3";
    } else if (mnam == "dharam veer") {
      if (typ == "b") rnr = "b4";
      if (typ == "l") rnr = "l4";
    } else if (mnam == "kis kisko pyar karu") {
      if (typ == "b") rnr = "b5";
      if (typ == "l") rnr = "l5";
    } else if (mnam == "ghulam") {
      if (typ == "b") rnr = "b6";
      if (typ == "l") rnr = "l6";
    } else {
      result.status = false;
      result.message = "Invalid Runner";
      return result;
    }

    const isBettingEnable = await AdmBetStart.findOne({ sno: 1 }).select(
      "virtual_bollywood"
    );

    if (!isBettingEnable || !isBettingEnable.virtual_bollywood) {
      result.status = false;
      result.message = "Betting stopped for this casino.";
      return result;
    }

    const qds = await BzBollywoodVirtualRates.aggregate([
      {
        $match: {
          evt_status: "OPEN",
          cat_mid: String(mid),
          evt_od: { $lt: new Date() },
        },
      },
      {
        $addFields: {
          difftm: {
            $dateDiff: {
              startDate: "$evt_od",
              endDate: "$$NOW",
              unit: "second",
            },
          },
        },
      },
    ]);
	let timeLeft = 0;
    if (qds) {
      const stld = qds.stld;
      const match_status = qds.evt_status;
      const pending = qds.pending;
      const evt_id = qds.cat_mid;
      //$cat_sid1 = $qdr[0]['sid1'];
      //$cat_sid2 = $qdr[0]['sid2'];
      //$cat_sid3 = $qdr[0]['sid3'];

      timeLeft = qds.difftm;
    } else {
      console.log("+++++++++++++++++++++++++++++++++++");
      result.status = false;
      result.mid = mid;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    if (timeLeft > 27) {
      result.status = false;
      result.message = "Bet not placed. Time is up!!";
      return result;
    }

    dr = await Punter.aggregate([
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
    if (dr && dr.logon == 1) {
      const returnArray = {
        game_name: "bollywood_virtual",
        result: false,
      };
      const jsonArray = JSON.stringify(returnArray);
      // const jsonds = getCasinoGamesData(jsonArray);
      const jsonds = await BzBollywoodVirtualRatesOdd.find({
        cat_mid: eid,
      }).lean();

      if (jsonds) {
        const lcat_mid = jsonds[0].cat_mid;
        const levt_id = lcat_mid;

        const lcat_sid1 = jsonds[0].sid;
        const lcat_sid2 = jsonds[1].sid;
        const lcat_sid3 = jsonds[2].sid;
        const lcat_sid4 = jsonds[3].sid;
        const lcat_sid5 = jsonds[4].sid;
        const lcat_sid6 = jsonds[5].sid;

        const lcat_rnr1_status = jsonds[0].status;
        const lcat_rnr2_status = jsonds[1].status;
        const lcat_rnr3_status = jsonds[2].status;
        const lcat_rnr4_status = jsonds[3].status;
        const lcat_rnr5_status = jsonds[4].status;
        const lcat_rnr6_status = jsonds[5].status;

        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          if (
            String(lcat_sid1).trim() == String(sid).trim() &&
            lcat_rnr1_status == 1
          ) {
            if (String(typ).trim() == "b") {
              liverate = jsonds.back;
            } else if (String(typ).trim() == "l") {
              liverate = jsonds[0].lay;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid2 == sid && lcat_rnr2_status == 1) {
            if (typ == "b") {
              liverate = jsonds[1].back;
            } else if (typ == "l") {
              liverate = jsonds[1].lay;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid3 == sid && lcat_rnr3_status == 1) {
            if (typ == "b") {
              liverate = jsonds[2].back;
            } else if (typ == "l") {
              liverate = jsonds[2].lay;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid4 == sid && lcat_rnr4_status == 1) {
            if (typ == "b") {
              liverate = jsonds[3].back;
            } else if (typ == "l") {
              liverate = jsonds[3].lay;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid5 == sid && lcat_rnr5_status == 1) {
            if (typ == "b") {
              liverate = jsonds[4].back;
            } else if (typ == "l") {
              liverate = jsonds[4].lay;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid6 == sid && lcat_rnr6_status == 1) {
            if (typ == "b") {
              liverate = jsonds[5].back;
            } else if (typ == "l") {
              liverate = jsonds[5].lay;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else {
            result.status = false;
            result.message = "This Round is suspended now.";
            return result;
          }
        }
      }

      let ta = 0;
      let tb = 0;
      let tc = 0;
      let td = 0;
      let te = 0;
      let tf = 0;
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
            td -= lib;
            te += pro;
            tf -= lib;
          }
          if (rnr == "b6") {
            ta -= lib;
            tb -= lib;
            tc -= lib;
            td -= lib;
            te -= lib;
            tf += pro;
          }
        } else {
          ratok = 0;
        }
      } else if (typ == "l") {
        if (rat >= liverate && liverate > 0 && liverate) {
          ratok = 1;
          pro = amt;
          lib = Math.round(rat * amt - amt);
          if (rnr == "l1") {
            ta -= lib;
            tb += pro;
            tc += pro;
            td += pro;
            te += pro;
            tf += pro;
          }
          if (rnr == "l2") {
            ta += pro;
            tb -= lib;
            tc += pro;
            td += pro;
            te += pro;
            tf += pro;
          }
          if (rnr == "l3") {
            ta += pro;
            tb += pro;
            tc -= lib;
            td += pro;
            te += pro;
            tf += pro;
          }
          if (rnr == "l4") {
            ta += pro;
            tb += pro;
            tc += pro;
            td -= lib;
            te += pro;
            tf += pro;
          }
          if (rnr == "l5") {
            ta += pro;
            tb += pro;
            tc += pro;
            td += pro;
            te -= lib;
            tf += pro;
          }
          if (rnr == "l6") {
            ta += pro;
            tb += pro;
            tc += pro;
            td += pro;
            te += pro;
            tf -= lib;
          }
        } else {
          ratok = 0;
        }
      }

      if (ratok == 1) {
        try {
          pointok = 0;
          const drstc = await BzBollywoodVirtualMatch.findOne({
            cat_mid: mid,
            uname: uid,
          });
          if (drstc) {
            limita = drstc.lockamt + drstc.rnr1s + drstc.bz_balance;
            limitb = drstc.lockamt + drstc.rnr2s + drstc.bz_balance;
            limitc = drstc.lockamt + drstc.rnr3s + drstc.bz_balance;
            limitd = drstc.lockamt + drstc.rnr4s + drstc.bz_balance;
            limite = drstc.lockamt + drstc.rnr5s + drstc.bz_balance;
            limitf = drstc.lockamt + drstc.rnr6s + drstc.bz_balance;

            if (rnr == "b1") {
              limit = Math.min(limitb, limitc, limitd, limite, limitf);
            }
            if (rnr == "b2") {
              limit = Math.min(limita, limitc, limitd, limite, limitf);
            }
            if (rnr == "b3") {
              limit = Math.min(limita, limitb, limitd, limite, limitf);
            }
            if (rnr == "b4") {
              limit = Math.min(limita, limitb, limitc, limite, limitf);
            }
            if (rnr == "b5") {
              limit = Math.min(limita, limitb, limitc, limitd, limitf);
            }
            if (rnr == "b5") {
              limit = Math.min(limita, limitb, limitc, limitd, limite);
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
            if (rnr == "l5") {
              limit = limite;
            }
            if (rnr == "l6") {
              limit = limitf;
            }

            if (lib <= limit) {
              pla = drstc.lockamt;
              nla1 = drstc.rnr1s + ta;
              nla2 = drstc.rnr2s + tb;
              nla3 = drstc.rnr3s + tc;
              nla4 = drstc.rnr4s + td;
              nla5 = drstc.rnr5s + te;
              nla6 = drstc.rnr6s + tf;
              if (Math.min(nla1, nla2, nla3, nla4, nla5, nla6) < 0) {
                nla = Math.abs(Math.min(nla1, nla2, nla3, nla4, nla5, nla6));
              } else {
                nla = 0;
              }

              cla = pla - nla;
              pointok = 1;

              maxPL = Math.max(nla1, nla2, nla3, nla4, nla5, nla6);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - cla >= 0) {
                /*if ($nla <= $max_expouser) {*/

                await BzBollywoodVirtualMatch.updateOne(
                  { cat_mid: mid, uname: uid },
                  {
                    $inc: {
                      rnr1s: ta,
                      rnr2s: tb,
                      rnr3s: tc,
                      rnr4s: td,
                      rnr5s: te,
                      rnr6s: tf,
                    },
                    $set: {
                      lockamt: nla,
                    },
                  }
                );
                /*} else {
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
              const sts = await BzBollywoodVirtualRates.findOne({
                cat_mid: mid,
              }).lean();
              if (!sts) {
                result.status = false;
                result.message =
                  "No matching record found for the given match ID.";
                return result;
              }
              cla = -lib;
              nla = cla2 = lib;

              maxPL = Math.max(ta, tb, tc, td, te, tf);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }
              if (dr.bz_balance - $cla >= 0) {
                pla = 0;
                if (cla2 <= limit_bet) {
                  const newMatch = new BzBollywoodVirtualMatch({
                    cat_mid: mid,
                    uname: uid,
                    rnr1: "done",
                    rnr1s: ta,
                    rnr1sid: "1",
                    rnr2: "amar akbar anthony",
                    rnr2s: tb,
                    rnr2sid: "2",
                    rnr3: "sahib bibi aur ghulam",
                    rnr3s: tc,
                    rnr3sid: "3",
                    rnr4: "dharam veer",
                    rnr4s: td,
                    rnr4sid: "4",
                    rnr5: "kis kisko pyar karu",
                    rnr5s: te,
                    rnr5sid: "5",
                    rnr6: "ghulam",
                    rnr6s: tf,
                    rnr6sid: "6",
                    lockamt: cla2,
                    user_id: user_id,
                  });

                  await newMatch.save();
                  const parent_bet_id = newMatch._id;
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
            await BzBollywoodVirtualRates.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: true } }
            );

            const newBet = new BzBollywoodVirtualBetHistory({
              uname: uid,
              cat_mid: mid,
              rnr: mnam,
              rate: rat,
              amnt: amt,
              pro: pro,
              lib: lib,
              type: typ,
              cla: cla,
              rnrsid: sid,
              sid: sid,
              user_id: user_id,
            });

            await newBet.save();
            const bet_id = newBet._id;
            const st2 = await UpdateBalance(req.user._id, cla);
            await pushExposure(req, res, sid, cla, "Bollywood Virtual");
            if (st2) {
              balance_point = dr.bz_balance + cla;

              const dt = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

              claVal = dr.bz_balance + cla;

              //New Logs
              await UserLogs.create({
                page: "livebet_bollywood",
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

              const notificationsData = {
                evt_id: "Bollywood",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Bollywood casino games.`,
              };
              await Notifications.create(notificationsData);

              result.status = true;
              result.message = "Bet Placed.";
              return result;
            } else {
              //$db->rollBack();
              result.status = false;
              result.message = "Error while placing bet";
              return result;
            }
          } else if (pointok == 2) {
            result.status = false;
            result.message = "Bet limit error";
            return result;
          } else if (pointok == 3) {
            result.status = false;
            result.message = "Bet limit error";
            return result;
          } else {
            result.status = false;
            result.points = pointok;
            result.lib = lib;
            result.limit = limit;

            result.message = "Insufficient funds!!";
            return $result;
          }
        } catch (error) {
          //$db->rollBack();
          result.status = false;
          result.message = "Some error occurred while placing this bet.";
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
  } else {
    result.status = false;
    result.message = "Some parameters missing. Please try again.";
    return result;
  }
}

async function placeBollywoodBetFancy(req) {
  const amt = req.body.amount;
  const eid = req.body.catmid;
  const mid = req.body.mid;
  const mnam = req.body.teamname;
  const rnr = req.body.bettype;
  const rat = req.body.odds;
  const sid = req.body.sid;

  const RoundId = req.body.RoundId;
  const currency = req.user.currency;
  const user_id = req.user.user_id;

  let min_amount = 0;
  let maxWinning = 0;
  let result = {};
  console.log("called");
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
  limit_bet = await BetLimit.findOne({ user_id: user_id }).select("casino");
  //$max_expouser = 600;

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
    rat &&
    rat > 0 &&
    rat !== "SUSPENDED" &&
    amt &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    const mid = req.body.catmid; // catmid = 18.220808091932
    const typ = req.body.bettype; // b = back, l = lay
    const rnr = req.body.bettype;
    const rat = req.body.odds;
    const amt = req.body.amount;

    const RoundId = mid;

    if (!mid) {
      result.status = false;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    if (!sid) {
      result.status = false;
      result.message = "Runner name not found.";
      return result;
    }

    const uid = req.user.uame;
    const upt = req.user.points;

    const mnam = String(mnam).toLowerCase().trim();

    sidCheck = sid; //sid

    new_sid = 0;

    if (mnam == "dulha dulhan") {
      new_sid = 14;
    } else if (mnam == "barati") {
      new_sid = 15;
    } else if (mnam == "red") {
      new_sid = 8;
    } else if (mnam == "black") {
      new_sid = 9;
    } else if (mnam == "card j") {
      new_sid = 10;
    } else if (mnam == "card q") {
      new_sid = 11;
    } else if (mnam == "card k") {
      new_sid = 12;
    } else if (mnam == "card a") {
      new_sid = 13;
    }

    new_compare_sid = new_sid;
    sid = new_compare_sid;

    typ = "b";

    if (sid != "") {
      arr = explode("-", sid);
      intSid = arr[1];
    }

    if (typ == "b") {
      rnr = "b1";
    }

    isBettingEnable = false;
    const isBettingEnable = await AdmBetStart.findOne({ sno: 1 }).select(
      "virtual_bollywood"
    );

    if (isBettingEnable == false) {
      result.status = false;
      result.message = "Betting stopped for this casino.";
      return result;
    }

    const qdr = await BzBollywoodVirtualRates.findOne({
      evt_status: "OPEN",
      cat_mid: mid,
    }).lean();

    if (qdr) {
      const currentTime = new Date();
      const eventTime = new Date(qdr.evt_od);
      const timeDifference = Math.abs(currentTime - eventTime) / 1000; // Time difference in seconds
      qdr.difftm = timeDifference;
    }
    if (qdr) {
      const stld = qdr.stld;
      const match_status = qdr.evt_status;
      const pending = qdr.pending;
      const evt_id = qdr.cat_mid;

      const timeLeft = qdr.difftm;
    } else {
      result.status = false;
      result.mid = mid;
      result.message = "This Round is closed";
      return result;
    }

    if (timeLeft > 27) {
      result.status = false;
      result.message = "Bet not placed. Time is up!!";
      return result;
    }
    //echo 1; exit;
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
      const returnArray = {
        game_name: "bollywood_virtual",
        result: false,
      };
      const jsonArray = JSON.stringify(returnArray);
      //$jsonds = get_casino_games_data($json_array);

      const jsonds = await BzBollywoodVirtualRatesOdd.find({
        cat_mid: eid,
      }).lean();
      if (jsonds && jsonds.length >= 1) {
        const lcat_mid = jsonds[0].cat_mid;
        levt_id = lcat_mid;

        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          t2Array = jsonds;
          arrlength = t2Array.length;
          //echo $lcat_mid."--".$evt_id."-".$arrlength;
          isMatch = false;
          if (arrlength > 0) {
            for (x = 0; x < arrlength; x++) {
              obj = t2Array[x];
              lcat_sid1 = obj["sid"];
              lcat_rnr1_status = obj["status"];
              if (lcat_sid1 == sid && lcat_rnr1_status == 1) {
                if (typ == "b") {
                  liverate = obj["back"];
                  isMatch = true;
                  break;
                }
              }
            }
          }

          if (isMatch) {
          } else {
            result.status = false;
            result.message = "This Round is suspended now.";
            return result;
          }
        }
      }

      ta = 0;
      tb = 0;
      tc = 0;
      td = 0;

      if (typ == "b") {
        if (rat <= liverate && liverate > 0 && !empty(liverate)) {
          ratok = 1;
          pro = Math.round(rat * amt - amt);
          lib = amt;
          if (rnr == "b1") {
            ta += pro;
            tb -= lib;
          }
        } else {
          ratok = 0;
        }
      }

      if (ratok == 1) {
        try {
          pointok = 0;
          const drstc = await BzBollywoodVirtualFancyBet.findOne({
            mid_mid: mid,
            uname: uid,
            rnr_nam: mnam,
          }).lean();

          if (drstc) {
            if (drstc.bz_balance > lib) {
              pointok = 1;

              maxPL = Math.max(ta, tb);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
                exit;
              }
              if (lib <= limit_bet) {
                await BzBollywoodVirtualFancyBet.updateOne(
                  { mid_mid: mid, uname: uid, rnr_nam: mnam },
                  {
                    $inc: {
                      bak: ta,
                      lay: tb,
                      lockamt: lib,
                    },
                  }
                );
              } else {
                pointok = 3;
              }
            } else {
              pointok = 0;
            }
          } else {
            if (lib <= dr.bz_balance) {
              cla = -lib;
              nla = cla2 = lib;

              maxPL = pro;
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - cla >= 0) {
                pla = 0;
                /*if ($cla2 <= $max_expouser) {*/
                await BzBollywoodVirtualFancyBet.create({
                  mid_mid: mid,
                  uname: uid,
                  rnr_nam: mnam,
                  rnr_sid: sid,
                  bak: pro,
                  lay: cla,
                  lockamt: cla2,
                  evt_id: mid,
                  user_id: user_id,
                });

                pointok = 1;
                /*} else {
										$pointok = 3;
									}*/
              } else {
                pointok = 2;
              }
            } else {
              pointok = 0;
            }
          }

          if (pointok == 1) {
            ///
            await BzBollywoodVirtualRates.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: true } }
            );

            const newBet = new BzBollywoodVirtualBetHistory({
              uname: uid,
              cat_mid: mid,
              rnr: mnam,
              rate: rat,
              amnt: amt,
              pro: pro,
              lib: lib,
              type: typ,
              cla: -lib,
              rnrsid: sid,
              sid: sid,
              user_id: user_id,
            });

            await newBet.save();
            const bet_id = newBet._id;
            st2 = await UpdateBalance(req.user._id, cla);
            await pushExposure(req, res, sid, cla, "Bollywood Virtual");
            if (st2) {
              balance_point = dr.bz_balance + cla;

              const dt = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

              claVal = dr.bz_balance + cla;

              //New Logs
              await UserLogs.create({
                page: "livebet_bollywood_fancy",
                linkid: bet_id,
                ptrans: cla,
                otrans: "",
                points: claVal,
                obal: dr.opin_bal,
                uname: uid,
                date: dt,
                ptype: "bet",
              });

              const notificationsData = {
                evt_id: "bollywood fancy",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in bollywood fancy casino games.`,
              };
              await Notifications.create(notificationsData);

              result.status = true;
              result.message = "Bet Placed.";
              return result;
            }
          } else if (pointok == 2) {
            result.status = false;
            result.message = "Bet limit error";
            return result;
          } else if (pointok == 3) {
            result.status = false;
            result.message = "Bet limit error";
            return result;
          } else {
            result.status = false;
            result.points = pointok;
            result.lib = lib;
            result.limit = limit;

            result.message = "Insufficient funds!!";
            return result;
          }
        } catch (error) {
          //$db->rollBack();

          result.status = false;
          result.message = "Error while placing bet";
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
  } else {
    result.status = false;
    result.message = "Some parameters missing. Please try again.";
    return result;
  }
}
module.exports = { placeBollywoodBet, placeBollywoodBetFancy };
