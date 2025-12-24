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

function scaleValues(obj, multiplier) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = Number(value) * Number(multiplier);
  }

  return result;
}

router.post("/book-details-by-date", async (req, res) => {
  //try {
  const masterId = req.user._id; // this is what it is will be changed if required!
  if (!masterId) {
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

  const user = await Punter.findOne({ _id: masterId }).lean();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  fromDate = moment
    .tz(frm.split(" ")[0], "YYYY-MM-DD", tz)
    .startOf("day")
    .toDate();
  toDate = moment
    .tz(til.split(" ")[0], "YYYY-MM-DD", tz)
    //.add(1, "day")
    //.startOf("day")
    .endOf("day")
    .toDate();

  if (!masterId) {
    return res.status(400).json({ error: "Invalid masterId" });
  }

  // current user

  const match = {
    user_id: masterId,
    created_date: { $gte: fromDate, $lt: toDate },
  };

  // group
  const groupStage = {
    _id: "$user_id",

    cricket_amount: { $sum: { $ifNull: ["$cricket_amount", 0] } },
    cricket_bookmaker: { $sum: { $ifNull: ["$cricket_bookmaker", 0] } },
    cricket_fancy_amount: { $sum: { $ifNull: ["$cricket_fancy_amount", 0] } },
    cricket_bf_fancy_amount: {
      $sum: { $ifNull: ["$cricket_bf_fancy_amount", 0] },
    },
    cricket_evenodd: { $sum: { $ifNull: ["$cricket_evenodd", 0] } },
    cricket_figure: { $sum: { $ifNull: ["$cricket_figure", 0] } },
    cricket_toss: { $sum: { $ifNull: ["$cricket_toss", 0] } },
    cricket_tie: { $sum: { $ifNull: ["$cricket_tie", 0] } },

    football_amount: { $sum: { $ifNull: ["$football_amount", 0] } },
    football_set_amount: { $sum: { $ifNull: ["$football_set_amount", 0] } },
    tennis_amount: { $sum: { $ifNull: ["$tennis_amount", 0] } },
    horserace_amount: { $sum: { $ifNull: ["$horserace_amount", 0] } },
    grayhound_amount: { $sum: { $ifNull: ["$grayhound_amount", 0] } },

    betfairgames_amount: { $sum: { $ifNull: ["$betfairgames_amount", 0] } },
    teenpati_studio_amount: {
      $sum: { $ifNull: ["$teenpati_studio_amount", 0] },
    },
    galaxy_casino_amount: { $sum: { $ifNull: ["$galaxy_casino_amount", 0] } },
    world_casino_amount: { $sum: { $ifNull: ["$world_casino_amount", 0] } },
    upline_amount: { $sum: "$upline_amount" },
  };

  // grand total
  const addFieldsStage = {
    winAmount: {
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
    uname: { $literal: user.uname },
    user_type: { $literal: user.uname },
    winAmount: { $multiply: ["$winAmount", -1] },
    upline_amount: 1,
  };

  const pipeline = [
    { $match: match },
    { $group: groupStage },
    { $addFields: addFieldsStage },
    { $project: projectStage },
  ];

  // run aggregation
  const current = await BzBtPunterTransSummary.aggregate(pipeline).exec();
  const uplineAmount = current[0]?.upline_amount
    ? current[0].upline_amount * -1
    : 0;

  // current user
  //sum of all sports
  // upline
  //sum of all upline

  //downline
  //sum of all downline

  // downline - get all users whose sponser_id = masterId

  const downlineUsers = await Punter.find({ sponser_id: masterId });
  const downlineUserIds = downlineUsers.map((user) => user._id);

  // downline
  const downline = await BzBtPunterTransSummary.aggregate([
    {
      $match: {
        user_id: { $in: downlineUserIds },
        created_date: {
          $gte: fromDate,
          $lte: toDate,
        },
      },
    },
    {
      $group: {
        _id: "$user_id",
        uname: { $first: "$username" },
        winAmount: { $sum: "$upline_amount" },
      },
    },
    {
      $project: {
        _id: 0, // hide _id
        user_id: "$_id", // expose it as user_id
        uname: 1,
        winAmount: 1,
        user_type: { $literal: "downline" },
      },
    },
  ]);

  // upline - get all users whose sponser_id = masterId
  const uplineUser = await Punter.findOne({ _id: user.sponser_id });

  // const upline = await BzBtPunterTransSummary.aggregate([
  //   {
  //     $match: {
  //       user_id: uplineUser._id,
  //       created_date: {
  //         $gte: fromDate,
  //         $lte: toDate,
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$user_id",
  //       winAmount: { $sum: "$upline_amount" },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0, // hide _id
  //       user_id: user.sponser_id, // expose it as user_id
  //       uname: { $literal: "Upline User" },
  //       winAmount: 1,
  //       user_type: { $literal: "upline" },
  //     },
  //   },
  // ]);
  const upline = [
    {
      user_id: user.sponser_id,
      uname: "Book",
      winAmount: uplineAmount,
      user_type: "upline",
    },
  ];

  const data = [...current, ...downline, ...upline];

  let totalProfit = 0;
  let totalLoss = 0;
  const { profit_users, loss_users } = data.reduce(
    (acc, user) => {
      if (user.winAmount > 0) {
        acc.profit_users.push(user);
        totalProfit = totalProfit + Number(user.winAmount);
      } else {
        acc.loss_users.push(user);
        totalLoss = totalLoss + Number(user.winAmount);
      }
      return acc;
    },
    { profit_users: [], loss_users: [] }
  );

  return res.json({ profit_users, loss_users, totalProfit, totalLoss });

  //res.json(returnArray);
  //   } catch (err) {
  //     res.status(500).json({ error: "Internal error" });
  //   }
});

router.post("/pl-by-type", async function (req, res) {
  const master_id = req.user._id; // this is the user

  let frm = req.body.frm;
  let til = req.body.til;

  if (!frm) {
    return res.status(400).json({ error: "Invalid date" });
  }
  if (!til) {
    return res.status(400).json({ error: "Invalid date" });
  }

  const tz = "Europe/London";

  let from, to;

  from = moment.tz(frm.split(" ")[0], "YYYY-MM-DD", tz).startOf("day").toDate();
  to = moment.tz(til.split(" ")[0], "YYYY-MM-DD", tz).endOf("day").toDate();

  // 1. Update bettor_c from bz_bt_punter_sharing.child_percentage where parent_id=user_id and child_id=child_user_id

  await PunterTransDetails.aggregate([
    // 1) FILTER — same as SQL WHERE created_date BETWEEN ...
    {
      $match: {
        created_date: {
          $gte: from,
          $lte: to,
        },
      },
    },

    // 2) LOOKUP (JOIN) — with type conversion to avoid mismatch
    {
      $lookup: {
        from: "bz_bt_punter_sharing",
        let: {
          u: "$user_id",
          cu: "$child_user_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // Convert sharing.parent_id → ObjectId for comparison
                  {
                    $eq: [
                      {
                        $cond: [
                          { $eq: [{ $type: "$parent_id" }, "string"] },
                          { $toObjectId: "$parent_id" },
                          "$parent_id",
                        ],
                      },
                      "$$u",
                    ],
                  },

                  // Convert sharing.child_id → ObjectId for comparison
                  {
                    $eq: [
                      {
                        $cond: [
                          { $eq: [{ $type: "$child_id" }, "string"] },
                          { $toObjectId: "$child_id" },
                          "$child_id",
                        ],
                      },
                      "$$cu",
                    ],
                  },
                ],
              },
            },
          },
          { $project: { child_percentage: 1, _id: 0 } },
        ],
        as: "sharing",
      },
    },

    // 3) INNER JOIN behaviour → only if sharing exists
    { $unwind: "$sharing" },

    // 4) Update bettor_c
    {
      $set: {
        bettor_c: "$sharing.child_percentage",
      },
    },

    // 5) Remove temp field
    { $unset: "sharing" },

    // 6) WRITE BACK (like SQL UPDATE JOIN)
    {
      $merge: {
        into: "bz_bt_punter_trans_details",
        on: "_id",
        whenMatched: "merge",
        whenNotMatched: "discard",
      },
    },
  ]);

  // 2. Update bettor_d = win_amount where user_id == player_id

  await PunterTransDetails.updateMany(
    {
      user_id: { $exists: true },
      player_id: { $exists: true },
      $expr: { $eq: ["$user_id", "$player_id"] },
      created_date: { $gte: from, $lte: to },
    },
    [{ $set: { bettor_d: "$win_amount" } }]
  );

  // 3. Update bettor_d = ((100-bettor_c)*win_amount/100)-amount where user_id != player_id

  await PunterTransDetails.updateMany(
    {
      user_id: { $exists: true },
      player_id: { $exists: true },
      $expr: { $ne: ["$user_id", "$player_id"] },
      created_date: { $gte: from, $lte: to },
    },
    [
      {
        $set: {
          bettor_d: {
            $subtract: [
              {
                $divide: [
                  {
                    $multiply: [
                      {
                        $subtract: [
                          100,
                          {
                            $convert: {
                              input: "$bettor_c",
                              to: "double",
                              onError: 0,
                              onNull: 0,
                            },
                          },
                        ],
                      },
                      {
                        $convert: {
                          input: "$win_amount",
                          to: "double",
                          onError: 0,
                          onNull: 0,
                        },
                      },
                    ],
                  },
                  100,
                ],
              },
              {
                $convert: {
                  input: "$amount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            ],
          },
        },
      },
    ]
  );

  let user_id = new mongoose.Types.ObjectId(req.body.userId);

  // Fetch user details for user_id
  const userCheck = await Punter.findOne({ _id: user_id })
    .select("sponser_id user_role sponsor uname")
    .lean();
  let uname = userCheck.uname;
  let sponser_id = userCheck.sponser_id;
  let user_role = userCheck.user_role;
  let sponsor_uname = userCheck.sponsor;

  // Fetch details of logged in user
  const rsLoginUseer = await Punter.findOne({ _id: master_id })
    .select("sponser_id user_role sponsor uname")
    .lean();
  const sponser_id_loginUser = rsLoginUseer.sponser_id;

  let return_array = {};
  let return_array2 = [];

  // $frm = $frm." 00:00:00";
  // $til = $til." 23:59:59";

  let gTp1Mtp1 = {}; //Criket
  let gTp1Mtp2 = {}; //Bookmaker
  let gTp1Mtp3 = {}; //Session
  let gTp1Mtp4 = {}; //Toss - Should be merge with Cricket
  let gTp1Mtp5 = {}; //Tie  - Should be merge with Cricket
  let gTp1Mtp6 = {}; //Figure - Should be merge with Cricket

  let gTp2Mtp1 = {}; //Soccer
  let gTp3Mtp1 = {}; //Tennis
  let gTp4Mtp1 = {}; //Horse Race
  let gTp5Mtp1 = {}; //Greyhound
  let gTp6Mtp1 = {}; //World Casino

  let gTp7Mtp11 = {}; // TEENPATTI
  let gTp7Mtp11Arr = {};
  let gTp7Mtp22 = {}; // Betfair
  let gTp7Mtp22Arr = {};
  let gTp7Mtp33 = {}; // cricket
  let gTp7Mtp33Arr = {};
  let gTp7Mtp44 = {}; // cricket
  let gTp7Mtp55 = {};
  let gTScoccerArr = {}; //soccer

  let gTBetfairGameArr = {}; //soccer

  let mergerArray = {};
  let rspl;
  let grandTotal = 0;
  if (master_id != "") {
    if (user_id.toString() == master_id.toString()) {
      //login user
      /*
				$sqlPL = "SELECT sum(win_amount) win_amount,market_type,user_id,game_type,uname, (CASE WHEN game_type = 1 THEN CASE WHEN market_type = 1 THEN 'Cricket' WHEN market_type = 2 THEN 'Cricket' WHEN market_type = 3 THEN 'Fancy' WHEN market_type = 4 THEN 'Cricket' WHEN market_type = 5 THEN 'Tie' WHEN market_type = 6 THEN 'Figure' WHEN market_type = 8 THEN 'EvenOdd' ELSE '' END WHEN game_type = 2 THEN  'Soccer'  WHEN game_type = 3 THEN 'Tennis' WHEN game_type = 4 THEN 'Horse Race' WHEN game_type = 5 THEN 'Greyhound' WHEN game_type = 6 THEN 'World Casino' WHEN game_type = 7 THEN 'Teenpatti Casino' WHEN game_type = 8 THEN 'Star Casino' WHEN game_type = 9 THEN 'Betfair Games' ELSE '' END) as market_name from (SELECT sum(amount)*-1 as win_amount,CASE WHEN game_type=1 then
				CASE WHEN market_type =6 THEN 1 WHEN market_type= 5 THEN 1 WHEN market_type= 4 THEN 1
				ELSE market_type END ELSE market_type END market_type, user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id=$master_id and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(1,6) group by d.game_type,d.market_type
				UNION ALL
				SELECT sum(amount)*-1 as win_amount, 1 as market_type,
				user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id=$master_id and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(2,3,4,5,7,8,9) group by d.game_type ) as tt group by market_type, game_type";
*/

      rspl = await PunterTransDetails.aggregate([
        {
          $match: {
            user_id: master_id,
            type: 1,
            created_date: { $gte: from, $lte: to },
          },
        },

        {
          $addFields: {
            mt: {
              $cond: [
                { $eq: ["$game_type", 1] },
                {
                  $cond: [
                    { $in: ["$market_type", [4, 5, 6]] },
                    1,
                    "$market_type",
                  ],
                },
                1, // For game_type 2–9 always 1
              ],
            },
            key: {
              $concat: [
                { $toString: "$game_type" },
                "_",
                {
                  $toString: {
                    $cond: [
                      { $eq: ["$game_type", 1] },
                      {
                        $cond: [
                          { $in: ["$market_type", [4, 5, 6]] },
                          1,
                          "$market_type",
                        ],
                      },
                      1,
                    ],
                  },
                },
              ],
            },
          },
        },

        {
          $group: {
            _id: "$key",
            game_type: { $first: "$game_type" },
            market_type: { $first: "$mt" },
            win_amount: { $sum: { $multiply: ["$amount", -1] } },
            user_id: { $first: "$user_id" },
          },
        },

        {
          $addFields: {
            market_name: {
              $let: {
                vars: {
                  map: {
                    "1_1": "Cricket",
                    "1_2": "Cricket",
                    "1_3": "Fancy",
                    "1_4": "Cricket",
                    "1_5": "Tie",
                    "1_6": "Figure",
                    "1_8": "EvenOdd",

                    "2_1": "Soccer",
                    "3_1": "Tennis",
                    "4_1": "Horse Race",
                    "5_1": "Greyhound",
                    "6_1": "World Casino",
                    "7_1": "Teenpatti Casino",
                    "8_1": "Star Casino",
                    "9_1": "Betfair Games",
                  },
                },
                in: { $getField: { field: "$_id", input: "$$map" } },
              },
            },
          },
        },

        // 5) Final format
        {
          $project: {
            game_type: 1,
            market_type: 1,
            win_amount: 1,
            user_id: 1,
            market_name: 1,
            _id: 0,
          },
        },
      ]);
    } else if (user_id.toString() == sponser_id_loginUser.toString()) {
      //upline user

      /*
				$sqlPL = "SELECT sum(win_amount) win_amount,market_type,user_id,game_type,uname, (CASE WHEN game_type = 1 THEN CASE WHEN market_type = 1 THEN 'Cricket' WHEN market_type = 2 THEN 'Cricket' WHEN market_type = 3 THEN 'Fancy' WHEN market_type = 4 THEN 'Cricket' WHEN market_type = 5 THEN 'Tie' WHEN market_type = 6 THEN 'Figure' WHEN market_type = 8 THEN 'EvenOdd' ELSE '' END WHEN game_type = 2 THEN  'Soccer'  WHEN game_type = 3 THEN 'Tennis' WHEN game_type = 4 THEN 'Horse Race' WHEN game_type = 5 THEN 'Greyhound' WHEN game_type = 6 THEN 'World Casino' WHEN game_type = 7 THEN 'Teenpatti Casino' WHEN game_type = 8 THEN 'Star Casino' WHEN game_type = 9 THEN 'Betfair Games' ELSE '' END) as market_name from (SELECT sum(bettor_d)*-1 as win_amount,CASE WHEN game_type=1 then
				CASE WHEN market_type =6 THEN 1 WHEN market_type= 5 THEN 1 WHEN market_type= 4 THEN 1
				ELSE market_type END ELSE market_type END market_type, user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id=$master_id and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(1,6) group by d.game_type,d.market_type UNION ALL
				SELECT sum(bettor_d)*-1 as win_amount, 1 as market_type,
				user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id=$master_id and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(2,3,4,5,7,8,9) group by d.game_type ) as tt group by market_type, game_type";*/

      rspl = await PunterTransDetails.aggregate([
        {
          $match: {
            user_id: master_id,
            type: 1,
            created_date: { $gte: from, $lte: to },
          },
        },

        {
          $addFields: {
            final_market_type: {
              $cond: [
                { $eq: ["$game_type", 1] },
                {
                  $cond: [
                    { $in: ["$market_type", [4, 5, 6]] },
                    1,
                    "$market_type",
                  ],
                },
                1, // For all game_type in (2,3,4,5,7,8,9)
              ],
            },
          },
        },

        {
          $group: {
            _id: {
              game_type: "$game_type",
              market_type: "$final_market_type",
            },
            win_amount: { $sum: { $multiply: ["$bettor_d", -1] } },
            user_id: { $first: "$user_id" },
            uname: { $first: "$uname" },
          },
        },

        {
          $addFields: {
            market_name: {
              $let: {
                vars: {
                  map: {
                    "1_1": "Cricket",
                    "1_2": "Cricket",
                    "1_3": "Fancy",
                    "1_4": "Cricket",
                    "1_5": "Tie",
                    "1_6": "Figure",
                    "1_8": "EvenOdd",

                    "2_1": "Soccer",
                    "3_1": "Tennis",
                    "4_1": "Horse Race",
                    "5_1": "Greyhound",
                    "6_1": "World Casino",
                    "7_1": "Teenpatti Casino",
                    "8_1": "Star Casino",
                    "9_1": "Betfair Games",
                  },
                },
                in: {
                  $getField: {
                    field: {
                      $concat: [
                        { $toString: "$_id.game_type" },
                        "_",
                        { $toString: "$_id.market_type" },
                      ],
                    },
                    input: "$$map",
                  },
                },
              },
            },
          },
        },

        {
          $project: {
            win_amount: 1,
            market_type: "$_id.market_type",
            game_type: "$_id.game_type",
            user_id: 1,
            uname: 1,
            market_name: 1,
            _id: 0,
          },
        },
      ]);
    } //downline user
    else {
      /*
				$sqlPL = "SELECT sum(win_amount) win_amount,market_type,user_id,game_type,uname, (CASE WHEN game_type = 1 THEN CASE WHEN market_type = 1 THEN 'Cricket' WHEN market_type = 2 THEN 'Cricket' WHEN market_type = 3 THEN 'Fancy' WHEN market_type = 4 THEN 'Cricket' WHEN market_type = 5 THEN 'Tie' WHEN market_type = 6 THEN 'Figure' WHEN market_type = 8 THEN 'EvenOdd' ELSE '' END WHEN game_type = 2 THEN  'Soccer'  WHEN game_type = 3 THEN 'Tennis' WHEN game_type = 4 THEN 'Horse Race' WHEN game_type = 5 THEN 'Greyhound' WHEN game_type = 6 THEN 'World Casino' WHEN game_type = 7 THEN 'Teenpatti Casino' WHEN game_type = 8 THEN 'Star Casino' WHEN game_type = 9 THEN 'Betfair Games' ELSE '' END) as market_name from (SELECT sum(bettor_d) as win_amount,CASE WHEN game_type=1 then
				CASE WHEN market_type =6 THEN 1 WHEN market_type= 5 THEN 1 WHEN market_type= 4 THEN 1
				ELSE market_type END ELSE market_type END market_type, user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id=$user_id and p.sponser_id=$master_id and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(1,6) group by d.game_type,d.market_type UNION ALL
				SELECT sum(bettor_d) as win_amount, 1 as market_type,
				user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id='$user_id' and p.sponser_id=$master_id and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(2,3,4,5,7,8,9) group by d.game_type ) as tt group by market_type, game_type";*/

      const pipeline = [
        {
          $match: {
            user_id: user_id,
            type: 1,
            created_date: { $gte: from, $lte: to },
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

        {
          $match: {
            "punter.sponser_id": master_id,
          },
        },

        {
          $facet: {
            // inner SELECT #1 (game_type IN (1,6))
            q1: [
              { $match: { game_type: { $in: [1, 6] } } },

              // CASE WHEN game_type=1 THEN (CASE WHEN mt IN (4,5,6) THEN 1 ELSE mt END) ELSE market_type END
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
                      "$market_type", // when game_type != 1 (i.e., 6), keep market_type
                    ],
                  },
                },
              },

              // GROUP BY game_type, normalized_market_type  (this is inner SELECT group)
              {
                $group: {
                  _id: {
                    game_type: "$game_type",
                    market_type: "$normalized_market_type",
                  },
                  win_amount: { $sum: "$bettor_d" }, // sum(bettor_d) as win_amount
                  user_id: { $first: "$user_id" },
                  uname: { $first: "$punter.uname" },
                },
              },
            ],

            // inner SELECT #2 (game_type IN (2,3,4,5,7,8,9)), market_type forced to 1
            q2: [
              { $match: { game_type: { $in: [2, 3, 4, 5, 7, 8, 9] } } },

              // GROUP BY game_type (we'll set market_type = 1)
              {
                $group: {
                  _id: { game_type: "$game_type" },
                  win_amount: { $sum: "$bettor_d" },
                  // win_amount: { $sum: "$win_amount" },
                  user_id: { $first: "$user_id" },
                  uname: { $first: "$punter.uname" },
                  market_type: { $first: 1 }, // forced market_type = 1
                },
              },

              {
                $addFields: {
                  "_id.market_type": "$market_type",
                },
              },
            ],
          },
        },

        {
          $project: {
            combined: { $concatArrays: ["$q1", "$q2"] },
          },
        },
        { $unwind: "$combined" },
        { $replaceRoot: { newRoot: "$combined" } },

        {
          $group: {
            _id: {
              market_type: "$_id.market_type",
              game_type: "$_id.game_type",
            },
            win_amount: { $sum: "$win_amount" },
            user_id: { $first: "$user_id" },
            uname: { $first: "$uname" },
          },
        },

        {
          $addFields: {
            market_name: {
              $let: {
                vars: {
                  map: {
                    "1_1": "Cricket",
                    "1_2": "Cricket",
                    "1_3": "Fancy",
                    "1_4": "Cricket",
                    "1_5": "Tie",
                    "1_6": "Figure",
                    "1_8": "EvenOdd",

                    "2_1": "Soccer",
                    "3_1": "Tennis",
                    "4_1": "Horse Race",
                    "5_1": "Greyhound",
                    "6_1": "World Casino",
                    "7_1": "Teenpatti Casino",
                    "8_1": "Star Casino",
                    "9_1": "Betfair Games",
                  },
                },
                in: {
                  $ifNull: [
                    {
                      $getField: {
                        field: {
                          $concat: [
                            { $toString: "$_id.game_type" },
                            "_",
                            { $toString: "$_id.market_type" },
                          ],
                        },
                        input: "$$map",
                      },
                    },
                    "",
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            win_amount: 1,
            market_type: "$_id.market_type",
            game_type: "$_id.game_type",
            user_id: 1,
            uname: 1,
            market_name: 1,
            _id: 0,
          },
        },

        { $sort: { game_type: 1, market_type: 1 } },
      ];

      // Run the aggregation:
      rspl = await PunterTransDetails.aggregate(pipeline).exec();
    }

    if (rspl) {
      for (const arr of rspl) {
        let game_type = arr.game_type;
        let market_type = arr.market_type;
        let win_amount = Math.round(arr.win_amount);
        let market_name = arr.market_name;
        let user_id = arr.user_id;
        let uname = arr.uname;

        let new_arr2 = {};
        new_arr2.game_type = game_type;

        if (game_type == 1 && market_type == 2) {
          new_arr2.market_name = market_name + "/Bookmaker";
        } else {
          new_arr2.market_name = market_name;
        }
        new_arr2.market_type = market_type;

        new_arr2.username = uname;
        new_arr2.amount = win_amount;
        new_arr2.user_id = user_id;
        return_array2.push(new_arr2);
        grandTotal = grandTotal + win_amount;
      }
    }
  }
  return res.json({ data: return_array2, grandTotal });
});

router.post("/pl-by-type-bet-list", async function (req, res) {
  let master_id = req.user._id; // this is the user

  let frm = req.body.frm;
  let til = req.body.til;

  if (!frm) {
    return res.status(400).json({ error: "Invalid date" });
  }
  if (!til) {
    return res.status(400).json({ error: "Invalid date" });
  }

  const tz = "Europe/London";

  let from, to;

  from = moment.tz(frm.split(" ")[0], "YYYY-MM-DD", tz).startOf("day").toDate();
  to = moment.tz(til.split(" ")[0], "YYYY-MM-DD", tz).endOf("day").toDate();

  let game_type = req.body.game_type;
  let market_type = req.body.market_type;

  let username = req.body.username;
  let user_id = req.body.userId;
  let user_id_fatch = user_id;

  const userCheck = await Punter.findOne({ _id: user_id })
    .select("sponser_id user_role sponsor uname")
    .lean();
  const uname = userCheck?.uname;
  const sponser_id = userCheck?.sponser_id;
  const user_role = userCheck?.user_role;
  const sponsor_uname = userCheck?.sponsor;
  let betList = [];
  let betListFinal = [];

  const rsLoginUseer = await Punter.findOne({ _id: master_id })
    .select("sponser_id user_role sponsor uname")
    .lean();
  const sponser_id_loginUser = rsLoginUseer?.sponser_id;

  let return_array = [];
  let return_array2 = [];

  let gTp1Mtp1 = []; //Criket
  let gTp1Mtp2 = []; //Bookmaker
  let gTp1Mtp3 = []; //Session
  let gTp1Mtp4 = []; //Toss - Should be merge with Cricket
  let gTp1Mtp5 = []; //Tie  - Should be merge with Cricket
  let gTp1Mtp6 = []; //Figure - Should be merge with Cricket

  let gTp2Mtp1 = []; //Soccer
  let gTp3Mtp1 = []; //Tennis
  let gTp4Mtp1 = []; //Horse Race
  let gTp5Mtp1 = []; //Greyhound
  let gTp6Mtp1 = []; //World Casino

  let gTp7Mtp11 = []; // TEENPATTI
  let gTp7Mtp11Arr = [];
  let gTp7Mtp22 = []; // Betfair
  let gTp7Mtp22Arr = [];
  let gTp7Mtp33 = []; // cricket
  let gTp7Mtp33Arr = [];

  let mergerArray = [];
  let type_txt = "";

  if (master_id != "") {
    let marketType = "";
    let new_arr2 = {};
    let betList = [];

    if (user_id_fatch.toString() == master_id.toString()) {
      //login user

      if (game_type == 1 && market_type == 3) {
        // SELECT *,SUM(amount)*-1 as amount FROM bz_bt_punter_trans_details WHERE user_id='$user_id' AND market_type='$market_type' AND game_type='$game_type' AND created_date BETWEEN '$frm' AND '$til' GROUP BY reference_id ORDER BY created_date DESC
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$amount", -1] } },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else if (game_type == 1) {
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: { $ne: 3 },
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$amount", -1] } },
              remark: { $first: "$remark" }, // or $last or $max depending on SQL logic
              cat_mid: { $first: "$cat_mid" }, // SQL does not group these → choose First
              id: { $max: "$_id" }, // SQL: max(id)
              tid: { $max: "$tid" }, // SQL: max(tid)
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else if (game_type == 7 || game_type == 9) {
        //$sqlBets = "SELECT max(created_date) as created_date,SUM((amount)*-1) as amount,remark,cat_mid,max(id) as id,max(tid) as tid FROM `bz_bt_punter_trans_details` where user_id='$user_id' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id,market_type order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: {
                reference_id: "$reference_id",
                market_type: "$market_type",
              },
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$amount", -1] } },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
          {
            $project: {
              _id: 0,
              reference_id: "$_id.reference_id",
              market_type: 1,
              created_date: 1,
              amount: 1,
              remark: 1,
              cat_mid: 1,
              id: 1,
              tid: 1,
              summary_id: 1,
              user_id: 1,
              game_type: 1,
            },
          },
        ]);
      } else if (game_type == 2 && (market_type == 1 || market_type == 6)) {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type IN(1,6) and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id order by created_date desc";

        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: { $in: [1, 6] },
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$amount", -1] } },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else {
        //$sqlBets = "SELECT max(created_date) as created_date,SUM((amount)*-1) as amount,remark,cat_mid,max(id) as id,max(tid) as tid FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til'  group by reference_id order by created_date desc";
        //$sqlBets = "SELECT max(created_date) as created_date,SUM((amount)*-1) as amount,remark,cat_mid,max(id) as id,max(tid) as tid FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til'  group by reference_id order by created_date desc";

        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$amount", -1] } },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      }

      //return res.json({ 'end': 'here' });
      type_txt = "login user";
    } else if (user_id_fatch.toString() == sponser_id_loginUser.toString()) {
      //upline user

      if (game_type == 1 && market_type == 3) {
        //$sqlBets = "SELECT *,SUM(bettor_d)*-1 as amount FROM `bz_bt_punter_trans_details` where user_id='$master_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til'  group by reference_id order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(master_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$bettor_d", -1] } },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else if (game_type == 1) {
        //					$sqlBets = "SELECT *,SUM(bettor_d)*-1 as amount FROM `bz_bt_punter_trans_details` where user_id='$master_id' and market_type!=3 and game_type='$game_type' and created_date BETWEEN '$frm' and '$til'  group by reference_id order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(master_id),
              market_type: { $ne: 3 },
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$bettor_d", -1] } },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else {
        //	$sqlBets = "SELECT *,SUM(bettor_d)*-1 as amount FROM `bz_bt_punter_trans_details` where user_id='$master_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(master_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: { $multiply: ["$bettor_d", -1] } },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      }

      type_txt = "upline user";
    } //downline user
    else {
      if (game_type == 1 && market_type == 3) {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id,cat_mid order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: { reference_id: "$reference_id", cat_mid: "$cat_mid" },
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
          {
            $project: {
              _id: 0,
              reference_id: "$_id.reference_id",
              cat_mid: "$_id.cat_mid",
              created_date: 1,
              amount: 1,
              remark: 1,
              id: 1,
              tid: 1,
              summary_id: 1,
              user_id: 1,
              market_type: 1,
              game_type: 1,
            },
          },
        ]);
      } else if (game_type == 1 && market_type == 1) {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type NOT IN(2,3) and game_type=1 and created_date BETWEEN '$frm' and '$til' group by reference_id order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: { $nin: [2, 3] },
              game_type: 1,
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else if (game_type == 1 && market_type == 2) {
        // $sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id order by created_date desc";
        //
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else if (game_type == 1 && market_type == 8) {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else if (game_type == 2 && (market_type == 1 || market_type == 6)) {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type IN(1,6) and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id order by created_date desc";

        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: { $in: [1, 6] },
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$reference_id",
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
        ]);
      } else if (game_type == 1) {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount  FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type NOT IN(3,8) and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id,market_type order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: { $nin: [3, 8] },
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: {
                reference_id: "$reference_id",
                market_type: "$market_type",
              },
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
          {
            $project: {
              _id: 0,
              reference_id: "$_id.reference_id",
              market_type: "$_id.market_type",
              created_date: 1,
              amount: 1,
              remark: 1,
              cat_mid: 1,
              id: 1,
              tid: 1,
              summary_id: 1,
              user_id: 1,
              game_type: 1,
            },
          },
        ]);
      } else if (game_type == 7 || game_type == 9) {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id,market_type order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: {
                reference_id: "$reference_id",
                market_type: "$market_type",
              },
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
          {
            $project: {
              _id: 0,
              reference_id: "$_id.reference_id",
              market_type: "$_id.market_type",
              created_date: 1,
              amount: 1,
              remark: 1,
              cat_mid: 1,
              id: 1,
              tid: 1,
              summary_id: 1,
              user_id: 1,
              game_type: 1,
            },
          },
        ]);
      } else {
        //$sqlBets = "SELECT *,SUM(bettor_d) as amount FROM `bz_bt_punter_trans_details` where user_id='$user_id' and market_type='$market_type' and game_type='$game_type' and created_date BETWEEN '$frm' and '$til' group by reference_id,market_type order by created_date desc";
        betList = await PunterTransDetails.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              market_type: Number(market_type),
              game_type: Number(game_type),
              created_date: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: {
                reference_id: "$reference_id",
                market_type: "$market_type",
              },
              created_date: { $max: "$created_date" },
              amount: { $sum: "$bettor_d" },
              remark: { $first: "$remark" },
              cat_mid: { $first: "$cat_mid" },
              id: { $max: "$_id" },
              tid: { $max: "$tid" },
              summary_id: { $first: "$summary_id" },
              user_id: { $first: "$user_id" },
              market_type: { $first: "$market_type" },
              game_type: { $first: "$game_type" },
            },
          },
          { $sort: { created_date: -1 } },
          {
            $project: {
              _id: 0,
              reference_id: "$_id.reference_id",
              market_type: "$_id.market_type",
              created_date: 1,
              amount: 1,
              remark: 1,
              cat_mid: 1,
              id: 1,
              tid: 1,
              summary_id: 1,
              user_id: 1,
              game_type: 1,
            },
          },
        ]);
      }

      type_txt = "downline user";
    }

    if (betList.length > 0) {
      for (const arrBetList of betList) {
        let cat_mid = arrBetList["cat_mid"];
        let parentEventName = "";
        if (game_type == 2 && (market_type == 1 || market_type == 6)) {
          // Fetch cat_mname from bz_betfair_events where cat_mid = cat_mid
          const event = await BetfairEvent.findOne({ cat_mid: cat_mid });
          const parentEventName = event.cat_mname;
        }

        if (game_type == 1 && market_type == 3) {
          // Fetch evt_evt from bz_betfair_events where cat_mid = cat_mid
          const event = await BetfairEvent.findOne({ cat_mid: cat_mid });
          const parentEventName = event ? event.evt_evt : "";
        }

        let summary_id = arrBetList.summary_id;
        let tid = arrBetList.tid;
        let _id = arrBetList._id;
        let id = arrBetList.id;
        let stmp = arrBetList.created_date;

        let dateObject = new Date(stmp);
        stmp = moment(dateObject).format("YYYY-MM-DD hh:mm A");

        let remark = parentEventName + " " + arrBetList.remark;
        let win_amt = arrBetList.amount;
        let user_id = arrBetList.user_id;

        // Fetch user_role from bz_bt_punter where _id = user_id

        const userRoleDoc = await Punter.findOne({ _id: user_id })
          .select("user_role")
          .lean();
        const user_role = userRoleDoc.user_role;

        ///
        let virtual_game_name = 0;
        let new_market_type = arrBetList.market_type;
        if (game_type == 7) {
          if (new_market_type == 9) {
            virtual_game_name = 2;
          }
          if (new_market_type == 10) {
            virtual_game_name = 4;
          }
          if (new_market_type == 11) {
            virtual_game_name = 1;
          }
          if (new_market_type == 12) {
            virtual_game_name = 5;
          }
          if (new_market_type == 14) {
            virtual_game_name = 3;
          }
          if (new_market_type == 29) {
            virtual_game_name = 20;
          }
          if (new_market_type == 30) {
            virtual_game_name = 21;
          }

          if (new_market_type == 13) {
            virtual_game_name = 6;
          }
          if (new_market_type == 15) {
            virtual_game_name = 7;
          }
          if (new_market_type == 16) {
            virtual_game_name = 8;
          }
          if (new_market_type == 17) {
            virtual_game_name = 9;
          }
          if (new_market_type == 18) {
            virtual_game_name = 10;
          }
          if (new_market_type == 19) {
            virtual_game_name = 11;
          }
          if (new_market_type == 20) {
            virtual_game_name = 12;
          }
          if (new_market_type == 21) {
            virtual_game_name = 13;
          }
          if (new_market_type == 23) {
            virtual_game_name = 14;
          }
          if (new_market_type == 24) {
            virtual_game_name = 15;
          }
          if (new_market_type == 25) {
            virtual_game_name = 16;
          }
          if (new_market_type == 26) {
            virtual_game_name = 17;
          }
          if (new_market_type == 27) {
            virtual_game_name = 18;
          }
          if (new_market_type == 28) {
            virtual_game_name = 19;
          }
          if (new_market_type == 31) {
            virtual_game_name = 22;
          }

          if (new_market_type == 33) {
            virtual_game_name = 24;
          }
          if (new_market_type == 34) {
            virtual_game_name = 25;
          }
          if (new_market_type == 35) {
            virtual_game_name = 26;
          }
          if (new_market_type == 36) {
            virtual_game_name = 27;
          }
          if (new_market_type == 37) {
            virtual_game_name = 28;
          }
          if (new_market_type == 38) {
            virtual_game_name = 29;
          }
          if (new_market_type == 39) {
            virtual_game_name = 30;
          }
          if (new_market_type == 40) {
            virtual_game_name = 31;
          }
          if (new_market_type == 41) {
            virtual_game_name = 32;
          }
        }
        ///

        const bet_array = {};
        bet_array.win_amt = Math.round(win_amt);
        bet_array.remark = remark;
        bet_array.match = remark;
        bet_array.stmp = stmp;
        bet_array.game_type = game_type;
        bet_array.market_type = market_type;
        bet_array.tid = tid;
        bet_array._id = _id;
        bet_array.id = id;
        bet_array.summary_id = summary_id;
        bet_array.user_sno = user_id;
        bet_array.user_id = user_id;
        bet_array.user_role = user_role;
        bet_array.virtual_game_name = virtual_game_name;

        betListFinal.push(bet_array);
      }
    }
  }

  return res.json({ betList: betListFinal });
});
module.exports = router;
