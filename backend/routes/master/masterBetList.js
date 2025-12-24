const express = require("express");
const mongoose = require("mongoose");

const Transaction = require("../../models/PunterTransDetails");
const Punter = require("../../models/Punter");
const BtBets = require("../../models/BtBets");
const auth = require("../../middleware/auth");
const moment = require("moment-timezone");
const { getDownlineBettors } = require("../../utils/function");
const router = express.Router();

router.use(auth);

const LONDON_TZ = "Europe/London";

// POST /accountStatement
router.post("/", async (req, res) => {
  // try {
  const user = req.user;

  console.log("inside master betlist");
  if (!user || user.user_role == 8) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  //const userId = req.body.userId;
  const userId = new mongoose.Types.ObjectId(req.body.user_id);

  const punter = await Punter.findById(userId);
  //console.log("punter", punter);

  let { from_date, to_date } = req.body;

  const tz = "Europe/London";

  let startDate = moment(from_date);
  let endDate = moment(to_date);

  let obj = {};

  if (from_date && to_date) {
    const startDate = moment
      .tz(from_date, LONDON_TZ)
      .startOf("second")
      .toDate();

    const endDate = moment.tz(to_date, LONDON_TZ).endOf("second").toDate();

    obj.stmp = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  if (req.body.sports_type) {
    obj.g_type = req.body.sports_type;
  }

  if (req.body.bet_status == 1) {
    obj.is_settled = 1;
  } else if (req.body.bet_status == 0) {
    obj.is_settled = 0;
  }

  //obj.stmp = { $gte: startDate, $lte: endDate };

  console.log("punter.user_role", punter.user_role);
  if (punter.user_role == 8) {
    obj.user_id = userId;
  } else {
    // find all last betters
    const bettors = await getDownlineBettors(userId);

    console.log("bettors", bettors);
    const bettorIds = bettors.map((b) => new mongoose.Types.ObjectId(b._id));

    // safety check
    if (!bettorIds.length) {
      // return [];
    }
    obj.user_id = { $in: bettorIds };
  }
  console.log("obj->", obj);
  const bets_list = await BtBets.find(obj)
    .select(
      "-api_response -b1 -b2 -b3 -l1 -l2 -l3 -bet_device -bet_summery_id -team1_book -team2_book -team3_book"
    )
    .sort({ stmp: -1 })
    .limit(1000);
  console.log("bets_list->", bets_list);
  res.json({ bets_list });
});

// Export the router
module.exports = router;
