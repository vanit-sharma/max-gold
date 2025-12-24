const mongoose = require("mongoose");
const useragent = require("express-useragent");
const getClientIp = require("../getClientIp.js");
const getSportsLimit = require("../../lib/getSportsLimit");
const Punter = require("../../models/Punter");
const AdmBetStart = require("../../models/AdmBetStart");
const BetfairEvent = require("../../models/BetfairEvent");
const BetlockByMarket = require("../../models/BetlockByMarket.js");
const BetLock = require("../../models/BetLock.js");
const BtBet = require("../../models/BtBets.js");

const moment = require("moment");
const sportsApingRequest = require("../sportsApingRequest.js");
const {
  getUserHierarchy,
  get_user_latest_points_byid,
  UpdateBalance,
  createLog,
  PlacePendingBet,
  getBetfairData
} = require("../function.js");
const BetfairEventBets = require("../../models/BetfairEventBets.js");
const MatchBz = require("../../models/MatchBz.js");
const UserLogs = require("../../models/UserLogs.js");
const LiveNotifications = require("../../models/LiveNotifications.js");

const placeLiveBets = async (req, res) => {
  try {
    const { bet_type, odds, amount, catmid, sid, delay } = req.body;
    let rnr = "";
    let limit = 0;
    let type = bet_type; //b = back l = lay
    stake = amount; //amount
    mid = catmid; // cat_mid
    cat_sid = sid; //team sid

    let user_bet_rate = odds;
    let max_expouser = null;
    let r2;
    let t0;
    let t1;
    let nla1;
    let nla2;
    let nla3;
    let section = "";
    let api_response = "";
    let eventName = "";
    let cla = 0;
    let cla2 = 0;
    let summery_id = 0;


    var source = req.headers["user-agent"];
    var ua = useragent.parse(source);

    const dvc = JSON.stringify({
      browser: ua.browser,
      os: ua.os,
      platform: ua.platform,
      isMobile: ua.isMobile,
      uaString: ua.source,
      ipAddress:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress,
    });
    const betfairEvents = await BetfairEvent.findOne({ cat_mid: mid }).lean();

    if (betfairEvents.evt_status != "OPEN") {
      return res.status(403).json({
        status: false,
        message: "Betting not open for this match.",
      });
    }
    const game_type = betfairEvents.game_type;
    let runnername = null;
    if (betfairEvents.cat_sid1 == cat_sid) {
      runnername = betfairEvents.cat_rnr1;
    } else if (betfairEvents.cat_sid2 == cat_sid) {
      runnername = betfairEvents.cat_rnr2;
    } else if (betfairEvents.cat_sid3 == cat_sid) {
      runnername = betfairEvents.cat_rnr3;
    }

    const uid = req.user.uname;

    const ip_address = getClientIp(req.ip);
    const currency = req.user.currency;
    const custom_role = req.user.user_role;

    if (custom_role != 8) {
      return res.status(403).json({
        status: false,
        message: "Betting Not allowed!!!",
      });
    }

    //userid = this->session->userdata('UserSno');//
    let userid = req.user._id;
    let mat_mlimit = null;
    let min_amount = null;
    let maxWinning = null;

    if (currency == 1 || currency == 2) {
      if (game_type == 1) {
        mat_mlimit = await getSportsLimit("cricket", req.user._id);
        min_amount = await getSportsLimit("cricket_min", req.user._id);
        max_expouser = await getSportsLimit("cricket_exp", req.user._id);
        maxWinning = 5000000;
      } else if (game_type == 2) {
        mat_mlimit = await getSportsLimit("soccer", req.user._id);
        min_amount = await getSportsLimit("soccer_min", req.user._id);
        max_expouser = await getSportsLimit("soccer_exp", req.user._id);
        maxWinning = 1000000;
      } else {
        mat_mlimit = getSportsLimit("tennis", req.user._id);
        min_amount = getSportsLimit("tennis_min", req.user._id);
        max_expouser = getSportsLimit("tennis_exp", req.user._id);
        maxWinning = 1000000;
      }
    } else {
      if (game_type == 1) {
        mat_mlimit = getSportsLimit("cricket", req.user._id);
        min_amount = getSportsLimit("cricket_min", req.user._id);
        max_expouser = getSportsLimit("cricket_exp", req.user._id);
        maxWinning = 200000;
      } else if (game_type == 2) {
        mat_mlimit = getSportsLimit("soccer", req.user._id);
        min_amount = getSportsLimit("soccer_min", req.user._id);
        max_expouser = getSportsLimit("soccer_exp", req.user._id);
        maxWinning = 14000;
      } else {
        mat_mlimit = getSportsLimit("tennis", req.user._id);
        min_amount = getSportsLimit("tennis_min", req.user._id);
        max_expouser = getSportsLimit("tennis_exp", req.user._id);
        maxWinning = 14000;
      }
    }

    const controls = await Punter.findOne({ _id: req.user._id })
      .select("f_enable c_enble t_enable")
      .lean();

    if (controls.c_enble == 0) {
      return res.status(403).json({
        status: false,
        message: "Bet not allow for your account..",
      });
    }
    /** have not added code for this as this seems not used till now. also we can pull it from .env which is much safer than keeping it in the db.
        apiKeyDetails = getSingleResultArr( array( 'columns' => '*' , 'table' => "bz_api_key_details", 'where' => array('operate' => '1') ) );
        APP_KEY = apiKeyDetails['pkey'];
        SESSION_TOKEN = apiKeyDetails['ssoid'];
       */

    const admBet = await AdmBetStart.findOne({ sno: "1" }).lean();

    const isBettingEnable = admBet.IsBettingStart;

    if (isBettingEnable == false) {
      return res.status(403).json({
        status: false,
        message: "Betting not open for this match.",
      });
    }

    if (mid.length > 20) {
      return res.status(403).json({
        status: false,
        message: "Mid not Valid",
      });
    }

    if (type.length > 10) {
      return res.status(403).json({
        status: false,
        message: "Type not Valid",
      });
    }

    if (odds.length > 7) {
      return res.status(403).json({
        status: false,
        message: `We are not accepting bet on this Odds {odds}`,
      });
    }

    if (stake > mat_mlimit) {
      return res.status(403).json({
        status: false,
        message: `Max Size is: {mat_mlimit}`,
      });
    }

    if (cat_sid.length > 15) {
      return res.status(403).json({
        status: false,
        message: "Team Name Not Valid",
      });
    }

    if (stake < min_amount) {
      return res.status(403).json({
        status: false,
        message: `Minimum Amount should be {min_amount}`,
        currency: currency,
        userid: req.user._id,
      });
    }
    let rte = "o";
    let liverate = "0";
    let is_bet_accept = null;
    let inplayStatus = null;
    let cat_sid1 = null;
    let cat_sid2 = null;
    let cat_sid3 = null;
    let evt_id = null;
    let match_typ = null;
    let is_bm_on = 0;
    let evt_type = 0;
    let bet_game_type = null;
    let jsonds = null;
    let dr = null;
    let event_name = betfairEvents.evt_evt;
    if (betfairEvents) {
      match_typ = betfairEvents.match_typ;
      inplayStatus = betfairEvents.inplay;
      evt_type = betfairEvents.evt_api_type;
      const match_status = betfairEvents.match_status;
      const pending = betfairEvents.pending;
      cat_sid1 = betfairEvents.cat_sid1;
      cat_sid2 = betfairEvents.cat_sid2;
      cat_sid3 = betfairEvents.cat_sid3;

      const runner1Name = betfairEvents.cat_rnr1;
      const runner2Name = betfairEvents.cat_rnr2;
      const runner3Name = betfairEvents.cat_rnr3;
      const evt_od = betfairEvents.evt_od;

      evt_id = betfairEvents.evt_id;
      const odd_bet_on = betfairEvents.odd_bet_on;
      is_bet_accept = betfairEvents.is_bet_accept;
      const game_type = betfairEvents.game_type; // 1 => Cricket , 2 => Football , 3 => Tennis

      bet_game_type = game_type;
      eventName = betfairEvents.evt_evt;

      if (bet_game_type == 2 || bet_game_type == 3) {
        if (inplayStatus == 0) {
          const nowMinus30 = new Date(Date.now() - 30 * 60 * 1000);

          const sqlDiff = await BetfairEvent.aggregate([
            // Filter by category
            { $match: {'cat_mid': mid } },

            // Compute raw minutes remaining: (evt_od + 5h) – (now – 30m) in whole minutes
            {
              $addFields: {
                minRemaining: {
                  floor: {
                    divide: [
                      {
                        subtract: [
                          { add: ["evt_od", 300 * 60 * 1000] }, // evt_od + 300 minutes
                          nowMinus30, // now – 30 minutes
                        ],
                      },
                      60 * 1000, // ms → minutes
                    ],
                  },
                },
              },
            },

            // Build the “X hour Y minutes” string with a 10-minute buffer
            {
              $addFields: {
                timeStr: {
                  concat: [
                    {
                      toString: {
                        floor: {
                          divide: [
                            { subtract: ["minRemaining", 10] }, // apply -10
                            60,
                          ],
                        },
                      },
                    },
                    " hour ",
                    {
                      toString: {
                        mod: [{ subtract: ["minRemaining", 10] }, 60],
                      },
                    },
                    " minutes",
                  ],
                },
              },
            },

            // Return only the fields you need
            { $project: { evt_od: 1, minRemaining: 1, timeStr: 1 } },
          ]).exec();

          const minRemaning = sqlDiff.minRemaning;
          const timeStr = sqlDiff.timeStr;

          if (minRemaning > 10) {
            minRemaning = minRemaning - 10;
            if (minRemaning == 0) {
              const message = "Betting will open in few secound";
            } else {
              const message = "Betting will open in " + timeStr + " minutes";
            }

            return res.status(403).json({
              status: false,
              message: message,
            });
          }
        }
      }

      if (odd_bet_on == 0) {
        return res.status(403).json({
          status: false,
          message: "Bet not accept on this market for this event.",
        });
      }

      const userFilterId = req.user._id.toString();
      // build a RegExp that matches either start‐of‐string or comma before the id,
      // and comma or end‐of‐string after
      const userRegex = new RegExp(`(^|,)${userFilterId}(,|$)`);
      const sqlLock = await BetlockByMarket.find({
        market_type: 0,
        cat_mid: mid,
        selected_users: {
          $in: userRegex,
        },
      }).lean();

      if (sqlLock.length) {
        return res.status(403).json({
          status: false,
          message: "Bet not allowed in this market",
        });
      }

      const userOdds = await BetLock.findOne(
        { user_id: req.user._id },
        "cric_matchodd soccer_matchodd tennis_matchodd"
      ).lean();

      if (userOdds) {
        if (game_type == 1 && userOdds.cric_matchodd == 0) {
          return res.status(403).json({
            status: false,
            message:
              "Your betting is locked for this market. Please contact your upline.",
          });
        }

        if (game_type == 2 && userOdds.soccer_matchodd == 0) {
          return res.status(403).json({
            status: false,
            message:
              "Your betting is locked for this market. Please contact your upline.",
          });
        }

        if (game_type == 3 && userOdds.tennis_matchodd == 0) {
          return res.status(403).json({
            status: false,
            message:
              "Your betting is locked for this market. Please contact your upline.",
          });
        }
      }

      if (type.toUpperCase() == "B") {
        if (sid == cat_sid1) {
          rnr = "b1";
          section = runner1Name;
        } else if (sid == cat_sid2) {
          rnr = "b2";
          section = runner2Name;
        } else {
          rnr = "b3";
          section = runner3Name;
        }
      } else {
        if (sid == cat_sid1) {
          rnr = "l1";
          section = runner1Name;
        } else if (sid == cat_sid2) {
          rnr = "l2";
          section = runner2Name;
        } else {
          rnr = "l3";
          section = runner3Name;
        }
      }
    }

    if (!is_bet_accept) {
      return res.status(403).json({
        status: false,
        message: "Not accepting bet on events.",
      });
    }

    if (inplayStatus == 0) {
      return res.status(403).json({
        status: false,
        message: "Only inplay bet accept.",
      });
    }

    if (game_type == 2) {
      if (odds > 40) {
        return res.status(403).json({
          status: false,
          message: "Maximum Bet Accept odd is 40.00",
        });
      }
    } else if (game_type == 3) {
      if (odds > 40) {
        return res.status(403).json({
          status: false,
          message: "Maximum Bet Accept odd is 40.00",
        });
      }
    } else if (game_type == 1) {
      if (odds > 40) {
        return res.status(403).json({
          status: false,
          message: "Maximum Bet Accept odd is 40.00",
        });
      }
    }

    if (
      (sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
      (sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
      (sid == cat_sid3 && (rnr == "l3" || rnr == "b3"))
    ) {
    } else {
      return res.status(403).json({
        status: false,
        message: "parameter not valid.",
      });
    }

    const cntBet = await BtBet.countDocuments({
      user_id: req.user._id,
      cat_mid: mid,
      evt_id: evt_id,
      bet_type: "m",
    });

    if (cntBet) {
      if (cntBet >= 100 && game_type == 1) {
        return res.status(403).json({
          status: false,
          message: "Bet Limit Exceeded",
        });
      }

      if (cntBet >= 40 && game_type == 3) {
        return res.status(403).json({
          status: false,
          message: "Bet Limit Exceeded",
        });
      }

      if (cntBet >= 40 && game_type == 2) {
        return res.status(403).json({
          status: false,
          message: "Bet Limit Exceeded",
        });
      }
    }

    if (game_type == 3 || game_type == 2 || game_type == 1) {
      const drstBet = await BtBet.findOne({
        user_id: req.user._id,
        cat_mid: mid,
        evt_id: evt_id,
        bet_type: "m",
      })
        .sort({ stmp: -1 }) // newest first
        .lean();

      if (drstBet) {
        // how many seconds ago it was placed
        const secondsSince =
          (Date.now() - new Date(drstBet.stmp).getTime()) / 1000;

        if (secondsSince < 30) {
          return res.status(403).json({
            status: false,
            message: "Frequently bets are not allowed!",
          });
        }
      }
    }

    //bzUserLoginHistory

    const userHistoryQuery = await Punter.aggregate([
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

    if (userHistoryQuery && evt_id != "") {
      const full_chain = userHistoryQuery[0].full_chain;

      const sponsor = userHistoryQuery[0].sponsor;
      const sponser_id = userHistoryQuery[0].sponser_id;
      dr = userHistoryQuery[0];

      if (
        userHistoryQuery[0].stat == 1 &&
        userHistoryQuery[0].bet_status == 1 &&
        userHistoryQuery[0].user_role == 8
      ) {
        let b1Rate = 0;
        let l1Rate = 0;

        let b2Rate = 0;
        let l2Rate = 0;

        let b3Rate = 0;
        let l3Rate = 0;

        if (match_typ != 5 && is_bm_on == 0) {
          if (evt_type == "1") {
            jsonds = await sportsApingRequest(
              "APP_KEY",
              "SESSION_TOKEN",
              "listMarketBook",
              '{"marketIds":["' +
                mid +
                '"],"priceProjection":{"priceData":["EX_BEST_OFFERS"],"virtualise":"true"}}'
            );
          } else {
            jsonds = await sportsApingRequest(
              "APP_KEY",
              "SESSION_TOKEN",
              "listMarketBook",
              '{"marketIds":["' +
                mid +
                '"],"priceProjection":{"priceData":["EX_BEST_OFFERS"],"virtualise":"true"}}'
            );
          }
        } else {
          jsonds = "";
        }

        jsonds = await getBetfairData(mid);
       // console.log("getBetfairData->",jsonds);


        if (jsonds != "ER101" && jsonds != "") {
          api_response = jsonds;

          r2 = jsonds[0].result[0].inplay;
          t0 = jsonds[0].result[0].status;
          t1 = jsonds[0].result[0].numberOfRunners; 

          if (t0 == "OPEN") {
            for (k = 0; k < jsonds[0].result[0].runners.length; k++) {
              if (jsonds[0].result[0].runners[k].selectionId == sid) {
                if (type.toUpperCase() == "B") {
                  liverate =
                    jsonds[0].result[0].runners[k].ex.availableToBack[0].price;
                } else if (type.toUpperCase() == "L") {
                  liverate =
                    jsonds[0].result[0].runners[k].ex.availableToLay[0].price;
                } else {
                  return res.status(403).json({
                    status: false,
                    message: "Odd not match",
                  });
                }

                if (
                  jsonds[0].result[0].runners[k].ex.availableToBack[0].price
                ) {
                  b1Rate =
                    jsonds[0].result[0].runners[k].ex.availableToBack[0].price;

                  b1Size = 0;
                  if (
                    jsonds[0].result[0].runners[k].ex.availableToBack[0].size
                  ) {
                    b1Size =
                      jsonds[0].result[0].runners[k].ex.availableToBack[0].size;
                  }
                  b1Rate = b1Size + "@" + b1Rate;
                }

                if (
                  jsonds[0].result[0].runners[k].ex.availableToBack[1].price
                ) {
                  b2Rate =
                    jsonds[0].result[0].runners[k].ex.availableToBack[1].price;

                  b2Size = 0;
                  if (
                    jsonds[0].result[0].runners[k].ex.availableToBack[1].size
                  ) {
                    b2Size =
                      jsonds[0].result[0].runners[k].ex.availableToBack[1].size;
                  }
                  b2Rate = b2Size + "@" + b2Rate;
                }

                if (
                  jsonds[0].result[0].runners[k].ex.availableToBack[2].price
                ) {
                  b3Rate =
                    jsonds[0].result[0].runners[k].ex.availableToBack[2].price;

                  b3Size = 0;
                  if (
                    jsonds[0].result[0].runners[k].ex.availableToBack[2].size
                  ) {
                    b3Size =
                      jsonds[0].result[0].runners[k].ex.availableToBack[2].size;
                  }
                  b3Rate = b3Size + "@" + b3Rate;
                }

                if (jsonds[0].result[0].runners[k].ex.availableToLay[0].price) {
                  l1Rate =
                    jsonds[0].result[0].runners[k].ex.availableToLay[0].price;

                  l1Size = 0;
                  if (
                    jsonds[0].result[0].runners[k].ex.availableToLay[0].size
                  ) {
                    l1Size =
                      jsonds[0].result[0].runners[k].ex.availableToLay[0].size;
                  }
                  l1Rate = l1Size + "@" + l1Rate;
                }

                if (jsonds[0].result[0].runners[k].ex.availableToLay[1].price) {
                  l2Rate =
                    jsonds[0].result[0].runners[k].ex.availableToLay[1].price;

                  l2Size = 0;
                  if (
                    jsonds[0].result[0].runners[k].ex.availableToLay[1].size
                  ) {
                    l2Size =
                      jsonds[0].result[0].runners[k].ex.availableToLay[1].size;
                  }
                  l2Rate = l2Size + "@" + l2Rate;
                }

                if (jsonds[0].result[0].runners[k].ex.availableToLay[2].price) {
                  l3Rate =
                    jsonds[0].result[0].runners[k].ex.availableToLay[2].price;

                  l3Size = 0;
                  if (
                    jsonds[0].result[0].runners[k].ex.availableToLay[2].size
                  ) {
                    l3Size =
                      jsonds[0].result[0].runners[k].ex.availableToLay[2].size;
                  }
                  l3Rate = l3Size + "@" + l3Rate;
                }
              }
            }
          }
        }

       
        //console.log("status->",t0);
        let ta = 0;
        let tb = 0;
        let tc = 0;
        let pro = 0;
        let lib = 0;
        let anyOdd = 0;

        if (game_type == 2) {
          if (liverate > 40) {
            return res.status(403).json({
              status: false,
              message: "Maximum Bet Accept odd is 40",
            });
          }
        } else if (game_type == 3) {
          if (liverate > 40) {
            return res.status(403).json({
              status: false,
              message: "Maximum Bet Accept odd is 40",
            });
          }
        } else if (game_type == 1) {
          if (liverate > 40) {
            return res.status(403).json({
              status: false,
              message: "Maximum Bet Accept odd is 40.00",
            });
          }
        }

        if (type.toUpperCase() == "B") {
          if (odds <= liverate && liverate != 0) {
            if (!liverate) {
              ratok = 10;
              pro = odds * amount - amount;
              lib = amount;
            } else {
              ratok = 1;
              if (game_type == 1) {
                pro = liverate * amount - amount;
                lib = amount;
              } else {
                pro = liverate * amount - amount;
                lib = amount;
              }

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
            pro = odds * amount - amount;
            lib = amount;
          }
        }
 
        if (type.toUpperCase() == "L") {
          //if(odds == liverate && liverate!=0)

          if (odds >= liverate && liverate != 0) {
            if (!liverate) {
              ratok = 12;
              pro = amount;
              lib = odds * amount - amount;
            } else {
              ratok = 1;
              if (game_type == 1) {
                pro = amount;
                lib = liverate * amount - amount;
              } else {
                pro = amount;
                lib = liverate * amount - amount;
              }

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
            pro = amount;
            lib = odds * amount - amount;
          }
        }

        if (r2 == 1) {
          inp = "1";
        } else {
          inp = "0";
        }

        if (pro > max_expouser || lib > max_expouser) {
          return res.status(403).json({
            status: false,
            message: `Match Max Limit : ${max_expouser}`,
          });
        }

        console.log("ta->",ta,"tb->",tb,"tc->",tc,"liverate->",liverate,"ratok->",ratok);

        if (ratok == 1) {
          pointok = 0; 
          const master_link = await getUserHierarchy(req.user._id);

          if (rte == "o") {
            const drstc = await BetfairEventBets.findOne({
              cat_mid: mid,
              user_id: req.user._id,
              market_type: 1,
            }).lean();

            //console.log("drstc->",drstc);

            if (drstc) {
              summery_id = drstc._id;
              limit = 0;

              if (t1 == 2) {
                limita =
                  parseFloat(drstc.lockamt) +
                  parseFloat(drstc.rnr1s) +
                  parseFloat(dr.bz_balance);
                limitb =
                  parseFloat(drstc.lockamt) +
                  parseFloat(drstc.rnr2s) +
                  parseFloat(dr.bz_balance);

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
                  parseFloat(drstc.lockamt) +
                  parseFloat(drstc.rnr1s) +
                  parseFloat(dr.bz_balance);
                limitb =
                  parseFloat(drstc.lockamt) +
                  parseFloat(drstc.rnr2s) +
                  parseFloat(dr.bz_balance);
                limitc =
                  parseFloat(drstc.lockamt) +
                  parseFloat(drstc.rnr3s) +
                  parseFloat(dr.bz_balance);

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
                nla1 = drstc.rnr1s + ta;
                nla2 = drstc.rnr2s + tb;

                if (t1 == 2) {
                  if (Math.min(nla1, nla2) < 0) {
                    nla = Math.abs(Math.min(nla1, nla2));
                  } else {
                    nla = 0;
                  }
                }

                if (t1 == 3) {
                  nla3 = drstc.rnr3s + tc;

                  if (Math.min(nla1, nla2, nla3) < 0) {
                    nla = Math.abs(Math.min(nla1, nla2, nla3));
                  } else {
                    nla = 0;
                  }
                }
                cla = pla - nla;
                pointok = 1;

                if (nla > max_expouser) {
                  return res.status(403).json({
                    status: false,
                    message: `Expouser Limit is : ${max_expouser}`,
                  });
                }

                maxPL = Math.max(nla1, nla2, nla3);

                if (maxPL > maxWinning) {
                  return res.status(403).json({
                    status: false,
                    message: `Max Winning Limit is : ${maxWinning}`,
                  });
                }

                //if (dr.bz_balance - dr.plimit + cla >= 0) {
                if (dr.bz_balance - cla >= 0) {
                  if (ta < 0) {
                    taVal = parseFloat(drstc.rnr1s) + parseFloat(ta);
                  } else {
                    taVal = parseFloat(drstc.rnr1s) + parseFloat(ta);
                  }

                  if (tb < 0) {
                    rnr2s = parseFloat(drstc.rnr2s) + parseFloat(tb);
                  } else {
                    rnr2s = parseFloat(drstc.rnr2s) + parseFloat(tb);
                  }

                  if (tc < 0) {
                    rnr3s = parseFloat(drstc.rnr3s) + parseFloat(tc);
                  } else {
                    rnr3s = parseFloat(drstc.rnr3s) + parseFloat(tc);
                  }

                  userid = req.user._id;

                  await BetfairEventBets.updateOne(
                    {
                      cat_mid: mid,
                      uname: req.user.uname,
                      user_id: req.user._id,
                      market_type: 1,
                    },
                    {
                      $set: {
                        rnr1s: taVal,
                        rnr2s: rnr2s,
                        rnr3s: rnr3s,
                        lockamt: nla,
                      },
                    }
                  );

                  const stm = await MatchBz.updateOne(
                    {
                      cat_mid: mid,
                      uname: req.user.uname,
                      user_id: req.user._id,
                      market_type: 1,
                    },
                    {
                      $set: {
                        rnr1s: taVal,
                        rnr2s: rnr2s,
                        rnr3s: rnr3s,
                        lockamt: nla,
                      },
                    }
                  );

                  book_lock_amount = nla;

                  const drBetBook = await BetfairEventBets.findOne({
                    cat_mid: mid,
                    uname: req.user.uname,
                    user_id: req.user._id,
                    market_type: 1,
                  }).lean();
                  team1_book = drBetBook.rnr1s;
                  team2_book = drBetBook.rnr2s;
                  team3_book = drBetBook.rnr3s;

                  //redis-book
                  const userBook = {
                    uname: req.user.uname,
                    rnr1s: parseInt(team1_book, 10),
                    rnr2s: parseInt(team2_book, 10),
                    rnr3s: parseInt(team3_book, 10),
                    mid: mid,
                    lock: parseInt(nla, 10),

                    full_chain: full_chain,
                    sponsor: sponsor,
                    sponser_id: sponser_id,

                    market_type: 1,
                    game_type: game_type,
                    user_id: userid,
                    master_link: master_link,
                  };

                  redis_key = userid + "_" + mid;
                } else {
                  pointok = 2;
                }
              } else {
                pointok = 0;
              }
            } else {
              if (lib <= dr.bz_balance) {
                const drsts = await BetfairEvent.findOne({
                  cat_mid: mid,
                }).lean();

                if (drsts) {
                  drsts.cid = Buffer.from(drsts.cat_mid, "utf8").toString(
                    "base64"
                  );
                }

                // 3) compute cla and cla2
                cla = -lib;
                cla2 = lib;

                if (cla2 > max_expouser) {
                  return res.status(403).json({
                    status: false,
                    message: `Max Expouser Limit: ${max_expouser}`,
                  });
                }

                if (dr.bz_balance - cla >= 0) {
                  team1_book = ta;
                  team2_book = tb;
                  team3_book = tc;
                  book_lock_amount = cla2;

                  const betData = {
                    cat_mid: mid,
                    uname: req.user.uname,
                    rnr1: drsts.cat_rnr1,
                    rnr1s: ta,
                    rnr2: drsts.cat_rnr2,
                    rnr2s: tb,
                    rnr3: drsts.cat_rnr3,
                    rnr3s: tc,
                    market_type: 1,
                    lockamt: cla2,
                    rnr1sid: drsts.cat_sid1,
                    rnr2sid: drsts.cat_sid2,
                    rnr3sid: drsts.cat_sid3,
                    user_id: new mongoose.Types.ObjectId(req.user._id),
                    bet_game_type: bet_game_type,
                  };
                  //console.log("Reach Here Place First Bet->",betData);
                  const createdBet = await BetfairEventBets.create(betData); 
                  summery_id = createdBet._id;
                  //await MatchBz.create(betData);

                  //redis-book
                  const userBook = {
                    uname: req.user.uname,
                    rnr1s: parseInt(ta),
                    rnr2s: parseInt(tb),
                    rnr3s: parseInt(tc),
                    mid: mid,
                    lock: parseInt(cla2), // PHP used intval()

                    full_chain: full_chain,
                    sponsor: sponsor,
                    sponser_id: sponser_id,

                    market_type: 1,
                    game_type: bet_game_type,
                    user_id: req.user._id,
                    master_link: master_link,
                  };

                  redis_key = userid + "_" + mid;
                  //$this->redis->setData($redis_key, 16, json_encode($userBook));
                  //$this->redis->setBookData($mid, $userid, json_encode($userBook));

                  pointok = 1;
                } else {
                  pointok = 2;
                }
              } else {
                pointok = 0;
              }
            }
          }

          console.log("pointok->",pointok);
          console.log("summery_id->",summery_id);
          if (pointok == 1) {
            console.log("cla->",cla);
            st2 = UpdateBalance(req.user._id, cla);

            const bet_market_type = 1;
            const after_bet_balance = await get_user_latest_points_byid(
              req.user._id
            ); 

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
              type: bet_type,
              cla: cla,
              rnrsid: sid,
              evt_id: evt_id,
              bet_type: "m",
              bet_summery_id: summery_id,
              section: section,
              ip_address: ip_address,
              after_bet_balance: after_bet_balance,
              team1_book: team1_book,
              team2_book: team2_book,
              team3_book: team3_book,
              bet_market_type: bet_market_type,
              book_lock_amount: book_lock_amount,
              b1: b1Rate,
              l1: l1Rate,
              b2: b2Rate,
              l2: l2Rate,
              b3: b3Rate,
              l3: l3Rate,
              g_type: game_type,
              user_bet_rate: user_bet_rate,
              api_response: JSON.stringify(api_response),
              delay: delay,
              bet_device: dvc,
              bet_game_type: bet_game_type,
              event_name:event_name
            };

            //console.log("bt_bets_data->",bt_bets_data);

            const betCreated = await BtBet.create(bt_bets_data);

            const bet_id = betCreated._id;

            //redis-betlist
            bt_bets_data.full_chain = full_chain;
            bt_bets_data.sponsor = sponsor;
            bt_bets_data.sponser_id = sponser_id;
            bt_bets_data.tblname = "bt_bets";
            bt_bets_data.master_link = master_link;
            bt_bets_data.bet_auto_id = bet_id;
            bt_bets_data.bet_time = moment().format("YYYY-MM-DD HH:mm:ss");

            //$this->redis->setBetList($mid, $bet_id, json_encode($bt_bets_data));

            if (st2) {
              balance_point = dr.bz_balance + cla;
              // to do
              //$this->session->set_userdata('point', $balance_point);
              dt = moment().format("YYYY-MM-DD HH:mm:ss");

              //New Logs
              const logData = {
                user_id: req.user._id,
                page: "livebet",
                linkid: bet_id,
                ptrans: cla,
                otrans: "",
                points: dr.bz_balance + cla,
                obal: dr.opin_bal,
                uname: req.user.uname,
                date: dt,
                ptype: "bet",
              };

              const entry = await UserLogs.create(logData);

              description =
                req.user._id +
                " has placed a new bet #" +
                bet_id +
                " by " +
                stake +
                " to " +
                eventName +
                " with odds " +
                liverate;

              const notificationsData = {
                evt_id: evt_id,
                user_id: req.user._id,
                game_type: game_type,
                description: description,
              };
              await LiveNotifications.create(notificationsData);

              await createLog(req, "sports", description);

              return res.status(200).json({
                status: true,
                message: "Bet Place Successfully.",
              });
            } else {
              return res.status(403).json({
                status: false,
                message: "Error in Placing Bet.",
              });
            }
          } else if (pointok == 2) {
            return res.status(403).json({
              status: false,
              message: "Check your bet limit",
            });
          } else {
            //$lib <= $limit
            return res.status(403).json({
              status: false,
              message: "Insufficient balance",
            });
          }
        } else {
          //pending bet code
          if (game_type == 1 || game_type == 2 || game_type == 3) {
            let userid = req.user._id;

            if (userid == 14743) {
              if (dr.bz_balance >= lib) {
                return PlacePendingBet(res, req, postArr, liverate, rnr);
              } else {
                return res.status(403).json({
                  status: false,
                  message: "Insufficient balance",
                });
              }
            } else {
              return res.status(403).json({
                status: false,
                message: "Odds not matched.Try Again",
                jsonds: jsonds,
              });
            }
          } else {
            result["status"] = false;
            result["message"] = "Odds not matched.";
            result["jsonds"] = jsonds;
            return result;
          }
        }
      } else {
        let errorMessage = "Something wrong happen. Please try again.";

        if (dr.stat == 0) {
          errorMessage = "Account not active. You can not place bet";
        }

        if (dr.bet_status == 0) {
          errorMessage =
            "Betting is stop in your account please contact with your upline.";
        }

        if (dr.user_role != 8) {
          errorMessage = "Only User role can place bet. Your role is not user";
        }

        const here = dr.stat + "-" + dr.bet_status + "-" + dr.user_role;
        return res.status(403).json({
          status: false,
          message: errorMessage,
          here: here,
        });
      }
    } else {
      return res.status(403).json({
        status: false,
        message: "Session not valid to place this bet",
      });
    }
  } catch (error) {
    console.error("Error in placeLiveBets:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
module.exports = placeLiveBets;
