const express = require("express");
const router = express.Router();
const Punter = require("../models/Punter");
const BzStakeSettings = require("../models/BzStakeSettings");
const UserBetLock = require("../models/UserBetLock");
const BetLock = require("../models/BetLock");
const CreditTransaction = require("../models/CreditTransaction");
const PunterTransDetails = require("../models/PunterTransDetails");
const PunterFinalSheet = require("../models/PunterFinalSheet");
const PunterFinalSheetRecords = require("../models/PunterFinalSheetRecords");

const UserSettlementRecord = require("../models/UserSettlementRecord");
const BzPtLogHistory = require("../models/BzPtLogHistory");
const BzPtRecord = require("../models/BzPtRecord");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/agentAuth");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const {placeLiveBets} = require("../lib/Dashboard");
const {
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
} = require("../utils/companyUserFunctions");

router.use(auth);

router.post("/user", async (req, res) => {
  return await saveCompanyUser(req, res);
});
router.post("/update-user/:id", async (req, res) => {
  return await updateCompanyUser(req, res);
});

router.get("/get-bet-limit/:id", async (req, res) => {
  return await getUserBetLimit(req, res);
});

router.post("/save-bet-limit/:id", async (req, res) => {
  return await saveBetLimit(req, res);
});

router.post("/save-bet-lock/:id", async (req, res) => {
  return await saveBetLock(req, res);
});

router.get("/get-bet-lock/:id", async (req, res) => {
  return await getUserLockSetting(req, res);
});

// GET /company/cash-popup/:receiverId
router.get("/cash-popup/:receiverId", async (req, res) => {
  try {
    if (!receiverId) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const user = await Punter.findOne({ _id: receiverId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const sponsor_id = user.sponser_id;

    const sponsor = await Punter.findOne({ _id: sponsor_id }).lean();
    if (!sponsor) return res.status(404).json({ error: "Sponsor not found" });

    const uname = user.uname;
    const bz_balance = user.bz_balance;
    const account_type = user.account_type;
    const currency = user.currency;
    const credit_reference = user.credit_reference;
    const user_role = user.user_role;
    const credit_amount_user = user.credit_amount;
    const masteruname = user.sponsor;
    const masterbalance = sponsor.bz_balance;
    const mastercredit_amount = sponsor.credit_amount;

    let max_withdrawal = 0;
    if (bz_balance < 0) {
      max_withdrawal =
        credit_amount_user === 0
          ? 0
          : Number(credit_amount_user) + Number(bz_balance);
    } else {
      max_withdrawal =
        user_role === 8
          ? bz_balance
          : Number(credit_amount_user) + Number(bz_balance);
    }

    let displayCurrency = "RS.";
    if (currency === 3) displayCurrency = "AED";
    else if (currency === 4) displayCurrency = "USD";

    let data = {
      title: "Welcome",
      breadcrumb: { Welcome: "" },
      files: "credit_debit_popup/cash_popup_vw",
      enc_user_id: receiverId,
      masteruname,
      bz_balance: bz_balance < 0 ? 0 : bz_balance,
      max_withdrawal: parseInt(max_withdrawal),
      uname,
      receiverId,
      masterbalance: parseInt(masterbalance),
      credit_amount_user: parseInt(credit_amount_user),
      credit_reference: parseInt(credit_reference),
      mastercredit_amount: parseInt(mastercredit_amount),
      account_type,
      displayCurrency,
      l_id_cash: 0,
      IssueDescriptioncash:
        user_role === 8
          ? `Cash deposit in ${uname}`
          : `Cash payment to ${masteruname} from ${uname}`,
      IssueDescriptionwith:
        user_role === 8
          ? `Cash withdrawn from ${uname}`
          : `Cash payment to ${uname} from ${masteruname}`,
      IssueDescriptiondepcredit: `Credit Issued to ${uname}`,
      IssueDescriptionwithcredit: `Credit Withdrawn from ${uname}`,
      Balance: user_role === 8 ? bz_balance : 0,
    };

    // Instead of rendering a view, send JSON
    return res.json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

// GET /company/credit-popup/:receiverId
router.get("/credit-popup/:receiverId", async (req, res) => {
  try {
    if (!receiverId) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const user = await Punter.findOne({ _id: receiverId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const sponsor_id = user.sponser_id;

    const sponsor = await Punter.findOne({ _id: sponsor_id }).lean();
    if (!sponsor) return res.status(404).json({ error: "Sponsor not found" });

    const uname = user.uname;
    const bz_balance = user.bz_balance;
    const account_type = user.account_type;
    const currency = user.currency;
    const credit_reference = user.credit_reference;
    const user_role = user.user_role;
    let credit_amount_user = user_role === 8 ? bz_balance : user.credit_amount;
    const masteruname = user.sponsor;
    const masterbalance = sponsor.bz_balance;
    const mastercredit_amount = sponsor.credit_amount;

    let max_withdrawal = 0;
    if (bz_balance < 0) {
      max_withdrawal =
        credit_amount_user === 0
          ? 0
          : Number(credit_amount_user) + Number(bz_balance);
    } else {
      max_withdrawal =
        user_role === 8
          ? bz_balance
          : Number(credit_amount_user) + Number(bz_balance);
    }

    let displayCurrency = "RS.";
    if (currency === 3) displayCurrency = "AED";
    else if (currency === 4) displayCurrency = "USD";

    let data = {
      title: "Welcome",
      breadcrumb: { Welcome: "" },
      files: "credit_debit_popup/credit_popup_vw",
      enc_user_id: receiverId,
      masteruname,
      bz_balance: bz_balance < 0 ? 0 : bz_balance,
      max_withdrawal: parseInt(max_withdrawal),
      uname,
      user_id_enc: receiverId,
      masterbalance: parseInt(masterbalance),
      credit_amount_user: parseInt(credit_amount_user),
      credit_reference: parseInt(credit_reference),
      mastercredit_amount: parseInt(mastercredit_amount),
      account_type,
      displayCurrency,
      l_id_cash: 0,
      hmacKey,
      IssueDescriptioncash:
        user_role === 8
          ? `Cash deposit in ${uname}`
          : `Cash payment to ${masteruname} from ${uname}`,
      IssueDescriptionwith:
        user_role === 8
          ? `Cash withdrawn from ${uname}`
          : `Cash payment to ${uname} from ${masteruname}`,
      IssueDescriptiondepcredit: `Credit Issued to ${uname}`,
      IssueDescriptionwithcredit: `Credit Withdrawn from ${uname}`,
    };

    return res.json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

// code cash deposit verified
router.post("/user-deposit-popup", async (req, res) => {
  //try {
  const { amount: usercred_amt, to_id: user_id, description: IssueDescriptioncash } = req.body;

  if (!user_id) {
    return res.status(400).json({ R: false, M: "Invalid request." });
  }

  const user = await Punter.findById(user_id).lean();
  if (!user) {
    return res.status(404).json({ R: false, M: "User not found." });
  }

  if (usercred_amt === 0) {
    return res.json({
      R: true,
      M: "Points has been transfer successfully",
      user_id,
    });
  }

  const amount = parseFloat(usercred_amt);
  if (isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ R: false, errors: { usercred_amt: "Invalid amount." } });
  }

  //const master_id = req.user._id;
  const master_id = user.sponser_id;
  const master = await Punter.findById(user.sponser_id).lean();

  if (user.sponser_id.toString() !== master_id.toString()) {
    return res.status(403).json({
      R: false,
      M: "You can only deposit to users under your downline.",
    });
  }
  if (master.user_role >= user.user_role) {
    return res.status(403).json({
      R: false,
      M: "You can only deposit to users under your downline.",
    });
  }
  if (master.credit_amount < 0) {
    return res.status(400).json({
      R: false,
      M: "Somethig went wrong please contact with your upline.",
    });
  }
  const checkBalance = master.credit_amount + master.bz_balance;
  if (amount > checkBalance) {
    return res.status(400).json({
      R: false,
      M: `Insufficient Balance. You can transfer cash max ${checkBalance}`,
    });
  }

  // Perform the transaction
  await Punter.findByIdAndUpdate(user_id, {
    $inc: { bz_balance: amount, opin_bal: amount, upline_balance: amount },
    $set: { Updated: new Date() },
  });
  await Punter.findByIdAndUpdate(master_id, {
    $inc: { bz_balance: -amount, opin_bal: -amount },
  });

  if (user.user_role === 8) {
    await Punter.findByIdAndUpdate(user_id, { $inc: { total_pl: amount } });
  }

  const master_new_balance = master.bz_balance - amount;

  // Log the transaction history
  const refId = await updatePointsLogHistory(
    master_id,
    user_id,
    master.uname,
    user.uname,
    "CASH_CREDIT",
    amount,
    master_new_balance
  );

  const from_user_balance = await getUserLatestPointsById(master_id);
  const to_user_balance = await getUserLatestPointsById(user_id);

  const creditTransaction = new CreditTransaction({
    from_id: master_id,
    to_id: user_id,
    amount,
    from_user_balance,
    to_user_balance,
    type: "CashType",
    creation_date: new Date(),
  });
  const { _id: reference_id } = await creditTransaction.save();

  const after_balance = await getUserLatestPointsById(user_id);
console.log("First Entry:", {
    type: 3,
    user_id: user_id,
    remark: IssueDescriptioncash,
    amount,
    before_balance: user.opin_bal,
    after_balance,
    market_type: 0,
    created_date: new Date(),
    payment_type: 2,
    reference_id,
    summary_id: refId,
  })
  const trans_details = new PunterTransDetails({
    type: 3,
    user_id: user_id,
    remark: IssueDescriptioncash,
    amount,
    before_balance: user.opin_bal,
    after_balance,
    market_type: 0,
    created_date: new Date(),
    payment_type: 2,
    reference_id,
    summary_id: refId,
  });
  await trans_details.save();

  await SetPLByRole(
    user.user_role,
    user_id,
    amount,
    IssueDescriptioncash,
    3,
    0,
    2,
    refId
  );

  const after_balance_master = await getUserLatestPointsById(master_id);

  console.log("Second Entry:", {
    user_id: new ObjectId(master_id),
    type: 3,
    remark: IssueDescriptioncash,
    amount: -amount,
    before_balance: master.bz_balance,
    after_balance: after_balance_master,
    market_type: 0,
    created_date: new Date(),
    payment_type: 2,
    reference_id: reference_id.toString(),
    summary_id: refId.toString(),
  })
  const master_trans_details = new PunterTransDetails({
    user_id: new ObjectId(master_id),
    type: 3,
    remark: IssueDescriptioncash,
    amount: -amount,
    before_balance: master.bz_balance,
    after_balance: after_balance_master,
    market_type: 0,
    created_date: new Date(),
    payment_type: 2,
    reference_id: reference_id.toString(),
    summary_id: refId.toString(),
  });
  await master_trans_details.save();

  const finalSheetRecord = new PunterFinalSheetRecords({
    user_id,
    my_share_amount: amount,
    upline_share_amount: -amount,
    updated_date: new Date(),
    type: 2,
    settled_date: new Date(),
    remark: "point add",
    txt_remark: ""
  });
  await finalSheetRecord.save();

  await SetPLByRole(
    master.user_role,
    master_id,
    -amount,
    IssueDescriptioncash,
    3,
    0,
    2,
    refId
  );
  await PunterFinalSheet.findOneAndUpdate(
    { parent_id: master_id, child_id: user_id },
    { $inc: { win_amount: -amount } }
  );

  return res.json({
    R: true,
    M: "Points has been transfer successfully",
    user_id,
  });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ R: false, M: "An error occurred.", error });
  // }
});

// code verified
router.post("/user-withdrawal-popup", async (req, res) => {
  //  try {
  const {
    amount: userdebit_amt,
    from_id: user_id_with,
    l_id_cash,
    description: IssueDescriptionwith,
  } = req.body;
  const encode_user_id = user_id_with;

  if (!encode_user_id) {
    return res.status(400).json({ R: false, M: "Invalid request." });
  }

  // Get user by _id
  const user = await Punter.findById(encode_user_id).lean();
  if (!user) {
    return res.status(404).json({ R: false, M: "This user does not exists." });
  }

  // Sponsor id
  const sponser_id_xx = user.sponser_id;

  // If withdrawal amount is 0
  if (userdebit_amt === 0) {
    return res.json({
      R: true,
      M: "Points has been transfer successfully",
      user_id: encode_user_id,
    });
  }

  // Validate amount
  const amount = parseFloat(userdebit_amt);
  if (isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ R: false, errors: { userdebit_amt: "Invalid amount." } });
  }

  // Get master (sponsor) details
  const master = await Punter.findById(sponser_id_xx).lean();
  if (!master) {
    return res.status(404).json({ R: false, M: "Sponsor not found." });
  }

  // Role check
  if (master.user_role >= user.user_role) {
    return res.status(403).json({
      R: false,
      M: "You can only withdraw from users under your downline.",
    });
  }

  // Credit amount check
  if (user.credit_amount < 0) {
    return res.status(400).json({
      R: false,
      M: "Something went wrong please contact with your upline.",
    });
  }

  // Calculate checkBalance
  let checkBalance = 0;
  if (user.user_role === 8) {
    checkBalance = user.bz_balance;
  } else {
    checkBalance = Number(user.credit_amount) + Number(user.bz_balance);
  }

  // Sponsor id check
  if (user.sponser_id.toString() !== master._id.toString()) {
    return res.status(403).json({
      R: false,
      M: "You can only withdraw from users under your downline.",
    });
  }

  // Insufficient balance
  if (amount > checkBalance) {
    return res.status(400).json({
      R: false,
      M: `Insufficient User Balance. You can withdrawal maximum ${checkBalance}`,
    });
  }

  // Perform the transaction
  await Punter.findByIdAndUpdate(user._id, {
    $inc: { bz_balance: -amount, opin_bal: -amount, upline_balance: -amount },
    $set: { Updated: new Date() },
  });

  if (user.user_role === 8) {
    await Punter.findByIdAndUpdate(user._id, { $inc: { total_pl: -amount } });
  }

  await Punter.findByIdAndUpdate(master._id, {
    $inc: { bz_balance: amount, opin_bal: amount },
  });

  const user_new_balance = user.bz_balance - amount;
  const master_new_balance = master.bz_balance + amount;

  // Log the transaction history
  const refId = await updatePointsLogHistory(
    user._id,
    master._id,
    user.uname,
    master.uname,
    "CASH_DEBIT",
    amount,
    user_new_balance
  );

  const from_user_balance = await getUserLatestPointsById(user._id);
  const to_user_balance = await getUserLatestPointsById(master._id);

  const creditTransaction = new CreditTransaction({
    from_id: user._id,
    to_id: master._id,
    amount,
    from_user_balance,
    to_user_balance,
    type: "CashType",
    creation_date: new Date(),
  });
  const { _id: reference_id } = await creditTransaction.save();

  // Transaction details for user
  const after_balance = await getUserLatestPointsById(user._id);
  const trans_details = new PunterTransDetails({
    type: 3,
    remark: IssueDescriptionwith,
    user_id: user._id,
    amount: -amount,
    before_balance: user.bz_balance,
    after_balance,
    market_type: 0,
    created_date: new Date(),
    payment_type: 2,
    reference_id,
    summary_id: refId,
  });
  await trans_details.save();

  await SetPLByRole(
    user.user_role,
    user._id,
    -amount,
    IssueDescriptionwith,
    3,
    0,
    2,
    refId
  );

  // Transaction details for master
  const after_balance_master = await getUserLatestPointsById(master._id);
  const master_trans_details = new PunterTransDetails({
    type: 3,
    remark: IssueDescriptionwith,
    user_id: master._id,
    amount: amount,
    before_balance: master.bz_balance,
    after_balance: after_balance_master,
    market_type: 0,
    created_date: new Date(),
    payment_type: 2,
    reference_id,
    summary_id: refId,
  });
  await master_trans_details.save();

  // Final sheet record
  const finalSheetRecord = new PunterFinalSheetRecords({
    user_id: user._id,
    my_share_amount: -amount,
    upline_share_amount: amount,
    updated_date: new Date(),
    type: 2,
    settled_date: new Date(),
  });
  await finalSheetRecord.save();

  await SetPLByRole(
    master.user_role,
    master._id,
    amount,
    IssueDescriptionwith,
    3,
    0,
    2,
    refId
  );
  await PunterFinalSheet.findOneAndUpdate(
    { parent_id: master._id, child_id: user._id },
    { $inc: { win_amount: amount } }
  );

  return res.json({
    R: true,
    M: "Points has been transfer successfully",
    user_id: encode_user_id,
  });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ R: false, M: "An error occurred.", error });
  // }
});

// POST /company/user-credit-deposit-popup
router.post("/user-credit-deposit-popup", async (req, res) => {
  //try {
  const {
    amount: usercred_amt_cr,
    to_id: user_id,
    l_id_cash,
    description: IssueDescriptiondepcredit,
  } = req.body;
  const enctypted_user_id = user_id;

  if (!enctypted_user_id) {
    return res.status(400).json({ R: false, M: "Invalid request." });
  }

  // Get sponsor_id
  const user = await Punter.findOne({ _id: user_id }).lean();
  if (!user) {
    return res.status(404).json({ R: false, M: "This user does not exists." });
  }
  const sponser_id_xx = user.sponser_id;

  if (usercred_amt_cr == 0) {
    return res.json({
      R: true,
      M: "Points has been transfer successfully",
      credit_available: 0,
      user_id: enctypted_user_id,
    });
  }

  // Validate amount
  const amount = parseFloat(usercred_amt_cr);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      R: false,
      errors: { usercred_amt_cr: "Please enter valid amount" },
    });
  }

  // Get master details
  const master = await Punter.findOne({ _id: sponser_id_xx }).lean();
  if (!master) {
    return res.status(404).json({ R: false, M: "Sponsor not found." });
  }

  // Role check

  if (master.user_role >= user.user_role) {
    return res.status(403).json({
      R: false,
      M: "You can only deposit to users under your downline.",
    });
  }

  // Credit amount check
  if (master.credit_amount < 0) {
    return res.status(400).json({
      R: false,
      M: "Something went wrong please contact with your upline.",
    });
  }

  // Calculate checkBalance

  let checkBalance =
    master.bz_balance < 0
      ? Number(master.credit_amount) + Number(master.bz_balance)
      : Number(master.credit_amount);

  if (amount > checkBalance) {
    return res.status(400).json({
      R: false,
      M: `Insufficient Balance.You can transfer maximum ${checkBalance}`,
    });
  }

  if (user.sponser_id.toString() != master._id.toString()) {
    return res.status(403).json({
      R: false,
      M: "You can only deposit to users under your downline.",
    });
  }

  // Perform the transaction
  if (user.user_role === 8) {
    await Punter.updateOne(
      { _id: user_id },
      {
        $inc: {
          bz_balance: amount,
          opin_bal: amount,
          credit_reference: amount,
          credit_amount: amount,
        },
        $set: { Updated: new Date() },
      }
    );
  } else {
    await Punter.updateOne(
      { _id: user_id },
      {
        $inc: { credit_amount: amount, credit_reference: amount },
        $set: { Updated: new Date() },
      }
    );
  }
const before_balance_master = await getUserCreditLatestPointsById(master._id);
  await Punter.updateOne(
    { _id: master._id },
    { $inc: { credit_amount: -amount } }
  );
  const master_new_credit_amount = master.credit_amount - amount;

  // Log the transaction history
  const refId = await updatePointsLogCreditHistory(
    master._id,
    user_id,
    master.uname,
    user.uname,
    "CRD_CREDIT",
    amount,
    master_new_credit_amount,
    req.ip
  );

  const from_user_balance = await getUserCreditLatestPointsById(master._id);
  const to_user_balance = await getUserCreditLatestPointsById(user_id);

  const creditTransaction = new CreditTransaction({
    from_id: master._id,
    to_id: user_id,
    amount,
    from_user_balance,
    to_user_balance,
    type: "CreditType",
    creation_date: new Date(),
  });
  const { _id: reference_id } = await creditTransaction.save();

  const before_balance = await getUserCreditLatestPointsById(user_id);
  
  const after_balance = Number(before_balance) + Number(amount);
  
  const after_balance_master = await getUserCreditLatestPointsById(master._id);

  const type = 3;
  const remark = IssueDescriptiondepcredit;
  const market_type = 0;
  const payment_type = 1;
  const summary_id = refId;

  // Transaction details for user
  const trans_details = new PunterTransDetails({
    type,
    remark,
    user_id,
    amount,
    before_balance,
    after_balance,
    market_type,
    created_date: new Date(),
    payment_type,
    reference_id,
    summary_id,
  });
  await trans_details.save();

  await SetPLByRole(
    user.user_role,
    user_id,
    amount,
    remark,
    type,
    market_type,
    payment_type,
    summary_id
  );

  // Transaction details for master
  //master_new_credit_amount
  const master_trans_details = new PunterTransDetails({
    type,
    remark,
    user_id: master._id,
    amount: -amount,
    before_balance: before_balance_master,
    after_balance: after_balance_master,
    market_type,
    created_date: new Date(),
    payment_type,
    reference_id,
    summary_id,
  });
  await master_trans_details.save();

  await SetPLByRole(
    master.user_role,
    master._id,
    -amount,
    remark,
    type,
    market_type,
    payment_type,
    summary_id
  );

  return res.json({
    R: true,
    M: "Points has been transfer successfully",
    credit_available: master_new_credit_amount,
    user_id: enctypted_user_id,
  });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ R: false, M: "An error occurred.", error });
  // }
});

// code verified
router.post("/user-credit-withdrawal-popup", async (req, res) => {
  try {
    const {
      amount: userdebit_amt_cr,
      from_id: user_id_with_cr,
      description: IssueDescriptionwithcredit,
    } = req.body;
    const enctypted_user_id = user_id_with_cr;
    const user_id = user_id_with_cr;

    // Get sponsor_id
    const user = await Punter.findById(user_id).lean();
    if (!user) {
      return res
        .status(404)
        .json({ R: false, M: "This user does not exists." });
    }
    const sponser_id_xx = user.sponser_id;

    if (userdebit_amt_cr == 0) {
      return res.json({
        R: true,
        M: "Points has been transfer successfully",
        bal: 0,
        credit_available: 0,
        user_id: enctypted_user_id,
      });
    }

    // Validate amount
    const amount = parseFloat(userdebit_amt_cr);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        R: false,
        errors: { userdebit_amt_cr: "Please enter valid amount" },
      });
    }

    // Get master details
    const master = await Punter.findById(sponser_id_xx).lean();
    if (!master) {
      return res.status(404).json({ R: false, M: "Sponsor not found." });
    }

    // Role check
    if (master.user_role >= user.user_role) {
      return res.status(403).json({
        R: false,
        M: "You can only withdraw from users under your downline.",
      });
    }

    // Credit amount check
    if (user.credit_amount < 0) {
      return res.status(400).json({
        R: false,
        M: "Somethig went wrong please contact with your upline.",
      });
    }

    // Sponsor id check
    if (user.sponser_id.toString() !== master._id.toString()) {
      return res.status(403).json({
        R: false,
        M: "You can only withdraw from users under your downline.",
      });
    }

    // Calculate checkBalance
    let checkBal = 0;
    if (user.user_role === 8) {
      if (user.credit_amount != 0) {
        checkBal = user.bz_balance;
      }
    } else if (user.bz_balance < 0) {
      checkBal = Number(user.credit_amount) + Number(user.bz_balance);
    } else {
      checkBal = user.credit_amount;
    }

    // Insufficient balance
    if (amount > checkBal) {
      return res.status(400).json({
        R: false,
        M: `Insufficient User Balance.You can withdrawal maximum ${checkBal}`,
      });
    }

    // Transaction
    let user_new_balance;
    let master_new_balancecred;
    if (user.user_role === 8) {
      if (user.credit_amount > 0) {
        await Punter.updateOne(
          { _id: user_id },
          {
            $inc: {
              bz_balance: -amount,
              opin_bal: -amount,
              credit_reference: -amount,
              credit_amount: -amount,
            },
            $set: { Updated: new Date() },
          }
        );
      } else {
        await Punter.updateOne(
          { _id: user_id },
          {
            $inc: {
              bz_balance: -amount,
              opin_bal: -amount,
              credit_reference: -amount,
            },
            $set: { Updated: new Date() },
          }
        );
      }

      await Punter.updateOne(
        { _id: master._id },
        { $inc: { credit_amount: amount } }
      );
      user_new_balance = user.bz_balance - amount;
      master_new_balancecred = master.credit_amount + amount;
    } else {
      await Punter.updateOne(
        { _id: user_id },
        {
          $inc: { credit_amount: -amount, credit_reference: -amount },
          $set: { Updated: new Date() },
        }
      );
      await Punter.updateOne(
        { _id: master._id },
        { $inc: { credit_amount: amount } }
      );
      user_new_balance = user.credit_amount - amount;
      master_new_balancecred = master.credit_amount + amount;
    }

    // Log the transaction history
    const refId = await updatePointsLogCreditHistory(
      user_id,
      master._id,
      user.uname,
      master.uname,
      "CRD_DEBIT",
      amount,
      user_new_balance,
      req.ip
    );

    const from_user_balance = await getUserCreditLatestPointsById(user_id);
    const to_user_balance = await getUserCreditLatestPointsById(master._id);

    const creditTransaction = new CreditTransaction({
      from_id: user_id,
      to_id: master._id,
      amount,
      from_user_balance,
      to_user_balance,
      type: "CreditType",
      creation_date: new Date(),
    });
    const { _id: reference_id } = await creditTransaction.save();

    // Transaction details for user
    let before_balance, after_balance, payment_type;
    let remark =
      IssueDescriptionwithcredit || `Credit Withdrawn from ${user.uname}`;
    let type = 3;
    let market_type = 0;
    if (user.user_role === 8) {
      before_balance = user.bz_balance;
      after_balance = await getUserLatestPointsById(user_id);
      payment_type = 2;
    } else {
      before_balance = user.credit_amount;
      after_balance = await getUserCreditLatestPointsById(user_id);
      payment_type = 1;
    }

    const trans_details = new PunterTransDetails({
      type,
      remark,
      user_id,
      amount: -amount,
      before_balance,
      after_balance,
      market_type,
      created_date: new Date(),
      payment_type,
      reference_id,
      summary_id: refId,
    });
    await trans_details.save();

    await SetPLByRole(
      user.user_role,
      user_id,
      amount,
      remark,
      type,
      market_type,
      payment_type,
      refId
    );

    // Transaction details for master
    let before_balance_master = master.credit_amount;
    let after_balance_master;
    if (user.user_role === 8) {
      after_balance_master = Number(before_balance_master) + Number(amount);
    } else {
      after_balance_master = await getUserCreditLatestPointsById(master._id);
    }

    const master_trans_details = new PunterTransDetails({
      type,
      remark,
      user_id: master._id,
      amount,
      before_balance: before_balance_master,
      after_balance: after_balance_master,
      market_type,
      created_date: new Date(),
      payment_type: 1,
      reference_id,
      summary_id: refId,
    });
    await master_trans_details.save();

    await SetPLByRole(
      master.user_role,
      master._id,
      amount,
      remark,
      type,
      market_type,
      1,
      refId
    );

    return res.json({
      R: true,
      M: "Points has been transfer successfully",
      bal: user.credit_amount,
      credit_available: master_new_balancecred,
      user_id: enctypted_user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ R: false, M: "An error occurred.", error });
  }
});

// POST /company/settle-popup
router.post("/settle-popup", async (req, res) => {
  const { user_id } = req.body;
  const settlearray = {};

  if (user_id) {
    const user = await Punter.findById(user_id).lean();
    if (user) {
      settlearray.uname = user.uname;
      settlearray.user_id_enc = user_id;
      settlearray.settled_amount = user.transaction_pl;
    }
  }

  return res.json(settlearray);
});

// POST /company/save-settlement
router.post("/save-settlement", async (req, res) => {
  try {
    const { TransferAmount, Description, user_id_settle } = req.body;
    const errors = {};

    let amt;
    // Validation
    if (!TransferAmount || isNaN(TransferAmount)) {
      errors.TransferAmount = "Transfer Amount is required and must be numeric";
    }
    if (!Description) {
      errors.Description = "Description is required";
    }
    if (!user_id_settle) {
      errors.user_id_settle = "username is required";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ R: false, errors });
    }

    const user_id = user_id_settle;

    const user = await Punter.findById(new ObjectId(user_id)).lean();
    console.log("user:", user);
    if (!user) {
      return res.status(404).json({ R: false, M: "User not found." });
    }

    const sponser_id = user.sponser_id;
    const settled_user_uname = user.uname;
    const userLatestBalance = user.bz_balance;
    const user_total_pl = user.total_pl;
    const user_role = user.user_role;
    const can_settled = user.can_settled;
    const transaction_pl = user.transaction_pl;
    const before_balance_user = transaction_pl;
    const master_id = sponser_id;

    if (user_role === 8) {
      return res.json({ R: false, M: "User Account can not do settlement." });
    }
    if (can_settled === 0) {
      return res.json({
        R: false,
        M: "Your settlement is off please contact with your Upline.",
      });
    }

    const master = await Punter.findById(master_id).lean();
    if (!master) {
      return res.status(404).json({ R: false, M: "Sponsor not found." });
    }
    const MasterBalance = master.bz_balance;
    const credit_amount = master.credit_amount;
    const loginId = master.uname;
    const before_balance_master = master.bz_balance;

    if (sponser_id.toString() === master_id.toString()) {
      if (TransferAmount > 0) {
        const new_user_total_pl = Math.abs(transaction_pl);
        console.log(new_user_total_pl, "new_user_total_pl", TransferAmount);
        if (TransferAmount > new_user_total_pl) {
          return res.json({
            R: false,
            M: `Maximum ${new_user_total_pl} point can settled.`,
          });
        } else {
          // master profit
          if (transaction_pl < 0) {
            amt = Math.abs(TransferAmount);

            const doc = await UserSettlementRecord.create({
              user_id: user_id,
              settlement_by: master_id,
              settled_amount: Number(TransferAmount),
              creation_date: new Date(),
            });

            const summ_id = doc._id;
            // Add to user cash
            await Punter.findByIdAndUpdate(user_id, {
              $inc: { bz_balance: amt, opin_bal: amt },
            });

            const from_user = "STLMENTUSER";
            const to_user = settled_user_uname;
            const settlementAmount = amt;
            const type = "STLMENT";
            const msg1 = Description;
            const msg2 = Description;
            const UserBalance = userLatestBalance + amt;
            const reff_id = "";

            const session_login_id = master_id;
            const ipadd = req.ip;

            //BzPtRecord
            const bzRec = await BzPtRecord.create({
              from: from_user,
              to: to_user,
              point: Number(settlementAmount),
              type,
              remark: msg1,
              remark2: msg2,
              loginId: session_login_id,
              ipadd,
              balance: Number(UserBalance),
            });

            const id7 = bzRec._id;
            const dt = bzRec.stmp || new Date();

            await BzPtLogHistory.create({
              uname: to_user,
              linkid: id7,
              points: String(UserBalance),
              date: dt,
              type: String(type),
            });

            const after_balance_user = Number(userLatestBalance) + Number(amt);

            await PunterTransDetails.create({
              user_id: user_id,
              amount: Number(amt),
              before_balance: Number(userLatestBalance),
              after_balance: after_balance_user,
              summary_id: summ_id,
              child_user_id: user_id,
              player_id: user_id,
              win_amount: 0,
              created_date: new Date(),
              type: "2",
              remark: msg1,
              payment_type: 2,
            });

            await Punter.updateOne(
              { _id: user_id },
              { $inc: { transaction_pl: Number(amt) } }
            );

            const after_balance_user2 =
              Number(before_balance_user) + Number(amt);

            await PunterTransDetails.create({
              user_id: user_id,
              amount: Number(amt),
              before_balance: Number(before_balance_user),
              after_balance: Number(after_balance_user),
              summary_id: Number(summ_id),
              child_user_id: user_id,
              player_id: user_id,
              win_amount: 0,
              created_date: new Date(),
              type: "2",
              remark: msg1,
              payment_type: 0,
            });

            // punter_finalsheet_records inserts
            await PunterFinalSheetRecords.create({
              user_id: user_id,
              my_share_amount: Number(amt),
              upline_share_amount: 0,
              updated_date: new Date(),
              type: "1",
              settled_date: new Date(),
              remark: "settling1",
            });

            await PunterFinalSheetRecords.create({
              user_id: user_id,
              my_share_amount: Number(amt),
              upline_share_amount: 0,
              updated_date: new Date(),
              type: "2",
              settled_date: new Date(),
              remark: "settling1",
            });

            const nagAmount = -Number(amt);

            await PunterFinalSheetRecords.create({
              user_id: user_id,
              my_share_amount: 0,
              upline_share_amount: nagAmount,
              updated_date: new Date(),
              type: "3",
              settled_date: new Date(),
              remark: "settling1",
            });

            // I have used upsert, because if record not found then it will create new one
            await PunterFinalSheet.updateOne(
              { parent_id: user_id, child_id: user_id, type: "s" },
              {
                $inc: { share_amount: Number(amt) },
                $set: { updated_date: new Date() },
                $setOnInsert: { win_amount: 0 },
              },
              { upsert: true }
            );
          } else {
            // master loss
            amt = Math.abs(TransferAmount);
            // INSERT INTO user_settlement_records
            const usrSettle = await UserSettlementRecord.create({
              user_id: user_id,
              settlement_by: master_id,
              settled_amount: Number(TransferAmount),
              creation_date: new Date(),
            });
            const summ_id = usrSettle._id;

            // UPDATE users SET bz_balance=bz_balance-amt, opin_bal=opin_bal-amt
            await Punter.updateOne(
              { _id: user_id },
              { $inc: { bz_balance: -Number(amt), opin_bal: -Number(amt) } }
            );

            // Prepare vars from PHP block
            const to_user = "STLMENTUSER";
            const from_user = settled_user_uname;
            const settlementAmount = Number(amt);
            const type = "STLMENT";
            const msg1 = Description;
            const msg2 = Description;
            const UserBalance = Number(userLatestBalance) - Number(amt);
            const session_login_id = master_id;
            const reff_id = "";
            const ipadd = req.ip;

            // INSERT INTO bz_pt_records ...
            const bzDoc = await BzPtRecord.create({
              from: from_user,
              to: to_user,
              point: settlementAmount,
              type,
              remark: msg1,
              remark2: msg2,
              loginId: String(session_login_id),
              ipadd: String(ipadd),
              balance: UserBalance,
            });

            const id7 = bzDoc._id;
            const dt = bzDoc.stmp || new Date();

            // bz_pt_log_history insert
            await BzPtLogHistory.create({
              uname: from_user,
              linkid: id7,
              points: String(UserBalance),
              date: dt || new Date(),
              type: String(type),
            });

            // balances and amounts
            const after_balance_user = Number(userLatestBalance) - Number(amt);
            const amt_new = -Number(amt);

            // bz_bt_punter_trans_details (negative amount, payment_type=2)
            await PunterTransDetails.create({
              user_id: user_id,
              amount: amt_new,
              before_balance: Number(userLatestBalance),
              after_balance: after_balance_user,
              summary_id: summ_id.toString(),
              child_user_id: user_id,
              player_id: user_id,
              win_amount: 0,
              created_date: new Date(),
              type: "2",
              remark: msg1,
              payment_type: 2,
            });

            // users: transaction_pl = transaction_pl - amt
            await Punter.updateOne(
              { _id: user_id },
              { $inc: { transaction_pl: -Number(amt) } }
            );

            const after_balance_trans_user =
              Number(transaction_pl) - Number(amt);

            await PunterTransDetails.create({
              user_id: user_id,
              amount: Number(amt),
              before_balance: Number(transaction_pl),
              after_balance: after_balance_trans_user,
              summary_id: Number(summ_id),
              child_user_id: user_id,
              player_id: user_id,
              win_amount: 0,
              created_date: new Date(),
              type: "2",
              remark: msg1,
              payment_type: 0,
            });

            // punter_finalsheet_records inserts
            await PunterFinalSheetRecords.create({
              user_id: user_id,
              my_share_amount: -Number(amt),
              upline_share_amount: 0,
              updated_date: new Date(),
              type: "1",
              settled_date: new Date(),
              remark: "settling",
            });

            await PunterFinalSheetRecords.create({
              user_id: user_id,
              my_share_amount: -Number(amt),
              upline_share_amount: 0,
              updated_date: new Date(),
              type: "2",
              settled_date: new Date(),
              remark: "settling",
            });

            await PunterFinalSheetRecords.create({
              user_id: user_id,
              my_share_amount: 0,
              upline_share_amount: Number(amt),
              updated_date: new Date(),
              type: "3",
              settled_date: new Date(),
              remark: "settling"
            });
            // used upsert, because if record not found then it will create new one
            await PunterFinalSheet.updateOne(
              {
                parent_id: user_id,
                child_id: user_id,
                type: "s",
              },
              {
                $inc: { share_amount: -Number(amt) },
                $set: { updated_date: new Date() },
                $setOnInsert: { win_amount: 0 },
              },
              { upsert: true }
            );
          }
          return res.status(200).json({
            R: true,
            M: `Success. ${amt} was moved to cash account.`,
          });
        }
      } else {
        return res.json({
          R: false,
          M: "Amount should be greater then 0",
        });
      }
    } else {
      return res.json({
        R: false,
        M: "Only Sponsor can Settled Account.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      R: false,
      M: "Something went wrong please close the window and reload window.",
      error: error.message,
    });
  }
});


// POST /company/credit-history
router.post("/credit-history", async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const requestUserId = req.body.userId;
    const payment_type = req.body.payment_type;

    const userCheck = await Punter.findOne({
      _id: requestUserId
    });

    if (!userCheck) {
      return res.json({
        R: false,
        userId: userId,
        M: "user not found."
      });
    }

    let username = userCheck.uname;
    let user_role = userCheck.user_role;
    let after_balanceLast = 0;
    let return_array = [];
    let obj = {};
    obj.user_id = new ObjectId(requestUserId);
    obj.created_date = { $lt: new Date(startDate) };

    if (user_role == 8) {
      //obj.payment_type = 1;
      obj.payment_type = { $in: [1, 2] };
    } else {
      obj.payment_type = 1;
    }

    const lastRecord = await PunterTransDetails.find(obj)
      .select()
      .sort({ created_date: -1 })
      .limit(1);

    if (lastRecord.length > 0) {
      after_balanceLast = lastRecord[0]["after_balance"];
    }

    let data_array1 = {};
    data_array1.remark = "Opening Balance";
    data_array1.is_dummy = 1;
    data_array1.amount = 0;
    data_array1.created_date = new Date(startDate);
    data_array1.after_balance = after_balanceLast;
    data_array1.before_balance = 0;
    data_array1.payment_type = 0;
    data_array1.record_id = "";
    data_array1.type = 0;
    data_array1.bal = after_balanceLast;
    return_array.push(data_array1);

    //get all credit record list
    let objNew = {};

    objNew.user_id = new ObjectId(requestUserId);
    objNew.created_date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
    if (user_role == 8) {
      //objNew.payment_type = 1;
      objNew.payment_type = { $in: [1, 2] };
    } else {
      objNew.payment_type = 1;
    }

    const recordList = await PunterTransDetails.find(objNew)
      .select()
      .sort({ created_date: 1 })
      .limit();

    let bal = after_balanceLast;
    //console.log("bal->", bal);
    //console.log("recordList->", recordList);

    recordList.map((record) => {
      let data_array = {};
      bal = bal + record.amount;
      data_array.amount = record.amount;
      data_array.after_balance = bal;
      data_array.before_balance = record.before_balance;
      data_array.created_date = record.created_date;
      data_array.record_id = record._id;
      data_array.type = record.type;
      data_array.payment_type = record.payment_type;
      data_array.remark = record.remark;
      data_array.bal = bal;
      return_array.push(data_array);
    });

    return res.json({
      R: true,
      username: username,
      recordList: return_array,
      M: ""
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      R: false,
      M: "Something went wrong In credit history",
      error: error.message
    });
  }
});

// POST /company/cash-history
router.post("/cash-history", async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const requestUserId = req.body.userId;
    const payment_type = req.body.payment_type;

    const userCheck = await Punter.findOne({
      _id: requestUserId
    });

    if (!userCheck) {
      return res.json({
        R: false,
        userId: userId,
        M: "user not found."
      });
    }

    let username = userCheck.uname;
    let user_role = userCheck.user_role;

    if (payment_type == 1) {
    } else {
    }

    let obj = {};
    obj.user_id = new ObjectId(requestUserId);
    obj.created_date = { $lt: new Date(startDate) };
    obj.payment_type = 2;

    const lastRecord = await PunterTransDetails.find(obj)
      .select()
      .sort({ created_date: -1 })
      .limit(1);

    let after_balanceLast = 0;
    let return_array = [];
    if (lastRecord.length > 0) {
      after_balanceLast = lastRecord[0]["after_balance"];
    }
    let data_array1 = {};
    data_array1.remark = "Opening Balance";
    data_array1.is_dummy = 1;
    data_array1.amount = 0;
    data_array1.created_date = new Date(startDate);
    data_array1.after_balance = after_balanceLast;
    data_array1.before_balance = 0;
    data_array1.payment_type = 0;
    data_array1.record_id = "";
    data_array1.type = 0;
    data_array1.bal = after_balanceLast;
    return_array.push(data_array1);

    console.log("data_array1->", data_array1);

    let objNew = {};
    objNew.user_id = new ObjectId(requestUserId);
    objNew.created_date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
    objNew.payment_type = 2;
    //console.log("objNew->",objNew);

    const recordList = await PunterTransDetails.find(objNew)
      .select()
      .sort({ created_date: 1 })
      .limit();

    let bal = after_balanceLast;

    recordList.map((record) => {
      let data_array = {};
      bal = bal + record.amount;
      data_array.amount = record.amount;
      data_array.after_balance = record.after_balance;
      data_array.before_balance = record.before_balance;
      data_array.created_date = record.created_date;
      data_array.record_id = record._id;
      data_array.type = record.type;
      data_array.payment_type = record.payment_type;
      data_array.remark = record.remark;
      data_array.bal = bal;
      return_array.push(data_array);
    });

    return res.json({
      R: true,
      username: username,
      recordList: return_array,
      M: ""
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      R: false,
      M: "Something went wrong In cash history",
      error: error.message
    });
  }
});




// POST /company/P/L Downline
router.post("/pl-Downline", async (req, res) => {
  try {

      const loginUserId = req.user._id;
      const startDate = req.body.startDate;
      const endDate = req.body.endDate;
      const requestUserId = req.body.userId;

      let return_array = [];

      const userCheck = await Punter.findOne({
        _id: requestUserId
      });
  
      if (!userCheck) {
        return res.json({
          R: false,
          userId: userId,
          M: "user not found."
        });
      }
  
      let username = userCheck.uname;
      let user_role = userCheck.user_role;
      let after_balanceLast = 0;
      let pipeline = [];
      let pipelineLastBalance = [];

      if (user_role == 8) {
        pipelineLastBalance = [
          {
            user_id: new ObjectId(requestUserId),
            created_date: { $lt: new Date(startDate) }
          },
          {
            after_balance: 1,
            _id: 0
          },
          {
            $sort: { created_date: -1 }
          }
        ];
      } else {
        pipelineLastBalance = [
          {
            $match: {
              user_id: new ObjectId(requestUserId),
              payment_type: 0,
              created_date: { $lt: new Date(startDate) }
            }
          },
          {
            $group: {
              _id: null,
              afterBalance: { $sum: "$amount" }
            }
          }
        ];

        const match = {
          user_id: new ObjectId(requestUserId),
          payment_type: 0,
          type: { $in: [1, 2, 3] },
          created_date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        };

        const projectStage = {
          _id: 1,
          reference_id: "$_id.reference_id",
          game_type: "$_id.game_type",
          market_type: "$_id.market_type",
          cat_mid: "$_id.cat_mid",
          amount: 1,
          id: 1,
          remark: 1,
          created_date: 1,
          summary_id: 1,
          tid: 1,
          payment_type: 1,
          type: 1,
          evt_id: 1
        };

        const groupStage = {
          _id: {
            reference_id: "$reference_id",
            game_type: "$game_type",
            market_type: "$market_type",
            cat_mid: "$cat_mid"
          },
          amount: { $sum: "$amount" },
          id: { $first: "$id" },
          remark: { $first: "$remark" },
          created_date: { $first: "$created_date" },
          summary_id: { $first: "$summary_id" },
          tid: { $first: "$tid" },
          payment_type: { $first: "$payment_type" },
          type: { $first: "$type" },
          evt_id: { $first: "$evt_id" }
        };

        pipeline = [
          { $match: match },
          { $group: groupStage },
          //{ $addFields: addFieldsStage },
          { $project: projectStage },
          {
            $sort: { created_date: 1 }
          }
        ];
      }

      rspl = await PunterTransDetails.aggregate(pipelineLastBalance).exec();
      if (rspl) {
        after_balanceLast = rspl[0]?.afterBalance ? rspl[0].afterBalance : 0;
      } else {
        after_balanceLast = 0;
      }

      const recordslst = await PunterTransDetails.aggregate(pipeline).exec();

      if (recordslst) {
        for (const record of recordslst) {
          let amount = 0;
          let data_array = {};

          let after_balance = after_balanceLast + record.amount;
          after_balanceLast = after_balance;

          if (user_role == 8) {
            amount = record.amount;
            data_array.after_balance = after_balance;
          } else {
            amount = record.amount * -1;
            let after_balance_new = after_balance * -1;
            data_array.after_balance = after_balance_new;
          }

          data_array.remark = record.remark;
          data_array.created_date = record.created_date;
          data_array.type = record.type;
          data_array.payment_type = record.payment_type;
          data_array.evt_id = record.evt_id;
          data_array.reference_id = record.reference_id;
          data_array.game_type = record.game_type;
          data_array.market_type = record.market_type;
          data_array.cat_mid = record.cat_mid;
          data_array.summary_id = record.summary_id;
          data_array.tid = record.tid;
          data_array.amount = amount;

          data_array.id = "";

          return_array.push(data_array);
        }
      }

      // console.log("userCheck->",userCheck);
      
      return res.json({
        R: true,
        username: username,
        recordList: return_array,
        M: ""
      });

    }
    catch (error) {
      console.error(error);
      return res.status(500).json({
        R: false,
        M: "Something went wrong In cash history",
        error: error.message
      });
    }
});


module.exports = router;
