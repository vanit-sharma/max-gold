const mongoose = require("mongoose");
const BzBetCentercardVirtualRate = require("../models/BzBetCentercardVirtualRate");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BtMatchCentercardVirtual = require("../models/BtMatchCentercardVirtual");
const BtMatchCentercardVirtualOther = require("../models/BtMatchCentercardVirtualOther");
const BzUserBetCenterCardVirtualHistory = require("../models/BzUserBetCenterCardVirtualHistory");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

async function placeCenterCardBet(req) {
  let currency = req.user.currency;
  let user_id = req.user._id;
  let min_amount, maxWinning;

  switch (currency) {
    case 1: // INR
      min_amount = 100;
      maxWinning = 10000;
      break;
    case 2: // PKR
      min_amount = 100;
      maxWinning = 100000;
      break;
    case 3: // AED
      min_amount = 2;
      maxWinning = 1000;
      break;
    case 4: // BDT
      min_amount = 500;
      maxWinning = 100000;
      break;
    default:
      return { status: false, message: "Invalid currency" };
  }

  let limitBetResult = await BetLimit.findOne({ user_id }).select("casino");
  let limit_bet = limitBetResult?.casino || 0;

  if (req.user.user_role !== 8) {
    return { status: false, message: "Betting Not allowed!!!" };
  }

  let {
    catmid: eid,
    teamname: mnam,
    bettype: rnr,
    odds: rat,
    amount: amt,
  } = req.body;

  if (amt > limit_bet || amt < min_amount) {
    return {
      status: false,
      message: `min ${min_amount} and max ${limit_bet} point bet allowed`,
    };
  }

  if (rat > 50) {
    return { status: false, message: "Odd not valid" };
  }

  if (
    !eid ||
    !mnam ||
    !rnr ||
    rat <= 0 ||
    amt < min_amount ||
    amt > limit_bet
  ) {
    return {
      status: false,
      message: "Some parameters missing. Please try again.",
    };
  }

  let mid = eid;
  let typ = rnr;
  let uid = req.user.uname;

  let sid, intSid, rateField;
  let lowerMnam = mnam.toLowerCase();

  if (lowerMnam === "center yes") {
    if (typ == "b") {
      rnr = "b1";
    }
    if (typ == "l") {
      rnr = "l1";
    }
    sid = eid + "-1";
    intSid = 1;
    rateField = "b1";
  } else if (lowerMnam === "center no") {
    if (typ == "b") {
      rnr = "b2";
    }
    if (typ == "l") {
      rnr = "l2";
    }
    sid = eid + "-2";
    intSid = 2;
    rateField = "b2";
  } else {
    return { status: false, message: "Runner not valid" };
  }

  let qds = await BzBetCentercardVirtualRate.findOne({
    evt_status: "OPEN",
    cat_mid: mid,
    evt_od: { $lt: new Date() },
  }).lean();

  if (!qds) {
    return { status: false, message: "No Betting Time Up!!!" };
  }

  let { evt_status: match_status, stld, cat_sid1, cat_sid2 } = qds;
  let timeLeft = Math.floor((new Date() - new Date(qds.evt_od)) / 1000);

  let isBettingEnabled = await AdmBetStart.findOne({ sno: 1 }).select(
    "virtual_centercard"
  );

  if (!isBettingEnabled?.virtual_centercard) {
    return { status: false, message: "Betting not open for this casino." };
  }

  if (timeLeft > 30) {
    return { status: false, message: "Bet not placed. Time is up!!" };
  }

  if (
    !(
      (sid === cat_sid1 && (rnr === "l1" || rnr === "b1")) ||
      (sid === cat_sid2 && (rnr === "l2" || rnr === "b2"))
    )
  ) {
    return { status: false, message: "Runner not valid" };
  }

  if (match_status !== "OPEN" || stld === 1) {
    return { status: false, message: "Status not open" };
  }

  let user = await Punter.aggregate([
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
  if (!user || user.logon !== 1) {
    return {
      status: false,
      message: "Unable to place this bet. Kindly login again.",
    };
  }

  let { bz_balance } = user;

  if (amt > bz_balance) {
    return { status: false, message: "Insufficient funds!!" };
  }

  let returnArray = {
    game_name: "dt_virtual",
    result: false,
  };
  let jsonArray = JSON.stringify(returnArray);

  let jsonds = await BzBetCentercardVirtualRate.findOne({
    cat_mid: eid,
  }).lean();

  if (jsonds) {
    let lcat_mid = jsonds.cat_mid;
    let levt_id = lcat_mid;

    let lcat_rnr2_status = jsonds.data?.t2?.[1]?.gstatus;

    if (String(lcat_mid).trim() === String(eid).trim()) {
      if (typ === "b") {
        let liverate = jsonds[rateField];
      } else {
        return {
          status: false,
          message: "Round not open",
        };
      }
    } else {
      return {
        status: false,
        message: "Round not open",
      };
    }
  }

  ta = 0;
  tb = 0;
  tc = 0;
  td = 0;

  let ratok = 0;
  let pro = 0;
  let lib = 0;
  if (typ === "b") {
    if (rat <= liverate && liverate > 0 && liverate) {
      ratok = 1;
      pro = Math.round(rat * amt - amt);
      lib = amt;
      if (rnr === "b1") {
        ta += pro;
        tb -= lib;
        tc -= lib;
        td -= lib;
      }
      if (rnr === "b2") {
        ta -= lib;
        tb += pro;
        tc -= lib;
        td -= lib;
      }
      if (rnr === "b3") {
        ta -= lib;
        tb -= lib;
        tc += pro;
        td -= lib;
      }
      if (rnr === "b4") {
        ta -= lib;
        tb -= lib;
        tc -= lib;
        td += pro;
      }
    } else {
      ratok = 0;
    }
  } else if (typ === "l") {
    if (rat >= liverate && liverate > 0 && liverate) {
      ratok = 1;
      pro = amt;
      lib = Math.round(rat * amt - amt);
      if (rnr === "l1") {
        ta -= lib;
        tb += pro;
        tc += pro;
        td += pro;
      }
      if (rnr === "l2") {
        ta += pro;
        tb -= lib;
        tc += pro;
        td += pro;
      }
      if (rnr === "l3") {
        ta += pro;
        tb += pro;
        tc -= lib;
        td += pro;
      }
      if (rnr === "l4") {
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
      let drstc = await BtMatchCentercardVirtual.findOne({
        cat_mid: mid,
        user_id: req.user._id,
      }).lean();
      if (drstc) {
        limit = 0;

        limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
        limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;
        limitc = drstc.lockamt + drstc.rnr3s + dr.bz_balance;
        limitd = drstc.lockamt + drstc.rnr4s + dr.bz_balance;

        if (rnr == "b1") {
          limit = Math.min(limitb, limitc, limitd);
        }
        if (rnr == "b2") {
          limit = Math.min(limita, limitc, limitd);
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
          pla = drstc.lockamt;
          nla1 = drstc.rnr1s + ta;
          nla2 = drstc.rnr2s + tb;
          nla3 = drstc.rnr3s + tc;
          nla4 = drstc.rnr4s + td;

          if (Math.min(nla1, nla2) < 0) {
            nla = Math.abs(Math.min(nla1, nla2));
          } else {
            nla = 0;
          }

          cla = pla - nla;
          pointok = 1;

          maxPL = Math.max(nla1, nla2);
          if (maxPL > maxWinning) {
            result.status = false;
            result.message = "Max Winning Limit " + maxWinning;
            return result;
          }

          if (dr.bz_balance - cla >= 0) {
            await BtMatchCentercardVirtual.updateOne(
              { cat_mid: mid, user_id: req.user._id },
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
          } else {
            pointok = 2;
          }
        } else {
          pointok = 0;
        }
      } else {
        if (lib <= dr.bz_balance) {
          let drsts = await BzBetCentercardVirtualRate.findOne({
            cat_mid: mid,
          }).lean();

          cla = -lib;
          nla = cla2 = lib;

          maxPL = Math.max(ta, tb);
          if (maxPL > maxWinning) {
            result.status = false;
            result.message = "Max Winning Limit " + maxWinning;
            return result;
          }

          if (dr.bz_balance - cla >= 0) {
            pla = 0;
            if (cla2 <= limit_bet) {
              sti = await BtMatchCentercardVirtual.create({
                cat_mid: mid,
                uname: uid,
                rnr1: drsts.cat_rnr1,
                rnr1s: ta,
                rnr2: drsts.cat_rnr2,
                rnr2s: tb,
                lockamt: cla2,
                rnr1sid: drsts.cat_sid1,
                rnr2sid: drsts.cat_sid2,
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

      if (pointok == 1) {
        ///
        await BzBetCentercardVirtualRate.updateOne(
          { evt_id: mid },
          { $set: { is_bet_place: "1" } }
        );
        ///

        let betHistory = await BzUserBetCenterCardVirtualHistory.create({
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
          sid: intSid,
          user_id: req.user._id,
        });

        let bet_id = betHistory._id;
        let st2 = UpdateBalance(req.user._id, cla);
        await pushExposure(req, res, sid, cla, "Center Card Virtual");
        if (st2) {
          let balance_point = dr.bz_balance + cla;
          let dt = new Date().toISOString().slice(0, 19).replace("T", " ");

          $claVal = $dr[0]["bz_balance"] + $cla;

          //New Logs
          await UserLogs.create({
            page: "livebet_centercard_virtual",
            linkid: bet_id,
            ptrans: cla,
            otrans: "",
            points: balance_point,
            obal: dr.opin_bal,
            uname: uid,
            date: new Date(),
            ptype: "bet",
          });

          let notificationsData = {
            evt_id: "Center Card Virtual",
            user_id: req.user._id,
            game_type: "6",
            description: `${uid} placed bet on ${mnam} in Center Card Virtual casino games.`,
          };
          await Notifications.create(notificationsData);
          result.status = true;
          result.message = "Bet Placed.";
          return result;
        } else {
          result.status = false;
          result.message = "Bet error while placing bet";
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
    } catch (error) {
      //$db->rollBack();
      result.status = false;
      result.message = "Bet Error Roll back.";
      return $result;
    }
  } else {
    $result["status"] = false;
    $result["message"] = "Live rate not matched.";
    return $result;
  }
}

async function placeCenterCardBetFancy(req) {
  let user_id = req.user._id;
  let currency = req.session.currency;
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
  let limitBetResult = await BetLimit.findOne({ user_id }).select("casino");
  let limit_bet = limitBetResult.casino;

  if (req.user.user_role != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  let {
    catmid: eid,
    teamname: mnam,
    bettype: rnr,
    odds: rat,
    amount: amt,
  } = req.body;

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

  if (eid && mnam && rnr && rat > 0 && amt >= min_amount && amt <= limit_bet) {
    let mid = req.body.catmid; // catmid = 18.220808091932
    let typ = req.body.bettype; // b = back, l = lay
    let rnr = req.body.bettype;
    let rat = req.body.odds;
    let amt = req.body.amount;

    let rateField = "";
    if (mnam == "center even") {
      new_sid = 5;
      rateField = "b5";
    } else if (mnam == "center odd") {
      new_sid = 6;
      rateField = "b6";
    } else if (mnam == "center red") {
      new_sid = 7;
      rateField = "b7";
    } else if (mnam == "center black") {
      new_sid = 8;
      rateField = "b8";
    } else if (mnam == "left even") {
      new_sid = 22;
      rateField = "b10";
    } else if (mnam == "left odd") {
      new_sid = 23;
      rateField = "b11";
    } else if (mnam == "left red") {
      new_sid = 24;
      rateField = "b12";
    } else if (mnam == "left black") {
      new_sid = 25;
      rateField = "b13";
    } else if (mnam == "right even") {
      new_sid = 26;
      rateField = "b26";
    } else if (mnam == "right odd") {
      new_sid = 27;
      rateField = "b27";
    } else if (mnam == "right red") {
      new_sid = 28;
      rateField = "b28";
    } else if (mnam == "right black") {
      new_sid = 29;
      rateField = "b29";
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    intSid = new_sid;
    new_compare_sid = mid + "-" + new_sid;
    sid = new_compare_sid;
    typ = "b";
    uid = req.user.uname;
    upt = req.user.point;

    if (typ == "b") {
      rnr = "b1";
    }

    let qdr = await BzBetCentercardVirtualRate.findOne({
      evt_status: "OPEN",
      cat_mid: mid,
      evt_od: { $lt: new Date() },
    }).lean();

    if (qdr) {
      stld = qdr.stld;
      match_status = qdr.evt_status;
      evt_id = qdr.cat_mid;
      cat_sid1 = qdr.cat_sid1;
      cat_sid2 = qdr.cat_sid2;
      timeLeft = qdr.difftm;
    } else {
      result.status = false;
      result.mid = mid;
      result.message = "This Round is closed";
      return result;
    }

    let isBettingEnable = false;
    let dr = await AdmBetStart.findOne({ sno: 1 }).select(
      "virtual_centercard"
    );
    isBettingEnable = dr.virtual_centercard;

    if (isBettingEnable == false) {
      result.status = false;
      result.message = "Betting not open for this casino.";
      return result;
    }

    if (timeLeft > 30) {
      result.status = false;
      result.message = "Bet not placed. Time is up!!";
      return result;
    }

    if (trim(match_status) != "OPEN" || stld == 1) {
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
      let returnArray = {
        game_name: "dt_virtual",
        result: false,
      };
      let jsonArray = JSON.stringify(returnArray);
      //$jsonds = get_casino_games_data($json_array);
      let jsonds = await BzBetCentercardVirtualRate.findOne({
        cat_mid: eid,
      }).lean();
      let liverate = 0;

      if (jsonds) {
        let lcat_mid = jsonds.cat_mid;
        let levt_id = lcat_mid;

        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          let t2Array = jsonds;
          let arrlength = t2Array.length;
          //echo $lcat_mid."--".$evt_id."-".$arrlength;
          let isMatch = false;
          if (arrlength > 0) {
            for (let x = 0; x < arrlength; x++) {
              let obj = t2Array[x];
              if (typ == "b") {
                rateField2 = rateField;
                if (rateField == "b26") {
                  rateField2 = "b10";
                }
                if (rateField == "b27") {
                  rateField2 = "b11";
                }
                if (rateField == "b28" || rateField == "b29") {
                  rateField2 = "b12";
                }

                liverate = obj[rateField2];
                isMatch = true;
                break;
              }
            }
          }

          if (!isMatch) {
            result.status = false;
            result.message = "Round not open";
            return result;
          }
        }
      }

      let ta = 0;
      let tb = 0;
      let tc = 0;
      let td = 0;

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

          let drstc = await BtMatchCentercardVirtualOther.findOne({
            mid_mid: mid,
            uname: uid,
            rnr_nam: mnam,
          }).lean();
          if (drstc) {
            if (dr.bz_balance > lib) {
              maxPL = Math.max(ta, tb);
              if (maxPL > maxWinning) {
                result.status = false;
                result.message = "Max Winning Limit " + maxWinning;
                return result;
                exit;
              }

              pointok = 1;

              await BtMatchCentercardVirtualOther.updateOne(
                { mid_mid: mid, user_id: req.user._id, rnr_nam: mnam },
                {
                  $inc: {
                    bak: ta,
                    lay: tb,
                    lockamt: lib,
                  },
                }
              );
            } else {
              pointok = 0;
            }
          } else {
            if (lib <= dr.bz_balance) {
              let drsts = await BzBetCentercardVirtualRate.findOne({
                cat_mid: mid,
              }).lean();

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
                  await BtMatchCentercardVirtualOther.create({
                    mid_mid: mid,
                    uname: uid,
                    rnr_nam: mnam,
                    rnr_sid: sid,
                    bak: pro,
                    lay: cla,
                    lockamt: cla2,
                    evt_id: mid,
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

          if (pointok == 1) {
            ///
            await BzBetCentercardVirtualRate.updateOne(
              { evt_id: mid },
              { $set: { is_bet_place: "1" } }
            );
            ///

            cla = -lib;

            let betHistory = await BzUserBetCenterCardVirtualHistory.create({
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
              sid: intSid,
              user_id: user_id,
            });
            let bet_id = betHistory._id;

            st2 = UpdateBalance(uid, cla);
            await pushExposure(req, res, sid, cla, "Center Card Virtual");
            if (st2) {
              balance_point = dr.bz_balance + cla;

              let dt = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

              claVal = dr.bz_balance + cla;

              //New Logs
              await UserLogs.create({
                page: "livebet_centercard_virtual",
                linkid: bet_id,
                ptrans: cla,
                otrans: "",
                points: claVal,
                obal: dr.opin_bal,
                uname: uid,
                date: new Date(),
                ptype: "bet",
              });

              let notificationsData = {
                evt_id: "Center Card Virtual",
                user_id: req.user._id,
                game_type: "6",
                description: `${uid} placed bet on ${mnam} in Center Card Virtual casino games.`,
              };
              await Notifications.create(notificationsData);

              result.status = true;
              result.message = "Bet Placed.";
              return result;
            } else {
              result.status = false;
              result.message = "Bet error while placing bet";
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

module.exports = { placeCenterCardBet, placeCenterCardBetFancy };
