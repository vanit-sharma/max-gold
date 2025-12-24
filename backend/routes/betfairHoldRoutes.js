const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const Punter = require("../models/Punter");


router.use(auth);

const betSchema = Joi.object({
  amount: Joi.number().required(),
  catmid: Joi.number().required(),
  market_type: Joi.string().valid("m", "f", "s").required(), // adjust valid values as per your app
  game_name: Joi.string().required(),
  game_type: Joi.number().required(),
  round: Joi.number().integer().required(),
  odds: Joi.number().required(),
  teamname: Joi.string().required(),
  bettype: Joi.string().valid("b", "l").required(), // 'b' = back, 'l' = lay (adjust if more)
  selectRnr: Joi.number().integer().required(),
  profit: Joi.number().required(),
  marketVal:Joi.number().required(),
});

router.post("/", async (req, res) => {

  const { error, value } = betSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    game_name,
    round,
    catmid,
    market_type,
    teamname,
    bettype,
    selectRnr,
    odds,
    amount,
    profit,
    marketVal
  } = value;

  if (game_name === "betfair_hold") {
    const { placeBet } = require("../utils/better_games_bets/betFairHoldModel");
    return await placeBet(req, res);
  } else if (game_name === "betfair_turbo_hold") {
    const { placeBet } = require("../utils/better_games_bets/betFairTurboHold");
    return await placeBet(req, res);
  } else if (game_name === "betfair_blackjack") {
    const { placeBet } = require("../utils/better_games_bets/BetfairBlackjack");
    return await placeBet(req, res);
  } else if (game_name === "betfair_turbo_blackjack") {
    const {
      placeBet
    } = require("../utils/better_games_bets/BetfairTurboBlackjack");
    return placeBet(req, res);
  } else if (game_name === "betfair_baccarat") {
    const {
      placeBet
    } = require("../utils/better_games_bets/BetfairBaccarat.js");
    return await placeBet(req, res);
  } else if (game_name === "betfair_turbo_baccarat") {
    const {
      placeBet,
      placeBetFancy
    } = require("../utils/better_games_bets/BetfairTurboBaccarat.js");
    if (market_type == "m") {
      return await placeBet(req, res);
    } else if (market_type == "f") {
      return await placeBetFancy(req, res);
    }
  } else if (game_name === "betfair_hilo") {
    const { placeBet } = require("../utils/better_games_bets/BetfairHilo.js");
    return await placeBet(req, res);
  } else if (game_name === "betfair_turbo_hilo") {
    const {
      placeBet
    } = require("../utils/better_games_bets/BetfairTurboHilo.js");
    return await placeBet(req, res);
  } else if (game_name === "betfair_omaha") {
    const { placeBet } = require("../utils/better_games_bets/BetfairOmaha.js");
    return await placeBet(req, res);
  } else if (game_name === "betfair_derby") {
    const { placeBet } = require("../utils/better_games_bets/BetfairDerby.js");
    return await placeBet(req, res);
  } else if (game_name === "betfair_turbo_derby") {
    const { placeBet } = require("../utils/better_games_bets/BetfairTurboDerby.js");
    return await placeBet(req, res);
  }
  res.json({ message: "Betfair Hold Routes Working", game_name });
});

module.exports = router;
