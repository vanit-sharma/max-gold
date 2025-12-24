const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const BzBetfairBaccaratRate = require("../../models/BzBetfairBaccaratRate");
const BzBetfairBaccaratMatch = require("../../models/BzBetfairBaccaratMatch");
const BzBetfairBaccaratBetHistory = require("../../models/BzBetfairBaccaratBetHistory");
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
  const { amount, catmid, teamname, bettype, odds, selectRnr, round, market_type } =
    req.body;


  let rat = odds;
  let rnr = bettype;

  if (teamname == 'Tie' && rnr == 'l') {
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
    if (teamname == "Player") {
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
    } else if (teamname == "Banker") {
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
    } else if (teamname == "Tie") {
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
    } else {
      return res.status(400).json({
        status: false,
        message: "Runner name not valid",
      });
    }

    const now = new Date();

    /*const qds = await BzBetfairBaccaratRate.aggregate([
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
    ]);*/
console.log('condition: cat_mid:',catmid,', round:',round);
    const qds = await BzBetfairBaccaratRate.aggregate([
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
          round_close_date: { $toDate: "$round_close_date" },
        },
      },
      // compute (now - round_close_date) in seconds
      {
        $addFields: {
          difftm: {
            $divide: [{ $subtract: [now, "$round_close_date"] }, 1000],
          },
        },
      },
    ]);
//console.log('qds->',qds);
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
          rnr == "runner3b3"))
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
      return_array.game_name = "BetfairBaccarat";
      return_array.result = false;
      let gameId = "1444086";
      let jsonds = await getBetfairGamesData(gameId);
      console.log('jsonds',JSON.stringify(jsonds.channelSnapshot.channel.game.markets.market, null, 2));
      jsonds = jsonds.channelSnapshot;
      //console.log(jsonds.channel.$);
      console.log('market 0',jsonds.channel.game.markets.market[0]);
      if (
        jsonds != "ER101" &&
        jsonds != "" &&
        jsonds != null &&
        jsonds.channel != null &&
        jsonds.channel.$.id == gameId 
        &&
        jsonds.channel.game.markets.market[0].status == "ACTIVE" 
        &&
        jsonds.channel.game.$.id == catmid
      ) {
        console.log('Inside jsonds check line 390');
        let obj = jsonds.channel;
        if (obj.game.round <= 0) {
          return res.status(400).json({
            status: false,
            message: "Round not valid"
          });
        }
        if (obj.game.round != round) {
          return res.status(400).json({
            status: false,
            message: "Round not valid"
          });
        }
        // if (obj.game.markets.market[0].status != "ACTIVE") {
        //   return res.status(400).json({
        //     status: false,
        //     message: "Round not valid"
        //   });
        // }
        if (obj.status != "RUNNING") {
          return res.status(400).json({
            status: false,
            message: "Round not valid"
          });
        }

        let lcat_mid = obj.game.$.id;
        let levt_id = lcat_mid;

        let lcat_sid1 = lcat_mid + "-1";
        let lcat_sid2 = lcat_mid + "-2";
        let lcat_sid3 = lcat_mid + "-3";
console.log('obj.game.markets.market: ',obj.game.markets.market)
        let lcat_rnr1_status =
          obj.game.markets.market[0].selections.selection[0].status;
        let lcat_rnr2_status =
          obj.game.markets.market[0].selections.selection[1].status;
        let lcat_rnr3_status =
          obj.game.markets.market[0].selections.selection[2].status;

          console.log(String(lcat_mid).trim() +"=="+ String(evt_id).trim())
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
                message: "Type not valid"
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
                message: "Type not valid"
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
                message: "Type not valid"
              });
            }
          } else {
            return res.status(400).json({
              status: false,
              message: "Round not open"
            });
          }
        }
      }

      let ta = 0;
      let tb = 0;
      let tc = 0;
      let td = 0;

      let tx = 0;

      console.log('odds:',odds,', liverate:',liverate);
      if (bettype.toLowerCase() === "b") {
        if (
          odds <= liverate &&
          liverate > 0 &&
          liverate !== undefined &&
          liverate !== null
        ) {
          ratok = 1;
          rat = liverate;
          pro = Math.round(rat * amount - amount, 2);
          lib = Number(amount);

          if (rnr == "runner1b1" || rnr == "runner1b2" || rnr == "runner1b3") {
            ta += pro;
            tb -= lib;
            tc -= lib;
          }
          if (rnr == "runner2b1" || rnr == "runner2b2" || rnr == "runner2b3") {
            ta -= lib;
            tb += pro;
            tc -= lib;
          }
          if (rnr == "runner3b1" || rnr == "runner3b2" || rnr == "runner3b3") {
            ta -= lib;
            tb -= lib;
            tc += pro;
          }

          /// tie ///
          if (rnr == "runner3b1" || rnr == "runner3b2" || rnr == "runner3b3") {
            tx += pro;
          }
        } else {
          console.log('ratok setting 0 at 525');
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
          lib = Math.round(rat * amount - amount, 2);
          if (rnr == "runner1l1" || rnr == "runner1l2" || rnr == "runner1l3") {
            ta -= lib;
            tb += pro;
            tc += pro;
          }
          if (rnr == "runner2l1" || rnr == "runner2l2" || rnr == "runner2l3") {
            ta += pro;
            tb -= lib;
            tc += pro;
          }
          if (rnr == "runner3l1" || rnr == "runner3l2" || rnr == "runner3l3") {
            ta += pro;
            tb += pro;
            tc -= lib;
          }

          /// tie ///
          if (rnr == "runner3l1" || rnr == "runner3l2" || rnr == "runner3l3") {
            tx -= lib;
          }
          /// tie ///
        } else {
          console.log('ratok setting 0 at 563');
          ratok = 0;
        }
      }

      if (ratok == 1) {
        pointok = 0;
        const drstc = await BzBetfairBaccaratMatch.findOne({
          cat_mid: catmid,
          user_id: req.user._id,
          rnr_nam: teamname
        }).lean();

        if (drstc) {
          let limit = 0;

          let limita =
            drstc.lockamt + drstc.rnr1s + userHistoryQuery[0].bz_balance;
          let limitb =
            drstc.lockamt + drstc.rnr2s + userHistoryQuery[0].bz_balance;
          let limitc =
            drstc.lockamt + drstc.rnr3s + userHistoryQuery[0].bz_balance;

          if (rnr == "runner1b1" || rnr == "runner1b2" || rnr == "runner1b3") {
            limit = Math.min(limitb, limitc);
          }
          if (rnr == "runner2b1" || rnr == "runner2b2" || rnr == "runner2b3") {
            limit = Math.min(limita, limitc);
          }
          if (rnr == "runner3b1" || rnr == "runner3b2" || rnr == "runner3b3") {
            limit = Math.min(limitb, limita);
          }

          if (rnr == "runner1l1" || rnr == "runner1l2" || rnr == "runner1l3") {
            limit = limita;
          }
          if (rnr == "runner2l1" || rnr == "runner2l2" || rnr == "runner2l3") {
            limit = limitb;
          }
          if (rnr == "runner3l1" || rnr == "runner3l2" || rnr == "runner3l3") {
            limit = limitc;
          }

          if (lib <= limit) {
            //update bt_match_teenpatti
            pla = drstc.lockamt;
            nla1 = drstc.rnr1s + ta;
            nla2 = drstc.rnr2s + tb;
            nla3 = drstc.rnr3s + tc;

            if (Math.min(nla1, nla2, nla3) < 0)
              nla = Math.abs(Math.min(nla1, nla2, nla3));
            else nla = 0;

            cla = pla - nla;
            pointok = 1;

            if (userHistoryQuery[0]["bz_balance"] - cla >= 0) {
              let stm = await BzBetfairBaccaratMatch.updateOne(
                { cat_mid: catmid, user_id: req.user._id },
                {
                  $inc: {
                    rnr1s: ta,
                    rnr2s: tb,
                    rnr3s: tc,
                    tie_book: tx
                  },
                  $set: { lockamt: nla }
                }
              );
            } else pointok = 2;
          } else pointok = 0;
        } else {
          if (lib <= userHistoryQuery[0].bz_balance) {
            drsts = await BzBetfairBaccaratRate.findOneAndUpdate({
              cat_mid: catmid
            }).lean();
console.log('drsts:',drsts);
            cla = -lib;
            nla = cla2 = lib;

            if (userHistoryQuery[0].bz_balance - cla >= 0) {
              pla = 0;

              
              const stm = await BzBetfairBaccaratMatch.create({
                cat_mid: catmid,
                uname: req.user.uname,
                user_id: req.user._id,
                rnr1: drsts.cat_rnr1,
                rnr1s: Number(ta),
                rnr2: drsts.cat_rnr2,
                rnr2s: Number(tb),
                rnr3: drsts.cat_rnr3,
                rnr3s: Number(tc),
                lockamt: Number(cla2),
                rnr1sid: drsts.cat_sid1,
                rnr2sid: drsts.cat_sid2,
                rnr3sid: drsts.cat_sid3,
                tie_book: Number(tx)
              });
              pointok = 1;
            } else pointok = 2;
          } else {
            pointok = 0;
          }
        }

        if (pointok == 1) {
          ///
          await BzBetfairBaccaratRate.updateOne(
            { evt_id: catmid },
            { $set: { is_bet_place: "1" } }
          );
          ///

          const betHistory = await BzBetfairBaccaratBetHistory.create({
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
            market_type: market_type,
            rnr_val: rnr_val
          });
          const bet_id = betHistory._id;

          let st2 = UpdateBalance(req.user._id, cla);
          await pushExposure(req, res, sid, cla, "Live Betfair Baccarat");

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
              page: "livebet_betfair_baccarat",
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
              evt_id: "Live Betfair Baccarat",
              user_id: req.user._id,
              game_type: "6",
              description: `${req.user._id} placed bet on ${teamname} in Live Betfair Baccarat casino games`
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
          message: "Live Rate Not Matched."
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
