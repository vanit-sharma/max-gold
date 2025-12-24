const { JsonWebTokenError } = require("jsonwebtoken");
const { createClient } = require("redis");
const { redisClient, getData } = require("./redisClient");
const getClientIp = require("../utils/getClientIp");

async function getBetfairGamesHoldemData() {
  const gameDataJson = await getData("betfair_hold", 0);

  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesTurboHoldemData() {
  const gameDataJson = await getData("betfair_turbo_hold", 0);

  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesBlackjackData() {
  const gameDataJson = await getData("betfair_blackjack", 0);
  //console.log(gameDataJson);
  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  result.prediction = gameDataJson["prediction"][0];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];
  result.cat_rnr5 = gameDataJson["cat_rnr5"][0];
  result.cat_rnr6 = gameDataJson["cat_rnr6"][0];
  result.cat_rnr7 = gameDataJson["cat_rnr7"][0];
  result.cat_rnr8 = gameDataJson["cat_rnr8"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];
  result.cat_sid5 = gameDataJson["cat_sid5"];
  result.cat_sid6 = gameDataJson["cat_sid6"];
  result.cat_sid7 = gameDataJson["cat_sid7"];
  result.cat_sid8 = gameDataJson["cat_sid8"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];
  result.suspend5 = gameDataJson["suspend5"];
  result.suspend6 = gameDataJson["suspend6"];
  result.suspend7 = gameDataJson["suspend7"];
  result.suspend8 = gameDataJson["suspend8"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];
  result.rnr5_status = gameDataJson["rnr5_status"];
  result.rnr6_status = gameDataJson["rnr6_status"];
  result.rnr7_status = gameDataJson["rnr7_status"];
  result.rnr8_status = gameDataJson["rnr8_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";
  result.runner5b1 = gameDataJson["runner5b1"][0]
    ? gameDataJson["runner5b1"][0]
    : "0";
  result.runner5b2 = gameDataJson["runner5b2"][0]
    ? gameDataJson["runner5b2"][0]
    : "0";
  result.runner5b3 = gameDataJson["runner5b3"][0]
    ? gameDataJson["runner5b3"][0]
    : "0";
  result.runner5l1 = gameDataJson["runner5l1"][0]
    ? gameDataJson["runner5l1"][0]
    : "0";
  result.runner5l2 = gameDataJson["runner5l2"][0]
    ? gameDataJson["runner5l2"][0]
    : "0";
  result.runner5l3 = gameDataJson["runner5l3"][0]
    ? gameDataJson["runner5l3"][0]
    : "0";
  result.runner6b1 = gameDataJson["runner6b1"][0]
    ? gameDataJson["runner6b1"][0]
    : "0";
  result.runner6b2 = gameDataJson["runner6b2"][0]
    ? gameDataJson["runner6b2"][0]
    : "0";
  result.runner6b3 = gameDataJson["runner6b3"][0]
    ? gameDataJson["runner6b3"][0]
    : "0";
  result.runner6l1 = gameDataJson["runner6l1"][0]
    ? gameDataJson["runner6l1"][0]
    : "0";
  result.runner6l2 = gameDataJson["runner6l2"][0]
    ? gameDataJson["runner6l2"][0]
    : "0";
  result.runner6l3 = gameDataJson["runner6l3"][0]
    ? gameDataJson["runner6l3"][0]
    : "0";
  result.runner7b1 = gameDataJson["runner7b1"][0]
    ? gameDataJson["runner7b1"][0]
    : "0";
  result.runner7b2 = gameDataJson["runner7b2"][0]
    ? gameDataJson["runner7b2"][0]
    : "0";
  result.runner7b3 = gameDataJson["runner7b3"][0]
    ? gameDataJson["runner7b3"][0]
    : "0";
  result.runner7l1 = gameDataJson["runner7l1"][0]
    ? gameDataJson["runner7l1"][0]
    : "0";
  result.runner7l2 = gameDataJson["runner7l2"][0]
    ? gameDataJson["runner7l2"][0]
    : "0";
  result.runner7l3 = gameDataJson["runner7l3"][0]
    ? gameDataJson["runner7l3"][0]
    : "0";
  result.runner8b1 = gameDataJson["runner8b1"][0]
    ? gameDataJson["runner8b1"][0]
    : "0";
  result.runner8b2 = gameDataJson["runner8b2"][0]
    ? gameDataJson["runner8b2"][0]
    : "0";
  result.runner8b3 = gameDataJson["runner8b3"][0]
    ? gameDataJson["runner8b3"][0]
    : "0";
  result.runner8l1 = gameDataJson["runner8l1"][0]
    ? gameDataJson["runner8l1"][0]
    : "0";
  result.runner8l2 = gameDataJson["runner8l2"][0]
    ? gameDataJson["runner8l2"][0]
    : "0";
  result.runner8l3 = gameDataJson["runner8l3"][0]
    ? gameDataJson["runner8l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";
  result.runner5b1_matched = gameDataJson["runner5b1_matched"][0]
    ? gameDataJson["runner5b1_matched"][0]
    : "0";
  result.runner5b2_matched = gameDataJson["runner5b2_matched"][0]
    ? gameDataJson["runner5b2_matched"][0]
    : "0";
  result.runner5b3_matched = gameDataJson["runner5b3_matched"][0]
    ? gameDataJson["runner5b3_matched"][0]
    : "0";
  result.runner5l1_matched = gameDataJson["runner5l1_matched"][0]
    ? gameDataJson["runner5l1_matched"][0]
    : "0";
  result.runner5l2_matched = gameDataJson["runner5l2_matched"][0]
    ? gameDataJson["runner5l2_matched"][0]
    : "0";
  result.runner5l3_matched = gameDataJson["runner5l3_matched"][0]
    ? gameDataJson["runner5l3_matched"][0]
    : "0";
  result.runner6b1_matched = gameDataJson["runner6b1_matched"][0]
    ? gameDataJson["runner6b1_matched"][0]
    : "0";
  result.runner6b2_matched = gameDataJson["runner6b2_matched"][0]
    ? gameDataJson["runner6b2_matched"][0]
    : "0";
  result.runner6b3_matched = gameDataJson["runner6b3_matched"][0]
    ? gameDataJson["runner6b3_matched"][0]
    : "0";
  result.runner6l1_matched = gameDataJson["runner6l1_matched"][0]
    ? gameDataJson["runner6l1_matched"][0]
    : "0";
  result.runner6l2_matched = gameDataJson["runner6l2_matched"][0]
    ? gameDataJson["runner6l2_matched"][0]
    : "0";
  result.runner6l3_matched = gameDataJson["runner6l3_matched"][0]
    ? gameDataJson["runner6l3_matched"][0]
    : "0";
  result.runner7b1_matched = gameDataJson["runner7b1_matched"][0]
    ? gameDataJson["runner7b1_matched"][0]
    : "0";
  result.runner7b2_matched = gameDataJson["runner7b2_matched"][0]
    ? gameDataJson["runner7b2_matched"][0]
    : "0";
  result.runner7b3_matched = gameDataJson["runner7b3_matched"][0]
    ? gameDataJson["runner7b3_matched"][0]
    : "0";
  result.runner7l1_matched = gameDataJson["runner7l1_matched"][0]
    ? gameDataJson["runner7l1_matched"][0]
    : "0";
  result.runner7l2_matched = gameDataJson["runner7l2_matched"][0]
    ? gameDataJson["runner7l2_matched"][0]
    : "0";
  result.runner7l3_matched = gameDataJson["runner7l3_matched"][0]
    ? gameDataJson["runner7l3_matched"][0]
    : "0";
  result.runner8b1_matched = gameDataJson["runner8b1_matched"][0]
    ? gameDataJson["runner8b1_matched"][0]
    : "0";
  result.runner8b2_matched = gameDataJson["runner8b2_matched"][0]
    ? gameDataJson["runner8b2_matched"][0]
    : "0";
  result.runner8b3_matched = gameDataJson["runner8b3_matched"][0]
    ? gameDataJson["runner8b3_matched"][0]
    : "0";
  result.runner8l1_matched = gameDataJson["runner8l1_matched"][0]
    ? gameDataJson["runner8l1_matched"][0]
    : "0";
  result.runner8l2_matched = gameDataJson["runner8l2_matched"][0]
    ? gameDataJson["runner8l2_matched"][0]
    : "0";
  result.runner8l3_matched = gameDataJson["runner8l3_matched"][0]
    ? gameDataJson["runner8l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesTurboBlackjackData() {
  const gameDataJson = await getData("betfair_turbo_blackjack", 0);

  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  result.prediction = gameDataJson["prediction"][0];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];
  result.cat_rnr5 = gameDataJson["cat_rnr5"][0];
  result.cat_rnr6 = gameDataJson["cat_rnr6"][0];
  result.cat_rnr7 = gameDataJson["cat_rnr7"][0];
  result.cat_rnr8 = gameDataJson["cat_rnr8"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];
  result.cat_sid5 = gameDataJson["cat_sid5"];
  result.cat_sid6 = gameDataJson["cat_sid6"];
  result.cat_sid7 = gameDataJson["cat_sid7"];
  result.cat_sid8 = gameDataJson["cat_sid8"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];
  result.suspend5 = gameDataJson["suspend5"];
  result.suspend6 = gameDataJson["suspend6"];
  result.suspend7 = gameDataJson["suspend7"];
  result.suspend8 = gameDataJson["suspend8"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];
  result.rnr5_status = gameDataJson["rnr5_status"];
  result.rnr6_status = gameDataJson["rnr6_status"];
  result.rnr7_status = gameDataJson["rnr7_status"];
  result.rnr8_status = gameDataJson["rnr8_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";
  result.runner5b1 = gameDataJson["runner5b1"][0]
    ? gameDataJson["runner5b1"][0]
    : "0";
  result.runner5b2 = gameDataJson["runner5b2"][0]
    ? gameDataJson["runner5b2"][0]
    : "0";
  result.runner5b3 = gameDataJson["runner5b3"][0]
    ? gameDataJson["runner5b3"][0]
    : "0";
  result.runner5l1 = gameDataJson["runner5l1"][0]
    ? gameDataJson["runner5l1"][0]
    : "0";
  result.runner5l2 = gameDataJson["runner5l2"][0]
    ? gameDataJson["runner5l2"][0]
    : "0";
  result.runner5l3 = gameDataJson["runner5l3"][0]
    ? gameDataJson["runner5l3"][0]
    : "0";
  result.runner6b1 = gameDataJson["runner6b1"][0]
    ? gameDataJson["runner6b1"][0]
    : "0";
  result.runner6b2 = gameDataJson["runner6b2"][0]
    ? gameDataJson["runner6b2"][0]
    : "0";
  result.runner6b3 = gameDataJson["runner6b3"][0]
    ? gameDataJson["runner6b3"][0]
    : "0";
  result.runner6l1 = gameDataJson["runner6l1"][0]
    ? gameDataJson["runner6l1"][0]
    : "0";
  result.runner6l2 = gameDataJson["runner6l2"][0]
    ? gameDataJson["runner6l2"][0]
    : "0";
  result.runner6l3 = gameDataJson["runner6l3"][0]
    ? gameDataJson["runner6l3"][0]
    : "0";
  result.runner7b1 = gameDataJson["runner7b1"][0]
    ? gameDataJson["runner7b1"][0]
    : "0";
  result.runner7b2 = gameDataJson["runner7b2"][0]
    ? gameDataJson["runner7b2"][0]
    : "0";
  result.runner7b3 = gameDataJson["runner7b3"][0]
    ? gameDataJson["runner7b3"][0]
    : "0";
  result.runner7l1 = gameDataJson["runner7l1"][0]
    ? gameDataJson["runner7l1"][0]
    : "0";
  result.runner7l2 = gameDataJson["runner7l2"][0]
    ? gameDataJson["runner7l2"][0]
    : "0";
  result.runner7l3 = gameDataJson["runner7l3"][0]
    ? gameDataJson["runner7l3"][0]
    : "0";
  result.runner8b1 = gameDataJson["runner8b1"][0]
    ? gameDataJson["runner8b1"][0]
    : "0";
  result.runner8b2 = gameDataJson["runner8b2"][0]
    ? gameDataJson["runner8b2"][0]
    : "0";
  result.runner8b3 = gameDataJson["runner8b3"][0]
    ? gameDataJson["runner8b3"][0]
    : "0";
  result.runner8l1 = gameDataJson["runner8l1"][0]
    ? gameDataJson["runner8l1"][0]
    : "0";
  result.runner8l2 = gameDataJson["runner8l2"][0]
    ? gameDataJson["runner8l2"][0]
    : "0";
  result.runner8l3 = gameDataJson["runner8l3"][0]
    ? gameDataJson["runner8l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";
  result.runner5b1_matched = gameDataJson["runner5b1_matched"][0]
    ? gameDataJson["runner5b1_matched"][0]
    : "0";
  result.runner5b2_matched = gameDataJson["runner5b2_matched"][0]
    ? gameDataJson["runner5b2_matched"][0]
    : "0";
  result.runner5b3_matched = gameDataJson["runner5b3_matched"][0]
    ? gameDataJson["runner5b3_matched"][0]
    : "0";
  result.runner5l1_matched = gameDataJson["runner5l1_matched"][0]
    ? gameDataJson["runner5l1_matched"][0]
    : "0";
  result.runner5l2_matched = gameDataJson["runner5l2_matched"][0]
    ? gameDataJson["runner5l2_matched"][0]
    : "0";
  result.runner5l3_matched = gameDataJson["runner5l3_matched"][0]
    ? gameDataJson["runner5l3_matched"][0]
    : "0";
  result.runner6b1_matched = gameDataJson["runner6b1_matched"][0]
    ? gameDataJson["runner6b1_matched"][0]
    : "0";
  result.runner6b2_matched = gameDataJson["runner6b2_matched"][0]
    ? gameDataJson["runner6b2_matched"][0]
    : "0";
  result.runner6b3_matched = gameDataJson["runner6b3_matched"][0]
    ? gameDataJson["runner6b3_matched"][0]
    : "0";
  result.runner6l1_matched = gameDataJson["runner6l1_matched"][0]
    ? gameDataJson["runner6l1_matched"][0]
    : "0";
  result.runner6l2_matched = gameDataJson["runner6l2_matched"][0]
    ? gameDataJson["runner6l2_matched"][0]
    : "0";
  result.runner6l3_matched = gameDataJson["runner6l3_matched"][0]
    ? gameDataJson["runner6l3_matched"][0]
    : "0";
  result.runner7b1_matched = gameDataJson["runner7b1_matched"][0]
    ? gameDataJson["runner7b1_matched"][0]
    : "0";
  result.runner7b2_matched = gameDataJson["runner7b2_matched"][0]
    ? gameDataJson["runner7b2_matched"][0]
    : "0";
  result.runner7b3_matched = gameDataJson["runner7b3_matched"][0]
    ? gameDataJson["runner7b3_matched"][0]
    : "0";
  result.runner7l1_matched = gameDataJson["runner7l1_matched"][0]
    ? gameDataJson["runner7l1_matched"][0]
    : "0";
  result.runner7l2_matched = gameDataJson["runner7l2_matched"][0]
    ? gameDataJson["runner7l2_matched"][0]
    : "0";
  result.runner7l3_matched = gameDataJson["runner7l3_matched"][0]
    ? gameDataJson["runner7l3_matched"][0]
    : "0";
  result.runner8b1_matched = gameDataJson["runner8b1_matched"][0]
    ? gameDataJson["runner8b1_matched"][0]
    : "0";
  result.runner8b2_matched = gameDataJson["runner8b2_matched"][0]
    ? gameDataJson["runner8b2_matched"][0]
    : "0";
  result.runner8b3_matched = gameDataJson["runner8b3_matched"][0]
    ? gameDataJson["runner8b3_matched"][0]
    : "0";
  result.runner8l1_matched = gameDataJson["runner8l1_matched"][0]
    ? gameDataJson["runner8l1_matched"][0]
    : "0";
  result.runner8l2_matched = gameDataJson["runner8l2_matched"][0]
    ? gameDataJson["runner8l2_matched"][0]
    : "0";
  result.runner8l3_matched = gameDataJson["runner8l3_matched"][0]
    ? gameDataJson["runner8l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesBaccaratData() {
  const gameDataJson = await getData("betfair_baccarat", 0);
  //console.log("gameDataJson->", gameDataJson);
  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];
  result.cat_rnr5 = gameDataJson["cat_rnr5"][0];
  result.cat_rnr6 = gameDataJson["cat_rnr6"][0];
  result.cat_rnr7 = gameDataJson["cat_rnr7"][0];
  result.cat_rnr8 = gameDataJson["cat_rnr8"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];
  result.cat_sid5 = gameDataJson["cat_sid5"];
  result.cat_sid6 = gameDataJson["cat_sid6"];
  result.cat_sid7 = gameDataJson["cat_sid7"];
  result.cat_sid8 = gameDataJson["cat_sid8"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];
  result.suspend5 = gameDataJson["suspend5"];
  result.suspend6 = gameDataJson["suspend6"];
  result.suspend7 = gameDataJson["suspend7"];
  result.suspend8 = gameDataJson["suspend8"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];
  result.rnr5_status = gameDataJson["rnr5_status"];
  result.rnr6_status = gameDataJson["rnr6_status"];
  result.rnr7_status = gameDataJson["rnr7_status"];
  result.rnr8_status = gameDataJson["rnr8_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";
  result.runner5b1 = gameDataJson["runner5b1"][0]
    ? gameDataJson["runner5b1"][0]
    : "0";
  result.runner5b2 = gameDataJson["runner5b2"][0]
    ? gameDataJson["runner5b2"][0]
    : "0";
  result.runner5b3 = gameDataJson["runner5b3"][0]
    ? gameDataJson["runner5b3"][0]
    : "0";
  result.runner5l1 = gameDataJson["runner5l1"][0]
    ? gameDataJson["runner5l1"][0]
    : "0";
  result.runner5l2 = gameDataJson["runner5l2"][0]
    ? gameDataJson["runner5l2"][0]
    : "0";
  result.runner5l3 = gameDataJson["runner5l3"][0]
    ? gameDataJson["runner5l3"][0]
    : "0";
  result.runner6b1 = gameDataJson["runner6b1"][0]
    ? gameDataJson["runner6b1"][0]
    : "0";
  result.runner6b2 = gameDataJson["runner6b2"][0]
    ? gameDataJson["runner6b2"][0]
    : "0";
  result.runner6b3 = gameDataJson["runner6b3"][0]
    ? gameDataJson["runner6b3"][0]
    : "0";
  result.runner6l1 = gameDataJson["runner6l1"][0]
    ? gameDataJson["runner6l1"][0]
    : "0";
  result.runner6l2 = gameDataJson["runner6l2"][0]
    ? gameDataJson["runner6l2"][0]
    : "0";
  result.runner6l3 = gameDataJson["runner6l3"][0]
    ? gameDataJson["runner6l3"][0]
    : "0";
  result.runner7b1 = gameDataJson["runner7b1"][0]
    ? gameDataJson["runner7b1"][0]
    : "0";
  result.runner7b2 = gameDataJson["runner7b2"][0]
    ? gameDataJson["runner7b2"][0]
    : "0";
  result.runner7b3 = gameDataJson["runner7b3"][0]
    ? gameDataJson["runner7b3"][0]
    : "0";
  result.runner7l1 = gameDataJson["runner7l1"][0]
    ? gameDataJson["runner7l1"][0]
    : "0";
  result.runner7l2 = gameDataJson["runner7l2"][0]
    ? gameDataJson["runner7l2"][0]
    : "0";
  result.runner7l3 = gameDataJson["runner7l3"][0]
    ? gameDataJson["runner7l3"][0]
    : "0";
  result.runner8b1 = gameDataJson["runner8b1"][0]
    ? gameDataJson["runner8b1"][0]
    : "0";
  result.runner8b2 = gameDataJson["runner8b2"][0]
    ? gameDataJson["runner8b2"][0]
    : "0";
  result.runner8b3 = gameDataJson["runner8b3"][0]
    ? gameDataJson["runner8b3"][0]
    : "0";
  result.runner8l1 = gameDataJson["runner8l1"][0]
    ? gameDataJson["runner8l1"][0]
    : "0";
  result.runner8l2 = gameDataJson["runner8l2"][0]
    ? gameDataJson["runner8l2"][0]
    : "0";
  result.runner8l3 = gameDataJson["runner8l3"][0]
    ? gameDataJson["runner8l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";
  result.runner5b1_matched = gameDataJson["runner5b1_matched"][0]
    ? gameDataJson["runner5b1_matched"][0]
    : "0";
  result.runner5b2_matched = gameDataJson["runner5b2_matched"][0]
    ? gameDataJson["runner5b2_matched"][0]
    : "0";
  result.runner5b3_matched = gameDataJson["runner5b3_matched"][0]
    ? gameDataJson["runner5b3_matched"][0]
    : "0";
  result.runner5l1_matched = gameDataJson["runner5l1_matched"][0]
    ? gameDataJson["runner5l1_matched"][0]
    : "0";
  result.runner5l2_matched = gameDataJson["runner5l2_matched"][0]
    ? gameDataJson["runner5l2_matched"][0]
    : "0";
  result.runner5l3_matched = gameDataJson["runner5l3_matched"][0]
    ? gameDataJson["runner5l3_matched"][0]
    : "0";
  result.runner6b1_matched = gameDataJson["runner6b1_matched"][0]
    ? gameDataJson["runner6b1_matched"][0]
    : "0";
  result.runner6b2_matched = gameDataJson["runner6b2_matched"][0]
    ? gameDataJson["runner6b2_matched"][0]
    : "0";
  result.runner6b3_matched = gameDataJson["runner6b3_matched"][0]
    ? gameDataJson["runner6b3_matched"][0]
    : "0";
  result.runner6l1_matched = gameDataJson["runner6l1_matched"][0]
    ? gameDataJson["runner6l1_matched"][0]
    : "0";
  result.runner6l2_matched = gameDataJson["runner6l2_matched"][0]
    ? gameDataJson["runner6l2_matched"][0]
    : "0";
  result.runner6l3_matched = gameDataJson["runner6l3_matched"][0]
    ? gameDataJson["runner6l3_matched"][0]
    : "0";
  result.runner7b1_matched = gameDataJson["runner7b1_matched"][0]
    ? gameDataJson["runner7b1_matched"][0]
    : "0";
  result.runner7b2_matched = gameDataJson["runner7b2_matched"][0]
    ? gameDataJson["runner7b2_matched"][0]
    : "0";
  result.runner7b3_matched = gameDataJson["runner7b3_matched"][0]
    ? gameDataJson["runner7b3_matched"][0]
    : "0";
  result.runner7l1_matched = gameDataJson["runner7l1_matched"][0]
    ? gameDataJson["runner7l1_matched"][0]
    : "0";
  result.runner7l2_matched = gameDataJson["runner7l2_matched"][0]
    ? gameDataJson["runner7l2_matched"][0]
    : "0";
  result.runner7l3_matched = gameDataJson["runner7l3_matched"][0]
    ? gameDataJson["runner7l3_matched"][0]
    : "0";
  result.runner8b1_matched = gameDataJson["runner8b1_matched"][0]
    ? gameDataJson["runner8b1_matched"][0]
    : "0";
  result.runner8b2_matched = gameDataJson["runner8b2_matched"][0]
    ? gameDataJson["runner8b2_matched"][0]
    : "0";
  result.runner8b3_matched = gameDataJson["runner8b3_matched"][0]
    ? gameDataJson["runner8b3_matched"][0]
    : "0";
  result.runner8l1_matched = gameDataJson["runner8l1_matched"][0]
    ? gameDataJson["runner8l1_matched"][0]
    : "0";
  result.runner8l2_matched = gameDataJson["runner8l2_matched"][0]
    ? gameDataJson["runner8l2_matched"][0]
    : "0";
  result.runner8l3_matched = gameDataJson["runner8l3_matched"][0]
    ? gameDataJson["runner8l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesTurboBaccaratData() {
  const gameDataJson = await getData("betfair_turbo_baccarat", 0);

  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];
  result.cat_rnr5 = gameDataJson["cat_rnr5"][0];
  result.cat_rnr6 = gameDataJson["cat_rnr6"][0];
  result.cat_rnr7 = gameDataJson["cat_rnr7"][0];
  result.cat_rnr8 = gameDataJson["cat_rnr8"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];
  result.cat_sid5 = gameDataJson["cat_sid5"];
  result.cat_sid6 = gameDataJson["cat_sid6"];
  result.cat_sid7 = gameDataJson["cat_sid7"];
  result.cat_sid8 = gameDataJson["cat_sid8"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];
  result.suspend5 = gameDataJson["suspend5"];
  result.suspend6 = gameDataJson["suspend6"];
  result.suspend7 = gameDataJson["suspend7"];
  result.suspend8 = gameDataJson["suspend8"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];
  result.rnr5_status = gameDataJson["rnr5_status"];
  result.rnr6_status = gameDataJson["rnr6_status"];
  result.rnr7_status = gameDataJson["rnr7_status"];
  result.rnr8_status = gameDataJson["rnr8_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";
  result.runner5b1 = gameDataJson["runner5b1"][0]
    ? gameDataJson["runner5b1"][0]
    : "0";
  result.runner5b2 = gameDataJson["runner5b2"][0]
    ? gameDataJson["runner5b2"][0]
    : "0";
  result.runner5b3 = gameDataJson["runner5b3"][0]
    ? gameDataJson["runner5b3"][0]
    : "0";
  result.runner5l1 = gameDataJson["runner5l1"][0]
    ? gameDataJson["runner5l1"][0]
    : "0";
  result.runner5l2 = gameDataJson["runner5l2"][0]
    ? gameDataJson["runner5l2"][0]
    : "0";
  result.runner5l3 = gameDataJson["runner5l3"][0]
    ? gameDataJson["runner5l3"][0]
    : "0";
  result.runner6b1 = gameDataJson["runner6b1"][0]
    ? gameDataJson["runner6b1"][0]
    : "0";
  result.runner6b2 = gameDataJson["runner6b2"][0]
    ? gameDataJson["runner6b2"][0]
    : "0";
  result.runner6b3 = gameDataJson["runner6b3"][0]
    ? gameDataJson["runner6b3"][0]
    : "0";
  result.runner6l1 = gameDataJson["runner6l1"][0]
    ? gameDataJson["runner6l1"][0]
    : "0";
  result.runner6l2 = gameDataJson["runner6l2"][0]
    ? gameDataJson["runner6l2"][0]
    : "0";
  result.runner6l3 = gameDataJson["runner6l3"][0]
    ? gameDataJson["runner6l3"][0]
    : "0";
  result.runner7b1 = gameDataJson["runner7b1"][0]
    ? gameDataJson["runner7b1"][0]
    : "0";
  result.runner7b2 = gameDataJson["runner7b2"][0]
    ? gameDataJson["runner7b2"][0]
    : "0";
  result.runner7b3 = gameDataJson["runner7b3"][0]
    ? gameDataJson["runner7b3"][0]
    : "0";
  result.runner7l1 = gameDataJson["runner7l1"][0]
    ? gameDataJson["runner7l1"][0]
    : "0";
  result.runner7l2 = gameDataJson["runner7l2"][0]
    ? gameDataJson["runner7l2"][0]
    : "0";
  result.runner7l3 = gameDataJson["runner7l3"][0]
    ? gameDataJson["runner7l3"][0]
    : "0";
  result.runner8b1 = gameDataJson["runner8b1"][0]
    ? gameDataJson["runner8b1"][0]
    : "0";
  result.runner8b2 = gameDataJson["runner8b2"][0]
    ? gameDataJson["runner8b2"][0]
    : "0";
  result.runner8b3 = gameDataJson["runner8b3"][0]
    ? gameDataJson["runner8b3"][0]
    : "0";
  result.runner8l1 = gameDataJson["runner8l1"][0]
    ? gameDataJson["runner8l1"][0]
    : "0";
  result.runner8l2 = gameDataJson["runner8l2"][0]
    ? gameDataJson["runner8l2"][0]
    : "0";
  result.runner8l3 = gameDataJson["runner8l3"][0]
    ? gameDataJson["runner8l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";
  result.runner5b1_matched = gameDataJson["runner5b1_matched"][0]
    ? gameDataJson["runner5b1_matched"][0]
    : "0";
  result.runner5b2_matched = gameDataJson["runner5b2_matched"][0]
    ? gameDataJson["runner5b2_matched"][0]
    : "0";
  result.runner5b3_matched = gameDataJson["runner5b3_matched"][0]
    ? gameDataJson["runner5b3_matched"][0]
    : "0";
  result.runner5l1_matched = gameDataJson["runner5l1_matched"][0]
    ? gameDataJson["runner5l1_matched"][0]
    : "0";
  result.runner5l2_matched = gameDataJson["runner5l2_matched"][0]
    ? gameDataJson["runner5l2_matched"][0]
    : "0";
  result.runner5l3_matched = gameDataJson["runner5l3_matched"][0]
    ? gameDataJson["runner5l3_matched"][0]
    : "0";
  result.runner6b1_matched = gameDataJson["runner6b1_matched"][0]
    ? gameDataJson["runner6b1_matched"][0]
    : "0";
  result.runner6b2_matched = gameDataJson["runner6b2_matched"][0]
    ? gameDataJson["runner6b2_matched"][0]
    : "0";
  result.runner6b3_matched = gameDataJson["runner6b3_matched"][0]
    ? gameDataJson["runner6b3_matched"][0]
    : "0";
  result.runner6l1_matched = gameDataJson["runner6l1_matched"][0]
    ? gameDataJson["runner6l1_matched"][0]
    : "0";
  result.runner6l2_matched = gameDataJson["runner6l2_matched"][0]
    ? gameDataJson["runner6l2_matched"][0]
    : "0";
  result.runner6l3_matched = gameDataJson["runner6l3_matched"][0]
    ? gameDataJson["runner6l3_matched"][0]
    : "0";
  result.runner7b1_matched = gameDataJson["runner7b1_matched"][0]
    ? gameDataJson["runner7b1_matched"][0]
    : "0";
  result.runner7b2_matched = gameDataJson["runner7b2_matched"][0]
    ? gameDataJson["runner7b2_matched"][0]
    : "0";
  result.runner7b3_matched = gameDataJson["runner7b3_matched"][0]
    ? gameDataJson["runner7b3_matched"][0]
    : "0";
  result.runner7l1_matched = gameDataJson["runner7l1_matched"][0]
    ? gameDataJson["runner7l1_matched"][0]
    : "0";
  result.runner7l2_matched = gameDataJson["runner7l2_matched"][0]
    ? gameDataJson["runner7l2_matched"][0]
    : "0";
  result.runner7l3_matched = gameDataJson["runner7l3_matched"][0]
    ? gameDataJson["runner7l3_matched"][0]
    : "0";
  result.runner8b1_matched = gameDataJson["runner8b1_matched"][0]
    ? gameDataJson["runner8b1_matched"][0]
    : "0";
  result.runner8b2_matched = gameDataJson["runner8b2_matched"][0]
    ? gameDataJson["runner8b2_matched"][0]
    : "0";
  result.runner8b3_matched = gameDataJson["runner8b3_matched"][0]
    ? gameDataJson["runner8b3_matched"][0]
    : "0";
  result.runner8l1_matched = gameDataJson["runner8l1_matched"][0]
    ? gameDataJson["runner8l1_matched"][0]
    : "0";
  result.runner8l2_matched = gameDataJson["runner8l2_matched"][0]
    ? gameDataJson["runner8l2_matched"][0]
    : "0";
  result.runner8l3_matched = gameDataJson["runner8l3_matched"][0]
    ? gameDataJson["runner8l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesHiloData() {
  const gameDataJson = await getData("betfair_hilo", 0);

  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";
  result.prediction = gameDataJson["prediction"][0];

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];
  result.cat_rnr5 = gameDataJson["cat_rnr5"][0];
  result.cat_rnr6 = gameDataJson["cat_rnr6"][0];
  result.cat_rnr7 = gameDataJson["cat_rnr7"][0];
  result.cat_rnr8 = gameDataJson["cat_rnr8"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];
  result.cat_sid5 = gameDataJson["cat_sid5"];
  result.cat_sid6 = gameDataJson["cat_sid6"];
  result.cat_sid7 = gameDataJson["cat_sid7"];
  result.cat_sid8 = gameDataJson["cat_sid8"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];
  result.suspend5 = gameDataJson["suspend5"];
  result.suspend6 = gameDataJson["suspend6"];
  result.suspend7 = gameDataJson["suspend7"];
  result.suspend8 = gameDataJson["suspend8"];
  result.suspend9 = gameDataJson["suspend9"];
  result.suspend10 = gameDataJson["suspend10"];
  result.suspend11 = gameDataJson["suspend11"];
  result.suspend12 = gameDataJson["suspend12"];
  result.suspend13 = gameDataJson["suspend13"];
  result.suspend14 = gameDataJson["suspend14"];
  result.suspend15 = gameDataJson["suspend15"];
  result.suspend16 = gameDataJson["suspend16"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];
  result.rnr5_status = gameDataJson["rnr5_status"];
  result.rnr6_status = gameDataJson["rnr6_status"];
  result.rnr7_status = gameDataJson["rnr7_status"];
  result.rnr8_status = gameDataJson["rnr8_status"];
  result.rnr9_status = gameDataJson["rnr9_status"];
  result.rnr10_status = gameDataJson["rnr10_status"];
  result.rnr11_status = gameDataJson["rnr11_status"];
  result.rnr12_status = gameDataJson["rnr12_status"];
  result.rnr13_status = gameDataJson["rnr13_status"];
  result.rnr14_status = gameDataJson["rnr14_status"];
  result.rnr15_status = gameDataJson["rnr15_status"];
  result.rnr16_status = gameDataJson["rnr16_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";
  result.runner5b1 = gameDataJson["runner5b1"][0]
    ? gameDataJson["runner5b1"][0]
    : "0";
  result.runner5b2 = gameDataJson["runner5b2"][0]
    ? gameDataJson["runner5b2"][0]
    : "0";
  result.runner5b3 = gameDataJson["runner5b3"][0]
    ? gameDataJson["runner5b3"][0]
    : "0";
  result.runner5l1 = gameDataJson["runner5l1"][0]
    ? gameDataJson["runner5l1"][0]
    : "0";
  result.runner5l2 = gameDataJson["runner5l2"][0]
    ? gameDataJson["runner5l2"][0]
    : "0";
  result.runner5l3 = gameDataJson["runner5l3"][0]
    ? gameDataJson["runner5l3"][0]
    : "0";
  result.runner6b1 = gameDataJson["runner6b1"][0]
    ? gameDataJson["runner6b1"][0]
    : "0";
  result.runner6b2 = gameDataJson["runner6b2"][0]
    ? gameDataJson["runner6b2"][0]
    : "0";
  result.runner6b3 = gameDataJson["runner6b3"][0]
    ? gameDataJson["runner6b3"][0]
    : "0";
  result.runner6l1 = gameDataJson["runner6l1"][0]
    ? gameDataJson["runner6l1"][0]
    : "0";
  result.runner6l2 = gameDataJson["runner6l2"][0]
    ? gameDataJson["runner6l2"][0]
    : "0";
  result.runner6l3 = gameDataJson["runner6l3"][0]
    ? gameDataJson["runner6l3"][0]
    : "0";
  result.runner7b1 = gameDataJson["runner7b1"][0]
    ? gameDataJson["runner7b1"][0]
    : "0";
  result.runner7b2 = gameDataJson["runner7b2"][0]
    ? gameDataJson["runner7b2"][0]
    : "0";
  result.runner7b3 = gameDataJson["runner7b3"][0]
    ? gameDataJson["runner7b3"][0]
    : "0";
  result.runner7l1 = gameDataJson["runner7l1"][0]
    ? gameDataJson["runner7l1"][0]
    : "0";
  result.runner7l2 = gameDataJson["runner7l2"][0]
    ? gameDataJson["runner7l2"][0]
    : "0";
  result.runner7l3 = gameDataJson["runner7l3"][0]
    ? gameDataJson["runner7l3"][0]
    : "0";
  result.runner8b1 = gameDataJson["runner8b1"][0]
    ? gameDataJson["runner8b1"][0]
    : "0";
  result.runner8b2 = gameDataJson["runner8b2"][0]
    ? gameDataJson["runner8b2"][0]
    : "0";
  result.runner8b3 = gameDataJson["runner8b3"][0]
    ? gameDataJson["runner8b3"][0]
    : "0";
  result.runner8l1 = gameDataJson["runner8l1"][0]
    ? gameDataJson["runner8l1"][0]
    : "0";
  result.runner8l2 = gameDataJson["runner8l2"][0]
    ? gameDataJson["runner8l2"][0]
    : "0";
  result.runner8l3 = gameDataJson["runner8l3"][0]
    ? gameDataJson["runner8l3"][0]
    : "0";
  result.runner9b1 = gameDataJson["runner9b1"][0]
    ? gameDataJson["runner9b1"][0]
    : "0";
  result.runner9b2 = gameDataJson["runner9b2"][0]
    ? gameDataJson["runner9b2"][0]
    : "0";
  result.runner9b3 = gameDataJson["runner9b3"][0]
    ? gameDataJson["runner9b3"][0]
    : "0";
  result.runner9l1 = gameDataJson["runner9l1"][0]
    ? gameDataJson["runner9l1"][0]
    : "0";
  result.runner9l2 = gameDataJson["runner9l2"][0]
    ? gameDataJson["runner9l2"][0]
    : "0";
  result.runner9l3 = gameDataJson["runner9l3"][0]
    ? gameDataJson["runner9l3"][0]
    : "0";
  result.runner10b1 = gameDataJson["runner10b1"][0]
    ? gameDataJson["runner10b1"][0]
    : "0";
  result.runner10b2 = gameDataJson["runner10b2"][0]
    ? gameDataJson["runner10b2"][0]
    : "0";
  result.runner10b3 = gameDataJson["runner10b3"][0]
    ? gameDataJson["runner10b3"][0]
    : "0";
  result.runner10l1 = gameDataJson["runner10l1"][0]
    ? gameDataJson["runner10l1"][0]
    : "0";
  result.runner10l2 = gameDataJson["runner10l2"][0]
    ? gameDataJson["runner10l2"][0]
    : "0";
  result.runner10l3 = gameDataJson["runner10l3"][0]
    ? gameDataJson["runner10l3"][0]
    : "0";
  result.runner11b1 = gameDataJson["runner11b1"][0]
    ? gameDataJson["runner11b1"][0]
    : "0";
  result.runner11b2 = gameDataJson["runner11b2"][0]
    ? gameDataJson["runner11b2"][0]
    : "0";
  result.runner11b3 = gameDataJson["runner11b3"][0]
    ? gameDataJson["runner11b3"][0]
    : "0";
  result.runner11l1 = gameDataJson["runner11l1"][0]
    ? gameDataJson["runner11l1"][0]
    : "0";
  result.runner11l2 = gameDataJson["runner11l2"][0]
    ? gameDataJson["runner11l2"][0]
    : "0";
  result.runner11l3 = gameDataJson["runner11l3"][0]
    ? gameDataJson["runner11l3"][0]
    : "0";
  result.runner12b1 = gameDataJson["runner12b1"][0]
    ? gameDataJson["runner12b1"][0]
    : "0";
  result.runner12b2 = gameDataJson["runner12b2"][0]
    ? gameDataJson["runner12b2"][0]
    : "0";
  result.runner12b3 = gameDataJson["runner12b3"][0]
    ? gameDataJson["runner12b3"][0]
    : "0";
  result.runner12l1 = gameDataJson["runner12l1"][0]
    ? gameDataJson["runner12l1"][0]
    : "0";
  result.runner12l2 = gameDataJson["runner12l2"][0]
    ? gameDataJson["runner12l2"][0]
    : "0";
  result.runner12l3 = gameDataJson["runner12l3"][0]
    ? gameDataJson["runner12l3"][0]
    : "0";
  result.runner13b1 = gameDataJson["runner13b1"][0]
    ? gameDataJson["runner13b1"][0]
    : "0";
  result.runner13b2 = gameDataJson["runner13b2"][0]
    ? gameDataJson["runner13b2"][0]
    : "0";
  result.runner13b3 = gameDataJson["runner13b3"][0]
    ? gameDataJson["runner13b3"][0]
    : "0";
  result.runner13l1 = gameDataJson["runner13l1"][0]
    ? gameDataJson["runner13l1"][0]
    : "0";
  result.runner13l2 = gameDataJson["runner13l2"][0]
    ? gameDataJson["runner13l2"][0]
    : "0";
  result.runner13l3 = gameDataJson["runner13l3"][0]
    ? gameDataJson["runner13l3"][0]
    : "0";
  result.runner14b1 = gameDataJson["runner14b1"][0]
    ? gameDataJson["runner14b1"][0]
    : "0";
  result.runner14b2 = gameDataJson["runner14b2"][0]
    ? gameDataJson["runner14b2"][0]
    : "0";
  result.runner14b3 = gameDataJson["runner14b3"][0]
    ? gameDataJson["runner14b3"][0]
    : "0";
  result.runner14l1 = gameDataJson["runner14l1"][0]
    ? gameDataJson["runner14l1"][0]
    : "0";
  result.runner14l2 = gameDataJson["runner14l2"][0]
    ? gameDataJson["runner14l2"][0]
    : "0";
  result.runner14l3 = gameDataJson["runner14l3"][0]
    ? gameDataJson["runner14l3"][0]
    : "0";
  result.runner15b1 = gameDataJson["runner15b1"][0]
    ? gameDataJson["runner15b1"][0]
    : "0";
  result.runner15b2 = gameDataJson["runner15b2"][0]
    ? gameDataJson["runner15b2"][0]
    : "0";
  result.runner15b3 = gameDataJson["runner15b3"][0]
    ? gameDataJson["runner15b3"][0]
    : "0";
  result.runner15l1 = gameDataJson["runner15l1"][0]
    ? gameDataJson["runner15l1"][0]
    : "0";
  result.runner15l2 = gameDataJson["runner15l2"][0]
    ? gameDataJson["runner15l2"][0]
    : "0";
  result.runner15l3 = gameDataJson["runner15l3"][0]
    ? gameDataJson["runner15l3"][0]
    : "0";
  result.runner16b1 = gameDataJson["runner16b1"][0]
    ? gameDataJson["runner16b1"][0]
    : "0";
  result.runner16b2 = gameDataJson["runner16b2"][0]
    ? gameDataJson["runner16b2"][0]
    : "0";
  result.runner16b3 = gameDataJson["runner16b3"][0]
    ? gameDataJson["runner16b3"][0]
    : "0";
  result.runner16l1 = gameDataJson["runner16l1"][0]
    ? gameDataJson["runner16l1"][0]
    : "0";
  result.runner16l2 = gameDataJson["runner16l2"][0]
    ? gameDataJson["runner16l2"][0]
    : "0";
  result.runner16l3 = gameDataJson["runner16l3"][0]
    ? gameDataJson["runner16l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";
  result.runner5b1_matched = gameDataJson["runner5b1_matched"][0]
    ? gameDataJson["runner5b1_matched"][0]
    : "0";
  result.runner5b2_matched = gameDataJson["runner5b2_matched"][0]
    ? gameDataJson["runner5b2_matched"][0]
    : "0";
  result.runner5b3_matched = gameDataJson["runner5b3_matched"][0]
    ? gameDataJson["runner5b3_matched"][0]
    : "0";
  result.runner5l1_matched = gameDataJson["runner5l1_matched"][0]
    ? gameDataJson["runner5l1_matched"][0]
    : "0";
  result.runner5l2_matched = gameDataJson["runner5l2_matched"][0]
    ? gameDataJson["runner5l2_matched"][0]
    : "0";
  result.runner5l3_matched = gameDataJson["runner5l3_matched"][0]
    ? gameDataJson["runner5l3_matched"][0]
    : "0";
  result.runner6b1_matched = gameDataJson["runner6b1_matched"][0]
    ? gameDataJson["runner6b1_matched"][0]
    : "0";
  result.runner6b2_matched = gameDataJson["runner6b2_matched"][0]
    ? gameDataJson["runner6b2_matched"][0]
    : "0";
  result.runner6b3_matched = gameDataJson["runner6b3_matched"][0]
    ? gameDataJson["runner6b3_matched"][0]
    : "0";
  result.runner6l1_matched = gameDataJson["runner6l1_matched"][0]
    ? gameDataJson["runner6l1_matched"][0]
    : "0";
  result.runner6l2_matched = gameDataJson["runner6l2_matched"][0]
    ? gameDataJson["runner6l2_matched"][0]
    : "0";
  result.runner6l3_matched = gameDataJson["runner6l3_matched"][0]
    ? gameDataJson["runner6l3_matched"][0]
    : "0";
  result.runner7b1_matched = gameDataJson["runner7b1_matched"][0]
    ? gameDataJson["runner7b1_matched"][0]
    : "0";
  result.runner7b2_matched = gameDataJson["runner7b2_matched"][0]
    ? gameDataJson["runner7b2_matched"][0]
    : "0";
  result.runner7b3_matched = gameDataJson["runner7b3_matched"][0]
    ? gameDataJson["runner7b3_matched"][0]
    : "0";
  result.runner7l1_matched = gameDataJson["runner7l1_matched"][0]
    ? gameDataJson["runner7l1_matched"][0]
    : "0";
  result.runner7l2_matched = gameDataJson["runner7l2_matched"][0]
    ? gameDataJson["runner7l2_matched"][0]
    : "0";
  result.runner7l3_matched = gameDataJson["runner7l3_matched"][0]
    ? gameDataJson["runner7l3_matched"][0]
    : "0";
  result.runner8b1_matched = gameDataJson["runner8b1_matched"][0]
    ? gameDataJson["runner8b1_matched"][0]
    : "0";
  result.runner8b2_matched = gameDataJson["runner8b2_matched"][0]
    ? gameDataJson["runner8b2_matched"][0]
    : "0";
  result.runner8b3_matched = gameDataJson["runner8b3_matched"][0]
    ? gameDataJson["runner8b3_matched"][0]
    : "0";
  result.runner8l1_matched = gameDataJson["runner8l1_matched"][0]
    ? gameDataJson["runner8l1_matched"][0]
    : "0";
  result.runner8l2_matched = gameDataJson["runner8l2_matched"][0]
    ? gameDataJson["runner8l2_matched"][0]
    : "0";
  result.runner8l3_matched = gameDataJson["runner8l3_matched"][0]
    ? gameDataJson["runner8l3_matched"][0]
    : "0";
  result.runner9b1_matched = gameDataJson["runner9b1_matched"][0]
    ? gameDataJson["runner9b1_matched"][0]
    : "0";
  result.runner9b2_matched = gameDataJson["runner9b2_matched"][0]
    ? gameDataJson["runner9b2_matched"][0]
    : "0";
  result.runner9b3_matched = gameDataJson["runner9b3_matched"][0]
    ? gameDataJson["runner9b3_matched"][0]
    : "0";
  result.runner9l1_matched = gameDataJson["runner9l1_matched"][0]
    ? gameDataJson["runner9l1_matched"][0]
    : "0";
  result.runner9l2_matched = gameDataJson["runner9l2_matched"][0]
    ? gameDataJson["runner9l2_matched"][0]
    : "0";
  result.runner9l3_matched = gameDataJson["runner9l3_matched"][0]
    ? gameDataJson["runner9l3_matched"][0]
    : "0";
  result.runner10b1_matched = gameDataJson["runner10b1_matched"][0]
    ? gameDataJson["runner10b1_matched"][0]
    : "0";
  result.runner10b2_matched = gameDataJson["runner10b2_matched"][0]
    ? gameDataJson["runner10b2_matched"][0]
    : "0";
  result.runner10b3_matched = gameDataJson["runner10b3_matched"][0]
    ? gameDataJson["runner10b3_matched"][0]
    : "0";
  result.runner10l1_matched = gameDataJson["runner10l1_matched"][0]
    ? gameDataJson["runner10l1_matched"][0]
    : "0";
  result.runner10l2_matched = gameDataJson["runner10l2_matched"][0]
    ? gameDataJson["runner10l2_matched"][0]
    : "0";
  result.runner10l3_matched = gameDataJson["runner10l3_matched"][0]
    ? gameDataJson["runner10l3_matched"][0]
    : "0";
  result.runner11b1_matched = gameDataJson["runner11b1_matched"][0]
    ? gameDataJson["runner11b1_matched"][0]
    : "0";
  result.runner11b2_matched = gameDataJson["runner11b2_matched"][0]
    ? gameDataJson["runner11b2_matched"][0]
    : "0";
  result.runner11b3_matched = gameDataJson["runner11b3_matched"][0]
    ? gameDataJson["runner11b3_matched"][0]
    : "0";
  result.runner11l1_matched = gameDataJson["runner11l1_matched"][0]
    ? gameDataJson["runner11l1_matched"][0]
    : "0";
  result.runner11l2_matched = gameDataJson["runner11l2_matched"][0]
    ? gameDataJson["runner11l2_matched"][0]
    : "0";
  result.runner11l3_matched = gameDataJson["runner11l3_matched"][0]
    ? gameDataJson["runner11l3_matched"][0]
    : "0";
  result.runner12b1_matched = gameDataJson["runner12b1_matched"][0]
    ? gameDataJson["runner12b1_matched"][0]
    : "0";
  result.runner12b2_matched = gameDataJson["runner12b2_matched"][0]
    ? gameDataJson["runner12b2_matched"][0]
    : "0";
  result.runner12b3_matched = gameDataJson["runner12b3_matched"][0]
    ? gameDataJson["runner12b3_matched"][0]
    : "0";
  result.runner12l1_matched = gameDataJson["runner12l1_matched"][0]
    ? gameDataJson["runner12l1_matched"][0]
    : "0";
  result.runner12l2_matched = gameDataJson["runner12l2_matched"][0]
    ? gameDataJson["runner12l2_matched"][0]
    : "0";
  result.runner12l3_matched = gameDataJson["runner12l3_matched"][0]
    ? gameDataJson["runner12l3_matched"][0]
    : "0";
  result.runner13b1_matched = gameDataJson["runner13b1_matched"][0]
    ? gameDataJson["runner13b1_matched"][0]
    : "0";
  result.runner13b2_matched = gameDataJson["runner13b2_matched"][0]
    ? gameDataJson["runner13b2_matched"][0]
    : "0";
  result.runner13b3_matched = gameDataJson["runner13b3_matched"][0]
    ? gameDataJson["runner13b3_matched"][0]
    : "0";
  result.runner13l1_matched = gameDataJson["runner13l1_matched"][0]
    ? gameDataJson["runner13l1_matched"][0]
    : "0";
  result.runner13l2_matched = gameDataJson["runner13l2_matched"][0]
    ? gameDataJson["runner13l2_matched"][0]
    : "0";
  result.runner13l3_matched = gameDataJson["runner13l3_matched"][0]
    ? gameDataJson["runner13l3_matched"][0]
    : "0";
  result.runner14b1_matched = gameDataJson["runner14b1_matched"][0]
    ? gameDataJson["runner14b1_matched"][0]
    : "0";
  result.runner14b2_matched = gameDataJson["runner14b2_matched"][0]
    ? gameDataJson["runner14b2_matched"][0]
    : "0";
  result.runner14b3_matched = gameDataJson["runner14b3_matched"][0]
    ? gameDataJson["runner14b3_matched"][0]
    : "0";
  result.runner14l1_matched = gameDataJson["runner14l1_matched"][0]
    ? gameDataJson["runner14l1_matched"][0]
    : "0";
  result.runner14l2_matched = gameDataJson["runner14l2_matched"][0]
    ? gameDataJson["runner14l2_matched"][0]
    : "0";
  result.runner14l3_matched = gameDataJson["runner14l3_matched"][0]
    ? gameDataJson["runner14l3_matched"][0]
    : "0";
  result.runner15b1_matched = gameDataJson["runner15b1_matched"][0]
    ? gameDataJson["runner15b1_matched"][0]
    : "0";
  result.runner15b2_matched = gameDataJson["runner15b2_matched"][0]
    ? gameDataJson["runner15b2_matched"][0]
    : "0";
  result.runner15b3_matched = gameDataJson["runner15b3_matched"][0]
    ? gameDataJson["runner15b3_matched"][0]
    : "0";
  result.runner15l1_matched = gameDataJson["runner15l1_matched"][0]
    ? gameDataJson["runner15l1_matched"][0]
    : "0";
  result.runner15l2_matched = gameDataJson["runner15l2_matched"][0]
    ? gameDataJson["runner15l2_matched"][0]
    : "0";
  result.runner15l3_matched = gameDataJson["runner15l3_matched"][0]
    ? gameDataJson["runner15l3_matched"][0]
    : "0";
  result.runner16b1_matched = gameDataJson["runner16b1_matched"][0]
    ? gameDataJson["runner16b1_matched"][0]
    : "0";
  result.runner16b2_matched = gameDataJson["runner16b2_matched"][0]
    ? gameDataJson["runner16b2_matched"][0]
    : "0";
  result.runner16b3_matched = gameDataJson["runner16b3_matched"][0]
    ? gameDataJson["runner16b3_matched"][0]
    : "0";
  result.runner16l1_matched = gameDataJson["runner16l1_matched"][0]
    ? gameDataJson["runner16l1_matched"][0]
    : "0";
  result.runner16l2_matched = gameDataJson["runner16l2_matched"][0]
    ? gameDataJson["runner16l2_matched"][0]
    : "0";
  result.runner16l3_matched = gameDataJson["runner16l3_matched"][0]
    ? gameDataJson["runner16l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesTurboHiloData() {
  const gameDataJson = await getData("betfair_turbo_hilo", 0);

  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";
  result.prediction = gameDataJson["prediction"][0];

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];
  result.cat_rnr5 = gameDataJson["cat_rnr5"][0];
  result.cat_rnr6 = gameDataJson["cat_rnr6"][0];
  result.cat_rnr7 = gameDataJson["cat_rnr7"][0];
  result.cat_rnr8 = gameDataJson["cat_rnr8"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];
  result.cat_sid5 = gameDataJson["cat_sid5"];
  result.cat_sid6 = gameDataJson["cat_sid6"];
  result.cat_sid7 = gameDataJson["cat_sid7"];
  result.cat_sid8 = gameDataJson["cat_sid8"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];
  result.suspend5 = gameDataJson["suspend5"];
  result.suspend6 = gameDataJson["suspend6"];
  result.suspend7 = gameDataJson["suspend7"];
  result.suspend8 = gameDataJson["suspend8"];
  result.suspend9 = gameDataJson["suspend9"];
  result.suspend10 = gameDataJson["suspend10"];
  result.suspend11 = gameDataJson["suspend11"];
  result.suspend12 = gameDataJson["suspend12"];
  result.suspend13 = gameDataJson["suspend13"];
  result.suspend14 = gameDataJson["suspend14"];
  result.suspend15 = gameDataJson["suspend15"];
  result.suspend16 = gameDataJson["suspend16"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];
  result.rnr5_status = gameDataJson["rnr5_status"];
  result.rnr6_status = gameDataJson["rnr6_status"];
  result.rnr7_status = gameDataJson["rnr7_status"];
  result.rnr8_status = gameDataJson["rnr8_status"];
  result.rnr9_status = gameDataJson["rnr9_status"];
  result.rnr10_status = gameDataJson["rnr10_status"];
  result.rnr11_status = gameDataJson["rnr11_status"];
  result.rnr12_status = gameDataJson["rnr12_status"];
  result.rnr13_status = gameDataJson["rnr13_status"];
  result.rnr14_status = gameDataJson["rnr14_status"];
  result.rnr15_status = gameDataJson["rnr15_status"];
  result.rnr16_status = gameDataJson["rnr16_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";
  result.runner5b1 = gameDataJson["runner5b1"][0]
    ? gameDataJson["runner5b1"][0]
    : "0";
  result.runner5b2 = gameDataJson["runner5b2"][0]
    ? gameDataJson["runner5b2"][0]
    : "0";
  result.runner5b3 = gameDataJson["runner5b3"][0]
    ? gameDataJson["runner5b3"][0]
    : "0";
  result.runner5l1 = gameDataJson["runner5l1"][0]
    ? gameDataJson["runner5l1"][0]
    : "0";
  result.runner5l2 = gameDataJson["runner5l2"][0]
    ? gameDataJson["runner5l2"][0]
    : "0";
  result.runner5l3 = gameDataJson["runner5l3"][0]
    ? gameDataJson["runner5l3"][0]
    : "0";
  result.runner6b1 = gameDataJson["runner6b1"][0]
    ? gameDataJson["runner6b1"][0]
    : "0";
  result.runner6b2 = gameDataJson["runner6b2"][0]
    ? gameDataJson["runner6b2"][0]
    : "0";
  result.runner6b3 = gameDataJson["runner6b3"][0]
    ? gameDataJson["runner6b3"][0]
    : "0";
  result.runner6l1 = gameDataJson["runner6l1"][0]
    ? gameDataJson["runner6l1"][0]
    : "0";
  result.runner6l2 = gameDataJson["runner6l2"][0]
    ? gameDataJson["runner6l2"][0]
    : "0";
  result.runner6l3 = gameDataJson["runner6l3"][0]
    ? gameDataJson["runner6l3"][0]
    : "0";
  result.runner7b1 = gameDataJson["runner7b1"][0]
    ? gameDataJson["runner7b1"][0]
    : "0";
  result.runner7b2 = gameDataJson["runner7b2"][0]
    ? gameDataJson["runner7b2"][0]
    : "0";
  result.runner7b3 = gameDataJson["runner7b3"][0]
    ? gameDataJson["runner7b3"][0]
    : "0";
  result.runner7l1 = gameDataJson["runner7l1"][0]
    ? gameDataJson["runner7l1"][0]
    : "0";
  result.runner7l2 = gameDataJson["runner7l2"][0]
    ? gameDataJson["runner7l2"][0]
    : "0";
  result.runner7l3 = gameDataJson["runner7l3"][0]
    ? gameDataJson["runner7l3"][0]
    : "0";
  result.runner8b1 = gameDataJson["runner8b1"][0]
    ? gameDataJson["runner8b1"][0]
    : "0";
  result.runner8b2 = gameDataJson["runner8b2"][0]
    ? gameDataJson["runner8b2"][0]
    : "0";
  result.runner8b3 = gameDataJson["runner8b3"][0]
    ? gameDataJson["runner8b3"][0]
    : "0";
  result.runner8l1 = gameDataJson["runner8l1"][0]
    ? gameDataJson["runner8l1"][0]
    : "0";
  result.runner8l2 = gameDataJson["runner8l2"][0]
    ? gameDataJson["runner8l2"][0]
    : "0";
  result.runner8l3 = gameDataJson["runner8l3"][0]
    ? gameDataJson["runner8l3"][0]
    : "0";
  result.runner9b1 = gameDataJson["runner9b1"][0]
    ? gameDataJson["runner9b1"][0]
    : "0";
  result.runner9b2 = gameDataJson["runner9b2"][0]
    ? gameDataJson["runner9b2"][0]
    : "0";
  result.runner9b3 = gameDataJson["runner9b3"][0]
    ? gameDataJson["runner9b3"][0]
    : "0";
  result.runner9l1 = gameDataJson["runner9l1"][0]
    ? gameDataJson["runner9l1"][0]
    : "0";
  result.runner9l2 = gameDataJson["runner9l2"][0]
    ? gameDataJson["runner9l2"][0]
    : "0";
  result.runner9l3 = gameDataJson["runner9l3"][0]
    ? gameDataJson["runner9l3"][0]
    : "0";
  result.runner10b1 = gameDataJson["runner10b1"][0]
    ? gameDataJson["runner10b1"][0]
    : "0";
  result.runner10b2 = gameDataJson["runner10b2"][0]
    ? gameDataJson["runner10b2"][0]
    : "0";
  result.runner10b3 = gameDataJson["runner10b3"][0]
    ? gameDataJson["runner10b3"][0]
    : "0";
  result.runner10l1 = gameDataJson["runner10l1"][0]
    ? gameDataJson["runner10l1"][0]
    : "0";
  result.runner10l2 = gameDataJson["runner10l2"][0]
    ? gameDataJson["runner10l2"][0]
    : "0";
  result.runner10l3 = gameDataJson["runner10l3"][0]
    ? gameDataJson["runner10l3"][0]
    : "0";
  result.runner11b1 = gameDataJson["runner11b1"][0]
    ? gameDataJson["runner11b1"][0]
    : "0";
  result.runner11b2 = gameDataJson["runner11b2"][0]
    ? gameDataJson["runner11b2"][0]
    : "0";
  result.runner11b3 = gameDataJson["runner11b3"][0]
    ? gameDataJson["runner11b3"][0]
    : "0";
  result.runner11l1 = gameDataJson["runner11l1"][0]
    ? gameDataJson["runner11l1"][0]
    : "0";
  result.runner11l2 = gameDataJson["runner11l2"][0]
    ? gameDataJson["runner11l2"][0]
    : "0";
  result.runner11l3 = gameDataJson["runner11l3"][0]
    ? gameDataJson["runner11l3"][0]
    : "0";
  result.runner12b1 = gameDataJson["runner12b1"][0]
    ? gameDataJson["runner12b1"][0]
    : "0";
  result.runner12b2 = gameDataJson["runner12b2"][0]
    ? gameDataJson["runner12b2"][0]
    : "0";
  result.runner12b3 = gameDataJson["runner12b3"][0]
    ? gameDataJson["runner12b3"][0]
    : "0";
  result.runner12l1 = gameDataJson["runner12l1"][0]
    ? gameDataJson["runner12l1"][0]
    : "0";
  result.runner12l2 = gameDataJson["runner12l2"][0]
    ? gameDataJson["runner12l2"][0]
    : "0";
  result.runner12l3 = gameDataJson["runner12l3"][0]
    ? gameDataJson["runner12l3"][0]
    : "0";
  result.runner13b1 = gameDataJson["runner13b1"][0]
    ? gameDataJson["runner13b1"][0]
    : "0";
  result.runner13b2 = gameDataJson["runner13b2"][0]
    ? gameDataJson["runner13b2"][0]
    : "0";
  result.runner13b3 = gameDataJson["runner13b3"][0]
    ? gameDataJson["runner13b3"][0]
    : "0";
  result.runner13l1 = gameDataJson["runner13l1"][0]
    ? gameDataJson["runner13l1"][0]
    : "0";
  result.runner13l2 = gameDataJson["runner13l2"][0]
    ? gameDataJson["runner13l2"][0]
    : "0";
  result.runner13l3 = gameDataJson["runner13l3"][0]
    ? gameDataJson["runner13l3"][0]
    : "0";
  result.runner14b1 = gameDataJson["runner14b1"][0]
    ? gameDataJson["runner14b1"][0]
    : "0";
  result.runner14b2 = gameDataJson["runner14b2"][0]
    ? gameDataJson["runner14b2"][0]
    : "0";
  result.runner14b3 = gameDataJson["runner14b3"][0]
    ? gameDataJson["runner14b3"][0]
    : "0";
  result.runner14l1 = gameDataJson["runner14l1"][0]
    ? gameDataJson["runner14l1"][0]
    : "0";
  result.runner14l2 = gameDataJson["runner14l2"][0]
    ? gameDataJson["runner14l2"][0]
    : "0";
  result.runner14l3 = gameDataJson["runner14l3"][0]
    ? gameDataJson["runner14l3"][0]
    : "0";
  result.runner15b1 = gameDataJson["runner15b1"][0]
    ? gameDataJson["runner15b1"][0]
    : "0";
  result.runner15b2 = gameDataJson["runner15b2"][0]
    ? gameDataJson["runner15b2"][0]
    : "0";
  result.runner15b3 = gameDataJson["runner15b3"][0]
    ? gameDataJson["runner15b3"][0]
    : "0";
  result.runner15l1 = gameDataJson["runner15l1"][0]
    ? gameDataJson["runner15l1"][0]
    : "0";
  result.runner15l2 = gameDataJson["runner15l2"][0]
    ? gameDataJson["runner15l2"][0]
    : "0";
  result.runner15l3 = gameDataJson["runner15l3"][0]
    ? gameDataJson["runner15l3"][0]
    : "0";
  result.runner16b1 = gameDataJson["runner16b1"][0]
    ? gameDataJson["runner16b1"][0]
    : "0";
  result.runner16b2 = gameDataJson["runner16b2"][0]
    ? gameDataJson["runner16b2"][0]
    : "0";
  result.runner16b3 = gameDataJson["runner16b3"][0]
    ? gameDataJson["runner16b3"][0]
    : "0";
  result.runner16l1 = gameDataJson["runner16l1"][0]
    ? gameDataJson["runner16l1"][0]
    : "0";
  result.runner16l2 = gameDataJson["runner16l2"][0]
    ? gameDataJson["runner16l2"][0]
    : "0";
  result.runner16l3 = gameDataJson["runner16l3"][0]
    ? gameDataJson["runner16l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";
  result.runner5b1_matched = gameDataJson["runner5b1_matched"][0]
    ? gameDataJson["runner5b1_matched"][0]
    : "0";
  result.runner5b2_matched = gameDataJson["runner5b2_matched"][0]
    ? gameDataJson["runner5b2_matched"][0]
    : "0";
  result.runner5b3_matched = gameDataJson["runner5b3_matched"][0]
    ? gameDataJson["runner5b3_matched"][0]
    : "0";
  result.runner5l1_matched = gameDataJson["runner5l1_matched"][0]
    ? gameDataJson["runner5l1_matched"][0]
    : "0";
  result.runner5l2_matched = gameDataJson["runner5l2_matched"][0]
    ? gameDataJson["runner5l2_matched"][0]
    : "0";
  result.runner5l3_matched = gameDataJson["runner5l3_matched"][0]
    ? gameDataJson["runner5l3_matched"][0]
    : "0";
  result.runner6b1_matched = gameDataJson["runner6b1_matched"][0]
    ? gameDataJson["runner6b1_matched"][0]
    : "0";
  result.runner6b2_matched = gameDataJson["runner6b2_matched"][0]
    ? gameDataJson["runner6b2_matched"][0]
    : "0";
  result.runner6b3_matched = gameDataJson["runner6b3_matched"][0]
    ? gameDataJson["runner6b3_matched"][0]
    : "0";
  result.runner6l1_matched = gameDataJson["runner6l1_matched"][0]
    ? gameDataJson["runner6l1_matched"][0]
    : "0";
  result.runner6l2_matched = gameDataJson["runner6l2_matched"][0]
    ? gameDataJson["runner6l2_matched"][0]
    : "0";
  result.runner6l3_matched = gameDataJson["runner6l3_matched"][0]
    ? gameDataJson["runner6l3_matched"][0]
    : "0";
  result.runner7b1_matched = gameDataJson["runner7b1_matched"][0]
    ? gameDataJson["runner7b1_matched"][0]
    : "0";
  result.runner7b2_matched = gameDataJson["runner7b2_matched"][0]
    ? gameDataJson["runner7b2_matched"][0]
    : "0";
  result.runner7b3_matched = gameDataJson["runner7b3_matched"][0]
    ? gameDataJson["runner7b3_matched"][0]
    : "0";
  result.runner7l1_matched = gameDataJson["runner7l1_matched"][0]
    ? gameDataJson["runner7l1_matched"][0]
    : "0";
  result.runner7l2_matched = gameDataJson["runner7l2_matched"][0]
    ? gameDataJson["runner7l2_matched"][0]
    : "0";
  result.runner7l3_matched = gameDataJson["runner7l3_matched"][0]
    ? gameDataJson["runner7l3_matched"][0]
    : "0";
  result.runner8b1_matched = gameDataJson["runner8b1_matched"][0]
    ? gameDataJson["runner8b1_matched"][0]
    : "0";
  result.runner8b2_matched = gameDataJson["runner8b2_matched"][0]
    ? gameDataJson["runner8b2_matched"][0]
    : "0";
  result.runner8b3_matched = gameDataJson["runner8b3_matched"][0]
    ? gameDataJson["runner8b3_matched"][0]
    : "0";
  result.runner8l1_matched = gameDataJson["runner8l1_matched"][0]
    ? gameDataJson["runner8l1_matched"][0]
    : "0";
  result.runner8l2_matched = gameDataJson["runner8l2_matched"][0]
    ? gameDataJson["runner8l2_matched"][0]
    : "0";
  result.runner8l3_matched = gameDataJson["runner8l3_matched"][0]
    ? gameDataJson["runner8l3_matched"][0]
    : "0";
  result.runner9b1_matched = gameDataJson["runner9b1_matched"][0]
    ? gameDataJson["runner9b1_matched"][0]
    : "0";
  result.runner9b2_matched = gameDataJson["runner9b2_matched"][0]
    ? gameDataJson["runner9b2_matched"][0]
    : "0";
  result.runner9b3_matched = gameDataJson["runner9b3_matched"][0]
    ? gameDataJson["runner9b3_matched"][0]
    : "0";
  result.runner9l1_matched = gameDataJson["runner9l1_matched"][0]
    ? gameDataJson["runner9l1_matched"][0]
    : "0";
  result.runner9l2_matched = gameDataJson["runner9l2_matched"][0]
    ? gameDataJson["runner9l2_matched"][0]
    : "0";
  result.runner9l3_matched = gameDataJson["runner9l3_matched"][0]
    ? gameDataJson["runner9l3_matched"][0]
    : "0";
  result.runner10b1_matched = gameDataJson["runner10b1_matched"][0]
    ? gameDataJson["runner10b1_matched"][0]
    : "0";
  result.runner10b2_matched = gameDataJson["runner10b2_matched"][0]
    ? gameDataJson["runner10b2_matched"][0]
    : "0";
  result.runner10b3_matched = gameDataJson["runner10b3_matched"][0]
    ? gameDataJson["runner10b3_matched"][0]
    : "0";
  result.runner10l1_matched = gameDataJson["runner10l1_matched"][0]
    ? gameDataJson["runner10l1_matched"][0]
    : "0";
  result.runner10l2_matched = gameDataJson["runner10l2_matched"][0]
    ? gameDataJson["runner10l2_matched"][0]
    : "0";
  result.runner10l3_matched = gameDataJson["runner10l3_matched"][0]
    ? gameDataJson["runner10l3_matched"][0]
    : "0";
  result.runner11b1_matched = gameDataJson["runner11b1_matched"][0]
    ? gameDataJson["runner11b1_matched"][0]
    : "0";
  result.runner11b2_matched = gameDataJson["runner11b2_matched"][0]
    ? gameDataJson["runner11b2_matched"][0]
    : "0";
  result.runner11b3_matched = gameDataJson["runner11b3_matched"][0]
    ? gameDataJson["runner11b3_matched"][0]
    : "0";
  result.runner11l1_matched = gameDataJson["runner11l1_matched"][0]
    ? gameDataJson["runner11l1_matched"][0]
    : "0";
  result.runner11l2_matched = gameDataJson["runner11l2_matched"][0]
    ? gameDataJson["runner11l2_matched"][0]
    : "0";
  result.runner11l3_matched = gameDataJson["runner11l3_matched"][0]
    ? gameDataJson["runner11l3_matched"][0]
    : "0";
  result.runner12b1_matched = gameDataJson["runner12b1_matched"][0]
    ? gameDataJson["runner12b1_matched"][0]
    : "0";
  result.runner12b2_matched = gameDataJson["runner12b2_matched"][0]
    ? gameDataJson["runner12b2_matched"][0]
    : "0";
  result.runner12b3_matched = gameDataJson["runner12b3_matched"][0]
    ? gameDataJson["runner12b3_matched"][0]
    : "0";
  result.runner12l1_matched = gameDataJson["runner12l1_matched"][0]
    ? gameDataJson["runner12l1_matched"][0]
    : "0";
  result.runner12l2_matched = gameDataJson["runner12l2_matched"][0]
    ? gameDataJson["runner12l2_matched"][0]
    : "0";
  result.runner12l3_matched = gameDataJson["runner12l3_matched"][0]
    ? gameDataJson["runner12l3_matched"][0]
    : "0";
  result.runner13b1_matched = gameDataJson["runner13b1_matched"][0]
    ? gameDataJson["runner13b1_matched"][0]
    : "0";
  result.runner13b2_matched = gameDataJson["runner13b2_matched"][0]
    ? gameDataJson["runner13b2_matched"][0]
    : "0";
  result.runner13b3_matched = gameDataJson["runner13b3_matched"][0]
    ? gameDataJson["runner13b3_matched"][0]
    : "0";
  result.runner13l1_matched = gameDataJson["runner13l1_matched"][0]
    ? gameDataJson["runner13l1_matched"][0]
    : "0";
  result.runner13l2_matched = gameDataJson["runner13l2_matched"][0]
    ? gameDataJson["runner13l2_matched"][0]
    : "0";
  result.runner13l3_matched = gameDataJson["runner13l3_matched"][0]
    ? gameDataJson["runner13l3_matched"][0]
    : "0";
  result.runner14b1_matched = gameDataJson["runner14b1_matched"][0]
    ? gameDataJson["runner14b1_matched"][0]
    : "0";
  result.runner14b2_matched = gameDataJson["runner14b2_matched"][0]
    ? gameDataJson["runner14b2_matched"][0]
    : "0";
  result.runner14b3_matched = gameDataJson["runner14b3_matched"][0]
    ? gameDataJson["runner14b3_matched"][0]
    : "0";
  result.runner14l1_matched = gameDataJson["runner14l1_matched"][0]
    ? gameDataJson["runner14l1_matched"][0]
    : "0";
  result.runner14l2_matched = gameDataJson["runner14l2_matched"][0]
    ? gameDataJson["runner14l2_matched"][0]
    : "0";
  result.runner14l3_matched = gameDataJson["runner14l3_matched"][0]
    ? gameDataJson["runner14l3_matched"][0]
    : "0";
  result.runner15b1_matched = gameDataJson["runner15b1_matched"][0]
    ? gameDataJson["runner15b1_matched"][0]
    : "0";
  result.runner15b2_matched = gameDataJson["runner15b2_matched"][0]
    ? gameDataJson["runner15b2_matched"][0]
    : "0";
  result.runner15b3_matched = gameDataJson["runner15b3_matched"][0]
    ? gameDataJson["runner15b3_matched"][0]
    : "0";
  result.runner15l1_matched = gameDataJson["runner15l1_matched"][0]
    ? gameDataJson["runner15l1_matched"][0]
    : "0";
  result.runner15l2_matched = gameDataJson["runner15l2_matched"][0]
    ? gameDataJson["runner15l2_matched"][0]
    : "0";
  result.runner15l3_matched = gameDataJson["runner15l3_matched"][0]
    ? gameDataJson["runner15l3_matched"][0]
    : "0";
  result.runner16b1_matched = gameDataJson["runner16b1_matched"][0]
    ? gameDataJson["runner16b1_matched"][0]
    : "0";
  result.runner16b2_matched = gameDataJson["runner16b2_matched"][0]
    ? gameDataJson["runner16b2_matched"][0]
    : "0";
  result.runner16b3_matched = gameDataJson["runner16b3_matched"][0]
    ? gameDataJson["runner16b3_matched"][0]
    : "0";
  result.runner16l1_matched = gameDataJson["runner16l1_matched"][0]
    ? gameDataJson["runner16l1_matched"][0]
    : "0";
  result.runner16l2_matched = gameDataJson["runner16l2_matched"][0]
    ? gameDataJson["runner16l2_matched"][0]
    : "0";
  result.runner16l3_matched = gameDataJson["runner16l3_matched"][0]
    ? gameDataJson["runner16l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesOmahaData() {
  const gameDataJson = await getData("betfair_omaha", 0);

  let result = {};
  result.roundId = gameDataJson["cat_mid"];
  result.round = gameDataJson["round"][0];
  result.timeLeft = gameDataJson["left_time"];
  result.time = gameDataJson["time"][0];
  result.time_percentage = gameDataJson["time_percentage"][0];
  result.evt_status = gameDataJson["evt_status"];
  //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
  result.market_ststus = gameDataJson?.[0]?.market_status ?? "";

  result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
  result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
  result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
  result.cat_rnr4 = gameDataJson["cat_rnr4"][0];
  result.cat_rnr5 = gameDataJson["cat_rnr5"][0];
  result.cat_rnr6 = gameDataJson["cat_rnr6"][0];
  result.cat_rnr7 = gameDataJson["cat_rnr7"][0];
  result.cat_rnr8 = gameDataJson["cat_rnr8"][0];
  result.cat_rnr9 = gameDataJson["cat_rnr9"][0];

  result.cat_sid1 = gameDataJson["cat_sid1"];
  result.cat_sid2 = gameDataJson["cat_sid2"];
  result.cat_sid3 = gameDataJson["cat_sid3"];
  result.cat_sid4 = gameDataJson["cat_sid4"];
  result.cat_sid5 = gameDataJson["cat_sid5"];
  result.cat_sid6 = gameDataJson["cat_sid6"];
  result.cat_sid7 = gameDataJson["cat_sid7"];
  result.cat_sid8 = gameDataJson["cat_sid8"];

  result.suspend1 = gameDataJson["suspend1"];
  result.suspend2 = gameDataJson["suspend2"];
  result.suspend3 = gameDataJson["suspend3"];
  result.suspend4 = gameDataJson["suspend4"];
  result.suspend5 = gameDataJson["suspend5"];
  result.suspend6 = gameDataJson["suspend6"];
  result.suspend7 = gameDataJson["suspend7"];
  result.suspend8 = gameDataJson["suspend8"];
  result.suspend9 = gameDataJson["suspend9"];

  result.cards_desc = gameDataJson["cards_desc"];
  result.rnr1_desc = gameDataJson["rnr1_desc"];
  result.rnr2_desc = gameDataJson["rnr2_desc"];
  result.rnr3_desc = gameDataJson["rnr3_desc"];
  result.rnr4_desc = gameDataJson["rnr4_desc"];

  result.rnr1_status = gameDataJson["rnr1_status"];
  result.rnr2_status = gameDataJson["rnr2_status"];
  result.rnr3_status = gameDataJson["rnr3_status"];
  result.rnr4_status = gameDataJson["rnr4_status"];
  result.rnr5_status = gameDataJson["rnr5_status"];
  result.rnr6_status = gameDataJson["rnr6_status"];
  result.rnr7_status = gameDataJson["rnr7_status"];
  result.rnr8_status = gameDataJson["rnr8_status"];
  result.rnr9_status = gameDataJson["rnr9_status"];

  result.runner1b1 = gameDataJson["runner1b1"][0]
    ? gameDataJson["runner1b1"][0]
    : "0";
  result.runner1b2 = gameDataJson["runner1b2"][0]
    ? gameDataJson["runner1b2"][0]
    : "0";
  result.runner1b3 = gameDataJson["runner1b3"][0]
    ? gameDataJson["runner1b3"][0]
    : "0";
  result.runner1l1 = gameDataJson["runner1l1"][0]
    ? gameDataJson["runner1l1"][0]
    : "0";
  result.runner1l2 = gameDataJson["runner1l2"][0]
    ? gameDataJson["runner1l2"][0]
    : "0";
  result.runner1l3 = gameDataJson["runner1l3"][0]
    ? gameDataJson["runner1l3"][0]
    : "0";
  result.runner2b1 = gameDataJson["runner2b1"][0]
    ? gameDataJson["runner2b1"][0]
    : "0";
  result.runner2b2 = gameDataJson["runner2b2"][0]
    ? gameDataJson["runner2b2"][0]
    : "0";
  result.runner2b3 = gameDataJson["runner2b3"][0]
    ? gameDataJson["runner2b3"][0]
    : "0";
  result.runner2l1 = gameDataJson["runner2l1"][0]
    ? gameDataJson["runner2l1"][0]
    : "0";
  result.runner2l2 = gameDataJson["runner2l2"][0]
    ? gameDataJson["runner2l2"][0]
    : "0";
  result.runner2l3 = gameDataJson["runner2l3"][0]
    ? gameDataJson["runner2l3"][0]
    : "0";
  result.runner3b1 = gameDataJson["runner3b1"][0]
    ? gameDataJson["runner3b1"][0]
    : "0";
  result.runner3b2 = gameDataJson["runner3b2"][0]
    ? gameDataJson["runner3b2"][0]
    : "0";
  result.runner3b3 = gameDataJson["runner3b3"][0]
    ? gameDataJson["runner3b3"][0]
    : "0";
  result.runner3l1 = gameDataJson["runner3l1"][0]
    ? gameDataJson["runner3l1"][0]
    : "0";
  result.runner3l2 = gameDataJson["runner3l2"][0]
    ? gameDataJson["runner3l2"][0]
    : "0";
  result.runner3l3 = gameDataJson["runner3l3"][0]
    ? gameDataJson["runner3l3"][0]
    : "0";
  result.runner4b1 = gameDataJson["runner4b1"][0]
    ? gameDataJson["runner4b1"][0]
    : "0";
  result.runner4b2 = gameDataJson["runner4b2"][0]
    ? gameDataJson["runner4b2"][0]
    : "0";
  result.runner4b3 = gameDataJson["runner4b3"][0]
    ? gameDataJson["runner4b3"][0]
    : "0";
  result.runner4l1 = gameDataJson["runner4l1"][0]
    ? gameDataJson["runner4l1"][0]
    : "0";
  result.runner4l2 = gameDataJson["runner4l2"][0]
    ? gameDataJson["runner4l2"][0]
    : "0";
  result.runner4l3 = gameDataJson["runner4l3"][0]
    ? gameDataJson["runner4l3"][0]
    : "0";
  result.runner5b1 = gameDataJson["runner5b1"][0]
    ? gameDataJson["runner5b1"][0]
    : "0";
  result.runner5b2 = gameDataJson["runner5b2"][0]
    ? gameDataJson["runner5b2"][0]
    : "0";
  result.runner5b3 = gameDataJson["runner5b3"][0]
    ? gameDataJson["runner5b3"][0]
    : "0";
  result.runner5l1 = gameDataJson["runner5l1"][0]
    ? gameDataJson["runner5l1"][0]
    : "0";
  result.runner5l2 = gameDataJson["runner5l2"][0]
    ? gameDataJson["runner5l2"][0]
    : "0";
  result.runner5l3 = gameDataJson["runner5l3"][0]
    ? gameDataJson["runner5l3"][0]
    : "0";
  result.runner6b1 = gameDataJson["runner6b1"][0]
    ? gameDataJson["runner6b1"][0]
    : "0";
  result.runner6b2 = gameDataJson["runner6b2"][0]
    ? gameDataJson["runner6b2"][0]
    : "0";
  result.runner6b3 = gameDataJson["runner6b3"][0]
    ? gameDataJson["runner6b3"][0]
    : "0";
  result.runner6l1 = gameDataJson["runner6l1"][0]
    ? gameDataJson["runner6l1"][0]
    : "0";
  result.runner6l2 = gameDataJson["runner6l2"][0]
    ? gameDataJson["runner6l2"][0]
    : "0";
  result.runner6l3 = gameDataJson["runner6l3"][0]
    ? gameDataJson["runner6l3"][0]
    : "0";
  result.runner7b1 = gameDataJson["runner7b1"][0]
    ? gameDataJson["runner7b1"][0]
    : "0";
  result.runner7b2 = gameDataJson["runner7b2"][0]
    ? gameDataJson["runner7b2"][0]
    : "0";
  result.runner7b3 = gameDataJson["runner7b3"][0]
    ? gameDataJson["runner7b3"][0]
    : "0";
  result.runner7l1 = gameDataJson["runner7l1"][0]
    ? gameDataJson["runner7l1"][0]
    : "0";
  result.runner7l2 = gameDataJson["runner7l2"][0]
    ? gameDataJson["runner7l2"][0]
    : "0";
  result.runner7l3 = gameDataJson["runner7l3"][0]
    ? gameDataJson["runner7l3"][0]
    : "0";
  result.runner8b1 = gameDataJson["runner8b1"][0]
    ? gameDataJson["runner8b1"][0]
    : "0";
  result.runner8b2 = gameDataJson["runner8b2"][0]
    ? gameDataJson["runner8b2"][0]
    : "0";
  result.runner8b3 = gameDataJson["runner8b3"][0]
    ? gameDataJson["runner8b3"][0]
    : "0";
  result.runner8l1 = gameDataJson["runner8l1"][0]
    ? gameDataJson["runner8l1"][0]
    : "0";
  result.runner8l2 = gameDataJson["runner8l2"][0]
    ? gameDataJson["runner8l2"][0]
    : "0";
  result.runner8l3 = gameDataJson["runner8l3"][0]
    ? gameDataJson["runner8l3"][0]
    : "0";
  result.runner9b1 = gameDataJson["runner9b1"][0]
    ? gameDataJson["runner9b1"][0]
    : "0";
  result.runner9b2 = gameDataJson["runner9b2"][0]
    ? gameDataJson["runner9b2"][0]
    : "0";
  result.runner9b3 = gameDataJson["runner9b3"][0]
    ? gameDataJson["runner9b3"][0]
    : "0";
  result.runner9l1 = gameDataJson["runner9l1"][0]
    ? gameDataJson["runner9l1"][0]
    : "0";
  result.runner9l2 = gameDataJson["runner9l2"][0]
    ? gameDataJson["runner9l2"][0]
    : "0";
  result.runner9l3 = gameDataJson["runner9l3"][0]
    ? gameDataJson["runner9l3"][0]
    : "0";

  result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
    ? gameDataJson["runner1b1_matched"][0]
    : "0";
  result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
    ? gameDataJson["runner1b2_matched"][0]
    : "0";
  result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
    ? gameDataJson["runner1b3_matched"][0]
    : "0";
  result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
    ? gameDataJson["runner1l1_matched"][0]
    : "0";
  result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
    ? gameDataJson["runner1l2_matched"][0]
    : "0";
  result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
    ? gameDataJson["runner1l3_matched"][0]
    : "0";
  result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
    ? gameDataJson["runner2b1_matched"][0]
    : "0";
  result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
    ? gameDataJson["runner2b2_matched"][0]
    : "0";
  result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
    ? gameDataJson["runner2b3_matched"][0]
    : "0";
  result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
    ? gameDataJson["runner2l1_matched"][0]
    : "0";
  result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
    ? gameDataJson["runner2l2_matched"][0]
    : "0";
  result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
    ? gameDataJson["runner2l3_matched"][0]
    : "0";
  result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
    ? gameDataJson["runner3b1_matched"][0]
    : "0";
  result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
    ? gameDataJson["runner3b2_matched"][0]
    : "0";
  result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
    ? gameDataJson["runner3b3_matched"][0]
    : "0";
  result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
    ? gameDataJson["runner3l1_matched"][0]
    : "0";
  result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
    ? gameDataJson["runner3l2_matched"][0]
    : "0";
  result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
    ? gameDataJson["runner3l3_matched"][0]
    : "0";
  result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
    ? gameDataJson["runner4b1_matched"][0]
    : "0";
  result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
    ? gameDataJson["runner4b2_matched"][0]
    : "0";
  result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
    ? gameDataJson["runner4b3_matched"][0]
    : "0";
  result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
    ? gameDataJson["runner4l1_matched"][0]
    : "0";
  result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
    ? gameDataJson["runner4l2_matched"][0]
    : "0";
  result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
    ? gameDataJson["runner4l3_matched"][0]
    : "0";
  result.runner5b1_matched = gameDataJson["runner5b1_matched"][0]
    ? gameDataJson["runner5b1_matched"][0]
    : "0";
  result.runner5b2_matched = gameDataJson["runner5b2_matched"][0]
    ? gameDataJson["runner5b2_matched"][0]
    : "0";
  result.runner5b3_matched = gameDataJson["runner5b3_matched"][0]
    ? gameDataJson["runner5b3_matched"][0]
    : "0";
  result.runner5l1_matched = gameDataJson["runner5l1_matched"][0]
    ? gameDataJson["runner5l1_matched"][0]
    : "0";
  result.runner5l2_matched = gameDataJson["runner5l2_matched"][0]
    ? gameDataJson["runner5l2_matched"][0]
    : "0";
  result.runner5l3_matched = gameDataJson["runner5l3_matched"][0]
    ? gameDataJson["runner5l3_matched"][0]
    : "0";
  result.runner6b1_matched = gameDataJson["runner6b1_matched"][0]
    ? gameDataJson["runner6b1_matched"][0]
    : "0";
  result.runner6b2_matched = gameDataJson["runner6b2_matched"][0]
    ? gameDataJson["runner6b2_matched"][0]
    : "0";
  result.runner6b3_matched = gameDataJson["runner6b3_matched"][0]
    ? gameDataJson["runner6b3_matched"][0]
    : "0";
  result.runner6l1_matched = gameDataJson["runner6l1_matched"][0]
    ? gameDataJson["runner6l1_matched"][0]
    : "0";
  result.runner6l2_matched = gameDataJson["runner6l2_matched"][0]
    ? gameDataJson["runner6l2_matched"][0]
    : "0";
  result.runner6l3_matched = gameDataJson["runner6l3_matched"][0]
    ? gameDataJson["runner6l3_matched"][0]
    : "0";
  result.runner7b1_matched = gameDataJson["runner7b1_matched"][0]
    ? gameDataJson["runner7b1_matched"][0]
    : "0";
  result.runner7b2_matched = gameDataJson["runner7b2_matched"][0]
    ? gameDataJson["runner7b2_matched"][0]
    : "0";
  result.runner7b3_matched = gameDataJson["runner7b3_matched"][0]
    ? gameDataJson["runner7b3_matched"][0]
    : "0";
  result.runner7l1_matched = gameDataJson["runner7l1_matched"][0]
    ? gameDataJson["runner7l1_matched"][0]
    : "0";
  result.runner7l2_matched = gameDataJson["runner7l2_matched"][0]
    ? gameDataJson["runner7l2_matched"][0]
    : "0";
  result.runner7l3_matched = gameDataJson["runner7l3_matched"][0]
    ? gameDataJson["runner7l3_matched"][0]
    : "0";
  result.runner8b1_matched = gameDataJson["runner8b1_matched"][0]
    ? gameDataJson["runner8b1_matched"][0]
    : "0";
  result.runner8b2_matched = gameDataJson["runner8b2_matched"][0]
    ? gameDataJson["runner8b2_matched"][0]
    : "0";
  result.runner8b3_matched = gameDataJson["runner8b3_matched"][0]
    ? gameDataJson["runner8b3_matched"][0]
    : "0";
  result.runner8l1_matched = gameDataJson["runner8l1_matched"][0]
    ? gameDataJson["runner8l1_matched"][0]
    : "0";
  result.runner8l2_matched = gameDataJson["runner8l2_matched"][0]
    ? gameDataJson["runner8l2_matched"][0]
    : "0";
  result.runner8l3_matched = gameDataJson["runner8l3_matched"][0]
    ? gameDataJson["runner8l3_matched"][0]
    : "0";
  result.runner9b1_matched = gameDataJson["runner9b1_matched"][0]
    ? gameDataJson["runner9b1_matched"][0]
    : "0";
  result.runner9b2_matched = gameDataJson["runner9b2_matched"][0]
    ? gameDataJson["runner9b2_matched"][0]
    : "0";
  result.runner9b3_matched = gameDataJson["runner9b3_matched"][0]
    ? gameDataJson["runner9b3_matched"][0]
    : "0";
  result.runner9l1_matched = gameDataJson["runner9l1_matched"][0]
    ? gameDataJson["runner9l1_matched"][0]
    : "0";
  result.runner9l2_matched = gameDataJson["runner9l2_matched"][0]
    ? gameDataJson["runner9l2_matched"][0]
    : "0";
  result.runner9l3_matched = gameDataJson["runner9l3_matched"][0]
    ? gameDataJson["runner9l3_matched"][0]
    : "0";

  return result;
}

async function getBetfairGamesDerbyData() {
  const gameDataJson = await getData("betfair_derby", 0);

  //console.log('Derby Redis data: ',gameDataJson)
  //return [];
  try {
    let result = {};
    result.roundId = gameDataJson["cat_mid"];
    if (gameDataJson["round"][0] == undefined) {
      result.round = 0;
    } else {
      result.round = gameDataJson["round"][0];
    }

    result.timeLeft = gameDataJson["left_time"];
    result.time = gameDataJson["time"][0];
    result.time_percentage = gameDataJson["time_percentage"][0];
    result.evt_status = gameDataJson["evt_status"];

    result.market_status = gameDataJson["market_status"];

    if (
      String(gameDataJson["evt_status"]).trim() == "ACTIVE" ||
      String(gameDataJson["evt_status"]).trim() == "SUSPENDED_GAME_ROUND_OVER"
    ) {
      result.status = 1;
    } else {
      result.status = 3;
      //result.evt_status = gameDataJson["evt_status"];
    }

    //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
    //result.market_ststus = gameDataJson?.[0]?.market_status ?? '';

    result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
    result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
    result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
    result.cat_rnr4 = gameDataJson["cat_rnr4"][0];

    result.cat_sid1 = gameDataJson["cat_sid1"];
    result.cat_sid2 = gameDataJson["cat_sid2"];
    result.cat_sid3 = gameDataJson["cat_sid3"];
    result.cat_sid4 = gameDataJson["cat_sid4"];
    result.cat_sid5 = gameDataJson["cat_sid5"];
    result.cat_sid6 = gameDataJson["cat_sid6"];
    result.cat_sid7 = gameDataJson["cat_sid7"];
    result.cat_sid8 = gameDataJson["cat_sid8"];

    result.suspend1 = gameDataJson["suspend1"];
    result.suspend2 = gameDataJson["suspend2"];
    result.suspend3 = gameDataJson["suspend3"];
    result.suspend4 = gameDataJson["suspend4"];
    result.suspend5 = gameDataJson["suspend5"];
    result.suspend6 = gameDataJson["suspend6"];
    result.suspend7 = gameDataJson["suspend7"];
    result.suspend8 = gameDataJson["suspend8"];
    result.suspend9 = gameDataJson["suspend9"];

    result.cards_desc = gameDataJson["cards_desc"];
    result.rnr1_desc = gameDataJson["rnr1_desc"];
    result.rnr2_desc = gameDataJson["rnr2_desc"];
    result.rnr3_desc = gameDataJson["rnr3_desc"];
    result.rnr4_desc = gameDataJson["rnr4_desc"];

    result.rnr1_status = gameDataJson["rnr1_status"];
    result.rnr2_status = gameDataJson["rnr2_status"];
    result.rnr3_status = gameDataJson["rnr3_status"];
    result.rnr4_status = gameDataJson["rnr4_status"];
    result.rnr5_status = gameDataJson["rnr5_status"];
    result.rnr6_status = gameDataJson["rnr6_status"];
    result.rnr7_status = gameDataJson["rnr7_status"];
    result.rnr8_status = gameDataJson["rnr8_status"];
    result.rnr9_status = gameDataJson["rnr9_status"];

    result.runner1b1 = gameDataJson["runner1b1"][0]
      ? gameDataJson["runner1b1"][0]
      : "0";
    result.runner1b2 = gameDataJson["runner1b2"][0]
      ? gameDataJson["runner1b2"][0]
      : "0";
    result.runner1b3 = gameDataJson["runner1b3"][0]
      ? gameDataJson["runner1b3"][0]
      : "0";
    result.runner1l1 = gameDataJson["runner1l1"][0]
      ? gameDataJson["runner1l1"][0]
      : "0";
    result.runner1l2 = gameDataJson["runner1l2"][0]
      ? gameDataJson["runner1l2"][0]
      : "0";
    result.runner1l3 = gameDataJson["runner1l3"][0]
      ? gameDataJson["runner1l3"][0]
      : "0";
    result.runner2b1 = gameDataJson["runner2b1"][0]
      ? gameDataJson["runner2b1"][0]
      : "0";
    result.runner2b2 = gameDataJson["runner2b2"][0]
      ? gameDataJson["runner2b2"][0]
      : "0";
    result.runner2b3 = gameDataJson["runner2b3"][0]
      ? gameDataJson["runner2b3"][0]
      : "0";
    result.runner2l1 = gameDataJson["runner2l1"][0]
      ? gameDataJson["runner2l1"][0]
      : "0";
    result.runner2l2 = gameDataJson["runner2l2"][0]
      ? gameDataJson["runner2l2"][0]
      : "0";
    result.runner2l3 = gameDataJson["runner2l3"][0]
      ? gameDataJson["runner2l3"][0]
      : "0";
    result.runner3b1 = gameDataJson["runner3b1"][0]
      ? gameDataJson["runner3b1"][0]
      : "0";
    result.runner3b2 = gameDataJson["runner3b2"][0]
      ? gameDataJson["runner3b2"][0]
      : "0";
    result.runner3b3 = gameDataJson["runner3b3"][0]
      ? gameDataJson["runner3b3"][0]
      : "0";
    result.runner3l1 = gameDataJson["runner3l1"][0]
      ? gameDataJson["runner3l1"][0]
      : "0";
    result.runner3l2 = gameDataJson["runner3l2"][0]
      ? gameDataJson["runner3l2"][0]
      : "0";
    result.runner3l3 = gameDataJson["runner3l3"][0]
      ? gameDataJson["runner3l3"][0]
      : "0";
    result.runner4b1 = gameDataJson["runner4b1"][0]
      ? gameDataJson["runner4b1"][0]
      : "0";
    result.runner4b2 = gameDataJson["runner4b2"][0]
      ? gameDataJson["runner4b2"][0]
      : "0";
    result.runner4b3 = gameDataJson["runner4b3"][0]
      ? gameDataJson["runner4b3"][0]
      : "0";
    result.runner4l1 = gameDataJson["runner4l1"][0]
      ? gameDataJson["runner4l1"][0]
      : "0";
    result.runner4l2 = gameDataJson["runner4l2"][0]
      ? gameDataJson["runner4l2"][0]
      : "0";
    result.runner4l3 = gameDataJson["runner4l3"][0]
      ? gameDataJson["runner4l3"][0]
      : "0";

    result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
      ? gameDataJson["runner1b1_matched"][0]
      : "0";
    result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
      ? gameDataJson["runner1b2_matched"][0]
      : "0";
    result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
      ? gameDataJson["runner1b3_matched"][0]
      : "0";
    result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
      ? gameDataJson["runner1l1_matched"][0]
      : "0";
    result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
      ? gameDataJson["runner1l2_matched"][0]
      : "0";
    result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
      ? gameDataJson["runner1l3_matched"][0]
      : "0";
    result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
      ? gameDataJson["runner2b1_matched"][0]
      : "0";
    result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
      ? gameDataJson["runner2b2_matched"][0]
      : "0";
    result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
      ? gameDataJson["runner2b3_matched"][0]
      : "0";
    result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
      ? gameDataJson["runner2l1_matched"][0]
      : "0";
    result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
      ? gameDataJson["runner2l2_matched"][0]
      : "0";
    result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
      ? gameDataJson["runner2l3_matched"][0]
      : "0";
    result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
      ? gameDataJson["runner3b1_matched"][0]
      : "0";
    result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
      ? gameDataJson["runner3b2_matched"][0]
      : "0";
    result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
      ? gameDataJson["runner3b3_matched"][0]
      : "0";
    result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
      ? gameDataJson["runner3l1_matched"][0]
      : "0";
    result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
      ? gameDataJson["runner3l2_matched"][0]
      : "0";
    result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
      ? gameDataJson["runner3l3_matched"][0]
      : "0";
    result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
      ? gameDataJson["runner4b1_matched"][0]
      : "0";
    result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
      ? gameDataJson["runner4b2_matched"][0]
      : "0";
    result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
      ? gameDataJson["runner4b3_matched"][0]
      : "0";
    result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
      ? gameDataJson["runner4l1_matched"][0]
      : "0";
    result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
      ? gameDataJson["runner4l2_matched"][0]
      : "0";
    result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
      ? gameDataJson["runner4l3_matched"][0]
      : "0";

    result.spades_desc = gameDataJson["spades_desc"]? gameDataJson["spades_desc"].split(','): [];
    result.hearts_desc = gameDataJson["hearts_desc"]? gameDataJson["hearts_desc"].split(','): [];
    result.clubs_desc = gameDataJson["clubs_desc"]? gameDataJson["clubs_desc"].split(','): [];
    result.diamonds_desc = gameDataJson["diamonds_desc"]? gameDataJson["diamonds_desc"].split(','): [];

    result.spades_place = gameDataJson["spades_place"][0]? gameDataJson["spades_place"][0]: "1";
    result.hearts_place = gameDataJson["hearts_place"][0]? gameDataJson["hearts_place"][0]: "1";
    result.clubs_place = gameDataJson["clubs_place"][0]? gameDataJson["clubs_place"][0]: "1";
    result.diamonds_place = gameDataJson["diamonds_place"][0]? gameDataJson["diamonds_place"][0]: "1";

    result.spades_segment = gameDataJson["spades_segment"];
    result.hearts_segment = gameDataJson["hearts_segment"];
    result.clubs_segment = gameDataJson["clubs_segment"];
    result.diamonds_segment = gameDataJson["diamonds_segment"];

    result.current_desc = gameDataJson["current_desc"][0]? gameDataJson["current_desc"][0].split(','): [];
    result.handicap_desc = gameDataJson["handicap_desc"][0]? gameDataJson["handicap_desc"][0].split(','): [];
    result.used_desc = gameDataJson["used_desc"][0]? gameDataJson["used_desc"][0].split(','): [];

    result.spadesDesc = gameDataJson["spadesDesc"]? gameDataJson["spadesDesc"]: [];
    result.heartsDesc = gameDataJson["heartsDesc"]? gameDataJson["heartsDesc"]: [];
    result.clubsDesc = gameDataJson["clubsDesc"]? gameDataJson["clubsDesc"]: [];
    result.diamondsDesc = gameDataJson["diamondsDesc"]? gameDataJson["diamondsDesc"]: [];
      //console.log(result);
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
}
async function getBetfairGamesTurboDerbyData() {
  const gameDataJson = await getData("betfair_derby_turbo", 0);

  //console.log('Derby Redis data: ',gameDataJson)
  //return [];
  try {
    let result = {};
    result.roundId = gameDataJson["cat_mid"];
    if (gameDataJson["round"][0] == undefined) {
      result.round = 0;
    } else {
      result.round = gameDataJson["round"][0];
    }

    result.timeLeft = gameDataJson["left_time"];
    result.time = gameDataJson["time"][0];
    result.time_percentage = gameDataJson["time_percentage"][0];
    result.evt_status = gameDataJson["evt_status"];

    result.market_status = gameDataJson["market_status"];

    if (
      String(gameDataJson["evt_status"]).trim() == "ACTIVE" ||
      String(gameDataJson["evt_status"]).trim() == "SUSPENDED_GAME_ROUND_OVER"
    ) {
      result.status = 1;
    } else {
      result.status = 3;
      //result.evt_status = gameDataJson["evt_status"];
    }

    //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
    //result.market_ststus = gameDataJson?.[0]?.market_status ?? '';

    result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
    result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
    result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
    result.cat_rnr4 = gameDataJson["cat_rnr4"][0];

    result.cat_sid1 = gameDataJson["cat_sid1"];
    result.cat_sid2 = gameDataJson["cat_sid2"];
    result.cat_sid3 = gameDataJson["cat_sid3"];
    result.cat_sid4 = gameDataJson["cat_sid4"];
    result.cat_sid5 = gameDataJson["cat_sid5"];
    result.cat_sid6 = gameDataJson["cat_sid6"];
    result.cat_sid7 = gameDataJson["cat_sid7"];
    result.cat_sid8 = gameDataJson["cat_sid8"];

    result.suspend1 = gameDataJson["suspend1"];
    result.suspend2 = gameDataJson["suspend2"];
    result.suspend3 = gameDataJson["suspend3"];
    result.suspend4 = gameDataJson["suspend4"];
    result.suspend5 = gameDataJson["suspend5"];
    result.suspend6 = gameDataJson["suspend6"];
    result.suspend7 = gameDataJson["suspend7"];
    result.suspend8 = gameDataJson["suspend8"];
    result.suspend9 = gameDataJson["suspend9"];

    result.cards_desc = gameDataJson["cards_desc"];
    result.rnr1_desc = gameDataJson["rnr1_desc"];
    result.rnr2_desc = gameDataJson["rnr2_desc"];
    result.rnr3_desc = gameDataJson["rnr3_desc"];
    result.rnr4_desc = gameDataJson["rnr4_desc"];

    result.rnr1_status = gameDataJson["rnr1_status"];
    result.rnr2_status = gameDataJson["rnr2_status"];
    result.rnr3_status = gameDataJson["rnr3_status"];
    result.rnr4_status = gameDataJson["rnr4_status"];
    result.rnr5_status = gameDataJson["rnr5_status"];
    result.rnr6_status = gameDataJson["rnr6_status"];
    result.rnr7_status = gameDataJson["rnr7_status"];
    result.rnr8_status = gameDataJson["rnr8_status"];
    result.rnr9_status = gameDataJson["rnr9_status"];

    result.runner1b1 = gameDataJson["runner1b1"][0]
      ? gameDataJson["runner1b1"][0]
      : "0";
    result.runner1b2 = gameDataJson["runner1b2"][0]
      ? gameDataJson["runner1b2"][0]
      : "0";
    result.runner1b3 = gameDataJson["runner1b3"][0]
      ? gameDataJson["runner1b3"][0]
      : "0";
    result.runner1l1 = gameDataJson["runner1l1"][0]
      ? gameDataJson["runner1l1"][0]
      : "0";
    result.runner1l2 = gameDataJson["runner1l2"][0]
      ? gameDataJson["runner1l2"][0]
      : "0";
    result.runner1l3 = gameDataJson["runner1l3"][0]
      ? gameDataJson["runner1l3"][0]
      : "0";
    result.runner2b1 = gameDataJson["runner2b1"][0]
      ? gameDataJson["runner2b1"][0]
      : "0";
    result.runner2b2 = gameDataJson["runner2b2"][0]
      ? gameDataJson["runner2b2"][0]
      : "0";
    result.runner2b3 = gameDataJson["runner2b3"][0]
      ? gameDataJson["runner2b3"][0]
      : "0";
    result.runner2l1 = gameDataJson["runner2l1"][0]
      ? gameDataJson["runner2l1"][0]
      : "0";
    result.runner2l2 = gameDataJson["runner2l2"][0]
      ? gameDataJson["runner2l2"][0]
      : "0";
    result.runner2l3 = gameDataJson["runner2l3"][0]
      ? gameDataJson["runner2l3"][0]
      : "0";
    result.runner3b1 = gameDataJson["runner3b1"][0]
      ? gameDataJson["runner3b1"][0]
      : "0";
    result.runner3b2 = gameDataJson["runner3b2"][0]
      ? gameDataJson["runner3b2"][0]
      : "0";
    result.runner3b3 = gameDataJson["runner3b3"][0]
      ? gameDataJson["runner3b3"][0]
      : "0";
    result.runner3l1 = gameDataJson["runner3l1"][0]
      ? gameDataJson["runner3l1"][0]
      : "0";
    result.runner3l2 = gameDataJson["runner3l2"][0]
      ? gameDataJson["runner3l2"][0]
      : "0";
    result.runner3l3 = gameDataJson["runner3l3"][0]
      ? gameDataJson["runner3l3"][0]
      : "0";
    result.runner4b1 = gameDataJson["runner4b1"][0]
      ? gameDataJson["runner4b1"][0]
      : "0";
    result.runner4b2 = gameDataJson["runner4b2"][0]
      ? gameDataJson["runner4b2"][0]
      : "0";
    result.runner4b3 = gameDataJson["runner4b3"][0]
      ? gameDataJson["runner4b3"][0]
      : "0";
    result.runner4l1 = gameDataJson["runner4l1"][0]
      ? gameDataJson["runner4l1"][0]
      : "0";
    result.runner4l2 = gameDataJson["runner4l2"][0]
      ? gameDataJson["runner4l2"][0]
      : "0";
    result.runner4l3 = gameDataJson["runner4l3"][0]
      ? gameDataJson["runner4l3"][0]
      : "0";

    result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
      ? gameDataJson["runner1b1_matched"][0]
      : "0";
    result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
      ? gameDataJson["runner1b2_matched"][0]
      : "0";
    result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
      ? gameDataJson["runner1b3_matched"][0]
      : "0";
    result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
      ? gameDataJson["runner1l1_matched"][0]
      : "0";
    result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
      ? gameDataJson["runner1l2_matched"][0]
      : "0";
    result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
      ? gameDataJson["runner1l3_matched"][0]
      : "0";
    result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
      ? gameDataJson["runner2b1_matched"][0]
      : "0";
    result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
      ? gameDataJson["runner2b2_matched"][0]
      : "0";
    result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
      ? gameDataJson["runner2b3_matched"][0]
      : "0";
    result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
      ? gameDataJson["runner2l1_matched"][0]
      : "0";
    result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
      ? gameDataJson["runner2l2_matched"][0]
      : "0";
    result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
      ? gameDataJson["runner2l3_matched"][0]
      : "0";
    result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
      ? gameDataJson["runner3b1_matched"][0]
      : "0";
    result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
      ? gameDataJson["runner3b2_matched"][0]
      : "0";
    result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
      ? gameDataJson["runner3b3_matched"][0]
      : "0";
    result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
      ? gameDataJson["runner3l1_matched"][0]
      : "0";
    result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
      ? gameDataJson["runner3l2_matched"][0]
      : "0";
    result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
      ? gameDataJson["runner3l3_matched"][0]
      : "0";
    result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
      ? gameDataJson["runner4b1_matched"][0]
      : "0";
    result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
      ? gameDataJson["runner4b2_matched"][0]
      : "0";
    result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
      ? gameDataJson["runner4b3_matched"][0]
      : "0";
    result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
      ? gameDataJson["runner4l1_matched"][0]
      : "0";
    result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
      ? gameDataJson["runner4l2_matched"][0]
      : "0";
    result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
      ? gameDataJson["runner4l3_matched"][0]
      : "0";

    result.spades_desc = gameDataJson["spades_desc"]? gameDataJson["spades_desc"].split(','): [];
    result.hearts_desc = gameDataJson["hearts_desc"]? gameDataJson["hearts_desc"].split(','): [];
    result.clubs_desc = gameDataJson["clubs_desc"]? gameDataJson["clubs_desc"].split(','): [];
    result.diamonds_desc = gameDataJson["diamonds_desc"]? gameDataJson["diamonds_desc"].split(','): [];

    result.spades_place = gameDataJson["spades_place"][0]? gameDataJson["spades_place"][0]: "1";
    result.hearts_place = gameDataJson["hearts_place"][0]? gameDataJson["hearts_place"][0]: "1";
    result.clubs_place = gameDataJson["clubs_place"][0]? gameDataJson["clubs_place"][0]: "1";
    result.diamonds_place = gameDataJson["diamonds_place"][0]? gameDataJson["diamonds_place"][0]: "1";

    result.spades_segment = gameDataJson["spades_segment"];
    result.hearts_segment = gameDataJson["hearts_segment"];
    result.clubs_segment = gameDataJson["clubs_segment"];
    result.diamonds_segment = gameDataJson["diamonds_segment"];

    result.current_desc = gameDataJson["current_desc"][0]? gameDataJson["current_desc"][0].split(','): [];
    result.handicap_desc = gameDataJson["handicap_desc"][0]? gameDataJson["handicap_desc"][0].split(','): [];
    result.used_desc = gameDataJson["used_desc"][0]? gameDataJson["used_desc"][0].split(','): [];

    result.spadesDesc = gameDataJson["spadesDesc"]? gameDataJson["spadesDesc"]: [];
    result.heartsDesc = gameDataJson["heartsDesc"]? gameDataJson["heartsDesc"]: [];
    result.clubsDesc = gameDataJson["clubsDesc"]? gameDataJson["clubsDesc"]: [];
    result.diamondsDesc = gameDataJson["diamondsDesc"]? gameDataJson["diamondsDesc"]: [];
      //console.log(result);
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
}

async function getBetfairGamesTurboDerbyData() {
  const gameDataJson = await getData("betfair_derby_turbo", 0);

  //console.log('Derby Redis data: ',gameDataJson)
  //return [];
  try {
    let result = {};
    result.roundId = gameDataJson["cat_mid"];
    if (gameDataJson["round"][0] == undefined) {
      result.round = 0;
    } else {
      result.round = gameDataJson["round"][0];
    }

    result.timeLeft = gameDataJson["left_time"];
    result.time = gameDataJson["time"][0];
    result.time_percentage = gameDataJson["time_percentage"][0];
    result.evt_status = gameDataJson["evt_status"];

    result.market_status = gameDataJson["market_status"];

    if (
      String(gameDataJson["evt_status"]).trim() == "ACTIVE" ||
      String(gameDataJson["evt_status"]).trim() == "SUSPENDED_GAME_ROUND_OVER"
    ) {
      result.status = 1;
    } else {
      result.status = 3;
      //result.evt_status = gameDataJson["evt_status"];
    }

    //result.market_status =  (gameDataJson['market_status'][0])?gameDataJson['market_status'][0]:'';
    //result.market_ststus = gameDataJson?.[0]?.market_status ?? '';

    result.cat_rnr1 = gameDataJson["cat_rnr1"][0];
    result.cat_rnr2 = gameDataJson["cat_rnr2"][0];
    result.cat_rnr3 = gameDataJson["cat_rnr3"][0];
    result.cat_rnr4 = gameDataJson["cat_rnr4"][0];

    result.cat_sid1 = gameDataJson["cat_sid1"];
    result.cat_sid2 = gameDataJson["cat_sid2"];
    result.cat_sid3 = gameDataJson["cat_sid3"];
    result.cat_sid4 = gameDataJson["cat_sid4"];
    result.cat_sid5 = gameDataJson["cat_sid5"];
    result.cat_sid6 = gameDataJson["cat_sid6"];
    result.cat_sid7 = gameDataJson["cat_sid7"];
    result.cat_sid8 = gameDataJson["cat_sid8"];

    result.suspend1 = gameDataJson["suspend1"];
    result.suspend2 = gameDataJson["suspend2"];
    result.suspend3 = gameDataJson["suspend3"];
    result.suspend4 = gameDataJson["suspend4"];
    result.suspend5 = gameDataJson["suspend5"];
    result.suspend6 = gameDataJson["suspend6"];
    result.suspend7 = gameDataJson["suspend7"];
    result.suspend8 = gameDataJson["suspend8"];
    result.suspend9 = gameDataJson["suspend9"];

    result.cards_desc = gameDataJson["cards_desc"];
    result.rnr1_desc = gameDataJson["rnr1_desc"];
    result.rnr2_desc = gameDataJson["rnr2_desc"];
    result.rnr3_desc = gameDataJson["rnr3_desc"];
    result.rnr4_desc = gameDataJson["rnr4_desc"];

    result.rnr1_status = gameDataJson["rnr1_status"];
    result.rnr2_status = gameDataJson["rnr2_status"];
    result.rnr3_status = gameDataJson["rnr3_status"];
    result.rnr4_status = gameDataJson["rnr4_status"];
    result.rnr5_status = gameDataJson["rnr5_status"];
    result.rnr6_status = gameDataJson["rnr6_status"];
    result.rnr7_status = gameDataJson["rnr7_status"];
    result.rnr8_status = gameDataJson["rnr8_status"];
    result.rnr9_status = gameDataJson["rnr9_status"];

    result.runner1b1 = gameDataJson["runner1b1"][0]
      ? gameDataJson["runner1b1"][0]
      : "0";
    result.runner1b2 = gameDataJson["runner1b2"][0]
      ? gameDataJson["runner1b2"][0]
      : "0";
    result.runner1b3 = gameDataJson["runner1b3"][0]
      ? gameDataJson["runner1b3"][0]
      : "0";
    result.runner1l1 = gameDataJson["runner1l1"][0]
      ? gameDataJson["runner1l1"][0]
      : "0";
    result.runner1l2 = gameDataJson["runner1l2"][0]
      ? gameDataJson["runner1l2"][0]
      : "0";
    result.runner1l3 = gameDataJson["runner1l3"][0]
      ? gameDataJson["runner1l3"][0]
      : "0";
    result.runner2b1 = gameDataJson["runner2b1"][0]
      ? gameDataJson["runner2b1"][0]
      : "0";
    result.runner2b2 = gameDataJson["runner2b2"][0]
      ? gameDataJson["runner2b2"][0]
      : "0";
    result.runner2b3 = gameDataJson["runner2b3"][0]
      ? gameDataJson["runner2b3"][0]
      : "0";
    result.runner2l1 = gameDataJson["runner2l1"][0]
      ? gameDataJson["runner2l1"][0]
      : "0";
    result.runner2l2 = gameDataJson["runner2l2"][0]
      ? gameDataJson["runner2l2"][0]
      : "0";
    result.runner2l3 = gameDataJson["runner2l3"][0]
      ? gameDataJson["runner2l3"][0]
      : "0";
    result.runner3b1 = gameDataJson["runner3b1"][0]
      ? gameDataJson["runner3b1"][0]
      : "0";
    result.runner3b2 = gameDataJson["runner3b2"][0]
      ? gameDataJson["runner3b2"][0]
      : "0";
    result.runner3b3 = gameDataJson["runner3b3"][0]
      ? gameDataJson["runner3b3"][0]
      : "0";
    result.runner3l1 = gameDataJson["runner3l1"][0]
      ? gameDataJson["runner3l1"][0]
      : "0";
    result.runner3l2 = gameDataJson["runner3l2"][0]
      ? gameDataJson["runner3l2"][0]
      : "0";
    result.runner3l3 = gameDataJson["runner3l3"][0]
      ? gameDataJson["runner3l3"][0]
      : "0";
    result.runner4b1 = gameDataJson["runner4b1"][0]
      ? gameDataJson["runner4b1"][0]
      : "0";
    result.runner4b2 = gameDataJson["runner4b2"][0]
      ? gameDataJson["runner4b2"][0]
      : "0";
    result.runner4b3 = gameDataJson["runner4b3"][0]
      ? gameDataJson["runner4b3"][0]
      : "0";
    result.runner4l1 = gameDataJson["runner4l1"][0]
      ? gameDataJson["runner4l1"][0]
      : "0";
    result.runner4l2 = gameDataJson["runner4l2"][0]
      ? gameDataJson["runner4l2"][0]
      : "0";
    result.runner4l3 = gameDataJson["runner4l3"][0]
      ? gameDataJson["runner4l3"][0]
      : "0";

    result.runner1b1_matched = gameDataJson["runner1b1_matched"][0]
      ? gameDataJson["runner1b1_matched"][0]
      : "0";
    result.runner1b2_matched = gameDataJson["runner1b2_matched"][0]
      ? gameDataJson["runner1b2_matched"][0]
      : "0";
    result.runner1b3_matched = gameDataJson["runner1b3_matched"][0]
      ? gameDataJson["runner1b3_matched"][0]
      : "0";
    result.runner1l1_matched = gameDataJson["runner1l1_matched"][0]
      ? gameDataJson["runner1l1_matched"][0]
      : "0";
    result.runner1l2_matched = gameDataJson["runner1l2_matched"][0]
      ? gameDataJson["runner1l2_matched"][0]
      : "0";
    result.runner1l3_matched = gameDataJson["runner1l3_matched"][0]
      ? gameDataJson["runner1l3_matched"][0]
      : "0";
    result.runner2b1_matched = gameDataJson["runner2b1_matched"][0]
      ? gameDataJson["runner2b1_matched"][0]
      : "0";
    result.runner2b2_matched = gameDataJson["runner2b2_matched"][0]
      ? gameDataJson["runner2b2_matched"][0]
      : "0";
    result.runner2b3_matched = gameDataJson["runner2b3_matched"][0]
      ? gameDataJson["runner2b3_matched"][0]
      : "0";
    result.runner2l1_matched = gameDataJson["runner2l1_matched"][0]
      ? gameDataJson["runner2l1_matched"][0]
      : "0";
    result.runner2l2_matched = gameDataJson["runner2l2_matched"][0]
      ? gameDataJson["runner2l2_matched"][0]
      : "0";
    result.runner2l3_matched = gameDataJson["runner2l3_matched"][0]
      ? gameDataJson["runner2l3_matched"][0]
      : "0";
    result.runner3b1_matched = gameDataJson["runner3b1_matched"][0]
      ? gameDataJson["runner3b1_matched"][0]
      : "0";
    result.runner3b2_matched = gameDataJson["runner3b2_matched"][0]
      ? gameDataJson["runner3b2_matched"][0]
      : "0";
    result.runner3b3_matched = gameDataJson["runner3b3_matched"][0]
      ? gameDataJson["runner3b3_matched"][0]
      : "0";
    result.runner3l1_matched = gameDataJson["runner3l1_matched"][0]
      ? gameDataJson["runner3l1_matched"][0]
      : "0";
    result.runner3l2_matched = gameDataJson["runner3l2_matched"][0]
      ? gameDataJson["runner3l2_matched"][0]
      : "0";
    result.runner3l3_matched = gameDataJson["runner3l3_matched"][0]
      ? gameDataJson["runner3l3_matched"][0]
      : "0";
    result.runner4b1_matched = gameDataJson["runner4b1_matched"][0]
      ? gameDataJson["runner4b1_matched"][0]
      : "0";
    result.runner4b2_matched = gameDataJson["runner4b2_matched"][0]
      ? gameDataJson["runner4b2_matched"][0]
      : "0";
    result.runner4b3_matched = gameDataJson["runner4b3_matched"][0]
      ? gameDataJson["runner4b3_matched"][0]
      : "0";
    result.runner4l1_matched = gameDataJson["runner4l1_matched"][0]
      ? gameDataJson["runner4l1_matched"][0]
      : "0";
    result.runner4l2_matched = gameDataJson["runner4l2_matched"][0]
      ? gameDataJson["runner4l2_matched"][0]
      : "0";
    result.runner4l3_matched = gameDataJson["runner4l3_matched"][0]
      ? gameDataJson["runner4l3_matched"][0]
      : "0";

    result.spades_desc = gameDataJson["spades_desc"]? gameDataJson["spades_desc"].split(','): [];
    result.hearts_desc = gameDataJson["hearts_desc"]? gameDataJson["hearts_desc"].split(','): [];
    result.clubs_desc = gameDataJson["clubs_desc"]? gameDataJson["clubs_desc"].split(','): [];
    result.diamonds_desc = gameDataJson["diamonds_desc"]? gameDataJson["diamonds_desc"].split(','): [];

    result.spades_place = gameDataJson["spades_place"][0]? gameDataJson["spades_place"][0]: "1";
    result.hearts_place = gameDataJson["hearts_place"][0]? gameDataJson["hearts_place"][0]: "1";
    result.clubs_place = gameDataJson["clubs_place"][0]? gameDataJson["clubs_place"][0]: "1";
    result.diamonds_place = gameDataJson["diamonds_place"][0]? gameDataJson["diamonds_place"][0]: "1";

    result.spades_segment = gameDataJson["spades_segment"];
    result.hearts_segment = gameDataJson["hearts_segment"];
    result.clubs_segment = gameDataJson["clubs_segment"];
    result.diamonds_segment = gameDataJson["diamonds_segment"];

    result.current_desc = gameDataJson["current_desc"][0]? gameDataJson["current_desc"][0].split(','): [];
    result.handicap_desc = gameDataJson["handicap_desc"][0]? gameDataJson["handicap_desc"][0].split(','): [];
    result.used_desc = gameDataJson["used_desc"][0]? gameDataJson["used_desc"][0].split(','): [];

    result.spadesDesc = gameDataJson["spadesDesc"]? gameDataJson["spadesDesc"]: [];
    result.heartsDesc = gameDataJson["heartsDesc"]? gameDataJson["heartsDesc"]: [];
    result.clubsDesc = gameDataJson["clubsDesc"]? gameDataJson["clubsDesc"]: [];
    result.diamondsDesc = gameDataJson["diamondsDesc"]? gameDataJson["diamondsDesc"]: [];
      //console.log(result);
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
}

module.exports = {
  getBetfairGamesHoldemData,
  getBetfairGamesTurboHoldemData,
  getBetfairGamesBlackjackData,
  getBetfairGamesTurboBlackjackData,
  getBetfairGamesBaccaratData,
  getBetfairGamesTurboBaccaratData,
  getBetfairGamesHiloData,
  getBetfairGamesTurboHiloData,
  getBetfairGamesOmahaData,
  getBetfairGamesDerbyData,
  getBetfairGamesTurboDerbyData
};
