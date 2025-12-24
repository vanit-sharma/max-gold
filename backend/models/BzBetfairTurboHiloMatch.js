const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BetfairTurboHiloMatchSchema = new Schema(
  {
    //sno: { type: Number, index: true, unique: true },
    uname: { type: String, required: true },
    user_id: { type: String, required: true },
    mid_mid: { type: String, required: true },
    rnr_nam: { type: String, required: true },
    rnr_sid: { type: String, required: true },
    mid_stat: { type: String, required: false },
    bak: { type: Number, required: true },
    lay: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    evt_id: { type: String, required: true },
    stmp: { type: Date, default: Date.now, required: true },
    stld: { type: Number, default: 0, required: false },
    settledDate: { type: Date, required: false, default: null }
  },
  {
    collection: "bz_betfair_turbo_hilo_match",
    versionKey: false
  }
);

BetfairTurboHiloMatchSchema.index({ uname: 1 });
BetfairTurboHiloMatchSchema.index({ mid_mid: 1 });
BetfairTurboHiloMatchSchema.index({ stld: 1 });

module.exports = mongoose.model("BzBetfairTurboHiloMatch", BetfairTurboHiloMatchSchema);
