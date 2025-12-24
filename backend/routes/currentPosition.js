const express = require("express");
const router = express.Router();
const Punter = require("../models/Punter");
const auth = require("../middleware/auth");
const Exposure = require("../models/Exposure");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.use(auth);

router.get("/", async (req, res) => {
  //console.log("here...");
  let requestUserId = req.user._id;
  //console.error("req", req);

  try {
    let objNew = {};
    objNew.user_id = new ObjectId(requestUserId);
    objNew.user_role = 8;
    objNew.isSettled = 0;

    let rspl = await Exposure.aggregate([
      {
        $match: {
          user_id: new ObjectId(requestUserId),
          user_role: 8,
          isSettled: 0
        }
      },
      {
        $group: {
          _id: {
            cat_mid: "$cat_mid",
            game_type: "$game_type",
            market_type: "$market_type"
          },
          sharing_exp_amount: { $sum: "$sharing_exp_amount" },

          // pick one value per group (same as SQL non-grouped fields)
          event_name: { $first: "$event_name" },
          parent_catmid: { $first: "$parent_catmid" },
          cat_mid: { $first: "$cat_mid" },
          runnername: { $first: "$runnername" }
        }
      },
      {
        $project: {
          _id: 0,
          cat_mid: "$_id.cat_mid",
          game_type: "$_id.game_type",
          market_type: "$_id.market_type",
          sharing_exp_amount: 1,
          runnername: 1,
          event_name: 1,
          parent_catmid: 1
        }
      }
    ]).exec();

    //console.error("rspl->", rspl);

    return res.json({
      R: true,
      recordList: rspl,
      M: ""
    });
  } catch (err) {
    console.error("Error fetching profile:", err);

    return res.status(500).json({
      R: false,
      M: "Something went wrong In cash history",
      error: err.message
    });
  }
});

module.exports = router;
