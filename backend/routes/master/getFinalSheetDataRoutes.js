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
const PunterFinalsheetRecords = require("../../models/PunterFinalSheetRecords");
const sportsApingRequest = require("../../utils/sportsApingRequest");

router.use(auth);

router.post("/", async (req, res) => {
  let master_id = req.user._id;
  let combined;
  let records = [];
    let plus = [];
    let minus = [];
  

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

  
  
  try {

  // Fetch user details from MongoDB using Mongoose
  const userLoginCheck = await Punter.findOne({
    _id: master_id,
  }).lean();

  let sponser_id = userLoginCheck.sponser_id;
  let sponsor = userLoginCheck.sponsor;
  let uname = userLoginCheck.uname;

  let pipeline = [
    { $match: { type: 1, user_id: master_id } },

    {
      $project: {
        my_share_amount: { $ifNull: ["$my_share_amount", 0] },
        upline_share_amount: { $ifNull: ["$upline_share_amount", 0] },
      },
    },

    {
      $unionWith: {
        coll: "bz_bt_punter_trans_details",
        pipeline: [
          {
            $match: {
              type: 1,
              user_id: master_id,
              created_date: { $gte: new Date(frm), $lte: new Date(til) },
            },
          },
          {
            $project: {
              my_share_amount: { $ifNull: ["$amount", 0] },
              upline_share_amount: { $ifNull: ["$bettor_d", 0] },
            },
          },
        ],
      },
    },

    {
      $group: {
        _id: null,
        total_my: { $sum: "$my_share_amount" },
        total_upline: { $sum: "$upline_share_amount" },
      },
    },

    {
      $project: {
        _id: 0,
        my_share_amount: { $multiply: ["$total_my", -1] },
        upline_share_amount: { $multiply: ["$total_upline", -1] },
      },
    },
  ];

  const arrSelfUp = await PunterFinalsheetRecords.aggregate(pipeline);
//console.log("arrSelfUp:", arrSelfUp);
  let my_share_amount = arrSelfUp[0].my_share_amount;

  let upline_share_amount_book = arrSelfUp[0].upline_share_amount;
  let my_cash_amount = arrSelfUp[0].my_cash_amount || 0;

  let arr = {};
  arr.user_id = master_id;
  arr.uname = uname;
  //arr.is_owner = 1;
  //arr.is_pl = 1;

  if (my_share_amount >= 0) {
    arr.winAmount = parseInt(my_share_amount);
  } else {
    arr.winAmount = parseInt(my_share_amount);
  }
//   console.log('befoer push:', records)
//   console.log('arr:', arr)
  records.push(arr);
  //console.log("Final Records:", records);

  /**
   * Writing second query below:
   */

  const downlineUsers = await Punter.aggregate([
    { $match: { sponser_id: master_id } },
    { $project: { _id: 0, user_id: "$_id" } },
  ]);

  const downlineIds = downlineUsers.map((u) => u.user_id);

  // -------------------------
  // MAIN AGGREGATION PIPELINE
  // -------------------------

  pipeline = [
    // Start with punter_trans_details (type=1, date filter)
    {
      $match: {
        user_id: { $in: downlineIds },
        type: 1,
        created_date: { $gte: new Date(frm), $lte: new Date(til) },
      },
    },
    {
      $project: {
        user_id: 1,
        my_share_amount: "$amount",
        upline_share_amount: "$bettor_d",
      },
    },

    // UNION 2: finalsheet type 1
    {
      $unionWith: {
        coll: "punter_finalsheet_records",
        pipeline: [
          {
            $match: {
              user_id: { $in: downlineIds },
              type: 1,
            },
          },
          {
            $project: {
              user_id: 1,
              my_share_amount: "$my_share_amount",
              upline_share_amount: "$upline_share_amount",
            },
          },
        ],
      },
    },

    // UNION 3: finalsheet type 3
    {
      $unionWith: {
        coll: "punter_finalsheet_records",
        pipeline: [
          {
            $match: {
              user_id: { $in: downlineIds },
              type: 3,
            },
          },
          {
            $project: {
              user_id: 1,
              my_share_amount: "$my_share_amount",
              upline_share_amount: "$upline_share_amount",
            },
          },
        ],
      },
    },

    // UNION 4: finalsheet type 2 (my_share_amount = 0)
    {
      $unionWith: {
        coll: "punter_finalsheet_records",
        pipeline: [
          {
            $match: {
              user_id: { $in: downlineIds },
              type: 2,
            },
          },
          {
            $project: {
              user_id: 1,
              my_share_amount: { $literal: 0 },
              upline_share_amount: "$my_share_amount",
            },
          },
        ],
      },
    },

    // GROUP ALL UNION RESULTS
    {
      $group: {
        _id: "$user_id",
        my_share_amount: { $sum: "$my_share_amount" },
        upline_share_amount: { $sum: "$upline_share_amount" },
      },
    },

    // Rename _id → user_id
    {
      $project: {
        _id: 0,
        user_id: "$_id",
        my_share_amount: 1,
        upline_share_amount: 1,
      },
    },

    // JOIN with punter table
    {
      $lookup: {
        from: "bz_bt_punter",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    {
      $project: {
        user_id: 1,
        my_share_amount: 1,
        upline_share_amount: 1,
        uname: "$user.uname",
        user_role: "$user.user_role",
      },
    },
  ];

  const userFullQuery = await PunterTransDetails.aggregate(pipeline);
  

  for (const chain of userFullQuery) {
    user_id = chain.user_id;
    user_role = chain.user_role;
    uname = chain.uname;
    upline_share_amount = chain.upline_share_amount;

    arr = {};

    arr.user_id = user_id;
    arr.uname = uname;
    arr.is_owner = 0;
    arr.is_pl = 1;
    // if (upline_share_amount >= 0) {
    //   arr.winAmount = parseInt(upline_share_amount);
    // } else {
      arr.winAmount = parseInt(upline_share_amount);
    //}
    records.push(arr);
  }
/*
  pipeline = [
    // ------------------ PART 1 ------------------
    // Downline + Master (rtype = "my")
    {
      $facet: {
        myResult: [
          // First subquery of UNION 1: downline upline_share_amount
          {
            $unionWith: {
              coll: "punter_finalsheet_records",
              pipeline: [
                {
                  $match: {
                    user_id: {
                      $in: await Punter.distinct("_id", {
                        sponser_id: master_id,
                      }),
                    },
                    type: 2,
                  },
                },
                {
                  $project: {
                    cashAmount: "$upline_share_amount",
                  },
                },
              ],
            },
          },

          // Second subquery: master my_share_amount
          {
            $unionWith: {
              coll: "punter_finalsheet_records",
              pipeline: [
                {
                  $match: {
                    user_id: master_id,
                    type: 2,
                  },
                },
                {
                  $project: {
                    cashAmount: "$my_share_amount",
                  },
                },
              ],
            },
          },

          // Final aggregation for PART 1
          {
            $group: {
              _id: null,
              cashAmount: { $sum: "$cashAmount" },
            },
          },
          {
            $project: {
              _id: 0,
              cashAmount: 1,
              rtype: "my",
              user_id: master_id,
            },
          },
        ],

        // ------------------ PART 2 ------------------
        bookUserResult: [
          {
            $match: {
              sponser_id: master_id,
              type: 2,
            },
          },
          {
            $group: {
              _id: "$user_id",
              cashAmount: { $sum: "$upline_share_amount" },
            },
          },
          {
            $project: {
              _id: 0,
              cashAmount: 1,
              rtype: "bookuser",
              user_id: "$_id",
            },
          },
        ],
      },
    },

    // MERGE FACET RESULTS
    {
      $project: {
        allData: { $concatArrays: ["$myResult", "$bookUserResult"] },
      },
    },
    { $unwind: "$allData" },
    { $replaceRoot: { newRoot: "$allData" } },
  ];

  const arrCash = await PunterFinalsheetRecords.aggregate(pipeline);*/

  const q1 = await PunterFinalsheetRecords.aggregate([
  {
    $match: {
      user_id: { $in: downlineIds },
      type: 2
    }
  },
  {
    $group: {
      _id: null,
      cashAmount: { $sum: { $ifNull: ["$upline_share_amount", 0] } }
    }
  }
]);

const downlineCash = q1[0]?.cashAmount || 0;

// -----------------------------
// 3. Query 2: Master my_share_amount (type = 2)
// -----------------------------
const q2 = await PunterFinalsheetRecords.aggregate([
  {
    $match: {
      user_id: master_id,
      type: 2
    }
  },
  {
    $group: {
      _id: null,
      cashAmount: { $sum: { $ifNull: ["$my_share_amount", 0] } }
    }
  }
]);

const masterMyCash = q2[0]?.cashAmount || 0;

// -----------------------------
// 4. Query 3: Master upline_share_amount (type = 2)
// -----------------------------
const q3 = await PunterFinalsheetRecords.aggregate([
  {
    $match: {
      user_id: master_id,
      type: 2
    }
  },
  {
    $group: {
      _id: null,
      cashAmount: { $sum: { $ifNull: ["$upline_share_amount", 0] } }
    }
  }
]);

const masterUplineCash = q3[0]?.cashAmount || 0;

// -----------------------------
// 5. Build Final Result (arrCash)
// MATCHES SQL OUTPUT EXACTLY
// -----------------------------

const arrCash = [
  {
    cashAmount: downlineCash + masterMyCash, // corresponds to SQL union group
    rtype: "my",
    user_id: master_id
  },
  {
    cashAmount: masterUplineCash,
    rtype: "bookuser",
    user_id: master_id
  }
];
  console.log("arrCash", arrCash);

  for (const cash of arrCash) {
    user_id = cash.user_id;
    cashAmount = cash.cashAmount;
    rtype = cash.rtype;

    const sqlUser = await Punter.findOne(
      { _id: user_id },
      {
        _id: 1,
        uname: 1,
        transaction_pl: 1,
        upline_balance: 1,
        sponser_id: 1,
        bz_balance: 1,
      }
    ).lean();

    uname = sqlUser.uname;
    let arr = {};
    //arr._id = user_id;
    if (rtype == "my") {
      arr.uname = "CASH";
    } else if (rtype == "bookuser") {
      arr.uname = "BOOK";
      cashAmount = cashAmount + upline_share_amount_book;
    } else {
      arr.uname = uname;
    }
    arr.user_id = user_id;

    // arr.is_owner = 0;
    // arr.is_pl = 0;
    arr.winAmount = parseInt(cashAmount);
    records.push(arr);
  }
let plusTotal = 0;
let minusTotal = 0;

for (const finalRec of records)
		{
			winAmount = finalRec.winAmount;
			if(winAmount>=0)
			{
                plus.push(finalRec);
                plusTotal += winAmount;
			}
			else
			{	
                minus.push(finalRec);
                minusTotal += winAmount;
			}
		}

        let returnArray = {};
		returnArray.plus = plus;
		returnArray.minus = minus;
  //console.log("Final Records with Downlines:", returnArray);

  return res.status(200).json({ minus, plus, minusTotal, plusTotal });
  } catch (err) {
    console.error("Error in getFinalSheetDataRoutes:", err);
    res.status(200).json({ error: "Internal server error" });
  }
});

module.exports = router;
