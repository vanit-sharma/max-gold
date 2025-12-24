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

router.get("/:id", async (req, res) => {
  const record_id = req.params.id;

  const result = await PunterTransDetails.findOne({
    _id: new mongoose.Types.ObjectId(record_id),
  }).lean();
console.log('result: ',result);
  let remark = result.remark;
  let pass_user_id = result.user_id;
  let user_id = result.user_id;
  let summary_id = result.summary_id;
  let cat_mid = result.cat_mid;
  let evt_id = result.evt_id;
  let transactionId = result.tid;
  let game_type = result.game_type;
  let child_user_id = result.child_user_id;
  let tid = result.tid;
  let market_type = result.market_type;
  let reference_id = result.reference_id;
  let new_market_type = market_type;
  let arrPLNew = [];
  
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
  }
  if (game_type == 9) {
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

  const fromuser = await Punter.findOne(
    { _id: pass_user_id },
    { sponser_id: 1, uname: 1 }
  ).lean();
  const login_user_sponser_id = fromuser.sponser_id;
  const uname = fromuser?.uname;

  //parent PL
  let plus_array = [];
  let minus_array = [];
  console.log("game_type:", game_type, "market_type:", market_type);

  if (game_type == 1 && market_type == 3) {
    /*
    const downline = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: { $ne: pass_user_id },
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: "$bettor_d" },
          uname: { $first: "$punter.uname" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "downline" },
      },
    ]);

    // Current
    const current = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$amount", -1] } },
          uname: { $first: "$punter.uname" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "current" },
      },
    ]);

    // Upline
    const upline = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$bettor_d", -1] } },
          uname: { $first: "$punter.sponsor" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "upline" },
      },
    ]);
*/
    const downline = await PunterTransDetails.aggregate([
      {
        $match: {
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
        },
      },
      {
        $lookup: {
          from: "bz_bt_punter", // child collection
          localField: "user_id",
          foreignField: "_id",
          as: "punter",
        },
      },
      { $unwind: "$punter" },
      {
        $match: {
          "punter.sponser_id": pass_user_id,
        },
      },
      {
        $group: {
          _id: "$user_id",
          winAmount: { $sum: "$bettor_d" },
          uname: { $first: "$punter.uname" }, // from joined table
          user_role: { $first: "$punter.user_role" },
          utype: { $first: "downline" },
          transDetailsId: { $first: "$_id" },
        },
      },
    ]);

    // Current
    const current = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$amount", -1] } },
          uname: { $first: "$punter.uname" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "current" },
      },
    ]);

    // Upline
    const upline = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$bettor_d", -1] } },
          uname: { $first: "$punter.sponsor" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "upline" },
      },
    ]);
    arrPLNew = [...downline, ...current, ...upline];
    console.log("arrPLNew", arrPLNew);
  } else if (game_type == 1 && (market_type == 1 || market_type == 2)) {
    /*
    $qlPLNew = "SELECT user_id,SUM(bettor_d) as winAmount,uname,user_role,'downline' as utype,id as transDetailsId FROM `bz_bt_punter_trans_details` trans inner join bz_bt_punter p on (p.sno=trans.user_id) where p.sponser_id='$pass_user_id' and trans.`type`=1 and trans.reference_id='$reference_id' and trans.cat_mid='$cat_mid' and trans.evt_id='$evt_id' and market_type='$market_type' group by user_id
    UNION
    SELECT user_id,SUM(amount)*-1 as winAmount,uname,user_role,'current' as utype,id as transDetailsId FROM `bz_bt_punter_trans_details` trans inner join bz_bt_punter p on (p.sno=trans.user_id) where p.sno='$pass_user_id' and trans.`type`=1 and trans.`type`=1 and trans.reference_id='$reference_id' and trans.cat_mid='$cat_mid' and trans.evt_id='$evt_id' and market_type='$market_type'
    UNION
    SELECT user_id,SUM(bettor_d)*-1 as winAmount,(select sponsor from bz_bt_punter WHERE sno=p.sno) as uname,user_role,'upline' as utype,id as transDetailsId FROM `bz_bt_punter_trans_details` trans inner join bz_bt_punter p on (p.sno=trans.user_id) where p.sno='$pass_user_id' and trans.`type`=1 and trans.`type`=1 and trans.reference_id='$reference_id' and trans.cat_mid='$cat_mid' and trans.evt_id='$evt_id' and market_type='$market_type'";

    */
    // Downline

    const downline = await PunterTransDetails.aggregate([
      // Match conditions for trans table
      {
        $match: {
          type: 1,
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
        },
      },

      // MongoDB join
      {
        $lookup: {
          from: "bz_bt_punter",
          localField: "user_id",
          foreignField: "_id",
          as: "punter",
        },
      },

      // Flatten join result
      { $unwind: "$punter" },

      // Filter based on punter.sponser_id
      {
        $match: {
          "punter.sponser_id": pass_user_id,
        },
      },

      // Group by user_id
      {
        $group: {
          _id: "$user_id",
          winAmount: { $sum: "$bettor_d" },
          uname: { $first: "$punter.uname" },
          user_role: { $first: "$punter.user_role" },
          utype: { $first: "downline" }, // static value
          transDetailsId: { $first: "$_id" }, // SQL selected `id`
        },
      },
    ]);

    // Current
    const current = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$amount", -1] } },
          uname: { $first: "$punter.uname" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "current" },
      },
    ]);

    // Upline
    const upline = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          reference_id: reference_id,
          cat_mid: cat_mid,
          evt_id: evt_id,
          market_type: market_type,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$bettor_d", -1] } },
          uname: { $first: "$punter.sponsor" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "upline" },
      },
    ]);

    arrPLNew = [...downline, ...current, ...upline];
  } else if (game_type == 4 || game_type == 5) {
    // Downline

    const downline = await PunterTransDetails.aggregate([
      {
        $match: {
          reference_id: reference_id,
          summary_id: summary_id,
          tid: transactionId,
          type: 1,
        },
      },
      {
        $lookup: {
          from: "bz_bt_punter", // child collection
          localField: "user_id",
          foreignField: "_id",
          as: "punter",
        },
      },
      { $unwind: "$punter" },
      {
        $match: {
          "punter.sponser_id": pass_user_id,
        },
      },
      {
        $group: {
          _id: "$user_id",
          winAmount: { $sum: "$bettor_d" },
          uname: { $first: "$punter.uname" }, // from joined table
          user_role: { $first: "$punter.user_role" },
          utype: { $first: "downline" },
          transDetailsId: { $first: "$_id" },
        },
      },
    ]);

    // Current
    const current = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          reference_id: reference_id,
          summary_id: summary_id,
          tid: transactionId,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$amount", -1] } },
          uname: { $first: "$punter.uname" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "current" },
      },
    ]);

    // Upline
    const upline = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          //reference_id: reference_id,
          summary_id: summary_id,
          tid: transactionId,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$bettor_d", -1] } },
          uname: { $first: "$punter.sponsor" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "upline" },
      },
    ]);
    arrPLNew = [...downline, ...current, ...upline];
  } else {
    const downline = await PunterTransDetails.aggregate([
      {
        $match: {
          type: 1,
          summary_id: summary_id,
          tid: transactionId,
        },
      },
      {
        $lookup: {
          from: "bz_bt_punter", // child collection
          localField: "user_id",
          foreignField: "_id",
          as: "punter",
        },
      },
      { $unwind: "$punter" },
      {
        $match: {
          "punter.sponser_id": pass_user_id,
        },
      },
      {
        $group: {
          _id: "$user_id",
          winAmount: { $sum: "$bettor_d" },
          uname: { $first: "$punter.uname" }, // from joined table
          user_role: { $first: "$punter.user_role" },
          utype: { $first: "downline" },
          transDetailsId: { $first: "$_id" },
        },
      },
    ]);

    // Current
    const current = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          summary_id: summary_id,
          tid: transactionId,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$amount", -1] } },
          uname: { $first: "$punter.uname" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "current" },
      },
    ]);

    // Upline
    const upline = await PunterTransDetails.aggregate([
      {
        $match: {
          user_id: pass_user_id,
          summary_id: summary_id,
          tid: transactionId,
          type: 1,
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
          _id: "$user_id",
          winAmount: { $sum: { $multiply: ["$bettor_d", -1] } },
          uname: { $first: "$punter.sponsor" },
          user_role: { $first: "$punter.user_role" },
          transDetailsId: { $first: "$_id" },
        },
      },
      {
        $addFields: { utype: "upline" },
      },
    ]);

    arrPLNew = [...downline, ...current, ...upline];
  }

  for (const objPLNew of arrPLNew) {
    let winAmount = objPLNew.winAmount;

    if (Number(winAmount) >= 0) {
      plus_array.push(objPLNew);
    } else {
      minus_array.push(objPLNew);
    }
  }

  return res
    .status(200)
    .send({ plus_array: plus_array, minus_array: minus_array, uname, remark,game_type});
});

module.exports = router;
