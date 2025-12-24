const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBetfairTurboBlackjackMatchSchema = new Schema(
  {
    //sno: { type: Number, required: false, unique: true, index: true },
    uname: { type: String, required: true, maxlength: 50, index: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    mid_mid: { type: String, required: true, maxlength: 500, index: true },
    rnr_nam: { type: String, required: true, maxlength: 100 },
    rnr_sid: { type: String, required: true, maxlength: 100 },
    mid_stat: { type: String, required: false, maxlength: 100 },
    bak: { type: Number, required: true },
    lay: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    evt_id: { type: String, required: true, maxlength: 100 },
    stmp: { type: Date, required: true, default: Date.now },
    stld: { type: Number, required: true, default: 0, index: true },
    settledDate: { type: Date, required: false, default: null }
  },
  {
    collection: "bz_betfair_turbo_blackjack_match",
    versionKey: false
  }
);

module.exports = mongoose.model("BzBetfairTurboBlackjackMatch", BzBetfairTurboBlackjackMatchSchema);
