const mongoose = require("mongoose");

const BzBetfairHiloMatchSchema = new mongoose.Schema(
  {
    //sno: { type: Number },
    /*uname: { type: String, required: true, maxlength: 50 },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    uname: { type: String, required: true },
    user_id: { type: String, required: true },
    mid_mid: { type: String, required: true, maxlength: 500 },
    rnr_nam: { type: String, required: true, maxlength: 100 },
    rnr_sid: { type: String, required: true, maxlength: 100 },
    mid_stat: { type: String, required: false, maxlength: 100 },
    bak: { type: Number, required: true },
    lay: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    evt_id: { type: String, required: true, maxlength: 100 },
    stmp: { type: Date, default: Date.now },
    stld: { type: Number, default: 0, required: false },
    settledDate: { type: Date, required: false, default: null }*/
    uname: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    mid_mid: { type: String, required: true },
    rnr_nam: { type: String, required: true },
    rnr_sid: { type: String, required: true },
    mid_stat: { type: String, required: false },
    bak: { type: Number, required: true },
    lay: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    evt_id: { type: String, required: true },
    stmp: { type: Date, default: Date.now, required: true },
    stld: { type: Number, default: 0, required: false }
  },
  { collection: "bz_betfair_hilo_match", versionKey: false }
);

/*BzBetfairHiloMatchSchema.index({ uname: 1 });
BzBetfairHiloMatchSchema.index({ mid_mid: 1 });
BzBetfairHiloMatchSchema.index({ stld: 1 });*/

const BzBetfairHiloMatch = mongoose.model(
  "BzBetfairHiloMatch",
  BzBetfairHiloMatchSchema
);

module.exports = BzBetfairHiloMatch;

