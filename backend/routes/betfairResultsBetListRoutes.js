const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const Punter = require("../models/Punter");
const BzBetfairHoldRate = require("../models/BzBetfairHoldRate");
const BzBetfairTurboHoldRate = require("../models/BzBetfairTurboHoldRate");
const BzBetfairBlackjackRate = require("../models/BzBetfairBlackjackRate");
const BzBetfairTurboBlackjackRate = require("../models/BzBetfairTurboBlackjackRate");
const BzBetfairBaccaratRate = require("../models/BzBetfairBaccaratRate");
const BzBetfairTurboBaccaratRate = require("../models/BzBetfairTurboBaccaratRate");
const BzBetfairHiloRates = require("../models/BzBetfairHiloRates");
const BzBetfairTurboHiloRate = require("../models/BzBetfairTurboHiloRate");
const BzBetfairOmahaRate = require("../models/BzBetfairOmahaRate");

router.use(auth);

router.post("/", async (req, res) => {
  let game_type = req.body.game_type;


  if (game_type === "betfair-hold") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairHoldRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-turbo-hold") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairTurboHoldRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-blackjack") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairBlackjackRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-turbo-blackjack") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairTurboBlackjackRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-baccarat") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairBaccaratRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-turbo-baccarat") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairTurboBaccaratRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-hilo") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairHiloRates.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-turbo-hilo") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairTurboHiloRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }else if (game_type === "betfair-omaha") {
    let obj = {};
    obj.stld = 0;

    const results_list = await BzBetfairOmahaRate.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(10);

    res.json({ results_list: results_list });
  }

});

module.exports = router;
