const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const BzBetfairHiloRates = require("../../models/BzBetfairHiloRates");
const BzBetfairHiloMatch = require("../../models/BzBetfairHiloMatch");
const BzBetfairHiloBetHistory = require("../../models/BzBetfairHiloBetHistory");
const Punter = require("../../models/Punter");
const UserLogs = require("../../models/UserLogs.js");
const LiveNotifications = require("../../models/LiveNotifications.js");

const { getBetfairGamesData, UpdateBalance, pushExposure } = require("../function.js");

function validateCanPlaceBet(req, res) {
  const error = [];

  const { amount, catmid, teamname, bettype, odds, selectRnr, round } =
    req.body;

  if (req.user.user_role != 8) {
    error.push("Betting Not allowed!");
  }

  if (teamname.length > 35) {
    error.push("Runner name not valid");
  }

  if (odds.length > 5) {
    error.push("Odd not valid1");
  }

  if (odds > 20) {
    error.push("Odd not valid2");
  }

  if (catmid.length > 40) {
    error.push("Mid not valid");
    return result;
  }

  if (bettype.length > 10) {
    error.push("Type not valid");
  }
  return error;
}

async function placeBet(req, res) {
  const errors = await validateCanPlaceBet(req, res);
  if (errors.length) {
    return res
      .status(400)
      .json({ status: false, message: "Betting Not allowed!", errors });
  }
  

  const currency = req.user.currency;
  let min_amount,
    sid,
    liverate,
    ratok,
    lib,
    drsts,
    pro,
    rnr_val,
    rnr1s,
    rnr2s,
    rnr3s,
    rnr4s;

  if (currency == 1) {
    /// 1=INR,2=PKR,3=AED,4= BDT
    min_amount = 100;
  } else if (currency == 2) {
    min_amount = 100;
  } else if (currency == 3) {
    min_amount = 2;
  } else if (currency == 4) {
    min_amount = 500;
  }
  const {
    amount,
    catmid,
    teamname,
    bettype,
    odds,
    selectRnr,
    round,
    market_type,
  } = req.body;

  let rat = odds;
  let rnr = bettype;

  
  if (teamname == "Tie" && rnr == "l") {
    return res.status(400).json({
      status: false,
      message: "Odd not valid!!!",
    });
  }
  //get bet limit
  const myBetLimit = await BetLimit.findOne({ user_id: req.user._id })
    .select("casino")
    .lean();
  const casinoBetLimit = myBetLimit ? myBetLimit.casino : 0;

  if (amount > casinoBetLimit) {
    return res.status(400).json({
      status: false,
      message: "Bet Limit is min " + min_amount + " and max " + casinoBetLimit,
    });
  }

  if (amount < min_amount) {
    return res.status(400).json({
      status: false,
      message: "Bet Limit is min " + min_amount + " and max " + casinoBetLimit,
    });
  }

  if (
    catmid &&
    teamname &&
    bettype &&
    odds &&
    odds > 0 &&
    odds != "SUSPENDED" &&
    amount &&
    amount >= min_amount &&
    amount <= casinoBetLimit
  ) {
    //let rnr, sid;
    rnr_val = 0;
    console.log('teamname->',teamname);
    if (teamname == "Card 1 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner1b1";
        } else if (selectRnr == 2) {
          rnr = "runner1b2";
        } else if (selectRnr == 3) {
          rnr = "runner1b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner1l1";
        } else if (selectRnr == 2) {
          rnr = "runner1l2";
        } else if (selectRnr == 3) {
          rnr = "runner1l3";
        }
      }
      sid = catmid + "-1";
      rnr_val = 1;
    } else if (teamname == "Card 2 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner2b1";
        } else if (selectRnr == 2) {
          rnr = "runner2b2";
        } else if (selectRnr == 3) {
          rnr = "runner2b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner2l1";
        } else if (selectRnr == 2) {
          rnr = "runner2l2";
        } else if (selectRnr == 3) {
          rnr = "runner2l3";
        }
      }
      sid = catmid + "-2";
      rnr_val = 2;
    } else if (teamname == "Card 3 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner3b1";
        } else if (selectRnr == 2) {
          rnr = "runner3b2";
        } else if (selectRnr == 3) {
          rnr = "runner3b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner3l1";
        } else if (selectRnr == 2) {
          rnr = "runner3l2";
        } else if (selectRnr == 3) {
          rnr = "runner3l3";
        }
      }
      sid = catmid + "-3";
      rnr_val = 3;
    } else if (teamname == "Card 4 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner4b1";
        } else if (selectRnr == 2) {
          rnr = "runner4b2";
        } else if (selectRnr == 3) {
          rnr = "runner4b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner4l1";
        } else if (selectRnr == 2) {
          rnr = "runner4l2";
        } else if (selectRnr == 3) {
          rnr = "runner4l3";
        }
      }
      sid = catmid + "-4";
      rnr_val = 4;
    } else if (teamname == "Card 5 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner5b1";
        } else if (selectRnr == 2) {
          rnr = "runner5b2";
        } else if (selectRnr == 3) {
          rnr = "runner5b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner5l1";
        } else if (selectRnr == 2) {
          rnr = "runner5l2";
        } else if (selectRnr == 3) {
          rnr = "runner5l3";
        }
      }
      sid = catmid + "-5";
      rnr_val = 5;
    } else if (teamname == "Card 6 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner6b1";
        } else if (selectRnr == 2) {
          rnr = "runner6b2";
        } else if (selectRnr == 3) {
          rnr = "runner6b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner6l1";
        } else if (selectRnr == 2) {
          rnr = "runner6l2";
        } else if (selectRnr == 3) {
          rnr = "runner6l3";
        }
      }
      sid = catmid + "-6";
      rnr_val = 6;
    } else if (teamname == "Card 7 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner7b1";
        } else if (selectRnr == 2) {
          rnr = "runner7b2";
        } else if (selectRnr == 3) {
          rnr = "runner7b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner7l1";
        } else if (selectRnr == 2) {
          rnr = "runner7l2";
        } else if (selectRnr == 3) {
          rnr = "runner7l3";
        }
      }
      sid = catmid + "-7";
      rnr_val = 7;
    } else if (teamname == "Card 8 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner8b1";
        } else if (selectRnr == 2) {
          rnr = "runner8b2";
        } else if (selectRnr == 3) {
          rnr = "runner8b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner8l1";
        } else if (selectRnr == 2) {
          rnr = "runner8l2";
        } else if (selectRnr == 3) {
          rnr = "runner8l3";
        }
      }
      sid = catmid + "-8";
      rnr_val = 8;
    } else if (teamname == "Card 9 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner9b1";
        } else if (selectRnr == 2) {
          rnr = "runner9b2";
        } else if (selectRnr == 3) {
          rnr = "runner9b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner9l1";
        } else if (selectRnr == 2) {
          rnr = "runner9l2";
        } else if (selectRnr == 3) {
          rnr = "runner9l3";
        }
      }
      sid = catmid + "-9";
      rnr_val = 9;
    } else if (teamname == "Card 10 or further") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner10b1";
        } else if (selectRnr == 2) {
          rnr = "runner10b2";
        } else if (selectRnr == 3) {
          rnr = "runner10b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner10l1";
        } else if (selectRnr == 2) {
          rnr = "runner10l2";
        } else if (selectRnr == 3) {
          rnr = "runner10l3";
        }
      }
      sid = catmid + "-10";
      rnr_val = 10;
    } else if (teamname == "Card 11") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner11b1";
        } else if (selectRnr == 2) {
          rnr = "runner11b2";
        } else if (selectRnr == 3) {
          rnr = "runner11b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner11l1";
        } else if (selectRnr == 2) {
          rnr = "runner11l2";
        } else if (selectRnr == 3) {
          rnr = "runner11l3";
        }
      }
      sid = catmid + "-11";
      rnr_val = 11;
    } else if (teamname == "2 Card Run") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner12b1";
        } else if (selectRnr == 2) {
          rnr = "runner12b2";
        } else if (selectRnr == 3) {
          rnr = "runner12b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner12l1";
        } else if (selectRnr == 2) {
          rnr = "runner12l2";
        } else if (selectRnr == 3) {
          rnr = "runner12l3";
        }
      }
      sid = catmid + "-12";
      rnr_val = 12;
    } else if (teamname == "3 Card Run") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner13b1";
        } else if (selectRnr == 2) {
          rnr = "runner13b2";
        } else if (selectRnr == 3) {
          rnr = "runner13b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner13l1";
        } else if (selectRnr == 2) {
          rnr = "runner13l2";
        } else if (selectRnr == 3) {
          rnr = "runner13l3";
        }
      }
      sid = catmid + "-13";
      rnr_val = 13;
    } else if (teamname == "4 Card Run") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner14b1";
        } else if (selectRnr == 2) {
          rnr = "runner14b2";
        } else if (selectRnr == 3) {
          rnr = "runner14b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner14l1";
        } else if (selectRnr == 2) {
          rnr = "runner14l2";
        } else if (selectRnr == 3) {
          rnr = "runner14l3";
        }
      }
      sid = catmid + "-14";
      rnr_val = 14;
    } else if (teamname == "No Ace") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner15b1";
        } else if (selectRnr == 2) {
          rnr = "runner15b2";
        } else if (selectRnr == 3) {
          rnr = "runner15b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner15l1";
        } else if (selectRnr == 2) {
          rnr = "runner15l2";
        } else if (selectRnr == 3) {
          rnr = "runner15l3";
        }
      }
      sid = catmid + "-15";
      rnr_val = 15;
    } else if (teamname == "No Picture Cards") {
      if (bettype == "b") {
        if (selectRnr == 1) {
          rnr = "runner16b1";
        } else if (selectRnr == 2) {
          rnr = "runner16b2";
        } else if (selectRnr == 3) {
          rnr = "runner16b3";
        }
      }
      if (bettype == "l") {
        if (selectRnr == 1) {
          rnr = "runner16l1";
        } else if (selectRnr == 2) {
          rnr = "runner16l2";
        } else if (selectRnr == 3) {
          rnr = "runner16l3";
        }
      }
      sid = catmid + "-16";
      rnr_val = 16;
    } else {
      return res.status(400).json({
        status: false,
        message: "Runner name not valid",
      });
    }

    const now = new Date();

    const qds = await BzBetfairHiloRates.aggregate([
      {
        $match: {
          evt_status: "ACTIVE",
          cat_mid: catmid,
          evt_od: { $lt: now },
          round: round.toString(),
        },
      },
      {
        $addFields: {
          difftm: {
            $divide: [{ $subtract: [now, "$round_close_date"] }, 1000],
          },
        },
      },
    ]);

    if (qds.length) {
      stld = qds[0].stld;
      match_status = qds[0].evt_status;
      evt_id = qds[0].cat_mid;
      cat_sid1 = qds[0].cat_sid1;
      cat_sid2 = qds[0].cat_sid2;
      cat_sid3 = qds[0].cat_sid3;
      cat_sid4 = qds[0].cat_sid4;
      cat_sid5 = qds[0].cat_sid5;
      cat_sid6 = qds[0].cat_sid6;
      cat_sid7 = qds[0].cat_sid7;
      cat_sid8 = qds[0].cat_sid8;
      cat_sid9 = qds[0].cat_sid9;
      cat_sid10 = qds[0].cat_sid10;
      cat_sid11 = qds[0].cat_sid11;
      cat_sid12 = qds[0].cat_sid12;
      cat_sid13 = qds[0].cat_sid13;
      cat_sid14 = qds[0].cat_sid14;
      cat_sid15 = qds[0].cat_sid15;
      cat_sid16 = qds[0].cat_sid16;
      timeLeft = qds[0].difftm;
      roundResult = qds[0].result;
      timeRound = qds[0].time;
    } else {
      return res.status(404).json({
        status: false,
        message: "Round not found",
      });
    }

    let ds = await AdmBetStart.findOne({ sno: 1 }).lean();
    let isBettingEnable = ds ? ds.betfair_baccarat : false;

    if (!isBettingEnable) {
      return res.status(400).json({
        status: false,
        message: "Betting not open for Betfair Baccarat.",
      });
    }

    // If event creation time is greater then 56 then stop the event betting.

    if (timeLeft > 27) {
      return res
        .status(400)
        .json({ status: false, message: "Round closed. Bet not placed" });
    }

    if (timeLeft > timeRound) {
      return res
        .status(400)
        .json({ status: false, message: "Round closed. Bet not placed." });
    }

    rnrValue = 0;
    if (
      (sid == cat_sid1 &&
        (rnr == "runner1l1" ||
          rnr == "runner1b1" ||
          rnr == "runner1l2" ||
          rnr == "runner1b2" ||
          rnr == "runner1l3" ||
          rnr == "runner1b3")) ||
      (sid == cat_sid2 &&
        (rnr == "runner2l1" ||
          rnr == "runner2b1" ||
          rnr == "runner2l2" ||
          rnr == "runner2b2" ||
          rnr == "runner2l3" ||
          rnr == "runner2b3")) ||
      (sid == cat_sid3 &&
        (rnr == "runner3l1" ||
          rnr == "runner3b1" ||
          rnr == "runner3l2" ||
          rnr == "runner3b2" ||
          rnr == "runner3l3" ||
          rnr == "runner3b3")) ||
      (sid == cat_sid4 &&
        (rnr == "runner4l1" ||
          rnr == "runner4b1" ||
          rnr == "runner4l2" ||
          rnr == "runner4b2" ||
          rnr == "runner4l3" ||
          rnr == "runner4b3")) ||
      (sid == cat_sid5 &&
        (rnr == "runner5l1" ||
          rnr == "runner5b1" ||
          rnr == "runner5l2" ||
          rnr == "runner5b2" ||
          rnr == "runner5l3" ||
          rnr == "runner5b3")) ||
      (sid == cat_sid6 &&
        (rnr == "runner6l1" ||
          rnr == "runner6b1" ||
          rnr == "runner6l2" ||
          rnr == "runner6b2" ||
          rnr == "runner6l3" ||
          rnr == "runner6b3")) ||
      (sid == cat_sid7 &&
        (rnr == "runner7l1" ||
          rnr == "runner7b1" ||
          rnr == "runner7l2" ||
          rnr == "runner7b2" ||
          rnr == "runner7l3" ||
          rnr == "runner7b3")) ||
      (sid == cat_sid8 &&
        (rnr == "runner8l1" ||
          rnr == "runner8b1" ||
          rnr == "runner8l2" ||
          rnr == "runner8b2" ||
          rnr == "runner8l3" ||
          rnr == "runner8b3")) ||
      (sid == cat_sid9 &&
        (rnr == "runner9l1" ||
          rnr == "runner9b1" ||
          rnr == "runner9l2" ||
          rnr == "runner9b2" ||
          rnr == "runner9l3" ||
          rnr == "runner9b3")) ||
      (sid == cat_sid10 &&
        (rnr == "runner10l1" ||
          rnr == "runner10b1" ||
          rnr == "runner10l2" ||
          rnr == "runner10b2" ||
          rnr == "runner10l3" ||
          rnr == "runner10b3")) ||
      (sid == cat_sid11 &&
        (rnr == "runner11l1" ||
          rnr == "runner11b1" ||
          rnr == "runner11l2" ||
          rnr == "runner11b2" ||
          rnr == "runner11l3" ||
          rnr == "runner11b3")) ||
      (sid == cat_sid12 &&
        (rnr == "runner12l1" ||
          rnr == "runner12b1" ||
          rnr == "runner12l2" ||
          rnr == "runner12b2" ||
          rnr == "runner12l3" ||
          rnr == "runner12b3")) ||
      (sid == cat_sid13 &&
        (rnr == "runner13l1" ||
          rnr == "runner13b1" ||
          rnr == "runner13l2" ||
          rnr == "runner13b2" ||
          rnr == "runner13l3" ||
          rnr == "runner13b3")) ||
      (sid == cat_sid14 &&
        (rnr == "runner14l1" ||
          rnr == "runner14b1" ||
          rnr == "runner14l2" ||
          rnr == "runner14b2" ||
          rnr == "runner14l3" ||
          rnr == "runner14b3")) ||
      (sid == cat_sid15 &&
        (rnr == "runner15l1" ||
          rnr == "runner15b1" ||
          rnr == "runner15l2" ||
          rnr == "runner15b2" ||
          rnr == "runner15l3" ||
          rnr == "runner15b3")) ||
      (sid == cat_sid16 &&
        (rnr == "runner16l1" ||
          rnr == "runner16b1" ||
          rnr == "runner16l2" ||
          rnr == "runner16b2" ||
          rnr == "runner16l3" ||
          rnr == "runner16b3"))
    ) {
      rnrValue = 1;
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Type not valid." });
    }

    if (
      String(match_status).trim() !== "ACTIVE" ||
      stld === 1 ||
      (roundResult && roundResult !== "")
    ) {
      return res.status(400).json({
        status: false,
        message: "Round status not open",
      });
    }

    const userHistoryQuery = await Punter.aggregate([
      { $match: { _id: req.user._id } },

      // Simple $lookup (single equality join)
      {
        $lookup: {
          from: "bz_user_login_history",
          localField: "_id",
          foreignField: "userAutoId",
          as: "loginHistory",
        },
      },

      // Keep only entries where login === '1'
      {
        $addFields: {
          loginHistory: {
            $filter: {
              input: "$loginHistory",
              as: "lh",
              cond: { $eq: ["$$lh.login", "1"] }, // change to 1 if it's numeric
            },
          },
        },
      },

      { $unwind: { path: "$loginHistory", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          plimit: 1,
          opin_bal: 1,
          bz_balance: 1,
          stat: 1,
          user_role: 1,
          bet_status: 1,
          "loginHistory.logon": 1,
          "loginHistory.ipaddr": 1,
          sponsor: 1,
          sponser_id: 1,
          full_chain: 1,
          "loginHistory.site_toke": 1,
        },
      },

      { $limit: 1 },
    ]);

    //if (userHistoryQuery[0].logon == 1) {// this is not working so have checked the. length only
    if (userHistoryQuery.length) {
      // User history found, proceed with placing the bet
      let return_array = {};
      return_array.game_name = "BetfairHilo";
      return_array.result = false;
      let gameId = "1444093";
      let jsonds = await getBetfairGamesData(gameId);
      //console.log('data->',jsonds.channelSnapshot);
      jsonds = jsonds.channelSnapshot;
     
      if (
        jsonds != "ER101" &&
        jsonds != "" &&
        jsonds != null &&
        jsonds.channel != null &&
        jsonds.channel.$.id == gameId &&
        jsonds.channel.game.markets.market[0].status == "ACTIVE" &&
        jsonds.channel.game.$.id == catmid
      ) {
        let obj = jsonds.channel;
        
        if (obj.game.round <= 0) {
          return res.status(400).json({
            status: false,
            message: "Round not valid1",
          });
        }
        if (obj.game.round != round) {
          return res.status(400).json({
            status: false,
            message: "Round not valid2",
          });
        }
        if (obj.game.markets.market[0].status != "ACTIVE") {
          return res.status(400).json({
            status: false,
            message: "Round not valid3",
          });
        }
        if (obj.status != "RUNNING") {
          return res.status(400).json({
            status: false,
            message: "Round not valid4",
          });
        }

        let lcat_mid = obj.game.$.id;
        let levt_id = lcat_mid;

        let lcat_sid1 = lcat_mid + "-1";
        let lcat_sid2 = lcat_mid + "-2";
        let lcat_sid3 = lcat_mid + "-3";
        let lcat_sid4 = lcat_mid + "-4";
        let lcat_sid5 = lcat_mid + "-5";
        let lcat_sid6 = lcat_mid + "-6";
        let lcat_sid7 = lcat_mid + "-7";
        let lcat_sid8 = lcat_mid + "-8";
        let lcat_sid9 = lcat_mid + "-9";
        let lcat_sid10 = lcat_mid + "-10";
        let lcat_sid11 = lcat_mid + "-11";
        let lcat_sid12 = lcat_mid + "-12";
        let lcat_sid13 = lcat_mid + "-13";
        let lcat_sid14 = lcat_mid + "-14";
        let lcat_sid15 = lcat_mid + "-15";
        let lcat_sid16 = lcat_mid + "-16";

        let lcat_rnr1_status =
          obj.game.markets.market[0].selections.selection[0].status;
        let lcat_rnr2_status =
          obj.game.markets.market[0].selections.selection[1].status;
        let lcat_rnr3_status =
          obj.game.markets.market[0].selections.selection[2].status;
        let lcat_rnr4_status =
          obj.game.markets.market[0].selections.selection[3].status;
        let lcat_rnr5_status =
          obj.game.markets.market[0].selections.selection[4].status;
        let lcat_rnr6_status =
          obj.game.markets.market[0].selections.selection[5].status;
        let lcat_rnr7_status =
          obj.game.markets.market[0].selections.selection[6].status;
        let lcat_rnr8_status =
          obj.game.markets.market[0].selections.selection[7].status;
        let lcat_rnr9_status =
          obj.game.markets.market[0].selections.selection[8].status;
        let lcat_rnr10_status =
          obj.game.markets.market[0].selections.selection[9].status;
        let lcat_rnr11_status =
          obj.game.markets.market[0].selections.selection[10].status;
        let lcat_rnr12_status =
          obj.game.markets.market[1].selections.selection[0].status;
        let lcat_rnr13_status =
          obj.game.markets.market[1].selections.selection[1].status;
        let lcat_rnr14_status =
          obj.game.markets.market[1].selections.selection[2].status;
        let lcat_rnr15_status =
          obj.game.markets.market[1].selections.selection[3].status;
        let lcat_rnr16_status =
          obj.game.markets.market[1].selections.selection[4].status;

         

        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          if (lcat_sid1 == sid && lcat_rnr1_status == "IN_PLAY") {
            if (bettype == "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[0]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype == "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[0]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid2 == sid && lcat_rnr2_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[1]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[1]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid3 == sid && lcat_rnr3_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[2]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[2]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid4 == sid && lcat_rnr4_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[3]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[3]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid5 == sid && lcat_rnr5_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[4]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[4]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid6 == sid && lcat_rnr6_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[5]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[5]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid7 == sid && lcat_rnr7_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[6]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[6]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid8 == sid && lcat_rnr8_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[7]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[7]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid9 == sid && lcat_rnr9_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[8]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[8]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid10 == sid && lcat_rnr10_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[9]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[9]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid11 == sid && lcat_rnr11_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[0].selections.selection[10]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[0].selections.selection[10]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid12 == sid && lcat_rnr12_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[1].selections.selection[0]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[1].selections.selection[0]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid13 == sid && lcat_rnr13_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[1].selections.selection[1]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[1].selections.selection[1]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid14 == sid && lcat_rnr14_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[1].selections.selection[2]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[1].selections.selection[2]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid15 == sid && lcat_rnr15_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[1].selections.selection[3]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[1].selections.selection[3]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else if (lcat_sid16 == sid && lcat_rnr16_status == "IN_PLAY") {
            if (bettype === "b") {
              liverate =
                obj.game.markets.market[1].selections.selection[4]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market[1].selections.selection[4]
                  .bestAvailableToLayPrices.price[0]._;
            } else {
              return res.status(400).json({
                status: false,
                message: "Type not valid",
              });
            }
          } else {
            return res.status(400).json({
              status: false,
              message: "Round not open",
            });
          }
        }
      }

      let ta = 0;
      let tb = 0;
      let tc = 0;
      let td = 0;

      let tx = 0;
      console.log('rate->',rat,' liverate->',liverate)
      if (bettype.toLowerCase() === "b") {
        if (
          odds <= liverate &&
          liverate > 0 &&
          liverate !== undefined &&
          liverate !== null
        ) {
          ratok = 1;
          rat = liverate;
          pro = Math.round(rat * amount - amount);
          lib = Number(amount);

          if (rnrValue == 1) {
            ta += pro;
            tb -= lib;
          }
        } else {
          ratok = 0;
        }
      } else if (bettype.toLowerCase() === "l") {
        if (
          rat >= liverate &&
          liverate > 0 &&
          liverate !== undefined &&
          liverate !== null
        ) {
          ratok = 1;
          ///
          rat = liverate;
          ///
          pro = Number(amount);
          lib = Math.round(rat * amount - amount);
          if (rnrValue == 1) {
            ta -= lib;
            tb += pro;
          }
        } else {
          ratok = 0;
        }
      }

      if (ratok == 1) {
        pointok = 0;
        const drstc = await BzBetfairHiloMatch.findOne({
          mid_mid: catmid,
          user_id: req.user._id,
          rnr_nam: teamname,
        }).lean();

        if (drstc) {
          let limit = 0;

          pla = drstc.lockamt;
          nla1 = drstc.bak + ta;
          nla2 = drstc.lay + tb;

          if (Math.min(nla1, nla2) < 0) nla = Math.abs(Math.min(nla1, nla2));
          else nla = 0;

          cla = pla - nla;
          pointok = 1;

          if (userHistoryQuery[0]["bz_balance"] - cla >= 0) {
            let stm = await BzBetfairHiloMatch.updateOne(
              { mid_mid: catmid, user_id: req.user._id },
              {
                $inc: {
                  bak: ta,
                  lay: tb
                },
                $set: { lockamt: nla }
              }
            );
          } else pointok = 2;
        } else {
          if (lib <= userHistoryQuery[0].bz_balance) {
            drsts = await BzBetfairHiloRates.find({
              cat_mid: catmid
            }).lean();

            cla = -lib;
            nla = cla2 = lib;

            if (userHistoryQuery[0].bz_balance - cla >= 0) {
              pla = 0;

              const stm = await BzBetfairHiloMatch.create({
                mid_mid: catmid,
                uname: req.user.uname,
                user_id: req.user._id,
                rnr_nam: teamname,
                rnr_sid: sid,
                bak: ta,
                lay: tb,
                lockamt: cla2,
                evt_id: catmid
              });
              pointok = 1;
            } else pointok = 2;
          } else {
            pointok = 0;
          }
        }

        if (pointok == 1) {
          ///
          await BzBetfairHiloRates.updateOne(
            { evt_id: catmid },
            { $set: { is_bet_place: "1" } }
          );
          ///

          const betHistory = await BzBetfairHiloBetHistory.create({
            uname: req.user.uname,
            user_id: req.user._id,
            cat_mid: catmid,
            rnr: rnr,
            rate: rat,
            amnt: amount,
            pro: pro,
            lib: lib,
            type: bettype,
            cla: cla,
            rnrsid: sid,
            round: round,
            rnr_val: rnr_val
          });
          const bet_id = betHistory._id;
          console.log("UpdateBalance->" + req.user._id + "/Balance" + cla);
          let st2 = UpdateBalance(req.user._id, cla);
          await pushExposure(req, res, sid, cla, "Live Betfair Hilo");

          if (st2) {
            balance_point =
              Number(userHistoryQuery[0].bz_balance) + Number(cla);

            const dt = moment().format("YYYY-MM-DD HH:mm:ss");

            if (cla > 0)
              claVal = Number(userHistoryQuery[0].bz_balance) + Number(cla);
            else claVal = Number(userHistoryQuery[0].bz_balance) - Number(cla);

            //claVal = dr[0]['bz_balance']. cla;

            //New Logs
            await UserLogs.create({
              page: "livebet_betfair_hilo",
              linkid: bet_id,
              ptrans: cla,
              otrans: "",
              points: claVal,
              obal: userHistoryQuery[0].opin_bal.toString(),
              uname: req.user.uname,
              user_id: req.user._id,
              date: dt,
              ptype: "bet"
            });

            //echo "BET_OK,$balance_point";

            await LiveNotifications.create({
              evt_id: "Live Betfair Hilo",
              user_id: req.user._id,
              game_type: "6",
              description: `${req.user._id} placed bet on ${teamname} in Live Betfair Hilo casino games.`
            });

            return res.status(200).json({
              status: true,
              message: "Bet Place Successfully."
            });
          } else {
            return res
              .status(400)
              .json({ status: false, message: "Bet error while placing bet" });
          }
        } else if (pointok == 2) {
          return res.status(400).json({
            status: false,
            message: "Insufficient balance for placing this bet."
          });
        } else if (pointok == 3) {
          return res.status(400).json({
            status: false,
            message: "Insufficient balance for placing this bet.."
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "Insufficient balance for placing this bet..."
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "Live Rate Not Matched.",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        message: "It's showing you are not login to place this bet",
      });
    }
  } else {
    return res.status(404).json({
      status: false,
      message: "Something went wrong.Try again to palce bet.",
    });
  }
}

module.exports = { placeBet };
