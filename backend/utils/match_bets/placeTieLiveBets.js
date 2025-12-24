const mongoose = require("mongoose");
const useragent = require("express-useragent");
const { body, validationResult } = require("express-validator");
const getSportsLimit = require("../../lib/getSportsLimit");
const Punter = require("../../models/Punter");
const AdmBetStart = require("../../models/AdmBetStart");
const BetfairEvent = require("../../models/BetfairEvent");
const BetlockByMarket = require("../../models/BetlockByMarket.js");
const BetLock = require("../../models/BetLock.js");
const BtBet = require("../../models/BtBets.js");

const moment = require("moment");
const {
  getUserHierarchy,
  get_user_latest_points_byid,
  UpdateBalance,
  createLog,
  getBetfairData,
  pushExposure,
  getPunterSharing
} = require("../function.js");
const BetfairEventBets = require("../../models/BetfairEventBets.js");
const MatchBz = require("../../models/MatchBz.js");
const UserLogs = require("../../models/UserLogs.js");
const LiveNotifications = require("../../models/LiveNotifications.js");

const validatePlaceTieLiveBets = [
  body("childId")
    .trim()
    .notEmpty()
    .withMessage("Child ID is required")
    .isLength({ max: 20 })
    .withMessage("Child ID must be <= 20 characters"),

  body("bet_type")
    .trim()
    .notEmpty()
    .withMessage("Bet type is required")
    .isLength({ max: 10 })
    .withMessage("Type not valid"),

  body("sid")
    .notEmpty()
    .withMessage("SID is required")
    .isLength({ max: 15 })
    .withMessage("Team Name Not Valid"),

  body("odds")
    .notEmpty()
    .withMessage("Odds are required")
    .bail()
    .isLength({ max: 7 })
    .withMessage("We are not accepting bet on this Odds")
    .toFloat()
];

const placeTieLiveBets = async (req, res) => {
  await Promise.all(
    validatePlaceTieLiveBets.map((validation) => validation.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    bet_type: type,
    odds,
    amount,
    catmid: parent_cat_mid,
    sid: cat_sid,
    delay,
    market_type: market_type_post
  } = req.body;

  if (market_type_post == "tie") {
    market_type = "tie";
    market_type_value = 5;
  } else {
    market_type = "toss";
    market_type_value = 4;
  }

  let ta = 0;
  let tb = 0;
  let tc = 0;
  let pro = 0;
  let lib = 0;
  let cat_sid1 = 0;
  let cat_sid2 = 0;
  let cat_sid3 = 0;
  let after_bet_balance = 0;
  let nla3;
  let summery_id = 0;
  let bet_game_type = 2;
  let source = req.headers["user-agent"];
  let ua = useragent.parse(source);

  const dvc = JSON.stringify({
    browser: ua.browser,
    os: ua.os,
    platform: ua.platform,
    isMobile: ua.isMobile,
    uaString: ua.source,
    ipAddress:
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress
  });

  let ip_address =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  let currency = req.user.currency;

  if (req.user.custom_role == "admin" || req.user.user_role != 8) {
    return res.status(403).json({
      status: false,
      message: "Betting Not allowed!!!"
    });
  }

  let mat_mlimit = null;
  let min_amount = null;
  let maxWinning = null;
  let rte = "o";
  let liverate = "0";

  const tossEvent = await BetfairEvent.findOne({
    parent_cat_mid: parent_cat_mid
  });

  const mid = tossEvent ? tossEvent.cat_mid : 0;

  if (currency == 1 || currency == 2) {
    min_amount = getSportsLimit("tie_min", req.user._id);
    mat_mlimit = 200000;
    maxWinning = 200000;
  } else {
    mat_mlimit = 2000;
    maxWinning = 2000;
    min_amount = getSportsLimit("tie_min", req.user._id);
  }

  const controls = await Punter.findOne({ _id: req.user._id })
    .select("f_enable c_enble t_enable")
    .lean();

  if (controls.c_enble == 0) {
    return res.status(403).json({
      status: false,
      message: "Bet not allow for your account.."
    });
  }

  const admBet = await AdmBetStart.findOne({ sno: "1" }).lean();
  if (admBet && !admBet?.IsBettingStart) {
    return res.status(403).json({
      status: false,
      message: "Betting not open for this match."
    });
  }

  if (amount < min_amount) {
    return res.status(403).json({
      status: false,
      message: "Minimum Amount should be " + min_amount
    });
  }
  if (amount > mat_mlimit) {
    return res.status(403).json({
      status: false,
      message: "Max Size is: " + mat_mlimit
    });
  }

  const betfairEvents = await BetfairEvent.findOne({
    cat_mid: mid
  }).lean();

  if (betfairEvents) {
    if (!betfairEvents.is_bet_accept) {
      return res.status(403).json({
        status: false,
        message: "Not accepting bet on events."
      });
    }

    if (betfairEvents.inplayStatus == 0) {
      return res.status(403).json({
        status: false,
        message: "Please place bet when event Inplay."
      });
    }

    const tieLock = await BetLock.findOne({ user_id: req.user._id })
      .select("cric_tie")
      .lean();

    if (tieLock && tieLock.cric_tie == 0) {
      return res.status(403).json({
        status: false,
        message:
          "Your betting is locked for this market. Please contact your upline."
      });
    }
    match_typ = betfairEvents.match_typ;
    evt_type = betfairEvents.evt_api_type;
    match_status = betfairEvents.match_status;
    pending = betfairEvents.pending;
    cat_sid1 = betfairEvents.cat_sid1;
    cat_sid2 = betfairEvents.cat_sid2;
    cat_sid3 = betfairEvents.cat_sid3;

    runner1Name = betfairEvents.cat_rnr1;
    runner2Name = betfairEvents.cat_rnr2;
    runner3Name = betfairEvents.cat_rnr3;

    evt_id = betfairEvents.evt_id;

    game_type = betfairEvents.game_type; // 1 => Cricket , 2 => Football , 3 => Tennis

    is_bm_on = 0;
    eventName = betfairEvents.evt_evt;

    const userFilterId = req.user._id.toString();
    // build a RegExp that matches either start‐of‐string or comma before the id,
    // and comma or end‐of‐string after
    const userRegex = new RegExp(`(^|,)${userFilterId}(,|$)`);
    const marketBetLock = await BetlockByMarket.find({
      market_type: 5,
      cat_mid: mid,
      selected_users: {
        $in: userRegex
      }
    }).lean();

    if (marketBetLock.length) {
      return res.status(403).json({
        status: false,
        message: "Bet not allowed in this market"
      });
    }

    section = "";
    if (type.toUpperCase() == "B") {
      if (cat_sid == cat_sid1) {
        rnr = "b1";
        section = runner1Name;
      } else if (cat_sid == cat_sid2) {
        rnr = "b2";
        section = runner2Name;
      } else {
        rnr = "b3";
        section = runner3Name;
      }
    } else {
      if (cat_sid == cat_sid1) {
        rnr = "l1";
        section = runner1Name;
      } else if (cat_sid == cat_sid2) {
        rnr = "l2";
        section = runner2Name;
      } else {
        rnr = "l3";
        section = runner3Name;
      }
    }
  } else {
    return res.status(403).json({
      status: false,
      message: "Event Not Open"
    });
  }

  if (
    (cat_sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
    (cat_sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
    (cat_sid == cat_sid3 && (rnr == "l3" || rnr == "b3"))
  ) {
  } else {
    return res.status(403).json({
      status: false,
      message: "parameter not valid."
    });
  }

  const cntBet = await BtBet.countDocuments({
    user_id: req.user._id,
    cat_mid: mid,
    evt_id: evt_id,
    bet_type: market_type
  });

  if (cntBet >= 10 && game_type == 1) {
    return res.status(403).json({
      status: false,
      message: "Bet Limit Exceeded"
    });
  }

  const userHistoryQuery = await Punter.aggregate([
    { $match: { _id: req.user._id } },

    // Simple $lookup (single equality join)
    {
      $lookup: {
        from: "bz_user_login_history",
        localField: "_id",
        foreignField: "userAutoId",
        as: "loginHistory"
      }
    },

    // Keep only entries where login === '1'
    {
      $addFields: {
        loginHistory: {
          $filter: {
            input: "$loginHistory",
            as: "lh",
            cond: { $eq: ["$$lh.login", "1"] } // change to 1 if it's numeric
          }
        }
      }
    },

    { $unwind: { path: "$loginHistory", preserveNullAndEmptyArrays: true } },

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
        "loginHistory.site_toke": 1
      }
    },

    { $limit: 1 }
  ]);

  if (userHistoryQuery && evt_id != "") {
    const full_chain = userHistoryQuery[0].full_chain;

    const sponsor = userHistoryQuery[0].sponsor;
    const sponser_id = userHistoryQuery[0].sponser_id;

    if (
      userHistoryQuery[0].stat == 1 &&
      userHistoryQuery[0].bet_status == 1 &&
      userHistoryQuery[0].user_role == 8
    ) {
      let punterSharing = await getPunterSharing(req.user._id);

      //console.log("mid->",mid);
      jsonds = await getBetfairData(mid);
      //console.log("api_response->",jsonds);

      let b1Rate = 0;
      let l1Rate = 0;

      let b2Rate = 0;
      let l2Rate = 0;

      let b3Rate = 0;
      let l3Rate = 0;

      if (jsonds != "ER101" && jsonds != "") {
        api_response = jsonds;

        //console.log("api_response->",api_response);

        r2 = jsonds[0].result[0].inplay;
        t0 = jsonds[0].result[0].status;
        t1 = jsonds[0].result[0].numberOfRunners;

        if (t0 == "OPEN") {
          for (k = 0; k < jsonds[0].result[0].runners.length; k++) {
            if (jsonds[0].result[0].runners[k].selectionId == cat_sid) {
              if (type.toUpperCase() == "B") {
                liverate =
                  jsonds[0].result[0].runners[k].ex.availableToBack[0].price;
              } else if (type.toUpperCase() == "L") {
                liverate =
                  jsonds[0].result[0].runners[k].ex.availableToLay[0].price;
              } else {
                return res.status(403).json({
                  status: false,
                  message: "Odd not match"
                });
              }
            }
          }

          if (
            jsonds[0]?.result[0]?.runners[0]?.ex?.availableToBack?.[0]
              ?.price !== undefined
          ) {
            b1Rate = jsonds[0].result[0].runners[0].ex.availableToBack[0].price;
          }

          if (
            jsonds[0]?.result[0]?.runners[0]?.ex?.availableToLay?.[0]?.price !==
            undefined
          ) {
            l1Rate = jsonds[0].result[0].runners[0].ex.availableToLay[0].price;
          }

          if (
            jsonds[0]?.result[0]?.runners[1]?.ex?.availableToBack?.[0]
              ?.price !== undefined
          ) {
            b2Rate = jsonds[0].result[0].runners[1].ex.availableToBack[0].price;
          }

          if (
            jsonds[0]?.result[0]?.runners[1]?.ex?.availableToLay?.[0]?.price !==
            undefined
          ) {
            l2Rate = jsonds[0].result[0].runners[1].ex.availableToLay[0].price;
          }

          if (t1 === 3) {
            if (
              jsonds[0]?.result[0]?.runners[2]?.ex?.availableToBack?.[0]
                ?.price !== undefined
            ) {
              b3Rate =
                jsonds[0].result[0].runners[2].ex.availableToBack[0].price;
            }

            if (
              jsonds[0]?.result[0]?.runners[2]?.ex?.availableToLay?.[0]
                ?.price !== undefined
            ) {
              l3Rate =
                jsonds[0].result[0].runners[2].ex.availableToLay[0].price;
            }
          }
        }
      }

      // console.log("liverate->",liverate);

      if (liverate > 10 || liverate < 1.01) {
        return res.status(403).json({
          status: false,
          message: "Maximum Bet Accept odd is 10.00"
        });
      }

      if (liverate > 20) {
        return res.status(403).json({
          status: false,
          message: "We are not accepting bet on this odd min odd 1.01 and 20"
        });
      }

      if (type.toUpperCase() == "B") {
        // remove this below, I am hardcoding it for testing
        //  liverate = 1.5;

        if (odds <= liverate && liverate != 0) {
          if (!liverate) {
            ratok = 10;
          } else {
            ratok = 1;
            pro = liverate * amount - amount;
            lib = amount;
            liverate = odds;

            if (rnr == "b1") {
              ta += pro;
              tb -= lib;
              tc -= lib;
            }
            if (rnr == "b2") {
              ta -= lib;
              tb += pro;
              tc -= lib;
            }
            if (rnr == "b3") {
              ta -= lib;
              tb -= lib;
              tc += pro;
            }
          }
        } else {
          ratok = 11;
        }
      }

      if (type.toUpperCase() == "L") {
        //if(odds == liverate && liverate!=0)
        //liverate = 1.0;

        if (odds >= liverate && liverate != 0) {
          if (!liverate) {
            ratok = 12;
          } else {
            ratok = 1;

            pro = amount;
            lib = odds * amount - amount;
            liverate = odds;

            if (rnr == "l1") {
              ta -= lib;
              tb += pro;
              tc += pro;
            }
            if (rnr == "l2") {
              ta += pro;
              tb -= lib;
              tc += pro;
            }
            if (rnr == "l3") {
              ta += pro;
              tb += pro;
              tc -= lib;
            }
          }
        } else {
          ratok = 13;
        }
      }

      if (r2 == 1) {
        inp = "1";
      } else {
        inp = "0";
      }

      max_expouser = 20000;
      if (pro > max_expouser || lib > max_expouser) {
        return res.status(403).json({
          status: false,
          message: "Match Max Limit :" + max_expouser
        });
      }

      if (ratok == 1) {
        pointok = 0;
        summery_id = 0;
        master_link = getUserHierarchy(req.user._id);

        if (rte == "o") {
          const drstc = await BetfairEventBets.findOne({
            cat_mid: mid,
            user_id: req.user._id,
            market_type: market_type_value
          }).lean();

          if (drstc) {
            summery_id = drstc._id;

            limit = 0;
            if (t1 == 2) {
              limita =
                Number(drstc.lockamt) +
                Number(drstc.rnr1s) +
                Number(userHistoryQuery[0].bz_balance);
              limitb =
                Number(drstc.lockamt) +
                Number(drstc.rnr2s) +
                Number(userHistoryQuery[0].bz_balance);

              if (rnr == "b1") {
                limit = limitb;
              }
              if (rnr == "b2") {
                limit = limita;
              }

              if (rnr == "l1") {
                limit = limita;
              }
              if (rnr == "l2") {
                limit = limitb;
              }
            }

            if (t1 == 3) {
              limita =
                Number(drstc.lockamt) +
                Number(drstc.rnr1s) +
                Number(userHistoryQuery[0].bz_balance);
              limitb =
                Number(drstc.lockamt) +
                Number(drstc.rnr2s) +
                Number(userHistoryQuery[0].bz_balance);
              limitc =
                Number(drstc.lockamt) +
                Number(drstc.rnr3s) +
                Number(userHistoryQuery[0].bz_balance);

              if (rnr == "b1") {
                if (limitb <= limitc) {
                  limit = limitb;
                } else {
                  limit = limitc;
                }
              }
              if (rnr == "b2") {
                if (limita <= limitc) {
                  limit = limita;
                } else {
                  limit = limitc;
                }
              }
              if (rnr == "b3") {
                if (limita <= limitb) {
                  limit = limita;
                } else {
                  limit = limitb;
                }
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
            }

            if (lib <= limit) {
              //update bz_betfair_events_bets
              pla = drstc.lockamt;
              nla1 = Number(drstc.rnr1s) + Number(ta);
              nla2 = Number(drstc.rnr2s) + Number(tb);

              if (t1 == 2) {
                if (Math.min(nla1, nla2) < 0) {
                  nla = Math.abs(Math.min(nla1, nla2));
                } else {
                  nla = 0;
                }
              }

              if (t1 == 3) {
                nla3 = Number(drstc.rnr3s) + Number(tc);

                if (Math.min(nla1, nla2, nla3) < 0) {
                  nla = Math.abs(Math.min(nla1, nla2, nla3));
                } else {
                  nla = 0;
                }
              }
              cla = pla - nla;
              pointok = 1;

              /*
              if (nla > max_expouser) {
                return res.status(403).json({
                  status: false,
                  message: "Max Expouser Limit: " + max_expouser,
                });
              }
              */

              maxPL = Math.max(nla1, nla2, nla3);

              if (maxPL > maxWinning) {
                return res.status(403).json({
                  status: false,
                  message: "Max Winning Limit: " + maxWinning
                });
              }

              if (userHistoryQuery[0].bz_balance - cla >= 0) {
                if (ta < 0) {
                  taVal = Number(drstc.rnr1s) + Number(ta);
                } else {
                  taVal = Number(drstc.rnr1s) + Number(ta);
                }

                if (tb < 0) {
                  rnr2s = Number(drstc.rnr2s) + Number(tb);
                } else {
                  rnr2s = Number(drstc.rnr2s) + Number(tb);
                }

                if (tc < 0) {
                  rnr3s = Number(drstc.rnr3s) + Number(tc);
                } else {
                  rnr3s = Number(drstc.rnr3s) + Number(tc);
                }

                await BetfairEventBets.updateOne(
                  {
                    cat_mid: mid,
                    uname: req.user.uname,
                    user_id: req.user._id,
                    market_type: market_type_value,
                    bet_game_type: 1
                  },
                  {
                    $set: {
                      rnr1s: taVal,
                      rnr2s: rnr2s,
                      rnr3s: rnr3s,
                      lockamt: nla
                    }
                  }
                );

                const stm = await MatchBz.updateOne(
                  {
                    cat_mid: mid,
                    uname: req.user.uname,
                    user_id: req.user._id,
                    market_type: market_type_value
                  },
                  {
                    $set: {
                      rnr1s: taVal,
                      rnr2s: rnr2s,
                      rnr3s: rnr3s,
                      lockamt: nla
                    }
                  }
                );

                book_lock_amount = nla;

                const drBetBook = await BetfairEventBets.findOne({
                  cat_mid: mid,
                  uname: req.user.uname,
                  user_id: req.user._id,
                  market_type: market_type_value
                }).lean();

                team1_book = drBetBook.rnr1s;
                team2_book = drBetBook.rnr2s;
                team3_book = drBetBook.rnr3s;

                //redis-book
                const userBook = {};
                userBook.uname = req.user.uname;
                userBook.rnr1s = parseInt(team1_book);
                userBook.rnr2s = parseInt(team2_book);
                userBook.rnr3s = parseInt(team3_book);
                userBook.mid = mid;
                userBook.lock = parseInt(nla);
                userBook.full_chain = full_chain;
                userBook.sponsor = sponsor;
                userBook.sponser_id = sponser_id;
                userBook.market_type = market_type_value;
                userBook.game_type = 1;
                userBook.user_id = req.user._id;
                userBook.master_link = master_link;

                const redis_key = `${req.user._id}_${mid}`;
                // $this->redis->setData($redis_key,16,json_encode($userBook));
                // $this->redis->setBookData($mid,$userid,json_encode($userBook));
              } else {
                pointok = 2;
              }
            } else {
              pointok = 0;
            }
          } else {
            if (lib <= userHistoryQuery[0].bz_balance) {
              cla = -lib;
              cla2 = lib;
              /*
              if (cla2 > max_expouser) {
                return res.status(403).json({
                  status: false,
                  message: "Max Expouser Limit:" + max_expouser,
                });
              }*/

              if (userHistoryQuery[0].bz_balance - cla >= 0) {
                team1_book = ta;
                team2_book = tb;
                team3_book = tc;
                book_lock_amount = cla2;

                const betData = {
                  cat_mid: mid,
                  uname: req.user.uname,
                  rnr1: betfairEvents.cat_rnr1,
                  rnr1s: ta,
                  rnr2: betfairEvents.cat_rnr2,
                  rnr2s: tb,
                  rnr3: betfairEvents.cat_rnr3 || 0,
                  rnr3s: tc,
                  market_type: market_type_value,
                  bet_game_type: 1,
                  lockamt: cla2,
                  rnr1sid: betfairEvents.cat_sid1,
                  rnr2sid: betfairEvents.cat_sid2,
                  rnr3sid: betfairEvents.cat_sid3 || " ",
                  user_id: req.user._id,
                  parent_cat_mid: parent_cat_mid,
                  event_name: eventName,
                  punterSharing: punterSharing
                };

                const createdBet = await BetfairEventBets.create(betData);
                summery_id = createdBet._id;

                //redis-book

                const userBook = {
                  uname: req.user.uname,
                  rnr1s: parseInt(ta),
                  rnr2s: parseInt(tb),
                  rnr3s: parseInt(tc),
                  mid: mid,
                  lock: parseInt(book_lock_amount),
                  full_chain: full_chain,
                  sponsor: sponsor,
                  sponser_id: sponser_id,
                  market_type: market_type_value,
                  game_type: 1,
                  user_id: req.user._id,
                  master_link: master_link
                };

                const redis_key = `${req.user._id}_${mid}`;
                // $this->redis->setData($redis_key,16,json_encode($userBook));
                // $this->redis->setBookData($mid,$userid,json_encode($userBook));
                pointok = 1;
              } else {
                pointok = 2;
              }
            } else {
              pointok = 0;
            }
          }
        }

        if (pointok == 1) {
          after_bet_balance = await get_user_latest_points_byid(req.user._id);
          bet_market_type = 1;
          // Prepare bet data for BtBet model
          const bt_bets_data = {
            uname: req.user.uname,
            user_id: req.user._id,
            cat_mid: mid,
            rnr: rnr,
            rate: liverate,
            amnt: amount,
            pro: pro,
            lib: lib,
            inplay: inp,
            type: type,
            cla: cla,
            rnrsid: cat_sid,
            evt_id: evt_id,
            bet_type: market_type,
            bet_summery_id: summery_id,
            section: section,
            ip_address: ip_address,
            after_bet_balance: after_bet_balance,
            team1_book: team1_book,
            team2_book: team2_book,
            team3_book: team3_book,
            bet_market_type: bet_market_type,
            book_lock_amount: book_lock_amount,
            parent_cat_mid: parent_cat_mid,
            b1: b1Rate,
            l1: l1Rate,
            b2: b2Rate,
            l2: l2Rate,
            b3: b3Rate,
            l3: l3Rate,
            game_type: 1
          };

          const createdBet = await BtBet.create(bt_bets_data);
          const bet_id = createdBet._id;

          // Update user balance
          const st2 = await UpdateBalance(req.user._id, cla);
          await pushExposure(req, res, mid, cla, eventName);

          bt_bets_data.full_chain = full_chain;
          bt_bets_data.sponsor = sponsor;
          bt_bets_data.sponser_id = sponser_id;
          bt_bets_data.g_type = 2;
          bt_bets_data.master_link = master_link;
          bt_bets_data.bet_auto_id = bet_id;
          bt_bets_data.bet_time = moment().format("YYYY-MM-DD HH:mm:ss");

          // $this->redis->setBetList($parent_cat_mid,$bet_id,json_encode($bt_bets_data));

          if (st2) {
            const balance_point = userHistoryQuery[0].bz_balance + cla;
            const dt = moment().format("YYYY-MM-DD HH:mm:ss");

            // Log user action
            const logData = {
              user_id: req.user._id,
              page: "livebet",
              linkid: bet_id,
              ptrans: cla,
              otrans: "",
              points: balance_point,
              obal: userHistoryQuery[0].opin_bal,
              uname: req.user.uname,
              date: dt,
              ptype: "toss_bet"
            };
            await UserLogs.create(logData);

            // Notification
            const description = `${req.user.uname} has placed a new bet #${bet_id} by ${amount} to ${eventName} with odds ${odds}`;
            const notificationsData = {
              evt_id: evt_id,
              user_id: req.user._id,
              game_type: game_type,
              description: description
            };
            await LiveNotifications.create(notificationsData);

            await createLog(req, "sports", description);

            return res.json({
              status: true,
              message: "Bet Place Successfully."
            });
          } else {
            return res.status(500).json({
              status: false,
              message: "BET_ERR_HERE"
            });
          }
        } else if (pointok == 2) {
          return res.status(403).json({
            status: false,
            message: "Check your bet limit"
          });
        } else {
          return res.status(403).json({
            status: false,
            message: "Insufficient balance"
          });
        }
      } else {
        return res.status(403).json({
          status: false,
          message: "Odds not matched.Try Again"
        });
      }
    } else {
      let errorMessage = "";
      errorMessage = "Something wrong happen. Please try again.";

      if (userHistoryQuery[0].stat === 0) {
        errorMessage = "Account not active. You can not place bet";
      }
      if (userHistoryQuery[0].bet_status === 0) {
        errorMessage =
          "Betting is stop in your account please contact with your upline.";
      }
      if (userHistoryQuery[0].user_role !== 8) {
        errorMessage = "Only User role can place bet. Your role is not user";
      }
      // errorMessage = (amount > userHistoryQuery[0].bz_balance) ? "You don't have enough Balance to place this bet." : errorMessage;
      return res.status(403).json({
        status: false,
        message: errorMessage,
        here: `${userHistoryQuery[0].stat}-${userHistoryQuery[0].bet_status}-${userHistoryQuery[0].user_role}`
      });
    }
  } else {
    return res.status(403).json({
      status: false,
      message: "Session not valid to place this bet"
    });
  }
};
module.exports = placeTieLiveBets;
