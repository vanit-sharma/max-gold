const mongoose = require("mongoose");

const BzBetfairHoldMatchSchema = new mongoose.Schema(
  {
    //sno: { type: Number, auto: true, index: true }, // AUTO_INCREMENT
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    uname: { type: String, required: true, maxlength: 50, index: true },
    cat_mid: { type: String, required: true, maxlength: 500, index: true },

    rnr1: { type: String, maxlength: 100, required: true },
    rnr1sid: { type: String, maxlength: 100, required: true },
    rnr1s: { type: Number, required: true },

    rnr2: { type: String, maxlength: 100, required: true },
    rnr2sid: { type: String, maxlength: 100, required: true },
    rnr2s: { type: Number, required: true },

    rnr3: { type: String, maxlength: 100, required: true },
    rnr3sid: { type: String, maxlength: 100, required: true },
    rnr3s: { type: Number, required: true },

    rnr4: { type: String, maxlength: 100, required: true },
    rnr4sid: { type: String, maxlength: 100, required: true },
    rnr4s: { type: Number, required: true },

    lockamt: { type: Number, required: true },
    winamt: { type: Number, required: false },

    stmp: { type: Date, default: Date.now }, // DEFAULT CURRENT_TIMESTAMP
    settledDate: { type: Date, default: null }, // DEFAULT CURRENT_TIMESTAMP
    stld: { type: Number, default: 0 } // default 0
  },
  {
    collection: "bz_betfair_hold_match"
  }
);

module.exports = mongoose.model("BzBetfairHoldMatch", BzBetfairHoldMatchSchema);
