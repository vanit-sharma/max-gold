const mongoose = require("mongoose");

const bzBetfairTurboHoldBetHistorySchema = new mongoose.Schema(
  {
    //tid: { type: Number, required: false, unique: true, index: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    uname: { type: String, required: true, maxlength: 50, index: true },
    cat_mid: { type: String, required: true, maxlength: 500, index: true },

    rnr: { type: String, required: true, maxlength: 255 },
    rnrsid: { type: String, required: true, maxlength: 500 },

    type: { type: String, required: true, maxlength: 100 },

    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },

    stmp: { type: Date, required: true, default: Date.now },

    cla: { type: Number, required: true },
    round: { type: Number, required: true },

    result_status: {
      type: Number,
      required: false,
      enum: [0, 1, 2],
      default: 0
    }
  },
  {
    collection: "bz_betfair_turbo_hold_bet_history",
    timestamps: true
  }
);

// bzBetfairTurboHoldBetHistorySchema.index({ uname: 1 });
// bzBetfairTurboHoldBetHistorySchema.index({ cat_mid: 1 });


module.exports = mongoose.model("BzBetfairTurboHoldBetHistory", bzBetfairTurboHoldBetHistorySchema);
