const express = require("express");
const { mongoose } = require("mongoose");

const auth = require("../middleware/auth");

const BetLock = require("../models/BetLock");
const EvenOddDetail = require("../models/EvenOddDetail");
const BetStart = require("../models/AdmBetStart");
const BtMatchEvenOdd = require("../models/BtMatchEvenOdd");
const BtBets = require("../models/BtBets");
const Punter = require("../models/Punter");
const UserLoginHistory = require("../models/BzUserLoginHistory");
const UserLogs = require("../models/UserLogs");
const BetfairEvent = require("../models/BetfairEvent");
const BetlockByMarket = require("../models/BetlockByMarket");
const BzRollDiceRates = require("./models/BzRollDiceRates");
const RollDiceMatch = require("./models/RollDiceMatch");
const getRollDiceDetails = require("./functions/getRollDiceDetails");
const placeLucky7GalaxyGameBetMultiple = require("./functions/casinoLucky7Galaxy");
const placeDragonTigerGalaxyGameBetMultiple = require("./functions/dragonTigerGalaxy");
const placeHiLoGalaxyGameBetMultiple = require("./functions/hiloGalaxy");
const placeT20GameBetMultiple = require("./functions/casino2020Galaxy.js");
const placeAndarBaharGalaxyGameBetMultiple = require("./functions/casinoAndarBaharGalaxy.js");
const casinoWarVirtual = require("./functions/casinoWarVirtual.js");
const casinoLucky7 = require("./functions/casinoLucky7.js");
const casinoCenterCardVirtual = require("./functions/casinoCenterCardVirtual.js");
const casinoDuskadumVirtual = require("./functions/casinoDuskadumVirtual.js");
const casino32CardVirtual = require("./functions/casino32CardVirtual.js");
const casinoBollywoodVirtual = require("./functions/casinoBollywoodVirtual.js");
const casinoRace17Virtual = require("./functions/casinoRace17Virtual.js");
const casinoRace20Virtual = require("./functions/casinoRace20Virtual.js");
const casinoHighCardVirtual = require("./functions/casinoHighCardVirtual.js");
const casino2020Virtual = require("./functions/casino2020Virtual.js");
const casino2020MuflisVirtual = require("./functions/casino2020MuflisVirtual.js");
const casinoAAAVirtual = require("./functions/casinoAAAVirtual.js");
const casinoAviator = require("./functions/casinoAviator.js");
const casinoAviatorX = require("./functions/casinoAviatorX.js");
const casinoHeadTail = require("./functions/casinoHeadTail.js");
//const casinoRoulette = require("./functions/casinoRoulette.js");

const router = express.Router();

router.use(auth);

// POST /casino/get-card-data
router.post("/get-card-data", async (req, res) => {
  //try {
  console.log("testing get-card-data");

  const gametype = (req.body.gametype || "").trim();
  let response;

  console.log("gametype->", gametype);

  switch (gametype) {
    case "rolldice":
      response = await getRollDiceDetails();
      break;
    case "aviator":
      response = await casinoAviator.getCardData(req);
      break;
    case "aviatorx":
      response = await casinoAviatorX.getCardData(req);
      break;
    default:
      return res.status(400).json({ error: "Invalid gametype" });
  }
  console.log("response->", response);
  res.json(response);
  //   } catch (err) {
  //     res.status(500).json({ error: "Server error" });
  //   }
});

// POST /casino/place-bet-casino-multiple
router.post("/place-bet-casino-multiple", async (req, res) => {
  console.log("testing place-bet-casino-multiple");
  //try {
  const { game_name = "", catmid } = req.body;
  if (!game_name || !catmid) {
    return res.json({
      status: false,
      message: "Information missing to place this bet.",
    });
  }

  const user_id = req.user._id;
  //const user_id = new mongoose.Types.ObjectId("68ac589644bf08d635ec4755");
  // Get latest bet lock for user
  const betLock = await BetLock.findOne({ user_id: user_id }).sort({ id: -1 });
  let casinoTpStudio = 1;
  let casinoBetfair = 1;
  if (betLock) {
    casinoTpStudio = betLock.casino_tp_studio;
    casinoBetfair = betLock.casino_betfair;
  }

  // Check user controls
  const userControls = await Punter.findOne({ _id: user_id });

  if (userControls && userControls.c_enble === 0) {
    return res.json({
      status: false,
      message: "Bet not allow for your account.",
    });
  }

  if (casinoTpStudio === 0) {
    return res.json({ status: false, message: "Bet is Locked" });
  }

  let response;
  switch (game_name) {
    case "roulette":
      response = await casinoRoulette.placeRouletteGameBetMultiple(req); // in php the name is placeDreamCatcherGameBetMultiple
      break;
    case "dream_catcher":
      response = {};
      break;
    case "lucky7galaxy_virtual":
      response = await placeLucky7GalaxyGameBetMultiple(req, userControls);
      break;
    case "andarbahar_galaxy":
      response = await placeAndarBaharGalaxyGameBetMultiple(req, userControls);
      break;
    case "dragontiger_galaxy":
      response = await placeDragonTigerGalaxyGameBetMultiple(req, userControls);
      break;
    case "hilo_galaxy":
      response = await placeHiLoGalaxyGameBetMultiple(req, userControls);
      break;
    case "card2020_galaxy":
      response = await placeT20GameBetMultiple(req, userControls);
      break;
    default:
      response = { status: false, message: "Invalid game name." };
  }
  console.log("response->", response);
  res.json(response);
  // } catch (err) {
  //     res.json({ status: false, message: "Server error." });
  // }
});

// POST /casino/place-bet-casino
router.post("/place-bet-casino", async (req, res) => {
  try {
    const { amount, market_type, game_name, odds, catmid } = req.body || {};
    if (
      amount === undefined ||
      market_type === undefined ||
      game_name === undefined ||
      odds === undefined ||
      catmid === undefined
    ) {
      return res.json({
        status: false,
        message: "Information missing to place this bet.",
      });
    }

    const user_id = req.user?._id;

    if (!user_id) {
      return res.json({ status: false, message: "User not found." });
    }

    // User controls
    const userControls = await Punter.findById(user_id, {
      c_enble: 1,
      full_chain: 1,
    }).lean();

    if (!userControls) {
      return res.json({ status: false, message: "User not found." });
    }

    if (userControls.c_enble === 0) {
      return res.json({
        status: false,
        message: "Bet not allow for your account.",
      });
    }

    // Betfair game group
    const betfairGames = new Set([
      "betfair_hold",
      "betfair_turbo_hold",
      "betfair_hilo",
      "betfair_turbo_hilo",
      "betfair_blackjack",
      "betfair_turbo_blackjack",
      "betfair_omaha",
      "betfair_baccarat",
      "betfair_turbo_baccarat",
    ]);

    // Additional lock by full_chain for non-betfair games
    if (!betfairGames.has(game_name)) {
      const fullChain = String(userControls.full_chain || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const restricted = new Set(["21341", "9671", "11502"]);
      if (fullChain.some((id) => restricted.has(id))) {
        return res.json({ status: false, message: "Bet Lock." });
      }
    }

    // Bet locks
    const betLock = await BetLock.findOne({ user_id }).sort({ id: -1 }).lean();
    let casinoTpStudio = 1;
    let casinoBetfair = 1;
    if (betLock) {
      casinoTpStudio = betLock.casino_tp_studio;
      casinoBetfair = betLock.casino_betfair;
    }

    const isBetfairGame = betfairGames.has(game_name);
    const locked =
      (isBetfairGame ? casinoBetfair : casinoTpStudio) === 0 ? true : false;
    if (locked) {
      return res.json({ status: false, message: "Bet is Locked" });
    }

    let response;

    switch (game_name) {
      case "casinowar_virtual":
        response = casinoWarVirtual.placeBet(req);
        break;
      case "lucky7second_virtual":
        response = casinoLucky7.placeLucky7Bet(req);
        break;
      case "centercard_virtual":
        response =
          market_type === "m"
            ? casinoCenterCardVirtual.placeCenterCardBet(req)
            : casinoCenterCardVirtual.placeCenterCardBetFancy(req);
        break;
      case "duskadum_virtual":
        response = await casinoDuskadumVirtual.placeBet(req);
        break;
      case "32card_virtual":
        response = await casino32CardVirtual.place32CardBet(req);
        break;
      case "bollywood_virtual":
        response =
          market_type === "m"
            ? await casinoBollywoodVirtual.placeBollywoodBet(req)
            : await casinoBollywoodVirtual.placeBollywoodBetFancy(req);
        break;
      case "race17_virtual":
        response = await casinoRace17Virtual.placeBet(req);
        break;
      case "race20_virtual":
        response = await casinoRace20Virtual.place32CardBet(req);
        break;
      case "highcard_virtual":
        response = await casinoHighCardVirtual.placeHighCardBet(req);
        break;
      case "card2020_virtual":
        response = await casino2020Virtual.placeBetT20(req);
        break;
      case "card2020_muflis_virtual":
        response = await casino2020MuflisVirtual.placeBetT20(req);
        break;
      case "aaa_virtual":
        response =
          market_type === "m"
            ? await casinoAAAVirtual.placeBet(req)
            : await casinoAAAVirtual.placeAAABetFancy(req);
        break;
      case "aviator":
        response = await casinoAviator.placeBet(req);
        break;
      case "aviatorx":
        response = await casinoAviatorX.placeBet(req);
        break;
      case "headtail":
        response = casinoHeadTail.placeHeadTailGameBet(req);
        break;
      // case "race20":
      // response =
      //   market_type === "m"
      //     ? casinoRace20Virtual.placeRace2020Bet(req)
      //     : casinoRace20Virtual.placeRace2020BetFancy(req);
      // break;
      // case "bollywood":
      // response =
      //   market_type === "m"
      //     ? casinoBollywoodVirtual.placeBollywoodBet(req)
      //     : casinoBollywoodVirtual.placeBollywoodBetFancy(req);
      // break;
      /*case "32card":
        response = place32CardBet(req);
        break;
      case "card2020":
        response = this.casino2020_model.placeBetT20();
        break;
      case "lucky7":
        response = this.casinolucky7_model.placeLucky7Bet();
        break;
      case "lucky7b":
        response = placeLucky7bBet();
        break;
      case "dragontiger":
        response =
          market_type === "m"
            ? placeDragonTigerBet()
            : placeDragonTigerBetFancy();
        break;
      case "dt_od":
        response =
          market_type === "m"
            ? placeDragonTigerOdBet()
            : placeDragonTigerOdBetFancy();
        break;
      case "andarbahar":
        response = placeandarbaharBet();
        break;
      case "baccarat":
        response = this.casinobaccarat_model.placebaccaratBet();
        break;
      case "card3":
        response = placecard3Bet();
        break;
      case "32Cardb":
        if (market_type === "m") {
          response = this.casino32cardb_model.place32CardbBet(req);
        } else if (market_type === "m2") {
          response = this.casino32cardb_model.place32CardbBetM2(req);
        } else {
          response = this.casino32cardb_model.place32CardbBetFancy(req);
        }
        break;
      case "aaa":
        response =
          market_type === "m" ? placeaaaBet(req) : placeAAABetFancy(req);
        break;
      case "bollywood":
        response =
          market_type === "m"
            ? placeBollywoodBet(req)
            : placeBollywoodBetFancy(req);
        break;
      case "race20":
        response =
          market_type === "m"
            ? placeRace2020Bet(req)
            : placeRace2020BetFancy(req);
        break;
      case "superover":
        response =
          market_type === "m"
            ? placeSuperoverBet(req)
            : placeSuperoverBetFancy(req);
        break;
      case "queen":
        response = placeQueenBet(req);
        break;
      case "colorgame":
        response = this.casinocolorgame_model.placeColorGameBet(req);
        break;
      case "rolldice":
        response = placeRollDiceGameBet(req);
        break;
      case "headtail":
        response = casinoHeadTail.placeHeadTailGameBet(req);
        break;
      case "hilo_virtual":
        response = placeHiloBet(req);
        break;
      case "roulette":
        response = placeRouletteGameBet(req);
        break;
      case "lucky7_virtual":
        response = placeLucky7Bet();
        break;
      case "card2020_virtual":
      case "card2020_muflis_virtual":
        response = placeBetT20();
        break;
      case "dragontiger_virtual":
        response =
          market_type === "m"
            ? placeDragonTigerBet()
            : placeDragonTigerBetFancy();
        break;
      
      case "bollywood_virtual":
        response =
          market_type === "m"
            ? placeBollywoodBet(req)
            : placeBollywoodBetFancy(req);
        break;
      case "highcard_virtual":
        response = placeHighCardBet();
        break;
      case "casinowar_virtual":
        response = placeBet();
        break;
      case "aaa_virtual":
        response = market_type === "m" ? placeBet(req) : placeAAABetFancy(req);
        break;
      case "andarbahar_virtual":
        response = placeBet();
        break;
      case "lucky7second_virtual":
        response = placeLucky7Bet();
        break;
      case "sicbo_virtual":
        response = placeBet();
        break;
      case "race17_virtual":
        response = placeBet();
        break;
      case "oddeven":
        response = placeOddEvenGameBet();
        break;
      case "bigsmall":
        response = placeColorGameBet(req);
        break;
      case "race20_virtual":
        response = place32CardBet();
        break;
      case "wheel":
        response = placeWheelGameBet(req);
        break;
      case "betfair_hold":
      case "betfair_turbo_hold":
      case "betfair_hilo":
      case "betfair_turbo_hilo":
      case "betfair_blackjack":
      case "betfair_turbo_blackjack":
      case "betfair_omaha":
        response = placeBet();
        break;
      case "betfair_baccarat":
      case "betfair_turbo_baccarat":
        response = market_type === "m" ? placeBet() : placeBetFancy();
        break;
      case "dream_catcher":
        response = placeDreamCatcherGameBet(req);
        break;
      case "centercard_virtual":
        response =
          market_type === "m"
            ? placeCenterCardBet()
            : placeCenterCardBetFancy();
        break;
       */
      default:
        return res.json({ status: false, message: "Wrong Game Name" });
    }

    return res.json(response);
  } catch (err) {
    console.error("placebet error:", err);
    return res.json({ status: false, message: "Server error." });
  }
});
module.exports = router;
