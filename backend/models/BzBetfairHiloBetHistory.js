const mongoose = require("mongoose");

const BzBetfairHiloBetHistorySchema = new mongoose.Schema(
  {
    //tid: { type: Number },
    uname: { type: String, required: true, maxlength: 50 },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    cat_mid: { type: String, required: true, maxlength: 500 },
    rnr: { type: String, required: true, maxlength: 255 },
    rnrsid: { type: String, required: true, maxlength: 500 },
    rnr_val: { type: Number, required: true },
    type: { type: String, required: true, maxlength: 100 },
    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },
    stmp: { type: Date, default: Date.now },
    cla: { type: Number, required: true },
    stld: { type: Number, required: false },
    result_status: { type: Number, required: false, default: "" },
    round: { type: Number, required: true }
  },
  { collection: "bz_betfair_hilo_bet_history" }
);

BzBetfairHiloBetHistorySchema.index({ uname: 1 });
BzBetfairHiloBetHistorySchema.index({ cat_mid: 1 });

const BzBetfairHiloBetHistory = mongoose.model(
  "BzBetfairHiloBetHistory",
  BzBetfairHiloBetHistorySchema
);

module.exports = BzBetfairHiloBetHistory;