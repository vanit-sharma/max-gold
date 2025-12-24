const mongoose = require("mongoose");
const BzAviatorxRate = require("../models/BzAviatorxRate.js");
const BzAviatorxMatch = require("../models/BzAviatorxMatch");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzAviatorxBethistory = require("../models/BzAviatorxBethistory");
const { UpdateBalance, pushExposure } = require("../../utils/function");

const BzPtRecord = require("../../models/BzPtRecord");
const BzPtLogHistory = require("../../models/BzPtLogHistory");

async function placeAviatorxGameBet(req) {
  let result = {};
  if (req.user.user_role != 8) {
    result.status = false;
    result.message = "Betting Not allowed!!!";
    return result;
  }

  let eid = req.body.catmid; // catmid = 18.220808091932
  let mnam = req.body.teamname; // teamname
  console.log("mnam: ", mnam);
  let rnr = req.body.bettype; //b =back , l= lay
  let rat = req.body.odds;
  let amt = req.body.amount; // amount

  let currency = req.user.currency;
  let user_id = req.user._id;

  let min_amount = 0;
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
  // Get bet limit from BetLimit model
  const betLimitDoc = await BetLimit.findOne({ user_id: user_id }).lean();
  const limit_bet = betLimitDoc.casino;

  if (amt > limit_bet) {
    result.status = false;
    result.message = `min ${min_amount} and max ${limit_bet} point bet allow`;
    return result;
  }

  if (amt < min_amount) {
    result.status = false;
    result.message = `min ${min_amount} and max ${limit_bet} point bet allow`;
    return result;
  }

  if (
    eid &&
    mnam &&
    rnr &&
    rat &&
    rat > 0 &&
    rat !== "SUSPENDED" &&
    amt &&
    amt >= min_amount &&
    amt <= limit_bet
  ) {
    mid = req.body.catmid; // catmid = 18.220808091932
    typ = req.body.bettype; //b =back , l= lay
    mnam = req.body.teamname; // teamname
    rnr = req.body.bettype;
    rat = req.body.odds;
    amt = req.body.amount;
    gameType = req.body.game_type;

    if (amt > limit_bet) {
      result.status = false;
      result.message = `min ${min_amount} and max ${limit_bet} point bet allow`;
      return result;
    }

    if (amt < min_amount) {
      result.status = false;
      result.message = `min ${min_amount} and max ${limit_bet} point bet allow`;
      return result;
    }

    ///
    let contract_money = amt;
    let amtPercentage = 2;
    let fee = 0;
    let delivery = amt;
    ///
    uid = req.user.uname;
    upt = req.user.point;
    user_id = req.user._id;
    console.log("mnam before:", mnam);
    mnam = String(mnam).toLowerCase();
    bet_type = gameType;
    //gameRate = rat;
    gameRate = 0;
    gameProfit = 0;

    if (mnam == "aviatorx") {
      new_sid = 1;
    } else {
      result.status = false;
      result.message = "Runner name not valid";
      return result;
    }

    intSid = new_sid;
    new_compare_sid = mid + "-" + new_sid;
    sid = new_compare_sid;
    typ = "b";

    if (typ == "b") {
      rnr = "b1";
    }

    const qdr = await BzAviatorxRate.findOne({
      evt_id: mid,
    });

    if (qdr) {
      // Calculate time difference in seconds between now and evt_od

      let timeDiff = Math.abs(new Date() - new Date(qdr.evt_od)) / 1000; // Calculate time difference in seconds
      qdr.difftm = timeDiff;

      stld = qdr.stld;
      match_status = qdr.evt_status;
      evt_id = qdr.evt_id;
      cat_sid1 = qdr.cat_sid1;
      timeLeft = qdr.difftm;
      b1 = qdr.b1;
    } else {
      result.status = false;
      result.message = "Bet not placed. Time is up!!";
      return result;
    }

    dr = await Punter.aggregate([
      {
        $match: { _id: session._id },
      },
      {
        $lookup: {
          from: "bz_user_login_history", // the collection name
          localField: "_id", // Punter’s _id
          foreignField: "userAutoId", // history’s userAutoId
          as: "loginHistory", // output array field
        },
      },
      {
        $unwind: {
          path: "$loginHistory",
          preserveNullAndEmptyArrays: true, // keeps the user even if no history
        },
      },

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
      {
        $limit: 1,
      },
    ]);

    if (dr && dr.logon == 1) {
      let return_array = {};
      let userObal = dr.opin_bal;
      liverate = 0;
      isMatch = false;

      ///
      betArray = req.body.bet_array;
      let totalAmt = 0;
      for (const bets of betArray) {
        totalAmt += delivery;
      }
      if (totalAmt > dr.bz_balance) {
        result.status = false;
        result.message = "Low Balance!!!";
        return result;
      }

      ta = 0;
      tb = 0;
      tc = 0;

      ratok = 1;

      if (ratok == 1) {
        try {
          ///
          betArray = req.body.bet_array;
          new_sid = 0;
          errorStatus = 0;
          let returnbets = {};

          for (const bets of betArray) {
            new_sid++;
            intSid = new_sid;
            new_compare_sid = mid + "-" + new_sid;
            sid = new_compare_sid;
            lib = delivery; //bets['bet_amount'];
            amt = delivery; //bets['bet_amount'];
            ///
            pointok = 0;

            if (lib <= dr.bz_balance) {
              cla = -lib;
              nla = cla2 = lib;
              if (dr.bz_balance - cla >= 0) {
                pla = 0;
                if (cla2 <= limit_bet) {
                  newPro = 0;

                  const matchRs = await BzAviatorxMatch.create({
                    mid_mid: mid,
                    uname: uid,
                    rnr_nam: mnam,
                    rnr_sid: sid,
                    bak: newPro,
                    lay: cla,
                    lockamt: cla2,
                    evt_id: mid,
                    fee: fee,
                    contract_money: contract_money,
                    delivery: delivery,
                    bet_type: bet_type,
                    user_id: user_id,
                    rate: gameRate,
                  });
                  summary_id = matchRs._id;
                  pointok = 1;
                } else {
                  pointok = 3;
                }
              } else {
                pointok = 2;
              }
            } else {
              pointok = 0;
            }

            if (pointok == 1) {
              ///
              await BzAviatorxRate.updateOne(
                { evt_id: mid },
                { $set: { is_bet_place: "1" } }
              );
              ///
              cla = -lib;
              ratRollDIce = 0;
              newPro = 0;
              // Save bet history in MongoDB
              const betHistory = await BzAviatorxBethistory.create({
                uname: uid,
                cat_mid: mid,
                rnr: mnam,
                rate: gameRate,
                amnt: amt,
                pro: newPro,
                lib: lib,
                type: typ,
                cla: cla,
                rnrsid: sid,
                sid: intSid,
                fee: fee,
                contract_money: contract_money,
                delivery: delivery,
                bet_type: bet_type,
                user_id: user_id,
              });
              const bet_id = betHistory._id;

              const remark = `Aviatorx Game Round ID: ${mid}`;

              // Insert record into bz_pt_records collection
              const ptRecordRs = await BzPtRecord.create({
                from: uid,
                to: "JKADMIN",
                point: amt,
                type: "BETAVIATORX",
                remark: remark,
                loginId: user_id,
                ipadd:
                  req.ip ||
                  (req.headers["x-forwarded-for"] || "").split(",")[0] ||
                  req.connection.remoteAddress,
                remark2: bet_id,
                summary_id: summary_id,
                is_virtual: 1,
                virtual_game_name: 35,
              });
              let st2;
              if (ptRecordRs._id) {
                // Update user's balance in MongoDB
                // st2 = await Punter.updateOne(
                //   { _id: user_id },
                //   {
                //     $inc: { bz_balance: -amt, opin_bal: -amt },
                //   }
                // );

                const st2 = await UpdateBalance(req.user._id, cla);
                await pushExposure(req, res, sid, cla, "Aviatorx Game");

                // Get updated user balances
                const updatedUser = await Punter.findOne(
                  { _id: user_id },
                  { opin_bal: 1, bz_balance: 1 }
                ).lean();
                const opin_bal = updatedUser.opin_bal;

                // Insert log history
                await BzPtLogHistory.insertOne({
                  uname: uid,
                  linkid: summary_id,
                  points: opin_bal,
                  date: new Date(),
                  type: "BETAVIATORX",
                });
              }

              if (st2) {
                balance_point = dr.bz_balance + cla;
                //$this->session->set_userdata('point',$balance_point);
                const dt = new Date()
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19);

                await Notifications.create({
                  evt_id: "Aviatorx Game",
                  user_id: user_id,
                  game_type: "22",
                  description: `${uid} placed bet on ${mnam} in Aviatorx game.`,
                });
              } else {
                errorStatus = 1;
              }
            } else if (pointok == 2) {
              errorStatus = 1;
            } else if (pointok == 3) {
              errorStatus = 1;
            } else {
              errorStatus = 1;
            }

            returnbets.bet_id = summary_id;

            let dataResponse = {
              return_bets: returnbets,
            };
          }

          if (errorStatus == 0) {
            let result = {
              status: true,
              data: dataResponse,
              message: "Bet Place Successfully.",
            };
            return result;
          } else {
            errorStatus = 1;
            result.status = false;
            result.message = "Bet error while placing bet";
            return result;
          }
        } catch (error) {
          //$db->rollBack();
          result.status = false;
          result.message = "Bet Error Roll back.";
          return result;
        }
      } else {
        result.status = false;
        result.message = "Odd not matched.";
        return result;
      }
    } else {
      result.status = false;
      result.message = "Please login again to place this bet";
      return result;
    }
  } else {
    result.status = false;
    result.message = "Some information is missing to place this bet.";
    return result;
  }
}

async function placeBet(req) {
  if (req.body && req.method === "POST") {
    const amount = req.body.amount;
    const market_type = req.body.market_type;
    const game_name = req.body.game_name;
    const odds = req.body.odds;
    const catmid = req.body.catmid;
    if (amount && market_type && game_name && catmid && odds) {
      if (game_name === "aviatorx") {
        return placeAviatorxGameBet(req);
      } else {
        return { status: false, message: "Wrong Game Name" };
      }
    } else {
      return {
        status: false,
        message: "Information missing to place this bet.",
      };
    }
  } else {
    return { status: false, message: "No direct script allowed!" };
  }
}

async function getAviatorxDetails(req) {
    
  let result = {};
  result.evt_id = 0;

  result.timeLeft = 0;
  result.b1 = "";

  result.suspend1 = 1;

  //Refresh userBets
  let userBets = {};
  dbOdds = false;
  isStopGame = true;

  //Livestat
  livestat = "";
  livestat = "0,0,0";

  //check redis
  isRedisEnable = true;
  luckyPlayer = "";

  // if(isRedisEnable)
  // {
  //     $this->load->library('redis');
  //     // create redis object
  //     $redis = $this->redis->config();

  //     $redisData = $this->redis->getData('aviatorx', 0);

  //     if($redisData != "")
  //     {
  //         $dra = json_decode($redisData, true);
  //         $isStopGame = $dra[0]['game'];

  //     }
  //     else
  //     {
  //         $dbOdds = true;
  //     }
  // }
  let dra;
  if (dbOdds) {
    // Fetch the latest bz_aviator_rates document where stld = '0'
    dra = await BzAviatorxRate.find({ stld: "0" })
      .sort({ id: -1 })
      .limit(1)
      .lean();
  }

  if (dra) {
    dr = dra[0];
    result.roundId = id = dr.evt_id;

    if (dr.left_time < 0) {
      result.timeLeft = 0;
    } else {
      result.timeLeft = dr.left_time;
    }

    result.b1 = dr.b1;

    result.evt_id = dr.evt_id;
    result.status = dr.evt_status;
    result.suspend1 = dr.suspend1;

    result.result = dr.result;
    result.start = dr.start;
    result.end = dr.end;

    //Refresh userBets

    // Fetch last 10 bets for this Aviatorx round from MongoDB
    const bets = await BzAviatorxMatch.find({ evt_id: id })
      .sort({ delivery: -1 })
      .limit(10)
      .lean();

    luckyPlayer = bets.length;

    if (bets.length > 0) {
      let i = 0;
      for (const dr of bets) {
        let record = {};
        i++;
        let catmid = dr.cat_mid;
        let sid = dr.rnrsid;

        let rname = "";

        
        let unameRec = dr.uname;
        let unameVal =
          unameRec.length >= 3 ? unameRec.substring(0, 3) + "***" : "***";
        let profitData = Math.floor(Number(dr.delivery) * Number(dr.rate));

        record.bg = ""; // No bg info in original code
        record.runner_name = rname;
        record.type = dr.bet_type; // there was no $tp so I hae used bet_type
        record.rate = dr.rate ? dr.rate : "-";
        record.amount = dr.delivery;
        record.profit = profitData ? profitData : "-";
        record.uname = unameVal;
        record.cat_mid = catmid;
        userBets.push(record);
      }
    }
    record = {};
    i++;
    catmid = dr.cat_mid;
    sid = dr.rnrsid;

    rname = "";

    ///
    unameRec = dr.uname;
    firstThree = unameRec.substring(0, 3);
    unameVal = firstThree + "***";
    profitData = Math.floor(Number(dr.delivery) * Number(dr.rate));
    ///
    record.bg = bg;
    record.runner_name = rname;
    record.type = tp;
    record.rate = dr.rate ? dr.rate : "-";
    record.amount = dr.delivery;
    record.profit = profitData ? profitData : "-";
    record.uname = unameVal;
    record.cat_mid = dr.mid_mid;
    userBets.push(record);
  }

  //Refresh userBets

  //Refresh userBets
  ///
  let from_stmp = new Date();
  from_stmp.setHours(0, 0, 0, 0);
  let to_stmp = new Date();
  to_stmp.setHours(23, 59, 59, 999);

  let history = {};

  //$redisDataResult = $this->redis->getData('aviator_Results', 0);

  // if($redisDataResult != "")
  // {
  // 	$history = json_decode($redisDataResult, true);

  // }
  let locked = "";
  result.results_history = history;
  result.book = locked;
  result.bets = userBets;
  result.luckyPlayer = luckyPlayer;

  return result;
}
async function getCardData(req) {
  if (req.body && req.method === "POST") {
    gametype = req.body.gametype;
    if (gametype == "aviatorx") {
      return getAviatorxDetails(req);
    }
  }
}

module.exports = { placeBet, getCardData };
