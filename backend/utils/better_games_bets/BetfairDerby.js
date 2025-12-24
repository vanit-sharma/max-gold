const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const BzBetfairDerbyRate = require("../../models/BzBetfairDerbyRate");
const BzBetfairDerbyMatch = require("../../models/BzBetfairDerbyMatch");
const BetfairDerbyBetHistory = require("../../models/BetfairDerbyBetHistory");
const Punter = require("../../models/Punter");
const UserLogs = require("../../models/UserLogs.js");
const LiveNotifications = require("../../models/LiveNotifications.js");

const {
  getBetfairGamesData,
  UpdateBalance,
  pushExposure,
} = require("../function.js");

function validateCanPlaceBet(req, res) {
  
  const error = [];

  const {
    amount,
    catmid,
    teamname,
    bettype,
    odds,
    selectRnr,
    round,
    marketVal,
  } = req.body;

  
  
  if (req.user.user_role != 8) {
    error.push("Betting Not allowed!");
  }

  if (teamname.length > 35) {
    error.push("Runner name not valid");
  }

  if (odds.length > 5) {
    error.push("Odd not valid1");
  }

  if (odds > 100) {
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
  console.log("placeBet", req.body);
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
    marketVal,
    game_type
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
    if (teamname == "Spades") {
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
    } else if (teamname == "Hearts") {
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
    } else if (teamname == "Clubs") {
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
    } else if (teamname == "Diamonds") {
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
    } else {
      return res.status(400).json({
        status: false,
        message: "Runner name not valid",
      });
    }

    const now = new Date();

    const qds = await BzBetfairDerbyRate.aggregate([
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

    let rnrValue = 0;
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
          rnr == "runner4b3"))
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
      return_array.game_name = "BetfairDerby";
      return_array.result = false;
      let gameId = "1444116";
      let jsonds = await getBetfairGamesData(gameId);
      
      jsonds = jsonds.channelSnapshot;

      if (
        jsonds != "ER101" &&
        jsonds != "" &&
        jsonds != null &&
        jsonds.channel != null &&
        jsonds.channel.$.id == gameId &&
        jsonds.channel.game.markets.market.status == "ACTIVE" &&
        jsonds.channel.game.$.id == catmid
      ) {
        
        let obj = jsonds.channel;
        if (obj.game.round <= 0) {
          return res.status(400).json({
            status: false,
            message: "Round not valid",
          });
        }
        if (obj.game.round != round) {
          return res.status(400).json({
            status: false,
            message: "Round not valid",
          });
        }
        if (obj.game.markets.market.status != "ACTIVE") {
          return res.status(400).json({
            status: false,
            message: "Round not valid",
          });
        }
        if (obj.status != "RUNNING") {
          return res.status(400).json({
            status: false,
            message: "Round not valid",
          });
        }

        let lcat_mid = obj.game.$.id;
        let levt_id = lcat_mid;

        let lcat_sid1 = lcat_mid + "-1";
        let lcat_sid2 = lcat_mid + "-2";
        let lcat_sid3 = lcat_mid + "-3";
        let lcat_sid4 = lcat_mid + "-4";

        let lcat_rnr1_status =
          obj.game.markets.market.selections.selection[0].status;
        let lcat_rnr2_status =
          obj.game.markets.market.selections.selection[1].status;
        let lcat_rnr3_status =
          obj.game.markets.market.selections.selection[2].status;
        let lcat_rnr4_status =
          obj.game.markets.market.selections.selection[3].status;

        
        if (String(lcat_mid).trim() == String(evt_id).trim()) {
          if (lcat_sid1 == sid && lcat_rnr1_status == "IN_PLAY") {
            if (bettype == "b") {
        
              liverate =
                obj.game.markets.market.selections.selection[0]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype == "l") {
              liverate =
                obj.game.markets.market.selections.selection[0]
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
                obj.game.markets.market.selections.selection[1]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market.selections.selection[1]
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
                obj.game.markets.market.selections.selection[2]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market.selections.selection[2]
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
                obj.game.markets.market.selections.selection[3]
                  .bestAvailableToBackPrices.price[0]._;
            } else if (bettype === "l") {
              liverate =
                obj.game.markets.market.selections.selection[3]
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
      let te = 0;

      if (bettype.toLowerCase() == "b") {
        
        if (
          odds <= liverate &&
          liverate > 0 &&
          liverate !== undefined &&
          liverate !== null
        ) {
          ratok = 1;
          ///
          rat = liverate;
          ///
          pro = Math.round(rat * amount - amount, 2);
          lib = amount;
          if (marketVal == 1) {
            if (
              rnr == "runner1b1" ||
              rnr == "runner1b2" ||
              rnr == "runner1b3"
            ) {
              ta += pro;
              tb -= lib;
              tc -= lib;
              td -= lib;
            }
            if (
              rnr == "runner2b1" ||
              rnr == "runner2b2" ||
              rnr == "runner2b3"
            ) {
              ta -= lib;
              tb += pro;
              tc -= lib;
              td -= lib;
            }
            if (
              rnr == "runner3b1" ||
              rnr == "runner3b2" ||
              rnr == "runner3b3"
            ) {
              ta -= lib;
              tb -= lib;
              tc += pro;
              td -= lib;
            }
            if (
              rnr == "runner4b1" ||
              rnr == "runner4b2" ||
              rnr == "runner4b3"
            ) {
              ta -= lib;
              tb -= lib;
              tc -= lib;
              td += pro;
            }
          }
        } else {
          ratok = 0;
        }
      } else if (bettype.toLowerCase() == "l") {
        if (odds >= liverate && liverate > 0 && liverate) {
          ratok = 1;
          ///
          rat = liverate;
          ///
          pro = amount;
          lib = Math.round(rat * amount - amount);
          if (marketVal == 1) {
            if (
              rnr == "runner1l1" ||
              rnr == "runner1l2" ||
              rnr == "runner1l3"
            ) {
              ta -= lib;
              tb += pro;
              tc += pro;
              td += pro;
            }
            if (
              rnr == "runner2l1" ||
              rnr == "runner2l2" ||
              rnr == "runner2l3"
            ) {
              ta += pro;
              tb -= lib;
              tc += pro;
              td += pro;
            }
            if (
              rnr == "runner3l1" ||
              rnr == "runner3l2" ||
              rnr == "runner3l3"
            ) {
              ta += pro;
              tb += pro;
              tc -= lib;
              td += pro;
            }
            if (
              rnr == "runner4l1" ||
              rnr == "runner4l2" ||
              rnr == "runner4l3"
            ) {
              ta += pro;
              tb += pro;
              tc += pro;
              td -= lib;
            }
          }
        } else {
          ratok = 0;
        }
      }

      if (ratok == 1) {
        pointok = 0;
        const drstc = await BzBetfairDerbyMatch.findOne({
          cat_mid: catmid,
          user_id: req.user._id,
          market_type: marketVal,
        }).lean();

        if (drstc) {
          limit = 0;

          limita = drstc.lockamt + drstc.rnr1s + userHistoryQuery[0].bz_balance;
          limitb = drstc.lockamt + drstc.rnr2s + userHistoryQuery[0].bz_balance;
          limitc = drstc.lockamt + drstc.rnr3s + userHistoryQuery[0].bz_balance;
          limitd = drstc.lockamt + drstc.rnr4s + userHistoryQuery[0].bz_balance;
          console.log('+++++++++++++++++ line 664');
          if (marketVal == 1) {
            if (
              rnr == "runner1b1" ||
              rnr == "runner1b2" ||
              rnr == "runner1b3"
            ) {
              limit = Math.min(limitb, limitc, limitd);
            }
            if (
              rnr == "runner2b1" ||
              rnr == "runner2b2" ||
              rnr == "runner2b3"
            ) {
              limit = Math.min(limita, limitc, limitd);
            }
            if (
              rnr == "runner3b1" ||
              rnr == "runner3b2" ||
              rnr == "runner3b3"
            ) {
              limit = Math.min(limitb, limita, limitd);
            }
            if (
              rnr == "runner4b1" ||
              rnr == "runner4b2" ||
              rnr == "runner4b3"
            ) {
              limit = Math.min(limitb, limitc, limita);
            }

            if (
              rnr == "runner1l1" ||
              rnr == "runner1l2" ||
              rnr == "runner1l3"
            ) {
              limit = limita;
            }
            if (
              rnr == "runner2l1" ||
              rnr == "runner2l2" ||
              rnr == "runner2l3"
            ) {
              limit = limitb;
            }
            if (
              rnr == "runner3l1" ||
              rnr == "runner3l2" ||
              rnr == "runner3l3"
            ) {
              limit = limitc;
            }
            if (
              rnr == "runner4l1" ||
              rnr == "runner4l2" ||
              rnr == "runner4l3"
            ) {
              limit = limitd;
            }
          }
          
          if (lib <= limit) {
            //update bt_match_teenpatti
            pla = drstc.lockamt;
            nla1 = drstc.rnr1s + ta;
            nla2 = drstc.rnr2s + tb;
            nla3 = drstc.rnr3s + tc;
            nla4 = drstc.rnr4s + td;
            //nla5 = drstc.rnr5s + te;

            if (Math.min(nla1, nla2, nla3, nla4) < 0)
              //, nla5
              nla = Math.abs(Math.min(nla1, nla2, nla3, nla4));
            else nla = 0;

            cla = pla - nla;
            pointok = 1;

            if (userHistoryQuery[0].bz_balance - cla >= 0) {
              let stm = await BzBetfairDerbyMatch.updateOne(
                {
                  cat_mid: catmid,
                  user_id: req.user._id,
                  market_type: marketVal,
                },
                {
                  $inc: {
                    rnr1s: ta,
                    rnr2s: tb,
                    rnr3s: tc,
                    rnr4s: td,
                    //rnr5s: te,
                  },
                  $set: { lockamt: nla },
                }
              );
            } else pointok = 2;
          }
        } else {
          if (lib <= userHistoryQuery[0].bz_balance) {
            drsts = await BzBetfairDerbyRate.find({
              cat_mid: catmid,
            }).lean();

            cla = -lib;
            nla = cla2 = lib;

            if (userHistoryQuery[0].bz_balance - cla >= 0) {
              pla = 0;

              let sidVal1 = "";
              let sidVal2 = "";
              let sidVal3 = "";
              let sidVal4 = "";
              let name1 = "";
              let name2 = "";
              let name3 = "";
              let name4 = "";
              if (marketVal == 1) {
                sidVal1 = drsts.cat_sid1;
                sidVal2 = drsts.cat_sid2;
                sidVal3 = drsts.cat_sid3;
                sidVal4 = drsts.cat_sid4;

                name1 = drsts.cat_rnr1;
                name2 = drsts.cat_rnr2;
                name3 = drsts.cat_rnr3;
                name4 = drsts.cat_rnr4;
               } //else if (marketVal == 2) {
              //   sidVal1 = drsts.cat_sid5;
              //   sidVal2 = drsts.cat_sid6;
              //   sidVal3 = drsts.cat_sid7;
              //   sidVal4 = drsts.cat_sid8;

              //   name1 = drsts.cat_rnr5;
              //   name2 = drsts.cat_rnr6;
              //   name3 = drsts.cat_rnr7;
              //   name4 = drsts.cat_rnr8;
              // }
console.log('+++++++++++++++++ line 802');
              const stm = await BzBetfairDerbyMatch.create({
                cat_mid: catmid,
                uname: req.user.uname,
                user_id: req.user._id,
                rnr1: name1,
                rnr2: name2,
                rnr3: name3,
                rnr4: name4,
                rnr1s: ta,
                rnr2s: tb,
                rnr3s: tc,
                rnr4s: td,
                rnr1sid: sidVal1,
                rnr2sid: sidVal2,
                rnr3sid: sidVal3,
                rnr4sid: sidVal4,
                market_type: marketVal,
                lockamt: cla2,
              });
              pointok = 1;
            } else pointok = 2;
          } else {
            pointok = 0;
          }
        }
        
        if (pointok == 1) {
          console.log('+++++++++++++++++ line 830');
          await BzBetfairDerbyRate.updateOne(
            { evt_id: catmid },
            { $set: { is_bet_place: "1" } }
          );
          ///

          const betHistory = await BetfairDerbyBetHistory.create({
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
            rnr_val: rnr_val,
            market_type: marketVal,
          });
          console.log('+++++++++++++++++ line 852');
          const bet_id = betHistory._id;

          let st2 = UpdateBalance(req.user._id, cla);
          console.log('+++++++++++++++++ line 857');
          await pushExposure(req, res, sid, cla, "Live Betfair Derby Race");
console.log('+++++++++++++++++ line 858');
          if (st2) {
            balance_point =
              Number(userHistoryQuery[0].bz_balance) + Number(cla);

            const dt = moment().format("YYYY-MM-DD HH:mm:ss");

            if (cla > 0)
              claVal = Number(userHistoryQuery[0].bz_balance) + Number(cla);
            else claVal = Number(userHistoryQuery[0].bz_balance) - Number(cla);

            //claVal = dr[0]['bz_balance']. cla;
console.log('+++++++++++++++++ line 871');
            //New Logs
            await UserLogs.create({
              page: "livebet_betfair_omaha",
              linkid: bet_id,
              ptrans: cla,
              otrans: "",
              points: claVal,
              obal: userHistoryQuery[0].opin_bal.toString(),
              uname: req.user.uname,
              user_id: req.user._id,
              date: dt,
              ptype: "bet",
            });
console.log('+++++++++++++++++ line 884');
            //echo "BET_OK,$balance_point";

            await LiveNotifications.create({
              evt_id: "Live Betfair Turbo Derby Race",
              user_id: req.user._id,
              game_type: game_type,
              description: `${req.user._id} placed bet on ${teamname} in Live Betfair Omaha casino games.`
            });
console.log('+++++++++++++++++ line 893');
            return res.status(200).json({
              status: true,
              message: "Bet Place Successfully.",
            });
          } else {
            return res
              .status(400)
              .json({ status: false, message: "Bet error while placing bet" });
          }
        } else if (pointok == 2) {
          return res.status(400).json({
            status: false,
            message: "Insufficient balance for placing this bet.",
          });
        } else if (pointok == 3) {
          return res.status(400).json({
            status: false,
            message: "Insufficient balance for placing this bet..",
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "Insufficient balance for placing this bet...",
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
