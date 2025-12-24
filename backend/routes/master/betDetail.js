const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const moment = require("moment-timezone");
const auth = require("../../middleware/agentAuth");
const Punter = require("../../models/Punter");
const BzBtPunterTransSummary = require("../../models/BzBtPunterTransSummary");
const PunterTransDetails = require("../../models/PunterTransDetails");
const BtBets = require("../../models/BtBets");
const LastdigitBetdetails = require("../../models/LastdigitBetdetails");
const LastDigitBet = require("../../models/LastDigitBet");
const BetfairEvent = require("../../models/BetfairEvent");
const BzPtRecord = require("../../models/BzPtRecord");
const BtMatchSS = require("../../models/BtMatchSS");
const BetfairEventsRunner = require("../../models/BetfairEventsRunner");
const sportsApingRequest = require("../../utils/sportsApingRequest");
router.use(auth);

router.get("/:transid", async (req, res) => {
  const { transid } = req.params;

  if (transid) {
    const dr = await PunterTransDetails.findOne({ _id: transid });

    return res.status(200).json({ bet: dr });
  }
});
module.exports = router;
