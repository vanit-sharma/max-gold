const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBetfairHoldBetHistorySchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    uname: { type: String, required: true, index: true },
    cat_mid: { type: String, required: true, index: true },

    rnr: { type: String, required: true },
    rnrsid: { type: String, required: true },

    type: { type: String, required: true },
    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },

    pro: { type: Number, required: true },
    lib: { type: Number, required: true },

    stmp: { type: Date, default: Date.now },

    cla: { type: Number, required: true },
    round: { type: Number, required: true },

    result_status: {
      type: Number,
      enum: [0, 1, 2],
      required: false,
      default: 0
    }
  },
  {
    collection: "bz_betfair_hold_bet_history",
    timestamps: true
  }
);

module.exports = mongoose.model("BzBetfairHoldBetHistory", BzBetfairHoldBetHistorySchema);
