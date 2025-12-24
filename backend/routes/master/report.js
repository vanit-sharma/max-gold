const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Punter = require("../../models/Punter");
const BzBtPunterTransSummary = require("../../models/BzBtPunterTransSummary");
//router.use(auth);

router.post("/profit-loss-report-by-date", async (req, res) => {
  try {
    const userId = new ObjectId("68ac560d44bf08d635ec46e5");

    //This is the logged in user
    const masterId = new ObjectId("68ac556c44bf08d635ec46ae"); // this is the user
    // For testing purpose hardcoded dates
    const from = new Date("2025-08-01T00:00:00Z");
    const to = new Date("2025-09-24T00:00:00Z");

    // Fetch user details for userId
    const user = await Punter.findOne({ _id: userId })
      .select("sponser_id user_role sponsor uname")
      .lean();

    /*
      const report = await BzBtPunterTransSummary.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: "$punterId",
            totalProfitLoss: { $sum: "$profitLoss" }
          }
        }
      ]);

      res.json(report);
      */
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
