const mongoose = require("mongoose");
const BzAaaVirtualRates = require("../models/BzAaaVirtualRates.js");
const BzAaaVirtualMatch = require("../models/BzAaaVirtualMatch");
const BzAaaVirtualMatchOther = require("../models/BzAaaVirtualMatchOther");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzAaaVirtualBetHistory = require("../models/BzAaaVirtualBetHistory");
const UserLogs = require("../../models/UserLogs");
const {
  UpdateBalance, pushExposure
} = require("../../utils/function");

async function placeBet(req) {
  const currency = req.user.currency;
  const user_id = req.user._id;

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
  // Get limit_bet from BetLimit collection for the user
  const betLimitDoc = await BetLimit.findOne({ user_id: user_id }).lean();
  const limit_bet = betLimitDoc.casino;
  let result = {};

  if (req.user.user_role != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  mid = req.body.catmid;
  typ = req.body.bettype;
  rnr = req.body.bettype;
  rat = req.body.odds;
  amt = req.body.amount;
  mnam = req.body.teamname;
  sid = req.body.sid;
  sidData = mid + "-" + sid;

  if (
    mid != "" &&
    sidData != "" &&
    mnam != "" &&
    rat != "" &&
    rat > 0 &&
    rat != "SUSPENDED" &&
    amt != "" &&
    amt >= 2 &&
    amt <= limit_bet
  ) {
    //	parse = parse_url(req.headers.referer);

    mid = req.body.catmid;
    typ = req.body.bettype;
    rnr = req.body.bettype;
    rat = req.body.odds;
    amt = req.body.amount;
    mnam = req.body.teamname;

    RoundId = mid;

    if (amt < min_amount) {
      result.status = false;
      result.message =
        "min " + min_amount + " and max " + limit_bet + " point bet allow";
      return result;
    }

    if (amt > limit_bet) {
      result.status = false;
      result.message =
        "min " + min_amount + " and max " + limit_bet + " point bet allow";
      return result;
    }

    if (RoundId == "") {
      result.status = false;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    uid = req.user.uname;
    upt = req.user.point;
    uss = req.user.uname;

    sid_1 = req.body.sid;
    if (sid_1 != "") {
      /*$arr =  explode("-", $sid_1);
					$sid = trim($arr[1]);*/
      sid = sid_1;
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    mnam = String(req.body.teamname).trim().toLowerCase();

    if (mnam.length > 35) {
      result.status = false;
      result.message = "Invailid Bet";
      return result;
    }

    if (sid.length > 50) {
      result.status = false;
      result.message = "Invailid Bet";
      return result;
    }

    if (rat.length > 5) {
      result.status = false;
      result.message = "Invailid Bet";
      return result;
    }

    if (rat > 50) {
      result.status = false;
      result.message = "NOT OPEN";
      return result;
    }

    if (rnr.length > 20) {
      result.status = false;
      result.message = "Invailid Bet";
      return result;
    }

    if (mid.length > 40) {
      result.status = false;
      result.message = "Invailid Bet";
      return result;
    }

    if (typ.length > 10) {
      result.status = false;
      result.message = "Invailid Bet";
      return result;
    }

    if (mnam == "amar") {
      if (typ == "b") rnr = "b1";
      if (typ == "l") rnr = "l1";
    } else if (mnam == "akbar") {
      if (typ == "b") rnr = "b2";
      if (typ == "l") rnr = "l2";
    } else if (mnam == "anthony") {
      if (typ == "b") rnr = "b3";
      if (typ == "l") rnr = "l3";
    } else {
      result.status = false;
      result.message = "NOT OPEN";
      return result;
    }
    //validation end here
    //bz_aaa_virtual_rates
    // Fetch bz_aaa_virtual_rates document for the given evt_id and status OPEN
    const qdr = await BzAaaVirtualRates.findOne({
        evt_status: "OPEN",
        evt_id: mid,
      });
    if (qdr) {
      // Calculate time difference in seconds between now and evt_od

      let timeDiff = Math.abs(new Date() - new Date(qdr.evt_od)) / 1000; // Calculate time difference in seconds
      qdr.difftm = timeDiff;

      stld = qdr.stld;
      match_status = qdr.evt_status;
      pending = qdr.pending;
      evt_id = qdr.cat_mid;
      cat_sid1 = qdr.sid1;
      cat_sid2 = qdr.sid2;
      cat_sid3 = qdr.sid3;

      timeLeft = qdr.difftm;
    } else {
      console.log("line 195");
      result.status = false;
      result.message = "EVENT NOT FOUND-" + mid;
      return result;
    }
    console.log("++++++++++++++++ Inside");

    let isBettingEnable = false;
    // Fetch ADM_BET_START document with sno = '1'
    dr = await AdmBetStart.findOne({ sno: "1" }).lean();

    isBettingEnable = dr.virtual_aaa;

    if (isBettingEnable == false) {
      result.status = false;
      result.message = "NOT OPEN";
      return result;
    }

    if (timeLeft > 20) {
      result.status = false;
      result.message = "NOT OPEN MARKET";
      return result;
    }

    if (
      (sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
      (sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
      (sid == cat_sid3 && (rnr == "l3" || rnr == "b3"))
    ) {
    } else {
      result.status = false;
      result.message = "NOT OPEN";
      return result;
    }

    if (trim(match_status) != "OPEN" || stld == 1) {
      result.status = false;
      result.message = "NOT OPEN";
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
      return_array.game_name = "aaa";
      return_array.result = false;
      const json_array = JSON.stringify(return_array);
      const jsonds = await BzAaaVirtualRates.findOne({ cat_mid: mid });

      if (jsonds) {
        lcat_mid = jsonds.cat_mid;
        levt_id = lcat_mid;

        lcat_sid1 = jsonds.sid1;
        lcat_sid2 = jsonds.sid2;
        lcat_sid3 = jsonds.sid3;

        lcat_rnr1_status = jsonds.status1;
        lcat_rnr2_status = jsonds.status2;
        lcat_rnr3_status = jsonds.status3;

        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          if (lcat_sid1 == sid && lcat_rnr1_status == 1) {
            if (typ == "b") {
              liverate = jsonds.b1;
            } else if (typ == "l") {
              liverate = jsonds.l1;
            } else {
              result.status = false;
              result.message = "NOT OPEN";
              return result;
            }
          } else if (lcat_sid2 == sid && lcat_rnr2_status == 1) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = jsonds.l2;
            } else {
              result.status = false;
              result.message = "NOT OPEN";
              return result;
            }
          } else if (lcat_sid3 == sid && lcat_rnr3_status == 1) {
            if (typ == "b") {
              liverate = jsonds.b3;
            } else if (typ == "l") {
              liverate = jsonds.l3;
            } else {
              result.status = false;
              result.message = "NOT OPEN";
              return result;
            }
          } else {
            result.status = false;
            result.message = "NOT OPEN";
            return result;
          }
        }
      }

      ta = 0;
      tb = 0;
      tc = 0;

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
        } else {
          ratok = 0;
        }
      }

      if (ratok == 1) {
        //try {
          pointok = 0;
          drstc = await BzAaaVirtualMatch.findOne({
              cat_mid: mid,
              uname: uid,
            });
          if (drstc) {
            limit = 0;
            limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
            limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;
            limitc = drstc.lockamt + drstc.rnr3s + dr.bz_balance;

            if (rnr == "b1") {
              limit = Math.min(limitb, limitc);
            }
            if (rnr == "b2") {
              limit = Math.min(limita, limitc);
            }
            if (rnr == "b3") {
              limit = Math.min(limitb, limita);
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

            if (lib <= limit) {
              //update bt_match_teenpatti
              pla = drstc.lockamt;
              nla1 = drstc.rnr1s + ta;
              nla2 = drstc.rnr2s + tb;
              nla3 = drstc.rnr3s + tc;
              //$nla4 = $drstc[0]['rnr4s'] + $td;

              if (Math.min(nla1, nla2, nla3) < 0) {
                nla = Math.abs(Math.min(nla1, nla2, nla3));
              } else {
                nla = 0;
              }

              cla = pla - nla;
              pointok = 1;

              maxPL = Math.max(nla1, nla2, nla3);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - cla >= 0) {
                if (nla <= limit_bet) {
                  await BzAaaVirtualMatch.updateOne(
                      { cat_mid: mid, uname: uid },
                      {
                        $inc: {
                          rnr1s: ta,
                          rnr2s: tb,
                          rnr3s: tc,
                        },
                        $set: {
                          lockamt: nla,
                        },
                      }
                    );
                } else {
                  pointok = 3;
                }
              } else {
                pointok = 2;
              }
            } else {
              pointok = 0;
            }
          } else {
            if (lib <= dr.bz_balance) {
              drsts = await BzAaaVirtualRates.findOne({ cat_mid: mid });
              cla = -lib;
              nla = cla2 = lib;

              maxPL = Math.max(ta, tb, tc);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - cla >= 0) {
                pla = 0;
                if (cla2 <= limit_bet) {
                  const sti = await BzAaaVirtualMatch.insertOne({
                      cat_mid: mid,
                      uname: uid,
                      rnr1: drsts.rnr1,
                      rnr1s: ta,
                      rnr2: drsts.rnr2,
                      rnr2s: tb,
                      rnr3: drsts.rnr3,
                      rnr3s: tc,
                      lockamt: cla2,
                      rnr1sid: drsts.sid1,
                      rnr2sid: drsts.sid2,
                      rnr3sid: drsts.sid3,
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
            await BzAaaVirtualRates.updateOne({ evt_id: mid }, { $set: { is_bet_place: "1" } });
            ///
            const st = await BzAaaVirtualBetHistory.insertOne({
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

            const bet_id = st.insertedId;
            const st2 = await UpdateBalance(req.user._id, cla);
            await pushExposure(req, res, sid, cla, "AAA");


            if (st2) {
              const balance_point = dr.bz_balance + cla;

              const dt = new Date()
                .toISOString()
                .replace("T", " ")
                .substring(0, 19);

              claVal = dr.bz_balance + cla;

              //New Logs
              const stss270 = await UserLogs.create({
                page: "livebet_aaa",
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
                evt_id: "AAA",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Amar Akbar Anthony casino games.`,
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
            result.message = "Insufficient funds!!";
            return result;
          }
        // } catch (error) {
        //   //$db->rollBack();
        //   result.status = false;
        //   result.message = "Some error occurred while placing this bet.";
        //   return result;
        // }
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

async function placeAAABetFancy(req) {
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
  // Get limit_bet from BetLimit collection for the user
  const betLimitDoc = await BetLimit.findOne({ user_id: user_id }).lean();
  const limit_bet = betLimitDoc.casino;

  if (req.user.user_role != 8) {
    result.status = false;
    result.message = "Not Allowed!!!";
    return result;
  }

  if (req.headers["x-requested-with"] != "XMLHttpRequest") {
    result.status = false;
    result.message = "NOT OPEN!!!";
    return result;
  } else {
    mid = req.body.catmid;
    typ = req.body.bettype;
    rnr = req.body.bettype;
    rat = req.body.odds;
    amt = req.body.amount;
    mnam = req.body.teamname;
    sid = req.body.sid;
    sidData = mid + "-" + sid;

    if (
      mid != "" &&
      sidData != "" &&
      mnam != "" &&
      rat != "" &&
      rat > 0 &&
      rat != "SUSPENDED" &&
      amt != "" &&
      amt >= 2 &&
      amt <= limit_bet
    ) {
      //parse = parse_url(req.headers.referer);

      mnam = String(req.body.teamname).trim().toLowerCase();
      mid = req.body.catmid; // cat_mid
      typ = req.body.bettype; //back or lay (b ,l)
      rnr = req.body.bettype; //back or lay
      rat = req.body.odds; // rate
      amt = req.body.amount;
      sid = req.body.sid; //sid
      sidCheck = req.body.sid; //sid
      roundId = req.body.RoundId;
      newSid = 0;

      if (amt < min_amount) {
        result.status = false;
        result.message =
          "min " + min_amount + " and max " + limit_bet + " point bet allow";
        return result;
      }

      if (amt > limit_bet) {
        result.status = false;
        result.message =
          "min " + min_amount + " and max " + limit_bet + " point bet allow";
        return result;
      }

      if (mnam == "even") {
        newSid = 4;
      } else if (mnam == "odd") {
        newSid = 5;
      } else if (mnam == "red") {
        newSid = 6;
      } else if (mnam == "black") {
        newSid = 7;
      } else if (mnam == "1") {
        newSid = 8;
      } else if (mnam == "2") {
        newSid = 9;
      } else if (mnam == "3") {
        newSid = 10;
      } else if (mnam == "4") {
        newSid = 11;
      } else if (mnam == "5") {
        newSid = 12;
      } else if (mnam == "6") {
        newSid = 13;
      } else if (mnam == "7") {
        newSid = 14;
      } else if (mnam == "8") {
        newSid = 15;
      } else if (mnam == "9") {
        newSid = 16;
      } else if (mnam == "10") {
        newSid = 17;
      } else if (mnam == "11") {
        newSid = 18;
      } else if (mnam == "12") {
        newSid = 19;
      } else if (mnam == "13") {
        newSid = 20;
      } else if (mnam == "under") {
        newSid = 21;
      } else if (mnam == "over") {
        newSid = 22;
      }

      let new_compare_sid = newSid;
      sid = new_compare_sid;

      typ = "b";

      if (sid != "") {
        //$arr = explode("-", $sid);
        //$intSid = $arr[1];
        intSid = sid;
      }

      uid = req.user.uname;
      upt = req.user.point;

      if (typ == "b") {
        rnr = "b1";
      }

      // Fetch bz_aaa_virtual_rates document for the given evt_id and status OPEN
      const qdr = await BzAaaVirtualRates.findOne({
          evt_status: "OPEN",
          evt_id: mid,
        });

      if (qdr) {
        // Calculate time difference in seconds between now and evt_od
        let timeDiff = Math.abs(new Date() - new Date(qdr.evt_od)) / 1000; // Calculate time difference in seconds
        qdr.difftm = timeDiff;

        stld = qdr.stld;
        match_status = qdr.evt_status;
        evt_id = qdr.cat_mid;
        cat_sid1 = qdr.cat_sid1;
        cat_sid2 = qdr.cat_sid2;
        timeLeft = qdr.difftm;
      } else {
        result.status = false;
        result.message = "EVENT NOT FOUND" + mid;
        return result;
      }

      isBettingEnable = false;
      // Fetch ADM_BET_START document with sno = '1'
      const admBetStartDoc = await AdmBetStart.findOne({ sno: "1" }).lean();
      isBettingEnable = admBetStartDoc.virtual_aaa;

      if (isBettingEnable == false) {
        result.status = false;
        result.message = "NOT OPEN";
        return result;
      }

      if (timeLeft > 20) {
        result.status = false;
        result.message = "NOT OPEN MARKET";
        return result;
      }

      if (trim(match_status) != "OPEN" || stld == 1) {
        result.status = false;
        result.message = "NOT OPEN";
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
        const return_array = {};
        return_array.game_name = "aaa_virtual";
        return_array.result = false;
        const json_array = JSON.stringify(return_array);
        const jsonds = await BzAaaVirtualRates.find({ cat_mid: mid })
          .toArray();

        if (jsonds) {
          lcat_mid = jsonds[0].cat_mid;
          levt_id = lcat_mid;
        }

        ta = 0;
        tb = 0;
        tc = 0;
        td = 0;

        if (typ == "b") {
          liverate = rat;
          if (rat <= liverate && liverate > 0 && liverate) {
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
          //try {
            pointok = 0;
            const drstc = await BzAaaVirtualMatchOther.findOne({
                mid_mid: mid,
                uname: uid,
                rnr_nam: mnam,
              });
            if (drstc) {
              if (dr.bz_balance > lib) {
                maxPL = Math.max(ta, tb);
                if (maxPL > maxWinning) {
                  result.status = false;
                  result.message = "Max Winning Limit " + maxWinning;
                  return result;
                }

                if (lib <= limit_bet) {
                  pointok = 1;
                  await BzAaaVirtualMatchOther.updateOne(
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
              if (lib <= dr[0]["bz_balance"]) {
                const drsts = await BzAaaVirtualRates.findOne({ cat_mid: mid });

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
                  if (cla2 <= limit_bet) {
                    const sti = await BzAaaVirtualMatchOther.insertOne({
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
                  } else {
                    pointok = 3;
                  }
                } else {
                  pointok = 2;
                }
              } else {
                $pointok = 0;
              }
            }
            if (pointok == 1) {
              ///
              await BzAaaVirtualRates.updateOne({ evt_id: mid }, { $set: { is_bet_place: "1" } });
              ///

              cla = -lib;

              const st = await BzAaaVirtualBetHistory.insertOne({
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
              const bet_id = st.insertedId;
              const st2 = await UpdateBalance(req.user._id, cla);
              await pushExposure(req, res, sid, cla, "AAA");

              if (st2) {
                balance_point = dr.bz_balance + cla;

                const dt = new Date()
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19);

                claVal = dr.bz_balance + cla;

                //New Logs
                const stss270 = await UserLogs.create({
                  page: "livebet_aaa",
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
                  evt_id: "AAA",
                  user_id: req.user._id,
                  game_type: "6",
                  description: `${uid} placed bet on ${mnam} in Amar Akbar Anthony casino games.`,
                };
                await Notifications.create(notificationsData);

                result.status = true;
                result.message = "Bet Placed.";
                return result;
              }
            }
        //   } catch (error) {
        //     //$db->rollBack();
        //     result.status = false;
        //     result.message = "Some error occurred while placing this bet.";
        //     return result;
        //   }
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
}

module.exports = { placeBet, placeAAABetFancy };
//module.exports = { placeBet};
