const { JsonWebTokenError } = require("jsonwebtoken");
const { createClient } = require("redis");
const { redisClient, getData } = require("./redisClient");
const mongoose = require("mongoose");
const xml2js = require('xml2js');
const PunterMasterSharing = require("../models/PunterMasterSharing");
const Punter = require("../models/Punter");
const Logs = require("../models/Logs");
const BetfairEvent = require("../models/BetfairEvent");
const BetfairEventBet = require("../models/BetfairEventBets");
const BetPending = require("../models/BetPending");
const BetLimit = require("../models/BetLimit");
const UserBtnValue = require("../models/UserBtnValue");
const OneClickStakeValue = require("../models/OneClickStakeValue");
const StakeSetting = require("../models/StakeSetting");
const BzBtPunterMasterSharing = require("../models/BzBtPunterMasterSharing");
const getClientIp = require("../utils/getClientIp");
const axios = require("axios");
const BetBookSummary = require("../models/BetBookSummary");
const BzBtPunterSharing = require("../models/BzBtPunterSharing");
const BzStakeSettings = require("../models/BzStakeSettings");
const Exposure = require("../models/Exposure");



async function getBookMakerOdds(catmid) {
  const bookmakerJson = await getData(catmid, 22);
  return bookmakerJson;
}

async function getTieOdds(catmid) {
  const tieOddsJson = await getData(catmid, 23);
  return tieOddsJson;
}

async function getMarketOdds(catmid) {
  const marketJson = await getData(catmid, 0);
  return marketJson;
}

//Toss data
async function getTossData(catmid) {
  const tossJson = await getData(catmid, 101);
  return tossJson;
}

//fancy data
async function getFancyData(catmid) {
  const fancyJson = await getData(catmid, 2);
  return fancyJson;
}

//betfair fancy data
async function getBetfairFancyData(catmid) {
  const betfairFancyJson = await getData(catmid, 81);
  return betfairFancyJson;
}

//football fancy data
async function getFootBallFancyData(catmid) {
  const footballFancyJson = await getData(catmid, 9);

  if (footballFancyJson != null && footballFancyJson.length > 0) {
    for (i = 0; i < footballFancyJson.length; i++) {
      var obj = footballFancyJson[i];
      if (
        obj != "" &&
        obj != null &&
        obj != undefined &&
        obj.cat_mid != "" &&
        obj.cat_mid != null &&
        obj.cat_mid != undefined
      ) {
        var ffOdds = await getMarketOdds(obj.cat_mid);

        if (ffOdds !== null && ffOdds !== undefined) {
          footballFancyJson[i]["odd"] = ffOdds;
        } else {
          console.log("ffOdds->", ffOdds);
        }
      }
    }
  }

  return footballFancyJson;
}

//evenodd data
async function getEvenOddData(catmid) {
  const evenOddJson = await getData(catmid, 18);
  return evenOddJson;
}

//figuredata
//evenodd data
async function getFigureData(catmid) {
  const figuredata = await getData(catmid, 17);
  return figuredata;
}

//cricket scoreboard data
async function getCricketDate(catmid) {
  const cricketDataJson = await getData(catmid, 8);
  return cricketDataJson;
}

//tennis/football scoreboard data
async function getTennisFootballScoreboard(catmid) {
  const scoreJson = await getData(catmid, 88);
  return scoreJson;
}

async function getMarketData(catmid) {
  const eventDetails = await getData(catmid, 30);
  //console.log("eventDetails->", eventDetails);

  var bmOdds = null;
  if (eventDetails.is_bm_on && eventDetails.game_type == 1) {
    bmOdds = await getBookMakerOdds(catmid);
  }

  var tie_cat_mid = "";
  var marketOdds = "";
  var tiedds = null;

  marketOdds = await getMarketOdds(catmid);
  //console.log("marketOdds->", marketOdds);
  if (marketOdds != "" && marketOdds != undefined && marketOdds != null) {
    if (
      marketOdds.tie_cat_mid != undefined &&
      marketOdds.tie_cat_mid != null &&
      marketOdds.tie_cat_mid != ""
    ) {
      tie_cat_mid = marketOdds.tie_cat_mid;
      tiedds = await getTieOdds(tie_cat_mid);
    } else {
    }
  }

  var betfairFancy = null;
  if (eventDetails.bf_fancy_on && eventDetails.game_type == 1) {
    let betfairFancyData = await getBetfairFancyData(catmid);
    if (betfairFancyData != "" && betfairFancyData != null) {
      betfairFancy = betfairFancyData;
    }
  }

  let toss = null;
  tossData = await getTossData(catmid);
  if (tossData != "" && tossData != null) {
    toss = tossData;
  }

  let fancy = null;
  let fancyData = await getFancyData(catmid);
  //console.log("fancyData->", fancyData);
  if (fancyData != "" && fancyData != null) {
    fancy = fancyData;
  }

  var evenodddata = null;
  let evenodddataJson = await getEvenOddData(catmid);
  if (evenodddataJson != "" && evenodddataJson != null) {
    evenodddata = evenodddataJson;
  }

  var figuredata = null;
  let figuredataJson = await getFigureData(catmid);
  if (figuredataJson != "" && figuredataJson != null) {
    figuredata = figuredataJson;
  }

  var footballFancy = null;
  let footballFancyJson = await getFootBallFancyData(catmid);
  if (footballFancyJson != "" && footballFancyJson != null) {
    footballFancy = footballFancyJson;
  }

  var fancyScoreBoard = null;
  if (eventDetails.game_type == 1) {
    let cricketJsonData = await getCricketDate(catmid);
    if (cricketJsonData != "" && cricketJsonData != null) {
      fancyScoreBoard = cricketJsonData;
    }
  } else if (eventDetails.game_type == 2 || eventDetails.game_type == 3) {
    let scoreJsonData = await getTennisFootballScoreboard(catmid);
    if (scoreJsonData != "" && scoreJsonData != null) {
      fancyScoreBoard = scoreJsonData;
    }
  }

  //$redisDataTie = $this->redis->getData($tie_cat_mid, 23);

  return {
    bookmaker: bmOdds,
    odds: marketOdds,
    toss,
    fancy,
    tiedds: tiedds,
    betfairFancy: betfairFancy,
    evenodddata: evenodddata,
    figuredata: figuredata,
    footballFancy: footballFancy,
    fancyScoreBoard: fancyScoreBoard
  };
}

const getUserHierarchy = async (userId) => {
  const results = await PunterMasterSharing.find({ user_id: userId })
    .sort({ master_id: 1 })
    .select("user_id master_id sharing sharing_role")
    .lean();

  return results.map((doc) => ({
    user_id: doc.user_id,
    master_id: doc.master_id,
    sharing: doc.sharing,
    sharing_role: doc.sharing_role,
  }));
};

const get_user_latest_points_byid = async (userId) => {
  try {
    const user = await Punter.findOne({ _id: userId })
      .select("bz_balance")
      .lean();
    return user ? user.bz_balance : 0;
  } catch (err) {
    console.error("Error fetching user balance for _id=", userId, err);
    return 0;
  }
};



const UpdateBalance = async (userId, bal_amt) => {
  try {
    const result = await Punter.updateOne(
      { _id: userId },
      { $inc: { bz_balance: bal_amt } }
    );
    // result.nModified will be 1 if a document was found & updated
    return result;
  } catch (err) {
    console.error("Error updating user balance:", err);
    throw err;
  }
};

const createLog = async (req, type, narration) => {
  const user_agent = req.headers["user-agent"] || "Unknown";
  const ip_address = getClientIp(req.ip);

  const insertData = {
    user_id: req.user._id,
    type: type,
    narration: narration,
    ip: ip_address,
    device: user_agent,
  };
  return Logs.create(insertData);
};

const PlacePendingBet = async (res, req, postArr, liverate, rnr) => {
  const userid = req.user._id;
  const username = req.user.uname;

  bet_type = postArr.bet_type; //b = back l = lay
  user_rate = postArr.odds; // rate like 2.8
  bet_amount = postArr.amount; //amount
  mid = postArr.catmid; // cat_mid
  game_type = postArr.game_type; //game_type
  runnername = postArr.runnername; //runnername
  market_type = postArr.market_type; //market_type
  rnrsid = postArr.sid; //sid

  let betfairEvents = await BetfairEvent.findOne({ cat_mid: mid }).lean();

  if (!betfairEvents) {
    cat_sid1 = betfairEvents.cat_sid1;
    cat_sid2 = betfairEvents.cat_sid2;
    cat_sid3 = betfairEvents.cat_sid3;
  }

  if (bet_type == "b") {
    if (rnrsid == cat_sid1) {
      rnr = "b1";
      //section = runner1Name;
    } else if (rnrsid == cat_sid2) {
      rnr = "b2";
      //section = runner2Name;
    } else {
      rnr = "b3";
      //section = runner3Name;
    }
  } else {
    if (rnrsid == cat_sid1) {
      rnr = "l1";
      //section = runner1Name;
    } else if (rnrsid == cat_sid2) {
      rnr = "l2";
      //section = runner2Name;
    } else {
      rnr = "l3";
      //section = runner3Name;
    }
  }

  runner = 2;
  ta = 0;
  tb = 0;
  tc = 0;
  pro = 0;

  const event = await BetfairEvent.findOne({
    parent_cat_mid: mid,
    market_type: "tie",
  })
    .select("cat_rnr3")
    .lean();

  const cat_rnr3 = events.cat_rnr3;
  if (cat_rnr3 != "NA") {
    runner = 3;
  }

  if (bet_type == "b") {
    pro = user_rate * bet_amount - bet_amount;
    lib = bet_amount;

    if (rnr == "b1") {
      ta += pro;
      tb -= lib;
      tc -= lib;
    }
    if (rnr == "b2") {
      ta -= lib;
      tb += pro;
      tc -= lib;
    }
    if (rnr == "b3") {
      ta -= lib;
      tb -= lib;
      tc += pro;
    }
  }

  if (bet_type == "l") {
    pro = bet_amount;
    lib = user_rate * bet_amount - bet_amount;

    if (rnr == "l1") {
      ta -= lib;
      tb += pro;
      tc += pro;
    }
    if (rnr == "l2") {
      ta += pro;
      tb -= lib;
      tc += pro;
    }
    if (rnr == "l3") {
      ta += pro;
      tb += pro;
      tc -= lib;
    }
  }

  const drstc = await BetfairEventBet.findOne({
    cat_mid: mid,
    user_id: userId,
    market_type: 1,
  }).lean();
  if (drstc) {
    oldLockAmount = drstc.lockamt;
    nla1 = drstc.rnr1s + ta;
    nla2 = drstc.rnr2s + tb;

    if (runner == 2) {
      if (Math.min(nla1, nla2) < 0) {
        nla = Math.abs(Math.min(nla1, nla2));
      } else {
        nla = 0;
      }
    }

    if (runner == 3) {
      nla3 = drstc.rnr3s + tc;

      if (Math.min(nla1, nla2, nla3) < 0) {
        nla = Math.abs(Math.min(nla1, nla2, nla3));
      } else {
        nla = 0;
      }
    }
  } else {
    const nla = lib;
  }

  let xnewLockAmount = 0;
  if (nla == oldLockAmount) {
    xnewLockAmount = 0;
  } else if (nla > oldLockAmount) {
    xnewLockAmount = nla - oldLockAmount;
  } else {
    xnewLockAmount = oldLockAmount;
  }

  betfairEvents = await BetfairEvent.findOne({ cat_mid: mid }).lean();

  if (betfairEvents) {
    const matchTyp = betfairEvents.match_typ;
    const inplayStatus = betfairEvents.inplay;
    const evtType = betfairEvents.evt_api_type;
    const matchStatus = betfairEvents.match_status;
    const pending = betfairEvents.pending;
    const catSid1 = betfairEvents.cat_sid1;
    const catSid2 = betfairEvents.cat_sid2;
    const catSid3 = betfairEvents.cat_sid3;

    const runner1Name = betfairEvents.cat_rnr1;
    const runner2Name = betfairEvents.cat_rnr2;
    const runner3Name = betfairEvents.cat_rnr3;
    const evtOd = betfairEvents.evt_od;
    const eventName = betfairEvents.evt_evt;
    const eventId = betfairEvents.evt_id;
  }

  const ip = getClientIp(req.ip);

  profit = 0;
  liability = 0;
  if (bet_type == "b") {
    profit = user_rate * bet_amount - bet_amount;
    liability = bet_amount;
  }

  if (bet_type == "l") {
    profit = bet_amount;
    liability = user_rate * bet_amount - bet_amount;
  }

  cla = 0 - liability;
  st2 = await UpdateBalance(username, cla);

  await Punter.updateOne(
    { _id: userId },
    { $inc: { pending_balance: liability } }
  );

  const betPendingData = {
    user_id: userId,
    cat_mid: mid,
    rnr: runnername,
    rnrsid: rnrsid,
    type: bet_type,
    rate: user_rate,
    live_rate: liverate,
    bet_amount: bet_amount,
    profit: profit,
    liability: liability,
    ip: ip,
    bet_status: 0,
    runner_name: runnername,
    event_name: event_name,
    game_type: game_type,
    market_type: market_type,
    user_rate: user_rate,
    rnr_type: rnr,
    event_id: event_id,
  };

  await BetPending.create(betPendingData);

  return res.json({
    status: true,
    message: "Pending Bet Place Successfully.",
  });
};

const updateRefferCode = async (id) => {
  const ref_code = `RS00${id}`;

  try {
    const res = await Punter.updateOne({ _id: id }, { $set: { ref_code } });

    const modified = res.modifiedCount;
    return modified;
  } catch (err) {
    console.error("Error updating ref_code:", err);
    throw err;
  }
};

const getFullChain = async (userId) => {
  try {
    const user = await Punter.findOne({ _id: userId })
      .select("full_chain")
      .lean()
      .exec();

    if (user && user.full_chain) {
      return user.full_chain;
    }

    return ",";
  } catch (err) {
    console.error(`Error fetching full_chain for user ${userId}:`, err);

    return ",";
  }
};

const addStakesUsd = async (punterId) => {
  const stakeVal = [1, 2, 5, 10, 20, 50, 500];
  if (punterId) {
    // clear existing button‐values
    await UserBtnValue.deleteMany({ userid: punterId });
    await UserBtnValue.insertMany(
      stakeVal.map((val) => ({
        userid: punterId,
        type: "g",
        button_value: val,
      }))
    );
    await BzStakeSettings.deleteMany({ user_id: punterId });
    await BzStakeSettings.insertMany(
      stakeVal.map((val) => ({
        user_id: punterId,
        type: "g",
        button_value: val,
      }))
    );

    // clear existing one‐click stakes
    await OneClickStakeValue.deleteMany({ userid: punterId });
    await OneClickStakeValue.insertMany(
      stakeVal.map((val) => ({
        userid: punterId,
        stake: val,
      }))
    );

    // reset stake settings
    await StakeSetting.deleteMany({ userid: punterId });
    await StakeSetting.create({
      userid: punterId,
      default_stake: 5,
      highlight_odds: 1,
      accept_any_odds: 1,
    });
  }
  return true;
};

const addStakes = async (punterId) => {
  const stakeVal = [2000, 5000, 10000, 25000, 30000, 50000, 75000, 100000];
  if (punterId) {
    // clear existing button‐values
    await UserBtnValue.deleteMany({ userid: punterId });
    await UserBtnValue.insertMany(
      stakeVal.map((val) => ({
        userid: punterId,
        type: "g",
        button_value: val,
      }))
    );
    await BzStakeSettings.deleteMany({ user_id: punterId });
    await BzStakeSettings.insertMany(
      stakeVal.map((val) => ({
        user_id: punterId,
        type: "g",
        button_value: val,
      }))
    );

    // clear existing one‐click stakes
    await OneClickStakeValue.deleteMany({ userid: punterId });
    await OneClickStakeValue.insertMany(
      stakeVal.map((val) => ({
        userid: punterId,
        stake: val,
      }))
    );

    // reset stake settings
    await StakeSetting.deleteMany({ userid: punterId });
    await StakeSetting.create({
      userid: punterId,
      default_stake: 100,
      highlight_odds: 1,
      accept_any_odds: 1,
    });
  }
  return true;
};

const addLimit = async (masterId, userId) => {
  if (!userId) return true;

  // Fetch master’s limits
  const masterLimit = await BetLimit.findOne({ user_id: masterId }).lean();

  if (masterLimit) {
    const {
      soccer,
      tennis,
      cricket,
      fancy,
      hrace,
      casino,
      greyhound,
      bookMaker,
      virtual,
      toss,
      tie,
      soccer_min,
      tennis_min,
      cricket_min,
      fancy_min,
      hrace_min,
      greyhound_min,
      bookMaker_min,
      virtual_min,
      toss_min,
      tie_min,
      evenodd_min,
      figure_min,
      soccer_exp,
      tennis_exp,
      cricket_exp,
      fancy_exp,
      hrace_exp,
      greyhound_exp,
      bookMaker_exp,
      virtual_exp,
      toss_exp,
      tie_exp,
      evenodd_exp,
      figure_exp,
    } = masterLimit;

    await BetLimit.create({
      user_id: userId,
      soccer,
      tennis,
      cricket,
      fancy,
      hrace,
      casino,
      greyhound,
      bookMaker,
      created_date: new Date(),
      virtual,
      toss,
      tie,
      soccer_min,
      tennis_min,
      cricket_min,
      fancy_min,
      hrace_min,
      greyhound_min,
      bookMaker_min,
      virtual_min,
      toss_min,
      tie_min,
      evenodd_min,
      figure_min,
      soccer_exp,
      tennis_exp,
      cricket_exp,
      fancy_exp,
      hrace_exp,
      greyhound_exp,
      bookMaker_exp,
      virtual_exp,
      toss_exp,
      tie_exp,
      evenodd_exp,
      figure_exp,
    });
  } else {
    // No master record → use defaults
    await BetLimit.create({
      user_id: userId,
      soccer: 1_000_000,
      tennis: 250_000,
      cricket: 5_000_000,
      fancy: 200_000,
      hrace: 200_000,
      casino: 50_000,
      greyhound: 50_000,
      bookMaker: 2_000_000,
      created_date: new Date(),
      virtual: 100_000,
      toss: 1_000_000,
      tie: 100_000,
    });
  }

  return true;
};

const getUserUplineChain = async (arrPass, sponsorId, passSharing, childId) => {
  try {
    // Stop if we've reached the top
    if (!sponsorId) return [];

    // Fetch the sponsor punter record
    const punter = await Punter.findOne({ _id: sponsorId }).lean();

    if (!punter) return;

    let sponser_id = punter.sponser_id;
    let uname = punter.uname;
    let userSno = punter.sno;

    let sharing = 0;

    // Fetch any existing sharing record between the child and this sponsor
    const shareRec = await BzBtPunterMasterSharing.findOne({
      user_id: childId,
      master_id: sponsorId,
    }).lean();

    if (!shareRec) {
      sharing = 0;
    } else {
      sharing = shareRec?.sharing;
    }

    // Push this level into the chain
    arrPass.push({
      user_sno: punter._id,
      uname,
      childId,
      sharing,
    });

    let my_sharing = 0;

    // Recurse up the chain (stop at root user_sno === 1)
    if (punter.user_role !== 1) {
      return await getUserUplineChain(arrPass, sponser_id, my_sharing, userSno);
    } else {
      return arrPass;
    }
  } catch (err) {
    console.error("Error saving punter percentage by master:", err);
    throw err;
  }
};

const savePunterPercentageByMaster = async (addedUserId, masterId, sharing) => {
  try {
    let returnArray = [];
    // Populate returnArray with { user_sno, sharing } entries
    returnArray = await getUserUplineChain(
      returnArray,
      masterId,
      sharing,
      addedUserId
    );

    if (returnArray.length > 0) {
      for (const { user_sno: master_id, sharing: shareValue } of returnArray) {
        const user_id = addedUserId;

        // Check if a sharing record already exists
        const exists = await BzBtPunterMasterSharing.findOne({
          user_id,
          master_id,
        });
        if (!exists) {
          // Insert new sharing record
          await BzBtPunterMasterSharing.create({
            user_id,
            master_id,
            sharing: shareValue,
            created_date: new Date(),
          });
        }
      }
    }
  } catch (err) {
    console.error("Error saving punter percentage by master:", err);
    throw err;
  }
};

async function get_user_info_byid(req){
  try {
    const userId = req.params.id;
    const user = await Punter.findOne({ _id: userId,
       // full_chain: new RegExp("," + req.user._id.toString() + ",")
     }) 
    .select("fname uname bz_balance opin_bal credit_amount credit_reference my_sharing transaction_pl upline_balance sponsor currency can_settled mobno commission bet_status stat user_role full_chain sponser_id")
      .lean();
    return user;
  } catch (err) {
    console.error("Error fetching user balance for _id=", userId, err);
    return 0;
  }
};

async function getDownlineRecursive(userId) {
  const rootId = new mongoose.Types.ObjectId(userId);
  const seen = new Set();
  const result = [];

  async function recurse(parentId) {
    const children = await Punter.find({
      sponser_id: new mongoose.Types.ObjectId(parentId)
    })
      .select("-passpin -full_chain")
      .lean();
    for (const child of children) {
      console.log("child->" + child);
      const idStr = String(child._id);
      if (!seen.has(idStr)) {
        seen.add(idStr);

        let balance = Math.round(child.bz_balance);
        let credit_reference = Math.round(child.credit_reference);
        let total_pl = Math.round(child.total_pl);
        let transaction_pl = Math.round(child.transaction_pl);
        let upline_balance = Math.round(child.upline_balance);

        if (child.user_role == 8) {
          //for client users
          let pl = 0;

          child.exposure = await getUserExpouser(child._id, child.user_role);

          if (child.credit_reference == 0) {
            pl = balance;
          } else {
            if (balance >= credit_reference) {
              pl = balance - credit_reference;
            } else {
              pl = balance - credit_reference;
            }
          }

          if (total_pl == 0) {
            child.clientpl = Math.round(pl);
          } else {
            child.clientpl = Math.round(pl);
          }

          child.availableBalance = Math.round(balance);
          child.bz_balance = Math.round(balance);
          //child.clientpl = 0;
        } else {
          //for other users not client
          child.exposure = await getUserExpouser(child._id, child.user_role);

          if (transaction_pl == 0) {
            child.bz_balance = 0;
            child.availableBalance = 0;
          } else if (transaction_pl < 0) {
            child.bz_balance = Math.abs(transaction_pl);
            child.availableBalance = Math.abs(transaction_pl);
          } else {
            child.bz_balance = 0 - transaction_pl;
            child.availableBalance = transaction_pl;
          }

          if (upline_balance == 0) {
            child.clientpl = "";
          } else if (upline_balance < 0) {
            child.clientpl = upline_balance;
          } else {
            child.clientpl = upline_balance;
          }
        }

        result.push(child);
        // await recurse(idStr);
      }
    }
  }
  await recurse(userId);
  return result;
}

/*
async function getDownlineBettors(userId) {
  const rootId = new mongoose.Types.ObjectId(userId);
  const seen = new Set();
  const result = [];

  async function recurse(parentId) {
    const children = await Punter.find({
      sponser_id: new mongoose.Types.ObjectId(parentId)
    })
      .select("-passpin -full_chain")
      .lean();
    for (const child of children) {
      const idStr = String(child._id);
      if (!seen.has(idStr)) {
        seen.add(idStr);
        child.exposure = await getUserExpouser(child._id, child.user_role);
        child.availableBalance = child._id;
        child.bz_balance = Math.round(child.bz_balance);

        child.clientpl = 0;
        console.log('child.user_role', child.user_role);
        if(child.user_role == 8) {
          result.push(child);
        } else {
          await recurse(child._id);
        }
        // await recurse(idStr);
      }
    }
  }
  console.log('++++++++++recurse++++++++++++++++++');
  await recurse(userId);
  return result;
} 
*/

async function getDownlineBettors(userId) {
  const seen = new Set();
  const result = [];

  async function recurse(parentId) {
    const children = await Punter.find({
      sponser_id: parentId
    })
      .select("-passpin -full_chain")
      .lean();

    for (const child of children) {
      const idStr = child._id.toString();
      if (seen.has(idStr)) continue;

      seen.add(idStr);

      // enrich user
      child.exposure = await getUserExpouser(child._id, child.user_role);
      child.availableBalance = child._id;
      child.bz_balance = Math.round(child.bz_balance);
      child.clientpl = 0;

      // collect ONLY role 8
      if (child.user_role === 8) {
        result.push(child);
        continue; // 🚫 do not recurse further
      }

      // recurse only if role != 8
      await recurse(child._id);
    }
  }

  await recurse(new mongoose.Types.ObjectId(userId));
  return result;
}
async function getUserExpouser(userId, user_role) {
  let expouserAmount = 0;
  try {
    let obj = {};
    if (user_role == 8) {
      obj.user_id = userId;
      obj.isSettled = 0;
      obj.user_role = 8;
    } else {
      obj.master_id = userId;
      obj.isSettled = 0;
    }
    const records = await Exposure.find(obj);
    console.log("records->", records);
    for (const recordObj of records) {
      //console.error("record:", recordObj);
      expouserAmount = expouserAmount + recordObj.sharing_exp_amount;
    }
  } catch (err) {
    console.error("Error in getUserExpouser:", err);
    return [];
  }
  return expouserAmount;
}

async function getBetfairData(cat_mid) {
  try {
    const json = await axios.get(
      `http://23.106.37.218/betfair_api.php?cat_mid=${cat_mid}`
    );

    if (json.data) {
      return json.data;
    } else {
      console.log("Error fetching betfair data");
      // return res
      //   .status(500)
      //   .json({ status: false, message: "Error fetching fancy data" });
    }
  } catch (error) {
    console.error("Error fetching betfair data:", error);
  }
}

async function fancyLiveApiVirtual(evtId) {
  try {
    const json = await axios.get(
      `http://23.106.37.218/cric_api.php?type=fancy2&evtid=${evtId}`
    );

    if (json.data && json.data.status) {
      return json.data;
    } else {
      console.log("Error fetching fancy data");
      // return res
      //   .status(500)
      //   .json({ status: false, message: "Error fetching fancy data" });
    }
  } catch (error) {
    console.error("Error fetching fancy data:", error);
  }
}

async function betFairFancy(evtId) {
  try {
    const json = await axios.get(
      `http://23.106.37.218/cric_api.php?type=betfairfancy&evtid=${evtId}`
    );

    if (json.data && json.data.status) {
      //console.log(json.data);
      return json.data;
    } else {
      console.log("Error fetching fancy data");
      // return res
      //   .status(500)
      //   .json({ status: false, message: "Error fetching fancy data" });
    }
  } catch (error) {
    console.error("Error fetching fancy data:", error);
  }
}

async function fancyLiveApi(id, apiUrl) {
  try {
    const data = await axios.post(apiUrl, { eventId: id });
    //console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching fancy data:", error);
  }
}

async function bzFormValue(value) {
  if (value === undefined || value === null) return "";
  // Convert to string
  let str = String(value);
  // Trim whitespace
  str = str.trim();
  // Strip HTML tags
  str = str.replace(/<[^>]*>?/gm, "");
  // Optionally escape quotes or other special chars if you need to store/use in queries
  return str;
}



async function getHRGRBook(summery_id) {
  try {
    const records = await BetBookSummary.find({
      bet_summary_id: summery_id,
    }).lean();
    const final_array = [];

    for (const drCricket of records) {
      final_array.push({
        runner_sid: drCricket.runner_sid,
        bet_runner_name: drCricket.bet_runner_name,
        lock_amount: drCricket.lock_amount,
        amount: drCricket.amount,
        is_settled: drCricket.is_settled,
      });
    }

    return final_array;
  } catch (err) {
    console.error("Error in getHRGRBook:", err);
    return [];
  }
}

async function getUplineSharingChain(rrPass, sponsorId, passSharing, childId,addedUserId) {
  try {
    // Stop if we've reached the top
    if (!sponsorId) return [];

    // Fetch the sponsor punter record
    const punter = await Punter.findOne({ _id: sponsorId }).lean();

    if (!punter) return;

    let sponser_id = punter.sponser_id;
    let uname = punter.uname;

    let sharing = 0;

    // Fetch any existing sharing record between the child and this sponsor

    const shareRec = await BzBtPunterSharing.findOne({
      child_id: new mongoose.Types.ObjectId(childId),
      parent_id: new mongoose.Types.ObjectId(sponsorId),
    }).lean();

    if (!shareRec) {
      sharing = 0;
    } else {
      sharing = shareRec?.parent_percentage;
    }

    await BzBtPunterMasterSharing.create({
      user_id: addedUserId,
      master_id: sponsorId,
      sharing: sharing,
      sharing_role: punter.user_role,
      created_date: new Date(),
    });
    // Push this level into the chain
    arrPass.push({
      user_sno: punter._id,
      uname,
      user_role: punter.user_role,
      childId,
      sharing,
    });
    let my_sharing = 0;

    // Recurse up the chain (stop at root user_sno === 1)
    if (punter.user_role !== 1) {
      return await getUplineSharingChain(
        arrPass,
        sponser_id,
        my_sharing,
        punter._id,
        addedUserId
      );
    } else {
      return arrPass;
    }
  } catch (err) {
    console.error("Error saving punter percentage by master:", err);
    throw err;
  }
}
const pushExposure = async (req, res, catmid, amount, event_name) => {
  //console.log("pushExposure->", req.body);
  //console.log("pushExposure-catmid->", req.body.catmid);

  let sid = "";
  if (req.body.market_type == "evenodd") {
    sid = sid.$oid;
  } else {
    sid = req.body.sid ? req.body.sid : "";
  }

  req.user.master_sharing.map((record) => {
    let catmid = req.body.catmid;
    if (req.body.market_type == "ff") {
      catmid = req.body.childId;
    }

    const sharingAmount = (amount * record.sharing) / 100;

    Exposure.create({
      user_id: req.user._id,
      master_id: record.user_sno,
      sharing_exp_amount: sharingAmount,
      cat_mid: catmid,
      amount: amount,
      market_type: req.body.market_type,
      game_type: req.body.game_type,
      sharing: record.sharing,
      isSettled: 0,
      user_role: record.user_role,
      runnername: req.body.runnername,
      event_name: event_name,
      sid: sid,
      parent_catmid: req.body.catmid,
      bet_type: req.body.bet_type
    });
  });

  Exposure.create({
    user_id: req.user._id,
    master_id: req.user._id,
    sharing_exp_amount: amount,
    cat_mid: catmid,
    amount: amount,
    market_type: req.body.market_type,
    game_type: req.body.game_type,
    sharing: 100,
    isSettled: 0,
    user_role: 8,
    runnername: req.body.runnername,
    event_name: event_name,
    sid: sid,
    parent_catmid: req.body.catmid,
    bet_type: req.body.bet_type
  });

  return true;
};

const getPunterSharing = async (user_id) => {
  console.log("getPunterSharing->", user_id);
  try {
    const records = await BzBtPunterMasterSharing.find({
      user_id: user_id
    }).lean();
    const final_array = [];

    for (const drCricket of records) {
      final_array.push({
        _id: drCricket._id,
        user_id: drCricket.user_id,
        master_id: drCricket.master_id,
        sharing: drCricket.sharing,
        sharing_role: drCricket.sharing_role
        //created_date: drCricket.created_date
      });
    }

    return final_array;
  } catch (err) {
    console.error("Error in getHRGRBook:", err);
    return [];
  }
};
const getBetfairGamesData = async (gameId) => {
  const PROXY_URL = `https://api.games.betfair.com/rest/v1/channels/${gameId}/snapshot`;
  console.log(PROXY_URL);
  try {
    const response = await axios.get(PROXY_URL, {
      timeout: 10000
    });

    if (!response || !response.data) {
      return "ER101";
    } else {
      let xml = response.data;

      try {
        const result = await xml2js.parseStringPromise(xml, {
          explicitArray: false
        });

        return result;
      } catch (err) {
        return "ER101";
      }
    }
  } catch (err) {
    return "ER101";
  }
};

module.exports = {
  getMarketData,
  getUserHierarchy,
  get_user_latest_points_byid,
  UpdateBalance,
  createLog,
  PlacePendingBet,
  updateRefferCode,
  getFullChain,
  addStakes,
  addStakesUsd,
  addLimit,
  savePunterPercentageByMaster,
  getDownlineRecursive,
  getDownlineBettors,
  getUserUplineChain,
  fancyLiveApiVirtual,
  fancyLiveApi,
  bzFormValue,
  getHRGRBook,
  getBetfairData,
  betFairFancy,
  getUplineSharingChain,
  pushExposure,
  getPunterSharing,
  getBetfairGamesData,
  get_user_info_byid
};
