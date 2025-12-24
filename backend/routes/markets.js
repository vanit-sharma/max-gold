const express = require("express");
const router = express.Router();
const { redisClient, getData } = require("../utils/redisClient");
const BetfairEvent = require("../models/BetfairEvent");
const BetfairEventBets = require("../models/BetfairEventBets");
const BetBookSummary = require("../models/BetBookSummary");

const auth = require("../middleware/auth");
const redisEvents = require("../redis/redisEvents");

const { getMarketData } = require("../utils/function");
const BtBets = require("../models/BtBets");
const LastdigitBetdetails = require("../models/LastdigitBetdetails");

// Protect all /events routes
//router.use(auth);

//bookmaker
async function getBookMakerOdds(catmid) {
  const bookmakerJson = await getData(catmid, 22);
  return bookmakerJson;
}

// match odd
async function getMarketOdds(catmid) {
  const marketJson = await getData(catmid, 0);
  return marketJson;
}

//toss data
async function getTossData(catmid) {
  const tossJson = await getData(catmid, 101);
  return tossJson;
}

router.get("/:id", async (req, res) => {
  const catmid = req.params.id;

  //console.log("Fetching event for ID:", catmid)

  const marketData = await getMarketData(catmid);
  //const eventDetails = await getData(catmid,30);
  //console.log("Fetching event for ID:", eventDetails);

  /*var bmOdds = "";
    if(eventDetails.is_bm_on && eventDetails.game_type==1) {
        bmOdds = await getBookMakerOdds(catmid); 
    }

    var marketOdds = "";
    marketOdds = await getMarketOdds(catmid);  
    */

  /*try {
      console.log("Fetching event for ID:", req.params.id);
      const event = await BetfairEvent.find({
        evt_status: "OPEN",
        cat_mid: req.params.id,
      });
      let key = `event_${req.params.id}`;
  
      const eventJson = await redisClient.hGetAll(`event_${req.params.id}`);
      console.log("eventJson:", eventJson);
  
      res.json({ live: eventJson, event: event });
    } catch (err) {
      res.status(500).json({ error: "Server Error", details: err.message });
    }*/

  res.json(marketData);
});

router.get("/bookmaker/:id", auth, async (req, res) => {
  res.json({ live: "bookmaker" });
});

router.get("/fany/:id", auth, async (req, res) => {
  res.json({ live: "fany" });
});

router.get("/related-events/:id", auth, async (req, res) => {
  try {
    const catmid = req.params.id;
    const event = await BetfairEvent.findOne({ cat_mid: catmid }).lean();
    const relatedEvents = await BetfairEvent.find({
      game_type: event.game_type,
      //evt_od: { $gte: new Date() },
      evt_status: "OPEN",
      parent_cat_mid: ""
    })
      .select("-evt_tz -evt_od -evt_mc -evt_cc -diamond_market_id") // exclude the values here
      .sort({ evt_od: 1 })
      .limit(5);
    res.json({ relatedEvents });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

router.post("/book/:id", auth, async (req, res) => {
  const catmid = req.params.id;
  const market_type = req.body.market_type;
  //console.log("req.user._id->",req.user._id);
  //console.log("catmid->",catmid);
  //console.log("market_type->",market_type);

  const rEvents = await BetfairEventBets.findOne({
    user_id: req.user._id,
    cat_mid: catmid,
    market_type: market_type
  }).lean();

  //console.log("rEvents->",rEvents);
  //console.log("rEvents.length->",rEvents.length);
  let liveStat = {};
  let lockAmount = 0;

  if (rEvents != null && rEvents != "") {
    lockAmount = rEvents.lockamt;
    liveStat = {
      total: rEvents.length,
      rnr1s: rEvents.rnr1s,
      rnr2s: rEvents.rnr2s,
      rnr3s: rEvents.rnr3s
    };
  } else {
    liveStat = {
      rnr1s: 0,
      rnr2s: 0,
      rnr3s: 0
    };
  }
  res.json({
    liveStat,
    lockAmount
  });
  /*} else if (market_type == 2) {
    if (rEvents.length > 0) {
      lockAmount = rEvents.lockamt;
      liveStat = {
        total: rEvents.length,
        rnr1s: rEvents.rnr1s,
        rnr2s: rEvents.rnr2s,
        rnr3s: rEvents.rnr3s,
      };
    } else {
      liveStat = {
        rnr1s: 0,
        rnr2s: 0,
        rnr3s: 0,
      };
    }
      */
});

router.post("/book/ff/:id", auth, async (req, res) => {
  const catmid = req.params.id;

  //console.log("req.user._id->",req.user._id);
  //console.log("catmid->",catmid);
  //console.log("market_type->",market_type);

  const lstBook = await BetfairEventBets.find({
    user_id: req.user._id,
    parent_cat_mid: catmid
  })
    .select(
      "-_id -winamt -stld -market_type -bet_game_type -is_process -calculative_amt -voided_record -user_id -uname -rnr1 -rnr1sid -rnr2 -rnr2sid -rnr3 -rnr3sid -rnr3s -lockamt"
    )
    .lean();

  console.log("lstBook->", lstBook);
  res.json({
    lstBook
  });
});

router.post("/hr-gr-book/:id", auth, async (req, res) => {
  const catmid = req.params.id;
  console.log("catmid1111->", catmid);
  const book_list = await BetBookSummary.find({
    user_id: req.user._id,
    summary_cat_mid: catmid
  })
    .select(
      "-api_response -is_bet_win -user_id -creation_date -updation_date -calc_amt -is_settled -_id -bet_summary_id"
    )
    .lean();

  //console.log("book_list->",book_list);

  res.json({ book_list: book_list });
});

router.get("/betlist/:id", auth, async (req, res) => {
  const catmid = req.params.id;
  let returnBetList = [];

  const bets_list = await BtBets.find({
    $or: [{ cat_mid: catmid }, { parent_cat_mid: catmid }],
    user_id: req.user._id,
    is_settled: false
  })
    .select(
      "-api_response -b1 -b2 -b3 -l1 -l2 -l3 -bet_device -bet_summery_id -cat_mid -ip_address -is_pending_bet -mid_stat -team1_book -team2_book -team3_book -_id -after_bet_balance -book_lock_amount -cla -delay -is_settled -bf_bets"
    )
    .sort({ stmp: -1 })
    .limit(40);

  for (let i = 0; i < bets_list.length; i++) {
    let betObj = bets_list[i];
    let bet = {};
    bet.uname = betObj.uname;
    bet.section = betObj.section;
    bet.lib = betObj.lib;
    bet.pro = betObj.pro;
    bet.amnt = betObj.amnt;
    bet.type = betObj.type;
    bet.bet_type = betObj.bet_type;
    bet.bet_market_type = betObj.bet_market_type;
    bet.bet_game_type = betObj.bet_game_type;
    bet.user_bet_rate = betObj.user_bet_rate;
    bet.rate = betObj.rate;
    bet.stmp = betObj.stmp;
    //creation_date
    returnBetList.push(bet);
  }

  const figure_bets_list = await LastdigitBetdetails.find({
    $or: [{ cat_mid: catmid }, { parent_cat_mid: catmid }],
    user_id: req.user._id
  })
    .select(
      "-settled_date -settled -user_id -lastdigit_betid -lastdigit_id -is_void -cat_mid -market_type -_id"
    )
    .sort({ stmp: -1 })
    .limit(40);

  for (let j = 0; j < figure_bets_list.length; j++) {
    let betObj = figure_bets_list[j];
    //console.log("betObj->", betObj);
    let bet = {};
    bet.amnt = betObj.bet_amount;
    bet.section = betObj.runner_name;
    bet.user_bet_rate = betObj.odd;
    bet.rate = betObj.bet_number;
    bet.bet_game_type = 1;
    bet.bet_market_type = 6;
    bet.bet_type = "m";
    bet.type = "b";
    bet.lib = betObj.bet_amount;
    bet.stmp = betObj.creation_date;
    returnBetList.push(bet);
  }
  returnBetList.sort((a, b) => b.stmp - a.stmp);
  //console.log("bets_list->", returnBetList);
  res.json({
    bets_list: returnBetList
    //figure_bets_list: figure_bets_list,
    //returnBetList: returnBetList
  });
});


module.exports = router;
