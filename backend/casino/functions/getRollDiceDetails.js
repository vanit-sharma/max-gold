const { default: mongoose } = require("mongoose");
const BzRollDiceRates = require("../models/BzRollDiceRates");
const RollDiceMatch = require("../models/RollDiceMatch");
const moment = require("moment");

async function getRollDiceDetails() {
  const result = {
    evt_id: 0,
    timeLeft: 0,
    b1: "",
    b2: "",
    b3: "",
    suspend1: 1,
    suspend2: 1,
    suspend3: 1,
    // will fill more below
  };

  let dra = [];
  let dbOdds = false;
  let isStopGame = true;

  // Try Redis first
  try {
    const redis = new Redis();
    const redisData = await redis.get("rolldice:0");
    if (redisData) {
      dra = JSON.parse(redisData);
      isStopGame = dra[0]?.game;
    } else {
      dbOdds = true;
    }
  } catch (err) {
    dbOdds = true;
  }

  // Fallback to DB if needed
  if (dbOdds) {
    // Replace with ORM query

    dra = await BzRollDiceRates.find({ stld: 0 })
      .sort({ evt_od: -1 })
      .limit(1)
      .lean();
  }

  if (dra) {
    const dr = dra;
    result.roundId = dr.evt_id;
    result.timeLeft = dr.left_time < 0 ? 0 : dr.left_time;
    result.b1 = dr.b1;
    result.b2 = dr.b2;
    result.b3 = dr.b3;
    result.b4 = dr.b4;
    result.b5 = dr.b5;
    result.b6 = dr.b6;
    result.b7 = dr.b7;
    result.b8 = dr.b8;
    result.b9 = dr.b9;
    result.b10 = dr.b10;
    result.b11 = dr.b11;
    result.b12 = dr.b12;
    result.evt_id = dr.evt_id;
    result.status = dr.evt_status;
    result.suspend1 = dr.suspend1;
    result.suspend2 = dr.suspend2;
    result.suspend3 = dr.suspend3;
    result.suspend4 = dr.suspend4;
    result.suspend5 = dr.suspend5;
    result.suspend6 = dr.suspend6;
    result.suspend7 = dr.suspend7;
    result.suspend8 = dr.suspend8;
    result.suspend9 = dr.suspend9;
    result.suspend10 = dr.suspend10;
    result.suspend11 = dr.suspend11;
    result.suspend12 = dr.suspend12;
    result.rollResult = dr.rollResult;
    result.rollResult2 = dr.rollResult2;
    result.rollResultTotal = dr.rollResultTotal;
  }

  // User bets
  const userBets = [];
  const today = moment().format("YYYY-MM-DD");
  const from_stmp = `${today} 00:00:00`;
  const to_stmp = `${today} 23:59:59`;

  const user_id = new mongoose.Types.ObjectId("68ac589644bf08d635ec4755");
  
  // I have used a simple query instead of left join because in the actual code the join was not retreiving any data from right table and was of no use!
  const results = await RollDiceMatch.find(
    { user_id, stld: 0 }, // WHERE
    null,
    { sort: { stmp: -1 }, limit: 5 } // ORDER BY & LIMIT
  );

  for (const dr of results) {
    const record = {};
    const result_data = JSON.parse(dr.result_data || "{}");
    const drResult = result_data.result1 || 0;
    const drResult2 = result_data.result2 || 0;
    const color_stld = result_data.stld;
    const result_number = drResult + drResult2;
    const bet_type = (dr.bet_type || "").toUpperCase();

    record.id = dr.sno;
    record.cat_mid = dr.mid_mid;
    record.bg = "";
    record.runner_name = `${bet_type} (${
      (dr.rnr_nam || "").charAt(0).toUpperCase() + (dr.rnr_nam || "").slice(1)
    })`;
    record.type = "";
    record.rate = 0;
    record.amount = dr.lockamt;
    record.profit = dr.bak;
    record.liability = dr.lay;
    record.uname = dr.uname;
    record.bet_type = dr.bet_type;
    record.fee = dr.fee;
    record.contract_money = dr.contract_money;
    record.delivery = dr.delivery;
    record.stmp = dr.stmp;
    record.stld = dr.stld;
    record.color_stld = color_stld;
    record.result_number = result_number;
    record.result1 = dr.result;
    record.result2 = dr.result2;
    record.result_status = dr.result_status;
    userBets.push(record);
  }

  // Results history from Redis
  let history = [];
  try {
    const redisDataResult = await redis.get("rolldice_Results:0");
    if (redisDataResult) {
      history = JSON.parse(redisDataResult);
    }
  } catch (err) {}

  result.results_history = history;
  result.book = {}; // locked amounts, implement if needed
  result.bets = userBets;

  return result;
}

module.exports = getRollDiceDetails;