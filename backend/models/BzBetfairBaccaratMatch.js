const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBetfairBaccaratMatchSchema = new Schema(
  {
    uname: { type: String, required: true, maxlength: 50, index: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    cat_mid: { type: String, required: true, maxlength: 500, index: true },

    rnr1: { type: String, required: true, maxlength: 100 },
    rnr1sid: { type: String, required: true, maxlength: 100 },
    rnr1s: { type: Number, required: true },

    rnr2: { type: String, required: true, maxlength: 100 },
    rnr2sid: { type: String, required: true, maxlength: 100 },
    rnr2s: { type: Number, required: true },

    rnr3: { type: String, required: true, maxlength: 100 },
    rnr3sid: { type: String, required: true, maxlength: 100 },
    rnr3s: { type: Number, required: true },

    lockamt: { type: Number, required: true },
    winamt: { type: Number, required: false },
    tie_book: { type: Number, required: true },

    stmp: { type: Date, required: true, default: Date.now },
    stld: { type: Number, required: true, default: 0 },
    settledDate: { type: Date, required: false, default: null }
  },
  {
    collection: "bz_betfair_baccarat_match",
    versionKey: false
  }
);

module.exports = mongoose.model("BzBetfairBaccaratMatch", BzBetfairBaccaratMatchSchema);
