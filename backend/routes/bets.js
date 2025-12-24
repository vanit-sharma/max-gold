const express = require("express");
const router = express.Router();
const Punter = require("../models/Punter");
const BzStakeSettings = require("../models/BzStakeSettings");
const UserBetLock = require("../models/UserBetLock");
const BetLock = require("../models/BetLock");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const placeLiveBets = require("../utils/match_bets/matchoddMarket");
const liveBetFancy = require("../utils/match_bets/fancyMarket");
const placeLiveFairBMBets = require("../utils/match_bets/placeLiveFairBMBets");
const placeLiveHorseBet = require("../utils/match_bets/placeLiveHorseBet");
const placeFootballFancyBets = require("../utils/match_bets/placeFootballFancyBets");
const placeTieLiveBets = require("../utils/match_bets/placeTieLiveBets");
const placeEvenOddBets = require("../utils/match_bets/placeEvenOddBets");
const BtBets = require("../models/BtBets");
const moment = require("moment");
const placeBetfairFancyBet = require("../utils/match_bets/placeBetfairFancyBet");
const placeLastDigitBets = require("../utils/match_bets/placeLastDigitBets");

router.use(auth);

function requireFields(fields) {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(403).json({
        status: false,
        message: "Some information is missing to place this bet.",
      });
    }
    const missing = fields.filter(
      (f) => req.body[f] == null || req.body[f] === ""
    );
    if (missing.length) {
      console.log("Missing fields: ", missing);
      return res.status(403).json({
        status: false,
        message: "Some information is missing to place this bet.1",
      });
    }
    next();
  };
}

const needed = [
  "amount",
  "market_type", // m = match‐odds, f = fancy
  "bet_type", // b = back, l = lay
  "catmid",
  "odds",
  "sid",
  "runnername",
  "is_virtual",
  "game_type",
];

// place bets using post method /bets
router.post("/", requireFields(needed), async (req, res) => {
  const {
    amount,
    market_type, // m = match‐odds, f = fancy
    bet_type, // b = back, l = lay
    catmid,
    odds,
    sid,
    runnername,
    is_virtual,
    game_type,
  } = req.body;

  const user_id = req.user._id; // Use authenticated user's ID
  let filed_name = "cric_matchodd";

  if (market_type) {
    if (market_type == "m") {
      if (game_type == 1) {
        filed_name = "cric_matchodd";
      } else if (game_type == 2) {
        filed_name = "soccer_matchodd";
      } else if (game_type == 3) {
        filed_name = "tennis_matchodd";
      } else if (game_type == 6) {
        filed_name = "cric_cup";
      }
    } else if (market_type == "bm") {
      filed_name = "cric_matchodd";
    } else if (market_type == "f") {
      filed_name = "cric_fancy";
    } else if (market_type == "betfairfancy") {
      filed_name = "cric_fancy";
    } else if (market_type == "toss_fancy") {
      filed_name = "cric_toss";
    } else if (market_type == "tie") {
      filed_name = "cric_tie";
    } else if (market_type == "digit") {
      filed_name = "cric_figure";
    } else if (market_type == "evenodd") {
      filed_name = "cric_even_odd";
    } else if (market_type == "ff") {
      filed_name = "soccer_over_under";
    } else if (market_type == "winner") {
      filed_name = "cric_cup";
    } else if (market_type == "jt") {
      filed_name = "hrace_australia";
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Wrong market type" });
    }
  }
  console.log("filed_name->", filed_name);
  // check for an existing lock
  const isLocked = await UserBetLock.exists({ user_id });
  if (isLocked) {
    return res
      .status(403)
      .json({ status: false, message: "Bet not allowed for your account" }); // tested it by inserting a record in user_bet_lock
  }

  const controls = await Punter.findOne({ _id: user_id })
    .select("f_enable c_enble t_enable")
    .lean();

  //Question: Why are we checking for controls.c_enble only?
  if (controls.c_enble == 0) {
    return res
      .status(403)
      .json({ status: false, message: "Bet not allow for your account." }); // tested it by updating c_enble=0 in bz_bt_punter
  }

  const resultBetLock = await BetLock.find({
    user_id: user_id,
    [filed_name]: 0,
  }).lean();
  //console.log("filed_name: ", filed_name);
  if (resultBetLock.length > 0) {
    return res.status(403).json({ status: false, message: "Bet is Locked" }); // tested it by updating cric_matchodd=0 in bet_lock
  }

  const isBetLockCount = resultBetLock.length;
  let matchoddMarket = 1;
  let fancyMarket = 1;
  let tossMarket = 1;
  let tieMarket = 1;
  let figureMarket = 1;
  let evenOddMarket = 1;
  let soccerOverUnder = 1;
  let cupWinnerMarket = 1;
  //console.log("isBetLockCount: ", isBetLockCount);
  /*
  -- Commented the follwing block as it will never execute!
  if (isBetLockCount > 0) {
    dataBetLock = resultBetLock[0];
    cric_matchodd = dataBetLock.cric_matchodd; //cricket match odd
    soccer_matchodd = dataBetLock.soccer_matchodd; //soccer match odd
    tennis_matchodd = dataBetLock.tennis_matchodd; //tennis match odd
    if (cric_matchodd == 0 || soccer_matchodd == 0 || tennis_matchodd == 0) {
      matchoddMarket = 0;
    }

    cric_fancy = dataBetLock.cric_fancy;
    if (cric_fancy == 0) {
      fancyMarket = 0;
    }

    cric_toss = dataBetLock.cric_toss;
    if (cric_toss == 0) {
      tossMarket = 0;
    }

    cric_tie = dataBetLock.cric_tie;
    if (cric_tie == 0) {
      tieMarket = 0;
    }

    cric_figure = dataBetLock.cric_figure;
    if (cric_figure == 0) {
      figureMarket = 0;
    }

    cric_even_odd = dataBetLock.cric_even_odd;
    if (cric_even_odd == 0) {
      evenOddMarket = 0;
    }

    soccer_over_under = dataBetLock.soccer_over_under;
    if (soccer_over_under == 0) {
      soccerOverUnder = 0;
    }

    cric_cup = dataBetLock.cric_cup;
    if (cric_cup == 0) {
      cupWinnerMarket = 0;
    }
  }
*/
  if (amount && market_type && bet_type && catmid && odds) {
    if (market_type == "m") {
      // match bet
      if (game_type == 4 || game_type == 5) {
        return await placeLiveHorseBet(req, res);
        //response = this->horse_race_model->placeLiveHorseBet(this->input->post());
      } else {
        if (matchoddMarket == 1) {
          return await placeLiveBets(req, res);
          // working here
        } else {
          return res.status(403).json({
            status: false,
            message: "Bet is Locked",
          });
        }
      }
    } else if (market_type == "f") {
      // fancy bet
      if (fancyMarket == 1) {
        return await liveBetFancy(req, res);
      } else {
        return res.status(403).json({
          status: false,
          message: "Bet is Locked",
        });
      }
    } else if (market_type == "betfairfancy") {
      if (fancyMarket == 1) {
        return await placeBetfairFancyBet(req, res);
      } else {
        return res.status(403).json({
          status: false,
          message: "Bet is Locked",
        });
      }
    } else if (market_type == "bm") {
      if (matchoddMarket == 1) {
        return await placeLiveFairBMBets(req, res);
      } else {
        return res.status(403).json({
          status: false,
          message: "Bet is Locked.",
        });
      }
    } else if (market_type == "ff") {
      if (soccerOverUnder == 1) {
        return await placeFootballFancyBets(req, res);
      } else {
        return res.status(403).json({
          status: false,
          message: "Bet is Locked.",
        });
      }
    } else if (market_type == "tie") {
      if (tieMarket == 1) {
        return placeTieLiveBets(req, res);
      } else {
        return res.status(403).json({
          status: false,
          message: "Bet is Locked",
        });
      }
    } else if (market_type == "digit") {
      if (figureMarket == 1) {
      return placeLastDigitBets(req, res);
      } else {
      return res.status(403).json({
        status: false,
        message: "Bet is locked",
      });
    }
    } else if (market_type == "evenodd") {
      return placeEvenOddBets(req, res);
      // return res.status(403).json({
      //   status: false,
      //   message:"Even/Odd Code not implemented.",
      // });
    }
  } else {
    return res.status(403).json({
      status: false,
      message: "Some information is missing to place this bet.",
    }); // tested it by removing few fields from the post variables
  }
  return res.json({ msg: "reached end yet not completed!" });
});
router.get("/", async (req, res) => {
  return res.json({ msg: "bets get method not implemented yet" });
});

router.post("/user-betlist", auth, async (req, res) => {
  const catmid = req.params.id;
  let sports_type = req.body.sports_type;
  let bet_status = req.body.bet_status;
  let from_date = req.body.from_date;
  let to_date = req.body.to_date;
  let user_id = req.user._id;
  bet_status = parseInt(bet_status);
  // console.log("sports_type->",sports_type);
  console.log("bet_status->", bet_status);
  // console.log("from_date->",from_date);
  // console.log("to_date->",to_date);
  // console.log("user_id->",user_id);

  let obj = {};
  obj.user_id = req.user._id;
  obj.is_settled = false;
  //obj.is_void = 0;
  if (sports_type != "0") {
    obj.g_type = parseInt(sports_type); //sports type
  }

  if (bet_status == 0) {
    //Active
    obj.is_settled = 0;
    //obj.is_void = 0;
  } else if (bet_status == 1) {
    //Settled
    obj.is_settled = 1;
    //obj.is_void = 0;
  } else if (bet_status == 2) {
    //Voided
    obj.is_settled = 1;
    //obj.is_void = 1;
  } else if (bet_status == 3) {
    //Cancelled
    obj.is_settled = 1;
    //obj.is_void = 1;
  }

  const startDate = moment(from_date);
  const endDate = moment(to_date);

  obj.stmp = { $gte: startDate, $lte: endDate };
  console.log("obj->", obj);

  const bets_list = await BtBets.find(obj)
    .select(
      "-api_response -b1 -b2 -b3 -l1 -l2 -l3 -bet_device -bet_summery_id -team1_book -team2_book -team3_book"
    )
    .sort({ stmp: -1 })
    .limit(1000);
  //console.log("bets_list->", bets_list);
  res.json({ bets_list });
});

module.exports = router;
