const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BzBetfairTurboHiloBetHistorySchema = new Schema(
  {
    //tid: { type: Number, index: true, unique: true },
    uname: { type: String, required: true },
    user_id: { type: String, required: true },
    cat_mid: { type: String, required: true },
    rnr: { type: String, required: true },
    rnrsid: { type: String, required: true },
    rnr_val: { type: Number, required: true },
    type: { type: String, required: true },
    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },
    stmp: { type: Date, default: Date.now, required: true },
    cla: { type: Number, required: true },
    stld: { type: Number, required: false },
    result_status: { type: Number, required: false, default: "" },
    round: { type: Number, required: true }
  },
  {
    collection: "bz_betfair_turbo_hilo_bet_history",
    versionKey: false
  }
);

BzBetfairTurboHiloBetHistorySchema.index({ uname: 1 });
BzBetfairTurboHiloBetHistorySchema.index({ cat_mid: 1 });

module.exports = mongoose.model("BzBetfairTurboHiloBetHistory", BzBetfairTurboHiloBetHistorySchema);
