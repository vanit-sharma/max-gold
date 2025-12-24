const mongoose = require("mongoose");
const getClientIp = require("../getClientIp.js");
const getSportsLimit = require("../../lib/getSportsLimit.js");
const Punter = require("../../models/Punter.js");
const AdmBetStart = require("../../models/AdmBetStart.js");
const BetfairEvent = require("../../models/BetfairEvent.js");
const BetlockByMarket = require("../../models/BetlockByMarket.js");
const BetLock = require("../../models/BetLock.js");
const UserLogs = require("../../models/UserLogs.js");
const MatchBz = require("../../models/MatchBz.js");
const { json } = require("express");
const BtBets = require("../../models/BtBets.js");
const LiveNotifications = require("../../models/LiveNotifications.js");
const BetBookSummary = require("../../models/BetBookSummary.js");
const BetfairEventsRunner = require("../../models/BetfairEventsRunner.js");
const sportsApingRequest = require("../sportsApingRequest.js");
const moment = require("moment");
const {
  getUserHierarchy,
  get_user_latest_points_byid,
  UpdateBalance,
  getHRGRBook,
  bzFormValue,
  getBetfairData,
  pushExposure,
  getPunterSharing
} = require("../function.js");
const BetfairEventBets = require("../../models/BetfairEventBets.js");

const placeLiveHourseBet = async (req, res) => {
  // Bet type and values
  const type = req.body.bet_type; // 'b' = back, 'l' = lay
  const odd = parseFloat(req.body.odds);
  const stake = parseFloat(req.body.amount);
  const mid = req.body.catmid;
  const cat_sid = req.body.sid;
  let game_type = req.body.game_type;
  let api_response = "";
  let summery_id,
    lockamt,
    cla,
    cla2,
    book_lock_amount,
    st2,
    pointok = 0;
  const sr = req.body.sr;
  let anyOdd = true;
  let runner = 2;
  const uid = req.user.uname;
  const currency = req.user.currency;
  const custom_role = req.user.custom_role;
  let ip_address =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let b1Rate = 0,
    l1Rate = 0,
    b2Rate = 0,
    l2Rate = 0,
    b3Rate = 0,
    l3Rate = 0;
  if (custom_role === "admin") {
    return res.json({ status: false, message: "Betting Not allowed!!!" });
  }

  const userid = req.user._id;
  let mat_mlimit, min_amount, max_expouser, maxWinning;

  if (currency == 1 || currency == 2) {
    if (game_type == 4) {
      mat_mlimit = await getSportsLimit("hrace", userid);
      min_amount = await getSportsLimit("hrace_min", userid);
      max_expouser = await getSportsLimit("hrace_exp", userid);
      maxWinning = 500000;
    } else {
      mat_mlimit = await getSportsLimit("greyhound", userid);
      min_amount = await getSportsLimit("greyhound_min", userid);
      max_expouser = await getSportsLimit("greyhound_exp", userid);
      maxWinning = 500000;
    }
  } else {
    if (game_type == 4) {
      mat_mlimit = await getSportsLimit("hrace", userid);
      min_amount = await getSportsLimit("hrace_min", userid);
      max_expouser = await getSportsLimit("hrace_exp", userid);
      maxWinning = 7050;
    } else {
      mat_mlimit = await getSportsLimit("greyhound", userid);
      min_amount = await getSportsLimit("greyhound_min", userid);
      max_expouser = await getSportsLimit("greyhound_exp", userid);
      maxWinning = 7050;
    }
  }

  // User controls
  const punter = await Punter.findOne(
    { _id: req.user._id },
    "f_enable c_enble t_enable"
  ).lean();

  let isBettingEnable = false;

  const admBet = await AdmBetStart.findOne({ sno: "1" }).lean();
  isBettingEnable = admBet?.IsBettingStart;
  if (!isBettingEnable) {
    return res.json({
      status: false,
      message: "Betting not open for this match."
    });
  }

  // Validate mid, type, odds, amount, sid
  if (!mid || mid.length > 20) {
    return res.json({ status: false, message: "Mid not Valid" });
  }
  const typ = await bzFormValue(type?.toUpperCase());
  if (!typ || typ.length > 10) {
    return res.json({ status: false, message: "Type not Valid" });
  }
  const rat = await bzFormValue(odd);

  if (!rat || rat.toString().length > 7) {
    return res.json({
      status: false,
      message: "We are not accepting bet on this Odds"
    });
  }
  const amt = await bzFormValue(stake);

  if (amt > mat_mlimit) {
    return res.json({ status: false, message: `Max Size is: ${mat_mlimit}` });
  }
  const sid = await bzFormValue(cat_sid);
  if (!sid || sid.length > 15) {
    return res.json({ status: false, message: "Team Name Not Valid" });
  }
  if (amt < min_amount) {
    return res.json({ status: false, message: `Min Size is: ${min_amount}` });
  }

  let liverate = 0;

  // Get event details

  const betfairEvents = await BetfairEvent.findOne({ cat_mid: mid }).lean();
  if (!betfairEvents) {
    return res.json({ status: false, message: "Event Not Open" });
  }

  const {
    match_typ,
    inplay,
    evt_api_type,
    match_status,
    pending,
    cat_sid1,
    cat_sid2,
    cat_sid3,
    countryCode,
    evt_id,
    is_bet_accept,
    is_bm_on,
    evt_od,
    evt_evt
  } = betfairEvents;
  game_type = betfairEvents.game_type;
  const runner1Name = betfairEvents.cat_rnr1;
  const runner2Name = betfairEvents.cat_rnr2;
  const runner3Name = betfairEvents.cat_rnr3;
  const eventName = betfairEvents.evt_evt;

  // Country/field name logic
  let field_name;
  if (game_type == 4) {
    switch (countryCode) {
      case "GB":
        field_name = "hrace_england";
        break;
      case "US":
        field_name = "hrace_america";
        break;
      case "FR":
        field_name = "hrace_france";
        break;
      case "AU":
        field_name = "hrace_australia";
        break;
      case "IE":
        field_name = "hrace_ireland";
        break;
      case "NZ":
        field_name = "hrace_newzealand";
        break;
      case "ZA":
        field_name = "hrace_africa";
        break;
      default:
        field_name = "hrace_england";
    }
  } else {
    switch (countryCode) {
      case "GB":
        field_name = "greyh_britain";
        break;
      case "AU":
        field_name = "greyh_australia";
        break;
      case "NZ":
        field_name = "greyh_newzealand";
        break;
      default:
        field_name = "greyh_britain";
    }
  }

  // Check bet lock
  const betLock = await BetLock.findOne({
    user_id: req.user._id,
    [field_name]: 0
  });
  if (betLock) {
    return res.json({ status: false, message: "Bet is Locked" });
  }

  // Time checks with adding 5 hours.
  const eventTime = moment(evt_od).add(5, "hours");
  const currentTime = moment().add(5, "hours");
  const diff = eventTime.diff(currentTime, "seconds");

  // Vanit - I have merged both game type 4 & 5 as both was containing same code
  // Betting open/close logic for game_type 4/5
  if (game_type == 4 || game_type == 5) {
    let currencyTypeCode = req.user.currencyCode || "PKR"; // Vanit
    let timeVal =
      currencyTypeCode === "INR" ? 30 : currencyTypeCode === "AED" ? -90 : 0;
    let endTimeVal =
      currencyTypeCode === "INR" ? 330 : currencyTypeCode === "AED" ? 240 : 300;
    const minRemaning = eventTime
      .clone()
      .add(endTimeVal, "minutes")
      .diff(currentTime.clone().add(timeVal, "minutes"), "minutes");
    if (minRemaning > 2) {
      // Vanit - I have commented the following 2 mins condition to test the code.
      // return res.json({
      //     status: false,
      //     message: `Betting will open in ${minRemaning - 1 === 0 ? "few seconds" : minRemaning - 1 + " minutes"}`,
      //     diff,
      // });
    } else if (minRemaning < 0) {
      return res.json({ status: false, message: "Betting Closed", diff });
    }
  }

  // Market lock check
  /*
  const marketLock = await BetlockByMarket.findOne({
    market_type: 1,
    selected_users: userid,
    cat_mid: mid,
  });*/

  const userFilterId = req.user._id;
  const userRegex = new RegExp(`(^|,)${userFilterId}(,|$)`);
  const marketLock = await BetlockByMarket.find({
    market_type: 1,
    cat_mid: mid,
    selected_users: {
      $in: userRegex
    }
  }).lean();

  if (marketLock.length) {
    return res.json({
      status: false,
      message: "Bet not allowed in this market111"
    });
  }

  // Runner name
  let betfairEventsRunner = "";
  if (cat_sid && (game_type == 4 || game_type == 5)) {
    const runnerDoc = await BetfairEventsRunner.findOne(
      { cat_mid: mid, section_id: cat_sid },
      "runner_name"
    ).lean();
    betfairEventsRunner = runnerDoc?.runner_name || "";
  }

  // Set runner count
  if (runner3Name !== "NA") runner = 3;

  // User controls
  if (punter?.c_enble === 0) {
    return res.json({
      status: false,
      message: "Bet not allow for your account."
    });
  }

  // Section/rnr logic
  let rnr, section;
  if (typ === "B") {
    if (sid === cat_sid1) {
      rnr = "b1";
      section = runner1Name;
    } else if (sid === cat_sid2) {
      rnr = "b2";
      section = runner2Name;
    } else {
      rnr = "b3";
      section = runner3Name;
    }
  } else {
    if (sid === cat_sid1) {
      rnr = "l1";
      section = runner1Name;
    } else if (sid === cat_sid2) {
      rnr = "l2";
      section = runner2Name;
    } else {
      rnr = "l3";
      section = runner3Name;
    }
  }

  // Accept bet check
  if (!is_bet_accept) {
    return res.json({
      status: false,
      message: "We are not accepting bet on events."
    });
  }

  // User history
  const userHistoryQuery = await Punter.aggregate([
    {
      $match: { _id: req.user._id }
    },
    {
      $lookup: {
        from: "bz_user_login_history", // the collection name
        localField: "_id", // Punter’s _id
        foreignField: "userAutoId", // history’s userAutoId
        as: "loginHistory" // output array field
      }
    },
    {
      $unwind: {
        path: "$loginHistory",
        preserveNullAndEmptyArrays: true // keeps the user even if no history
      }
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
        "loginHistory.site_toke": 1
      }
    },
    {
      $limit: 1
    }
  ]);
  const userHistory = userHistoryQuery[0];

  let punterSharing = await getPunterSharing(req.user._id);

  // Using dummy api call below:
  let jsonds = "";
  if (
    userHistory.stat === 1 &&
    userHistory.bet_status === 1 &&
    userHistory.user_role === 8
  ) {
    jsonds = await getBetfairData(mid);
  }

  // Odds and rates logic
  if (jsonds && jsonds !== "ER101") {
    // Parse API response (mocked structure)
    api_response = JSON.stringify(jsonds);
    const market = jsonds[0]?.result?.[0];
    const isInplay = market?.inplay;
    const t0 = market?.status;
    const t1 = market?.numberOfRunners;

    if (countryCode !== "GB" && isInplay) {
      return res.json({
        status: false,
        message: "Inplay bet is not allowed in this race"
      });
    }

    if (t0 === "OPEN") {
      //let cnt = 0;

      for (const runner of market.runners) {
        if (runner.selectionId == sid) {
          if (typ === "B") {
            liverate = runner.ex.availableToBack?.[0]?.price || 0;
          } else if (typ === "L") {
            liverate = runner.ex.availableToLay?.[0]?.price || 0;
          } else {
            return res.json({ status: false, message: "Odd not match" });
          }

          if (runner.ex.availableToBack?.[0]?.price) {
            b1Rate = runner.ex.availableToBack?.[0]?.price;

            b1Size = 0;
            if (runner.ex.availableToLay?.[0]?.size) {
              b1Size = runner.ex.availableToLay?.[0]?.size;
            }
            b1Rate = b1Size + "@" + b1Rate;
          }

          if (runner.ex.availableToBack?.[1]?.price) {
            b2Rate = runner.ex.availableToBack?.[1]?.price;

            b2Size = 0;
            if (runner.ex.availableToBack?.[1]?.size) {
              b2Size = runner.ex.availableToBack?.[1]?.size;
            }
            b2Rate = b2Size + "@" + b2Rate;
          }

          if (runner.ex.availableToBack?.[2]?.price) {
            b3Rate = runner.ex.availableToBack?.[2]?.price;

            b3Size = 0;
            if (runner.ex.availableToBack?.[2]?.size) {
              $b3Size = runner.ex.availableToBack?.[2]?.size;
            }
            b3Rate = b3Size + "@" + b3Rate;
          }

          if (runner.ex.availableToLay?.[0]?.price) {
            l1Rate = runner.ex.availableToLay?.[0]?.price;

            l1Size = 0;
            if (runner.ex.availableToLay?.[0]?.size) {
              l1Size = runner.ex.availableToLay?.[0]?.size;
            }
            l1Rate = l1Size + "@" + l1Rate;
          }

          if (runner.ex.availableToLay?.[1]?.price) {
            l2Rate = runner.ex.availableToLay?.[1]?.price;

            l2Size = 0;
            if (runner.ex.availableToLay?.[1]?.size) {
              l2Size = runner.ex.availableToLay?.[1]?.size;
            }
            l2Rate = l2Size + "@" + l2Rate;
          }

          if (runner.ex.availableToLay?.[2]?.price) {
            l3Rate = runner.ex.availableToLay?.[2]?.price;
            l3Size = 0;
            if (runner.ex.availableToLay?.[2]?.size) {
              l3Size = runner.ex.availableToLay?.[2]?.size;
            }

            l3Rate = l3Size + "@" + l3Rate;
          }
        }
      }
    }
  } else {
    liverate = 0;
  }

  let pro = 0,
    lib = 0,
    ratok = 0;

  if (liverate > 50) {
    return res.json({
      status: false,
      message: "Maximum Bet Accept odd is 50.00"
    });
  }

  if (typ == "B") {
    if (rat <= liverate && liverate !== 0) {
      ratok = 1;
      pro = liverate * amt - amt;
      lib = amt;
    } else {
      ratok = 11;
    }
  } else if (typ === "L") {
    if (rat >= liverate && liverate !== 0) {
      ratok = 1;
      pro = amt;
      lib = liverate * amt - amt;
    } else {
      ratok = 13;
    }
  }

  if ((game_type == 4 || game_type == 5) && lib > 50000) {
    return res.json({ status: false, message: "Match Expouser Limit :50000" });
  }

  // Place bet logic
  if (ratok === 1) {
    // Get user hierarchy
    const master_link = await getUserHierarchy(userid);

    //BetfairEventBets
    let betEvent = await BetfairEventBets.findOne({
      cat_mid: mid,
      user_id: req.user._id,
      market_type: 1
    }).lean();

    console.log("betEvent->", betEvent);
    console.log("pro->", pro);
    console.log("lib->", lib);
    console.log("sid->", sid);

    if (betEvent) {
      summery_id = betEvent._id;
      lockamt = betEvent.lockamt;
      pla = lockamt;

      console.log("summery_id->", summery_id);
      console.log("lockamt->", lockamt);
      console.log("pla->", pla);

      if (Number(lib) <= Number(userHistory.bz_balance)) {
        // Update bet_book_summary amounts

        if (typ === "B") {
          /*
          await BetBookSummary.updateMany({ bet_summary_id: summery_id }, [
            {
              $set: {
                amount: {
                  $add: [
                    "$amount",
                    {
                      $cond: [{ $eq: ["$runner_sid", sid] }, pro, -lib],
                    },
                  ],
                },
              },
            },
          ]);*/

          // Same effect as: amount = amount + (runner_sid === sid ? pro : -lib)
          await BetBookSummary.bulkWrite([
            {
              updateMany: {
                filter: { bet_summary_id: summery_id, runner_sid: sid },
                update: { $inc: { amount: Number(pro) } }
              }
            },
            {
              updateMany: {
                filter: {
                  bet_summary_id: summery_id,
                  runner_sid: { $ne: sid }
                },
                update: { $inc: { amount: -Number(lib) } }
              }
            }
          ]);
        } else {
          /*
          await BetBookSummary.updateMany({ bet_summary_id: summery_id }, [
            {
              $set: {
                amount: {
                  $add: [
                    "$amount",
                    {
                      $cond: [{ $eq: ["$runner_sid", sid] }, -lib, pro],
                    },
                  ],
                },
              },
            },
          ]);*/

          await BetBookSummary.bulkWrite([
            {
              updateMany: {
                filter: { bet_summary_id: summery_id, runner_sid: sid },
                update: { $inc: { amount: -Number(lib) } }
              }
            },
            {
              updateMany: {
                filter: {
                  bet_summary_id: summery_id,
                  runner_sid: { $ne: sid }
                },
                update: { $inc: { amount: Number(pro) } }
              }
            }
          ]);
        }

        // Get new lock amount and max win amount
        /*
        const newBookAgg = await BetBookSummary.aggregate([
          { $match: { bet_summary_id: summery_id } },
          {
            $group: {
              _id: null,
              lock_amount: { $abs: { $min: "$amount" } },
              maxWinAmount: { $max: "$amount" },
            },
          },
        ]);*/

        const newBookAgg = await BetBookSummary.aggregate([
          { $match: { bet_summary_id: summery_id } },
          {
            $group: {
              _id: null,
              minAmount: { $min: { $ifNull: ["$amount", 0] } },
              maxWinAmount: { $max: { $ifNull: ["$amount", 0] } }
            }
          },
          {
            $project: {
              _id: 0,
              lock_amount: { $abs: "$minAmount" },
              maxWinAmount: 1
            }
          }
        ]);

        const newLockAmount = newBookAgg[0]?.lock_amount || 0;
        const maxWinAmount = newBookAgg[0]?.maxWinAmount || 0;

        if (Math.abs(newLockAmount) > max_expouser) {
          if (typ === "B") {
            /*
            await BetBookSummary.updateMany({ bet_summary_id: summery_id }, [
              {
                $set: {
                  amount: {
                    $add: [
                      "$amount",
                      {
                        $cond: [{ $eq: ["$runner_sid", sid] }, -pro, lib],
                      },
                    ],
                  },
                },
              },
            ]);*/
            await BetBookSummary.bulkWrite([
              {
                updateMany: {
                  filter: {
                    bet_summary_id: summery_id,
                    runner_sid: sid
                  },
                  update: { $inc: { amount: -Number(pro) } }
                }
              },
              {
                updateMany: {
                  filter: {
                    bet_summary_id: summery_id,
                    runner_sid: { $ne: sid }
                  },
                  update: { $inc: { amount: Number(lib) } }
                }
              }
            ]);
          } else {
            /*
            await BetBookSummary.updateMany({ bet_summary_id: summery_id }, [
              {
                $set: {
                  amount: {
                    $add: [
                      "$amount",
                      {
                        $cond: [{ $eq: ["$runner_sid", sid] }, lib, -pro],
                      },
                    ],
                  },
                },
              },
            ]);*/
            // DocumentDB-safe equivalent (no pipeline):
            // amount = amount + (runner_sid === sid ? lib : -pro)

            await BetBookSummary.bulkWrite([
              {
                updateMany: {
                  filter: {
                    bet_summary_id: summery_id,
                    runner_sid: sid
                  },
                  update: { $inc: { amount: Number(lib) } }
                }
              },
              {
                updateMany: {
                  filter: {
                    bet_summary_id: summery_id,
                    runner_sid: { $ne: sid }
                  },
                  update: { $inc: { amount: -Number(pro) } }
                }
              }
            ]);
          }
          return res.json({
            status: false,
            message: `Max expouser per market is ${max_expouser}`
          });
        }

        // Max winning check

        if (maxWinAmount > maxWinning) {
          // Revert previous update
          if (typ === "B") {
            /*
            await BetBookSummary.updateMany({ bet_summary_id: summery_id }, [
              {
                $set: {
                  amount: {
                    $add: [
                      "$amount",
                      {
                        $cond: [{ $eq: ["$runner_sid", sid] }, -pro, lib],
                      },
                    ],
                  },
                },
              },
            ]);*/

            await BetBookSummary.bulkWrite([
              {
                updateMany: {
                  filter: { bet_summary_id: summery_id, runner_sid: sid },
                  update: { $inc: { amount: -Number(pro) } }
                }
              },
              {
                updateMany: {
                  filter: {
                    bet_summary_id: summery_id,
                    runner_sid: { $ne: sid }
                  },
                  update: { $inc: { amount: Number(lib) } }
                }
              }
            ]);
          } else {
            /*
            await BetBookSummary.updateMany({ bet_summary_id: summery_id }, [
              {
                $set: {
                  amount: {
                    $add: [
                      "$amount",
                      {
                        $cond: [{ $eq: ["$runner_sid", sid] }, lib, -pro],
                      },
                    ],
                  },
                },
              },
            ]);*/

            await BetBookSummary.bulkWrite([
              {
                updateMany: {
                  filter: { bet_summary_id: summery_id, runner_sid: sid },
                  update: { $inc: { amount: Number(lib) } }
                }
              },
              {
                updateMany: {
                  filter: {
                    bet_summary_id: summery_id,
                    runner_sid: { $ne: sid }
                  },
                  update: { $inc: { amount: -Number(pro) } }
                }
              }
            ]);
          }
          return res.json({
            status: false,
            message: `Max Winning Limit:${maxWinning}`
          });
        }

        // Update lock amount in betfair event and bet_book_summary
        await BetfairEventBets.updateOne(
          { _id: summery_id },
          { $set: { lockamt: newLockAmount } }
        );
        await BetBookSummary.updateMany(
          { bet_summary_id: summery_id },
          { $set: { lock_amount: newLockAmount } }
        );

        // Calculate cla and book_lock_amount
        cla = pla - newLockAmount;
        book_lock_amount = Math.abs(cla);
        pointok = 1;
      } else {
        pointok = 0;
      }
    } else {
      if (Number(lib) <= Number(userHistory.bz_balance)) {
        cla = -lib;
        cla2 = lib;

        book_lock_amount = cla2;
        if (book_lock_amount > max_expouser) {
          return res.json({
            status: false,
            message: `Max expouser per market is ${max_expouser}`
          });
        }

        if (Number(userHistory.bz_balance) - Number(cla) >= 0) {
          /*const newBetEvent = new BetfairEventBets({
            cat_mid: mid,
            user_id: req.user._id,
            uname: req.user.uname,
            rnr1: "",
            rnr1s: 0,
            rnr2: "",
            rnr2s: 0,
            rnr3: "",
            rnr3s: 0,
            market_type: 1,
            lockamt: cla,
            rnr1sid: 0,
            rnr2sid: 0,
            rnr3sid: 0,
            bet_game_type: game_type,
          });*/
          const newBetEvent = new BetfairEventBets({
            cat_mid: mid,
            user_id: req.user._id,
            uname: req.user.uname,
            rnr1: "0",
            rnr1s: 0,
            rnr2: "0",
            rnr2s: 0,
            rnr3: "0",
            rnr3s: 0,
            market_type: 1,
            bet_game_type: game_type,
            lockamt: cla2,
            rnr1sid: 0,
            rnr2sid: 0,
            rnr3sid: 0,
            parent_cat_mid: "",
            event_name: eventName,
            punterSharing: punterSharing
          });
          await newBetEvent.save();
          summery_id = newBetEvent._id;
          console.log("betBookSummaryDocs->", summery_id);

          if (summery_id && req.user._id) {
            // Get all runners for this market
            const runners = await BetfairEventsRunner.find({
              cat_mid: mid
            }).lean();

            const betBookSummaryDocs = runners.map((runner) => {
              let amount;
              if (typ === "B") {
                amount = runner.section_id === cat_sid ? pro : -lib;
              } else {
                amount = runner.section_id === cat_sid ? -lib : pro;
              }
              return {
                bet_summary_id: summery_id,
                runner_sid: runner.section_id,
                amount,
                creation_date: new Date(),
                user_id: userid,
                summary_cat_mid: mid,
                bet_runner_name: runner.runner_name,
                lock_amount: lib,
                is_bet_win: "0"
              };
            });
            console.log("betBookSummaryDocs->", betBookSummaryDocs);
            await BetBookSummary.insertMany(betBookSummaryDocs);
          }
          pointok = 1;
        } else {
          pointok = 2;
        }
      } else {
        pointok = 0;
      }
    }

    if (pointok === 1) {
      // Update balance
      st2 = await UpdateBalance(req.user._id, cla);
      let after_bet_balance = await get_user_latest_points_byid(userid);

      // Inserting exposure here
      await pushExposure(req, res, mid, cla, eventName);
      // Insert bet

      const bt_bets_data = {
        uname: req.user.uname,
        user_id: req.user._id,
        cat_mid: mid,
        rnr,
        rate: liverate,
        amnt: amt,
        pro,
        lib,
        inplay,
        type: typ,
        cla,
        rnrsid: sid,
        evt_id,
        bet_type: "m",
        bet_summery_id: summery_id,
        section,
        ip_address,
        after_bet_balance: after_bet_balance,
        team1_book: 0,
        team2_book: 0,
        team3_book: 0,
        bet_market_type: 1,
        book_lock_amount,
        g_type: game_type,
        api_response: JSON.stringify(api_response),
        b1: b1Rate,
        l1: l1Rate,
        b2: b2Rate,
        l2: l2Rate,
        b3: b3Rate,
        l3: l3Rate,
        section: betfairEventsRunner,
        event_name: eventName
      };
      let bet = new BtBets(bt_bets_data);
      await bet.save();
      //summary_id = bet._id;

      bt_bets_data.full_chain = userHistory.full_chain;
      bt_bets_data.sponsor = userHistory.sponsor;
      bt_bets_data.sponser_id = userHistory.sponser_id;
      bt_bets_data.game_type = game_type;
      bt_bets_data.tblname = "bt_bets";
      bt_bets_data.master_link = master_link;
      bt_bets_data.bet_auto_id = bet._id;
      bt_bets_data.bet_time = moment().format("YYYY-MM-DD HH:mm:ss");

      // await redis.setBetList(mid, bet._id.toString(), JSON.stringify(bt_bets_data));

      //redis-book
      // Get book list for the user and market
      const bookList = await getHRGRBook(summery_id);
      const userBook = {
        uname: req.user.uname,
        mid,
        lock: parseInt(book_lock_amount),
        full_chain: userHistory.full_chain,
        sponsor: userHistory.sponsor,
        sponser_id: userHistory.sponser_id,
        market_type: 1,
        game_type,
        user_id: userid,
        master_link,
        book: bookList
      };
      const redis_key = `${userid}_${mid}`;
      //$this->redis->setBookData($mid,$userid,json_encode($userBook));

      if (st2) {
        // Calculate new balance point
        const balance_point = userHistory.bz_balance + cla;
        // Optionally, set session point if using sessions (req.session.point = balance_point);

        // Log the bet
        const logData = {
          user_id: req.user._id,
          page: "livebet",
          linkid: bet._id,
          ptrans: cla,
          otrans: "",
          points: balance_point,
          obal: userHistory.opin_bal,
          uname: req.user.uname,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
          ptype: "bet"
        };
        await UserLogs.create(logData);

        // Create notification
        const description = `${uid} has placed a new bet #${bet._id} by ${stake} to ${eventName} with odds ${liverate}`;
        const notificationsData = {
          evt_id,
          user_id: req.user._id,
          game_type,
          description
        };
        await LiveNotifications.create(notificationsData);

        // Vanit explain the following create log, do we need it?
        // await createLog(req.user._id, 'sports', description);

        return res.json({
          status: true,
          message: "Bet Place Successfully."
        });
      } else {
        return res.json({
          status: false,
          message: "BET_ERR_HERE"
        });
      }
    } else if (pointok == 2) {
      return res.json({ status: false, message: "Check your bet limit" });
    } else {
      return res.json({ status: false, message: "Insufficient balance" });
    }
  } else {
    return res.json({
      status: false,
      ratok,
      jsonds,
      liverate,
      message: "Odds not matched.Try Again"
    });
  }
};

module.exports = placeLiveHourseBet;
