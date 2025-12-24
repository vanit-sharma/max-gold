const express = require("express");
const router = express.Router();
const Punter = require("../models/Punter");
const auth = require("../middleware/auth");
const BetfairEvent = require("../models/BetfairEvent");
const PunterTransSummary = require("../models/PunterTransSummary");
const PunterTransDetails = require("../models/PunterTransDetails");

const moment = require("moment");
router.use(auth);

router.post("/", auth, async (req, res) => {
  let sports_type = req.body.sports_type;
  let from_date = req.body.fromdate;
  let to_date = req.body.todate;
  let user_id = req.user._id;

  //console.log("sports_type->", sports_type);
  //console.log("from_date->", from_date);
  //console.log("to_date->", to_date);
  //console.log("user_id->", user_id);

  const startDate = moment(from_date);
  const endDate = moment(to_date);

  //console.log("startDate->", startDate);
  //console.log("endDate->", endDate);

  let returnObj = {};
  returnObj.cricket = 0;
  returnObj.fancy = 0;
  returnObj.soccer = 0;
  returnObj.tennis = 0;
  returnObj.greyhound = 0;
  returnObj.horseRace = 0;
  returnObj.tpStudio = 0;
  returnObj.galexyStudio = 0;
  returnObj.betfairGames = 0;
  returnObj.worldCasino = 0;

  let cricket_amount = 0;
  let cricket_bookmaker = 0;
  let cricket_bf_fancy_amount = 0;
  let cricket_evenodd = 0;
  let cricket_figure = 0;
  let cricket_toss = 0;
  let cricket_tie = 0;

  let fancy = 0;
  let football_set = 0;
  let football = 0;
  let tennis = 0;
  let greyhound = 0;
  let horseRace = 0;
  let tpStudio = 0;
  let galexyStudio = 0;
  let worldCasino = 0;
  let betfairGames = 0;
  let grandTotal = 0;

  let obj = {};
  obj.user_id = user_id;
  obj.created_date = { $gte: startDate, $lte: endDate };
  //console.log("obj->", obj);
  const recordList = await PunterTransSummary.find(obj).select().sort().limit();
  //console.log("recordList->", recordList);

  for (let i = 0; i < recordList.length; i++) {
    let obj = recordList[i];
    //console.log("obj->", obj);

    cricket_amount = cricket_amount + obj.cricket_amount;
    cricket_bookmaker = cricket_bookmaker + obj.cricket_bookmaker;
    cricket_bf_fancy_amount =
      cricket_bf_fancy_amount + obj.cricket_bf_fancy_amount;
    cricket_figure = cricket_figure + obj.cricket_figure;
    cricket_evenodd = cricket_evenodd + obj.cricket_evenodd;
    cricket_toss = cricket_toss + obj.cricket_toss;
    cricket_tie = cricket_tie + obj.cricket_tie;

    fancy = fancy + obj.cricket_fancy_amount;
    football_set = football_set + obj.football_set_amount;
    football = football + obj.football_amount;
    tennis = tennis + obj.tennis_amount;
    greyhound = greyhound + obj.grayhound_amount;
    horseRace = horseRace + obj.horserace_amount;
    tpStudio = tpStudio + obj.teenpati_studio_amount;
    galexyStudio = galexyStudio + obj.galaxy_casino_amount;
    worldCasino = worldCasino + obj.world_casino_amount;
    betfairGames = betfairGames + obj.betfairgames_amount;
  }

  /*console.log(
    "cricket_amount->",
    cricket_amount,
    "cricket_bookmaker->",
    cricket_bookmaker,
    "cricket_bf_fancy_amount->",
    cricket_bf_fancy_amount + "cricket_figure->" + cricket_figure,
    "cricket_evenodd->" + cricket_evenodd,
    "cricket_toss->" + cricket_toss,
    "cricket_tie->" + cricket_tie
  );*/

  returnObj.cricket = Math.round(
    cricket_amount +
      cricket_bookmaker +
      cricket_bf_fancy_amount +
      cricket_figure +
      cricket_evenodd +
      cricket_toss +
      cricket_tie
  );

  returnObj.fancy = fancy;
  returnObj.soccer = Math.round(football_set + football);
  returnObj.tennis = Math.round(tennis);
  returnObj.greyhound = Math.round(greyhound);
  returnObj.horseRace = Math.round(horseRace);
  returnObj.tpStudio = Math.round(tpStudio);
  returnObj.galexyStudio = Math.round(galexyStudio);
  returnObj.betfairGames = Math.round(betfairGames);
  returnObj.worldCasino = Math.round(worldCasino);
  grandTotal =
    returnObj.cricket +
    fancy +
    football_set +
    football +
    tennis +
    greyhound +
    horseRace +
    tpStudio +
    galexyStudio +
    betfairGames;
  returnObj.grandTotal = Math.round(grandTotal);

  res.json({ returnObj });
});

router.post("/pl-details", auth, async (req, res) => {
  console.log("req.body->", req.body);

  let sports_type = req.body.sportsType;
  let marketId = req.body.marketId;
  let from_date = req.body.fromdate;
  let to_date = req.body.todate;
  let user_id = req.user._id;

  const tz = "Europe/London";

  //const startDate = moment(from_date);
  //const endDate = moment(to_date);

  const startDate = moment
    .tz(from_date.split(" ")[0], "YYYY-MM-DD", tz)
    .startOf("day")
    .toDate();
  const endDate = moment
    .tz(to_date.split(" ")[0], "YYYY-MM-DD", tz)
    //.add(1, "day")
    //.startOf("day")
    .endOf("day")
    .toDate();

  let obj = {};
  obj.user_id = user_id;
  if (sports_type == 2) {
    obj.game_type = sports_type;
    obj.market_type = { $in: [1, 6] };
  } else if (sports_type == 3) {
    obj.game_type = sports_type;
    obj.market_type = 1;
  } else if (sports_type == 1 && marketId == 1) {
    obj.game_type = sports_type;
    obj.market_type = { $in: [1, 2, 6, 8] };
  } else if (sports_type == 1 && marketId == 3) {
    obj.game_type = sports_type;
    obj.market_type = 3;
  } else if (sports_type == 9) {
    obj.game_type = sports_type;
  } else {
    obj.game_type = sports_type;
    obj.market_type = marketId;
  }

  obj.created_date = { $gte: startDate, $lte: endDate };
  //console.log("obj->", obj);
  const recordList = await PunterTransDetails.find(obj)
    .select(
      "-bettor_c -bettor_d -child_user_id -sadmin_c -sadmin_d -scompany_c -scompany_d -sharing -smaster_c -smaster_d -admin_c -admin_d -company_c -company_d -master_c -master_d -owner_c -owner_d -payment_type -player_id -user_role -voided -type"
    )
    .sort({ created_date: 1 })
    .limit();
  let returnList = [];
  //console.log("recordList->", recordList);
  for (let i = 0; i < recordList.length; i++) {
    let objValue = recordList[i];
    //console.log("objValue->", objValue);
    let sports_type = objValue.game_type;
    let marketId = objValue.market_type;
    let arr = {};
    if (sports_type == 1 && marketId == 3) {
      arr.event_name = objValue.remark;
    } else if (sports_type == 1 && marketId == 2) {
      arr.event_name = objValue.event_name + "/Bookmaker";
    } else if (sports_type == 1 && marketId == 1) {
      if (objValue.market_type == 2) {
        arr.event_name = objValue.event_name + "(Bookmaker)";
      } else if (objValue.market_type == 8) {
        arr.event_name = objValue.event_name + "/" + objValue.remark;
      } else {
        arr.event_name = objValue.event_name;
      }
    } else if (sports_type == 1 && marketId == 6) {
      arr.event_name = objValue.event_name + "/" + objValue.remark;
    } else if (sports_type == 1 && marketId == 8) {
      arr.event_name = objValue.event_name + "/" + objValue.remark;
    } else if (sports_type == 2 && marketId == 6) {
      arr.event_name = objValue.event_name + "/" + objValue.remark;
    } else {
      arr.event_name = objValue.event_name;
    }

    arr.created_date = objValue.created_date;
    arr.amount = Math.round(objValue.amount);
    arr.uname = objValue.uname;
    arr.id = objValue._id;
    arr.game_type = objValue.game_type;
    arr.market_type = objValue.market_type;

    returnList.push(arr);
  }
  //console.log("returnList->", returnList);
  res.json({ list: returnList });
});

router.get("/trans-details/:transid", async (req, res) => {
  const { transid } = req.params;
  //router.post("/trans-details", auth, async (req, res) => {
  //let transid = req.body.transid;
  console.log("transid->", transid);
  if (transid !== "") {
    let obj = {};
    obj._id = transid;
    const recordList = await PunterTransDetails.findOne(obj)
      .select(
        "-bettor_c -bettor_d -child_user_id -sadmin_c -sadmin_d -scompany_c -scompany_d -sharing -smaster_c -smaster_d -admin_c -admin_d -company_c -company_d -master_c -master_d -owner_c -owner_d -payment_type -player_id -user_role -voided -type"
      )
      .sort({ created_date: 1 })
      .limit();

    return res.json({ status: true, bet: recordList });
    //console.log("recordList->", recordList);
  } else {
    return res.json({ status: false, message: "Transaction Id is missing" });
  }
});

 


module.exports = router;
