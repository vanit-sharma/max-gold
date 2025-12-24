const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BetfairTurboDerbyMatchSchema = new Schema(
  {
    //sno: { type: Number, index: true, unique: true },
    uname: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "Punter", required: true },
    cat_mid: { type: String, required: true },
    rnr1: { type: String, required: false },
    rnr1sid: { type: String, required: false },
    rnr1s: { type: Number, required: true },
    rnr2: { type: String, required: false },
    rnr2sid: { type: String, required: false },
    rnr2s: { type: Number, required: true },
    rnr3: { type: String, required: false },
    rnr3sid: { type: String, required: false },
    rnr3s: { type: Number, required: true },
    rnr4: { type: String, required: false },
    rnr4sid: { type: String, required: false },
    rnr4s: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    winamt: { type: Number, required: false },
    stmp: { type: Date, default: Date.now, required: true },
    stld: { type: Number, default: 0, required: false },
    market_type: { type: Number, required: false },
    settledDate: { type: Date, default: null } // DEFAULT CURRENT_TIMESTAMP
  },
  {
    collection: "bz_betfair_turbo_derby_match",
    versionKey: false
  }
);

BetfairTurboDerbyMatchSchema.index({ uname: 1 });
BetfairTurboDerbyMatchSchema.index({ cat_mid: 1 });

module.exports = mongoose.model("BzBetfairTurboDerbyMatch", BetfairTurboDerbyMatchSchema);