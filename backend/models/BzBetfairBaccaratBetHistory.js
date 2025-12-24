const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBetfairBaccaratBetHistorySchema = new Schema(
  {
    //tid: { type: Number, required: true, unique: true, index: true },
    uname: { type: String, required: true, maxlength: 50, index: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    cat_mid: { type: String, required: true, maxlength: 500, index: true },
    rnr: { type: String, required: true, maxlength: 255 },
    rnrsid: { type: String, required: true, maxlength: 500 },
    type: { type: String, required: true, maxlength: 100 },
    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },
    rnr_val: { type: Number, required: true },
    stmp: { type: Date, required: true, default: Date.now },
    cla: { type: Number, required: true },
    round: { type: Number, required: true },
    market_type: { type: String, required: true, maxlength: 100 },
    result_status: { type: Number, required: false, default: "" }
  },
  {
    collection: "bz_betfair_baccarat_bet_history",
    versionKey: false
  }
);

/*BzBetfairBaccaratBetHistorySchema.index({ uname: 1 });
BzBetfairBaccaratBetHistorySchema.index({ cat_mid: 1 });*/

module.exports = mongoose.model("BzBetfairBaccaratBetHistory", BzBetfairBaccaratBetHistorySchema);
