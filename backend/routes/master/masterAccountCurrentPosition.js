const express = require("express");
const router = express.Router();
const Punter = require("../../models/Punter");
const auth = require("../../middleware/agentAuth");
const mongoose = require("mongoose");
const BetfairEventBets = require("../../models/BetfairEventBets");
const LastDigitBet = require("../../models/LastDigitBet");
const BetBookSummary = require("../../models/BetBookSummary");
const PunterTransDetails = require("../../models/PunterTransDetails");

const moment = require("moment");

router.use(auth);

router.post("/", auth, async (req, res) => {
  let rsCricket = [];
  let result = {};
  let cric = [];
  let totalExpouser;

  let Name = null;
  let bet_game_type = null;
  let CatMid = null;
  let newrnr1s = null;
  let newrnr2s = null;
  let newrnr3s = null;
  let parent_cat_mid = null;
  let mType = null;
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  const master_id = req.user._id;

  const punter = await Punter.findOne({ _id: userId });

  if (punter.user_role === 8) {
    // Query 1: MatchOdd (market_type = 1)

    const matchOddPipeline = [
      {
        $match: {
          bet_game_type: 1,
          stld: 0,
          market_type: 1,
          user_id: userId,
          "punterSharing.master_id": master_id,
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events",
          localField: "cat_mid",
          foreignField: "cat_mid",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          cat_mid: 1,
          evt_evt: "$event.evt_evt",
          evt_status: "$event.evt_status",
          n0: { $multiply: ["$rnr1s", 1] },
          n1: { $multiply: ["$rnr2s", 1] },
          n2: { $multiply: ["$rnr3s", 1] },
        },
      },
      {
        $group: {
          _id: "$cat_mid",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          Name: { $first: "$evt_evt" },
          eventStatus: { $first: "$evt_status" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: { $literal: 0 },
          n4: { $literal: 0 },
          n5: { $literal: 0 },
          n6: { $literal: 0 },
          n7: { $literal: 0 },
          n8: { $literal: 0 },
          n9: { $literal: 0 },
          Name: 1,
          EventType: { $literal: "MatchOdd" },
          CatMid: "$_id",
          eventStatus: 1,
        },
      },
    ];

    const matchedRs = await BetfairEventBets.aggregate(matchOddPipeline);

    // Query 2: BookMaker (market_type = 2)
    const bookMakerPipeline = [
      {
        $match: {
          bet_game_type: 1,
          stld: 0,
          market_type: 2,
          user_id: userId,
          "punterSharing.master_id": master_id,
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events",
          localField: "cat_mid",
          foreignField: "cat_mid",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          cat_mid: 1,
          evt_evt: "$event.evt_evt",
          evt_status: "$event.evt_status",
          n0: { $multiply: ["$rnr1s", 1] },
          n1: { $multiply: ["$rnr2s", 1] },
          n2: { $multiply: ["$rnr3s", 1] },
        },
      },
      {
        $group: {
          _id: "$cat_mid",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          Name: { $first: "$evt_evt" },
          eventStatus: { $first: "$evt_status" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: { $literal: 0 },
          n4: { $literal: 0 },
          n5: { $literal: 0 },
          n6: { $literal: 0 },
          n7: { $literal: 0 },
          n8: { $literal: 0 },
          n9: { $literal: 0 },
          Name: 1,
          EventType: { $literal: "BookMaker" },
          CatMid: "$_id",
          eventStatus: 1,
        },
      },
    ];

    // Query 3: Tie (market_type = 5) - with sharing calculation
    // First get punter users under this master
    const punterUsers = await Punter.find({
      full_chain: new RegExp(`,${userId},`),
      user_role: 8,
    }).distinct("_id");

    const tiePipeline = [
      {
        $match: {
          bet_game_type: 1,
          stld: 0,
          market_type: 5,
          user_id: { $in: punterUsers },
        },
      },
      {
        $unwind: "$punterSharing",
      },
      {
        $match: {
          "punterSharing.master_id": master_id,
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events",
          localField: "cat_mid",
          foreignField: "cat_mid",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          parent_cat_mid: "$event.parent_cat_mid",
          evt_evt: "$event.evt_evt",
          evt_status: "$event.evt_status",
          n0: {
            $divide: [{ $multiply: ["$rnr1s", "$punterSharing.sharing"] }, 100],
          },
          n1: {
            $divide: [{ $multiply: ["$rnr2s", "$punterSharing.sharing"] }, 100],
          },
          n2: {
            $divide: [{ $multiply: ["$rnr3s", "$punterSharing.sharing"] }, 100],
          },
        },
      },
      {
        $group: {
          _id: "$parent_cat_mid",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          Name: { $first: "$evt_evt" },
          eventStatus: { $first: "$evt_status" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: { $literal: 0 },
          n4: { $literal: 0 },
          n5: { $literal: 0 },
          n6: { $literal: 0 },
          n7: { $literal: 0 },
          n8: { $literal: 0 },
          n9: { $literal: 0 },
          Name: 1,
          EventType: { $literal: "Tie" },
          CatMid: "$_id",
          eventStatus: 1,
        },
      },
    ];

    // Query 4: Last Figure - with sharing calculation
    const lastFigurePipeline = [
      {
        $match: {
          stld: 0,
          user_id: { $in: punterUsers },
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events_bets",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user_id", "$$userId"] },
              },
            },
            { $unwind: "$punterSharing" },
            {
              $match: {
                "punterSharing.master_id": master_id,
              },
            },
            {
              $project: {
                sharing: "$punterSharing.sharing",
              },
            },
          ],
          as: "sharingData",
        },
      },
      { $unwind: "$sharingData" },
      {
        $project: {
          cat_mid: 1,
          lastdigit_id: 1,
          rnr_name: 1,
          n0: {
            $divide: [{ $multiply: ["$num_0", "$sharingData.sharing"] }, 100],
          },
          n1: {
            $divide: [{ $multiply: ["$num_1", "$sharingData.sharing"] }, 100],
          },
          n2: {
            $divide: [{ $multiply: ["$num_2", "$sharingData.sharing"] }, 100],
          },
          n3: {
            $divide: [{ $multiply: ["$num_3", "$sharingData.sharing"] }, 100],
          },
          n4: {
            $divide: [{ $multiply: ["$num_4", "$sharingData.sharing"] }, 100],
          },
          n5: {
            $divide: [{ $multiply: ["$num_5", "$sharingData.sharing"] }, 100],
          },
          n6: {
            $divide: [{ $multiply: ["$num_6", "$sharingData.sharing"] }, 100],
          },
          n7: {
            $divide: [{ $multiply: ["$num_7", "$sharingData.sharing"] }, 100],
          },
          n8: {
            $divide: [{ $multiply: ["$num_8", "$sharingData.sharing"] }, 100],
          },
          n9: {
            $divide: [{ $multiply: ["$num_9", "$sharingData.sharing"] }, 100],
          },
        },
      },
      {
        $group: {
          _id: "$lastdigit_id",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          n3: { $sum: "$n3" },
          n4: { $sum: "$n4" },
          n5: { $sum: "$n5" },
          n6: { $sum: "$n6" },
          n7: { $sum: "$n7" },
          n8: { $sum: "$n8" },
          n9: { $sum: "$n9" },
          Name: { $first: "$rnr_name" },
          CatMid: { $first: "$cat_mid" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: 1,
          n4: 1,
          n5: 1,
          n6: 1,
          n7: 1,
          n8: 1,
          n9: 1,
          Name: 1,
          EventType: { $literal: "Last Figure" },
          CatMid: 1,
          eventStatus: { $literal: "OPEN" },
        },
      },
    ];

    // Execute all queries
    const [matchOdd, bookMaker, tie, lastFigure] = await Promise.all([
      BetfairEventBets.aggregate(matchOddPipeline),
      BetfairEventBets.aggregate(bookMakerPipeline),
      BetfairEventBets.aggregate(tiePipeline),
      LastDigitBet.aggregate(lastFigurePipeline),
    ]);

    // Combine all results (UNION equivalent)
    rsCricket = [...matchOdd, ...bookMaker, ...tie, ...lastFigure];
  } else {
    const punterUsers = await Punter.find({
      full_chain: new RegExp(`,${master_id},`),
      user_role: 8,
    }).distinct("_id");

    // Query 1: MatchOdd (market_type = 1) - WITH sharing calculation
    const matchOddPipeline = [
      {
        $match: {
          bet_game_type: 1,
          stld: 0,
          market_type: 1,
          user_id: { $in: punterUsers },
        },
      },
      {
        $unwind: "$punterSharing",
      },
      {
        $match: {
          "punterSharing.master_id": master_id,
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events",
          localField: "cat_mid",
          foreignField: "cat_mid",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          cat_mid: 1,
          evt_evt: "$event.evt_evt",
          evt_status: "$event.evt_status",
          n0: {
            $divide: [{ $multiply: ["$rnr1s", "$punterSharing.sharing"] }, 100],
          },
          n1: {
            $divide: [{ $multiply: ["$rnr2s", "$punterSharing.sharing"] }, 100],
          },
          n2: {
            $divide: [{ $multiply: ["$rnr3s", "$punterSharing.sharing"] }, 100],
          },
        },
      },
      {
        $group: {
          _id: "$cat_mid",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          Name: { $first: "$evt_evt" },
          eventStatus: { $first: "$evt_status" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: { $literal: 0 },
          n4: { $literal: 0 },
          n5: { $literal: 0 },
          n6: { $literal: 0 },
          n7: { $literal: 0 },
          n8: { $literal: 0 },
          n9: { $literal: 0 },
          Name: 1,
          EventType: { $literal: "MatchOdd" },
          CatMid: "$_id",
          eventStatus: 1,
        },
      },
    ];

    // Query 2: BookMaker (market_type = 2) - WITH sharing calculation
    const bookMakerPipeline = [
      {
        $match: {
          bet_game_type: 1,
          stld: 0,
          market_type: 2,
          user_id: { $in: punterUsers },
        },
      },
      {
        $unwind: "$punterSharing",
      },
      {
        $match: {
          "punterSharing.master_id": master_id,
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events",
          localField: "cat_mid",
          foreignField: "cat_mid",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          cat_mid: 1,
          evt_evt: "$event.evt_evt",
          evt_status: "$event.evt_status",
          n0: {
            $divide: [{ $multiply: ["$rnr1s", "$punterSharing.sharing"] }, 100],
          },
          n1: {
            $divide: [{ $multiply: ["$rnr2s", "$punterSharing.sharing"] }, 100],
          },
          n2: {
            $divide: [{ $multiply: ["$rnr3s", "$punterSharing.sharing"] }, 100],
          },
        },
      },
      {
        $group: {
          _id: "$cat_mid",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          Name: { $first: "$evt_evt" },
          eventStatus: { $first: "$evt_status" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: { $literal: 0 },
          n4: { $literal: 0 },
          n5: { $literal: 0 },
          n6: { $literal: 0 },
          n7: { $literal: 0 },
          n8: { $literal: 0 },
          n9: { $literal: 0 },
          Name: 1,
          EventType: { $literal: "BookMaker" },
          CatMid: "$_id",
          eventStatus: 1,
        },
      },
    ];

    // Query 3: Tie (market_type = 5) - WITH sharing calculation
    const tiePipeline = [
      {
        $match: {
          bet_game_type: 1,
          stld: 0,
          market_type: 5,
          user_id: { $in: punterUsers },
        },
      },
      {
        $unwind: "$punterSharing",
      },
      {
        $match: {
          "punterSharing.master_id": master_id,
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events",
          localField: "cat_mid",
          foreignField: "cat_mid",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          parent_cat_mid: "$event.parent_cat_mid",
          evt_evt: "$event.evt_evt",
          evt_status: "$event.evt_status",
          n0: {
            $divide: [{ $multiply: ["$rnr1s", "$punterSharing.sharing"] }, 100],
          },
          n1: {
            $divide: [{ $multiply: ["$rnr2s", "$punterSharing.sharing"] }, 100],
          },
          n2: {
            $divide: [{ $multiply: ["$rnr3s", "$punterSharing.sharing"] }, 100],
          },
        },
      },
      {
        $group: {
          _id: "$parent_cat_mid",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          Name: { $first: "$evt_evt" },
          eventStatus: { $first: "$evt_status" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: { $literal: 0 },
          n4: { $literal: 0 },
          n5: { $literal: 0 },
          n6: { $literal: 0 },
          n7: { $literal: 0 },
          n8: { $literal: 0 },
          n9: { $literal: 0 },
          Name: 1,
          EventType: { $literal: "Tie" },
          CatMid: "$_id",
          eventStatus: 1,
        },
      },
    ];

    // Query 4: Last Figure - WITH sharing calculation
    const lastFigurePipeline = [
      {
        $match: {
          stld: 0,
          user_id: { $in: punterUsers },
        },
      },
      {
        $lookup: {
          from: "bz_betfair_events_bets",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user_id", "$$userId"] },
              },
            },
            { $unwind: "$punterSharing" },
            {
              $match: {
                "punterSharing.master_id": master_id,
              },
            },
            {
              $project: {
                sharing: "$punterSharing.sharing",
              },
            },
            { $limit: 1 },
          ],
          as: "sharingData",
        },
      },
      { $unwind: "$sharingData" },
      {
        $project: {
          cat_mid: 1,
          lastdigit_id: 1,
          rnr_name: 1,
          n0: {
            $divide: [{ $multiply: ["$num_0", "$sharingData.sharing"] }, 100],
          },
          n1: {
            $divide: [{ $multiply: ["$num_1", "$sharingData.sharing"] }, 100],
          },
          n2: {
            $divide: [{ $multiply: ["$num_2", "$sharingData.sharing"] }, 100],
          },
          n3: {
            $divide: [{ $multiply: ["$num_3", "$sharingData.sharing"] }, 100],
          },
          n4: {
            $divide: [{ $multiply: ["$num_4", "$sharingData.sharing"] }, 100],
          },
          n5: {
            $divide: [{ $multiply: ["$num_5", "$sharingData.sharing"] }, 100],
          },
          n6: {
            $divide: [{ $multiply: ["$num_6", "$sharingData.sharing"] }, 100],
          },
          n7: {
            $divide: [{ $multiply: ["$num_7", "$sharingData.sharing"] }, 100],
          },
          n8: {
            $divide: [{ $multiply: ["$num_8", "$sharingData.sharing"] }, 100],
          },
          n9: {
            $divide: [{ $multiply: ["$num_9", "$sharingData.sharing"] }, 100],
          },
        },
      },
      {
        $group: {
          _id: "$lastdigit_id",
          n0: { $sum: "$n0" },
          n1: { $sum: "$n1" },
          n2: { $sum: "$n2" },
          n3: { $sum: "$n3" },
          n4: { $sum: "$n4" },
          n5: { $sum: "$n5" },
          n6: { $sum: "$n6" },
          n7: { $sum: "$n7" },
          n8: { $sum: "$n8" },
          n9: { $sum: "$n9" },
          Name: { $first: "$rnr_name" },
          CatMid: { $first: "$cat_mid" },
        },
      },
      {
        $project: {
          _id: 0,
          n0: 1,
          n1: 1,
          n2: 1,
          n3: 1,
          n4: 1,
          n5: 1,
          n6: 1,
          n7: 1,
          n8: 1,
          n9: 1,
          Name: 1,
          EventType: { $literal: "Last Figure" },
          CatMid: 1,
          eventStatus: { $literal: "OPEN" },
        },
      },
    ];

    // Execute all queries in parallel
    const [matchOdd, bookMaker, tie, lastFigure] = await Promise.all([
      BetfairEventBets.aggregate(matchOddPipeline),
      BetfairEventBets.aggregate(bookMakerPipeline),
      BetfairEventBets.aggregate(tiePipeline),
      LastDigitBet.aggregate(lastFigurePipeline),
    ]);

    // Combine all results (UNION equivalent)
    rsCricket = [...matchOdd, ...bookMaker, ...tie, ...lastFigure];
  }

  if (rsCricket.length > 0) {
    for (const drCricket of rsCricket) {
      const Name = drCricket.Name;
      const EventType = drCricket.EventType;
      const CatMid = drCricket.CatMid;

      const eventStatus = drCricket.eventStatus;

      if (EventType == "Fancy") {
        // Fetch evt_evt from bz_betfair_events where cat_mid = CatMid
        const drstBet = await BetfairEventBets.findOne(
          { cat_mid: CatMid },
          { evt_evt: 1 }
        );
        const evt_evt = drstBet.evt_evt;

        drCricket.CatMid = CatMid;

        Name = evt_evt + " / " + Name;
        drCricket.Name = Name;
        let n0 = parseInt(drCricket.n0);
        if (n0 > 0) {
          n0 = 0 - n0;
        } else {
          n0 = Math.abs(n0);
        }

        let n1 = parseInt(drCricket.n1);
        if (n1 > 0) {
          n1 = 0 - n1;
        } else {
          n1 = Math.abs(n1);
        }

        let minvalue = Math.min(n0, n1);
        totalExpouser = totalExpouser + minvalue;
        drCricket.Amount = parseInt(minvalue);
      } else if (EventType == "MatchOdd") {
        let n0 = parseInt(drCricket.n0);
        if (n0 > 0) {
          n0 = 0 - n0;
        } else {
          n0 = Math.abs(n0);
        }

        let n1 = parseInt(drCricket.n1);

        if (n1 > 0) {
          n1 = 0 - n1;
        } else {
          n1 = Math.abs(n1);
        }

        let n2 = parseInt(drCricket.n2);
        if (n2 > 0) {
          n2 = 0 - n2;
        } else {
          n2 = Math.abs(n2);
        }

        let minvalue = Math.min(n0, n1, n2);
        drCricket["Name"] = Name;
        drCricket["Type"] = "MATCH ODD";

        drCricket["Amount"] = parseInt(minvalue);
        totalExpouser = totalExpouser + minvalue;
      } else if (EventType == "BookMaker") {
        let n0 = parseInt(drCricket.n0);
        if (n0 > 0) {
          n0 = 0 - n0;
        } else {
          n0 = Math.abs(n0);
        }

        let n1 = parseInt(drCricket.n1);
        if (n1 > 0) {
          n1 = 0 - n1;
        } else {
          n1 = Math.abs(n1);
        }

        let n2 = parseInt(drCricket.n2);
        if (n2 > 0) {
          n2 = 0 - n2;
        } else {
          n2 = Math.abs(n2);
        }

        let minvalue = Math.min(n0, n1, n2);
        drCricket.Amount = parseInt(minvalue);
        totalExpouser = totalExpouser + minvalue;
        drCricket.Name = Name;
        drCricket.Type = "BOOKMAKER";
      } else if (EventType == "Tie") {
        let n0 = parseInt(drCricket.n0);
        if (n0 > 0) {
          n0 = 0 - n0;
        } else {
          n0 = Math.abs(n0);
        }

        let n1 = parseInt(drCricket.n1);
        if (n1 > 0) {
          n1 = 0 - n1;
        } else {
          n1 = Math.abs(n1);
        }

        let n2 = parseInt(drCricket.n2);
        if (n2 > 0) {
          n2 = 0 - n2;
        } else {
          n2 = Math.abs(n2);
        }

        let minvalue = Math.min(n0, n1, n2);
        drCricket.Amount = parseInt(minvalue);
        drCricket.Name = Name;
        drCricket.Type = "TIE";
        totalExpouser = totalExpouser + minvalue;
      } else if (EventType == "Last Figure") {
        Name = Name + " / Last Digit Figure";
        drCricket.Name = Name;
        let n0 = parseInt(drCricket.n0);
        if (n0 > 0) {
          n0 = 0 - n0;
        } else {
          n0 = Math.abs(n0);
        }

        let n1 = parseInt(drCricket.n1);
        if (n1 > 0) {
          n1 = 0 - n1;
        } else {
          n1 = Math.abs(n1);
        }

        let n2 = parseInt(drCricket.n2);
        if (n2 > 0) {
          n2 = 0 - n2;
        } else {
          n2 = Math.abs(n2);
        }

        let n3 = parseInt(drCricket.n3);
        if (n3 > 0) {
          n3 = 0 - n3;
        } else {
          n3 = Math.abs(n3);
        }

        let n4 = parseInt(drCricket.n4);
        if (n4 > 0) {
          n4 = 0 - n4;
        } else {
          n4 = Math.abs(n4);
        }

        let n5 = parseInt(drCricket.n5);
        if (n5 > 0) {
          n5 = 0 - n5;
        } else {
          n5 = Math.abs(n5);
        }

        let n6 = parseInt(drCricket.n6);
        if (n6 > 0) {
          n6 = 0 - n6;
        } else {
          n6 = Math.abs(n6);
        }

        let n7 = parseInt(drCricket.n7);
        if (n7 > 0) {
          n7 = 0 - n7;
        } else {
          n7 = Math.abs(n7);
        }

        let n8 = parseInt(drCricket.n8);
        if (n8 > 0) {
          n8 = 0 - n8;
        } else {
          n8 = Math.abs(n8);
        }

        let n9 = parseInt(drCricket.n9);
        if (n9 > 0) {
          n9 = 0 - n9;
        } else {
          n9 = Math.abs(n9);
        }

        let minvalue = Math.min(n0, n1, n2, n3, n4, n5, n6, n7, n8, n9);
        drCricket.Amount = parseInt(minvalue);
        drCricket.Type = "FIGURE";
        totalExpouser = totalExpouser + minvalue;
      }
      cric.push(drCricket);
    }
  }

  result.cricket = cric;

  football = [];
  tennis = [];
  /*
			$sqlFoot = "SELECT SUM(n0) as n0,SUM(n1) as n1 ,SUM(n2) as n2,evt_evt as Name,bet_game_type,cat_mid as CatMid,parent_cat_mid,mType,evt_status as eventStatus FROM(SELECT bz_betfair_events_bets.*,bz_bt_punter_master_sharing.sharing, bz_betfair_events.evt_evt,bz_betfair_events.parent_cat_mid,bz_betfair_events.evt_status,bz_betfair_events_bets.market_type as mType,((rnr1s*sharing)/100) as n0,((rnr2s*sharing)/100) as n1,((rnr3s*sharing)/100) as n2 FROM `bz_betfair_events_bets` INNER JOIN bz_bt_punter_master_sharing ON bz_betfair_events_bets.user_id = bz_bt_punter_master_sharing.user_id INNER JOIN bz_betfair_events ON bz_betfair_events_bets.cat_mid = bz_betfair_events.cat_mid where bz_betfair_events_bets.stld=0 and bz_bt_punter_master_sharing.master_id='$master_id' and bz_betfair_events_bets.market_type IN(1,6) and bet_game_type IN(2,3) and bz_betfair_events_bets.user_id IN(SELECT sno FROM `bz_bt_punter` where full_chain like '%,$master_id,%' and user_role=8)) as tt group by cat_mid,bet_game_type";
*/

  const rsFoot = await BetfairEventBets.aggregate([
    {
      $match: {
        stld: 0,
        market_type: { $in: [1, 6] },
        bet_game_type: { $in: [2, 3] },
      },
    },
    {
      $addFields: {
        masterSharing: {
          $first: {
            $filter: {
              input: "$punterSharing",
              as: "ps",
              cond: { $eq: ["$$ps.master_id", master_id] },
            },
          },
        },
      },
    },
    {
      $match: {
        masterSharing: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "bz_betfair_events",
        localField: "cat_mid",
        foreignField: "cat_mid",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $addFields: {
        n0: {
          $multiply: ["$rnr1s", { $divide: ["$masterSharing.sharing", 100] }],
        },
        n1: {
          $multiply: ["$rnr2s", { $divide: ["$masterSharing.sharing", 100] }],
        },
        n2: {
          $multiply: ["$rnr3s", { $divide: ["$masterSharing.sharing", 100] }],
        },
      },
    },
    {
      $group: {
        _id: {
          cat_mid: "$cat_mid",
          bet_game_type: "$bet_game_type",
        },
        n0: { $sum: "$n0" },
        n1: { $sum: "$n1" },
        n2: { $sum: "$n2" },
        Name: { $first: "$event.evt_evt" },
        parent_cat_mid: { $first: "$event.parent_cat_mid" },
        mType: { $first: "$market_type" },
        eventStatus: { $first: "$event.evt_status" },
      },
    },
    {
      $project: {
        _id: 0,
        CatMid: "$_id.cat_mid",
        bet_game_type: "$_id.bet_game_type",
        Name: 1,
        parent_cat_mid: 1,
        mType: 1,
        eventStatus: 1,
        n0: 1,
        n1: 1,
        n2: 1,
      },
    },
  ]);

  if (rsFoot.length > 0) {
    for (const drRow of rsFoot) {
      Name = drRow.Name;
      bet_game_type = drRow.bet_game_type;
      CatMid = drRow.CatMid;
      newrnr1s = drRow.n0;
      newrnr2s = drRow.n1;
      newrnr3s = drRow.n2;
      parent_cat_mid = drRow.parent_cat_mid;
      mType = drRow.mType;

      if (bet_game_type == 2) {
        if (newrnr1s > 0) {
          newrnr1s = 0 - newrnr1s;
        } else {
          newrnr1s = Math.abs(newrnr1s);
        }

        if (newrnr2s > 0) {
          newrnr2s = 0 - newrnr2s;
        } else {
          newrnr2s = Math.abs(newrnr2s);
        }

        if (newrnr3s > 0) {
          newrnr3s = 0 - newrnr3s;
        } else {
          newrnr3s = Math.abs(newrnr3s);
        }

        const minvalue = Math.min(newrnr1s, newrnr2s, newrnr3s);
        drRow.Name = Name;
        drRow.Amount = parseInt(minvalue);
        drRow.Type = "MATCH ODD";
        totalExpouser = totalExpouser + minvalue;
        if (mType == 6 || mType == 7) {
          drRow.CatMid = parent_cat_mid;
        } else {
          drRow.CatMid = CatMid;
        }

        football.push(drRow);
      } else {
        if (newrnr1s > 0) {
          newrnr1s = 0 - newrnr1s;
        } else {
          newrnr1s = Math.abs(newrnr1s);
        }

        if (newrnr2s > 0) {
          newrnr2s = 0 - newrnr2s;
        } else {
          newrnr2s = Math.abs(newrnr2s);
        }

        minvalue = Math.min(newrnr1s, newrnr2s);

        drRow.Name = Name;
        drRow.Amount = parseInt(minvalue);
        drRow.Type = "MATCH ODD";
        totalExpouser = totalExpouser + minvalue;
        drRow.CatMid = CatMid;
        tennis.push(drRow);
      }
    }
  }

  result.football = football;
  result.tennis = tennis;

  horse = [];
  grayhound = [];
  /*
			$sqlRace = "SELECT Amount,CatMid,Name,bet_game_type,evt_status as eventStatus FROM (SELECT SUM(n0) as Amount,runner_sid,cat_mid as CatMid,evt_evt as Name,bet_game_type,evt_status from(SELECT bz_betfair_events_bets.cat_mid,bet_book_summary.runner_sid,bet_book_summary.amount,bz_betfair_events.evt_evt,bz_betfair_events.evt_status,bz_bt_punter_master_sharing.sharing, ((bet_book_summary.amount*sharing)/100) as n0,bet_game_type FROM `bz_betfair_events_bets` INNER JOIN bet_book_summary ON bz_betfair_events_bets.sno = bet_book_summary.bet_summary_id INNER JOIN bz_betfair_events ON bz_betfair_events_bets.cat_mid = bz_betfair_events.cat_mid INNER JOIN bz_bt_punter_master_sharing ON bet_book_summary.user_id = bz_bt_punter_master_sharing.user_id WHERE bz_betfair_events_bets.stld=0 and bz_bt_punter_master_sharing.master_id='$master_id' and bet_game_type IN(4,5) and bz_betfair_events_bets.user_id IN(SELECT sno FROM `bz_bt_punter` where full_chain like '%,$master_id,%' and user_role=8)) as tt group by runner_sid order by n0 desc) as vv group by CatMid";*/

  /*const rsRace = await BetfairEventBets.aggregate([
    {
      $match: {
        stld: 0,
        bet_game_type: { $in: [4, 5] },
      },
    },

    {
      $lookup: {
        from: "bet_book_summary",
        localField: "_id",
        foreignField: "bet_summary_id",
        as: "book",
      },
    },
    { $unwind: "$book" },

    {
      $addFields: {
        masterSharing: {
          $first: {
            $filter: {
              input: "$punterSharing",
              as: "ps",
              cond: { $eq: ["$$ps.master_id", master_id] },
            },
          },
        },
      },
    },
    {
      $match: {
        masterSharing: { $ne: null },
      },
    },

    {
      $lookup: {
        from: "bz_betfair_events",
        localField: "cat_mid",
        foreignField: "cat_mid",
        as: "event",
      },
    },
    { $unwind: "$event" },

    {
      $addFields: {
        n0: {
          $multiply: [
            "$book.amount",
            { $divide: ["$masterSharing.sharing", 100] },
          ],
        },
      },
    },

    {
      $group: {
        _id: {
          runner_sid: "$book.runner_sid",
          cat_mid: "$cat_mid",
        },
        Amount: { $sum: "$n0" },
        Name: { $first: "$event.evt_evt" },
        bet_game_type: { $first: "$bet_game_type" },
        eventStatus: { $first: "$event.evt_status" },
      },
    },

    {
      $sort: {
        Amount: -1,
      },
    },

    {
      $group: {
        _id: "$_id.cat_mid",
        Amount: { $sum: "$Amount" },
        Name: { $first: "$Name" },
        bet_game_type: { $first: "$bet_game_type" },
        eventStatus: { $first: "$eventStatus" },
      },
    },

    {
      $project: {
        _id: 0,
        Amount: 1,
        CatMid: "$_id",
        Name: 1,
        bet_game_type: 1,
        eventStatus: 1,
      },
    },
  ]);
*/

  const rsRace = await BetfairEventBets.aggregate([
    {
      $match: {
        stld: 0,
        bet_game_type: { $in: [4, 5] }
      }
    },

    {
      $lookup: {
        from: "bet_book_summary",
        localField: "_id",
        foreignField: "bet_summary_id",
        as: "book"
      }
    },
    { $unwind: "$book" },

    {
      $addFields: {
        masterSharing: {
          $first: {
            $filter: {
              input: "$punterSharing",
              as: "ps",
              cond: { $eq: ["$$ps.master_id", master_id] }
            }
          }
        }
      }
    },
    {
      $match: {
        masterSharing: { $ne: null }
      }
    },

    {
      $lookup: {
        from: "bz_betfair_events",
        localField: "cat_mid",
        foreignField: "cat_mid",
        as: "event"
      }
    },
    { $unwind: "$event" },

    {
      $addFields: {
        n0: {
          $multiply: [
            "$book.amount",
            { $divide: ["$masterSharing.sharing", 100] }
          ]
        },
        percentage: "$masterSharing.sharing",
        user_id: "$book.user_id"
      }
    },

    {
      $group: {
        _id: {
          runner_sid: "$book.runner_sid",
          cat_mid: "$cat_mid"
        },
        Amount: { $sum: "$n0" },
        percentage: { $first: "$percentage" },
        user_id: { $first: "$user_id" },
        Name: { $first: "$event.evt_evt" },
        bet_game_type: { $first: "$bet_game_type" },
        eventStatus: { $first: "$event.evt_status" },
        Venue: { $first: "$event.venue" },
        CountryCode: { $first: "$event.countryCode" },
        evt_od: { $first: "$event.evt_od" },
        matchSummaryText4: { $first: "$event.matchSummaryText4" }
      }
    },

    {
      $sort: {
        Amount: -1
      }
    },

    {
      $group: {
        _id: "$_id.cat_mid",
        Amount: { $sum: "$Amount" },
        percentage: { $first: "$percentage" },
        user_id: { $first: "$user_id" },
        Name: { $first: "$Name" },
        bet_game_type: { $first: "$bet_game_type" },
        eventStatus: { $first: "$eventStatus" },
        Venue: { $first: "$Venue" },
        CountryCode: { $first: "$CountryCode" },
        EvtOd: { $first: "$evt_od" },
        matchSummaryText4: { $first: "$matchSummaryText4" }
      }
    },

    {
      $project: {
        _id: 0,
        Amount: 1,
        percentage: 1,
        user_id: 1,
        CatMid: "$_id",
        Name: 1,
        bet_game_type: 1,
        eventStatus: 1,
        Venue: 1,
        CountryCode: 1,
        EvtOd: 1,
        matchSummaryText4: 1
      }
    }
  ]);

  console.log("rsRace", rsRace);

  if (rsRace.length > 0) {
    for (const drRow of rsRace) {
      const Name = drRow.Name;
      const CatMid = drRow.CatMid;
      let amount = drRow.Amount;
      const bet_game_type = drRow.bet_game_type;
      const eventStatus = drRow.eventStatus;
      if (amount > 0) {
        amount = 0 - amount;
      } else {
        amount = Math.abs(amount);
      }

      drRow.Name = Name;
      drRow.Amount = parseInt(amount);
      totalExpouser = totalExpouser + amount;
      drRow.CatMid = CatMid;
      drRow.eventStatus = eventStatus;
      drRow.Type = "MATCH ODD";

      // const bookSummary = await BetBookSummary.find({summary_cat_mid: CatMid, user_id: drRow.user_id, is_settled: 0});

      const percentage = drRow.percentage;

      const bookSummary = await BetBookSummary.aggregate([
        {
          $match: {
            summary_cat_mid: CatMid,
            user_id: drRow.user_id,
            is_settled: 0
          }
        },
        {
          $group: {
            _id: {
              bet_summary_id: "$bet_summary_id",
              user_id: "$user_id",
              summary_cat_mid: "$summary_cat_mid",
              bet_runner_name: "$bet_runner_name"
            },
            amount: { $sum: "$amount" }
          }
        },
        {
          $project: {
            _id: 0,
            bet_summary_id: "$_id.bet_summary_id",
            user_id: "$_id.user_id",
            summary_cat_mid: "$_id.summary_cat_mid",
            bet_runner_name: "$_id.bet_runner_name",
            amount: {
              $multiply: ["$amount", { $divide: [percentage, 100] }]
            }
          }
        }
      ]);

      //console.log("bookSummary: ", bookSummary);
      let book = [];
      if (bookSummary.length > 0) {
        for (const bs of bookSummary) {
          let bookrow = {};
          bookrow.bet_summary_id = bs.bet_summary_id;
          bookrow.user_id = bs.user_id;
          bookrow.summary_cat_mid = bs.summary_cat_mid;
          bookrow.bet_runner_name = bs.bet_runner_name;
          bookrow.amount = bs.amount * (drRow.percentage / 100);
          book.push(bookrow);
        }
      }
      drRow.book = book;
      if (bet_game_type == 4) {
        horse.push(drRow);
      } else {
        grayhound.push(drRow);
      }
    }
  }

  result.horse = horse;
  result.grayhound = grayhound;
  result.totalExpouser = totalExpouser;

  return res.json(result);

  //return res.json({ message: "end reached", rsCricket });
});

module.exports = router;
