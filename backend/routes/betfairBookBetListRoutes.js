const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const Punter = require("../models/Punter");
const BzBetfairHoldBetHistory = require("../models/BzBetfairHoldBetHistory");
const BzBetfairHoldMatch = require("../models/BzBetfairHoldMatch");
const BzBetfairTurboHoldBetHistory = require("../models/BzBetfairTurboHoldBetHistory");
const BzBetfairTurboHoldMatch = require("../models/BzBetfairTurboHoldMatch");
const BzBetfairBlackjackMatch = require("../models/BzBetfairBlackjackMatch");
const BzBetfairBlackjackBetHistory = require("../models/BzBetfairBlackjackBetHistory");
const BzBetfairTurboBlackjackMatch = require("../models/BzBetfairTurboBlackjackMatch");
const BzBetfairTurboBlackjackBetHistory = require("../models/BzBetfairTurboBlackjackBetHistory");
const BzBetfairHiloMatch = require("../models/BzBetfairHiloMatch");
const BzBetfairHiloBetHistory = require("../models/BzBetfairHiloBetHistory");
const BzBetfairTurboHiloMatch = require("../models/BzBetfairTurboHiloMatch");
const BzBetfairTurboHiloBetHistory = require("../models/BzBetfairTurboHiloBetHistory");
const BzBetfairOmahaMatch = require("../models/BzBetfairOmahaMatch");
const BetfairOmahaBetHistory = require("../models/BetfairOmahaBetHistory");
const BetfairDerbyBetHistory = require("../models/BetfairDerbyBetHistory");
const BzBetfairDerbyMatch = require("../models/BzBetfairDerbyMatch");
const BetfairTurboDerbyBetHistory = require("../models/BetfairTurboDerbyBetHistory");
const BzBetfairTurboDerbyMatch = require("../models/BzBetfairTurboDerbyMatch");

router.use(auth);

router.post("/", async (req, res) => {
  let roundId = req.body.roundId;
  let game_type = req.body.game_type;

  const user_id = req.user._id; // Use authenticated user's ID
  console.log("user_id->", user_id);
  if (game_type === "betfair-hold") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BzBetfairHoldBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const book = await BzBetfairHoldMatch.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    res.json({ bets_list: bets_list, userbook: book });
  }else if (game_type === "betfair-turbo-hold") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BzBetfairTurboHoldBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const book = await BzBetfairTurboHoldMatch.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    res.json({ bets_list: bets_list, userbook: book });
  }else if (game_type === "betfair-blackjack") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BzBetfairBlackjackBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    objBook.user_id = user_id;
    objBook.mid_mid = roundId;

    const book = await BzBetfairBlackjackMatch.find(objBook)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    res.json({ bets_list: bets_list, userbook: book });
  }else if (game_type === "betfair-turbo-blackjack") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BzBetfairTurboBlackjackBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    objBook.user_id = user_id;
    objBook.mid_mid = roundId;

    const book = await BzBetfairTurboBlackjackMatch.find(objBook)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    res.json({ bets_list: bets_list, userbook: book });
  }else if (game_type === "betfair-hilo") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BzBetfairHiloBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    objBook.user_id = user_id;
    objBook.mid_mid = roundId;

    const book = await BzBetfairHiloMatch.find(objBook)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);
    res.json({ bets_list: bets_list, userbook: book });
  }else if (game_type === "betfair-turbo-hilo") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BzBetfairTurboHiloBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    objBook.user_id = user_id;
    objBook.mid_mid = roundId;

    const book = await BzBetfairTurboHiloMatch.find(objBook)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);
    res.json({ bets_list: bets_list, userbook: book });
  }else if (game_type === "betfair-omaha") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BetfairOmahaBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    objBook.user_id = user_id;
    objBook.cat_mid = roundId;
    objBook.market_type = 1;
    const book = await BzBetfairOmahaMatch.find(objBook)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook2 = {};
    objBook2.user_id = user_id;
    objBook2.cat_mid = roundId;
    objBook2.market_type = 2;
    const book2 = await BzBetfairOmahaMatch.find(objBook2)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);  

    res.json({ bets_list: bets_list, userbook: book, userbook2: book2 });
  }else if (game_type === "betfair-derby") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BetfairDerbyBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const book = await BzBetfairDerbyMatch.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    res.json({ bets_list: bets_list, userbook: book });
  } else if (game_type === "betfair-turbo-derby") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BetfairTurboDerbyBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const book = await BzBetfairTurboDerbyMatch.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    res.json({ bets_list: bets_list, userbook: book });
  }
  else if (game_type === "betfair-turbo-derby") {
    let obj = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const bets_list = await BetfairTurboDerbyBetHistory.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    let objBook = {};
    obj.user_id = user_id;
    obj.cat_mid = roundId;

    const book = await BzBetfairTurboDerbyMatch.find(obj)
      .select()
      .sort({ stmp: -1 })
      .limit(1000);

    res.json({ bets_list: bets_list, userbook: book });
  }
});

module.exports = router;
