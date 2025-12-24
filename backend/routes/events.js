const express = require("express");
const router = express.Router();
const {redisClient, getData} = require("../utils/redisClient");
const BetfairEvent = require("../models/BetfairEvent");
const auth = require("../middleware/auth");

// Protect all /events routes
//router.use(auth);

function formatEventDate(isoString) {
  const dateObj = new Date(isoString);

  const date = dateObj
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    })
    .replace(",", "");

  const time = dateObj
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    })
    .toLowerCase();

  return { date, time };
}

function returnSportsType(sportsType) {
  switch (sportsType) {
    case 1:
      return "Cricket";
    case 2:
      return "Football";
    case 3:
      return "Tennis";
    case 4:
      return "Horse Racing";
    case 5:
      return "Greyhound";
  }
}

function convertInAarray(event) {
  console.log(obj);
  var formnattedEvent = {
    evt_id: event?.evt_id,
    name: event?.name,
    date: formattedDate.date,
    //date: event?.evt_od,
    time: formattedDate.time,
    cat_mid: event?.cat_mid,
    inplay: event?.inplay,
    no: event?.matchno,
    sports: returnSportsType(event?.game_type),
    is_bm_on: event?.is_bm_on,
    fancy: event?.fancy,
    comp: event?.comp_name,
    game_type: event?.game_type,
    multimarket: [],
    toss_on: event?.toss_on,
    livetv: event?.livetv,
    odds: {},
    runner: event?.num_of_runner,
    venue: event?.venue,
    totalMatched: event?.cat_matched,
    counter: 0,
    evt_od: event?.evt_od,
    sport_radar_id: event?.sport_radar_id,
    toss_on: event?.toss_on,
    tie_on: event?.tie_on,
    is_bet_accept: event?.is_bet_accept,
    evt_status: event?.evt_status,
    stat1: event?.stat1,
    stat2: event?.stat2,
    stat3: event?.stat3,
    odds: {
      r1b: 2.04,
      r1l: 2.08,
      r2b: 1.92,
      r2l: 1.96,
      r3b: 0,
      r3l: 0,
      s1: "ACTIVE",
      s2: "ACTIVE",
      s3: "SUSPENDED",
      t2Size: "250K",
      t3Size: "250K",
      t4Size: "1M",
      t5Size: "1M",
      t6Size: "0",
      t7Size: "0",
    },
  };
}

// GET /events e.g, GET http://localhost:5000/events
router.get("/", auth, async (req, res) => {
  try {
    //$redisEventData = $this->redis->getData("bz_events", 0);
    const eventsJson = await getData("bz_events", 0);

    var cache = false;
    var eventsJsonNew = eventsJson;
    //console.log("eventsJson->", eventsJsonNew);

    if (eventsJsonNew) {
      cache = true;
      const valuesKey = Object.keys(eventsJsonNew["result"]);

      let count = 0;
      let result = [];
      for (let key in valuesKey) {
        if (
          eventsJsonNew["result"] != "" &&
          eventsJsonNew["result"][valuesKey[key]] != undefined
        ) {
          result.push(eventsJsonNew["result"][valuesKey[key]]);
          count++;
        }
      }

      //console.log("result->", result.length);

      let grey = [];
      const valuesKeyGray = Object.keys(eventsJsonNew["grey"]);
      for (let keyGray in valuesKeyGray) {
        if (
          eventsJsonNew["grey"] != "" &&
          eventsJsonNew["grey"][valuesKeyGray[keyGray]] != undefined
        ) {
          grey.push(eventsJsonNew["grey"][valuesKeyGray[keyGray]]);
          count++;
        }
      }

      let horse = [];
      const valuesKeyHorse = Object.keys(eventsJsonNew["horse"]);
      for (let keyHorse in valuesKeyHorse) {
        if (
          eventsJsonNew["horse"] != "" &&
          eventsJsonNew["horse"][valuesKeyHorse[keyHorse]] != undefined
        ) {
          horse.push(eventsJsonNew["horse"][valuesKeyHorse[keyHorse]]);
          count++;
        }
      }

      return res.json({
        status: true,
        c: cache,
        count,
        result,
        horse,
        grey
      });
      //return res.json(JSON.parse(eventsJson[0]));
    }

    const events = await BetfairEvent.find({
      evt_status: "OPEN",
      parent_cat_mid: ""
    });
    let count = 0;
    let horse = {};
    let grey = {};
    let result = [];

    let formnattedEvent = {};

    console.log("events->");

    for (const event of events) {
      //console.log("Node Events", event);
      const id = event?.evt_id?.toString();
      const formattedDate = formatEventDate(event?.evt_od);
      formnattedEvent = {
        evt_id: event?.evt_id,
        name: event?.evt_evt,
        date: formattedDate.date,
        //date: event?.evt_od,
        time: formattedDate.time,
        cat_mid: event?.cat_mid,
        inplay: event?.inplay,
        no: event?.matchno,
        sports: returnSportsType(event?.game_type),
        bm: event?.is_bm_on,
        fancy: event?.fancy,
        comp: event?.comp_name,
        sports_type: event?.game_type,
        multimarket: [],
        toss_on: event?.toss_on,
        livetv: event?.livetv,
        runner: event?.num_of_runner,
        venue: event?.venue,
        totalMatched: event?.cat_matched,
        counter: 0,
        evt_od: event?.evt_od,
        sport_radar_id: event?.sport_radar_id,
        toss_on: event?.toss_on,
        tie_on: event?.tie_on,
        is_bet_accept: event?.is_bet_accept,
        evt_status: event?.evt_status,
        stat1: event?.stat1,
        stat2: event?.stat2,
        stat3: event?.stat3,
        odds: {
          r1b: 2.04,
          r1l: 2.08,
          r2b: 1.92,
          r2l: 1.96,
          r3b: 0,
          r3l: 0,
          s1: "ACTIVE",
          s2: "ACTIVE",
          s3: "SUSPENDED",
          t2Size: "250K",
          t3Size: "250K",
          t4Size: "1M",
          t5Size: "1M",
          t6Size: "0",
          t7Size: "0"
        }
      };
      const sportsType = Number(event?.game_type);

      count++;
      if (sportsType === 1 || sportsType === 2 || sportsType === 3) {
        result.push(formnattedEvent);
        //results.push(formnattedEvent);
      } else if (sportsType === 4 && event.mid) {
        horse[event.mid] = formnattedEvent;
      } else if (sportsType === 5 && event.mid) {
        grey[event.mid] = formnattedEvent;
      }
    }

    return res.json({
      status: true,
      c: cache,
      count,
      result,
      horse,
      grey
    });
    //res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// GET /events/:id e.g, GET http://localhost:5000/events/12345

router.get("/:id", auth, async (req, res) => {
  try {
    console.log("Fetching event for ID:", req.params.id);

    const event = await BetfairEvent.aggregate([
      {
         $match: { cat_mid: req.params.id,parent_cat_mid:{$eq:""} },
       },
         {
         $lookup: {
           from: "bz_betfair_events_runner", // the collection name
           localField: "cat_mid", // Punter’s _id
           foreignField: "cat_mid", // history’s userAutoId
           as: "betfair_runners", // output array field
         },
       }, 
       ]);
    
    /*const event = await BetfairEvent.find({
      evt_status: "OPEN",
      cat_mid: req.params.id,
    });
    */
     
    const eventsJson = await getData(req.params.id,30);   

    res.json({ live: eventsJson, event: event });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

module.exports = router;
