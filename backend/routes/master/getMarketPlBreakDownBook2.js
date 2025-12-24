const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const moment = require("moment-timezone");
const auth = require("../../middleware/agentAuth");
const Punter = require("../../models/Punter");
const BzBtPunterTransSummary = require("../../models/BzBtPunterTransSummary");
const PunterTransDetails = require("../../models/PunterTransDetails");
const BetfairEvent = require("../../models/BetfairEvent");
const sportsApingRequest = require("../../utils/sportsApingRequest");

router.use(auth);

function toNumberArray(market_type) {
  if (Array.isArray(market_type)) {
    return market_type.map((x) => Number(x)).filter((n) => !Number.isNaN(n));
  }

  if (typeof market_type === "string") {
    // empty string guard -> []
    if (market_type.trim() === "") return [];
    return market_type
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => Number(s))
      .filter((n) => !Number.isNaN(n));
  }

  if (typeof market_type === "number") {
    return [market_type];
  }

  const coerced = Number(market_type);
  return Number.isNaN(coerced) ? [] : [coerced];
}
router.post("/", async (req, res) => {
  
  let master_id = req.user._id;

  let frm = req.body.frm;
  if (frm != "") {
    const date = moment(frm);
    frm = date.format("YYYY-MM-DD");
  } else {
    frm = moment().format("YYYY-MM-DD");
  }

  let til = req.body.til;
  if (til != "") {
    const date = moment(til);
    til = date.format("YYYY-MM-DD");
  } else {
    til = moment().format("YYYY-MM-DD");
  }

  let startDate = frm + " 00:00:00";
  let endDate = til + " 23:59:59";

  let Title = "Cricket";
  let game_type = req.body.game_type;
  let market_type = req.body.market_type;
  if (game_type == 1) {
    if (market_type == 2) {
      Title = "Cricket / Bookmaker";
    }
    if (market_type == 3) {
      Title = "Cricket / Fancy";
    }
    if (market_type == 8) {
      Title = "Cricket / EvenOdd";
    }
  } else if (game_type == 2) {
    Title = "Soccer";
  } else if (game_type == 3) {
    Title = "Tennis";
  } else if (game_type == 4) {
    Title = "Horse Race";
  } else if (game_type == 5) {
    Title = "Greyhound";
  } else if (game_type == 6) {
    Title = "World Casino";
  } else if (game_type == 7) {
    Title = "Teenpatti Casino";
  } else if (game_type == 8) {
    Title = "World Casino";
  } else if (game_type == 9) {
    Title = "Betfair Games";
  }

  if (game_type == 1 && market_type == 1) {
    market_type = "1,4,5,6";
  } else if (game_type == 2 && market_type == 1) {
    market_type = "1,6";
  } else if (game_type == 9) {
    market_type = "33,34,35,36,37,38,39,40,41";
  } else if (game_type == 7) {
    market_type =
      "9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,25,26,27,28,29,30,31,32,42,43,44,45";
  }

  const userCheck = await Punter.findOne(
    { _id: master_id },
    "sponser_id user_role sponsor uname"
  ).lean();
  const uname = userCheck?.uname;
  const sponser_id = userCheck?.sponser_id;

  // Build MongoDB aggregation pipeline to replicate the SQL UNION logic
  // $qlPLNew ="SELECT user_id,SUM(bettor_d) as winAmount,uname,user_role,'downline' as utype FROM `bz_bt_punter_trans_details` trans inner join bz_bt_punter p on (p.sno=trans.user_id) where p.sponser_id='$master_id' and trans.`type`=1 and trans.created_date BETWEEN '$frm' and '$til' and trans.game_type='$game_type' and trans.market_type IN($market_type) group by user_id
  // UNION
  // SELECT user_id,SUM(amount)*-1 as winAmount,uname,user_role,'current' as utype FROM `bz_bt_punter_trans_details` trans inner join bz_bt_punter p on (p.sno=trans.user_id) where p.sno='$master_id' and trans.`type`=1 and trans.created_date BETWEEN '$frm' and '$til' and trans.game_type='$game_type' and trans.market_type IN($market_type)
  // UNION
  // SELECT user_id,SUM(bettor_d)*-1 as winAmount,'Book' as uname,user_role,'upline' as utype FROM `bz_bt_punter_trans_details` trans inner join bz_bt_punter p on (p.sno=trans.user_id) where p.sno='$master_id' and trans.`type`=1 and trans.created_date BETWEEN '$frm' and '$til' and game_type='$game_type' and trans.market_type IN($market_type)";


  const marketTypes = toNumberArray(market_type);

  // 1. Downline
  const downlinePipeline = [
    {
      $match: {
        type: 1,
        created_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        game_type: Number(game_type),
        market_type: { $in: marketTypes },
      },
    },
    {
      $lookup: {
        from: "bz_bt_punter",
        localField: "user_id",
        foreignField: "_id",
        as: "punter",
      },
    },
    { $unwind: "$punter" },
    { $match: { "punter.sponser_id": master_id } },
    {
      $group: {
        _id: "$user_id",
        winAmount: { $sum: "$bettor_d" },
        uname: { $first: "$punter.uname" },
        user_role: { $first: "$punter.user_role" },
      },
    },
    {
      $project: {
        user_id: "$_id",
        winAmount: 1,
        uname: 1,
        user_role: 1,
        utype: { $literal: "downline" },
      },
    },
  ];

  // 2. Current
  const currentPipeline = [
    // Match transaction conditions
    {
      $match: {
        type: 1,
        created_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        game_type: game_type,
        market_type: { $in: marketTypes },
      },
    },

    // JOIN punter collection
    {
      $lookup: {
        from: "bz_bt_punter",
        localField: "user_id",
        foreignField: "_id",
        as: "punter",
      },
    },

    // Inner join
    { $unwind: "$punter" },

    // Filter p.sno = master_id
    {
      $match: {
        "punter._id": master_id,
      },
    },

    // Group
    {
      $group: {
        _id: "$user_id",
        winAmount: { $sum: { $multiply: ["$amount", -1] } },
        uname: { $first: "$punter.uname" },
        user_role: { $first: "$punter.user_role" },
      },
    },

    // Format output
    {
      $project: {
        _id: 0,
        user_id: "$_id",
        winAmount: 1,
        uname: 1,
        user_role: 1,
        utype: { $literal: "current" },
      },
    },
  ];

  // 3. Upline
  const uplinePipeline = [
    // Match transaction conditions
    {
      $match: {
        type: 1,
        created_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        game_type: game_type,
        market_type: { $in: marketTypes },
      },
    },

    // JOIN with punter collection
    {
      $lookup: {
        from: "bz_bt_punter",
        localField: "user_id",
        foreignField: "_id",
        as: "punter",
      },
    },

    // Inner join
    { $unwind: "$punter" },

    // Filter p.sno = master_id
    {
      $match: {
        "punter._id": master_id,
      },
    },

    // Group data
    {
      $group: {
        _id: "$user_id",
        winAmount: { $sum: { $multiply: ["$bettor_d", -1] } },
        user_role: { $first: "$punter.user_role" },
      },
    },

    // Final output format
    {
      $project: {
        _id: 0,
        user_id: "$_id",
        winAmount: 1,
        uname: { $literal: "Book" },
        user_role: 1,
        utype: { $literal: "upline" },
      },
    },
  ];
    const downlineRs = await PunterTransDetails.aggregate(downlinePipeline);
    const currentRs = await PunterTransDetails.aggregate(currentPipeline);
    const uplineRs = await PunterTransDetails.aggregate(uplinePipeline);
  

  const arrPLNew = [...downlineRs, ...currentRs, ...uplineRs];
  const plus_array = [];
  const minus_array = [];
  let plusTotal = 0;
  let minusTotal = 0;

  for (const objPLNew of arrPLNew) {
    let winAmount = objPLNew.winAmount;
    let utype = objPLNew.utype;
    let encUser_id = objPLNew.user_id;

    if (utype === "upline") {
      objPLNew.user_id = sponser_id;
      encUser_id = sponser_id;
    }

    if (winAmount >= 0) {
      plusTotal += winAmount;
      objPLNew.winAmount = Number(winAmount);
      objPLNew.encUser_id = encUser_id;
      plus_array.push(objPLNew);
    } else {
      minusTotal += winAmount;
      objPLNew.encUser_id = encUser_id;
      objPLNew.winAmount = Number(winAmount);
      minus_array.push(objPLNew);
    }
  }

  const return_array = {
    plus: plus_array,
    minus: minus_array,
    Title,
    plusTotal: Number(plusTotal).toLocaleString(),
    minusTotal: Number(minusTotal).toLocaleString(),
  };

  return res.json(return_array);
});

module.exports = router;
