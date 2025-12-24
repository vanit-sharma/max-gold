const mongoose = require("mongoose");
const BzBetCentercardVirtualRate = require("../models/BzBetCentercardVirtualRate");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BtMatchCentercardVirtual = require("../models/BtMatchCentercardVirtual");
const BetDuskadumVirtual = require("../models/BetDuskadumVirtual");
const BzUserBetDuskadumHistoryVirtual = require("../models/BzUserBetDuskadumHistoryVirtual");
const BzUserBetDuskadumVirtual = require("../models/BzUserBetDuskadumVirtual");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeBet(req) {
  currency = req.user.currency;
  user_id = req.user._id;

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

  eid = req.body.catmid; // catmid = 18.220808091932

  mnam = req.body.teamname; // teamname
  rnr = req.body.bettype; //b =back , l= lay
  rat = req.body.odds;
  amt = req.body.amount; // amount
  let result = {};

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

  if (req.user.role != 8) {
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

    const uid = req.user.uname;
    const upt = req.user.point;
    const uss = session_id();
    const sid = req.body.mid;

    if (mnam.length > 35) {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    if (sid.length > 20) {
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

    typeVal = 1;
    if (mnam == "1-ekka") {
      if (typ == "b") {
        rnr = "b1";
      }
      sid = eid + "-1";
    } else if (mnam == "2-dukki") {
      if (typ == "b") {
        rnr = "b2";
      }
      sid = eid + "-2";
    } else if (mnam == "3-thikki") {
      if (typ == "b") {
        rnr = "b3";
      }
      sid = eid + "-3";
    } else if (mnam == "4-chauki") {
      if (typ == "b") {
        rnr = "b4";
      }
      sid = eid + "-4";
    } else if (mnam == "5-panji") {
      if (typ == "b") {
        rnr = "b5";
      }
      sid = eid + "-5";
    } else if (mnam == "6-chakki") {
      if (typ == "b") {
        rnr = "b6";
      }
      sid = eid + "-6";
    } else if (mnam == "7-satti") {
      if (typ == "b") {
        rnr = "b7";
      }
      sid = eid + "-7";
    } else if (mnam == "8-atthi") {
      if (typ == "b") {
        rnr = "b8";
      }
      sid = eid + "-8";
    } else if (mnam == "9-nehli") {
      if (typ == "b") {
        rnr = "b9";
      }
      sid = eid + "-9";
    } else if (mnam == "10-dassi") {
      if (typ == "b") {
        rnr = "b10";
      }
      sid = eid + "-10";
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    const qdr = await BetDuskadumVirtual.findOne({
      cat_mid: mid,
      evt_od: { $lt: new Date() },
    })
      .select("*")
      .lean();

    if (qdr) {
      const timeLeft = Math.floor((new Date() - new Date(qdr.evt_od)) / 1000);

      stld = qdr.stld;
      match_status = qdr.evt_status;
      //$pending = $qdr['pending'];
      evt_id = qdr.cat_mid;
      cat_sid1 = qdr.cat_sid1;
      cat_sid2 = qdr.cat_sid2;
      cat_sid3 = qdr.cat_sid3;
      cat_sid4 = qdr.cat_sid4;
      cat_sid5 = qdr.cat_sid5;
      cat_sid6 = qdr.cat_sid6;
      cat_sid7 = qdr.cat_sid7;
      cat_sid8 = qdr.cat_sid8;
      cat_sid9 = qdr.cat_sid9;
      cat_sid10 = qdr.cat_sid10;
      timeLeft = qdr.difftm;
    } else {
      result.status = false;
      result.message = "No Betting Time Up!!!";
      return result;
    }

    isBettingEnable = false;

    const dr = await AdmBetStart.findOne({ sno: "1" }).lean();

    isBettingEnable = dr.virtual_duskadum;

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

    //echo $sid.'xxx'.$cat_sid5.'xxx'.$rnr;
    if (
      (sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
      (sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
      (sid == cat_sid3 && rnr == "b3") ||
      (sid == cat_sid4 && rnr == "b4") ||
      (sid == cat_sid5 && rnr == "b5") ||
      (sid == cat_sid6 && rnr == "b6") ||
      (sid == cat_sid7 && rnr == "b7") ||
      (sid == cat_sid8 && rnr == "b8") ||
      (sid == cat_sid9 && rnr == "b9") ||
      (sid == cat_sid10 && rnr == "b10")
    ) {
    } else {
      result.status = false;
      result.message = "Odd not valid";
      return result;
    }

    if (String(match_status).trim() != "OPEN" || stld == 1) {
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

    liverate = 0;

    if (dr && dr.logon == 1) {
      return_array = {};
      return_array.game_name = "t20";
      return_array.result = false;
      json_array = JSON.stringify(return_array);
      const jsonds = await BetDuskadumVirtual.findOne({ cat_mid: eid }).lean();

      if (jsonds) {
        levt_id = jsonds.cat_mid;
        lcat_mid = levt_id;
        lcat_sid1 = lcat_mid + "-1";
        lcat_sid2 = lcat_mid + "-2";
        lcat_sid3 = lcat_mid + "-3";
        lcat_sid4 = lcat_mid + "-4";
        lcat_sid5 = lcat_mid + "-5";
        lcat_sid6 = lcat_mid + "-6";
        lcat_sid7 = lcat_mid + "-7";
        lcat_sid8 = lcat_mid + "-8";
        lcat_sid9 = lcat_mid + "-9";
        lcat_sid10 = lcat_mid + "-10";

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
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid4 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid5 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid6 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid7 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid8 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid9 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
            } else if (typ == "l") {
              liverate = 0;
            } else {
              result.status = false;
              result.message = "Type not valid";
              return result;
            }
          } else if (lcat_sid10 == sid) {
            if (typ == "b") {
              liverate = jsonds.b2;
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
      tc = 0;
      td = 0;
      te = 0;
      tf = 0;
      tg = 0;
      th = 0;
      ti = 0;
      tj = 0;
      ratok = 0;

      if (typ == "b") {
        if (rat <= liverate && liverate > 0 && !empty(liverate)) {
          ratok = 1;
          pro = Math.round((rat - 1) * amt);
          lib = amt;
          if (rnr == "b1") {
            ta = pro;
            tb = -1 * lib;
            tc = -1 * lib;
            td = -1 * lib;
            te = -1 * lib;
            tf = -1 * lib;
            tg = -1 * lib;
            th = -1 * lib;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b2") {
            ta = -1 * lib;
            tb = pro;
            tc = -1 * lib;
            td = -1 * lib;
            te = -1 * lib;
            tf = -1 * lib;
            tg = -1 * lib;
            th = -1 * lib;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b3") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = pro;
            td = -1 * lib;
            te = -1 * lib;
            tf = -1 * lib;
            tg = -1 * lib;
            th = -1 * lib;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b4") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = -1 * lib;
            td = pro;
            te = -1 * lib;
            tf = -1 * lib;
            tg = -1 * lib;
            th = -1 * lib;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b5") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = -1 * lib;
            td = -1 * lib;
            te = pro;
            tf = -1 * lib;
            tg = -1 * lib;
            th = -1 * lib;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b6") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = -1 * lib;
            td = -1 * lib;
            te = -1 * lib;
            tf = pro;
            tg = -1 * lib;
            th = -1 * lib;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b7") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = -1 * lib;
            td = -1 * lib;
            te = -1 * lib;
            tf = -1 * lib;
            tg = pro;
            th = -1 * lib;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b8") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = -1 * lib;
            td = -1 * lib;
            te = -1 * lib;
            tf = -1 * lib;
            tg = -1 * lib;
            th = pro;
            ti = -1 * lib;
            tj = -1 * lib;
          }
          if (rnr == "b9") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = -1 * lib;
            td = -1 * lib;
            te = -1 * lib;
            tf = -1 * lib;
            tg = -1 * lib;
            th = -1 * lib;
            ti = pro;
            tj = -1 * lib;
          }
          if (rnr == "b10") {
            ta = -1 * lib;
            tb = -1 * lib;
            tc = -1 * lib;
            td = -1 * lib;
            te = -1 * lib;
            tf = -1 * lib;
            tg = -1 * lib;
            th = -1 * lib;
            ti = -1 * lib;
            tj = pro;
          }
        } else {
          ratok = 0;
        }
      } else if (typ == "l") {
        if (rat >= liverate && liverate > 0 && liverate) {
          ratok = 1;
          pro = amt;
          lib = round((rat * amt) / 100, 2);
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
        try {
          pointok = 0;

          const drstc = await BzUserBetDuskadumVirtual.findOne({
            cat_mid: mid,
            uname: uid,
            typeMain: typeVal,
          }).lean();

          if (drstc) {
            limit = 0;

            limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
            limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;
            limitc = drstc.lockamt + drstc.rnr3s + dr.bz_balance;
            limitd = drstc.lockamt + drstc.rnr4s + dr.bz_balance;
            limite = drstc.lockamt + drstc.rnr5s + dr.bz_balance;
            limitf = drstc.lockamt + drstc.rnr6s + dr.bz_balance;
            limitg = drstc.lockamt + drstc.rnr7s + dr.bz_balance;
            limith = drstc.lockamt + drstc.rnr8s + dr.bz_balance;
            limiti = drstc.lockamt + drstc.rnr9s + dr.bz_balance;
            limitj = drstc.lockamt + drstc.rnr10s + dr.bz_balance;

            if (rnr == "b1") {
              limit = Math.min(
                limitb,
                limitc,
                limitd,
                limite,
                limitf,
                limitg,
                limith,
                limiti,
                limitj
              );
            }
            if (rnr == "b2") {
              limit = Math.min(
                limita,
                limitc,
                limitd,
                limite,
                limitf,
                limitg,
                limith,
                limiti,
                limitj
              );
            }
            if (rnr == "b3") {
              limit = Math.min(
                limitb,
                limita,
                limitd,
                limite,
                limitf,
                limitg,
                limith,
                limiti,
                limitj
              );
            }
            if (rnr == "b4") {
              limit = Math.min(
                limitb,
                limitc,
                limita,
                limite,
                limitf,
                limitg,
                limith,
                limiti,
                limitj
              );
            }
            if (rnr == "b5") {
              limit = Math.min(
                limitb,
                limitc,
                limita,
                limitd,
                limitf,
                limitg,
                limith,
                limiti,
                limitj
              );
            }
            if (rnr == "b6") {
              limit = Math.min(
                limitb,
                limitc,
                limita,
                limitd,
                limite,
                limitg,
                limith,
                limiti,
                limitj
              );
            }
            if (rnr == "b7") {
              limit = Math.min(
                limitb,
                limita,
                limitc,
                limitd,
                limite,
                limitf,
                limith,
                limiti,
                limitj
              );
            }
            if (rnr == "b8") {
              limit = Math.min(
                limitb,
                limitc,
                limita,
                limitd,
                limite,
                limitf,
                limitg,
                limiti,
                limitj
              );
            }
            if (rnr == "b9") {
              limit = Math.min(
                limitb,
                limitc,
                limita,
                limitd,
                limite,
                limitf,
                limitg,
                limith,
                limitj
              );
            }
            if (rnr == "b10") {
              limit = Math.min(
                limitb,
                limitc,
                limita,
                limitd,
                limite,
                limitf,
                limitg,
                limith,
                limiti
              );
            }

            if (lib <= limit) {
              //update bt_match_teenpatti
              pla = drstc.lockamt;
              nla1 = drstc.rnr1s + ta;
              nla2 = drstc.rnr2s + tb;
              nla3 = drstc.rnr3s + tc;
              nla4 = drstc.rnr4s + td;
              nla5 = drstc.rnr5s + te;
              nla6 = drstc.rnr6s + tf;
              nla7 = drstc.rnr7s + tg;
              nla8 = drstc.rnr8s + th;
              nla9 = drstc.rnr9s + ti;
              nla10 = drstc.rnr10s + tj;

              if (
                Math.min(
                  nla1,
                  nla2,
                  nla3,
                  nla4,
                  nla5,
                  nla6,
                  nla7,
                  nla8,
                  nla9,
                  nla10
                ) < 0
              )
                nla = Math.abs(
                  Math.min(
                    nla1,
                    nla2,
                    nla3,
                    nla4,
                    nla5,
                    nla6,
                    nla7,
                    nla8,
                    nla9,
                    nla10
                  )
                );
              else nla = 0;

              cla = pla - nla;
              pointok = 1;

              maxPL = Math.max(
                nla1,
                nla2,
                nla3,
                nla4,
                nla5,
                nla6,
                nla7,
                nla8,
                nla9,
                nla10
              );
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - +cla >= 0) {
                const updateData = {
                  lockamt: nla,
                };

                await BzUserBetDuskadumVirtual.updateOne(
                  { cat_mid: mid, uname: uid, typeMain: typeVal },
                  {
                    $set: updateData,
                    $inc: {
                      rnr1s: ta,
                      rnr2s: tb,
                      rnr3s: tc,
                      rnr4s: td,
                      rnr5s: te,
                      rnr6s: tf,
                      rnr7s: tg,
                      rnr8s: th,
                      rnr9s: ti,
                      rnr10s: tj,
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
              const drsts = await BetDuskadumVirtual.find({
                cat_mid: mid,
              }).lean();
              if (typeVal == 1) {
                rnr1Val = drsts.cat_rnr1;
                rnr2Val = drsts.cat_rnr2;
                rnr3Val = drsts.cat_rnr3;
                rnr4Val = drsts.cat_rnr4;
                rnr5Val = drsts.cat_rnr5;
                rnr6Val = drsts.cat_rnr6;
                rnr7Val = drsts.cat_rnr7;
                rnr8Val = drsts.cat_rnr8;
                rnr9Val = drsts.cat_rnr9;
                rnr10Val = drsts.cat_rnr10;
              } else if (typeVal == 2) {
                rnr1Val = drsts.cat_rnr3;
                rnr2Val = drsts.cat_rnr4;
              }
              cla = -lib;
              nla = cla2 = lib;

              maxPL = Math.max(ta, tb, tc, td, te, tf, tg, th, ti, tj);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
              }

              if (dr.bz_balance - cla >= 0) {
                pla = 0;
                if (cla2 <= limit_bet) {
                  const newBet = new BzUserBetDuskadumVirtual({
                    cat_mid: mid,
                    uname: uid,
                    rnr1: rnr1Val,
                    rnr1s: ta,
                    rnr2: rnr2Val,
                    rnr2s: tb,
                    rnr3: rnr3Val,
                    rnr3s: tc,
                    rnr4: rnr4Val,
                    rnr4s: td,
                    rnr5: rnr5Val,
                    rnr5s: te,
                    rnr6: rnr6Val,
                    rnr6s: tf,
                    rnr7: rnr7Val,
                    rnr7s: tg,
                    rnr8: rnr8Val,
                    rnr8s: th,
                    rnr9: rnr9Val,
                    rnr9s: ti,
                    rnr10: rnr10Val,
                    rnr10s: tj,
                    lockamt: cla2,
                    rnr1sid: drsts.cat_sid1,
                    rnr2sid: drsts.cat_sid2,
                    rnr3sid: drsts.cat_sid3,
                    rnr4sid: drsts.cat_sid4,
                    rnr5sid: drsts.cat_sid5,
                    rnr6sid: drsts.cat_sid6,
                    rnr7sid: drsts.cat_sid7,
                    rnr8sid: drsts.cat_sid8,
                    rnr9sid: drsts.cat_sid9,
                    rnr10sid: drsts.cat_sid10,
                    typeMain: typeVal,
                    user_id: user_id,
                  });

                  await newBet.save();
                  pointok = 1;
                } else pointok = 3;
              } else pointok = 2;
            } else {
              pointok = 0;
            }
          }

          if (pointok == 1) {
            ///
            await BetDuskadumVirtual.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: "1" } }
            );

            const newBetHistory = new BzUserBetDuskadumHistoryVirtual({
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

            await newBetHistory.save();
            const bet_id = newBetHistory._id;

            st2 = UpdateBalance(req.user._id, cla);
            await pushExposure(req, res, sid, cla, "Dus ka Dum");
            if (st2) {
              balance_point = dr.bz_balance + cla;

              const dt = moment().format("YYYY-MM-DD HH:mm:ss");

              claVal = dr.bz_balance + cla;

              //New Logs
              const userLog = new UserLogs({
                page: "livebet_duskadum",
                linkid: bet_id,
                ptrans: cla,
                otrans: "",
                points: balance_point,
                obal: dr.opin_bal,
                uname: uid,
                date: dt,
                ptype: "bet",
              });

              await userLog.save();

              const notificationData = {
                evt_id: "duskadum",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in duskadum casino games.`,
              };

              const newNotification = new Notifications(notificationData);
              await newNotification.save();

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

module.exports = { placeBet };
