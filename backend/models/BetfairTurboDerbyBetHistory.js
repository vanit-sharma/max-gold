const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BetfairTurboDerbyBetHistorySchema = new Schema(
  {
    //tid: { type: Number, index: true, unique: true },
    uname: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "Punter", required: true },
    cat_mid: { type: String, required: true },
    rnr: { type: String, required: true },
    rnrsid: { type: String, required: true },
    type: { type: String, required: true },
    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },
    stmp: { type: Date, default: Date.now, required: true },
    cla: { type: Number, required: true },
    round: { type: Number, required: true },
    market_type: { type: Number, required: false },
    result_status: { type: Number, required: false, default: "" }
  },
  {
    collection: "bz_betfair_turbo_derby_bet_history",
    versionKey: false
  }
);

BetfairTurboDerbyBetHistorySchema.index({ uname: 1 });
BetfairTurboDerbyBetHistorySchema.index({ cat_mid: 1 });

module.exports = mongoose.model("BetfairTurboDerbyBetHistory", BetfairTurboDerbyBetHistorySchema);