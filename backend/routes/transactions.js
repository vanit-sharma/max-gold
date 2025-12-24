const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const auth = require("../middleware/agentAuth");
const moment = require("moment-timezone");
const Punter = require("../models/Punter");
const PunterTransDetails = require("../models/PunterTransDetails");
const BzBtPunterTransSummary = require("../models/BzBtPunterTransSummary");

router.use(auth);

// POST /transactions/pl-details-new
router.post("/pl-details-new", async (req, res) => {
  //try {
  const { user_id, frm, til } = req.body;
  let errors = {};
  if (!user_id) {
    errors.user_id = "user_id is required";
    return res.json({ R: false, errors });
  }

  let fromDate = frm ? new Date(frm) : new Date();
  let toDate = til ? new Date(til) : new Date();

  // Find user
  const punter = await Punter.findOne({ sno: user_id }).lean();
  if (!punter) {
    return res.json({ R: false, errors: { user_id: "User not found" } });
  }

  const uname = punter.uname;
  const user_role = punter.user_role;
  let sqlListUser;

  if (user_role === 8) {
    sqlListUser = {
      $and: [
        { user_id },
        { created_date: { $gte: fromDate, $lte: toDate } },
        { payment_type: { $in: [0, 1, 2] } },
        { type: { $in: [1, 2, 3] } },
      ],
    };
  } else {
    sqlListUser = {
      $and: [
        { user_id },
        { created_date: { $gte: fromDate, $lte: toDate } },
        { payment_type: 0 },
        { type: { $in: [1, 2, 3] } },
      ],
    };
  }

  let lastDate = new Date(fromDate);
  lastDate.setDate(lastDate.getDate() - 1);
  const lastDateFrom = new Date(lastDate.setHours(0, 0, 0, 0));
  const lastDateTo = new Date(lastDate.setHours(23, 59, 59, 999));

  let after_balanceLast = 0;
  if (user_role === 8) {
    const lastTrans = await PunterTransDetails.findOne({
      user_id,
      created_date: { $lt: fromDate },
    })
      .sort({ id: -1 })
      .lean();
    after_balanceLast = lastTrans ? lastTrans.after_balance : 0;
  } else {
    const agg = await PunterTransDetails.aggregate([
      { $match: { user_id, created_date: { $lt: fromDate }, payment_type: 0 } },
      { $group: { _id: null, afterBalance: { $sum: "$amount" } } },
    ]);
    after_balanceLast = agg.length ? agg[0].afterBalance : 0;
  }

  // Get transactions
  const transactions = await PunterTransDetails.find(sqlListUser)
    .sort({ created_date: 1 })
    .lean();

  let return_array = [];
  let counter = 0;

  if (transactions.length > 0) {
    for (const tx of transactions) {
      let {
        payment_type,
        game_type,
        market_type,
        summary_id,
        reference_id,
        type,
        id: record_id,
        tid,
        remark,
        cat_mid,
        evt_id,
        amount,
        created_date,
        before_balance,
        after_balance,
      } = tx;

      let event_name = "";
      // Event name logic
      if (type === 0 || type === 3) {
        event_name = remark;
      } else {
        if (payment_type === 0) {
          if (game_type === 2 && market_type === 6) {
            event_name = remark;
          } else {
            event_name = remark;
          }
        } else {
          event_name = tx.evt_evt || remark;
        }
      }

      if (counter === 0) {
        let data_array1 = {
          evt_evt: "Opening Balance",
          is_dummy: 1,
          amount: 0,
          tid: 0,
          user_role,
          created_date: new Date(created_date),
          created_date_time: "00:00:00",
          created_date_full: new Date(created_date) + " 00:00:00",
          created_date_ampm: "am",
          after_balance:
            user_role === 8
              ? Number(after_balanceLast)
              : Number(after_balanceLast * -1),
        };
        return_array.push(data_array1);
      }

      let nAmount = user_role === 8 ? amount : amount * -1;
      let afterBal =
        user_role === 8
          ? after_balanceLast + amount
          : (after_balanceLast + amount) * -1;

      let data_array = {
        amount: Number(nAmount),
        before_balance: Number(before_balance),
        after_balance: Number(afterBal),
        evt_evt: event_name,
        created_date: new Date(created_date),
        created_date_time: new Date(created_date).toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        created_date_full:
          new Date(created_date) +
          " " +
          new Date(created_date).toLocaleTimeString("en-US"),
        created_date_ampm: new Date(created_date)
          .toLocaleTimeString("en-US")
          .split(" ")[1]
          .toLowerCase(),
        cat_mid,
        evt_id,
        summary_id,
        type,
        record_id,
        game_type,
        market_type,
        user_role,
        tid,
        user_id,
      };

      const agg = await PunterTransDetails.aggregate([
        {
          $match: {
            user_id,
            cat_mid,
            game_type,
            market_type,
            reference_id,
            created_date: { $gte: fromDate, $lte: toDate },
          },
        },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      data_array.Testamount = agg.length ? Number(agg[0].amount) : "0";

      return_array.push(data_array);
      after_balanceLast += amount;
      counter++;
    }
  } else {
    let after_balance = after_balanceLast;
    let data_array1 = {
      evt_evt: "Opening Balance",
      amount: 0,
      is_dummy: 1,
      tid: 0,
      user_role,
      created_date: new Date(),
      created_date_time: "00:00:00",
      created_date_full: new Date() + " 00:00:00",
      created_date_ampm: "am",
      after_balance:
        user_role === 8 ? Number(after_balance) : Number(after_balance * -1),
    };
    return_array.push(data_array1);
  }

  res.json({ data: return_array, uname });
  // } catch (err) {
  //     res.status(500).json({ R: false, errors: { server: "Internal error" } });
  // }
});

// POST /transactions/book-details-by-date


// POST /transactions/pl-by-type
router.post("/pl-by-type", async (req, res) => {
  //  try {
  const user_id = req.body?.user_id;
  const master_id = user_id; // this is what it is will be changed if required!
  if (!master_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  let frm = req.body.frm;
  let til = req.body.til;
  const tz = "Europe/London";

  let fromDate, toDate;
  if (!frm) {
    return res.status(400).json({ error: "Invalid date" });
  }
  if (!til) {
    return res.status(400).json({ error: "Invalid date" });
  }

  fromDate = moment
    .tz(frm.split(" ")[0], "MM/DD/YYYY", tz)
    .startOf("day")
    .toDate();
  toDate = moment
    .tz(til.split(" ")[0], "MM/DD/YYYY", tz)
    .add(1, "day")
    .startOf("day")
    .toDate();

  // Fetch user info
  const userCheck = await Punter.findOne({ _id: master_id }).lean();
  if (!userCheck) return res.status(404).json({ error: "User not found" });
  const uname = userCheck.uname;
  const sponser_id = userCheck.sponser_id;
  const user_role = userCheck.user_role;

  // Fetch login user info
  const loginUser = await Punter.findOne({ _id: req.user_id }).lean();
  //   const loginUser = await Punter.findOne({
  //     _id: new ObjectId("68ac544444bf08d635ec4629"),
  //  }).lean();
  if (!loginUser)
    return res.status(404).json({ error: "Login user not found" });
  const sponser_id_loginUser = loginUser.sponser_id;

  let matchQuery = {};
  let groupField = {};
  let amountField = "";
  let userMatch = {};
  let results = [];

  // Determine user type: login, upline, downline
  if (user_id.toString() == master_id.toString()) {
    console.log("Logged in user");
    // Login user
    results = await PunterTransDetails.aggregate([
      // WHERE user_id = $master_id AND d.type = 1 AND created_date BETWEEN $frm AND $til
      {
        $match: {
          user_id: new ObjectId(master_id),
          type: 1,
          created_date: { $gte: fromDate, $lt: toDate },
          game_type: { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        },
      },

      // INNER JOIN bz_bt_punter p ON d.user_id = p._id
      {
        $lookup: {
          from: "bz_bt_punter",
          localField: "user_id",
          foreignField: "_id",
          as: "punter",
        },
      },
      { $unwind: "$punter" },

      {
        $addFields: {
          normalized_market_type: {
            $cond: [
              { $eq: ["$game_type", 1] },
              {
                // game_type = 1: 4/5/6 -> 1, else keep original market_type
                $cond: [
                  { $in: ["$market_type", [4, 5, 6]] },
                  1,
                  "$market_type",
                ],
              },
              1, // game_type in (2,3,4,5,7,8,9): force to 1
            ],
          },
        },
      },

      // SELECT sum(amount)*-1 AS win_amount, market_type, user_id, game_type, uname GROUP BY market_type, game_type
      {
        $group: {
          _id: {
            market_type: "$normalized_market_type",
            game_type: "$game_type",
            user_id: "$user_id",
            uname: "$punter.uname",
          },
          win_amount: { $sum: { $multiply: ["$amount", -1] } },
        },
      },

      // Map market_name like the SQL CASE expression
      {
        $addFields: {
          market_name: {
            $switch: {
              branches: [
                // When game_type = 1, name depends on (normalized) market_type
                {
                  case: { $eq: ["$_id.game_type", 1] },
                  then: {
                    $switch: {
                      branches: [
                        {
                          case: { $in: ["$_id.market_type", [1, 2]] },
                          then: "Cricket",
                        }, // 1 and 2 -> Cricket
                        {
                          case: { $eq: ["$_id.market_type", 3] },
                          then: "Fancy",
                        },
                        {
                          case: { $eq: ["$_id.market_type", 5] },
                          then: "Tie",
                        },
                        {
                          case: { $eq: ["$_id.market_type", 6] },
                          then: "Figure",
                        },
                        {
                          case: { $eq: ["$_id.market_type", 8] },
                          then: "EvenOdd",
                        },
                      ],
                      default: "",
                    },
                  },
                },
                // game_type != 1: fixed names by game_type
                { case: { $eq: ["$_id.game_type", 2] }, then: "Soccer" },
                { case: { $eq: ["$_id.game_type", 3] }, then: "Tennis" },
                { case: { $eq: ["$_id.game_type", 4] }, then: "Horse Race" },
                { case: { $eq: ["$_id.game_type", 5] }, then: "Greyhound" },
                {
                  case: { $eq: ["$_id.game_type", 6] },
                  then: "World Casino",
                },
                {
                  case: { $eq: ["$_id.game_type", 7] },
                  then: "Teenpatti Casino",
                },
                { case: { $eq: ["$_id.game_type", 8] }, then: "Star Casino" },
                {
                  case: { $eq: ["$_id.game_type", 9] },
                  then: "Betfair Games",
                },
              ],
              default: "",
            },
          },
        },
      },

      // Final selection of fields
      {
        $project: {
          _id: 0,
          win_amount: 1,
          market_type: "$_id.market_type",
          user_id: "$_id.user_id",
          game_type: "$_id.game_type",
          uname: "$_id.uname",
          market_name: 1,
        },
      },
    ]);
  } else if (user_id.toString() == sponser_id_loginUser.toString()) {
    //upline user
    console.log("Upline user");
    results = await PunterTransDetails.aggregate([
      // WHERE d.user_id = $master_id AND d.type=1 AND created_date BETWEEN $frm AND $til
      {
        $match: {
          user_id: new ObjectId(master_id),
          type: 1,
          created_date: { $gte: fromDate, $lt: toDate },
          game_type: { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        },
      },

      // JOIN bz_bt_punter p ON d.user_id = p._id
      {
        $lookup: {
          from: "bz_bt_punter",
          localField: "user_id",
          foreignField: "_id",
          as: "punter",
        },
      },
      { $unwind: "$punter" },

      // market_type to apply:
      //  - For game_type = 1: market_type 4/5/6 => 1; else keep original
      //  - For game_type in (2,3,4,5,7,8,9): force market_type = 1
      //  - For game_type = 6: keep original (per SQL first SELECT's ELSE branch)
      {
        $addFields: {
          normalized_market_type: {
            $cond: [
              { $eq: ["$game_type", 1] },
              {
                $cond: [
                  { $in: ["$market_type", [4, 5, 6]] },
                  1,
                  "$market_type",
                ],
              },
              {
                $cond: [
                  { $in: ["$game_type", [2, 3, 4, 5, 7, 8, 9]] },
                  1,
                  "$market_type", // covers game_type = 6
                ],
              },
            ],
          },
        },
      },

      // First level group (like inside the subquery before outer GROUP BY):
      // SELECT sum(bettor_d)*-1 AS win_amount, normalized market_type, user_id, game_type, uname
      {
        $group: {
          _id: {
            market_type: "$normalized_market_type",
            game_type: "$game_type",
            user_id: "$user_id",
            uname: "$punter.uname",
          },
          win_amount: { $sum: { $multiply: ["$bettor_d", -1] } },
        },
      },

      // Outer GROUP BY market_type, game_type
      {
        $group: {
          _id: {
            market_type: "$_id.market_type",
            game_type: "$_id.game_type",
          },
          win_amount: { $sum: "$win_amount" },
          user_id: { $first: "$_id.user_id" },
          uname: { $first: "$_id.uname" },
        },
      },

      // Map market_name per CASE
      {
        $addFields: {
          market_name: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$_id.game_type", 1] },
                  then: {
                    $switch: {
                      branches: [
                        {
                          case: { $in: ["$_id.market_type", [1, 2, 4]] },
                          then: "Cricket",
                        },
                        {
                          case: { $eq: ["$_id.market_type", 3] },
                          then: "Fancy",
                        },
                        { case: { $eq: ["$_id.market_type", 5] }, then: "Tie" },
                        {
                          case: { $eq: ["$_id.market_type", 6] },
                          then: "Figure",
                        },
                        {
                          case: { $eq: ["$_id.market_type", 8] },
                          then: "EvenOdd",
                        },
                      ],
                      default: "",
                    },
                  },
                },
                { case: { $eq: ["$_id.game_type", 2] }, then: "Soccer" },
                { case: { $eq: ["$_id.game_type", 3] }, then: "Tennis" },
                { case: { $eq: ["$_id.game_type", 4] }, then: "Horse Race" },
                { case: { $eq: ["$_id.game_type", 5] }, then: "Greyhound" },
                { case: { $eq: ["$_id.game_type", 6] }, then: "World Casino" },
                {
                  case: { $eq: ["$_id.game_type", 7] },
                  then: "Teenpatti Casino",
                },
                { case: { $eq: ["$_id.game_type", 8] }, then: "Star Casino" },
                { case: { $eq: ["$_id.game_type", 9] }, then: "Betfair Games" },
              ],
              default: "",
            },
          },
        },
      },

      // Final selection of the fields
      {
        $project: {
          _id: 0,
          win_amount: 1,
          market_type: "$_id.market_type",
          user_id: 1,
          game_type: "$_id.game_type",
          uname: 1,
          market_name: 1,
        },
      },
    ]);
  } else {
    // Downline user
    console.log("Downline user");
    results = await PunterTransDetails.aggregate([
      // WHERE d.user_id = $user_id AND p.sponser_id = $master_id
      // AND d.type = 1 AND created_date BETWEEN $frm AND $til
      // AND game_type IN (1..9)
      {
        $match: {
          user_id: new ObjectId(user_id),
          type: 1,
          created_date: { $gte: fromDate, $lt: toDate },
          game_type: { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        },
      },

      {
        $lookup: {
          from: "bz_bt_punter",
          localField: "user_id",
          foreignField: "_id", //
          as: "punter",
        },
      },
      { $unwind: "$punter" },
      { $match: { "punter.sponser_id": master_id } },

      // market_type to apply:
      //  - For game_type = 1: market_type 4/5/6 -> 1, otherwise keep original.
      //  - For game_type = 6: keep original (per first SELECT).
      //  - For game_type in (2,3,4,5,7,8,9): force market_type = 1 (per second SELECT).
      {
        $addFields: {
          normalized_market_type: {
            $cond: [
              { $eq: ["$game_type", 1] },
              {
                $cond: [
                  { $in: ["$market_type", [4, 5, 6]] },
                  1,
                  "$market_type",
                ],
              },
              {
                $cond: [
                  { $in: ["$game_type", [2, 3, 4, 5, 7, 8, 9]] },
                  1,
                  "$market_type", // covers game_type = 6 (keep original)
                ],
              },
            ],
          },
        },
      },

      // Inner GROUP of subquery (sum(bettor_d) as win_amount, grouped by gtype/mtype/user/uname)
      {
        $group: {
          _id: {
            market_type: "$normalized_market_type",
            game_type: "$game_type",
            user_id: "$user_id",
            uname: "$punter.uname",
          },
          win_amount: { $sum: "$bettor_d" },
        },
      },

      // Outer GROUP BY market_type, game_type
      {
        $group: {
          _id: {
            market_type: "$_id.market_type",
            game_type: "$_id.game_type",
          },
          win_amount: { $sum: "$win_amount" },
          user_id: { $first: "$_id.user_id" },
          uname: { $first: "$_id.uname" },
        },
      },

      // CASE -> market_name
      {
        $addFields: {
          market_name: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$_id.game_type", 1] },
                  then: {
                    $switch: {
                      branches: [
                        {
                          case: { $in: ["$_id.market_type", [1, 2, 4]] },
                          then: "Cricket",
                        },
                        {
                          case: { $eq: ["$_id.market_type", 3] },
                          then: "Fancy",
                        },
                        { case: { $eq: ["$_id.market_type", 5] }, then: "Tie" },
                        {
                          case: { $eq: ["$_id.market_type", 6] },
                          then: "Figure",
                        },
                        {
                          case: { $eq: ["$_id.market_type", 8] },
                          then: "EvenOdd",
                        },
                      ],
                      default: "",
                    },
                  },
                },
                { case: { $eq: ["$_id.game_type", 2] }, then: "Soccer" },
                { case: { $eq: ["$_id.game_type", 3] }, then: "Tennis" },
                { case: { $eq: ["$_id.game_type", 4] }, then: "Horse Race" },
                { case: { $eq: ["$_id.game_type", 5] }, then: "Greyhound" },
                { case: { $eq: ["$_id.game_type", 6] }, then: "World Casino" },
                {
                  case: { $eq: ["$_id.game_type", 7] },
                  then: "Teenpatti Casino",
                },
                { case: { $eq: ["$_id.game_type", 8] }, then: "Star Casino" },
                { case: { $eq: ["$_id.game_type", 9] }, then: "Betfair Games" },
              ],
              default: "",
            },
          },
        },
      },

      // Final selection of fields
      {
        $project: {
          _id: 0,
          win_amount: 1,
          market_type: "$_id.market_type",
          user_id: 1,
          game_type: "$_id.game_type",
          uname: 1,
          market_name: 1,
        },
      },
    ]);
  }

  const return_array2 = results.map((arr) => {
    let market_name = arr.market_name;
    if (arr.game_type === 1 && arr.market_type === 2) {
      market_name = market_name + "/Bookmaker";
    }
    return {
      game_type: arr.game_type,
      market_type: arr.market_type,
      market_name,
      username: arr.uname,
      amount: Math.round(arr.win_amount),
      user_id: arr.user_id,
    };
  });

  res.json(return_array2);
  //   } catch (err) {
  //     res.status(500).json({ error: "Internal error" });
  //   }
});

// POST /transactions/book-details-by-date
router.post("/book-details-summary", async (req, res) => {
  try {
    // hardcoded params ignoring req.body for now
    const userId = new mongoose.Types.ObjectId("68ac589644bf08d635ec4755");
    const from = new Date("2025-08-01T00:00:00Z");
    const to   = new Date("2025-09-24T00:00:00Z");

    // match
    const match = {
      user_id: userId,
      created_date: { $gte: from, $lt: to },
    };

    // group
    const groupStage = {
      _id: "$user_id",

      cricket_amount:          { $sum: { $ifNull: ["$cricket_amount", 0] } },
      cricket_bookmaker:       { $sum: { $ifNull: ["$cricket_bookmaker", 0] } },
      cricket_fancy_amount:    { $sum: { $ifNull: ["$cricket_fancy_amount", 0] } },
      cricket_bf_fancy_amount: { $sum: { $ifNull: ["$cricket_bf_fancy_amount", 0] } },
      cricket_evenodd:         { $sum: { $ifNull: ["$cricket_evenodd", 0] } },
      cricket_figure:          { $sum: { $ifNull: ["$cricket_figure", 0] } },
      cricket_toss:            { $sum: { $ifNull: ["$cricket_toss", 0] } },
      cricket_tie:             { $sum: { $ifNull: ["$cricket_tie", 0] } },

      football_amount:         { $sum: { $ifNull: ["$football_amount", 0] } },
      football_set_amount:     { $sum: { $ifNull: ["$football_set_amount", 0] } },
      tennis_amount:           { $sum: { $ifNull: ["$tennis_amount", 0] } },
      horserace_amount:        { $sum: { $ifNull: ["$horserace_amount", 0] } },
      grayhound_amount:        { $sum: { $ifNull: ["$grayhound_amount", 0] } },

      betfairgames_amount:     { $sum: { $ifNull: ["$betfairgames_amount", 0] } },
      teenpati_studio_amount:  { $sum: { $ifNull: ["$teenpati_studio_amount", 0] } },
      galaxy_casino_amount:    { $sum: { $ifNull: ["$galaxy_casino_amount", 0] } },
      world_casino_amount:     { $sum: { $ifNull: ["$world_casino_amount", 0] } },
    };

    // grand total
    const addFieldsStage = {
      grandTotal: {
        $add: [
          "$cricket_amount",
          "$cricket_bookmaker",
          "$cricket_fancy_amount",
          "$cricket_bf_fancy_amount",
          "$cricket_evenodd",
          "$cricket_figure",
          "$cricket_toss",
          "$cricket_tie",
          "$football_amount",
          "$football_set_amount",
          "$tennis_amount",
          "$horserace_amount",
          "$grayhound_amount",
          "$betfairgames_amount",
          "$teenpati_studio_amount",
          "$galaxy_casino_amount",
          "$world_casino_amount",
        ],
      },
    };

    // projection
    const projectStage = {
      _id: 0,
      user_id: "$_id",
      grandTotal: 1,

      cricket_amount: 1,
      cricket_bookmaker: 1,
      cricket_fancy_amount: 1,
      cricket_bf_fancy_amount: 1,
      cricket_evenodd: 1,
      cricket_figure: 1,
      cricket_toss: 1,
      cricket_tie: 1,

      football_amount: 1,
      football_set_amount: 1,
      tennis_amount: 1,
      horserace_amount: 1,
      grayhound_amount: 1,

      betfairgames_amount: 1,
      teenpati_studio_amount: 1,
      galaxy_casino_amount: 1,
      world_casino_amount: 1,
    };

    const pipeline = [
      { $match: match },
      { $group: groupStage },
      { $addFields: addFieldsStage },
      { $project: projectStage },
    ];

    // run aggregation
    const [doc] = await BzBtPunterTransSummary.aggregate(pipeline).exec();

    // no docs matched -> return zeros
    if (!doc) {
      return res.json({
        user_id: String(userId),
        from,
        to,
        grandTotal: 0,

        cricket_amount: 0,
        cricket_bookmaker: 0,
        cricket_fancy_amount: 0,
        cricket_bf_fancy_amount: 0,
        cricket_evenodd: 0,
        cricket_figure: 0,
        cricket_toss: 0,
        cricket_tie: 0,

        football_amount: 0,
        football_set_amount: 0,
        tennis_amount: 0,
        horserace_amount: 0,
        grayhound_amount: 0,

        betfairgames_amount: 0,
        teenpati_studio_amount: 0,
        galaxy_casino_amount: 0,
        world_casino_amount: 0,
      });
    }

    // success
    return res.json({
      user_id: String(doc.user_id),
      from,
      to,
      ...doc,
    });
  } catch (err) {
    console.error("book-details-summary error:", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});


module.exports = router;
