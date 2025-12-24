const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const Punter = require("../models/Punter");
const BetLock = require("../models/BetLock");
const BzPtLogHistory = require("../models/BzPtLogHistory"); 
const PunterFinalSheet = require("../models/PunterFinalSheet");
const PunterTransSummary = require("../models/PunterTransSummary");
const BzBtPunterTransDetailsNew = require("../models/BzBtPunterTransDetailsNew");

const ObjectId = mongoose.Types.ObjectId;

const {
  updateRefferCode,
  getFullChain,
  addStakes,
  addStakesUsd,
  addLimit,
  savePunterPercentageByMaster,
  getUserUplineChain,
  getUplineSharingChain,
  getDownlineRecursive,
} = require("./function");
const BzBtPunterMasterSharing = require("../models/BzBtPunterMasterSharing");
const PunterSharing = require("../models/BzBtPunterSharing");
const BetLimit = require("../models/BetLimit");
const BzPtRecord = require("../models/BzPtRecord");

async function saveCompanyUser(req, res) {
  try {
    const user_type = req.body.user_type;
    const login_user_role = req.user.user_role;
    const sponserId = req.user._id;
    const sponserName = req.user.uname;

    const userCheck = await Punter.findOne({
      _id: sponserId,
      full_chain: new RegExp("," + req.user._id.toString() + ",")
    });
    if (!userCheck) {
      return res.status(403).json({
        status: false,
        errors: "Unauthorized attempt."
      });
    }

    const user_name = req.body.uname.toLowerCase();

    //const userDupl = await Punter.findOne({ uname: user_name });
    const userDupl = await Punter.findOne({
      uname: {
        $regex: `^${user_name}$`,
        $options: "i" // “i” = case-insensitive
      }
    });

    if (userDupl) {
      // Username already exists
      return res
        .status(409)
        .json({ R: false, errors: { username: "Username is not available." } });
    }

    const password = req.body.password.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const status_new = req.body.status ? 1 : 0;
    let user_role = user_type;
    let my_sharing = 0;
    let parent_sharing = 0;
    let account_type;
    if (user_role == 8) account_type = 2;

    const rowSponsor = await Punter.findOne({ _id: sponserId });
    my_sharing = rowSponsor.my_sharing;

    //if (!my_sharing) my_sharing = 75; // Need to remove it

    let can_settled = 0;
    const user_role_xx = rowSponsor.user_role;

    let isRoleCondetionPass = true;
    const roleMap = {
      2: [3, 4, 5, 6, 7, 8],
      3: [4, 5, 6, 7, 8],
      4: [5, 8],
      5: [6, 8],
      6: [7, 8],
      7: [8]
    };

    if (
      roleMap[user_role_xx] &&
      !roleMap[user_role_xx].includes(Number(user_role))
    ) {
      isRoleCondetionPass = false;
    }
    if (!isRoleCondetionPass || Number(user_role) <= Number(user_role_xx)) {
      return res.status(403).json({
        R: false,
        errors: {
          downline_share:
            "You can not create this user. Account Type is not correct."
        }
      });
    }
    //if (user_role_xx == 2) my_sharing = 85;

    let downline_share = req.body.downline_share;
    if (user_type != 8) {
      if (downline_share < 0 || downline_share > my_sharing) {
        return res.status(400).json({
          R: false,
          errors: {
            downline_share: `Max allowed downline share is 0 - ${my_sharing}`
          }
        });
      }
      //if (user_role_xx == 2) my_sharing = 95;
      parent_sharing = my_sharing - downline_share;
    } else {
      //if (user_role_xx == 2) my_sharing = 95;
      downline_share = my_sharing;
    }

    const rowSponsorCurrency = await Punter.findOne({ _id: sponserId });
    let currency =
      login_user_role == 1 ? req.body.currency : rowSponsorCurrency.currency;
    const commission = rowSponsorCurrency.commission;

    const insertdata = {
      ip_address: req.ip,
      fname: req.body.uname,
      uname: req.body.uname,
      passpin: hashedPassword,
      stat: status_new,
      created_on: Date.now(),
      sponsor: sponserName,
      bz_balance: 0.0,
      joining: new Date().toISOString().slice(0, 10),
      opin_bal: 0.0,
      plimit: 0,
      user_role: user_role,
      casino_points: 0.0,
      casino_obal: 0.0,
      bet_status: rowSponsor.bet_status,
      sponser_id: sponserId,
      created_by: sponserId,
      currency: currency,
      mobno: req.body.mobilenumber,
      sharing: 0,
      reference: req.body.reference,
      note: req.body.note,
      password_change: 1,
      my_sharing: downline_share,
      parent_sharing: parent_sharing,
      can_settled: can_settled,
      c_enble: rowSponsor.c_enble,
      f_enable: rowSponsor.f_enable,
      t_enable: rowSponsor.t_enable,
      master_full_chain: ""
    };

    const newUser = await Punter.create(insertdata);
    const id = newUser._id;
    let fullchain = await getFullChain(sponserId);

    fullchain += id + ",";

    await PunterFinalSheet.create({
      parent_id: sponserId,
      child_id: id,
      share_amount: 0,
      win_amount: 0,
      type: "f"
    });

    await PunterFinalSheet.create({
      parent_id: id,
      child_id: id,
      share_amount: 0,
      win_amount: 0,
      type: "s"
    });

    await PunterTransSummary.create({
      user_id: id,
      created_date: new Date().toISOString().slice(0, 10),
      created_timestamp: Date.now()
    });

    const master_sharing = await getUplineSharingChain(id);

    await Punter.updateOne(
      { _id: id },
      {
        full_chain: fullchain,
        master_full_chain: fullchain,
        master_sharing: master_sharing[0]
      }
    );

    //await updateRefferCode(id);

    if (currency == 1 || currency == 2) {
      await addStakes(id);
    } else {
      await addStakesUsd(id);
    }
    await addLimit(sponserId, id);

    let parent_id = sponserId;
    let child_id = id;
    let parent_percentage = parent_sharing;
    let child_percentage = downline_share;

    let total_percentage = Number(parent_sharing) + Number(downline_share);
    if (user_role == 8) {
      parent_percentage = downline_share;
      child_percentage = 0;
    }
    await PunterSharing.create({
      user_role,
      parent_id,
      child_id,
      parent_percentage,
      child_percentage,
      total_percentage,
      created_date: new Date()
    });
    /*
    if (user_role == 8) {
      // For role-8, update master sharing
      await BzBtPunterMasterSharing.create({
        user_id: id,
        master_id: sponserId,
        sharing: downline_share,
        sharing_role: user_role,
        created_date: new Date(),
      });
      
    } else {
      // For other roles, update master sharing
      
      await BzBtPunterMasterSharing.create({
        user_id: id,
        master_id: sponserId,
        sharing: downline_share,
        sharing_role: user_role,
        created_date: new Date(),
      });
    }*/
    // let arrPass = [];
    // const userChain = await getUserUplineChain(arrPass, sponserId, my_sharing, id);

    if (user_role == 8) {
      arrPass = [];
      let my_sharing = 0;
      const userChain = await getUplineSharingChain(
        arrPass,
        sponserId,
        my_sharing,
        id,
        id
      );

      await Punter.updateOne({ _id: id }, { master_sharing: userChain });
    }
    ////////////////////////////////////
    // Success response
    return res.json({ R: true, M: "Information has been saved successfully" });
  } catch (err) {
    // Handle errors
    console.error(err);
    return res
      .status(500)
      .json({ R: false, errors: { server: "Internal server error" } });
  }
}

const userUpdateSchema = Joi.object({
  passpin: Joi.string().allow("").optional(), // can be empty string
  stat: Joi.string().valid(0, 1).required(), // must be 0 or 1
  bet_status: Joi.string().valid(0, 1).optional(),
  can_settled: Joi.string().valid(0, 1).optional(),
  mobno: Joi.string().pattern(/^\d+$/).optional(), // must be digits only
  reference: Joi.string().allow("").optional(),
  note: Joi.string().allow("").optional(),
  UserDomain: Joi.string().allow("").optional()
});

async function updateCompanyUser(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate and sanitize input data
    const { error, value } = userUpdateSchema.validate(updateData);

    if (error) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid input data", error });
    }

    // check if user exists
    const user = await Punter.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (!id || !updateData) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid input data" });
    }
    if (updateData.passpin) {
      updateData.passpin = await bcrypt.hash(
        updateData.passpin.toLowerCase(),
        10
      );
    } else {
      delete updateData.passpin;
    }
    // Update user information in the database
    const result = await Punter.updateOne({ _id: id }, { $set: updateData });

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ R: false, errors: { server: "User not found" } });
    }

    // Success response
    return res.json({
      status: true,
      message: "User information has been updated successfully"
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
}

const betLimitSchema = Joi.object({
  soccer: Joi.number().integer().min(0).required(),
  tennis: Joi.number().integer().min(0).required(),
  cricket: Joi.number().integer().min(0).required(),
  fancy: Joi.number().integer().min(0).required(),
  hrace: Joi.number().integer().min(0).required(),
  casino: Joi.number().integer().min(0).required(),
  greyhound: Joi.number().integer().min(0).required(),
  bookMaker: Joi.number().integer().min(0).required()
  //betSizes_Tpin: Joi.string().allow("").optional(),
});

async function saveBetLimit(req, res) {
  try {
    const { id } = req.params;
    const betLimitData = req.body;

    // Validate and sanitize input data
    const { error, value } = betLimitSchema.validate(betLimitData);

    if (error) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid input data", error });
    }
    // Validate input data
    if (!id || !betLimitData) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid input data" });
    }

    // validate if the user is actually a sub user
    const parentRec = await Punter.findOne({ _id: id }).lean();

    if (req.user._id.toString() !== parentRec.sponser_id.toString()) {
      return res.status(403).json({
        status: false,
        message: "User is not authorized to update this bet limit",
      });
    }

    // Implement check the the use should not add more than the assigned limit
    const existingLimit = await BetLimit.findOne({
      user_id: parentRec.sponser_id,
    });

    // can be null for 2nd level
    if (existingLimit) {
      if (
        req.body.soccer > existingLimit.soccer ||
        req.body.tennis > existingLimit.tennis ||
        req.body.cricket > existingLimit.cricket ||
        req.body.fancy > existingLimit.fancy ||
        req.body.hrace > existingLimit.hrace ||
        req.body.casino > existingLimit.casino ||
        req.body.greyhound > existingLimit.greyhound ||
        req.body.bookMaker > existingLimit.bookMaker
      ) {
        return res.status(403).json({
          status: false,
          message: "Invalid amount exceeding assigned limit",
        });
      }
    }

    // Update bet limit in the database

    await BetLimit.updateOne({ user_id: id }, { $set: betLimitData });

    // fetch downline
    const downlines = await getDownlineRecursive(id);

    // update limit for the downline here
    downlines.map(async (downline) => {
      await BetLimit.updateOne(
        { user_id: downline._id },
        { $set: betLimitData }
      );
    });

    // Success response
    return res.json({
      status: true,
      message: "Bet limit has been saved successfully",
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
}

async function saveBetLock(req, res) {
  try {
    const betLockSchema = Joi.object({
      casino_tp_studio: Joi.boolean().required(),
      casino_royal_casino: Joi.boolean().required(),
      casino_star: Joi.boolean().required(),
      casino_supernowa: Joi.boolean().required(),
      casino_betfair: Joi.boolean().required(),
      cric_matchodd: Joi.boolean().required(),
      cric_fancy: Joi.boolean().required(),
      cric_toss: Joi.boolean().required(),
      cric_tie: Joi.boolean().required(),
      cric_even_odd: Joi.boolean().required(),
      cric_figure: Joi.boolean().required(),
      cric_cup: Joi.boolean().required(),
      greyh_australia: Joi.boolean().required(),
      greyh_britain: Joi.boolean().required(),
      greyh_newzealand: Joi.boolean().required(),
      hrace_dubai: Joi.boolean().required(),
      hrace_australia: Joi.boolean().required(),
      hrace_bahrain: Joi.boolean().required(),
      hrace_france: Joi.boolean().required(),
      hrace_england: Joi.boolean().required(),
      hrace_ireland: Joi.boolean().required(),
      hrace_newzealand: Joi.boolean().required(),
      hrace_sweden: Joi.boolean().required(),
      hrace_singapore: Joi.boolean().required(),
      hrace_america: Joi.boolean().required(),
      hrace_africa: Joi.boolean().required(),
      soccer_matchodd: Joi.boolean().required(),
      soccer_over_under: Joi.boolean().required(),
      tennis_matchodd: Joi.boolean().required(),
      casino_betfair_games: Joi.boolean().required(),
    });

    // Validate & sanitize body
    const { error, value: betLockData } = betLockSchema.validate(req.body, {
      abortEarly: false, // show all errors
      stripUnknown: true, // drop unexpected keys
      convert: true, // "true"/"false"/1/0 -> boolean
    });

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Invalid input data",
        errors: error.details.map((d) => d.message),
      });
    }

    // Extra guard: ensure we have something to update after stripping
    if (!betLockData || Object.keys(betLockData).length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No valid fields provided to update" });
    }
    betLockData.lock_by = req.user._id;
    // Update bet lock in the database (upsert to create if missing)
    await BetLock.updateOne(
      { user_id: req.user._id },
      { $set: betLockData },
      { upsert: true }
    );

    // fetch downline
    const downlines = await getDownlineRecursive(req.user._id);

    // update lock for the downline
    await Promise.all(
      downlines.map(async (downline) => {
        const existingLock = await BetLock.findOne({ user_id: downline._id });

        if (existingLock) {
          // Check if downline lock is updated by the parent user (req.user._id) or by other user (downline)
          if (existingLock.lock_by.toString() !== req.user._id.toString()) {
            // Check if all values are true (locked)
            const allLocked = Object.keys(betLockData).every(
              (key) => key === "lock_by" || existingLock[key] === true
            );
            if (allLocked) {
              // Delete the record and insert again with current logged in user as lock_by
              await BetLock.deleteOne({ user_id: downline._id });
              await BetLock.create({
                ...betLockData,
                user_id: downline._id,
                lock_by: req.user._id,
              });
            }
            // Otherwise, do not make any change
          } else {
            // Updated by parent user, update the record
            await BetLock.updateOne(
              { user_id: downline._id },
              { $set: { ...betLockData, lock_by: req.user._id } },
              { upsert: true }
            );
          }
        } else {
          // Record not there, insert the record
          await BetLock.create({
            ...betLockData,
            user_id: downline._id,
            lock_by: req.user._id,
          });
        }
      })
    );

    // Success response
    return res.json({
      status: true,
      message: "Bet lock has been saved successfully",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
}

async function getUserBetLimit(req, res) {
  try {
    let user_id = req.user._id;
    //const userCheck = await Punter.findOne({ _id: req. });
    const existingBetLimit = await BetLimit.findOne({ user_id: user_id });

    return res.json({
      betlmit: existingBetLimit,
      status: true,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
}

async function getUserLockSetting(req, res) {
  try {
    let user_id = req.user._id;
    //const userCheck = await Punter.findOne({ _id: req. });
    const existingLock = await BetLock.findOne({ user_id: user_id });
    return res.json({
      lockdata: existingLock,
      status: true,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
}

const PunterTransDetails = require("../models/PunterTransDetails");
const CreditTransaction = require("../models/CreditTransaction");
const PunterFinalSheetRecords = require("../models/PunterFinalSheetRecords");

async function updatePointsLogHistory(
  from_id,
  to_id,
  from_user,
  to_user,
  type,
  amount,
  bz_balance,
  reff_id = 0,
  remark = "",
  remark2 = ""
) {
  // Compose messages
  let msg1 = `${amount} has been ${type}`;
  let msg2 = `${amount} has been ${type}`;
  if (remark) msg1 = remark;
  if (remark2) msg2 = remark2;

  // Insert into BzPtRecord
  const record = await BzPtRecord.create({
    from: from_user,
    to: to_user,
    point: amount,
    amount: amount,
    type: type,
    remark: msg1,
    remark2: msg2,
    loginId: from_user,
    ipadd: "", // You may want to pass req.ip if available
    balance: bz_balance,
    reff_id: reff_id,
    created_at: new Date(),
  });

  const id7 = record._id;
  const dt = new Date();

  // Log history for from_user
  if (from_id) {
    const fromUserDoc = await Punter.findById(from_id);
    const from_user_balance =
      fromUserDoc.user_role == 8
        ? fromUserDoc.bz_balance
        : fromUserDoc.credit_amount;

    await BzPtLogHistory.create({
      user_id: from_id,
      uname: from_user,
      linkid: id7,
      points: from_user_balance,
      amount: amount,
      date: dt,
      type: type,
    });
  }

  // Log history for to_user
  if (to_id) {
    const toUserDoc = await Punter.findById(to_id);
    const to_user_balance =
      toUserDoc.user_role == 8 ? toUserDoc.bz_balance : toUserDoc.credit_amount;
    await BzPtLogHistory.create({
      user_id: to_id,
      uname: to_user,
      amount: amount,
      linkid: id7,
      points: to_user_balance,
      date: dt,
      type: type,
    });
  }

  return id7;
}

async function SetPLByRole(
  user_role,
  user_id,
  Amount,
  remark,
  type,
  market_type,
  payment_type,
  summary_id
) {
  // Prepare the document to insert
  const doc = {
    created_date: new Date(),
    type: type,
    user_id: new ObjectId(user_id),
    amount: Amount,
    remark: remark,
    market_type: market_type,
    payment_type: payment_type,
    summary_id: summary_id.toString(),
    chain_ids: `,${user_id},`,
  };

  // Role-based fields
  const roleMap = {
    1: "owner",
    2: "scompany",
    3: "company",
    4: "sadmin",
    5: "admin",
    6: "smaster",
    7: "master",
    8: "bettor",
  };

  const roleKey = roleMap[user_role];
  if (roleKey) {
    if (Amount >= 0) {
      doc[`${roleKey}_c`] = Amount;
    } else {
      doc[`${roleKey}_d`] = Amount;
    }
  }

  // Insert into BzBtPunterTransDetailsNew collection
  await BzBtPunterTransDetailsNew.create(doc);
}

async function updatePointsLogCreditHistory(
  from_id,
  to_id,
  from_user,
  to_user,
  type,
  amount,
  credit_amount,
  ipadd = "",
  reff_id = 0,
  remark = "",
  remark2 = ""
) {
  // Compose messages
  let msg1 = `${amount} has been ${type}`;
  let msg2 = `${amount} has been ${type}`;

  if (remark) msg1 = remark;
  if (remark2) msg2 = remark2;

  // Insert into BzPtRecord
  const record = await BzPtRecord.create({
    from: from_user,
    to: to_user,
    point: amount,
    amount: amount,
    type: type,
    remark: msg1,
    remark2: msg2,
    loginId: from_user,
    ipadd: ipadd,
    balance: credit_amount,
    reff_id: reff_id,
    created_at: new Date(),
  });

  const id7 = record._id;
  const dt = new Date();

  // Log history for from_user
  if (from_id) {
    const fromUserDoc = await Punter.findById(from_id);
    let from_user_balance;
    if (fromUserDoc.user_role == 8) {
      from_user_balance = fromUserDoc.bz_balance;
    } else {
      from_user_balance = fromUserDoc.credit_amount;
    }
    await BzPtLogHistory.create({
      uname: from_user,
      linkid: id7.toString(),
      points: from_user_balance,
      date: dt,
      type: type,
    });
  }

  // Log history for to_user
  if (to_id) {
    const toUserDoc = await Punter.findById(to_id);
    let to_user_balance;
    if (toUserDoc.user_role == 8) {
      to_user_balance = toUserDoc.bz_balance;
    } else {
      to_user_balance = toUserDoc.credit_amount;
    }
    await BzPtLogHistory.create({
      uname: to_user,
      linkid: id7,
      points: to_user_balance,
      date: dt,
      type: type,
    });
  }

  return id7;
}

async function getUserCreditLatestPointsById(userId) {
  // Find the user by ID and return their credit_amount, or 0 if not found
  const user = await Punter.findById(userId).select("credit_amount").lean();
  return user ? user.credit_amount : 0;
}

async function getUserLatestPointsById(userId) {
  // Find the user by ID and return their bz_balance, or 0 if not found
  const user = await Punter.findById(userId).select("bz_balance").lean();
  return user ? user.bz_balance : 0;
}

module.exports = {
  saveCompanyUser,
  updateCompanyUser,
  saveBetLimit,
  saveBetLock,
  getUserLockSetting,
  getUserBetLimit,
  updatePointsLogHistory,
  SetPLByRole,
  updatePointsLogCreditHistory,
  getUserCreditLatestPointsById,
  getUserLatestPointsById,
};