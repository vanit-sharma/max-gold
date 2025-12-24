const mongoose = require("mongoose");

const UserSettlementRecordSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true
    },
    settlement_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true
    },
    settled_amount: { type: Number, required: true },
    creation_date: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: false,
    collection: "user_settlement_records",
    versionKey: false,
    strict: true,
  }
);

module.exports =
  mongoose.models.UserSettlementRecord ||
  mongoose.model("UserSettlementRecord", UserSettlementRecordSchema);
