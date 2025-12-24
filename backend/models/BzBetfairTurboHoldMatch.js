const mongoose = require("mongoose");

const bzBetfairTurboHoldMatchSchema = new mongoose.Schema(
  {
    uname: { type: String, required: true, maxlength: 50, index: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
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

    rnr4: { type: String, required: true, maxlength: 100 },
    rnr4sid: { type: String, required: true, maxlength: 100 },
    rnr4s: { type: Number, required: true },

    lockamt: { type: Number, required: true },
    winamt: { type: Number, required: false },

    stmp: { type: Date, required: true, default: Date.now }, // MySQL DEFAULT CURRENT_TIMESTAMP

    stld: { type: Number, required: true, default: 0 },

    settledDate: { type: Date, required: false, default: null }
  },
  {
    collection: "bz_betfair_turbo_hold_match",
    timestamps: true
  }
);


// bzBetfairTurboHoldMatchSchema.index({ uname: 1 });
// bzBetfairTurboHoldMatchSchema.index({ cat_mid: 1 });

module.exports = mongoose.model("BzBetfairTurboHoldMatch", bzBetfairTurboHoldMatchSchema);