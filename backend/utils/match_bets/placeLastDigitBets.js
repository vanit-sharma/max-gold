const mongoose = require("mongoose");
const useragent = require("express-useragent");
const { body, validationResult } = require("express-validator");
const getSportsLimit = require("../../lib/getSportsLimit");
const Punter = require("../../models/Punter");
const AdmBetStart = require("../../models/AdmBetStart");
const BetfairEvent = require("../../models/BetfairEvent");
const LastdigitEvent = require("../../models/LastdigitEvent");
const LastdigitBetdetails = require("../../models/LastdigitBetdetails");
const BetlockByMarket = require("../../models/BetlockByMarket.js");
const LastDigitBet = require("../../models/LastDigitBet.js");

const {
  getUserHierarchy,

  UpdateBalance,
  createLog,
  pushExposure,
  getPunterSharing
} = require("../function.js");

const UserLogs = require("../../models/UserLogs.js");

const placeLastDigitBets = async (req, res) => {
  const anyOdd = req.body.accept_any_odd;
  const uid = req.user.uname;
  let result = {};

  console.log("uid->", uid);

  const type = req.body.bet_type; // b = back, l = lay
  const mid = req.body.catmid; // cat_mid
  const odd = req.body.odds; // rate like 2.8
  const catSid = req.body.sid; // team sid
  const stake = req.body.amount; // amount
  const lastdigitid = req.body.lastdigitid.$oid; // lastdigitid

  const fancyDelay = req.body.fancy_delay; // fancy_delay
  let marketType = req.body.market_type; // market_type
  const eventId = req.body.eventId; // eventId
  const price = req.body.price; // price 2.8
  const runnerName = req.body.runnername; // runnername
  let cla;
  let event_name = "";

  if (!lastdigitid) {
    return res.status(400).json({
      status: false,
      message: "Market Not valid"
    });
  }

  const lastdgQuery = {
    _id: lastdigitid,
    result: "",
    status: 1,
    is_settled: 0,
    is_deleted: 0
  };

  const drldg = await LastdigitEvent.findOne(lastdgQuery);

  if (!drldg) {
    return res.status(400).json({
      status: false,
      message: "Last Digit Market not found."
    });
  }

  let runner_name = "";
  if (drldg) {
    const team_name = drldg.team_name;
    const over = drldg.over;
    runner_name = team_name + " " + over + " Over Total last Figure";
  }

  //$lastdigitid = $postArr['lastdigitid'];

  const lastdigitNumber = req.body.sid;

  marketType = "m";
  const currency = req.user.currency;
  const userId = req.user._id;
  let mat_mlimit, min_amount, max_expouser;
  if (currency == 1 || currency == 2) {
    mat_mlimit = getSportsLimit("cricket", userId);
    min_amount = getSportsLimit("cricket_min", userId);
  } else {
    mat_mlimit = getSportsLimit("figure", userId);
    min_amount = getSportsLimit("figure_min", userId);
    max_expouser = getSportsLimit("figure_exp", userId);
  }

  if (stake < min_amount) {
    return res.status(400).json({
      status: false,
      message: "Amount not valid. We accept min" + min_amount + " point bet."
    });
  }
  const userControls = await Punter.findOne(
    { uname: uid },
    "f_enable c_enble t_enable"
  );

  if (!userControls || userControls.c_enble === 0) {
    return res.status(400).json({
      status: false,
      message: "You cannot place a bet on this sport."
    });
  }

  const admBet = await AdmBetStart.findOne({ sno: 1 });

  if (!admBet || !admBet.IsBettingStart) {
    return res.status(400).json({
      status: false,
      message: "Betting is not open for this match."
    });
  }

  if (mid.length > 20) {
    return res.status(400).json({
      status: false,
      message: "Mid not Valid"
    });
  }

  const typ = "b"; // Back lay

  const rat = odd; // Odds
  if (rat.length > 8.85) {
    return res.status(400).json({
      status: false,
      message: "We are not accepting bet on this Odds"
    });
  }

  amt = stake; // bet amount
  if (amt > mat_mlimit) {
    //$result['status'] = false;
    //$result['message'] = "Max Size is: ".$mat_mlimit;
    //return $result;
  }

  if (amt < min_amount) {
    return res.status(400).json({
      status: false,
      message: "Min Size is " + min_amount
    });
  }

  //uid = req.user.uname;
  const betfairEventsDetails = await BetfairEvent.findOne({ cat_mid: mid })
    .select("cat_mid inplay evt_status evt_evt")
    .lean();
  if (betfairEventsDetails) {
    cid = betfairEventsDetails.cat_mid;
  }

  if (betfairEventsDetails) {
    isInplay = betfairEventsDetails.inplay;
    evt_status = betfairEventsDetails.evt_status;
    event_name = betfairEventsDetails.evt_evt;
    if (isInplay != 1 || evt_status != "OPEN") {
      return res.status(400).json({
        status: false,
        message: "We accept bet on Inplay and Open market Only"
      });
    }
  }

  let evt_name = betfairEventsDetails.evt_evt;

  const queryLock = await BetlockByMarket.findOne({
    market_type: 1,
    selected_users: userId,
    cat_mid: mid
  });

  if (queryLock) {
    return res.status(400).json({
      status: false,
      message: "Bet not allowed in this market"
    });
  }

  const betCount = await LastdigitBetdetails.countDocuments({
    user_id: userId,
    lastdigit_id: lastdigitid
  });

  if (betCount > 10) {
    return res.status(400).json({
      status: false,
      message: "Bet Limit Exceeded"
    });
  }

  const betfairEvents = await LastdigitEvent.findOne({
    _id: lastdigitid, // make sure this is an ObjectId
    is_deleted: 0,
    is_settled: 0,
    result: ""
  }).lean();

  if (betfairEvents) {
    betfairEvents.open_status = betfairEvents.closed_date < new Date() ? 0 : 1;
  }

  if (betfairEvents) {
    tblOdd = betfairEvents.odd;
    open_status = betfairEvents.open_status;
    team_name = betfairEvents.team_name;
  } else {
    result.status = false;
    result.message = "Event Not Open";
    return res.status(400).json(result);
  }

  let liverate = 0;
  ta = 0;
  tb = 0;

  let dr = await Punter.aggregate([
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

  dr = dr[0];
  if (dr && dr.logon == 1) {
    return res.status(400).json({
      status: false,
      message: "Session not valid to place this bet"
    });
  }

  if (dr) {
    user_id = req.user._id;
    full_chain = dr.full_chain;
    sponsor = dr.sponsor;
    sponser_id = dr.sponser_id;

    let punterSharing = await getPunterSharing(req.user._id);

    if (dr.stat == 1 && dr.bet_status == 1) {
      if (typ == "b") {
        liverate = tblOdd;

        if (marketType == "f") {
          liverate = 2;
          tblOdd = 2;
        }

        ratok = 1;
      }

      if (liverate > 8.85) {
        result.status = false;
        result.message = "We are not accepting bet on this odd.";
        return res.status(400).json(result);
      }

      if (!liverate) {
        ratok = 12;
      } else {
        ratok = 1;
        lib = amt;

        pro = tblOdd * amt;

        ta += pro;
        tb -= lib;
      }

      num_0 = 0;
      num_1 = 0;
      num_2 = 0;
      num_3 = 0;
      num_4 = 0;
      num_5 = 0;
      num_6 = 0;
      num_7 = 0;
      num_8 = 0;
      num_9 = 0;

      if (ratok == 1) {
        //try {
        pointok = 0;

        master_link = getUserHierarchy(user_id);

        const drstc = await LastDigitBet.findOne({
          cat_mid: mid,
          user_id: userId,
          lastdigit_id: lastdigitid,
          market_type: marketType
        }).lean();

        if (drstc) {
          lastdigit_betid = drstc._id;
          pla = drstc.lock_amt;

          if (dr.bz_balance >= lib) {
            if (lastdigitNumber == 0) {
              num_0 += Number(ta);
              num_1 = Number(tb);
              num_2 = Number(tb);
              num_3 = Number(tb);
              num_4 = Number(tb);
              num_5 = Number(tb);
              num_6 = Number(tb);
              num_7 = Number(tb);
              num_8 = Number(tb);
              num_9 = Number(tb);
            } else if (lastdigitNumber == 1) {
              num_0 -= Number(lib);
              num_1 += Number(pro);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 2) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 += Number(pro);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 3) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 += Number(pro);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 4) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 += Number(pro);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 5) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 += Number(pro);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 6) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 += Number(pro);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 7) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 += Number(pro);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 8) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 += Number(pro);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 9) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 += Number(pro);
            }

            //echo $num_0."/".$num_1."/".$num_2."/".$num_3."/".$num_4."/".$num_5."/".$num_6."/".$num_7."/".$num_8."/".$num_9;

            nla0 = Number(drstc.num_0) + Number(num_0);
            nla1 = Number(drstc.num_1) + Number(num_1);
            nla2 = Number(drstc.num_2) + Number(num_2);
            nla3 = Number(drstc.num_3) + Number(num_3);
            nla4 = Number(drstc.num_4) + Number(num_4);
            nla5 = Number(drstc.num_5) + Number(num_5);
            nla6 = Number(drstc.num_6) + Number(num_6);
            nla7 = Number(drstc.num_7) + Number(num_7);
            nla8 = Number(drstc.num_8) + Number(num_8);
            nla9 = Number(drstc.num_9) + Number(num_9);
            //echo "<br>";
            //echo $nla0."/".$nla1."/".$nla2."/".$nla3."/".$nla4."/".$nla5."/".$nla6."/".$nla7."/".$nla8."/".$nla9;

            const minValue = Math.min(
              nla0,
              nla1,
              nla3,
              nla4,
              nla5,
              nla6,
              nla7,
              nla8,
              nla9
            );
            let nla = minValue < 0 ? Math.abs(minValue) : 0;

            cla = pla - nla;

            if (dr.bz_balance >= cla) {
              pointok = 1;
              // update existing last_digit_bet doc: increment nums and set lock_amt, then read back

              const drBetBook = await LastDigitBet.findOneAndUpdate(
                {
                  cat_mid: mid,
                  lastdigit_id: lastdigitid,
                  user_id: userId,
                  market_type: marketType
                },
                {
                  $inc: {
                    num_0: Number(num_0),
                    num_1: Number(num_1),
                    num_2: Number(num_2),
                    num_3: Number(num_3),
                    num_4: Number(num_4),
                    num_5: Number(num_5),
                    num_6: Number(num_6),
                    num_7: Number(num_7),
                    num_8: Number(num_8),
                    num_9: Number(num_9)
                  },
                  $set: { lock_amt: nla }
                },
                { new: true, lean: true }
              );

              // use updated book values
              num_0 = Number(drBetBook.num_0);
              num_1 = Number(drBetBook.num_1);
              num_2 = Number(drBetBook.num_2);
              num_3 = Number(drBetBook.num_3);
              num_4 = Number(drBetBook.num_4);
              num_5 = Number(drBetBook.num_5);
              num_6 = Number(drBetBook.num_6);
              num_7 = Number(drBetBook.num_7);
              num_8 = Number(drBetBook.num_8);
              num_9 = Number(drBetBook.num_9);

              const userBook = {
                uname: uid,
                evt_name: evt_name,
                team_name: team_name,
                rnr0s: Number(num_0),
                rnr1s: Number(num_1),
                rnr2s: Number(num_2),
                rnr3s: Number(num_3),
                rnr4s: Number(num_4),
                rnr5s: Number(num_5),
                rnr6s: Number(num_6),
                rnr7s: Number(num_7),
                rnr8s: Number(num_8),
                rnr9s: Number(num_9),
                mid: mid,
                lock: Number(nla),
                full_chain: full_chain,
                sponsor: sponsor,
                sponser_id: sponser_id,
                market_type: marketType,
                game_type: 1,
                user_id: userId,
                uname: uid,
                master_link: master_link
              };

              const keyName = `digit_${lastdigitid}`;
              //$this->redis->setBookData($keyName,$user_id,json_encode($userBook));
            } else {
              pointok = 3;
            }
          } else {
            pointok = 3;
          }
        } else {
          if (dr.bz_balance >= lib) {
            pointok = 1;
            if (lastdigitNumber == 0) {
              num_0 += Number(pro);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 1) {
              num_0 -= Number(lib);
              num_1 += Number(pro);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 2) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 += Number(pro);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 3) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 += Number(pro);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 4) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 += Number(pro);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 5) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 += Number(pro);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 6) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 += Number(pro);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 7) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 += Number(pro);
              num_8 -= Number(lib);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 8) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 += Number(pro);
              num_9 -= Number(lib);
            } else if (lastdigitNumber == 9) {
              num_0 -= Number(lib);
              num_1 -= Number(lib);
              num_2 -= Number(lib);
              num_3 -= Number(lib);
              num_4 -= Number(lib);
              num_5 -= Number(lib);
              num_6 -= Number(lib);
              num_7 -= Number(lib);
              num_8 -= Number(lib);
              num_9 += Number(pro);
            }
            const newLastDigitBet = new LastDigitBet({
              user_id: userId,
              lastdigit_id: lastdigitid,
              cat_mid: mid,
              evt_name: evt_name,
              team_name: team_name,
              bet_number: lastdigitNumber,
              lock_amt: Math.abs(tb),
              win_amt: ta,
              create_date: new Date(),
              market_type: marketType,
              num_0: Number(num_0),
              num_1: Number(num_1),
              num_2: Number(num_2),
              num_3: Number(num_3),
              num_4: Number(num_4),
              num_5: Number(num_5),
              num_6: Number(num_6),
              num_7: Number(num_7),
              num_8: Number(num_8),
              num_9: Number(num_9),
              rnr_name: runner_name,
              uname: uid,
              punterSharing: punterSharing
            });

            const lastDigitBet = await newLastDigitBet.save();

            lastdigit_betid = lastDigitBet._id;
            pointok = 1;
            cla = tb;

            const userBook = {
              uname: uid,
              evt_name: evt_name,
              team_name: team_name,
              rnr0s: parseInt(num_0, 10),
              rnr1s: parseInt(num_1, 10),
              rnr2s: parseInt(num_2, 10),
              rnr3s: parseInt(num_3, 10),
              rnr4s: parseInt(num_4, 10),
              rnr5s: parseInt(num_5, 10),
              rnr6s: parseInt(num_6, 10),
              rnr7s: parseInt(num_7, 10),
              rnr8s: parseInt(num_8, 10),
              rnr9s: parseInt(num_9, 10),
              mid: mid,
              lock: parseInt(tb, 10),
              full_chain: full_chain,
              sponsor: sponsor,
              sponser_id: sponser_id,
              market_type: marketType,
              game_type: 1,
              user_id: userId,
              master_link: master_link
            };
            const keyName = `digit_${lastdigitid}`;
            //$this->redis->setBookData($keyName,$user_id,json_encode($userBook));
          } else {
            pointok = 3;
          }
        }

        if (pointok == 1) {
          master_link = getUserHierarchy(user_id);

          const btBetsData = {
            user_id: userId,
            lastdigit_id: lastdigitid,
            lastdigit_betid: lastdigit_betid,
            bet_number: lastdigitNumber,
            bet_amount: tb,
            win_amount: ta,
            odd: tblOdd,
            market_type: marketType,
            runner_name: runner_name,
            event_name: event_name,
            cat_mid: mid
          };

          const betDetailsRec = await LastdigitBetdetails.create(btBetsData);

          const betId = betDetailsRec._id;

          const bt_bets_data = {
            uname: uid,
            user_id: userId,
            bet_number: lastdigitNumber,
            section: runner_name,
            type: "BACK",
            rate: tblOdd,
            pro: tb,
            amnt: ta,
            lib: tb,
            date_time: new Date(),
            bet_type: marketType,
            cat_mid: mid,
            tblname: "lastdigit_betdetails",
            bfbets: 0,
            full_chain: full_chain,
            sponsor: sponsor,
            sponser_id: sponser_id,
            g_type: 1,
            master_link: master_link,
            bet_auto_id: betId,
            bet_time: new Date()
          };

          //$this->redis->setBetList($mid,$bet_id,json_encode($bt_bets_data));

          const st2 = UpdateBalance(req.user._id, cla);
          await pushExposure(req, res, mid, cla, runner_name);
          if (st2) {
            const balancePoint = dr.bz_balance + cla;

            const dt = new Date().toISOString();

            //New Logs
            const logData = {
              page: "livebet_lastdigit",
              linkid: betId,
              ptrans: cla,
              otrans: "",
              points: balancePoint,
              obal: dr.opin_bal,
              uname: uid,
              user_id: req.user._id,
              date: dt,
              ptype: "bet"
            };
            await UserLogs.create(logData);
            const description = `${uid} has placed a new bet on lastdigit market #${betId} by ${stake} to ${team_name} with odds ${tblOdd}`;

            await createLog(req, "sports", description);

            console.log("params->", {
              cat_mid: req.body.catmid,
              mid_mid: mid,
              user_id: req.user._id
            });
            const betDetails = await LastDigitBet.find({
              cat_mid: req.body.catmid,
              user_id: req.user._id,
              lastdigit_id: lastdigitid
            });

            return res.status(200).json({
              status: true,
              betDetails: betDetails,
              message: "Bet placed successfully on Last Digit Market."
            });
          }
        } else if (pointok == 2) {
          return res.status(400).json({
            status: false,
            message: "LIMIT_EX," + dr.plimit
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "Insufficient Balance"
          });
        }
        // } catch (Error) {
        //     //$db->rollBack();
        //     console.log("BET_ERROR");
        // }
      } else {
        return res.status(400).json({
          status: false,
          message: "Odd Change Live Rate:" + liverate + " UserRate=" + rat
        });
      }
    } else {
      let errorMessage = "";
      if (dr.stat === "0") {
        errorMessage = "Account not active.";
      } else if (dr.bet_status === "0") {
        errorMessage = "Bet is not allowed for your account.";
        // } else if (dr.user_role !== '5') {
        //     errorMessage = 'Bet is not active for this account.';
        // }
        return res.status(400).json({
          status: false,
          message: errorMessage
        });
      }
    }
  }
};

module.exports = placeLastDigitBets;
