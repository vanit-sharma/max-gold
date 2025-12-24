const express = require("express");
const mongoose = require("mongoose");

const Transaction = require("../../models/PunterTransDetails");
const auth = require("../../middleware/auth");
const moment = require("moment-timezone");

const router = express.Router();

router.use(auth);

const LONDON_TZ = "Europe/London";



// POST /accountStatement
router.post("/", async (req, res) => {
  // try {
  const user = req.user;

  if (!user || user.user_role == 8) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  //const userId = req.body.userId;
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  let { frm, til } = req.body;

  const tz = "Europe/London";

  let fromDate = moment
    .tz(frm.split(" ")[0], "YYYY-MM-DD", tz)
    .startOf("day")
    .toDate();
  let toDate = moment
    .tz(til.split(" ")[0], "YYYY-MM-DD", tz)
    .endOf("day")
    .toDate();
    // let fromDate = moment(frm);
    // let toDate = moment(til)

    
  const matchQuery = {
    user_id: userId,
    created_date: { $gte: fromDate, $lt: toDate },
    payment_type: { $in: [0, 1, 2] },
    type: { $in: [1, 2, 3] },
  };

  // Group by reference_id, game_type, market_type, cat_mid
  const grouped = await Transaction.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          reference_id: "$reference_id",
          game_type: "$game_type",
          market_type: "$market_type",
          cat_mid: "$cat_mid",
        },
        amount: { $sum: "$amount" },
        created_date: { $max: "$created_date" },
        id: { $max: "$_id" },
        remark: { $first: "$remark" },
      },
    },
    { $sort: { created_date: 1 } },
  ]);

  const firstTx = await Transaction.findOne(matchQuery).sort({
    created_date: 1,
  });
  let openingBalance = null;
  let initialBalance = 0;



const dateObj = new Date(frm);
dateObj.setDate(dateObj.getDate() - 1);

// start & end of that previous day in the given timezone
const startOfPrevDay = moment.tz(dateObj, tz).startOf('day').toDate();
const endOfPrevDay = moment.tz(dateObj, tz).endOf('day').toDate();

// include created_date range into matchQuery (without mutating original if you need it elsewhere)
const q = {
  ...matchQuery,
  created_date: { $gte: startOfPrevDay, $lte: endOfPrevDay }
};

// get the most recent transaction on that day
const dayBefore = await Transaction.findOne(q).sort({ created_date: -1 });
console.log("Daybeofre->", dayBefore);
console.log("firstTx->", firstTx);
if(dayBefore) {

  if (firstTx) {
    openingBalance = {
      date: firstTx?.created_date,
      description: "Opening Balance",
      amount: 0,
      isOpeningBal:1,
      balance: Math.round(firstTx.before_balance),
      id: firstTx?._id.toString(),
    };
    initialBalance = Math.round(firstTx?.before_balance);
  }
  /*else {
    // If no tx in range, get last before frm
    const lastBefore = await Transaction.findOne({
      user_id: userId,
      created_date: { $lt: frm },
    }).sort({ created_date: -1 });
    if (lastBefore) {
      openingBalance = {
        date: lastBefore.created_date,
        description: "Opening Balance",
        amount: 0,
        isOpeningBal:1,
        balance: Math.round(lastBefore.after_balance),
      };
      initialBalance = Math.round(lastBefore.after_balance);
    }
  }*/
} else if(firstTx) {
  openingBalance = {
      date: firstTx.created_date,
      description: "Opening Balance",
      amount: 0,
      isOpeningBal:1,
      balance: 0,
      id: firstTx._id.toString(),
    };
    initialBalance = 0;
}

  // Build response
  let result = [];
  if (openingBalance) result.push(openingBalance);
console.log("gropued->", grouped);
  for (const [i, tx] of grouped.entries()) {
    
    const txDoc = await Transaction.findById(tx.id);
    //console.log("txDoc->", txDoc);
    let after_balance = txDoc ? txDoc.after_balance : null;

    let description = tx.remark;

    /*
    result.push({
      date: tx.created_date,
      description,
      amount: tx.amount,
      balance: after_balance,
      id:tx.id,
      isOpeningBal:0
    });*/
    initialBalance = initialBalance + tx.amount;
    console.log('txDoc->',txDoc);
    result.push({
      date: tx.created_date,
      description,
      amount: Math.round(tx.amount),
      game_type: txDoc.game_type || 0,
      market_type: txDoc.market_type || 0,
      // balance: after_balance,
      balance: Math.round(initialBalance),
      id:tx.id.toString(),
      isOpeningBal:0
    });
  }
console.log('result: ',result);
  //res.json({ history: result });
  return res.jwe({ history: result }, 200);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
});

// Export the router
module.exports = router;
