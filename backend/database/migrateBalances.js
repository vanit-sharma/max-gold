// migrateBalances.js
const mongoose = require('mongoose');
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const Punter = require('../models/Punter');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log('Starting migration…');

  const cursor = Punter.find().cursor();
  let ops = [], count = 0;

  for await (let doc of cursor) {
    // Convert each Decimal128 field to JS Number
    const upd = {
      bz_balance:      Number(doc.bz_balance.toString()),
      opin_bal:        Number(doc.opin_bal.toString()),
      credit_amount:   Number(doc.credit_amount.toString()),
      credit_reference:Number(doc.credit_reference.toString()),
      bonus_wallet:    Number(doc.bonus_wallet.toString()),
      total_pl:        Number(doc.total_pl.toString()),
      transaction_pl:  Number(doc.transaction_pl.toString()),
      upline_balance:  Number(doc.upline_balance.toString()),
      total_comm:      Number(doc.total_comm.toString()),
      total_casino_pl: Number(doc.total_casino_pl.toString()),
      total_vcasino_pl:Number(doc.total_vcasino_pl.toString()),
    };

    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: upd }
      }
    });

    // Every 500 ops, send a bulkWrite and reset
    if (ops.length === 500) {
      const res = await Punter.bulkWrite(ops);
      count += res.modifiedCount;
      console.log(`…migrated ${count} docs so far`);
      ops = [];
    }
  }

  // Flush any remaining
  if (ops.length) {
    const res = await Punter.bulkWrite(ops);
    count += res.modifiedCount;
  }

  console.log(`Migration complete — ${count} documents updated.`);
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
