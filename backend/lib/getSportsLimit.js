const BetLimit = require("../models/BetLimit");

async function getSportsLimit(sports, user_id) {
  sportsObjInfo = await BetLimit.findOne({ user_id }).lean();

  if (sportsObjInfo) {
    if (sports == "soccer") {
      limit = sportsObjInfo.soccer;
    } else if (sports == "soccer_min") {
      limit = sportsObjInfo.soccer_min;
    } else if (sports == "tennis") {
      limit = sportsObjInfo.tennis;
    } else if (sports == "tennis_min") {
      limit = sportsObjInfo.tennis_min;
    } else if (sports == "cricket_min") {
      limit = sportsObjInfo.cricket_min;
    } else if (sports == "cricket") {
      limit = sportsObjInfo.cricket;
    } else if (sports == "fancy_min") {
      limit = sportsObjInfo.fancy_min;
    } else if (sports == "fancy") {
      limit = sportsObjInfo.fancy;
    } else if (sports == "hrace_min") {
      limit = sportsObjInfo.hrace_min;
    } else if (sports == "hrace") {
      limit = sportsObjInfo.hrace;
    } else if (sports == "casino") {
      limit = sportsObjInfo.casino;
    } else if (sports == "greyhound_min") {
      limit = sportsObjInfo.greyhound_min;
    } else if (sports == "greyhound") {
      limit = sportsObjInfo.greyhound;
    } else if (sports == "bookMaker_min") {
      limit = sportsObjInfo.bookMaker_min;
    } else if (sports == "bookMaker") {
      limit = sportsObjInfo.bookMaker;
    } else if (sports == "virtual_min") {
      limit = sportsObjInfo.virtual_min;
    } else if (sports == "virtual") {
      limit = sportsObjInfo.virtual;
    } else if (sports == "toss_min") {
      limit = sportsObjInfo.toss_min;
    } else if (sports == "toss") {
      limit = sportsObjInfo.toss;
    } else if (sports == "tie_min") {
      limit = sportsObjInfo.tie_min;
    } else if (sports == "tie") {
      limit = sportsObjInfo.tie;
    } else if (sports == "evenodd_min") {
      limit = sportsObjInfo.evenodd_min;
    } else if (sports == "evenodd") {
      limit = sportsObjInfo.evenodd;
    } else if (sports == "figure_min") {
      limit = sportsObjInfo.figure_min;
    } else if (sports == "figure") {
      limit = sportsObjInfo.figure;
    } else if (sports == "soccer_exp") {
      limit = sportsObjInfo.soccer_exp;
    } else if (sports == "tennis_exp") {
      limit = sportsObjInfo.tennis_exp;
    } else if (sports == "cricket_exp") {
      limit = sportsObjInfo.cricket_exp;
    } else if (sports == "fancy_exp") {
      limit = sportsObjInfo.fancy_exp;
    } else if (sports == "hrace_exp") {
      limit = sportsObjInfo.hrace_exp;
    } else if (sports == "greyhound_exp") {
      limit = sportsObjInfo.greyhound_exp;
    } else if (sports == "bookMaker_exp") {
      limit = sportsObjInfo.bookMaker_exp;
    } else if (sports == "virtual_exp") {
      limit = sportsObjInfo.virtual_exp;
    } else if (sports == "toss_exp") {
      limit = sportsObjInfo.toss_exp;
    } else if (sports == "tie_exp") {
      limit = sportsObjInfo.tie_exp;
    } else if (sports == "evenodd_exp") {
      limit = sportsObjInfo.evenodd_exp;
    } else if (sports == "figure_exp") {
      limit = sportsObjInfo.figure_exp;
    }
  } else {
    limit = 0;
  }
  return limit;
}
module.exports = getSportsLimit;
