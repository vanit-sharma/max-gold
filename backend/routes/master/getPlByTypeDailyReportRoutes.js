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

router.post("/", async (req, res) => {
  let master_id = req.user._id;
  let combined;
  console.log("body:", req.body);

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

  frm = frm + " 00:00:00";
  til = til + " 23:59:59";

  console.log("frm:", frm);
  console.log("til:", til);
  let username = req.body.username;

  let user_id = req.body.userId;
  user_id = new mongoose.Types.ObjectId(user_id);
  

  // Fetch user details from MongoDB using Mongoose
  const userCheck = await Punter.findOne({
    _id: new mongoose.Types.ObjectId(user_id),
  }).lean();
  const uname = userCheck?.uname;
  const sponser_id = userCheck?.sponser_id;
  const user_role = userCheck?.user_role;
  const sponsor_uname = userCheck?.sponsor;

  const rsLoginUseer = await Punter.findOne({
    _id: new mongoose.Types.ObjectId(master_id),
  }).lean();

  const sponser_id_loginUser = rsLoginUseer?.sponser_id;

  let return_array = [];
  let return_array2 = [];

  let gTp1Mtp1 = []; //Criket
  let gTp1Mtp2 = []; //Bookmaker
  let gTp1Mtp3 = []; //Session
  let gTp1Mtp4 = []; //Toss - Should be merge with Cricket
  let gTp1Mtp5 = []; //Tie  - Should be merge with Cricket
  let gTp1Mtp6 = []; //Figure - Should be merge with Cricket
  let gTp1Mtp7 = []; //EvenOdd - Should be merge with Cricket

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
  let gTp7Mtp44 = []; // cricket
  let gTp7Mtp55 = [];
  let gTScoccerArr = []; //soccer
  let gTBetfairGameArr = []; //soccer

  let mergerArray = [];
  if (master_id != "") {
    console.log("user_id", user_id);
    console.log("master_id", master_id);

    if (user_id.toString() == master_id.toString()) {
      //login user
      // $sqlPL = "SELECT sum(win_amount) win_amount,market_type,user_id,game_type,uname, (CASE WHEN game_type = 1 THEN CASE WHEN market_type = 1 THEN 'Cricket' WHEN market_type = 2 THEN 'Cricket' WHEN market_type = 3 THEN 'Fancy' WHEN market_type = 4 THEN 'Cricket' WHEN market_type = 5 THEN 'Tie' WHEN market_type = 6 THEN 'Figure' WHEN market_type = 8 THEN 'EvenOdd' ELSE '' END WHEN game_type = 2 THEN  'Soccer'  WHEN game_type = 3 THEN 'Tennis' WHEN game_type = 4 THEN 'Horse Race' WHEN game_type = 5 THEN 'Greyhound' WHEN game_type = 6 THEN 'World Casino' WHEN game_type = 7 THEN 'Teenpatti Casino' WHEN game_type = 8 THEN 'Star Casino' WHEN game_type = 9 THEN 'Betfair Games' ELSE '' END) as market_name from (SELECT sum(amount)*-1 as win_amount,CASE WHEN game_type=1 then
      // CASE WHEN market_type =6 THEN 1 WHEN market_type= 5 THEN 1 WHEN market_type= 4 THEN 1
      // ELSE market_type END ELSE market_type END market_type, user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id='$master_id' and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(1,6) group by d.game_type,d.market_type
      // UNION ALL
      // SELECT sum(amount)*-1 as win_amount, 1 as market_type,
      // user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id='$master_id' and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(2,3,4,5,7,8,9) group by d.game_type ) as tt group by market_type, game_type";
      console.log("match: ", {
        type: 1,
        user_id: master_id,
        created_date: { $gte: new Date(frm), $lte: new Date(til) },
        game_type: { $in: [1, 6] },
      });
      const queryA = await PunterTransDetails.aggregate([
        {
          $match: {
            type: 1,
            user_id: master_id,
            created_date: { $gte: new Date(frm), $lte: new Date(til) },
            game_type: { $in: [1, 6] },
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

        // CASE for market_type correction
        {
          $addFields: {
            market_type: {
              $cond: [
                { $eq: ["$game_type", 1] },
                {
                  $cond: [
                    { $in: ["$market_type", [6, 5, 4]] },
                    1,
                    "$market_type",
                  ],
                },
                "$market_type",
              ],
            },
          },
        },

        {
          $group: {
            _id: { game_type: "$game_type", market_type: "$market_type" },
            win_amount: { $sum: { $multiply: ["$amount", -1] } },
            user_id: { $first: "$user_id" },
            uname: { $first: "$punter.uname" },
            game_type: { $first: "$game_type" },
            market_type: { $first: "$market_type" },
          },
        },
      ]);

      const queryB = await PunterTransDetails.aggregate([
        {
          $match: {
            type: 1,
            user_id: master_id,
            created_date: { $gte: new Date(frm), $lte: new Date(til) },
            game_type: { $in: [2, 3, 4, 5, 7, 8, 9] },
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
          $group: {
            _id: { game_type: "$game_type" },
            win_amount: { $sum: { $multiply: ["$amount", -1] } },
            user_id: { $first: "$user_id" },
            uname: { $first: "$punter.uname" },
            game_type: { $first: "$game_type" },
            market_type: { $first: 1 }, // forced as in SQL
          },
        },
      ]);

      combined = [...queryA, ...queryB];
    } else if (user_id.toString() == sponser_id_loginUser.toString()) {
      //upline user
      // $sqlPL = "SELECT sum(win_amount) win_amount,market_type,user_id,game_type,uname, (CASE WHEN game_type = 1 THEN CASE WHEN market_type = 1 THEN 'Cricket' WHEN market_type = 2 THEN 'Cricket' WHEN market_type = 3 THEN 'Fancy' WHEN market_type = 4 THEN 'Cricket' WHEN market_type = 5 THEN 'Tie' WHEN market_type = 6 THEN 'Figure' WHEN market_type = 8 THEN 'EvenOdd' ELSE '' END WHEN game_type = 2 THEN  'Soccer'  WHEN game_type = 3 THEN 'Tennis' WHEN game_type = 4 THEN 'Horse Race' WHEN game_type = 5 THEN 'Greyhound' WHEN game_type = 6 THEN 'World Casino' WHEN game_type = 7 THEN 'Teenpatti Casino' WHEN game_type = 8 THEN 'Star Casino' WHEN game_type = 9 THEN 'Betfair Games' ELSE '' END) as market_name from (SELECT sum(bettor_d)*-1 as win_amount,CASE WHEN game_type=1 then
      // CASE WHEN market_type =6 THEN 1 WHEN market_type= 5 THEN 1 WHEN market_type= 4 THEN 1
      // ELSE market_type END ELSE market_type END market_type, user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id='$master_id' and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(1,6) group by d.game_type,d.market_type UNION ALL
      // SELECT sum(bettor_d)*-1 as win_amount, 1 as market_type,
      // user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id='$master_id' and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(2,3,4,5,7,8,9) group by d.game_type ) as tt group by market_type, game_type";

      console.log("match2: ", {
        type: 1,
        user_id: master_id,
        created_date: { $gte: new Date(frm), $lte: new Date(til) },
        game_type: { $in: [1, 6] },
      });
      
      const queryA = await PunterTransDetails.aggregate([
        {
          $match: {
            type: 1,
            user_id: master_id,
            created_date: { $gte: new Date(frm), $lte: new Date(til) },
            game_type: { $in: [1, 6] },
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

        // CASE WHEN for market_type conversions
        {
          $addFields: {
            market_type: {
              $cond: [
                { $eq: ["$game_type", 1] },
                {
                  $cond: [
                    { $in: ["$market_type", [6, 5, 4]] },
                    1,
                    "$market_type",
                  ],
                },
                "$market_type",
              ],
            },
          },
        },

        // Group by game_type + modified market_type
        {
          $group: {
            _id: { game_type: "$game_type", market_type: "$market_type" },
            win_amount: { $sum: { $multiply: ["$bettor_d", -1] } },
            user_id: { $first: "$user_id" },
            uname: { $first: "$punter.uname" },
            game_type: { $first: "$game_type" },
            market_type: { $first: "$market_type" },
          },
        },
      ]);

      const queryB = await PunterTransDetails.aggregate([
        {
          $match: {
            type: 1,
            user_id: master_id,
            created_date: { $gte: new Date(frm), $lte: new Date(til) },
            game_type: { $in: [2, 3, 4, 5, 7, 8, 9] },
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
          $group: {
            _id: { game_type: "$game_type" },
            win_amount: { $sum: { $multiply: ["$bettor_d", -1] } },
            user_id: { $first: "$user_id" },
            uname: { $first: "$punter.uname" },
            game_type: { $first: "$game_type" },
            market_type: { $first: 1 },
          },
        },
      ]);

      combined = [...queryA, ...queryB];
    } //downline user
    else {
      // $sqlPL = "SELECT sum(win_amount) win_amount,market_type,user_id,game_type,uname, (CASE WHEN game_type = 1 THEN CASE WHEN market_type = 1 THEN 'Cricket' WHEN market_type = 2 THEN 'Cricket' WHEN market_type = 3 THEN 'Fancy' WHEN market_type = 4 THEN 'Cricket' WHEN market_type = 5 THEN 'Tie' WHEN market_type = 6 THEN 'Figure' WHEN market_type = 8 THEN 'EvenOdd' ELSE '' END WHEN game_type = 2 THEN  'Soccer'  WHEN game_type = 3 THEN 'Tennis' WHEN game_type = 4 THEN 'Horse Race' WHEN game_type = 5 THEN 'Greyhound' WHEN game_type = 6 THEN 'World Casino' WHEN game_type = 7 THEN 'Teenpatti Casino' WHEN game_type = 8 THEN 'Star Casino' WHEN game_type = 9 THEN 'Betfair Games' ELSE '' END) as market_name from (SELECT sum(bettor_d) as win_amount,CASE WHEN game_type=1 then
      // CASE WHEN market_type =6 THEN 1 WHEN market_type= 5 THEN 1 WHEN market_type= 4 THEN 1
      // ELSE market_type END ELSE market_type END market_type, user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id='$user_id' and p.sponser_id='$sponser_id' and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(1,6) group by d.game_type,d.market_type
      //

      //UNION ALL
      // SELECT sum(bettor_d) as win_amount, 1 as market_type,
      // user_id,game_type,uname FROM `bz_bt_punter_trans_details` d INNER JOIN bz_bt_punter p ON d.user_id=p.sno where user_id='$user_id' and p.sponser_id='$sponser_id' and d.type=1 and created_date BETWEEN '$frm' and '$til' and game_type IN(2,3,4,5,7,8,9) group by d.game_type ) as tt group by market_type, game_type";


      console.log('Match3: ', {
            type: 1,
            user_id: user_id,
            created_date: { $gte: new Date(frm), $lte: new Date(til) },
            game_type: { $in: [1, 6] },
          });
      const queryA = await PunterTransDetails.aggregate([
        {
          $match: {
            type: 1,
            user_id: user_id,
            created_date: { $gte: new Date(frm), $lte: new Date(til) },
            game_type: { $in: [1, 6] },
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

        // sponsor filter (p.sponser_id = $sponser_id)
        {
          $match: {
            "punter.sponser_id": sponser_id,
          },
        },

        // CASE logic for special market type rules
        {
          $addFields: {
            market_type: {
              $cond: [
                { $eq: ["$game_type", 1] },
                {
                  $cond: [
                    { $in: ["$market_type", [6, 5, 4]] },
                    1,
                    "$market_type",
                  ],
                },
                "$market_type",
              ],
            },
          },
        },

        {
          $group: {
            _id: { game_type: "$game_type", market_type: "$market_type" },
            win_amount: { $sum: "$bettor_d" },
            user_id: { $first: "$user_id" },
            uname: { $first: "$punter.uname" },
            game_type: { $first: "$game_type" },
            market_type: { $first: "$market_type" },
          },
        },
      ]);

      const queryB = await PunterTransDetails.aggregate([
        {
          $match: {
            type: 1,
            user_id: user_id,
            created_date: { $gte: new Date(frm), $lte: new Date(til) },
            game_type: { $in: [2, 3, 4, 5, 7, 8, 9] },
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

        // sponsor filter
        {
          $match: {
            "punter.sponser_id": sponser_id,
          },
        },

        {
          $group: {
            _id: { game_type: "$game_type" },
            win_amount: { $sum: "$bettor_d" },
            user_id: { $first: "$user_id" },
            uname: { $first: "$punter.uname" },
            game_type: { $first: "$game_type" },
            market_type: { $first: 1 },
          },
        },
      ]);

      combined = [...queryA, ...queryB];
    }
    combined = combined.map((row) => {
      const { market_type, game_type } = row;

      if (game_type === 1) {
        row.market_name =
          market_type === 1
            ? "Cricket"
            : market_type === 2
            ? "Cricket"
            : market_type === 3
            ? "Fancy"
            : market_type === 4
            ? "Cricket"
            : market_type === 5
            ? "Tie"
            : market_type === 6
            ? "Figure"
            : market_type === 8
            ? "EvenOdd"
            : "";
      } else {
        row.market_name =
          game_type === 2
            ? "Soccer"
            : game_type === 3
            ? "Tennis"
            : game_type === 4
            ? "Horse Race"
            : game_type === 5
            ? "Greyhound"
            : game_type === 6
            ? "World Casino"
            : game_type === 7
            ? "Teenpatti Casino"
            : game_type === 8
            ? "Star Casino"
            : game_type === 9
            ? "Betfair Games"
            : "";
      }

      return row;
    });

    // if($num_row>0)
    // {
    for (const arr of combined) {
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
    }

    //}
  }

  // echo json_encode($return_array2);
  // //echo json_encode($return_array2);
  // exit;

  return res.json({ data: return_array2 });
  //  return res.json({ loss_users: minus_array, profit_users: plus_array, totalProfit: total_profit, totalLoss: total_loss });
});

module.exports = router;
