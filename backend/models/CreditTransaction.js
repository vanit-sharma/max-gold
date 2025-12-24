const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema(
  {
    from_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter", required: true },
    to_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter", required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true, trim: true },
    from_user_balance: { type: Number, required: true },
    to_user_balance: { type: Number, required: true },
    creation_date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false, collection: "credit_transactions" }
);

module.exports = mongoose.model("CreditTransaction", creditTransactionSchema);
