const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBetfairBlackjackBetHistorySchema = new Schema(
  {
    //tid: { type: Number, required: false, unique: false, index: true },

    uname: { type: String, required: true, maxlength: 50, index: true },

    user_id: { type: Schema.Types.ObjectId, ref: "Punter", required: true },

    cat_mid: { type: String, required: true, maxlength: 500, index: true },

    rnr: { type: String, required: true, maxlength: 255 },
    rnrsid: { type: String, required: true, maxlength: 500 },
    rnr_val: { type: Number, required: true },

    type: { type: String, required: true, maxlength: 100 },

    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },

    stmp: { type: Date, required: true, default: Date.now },
    cla: { type: Number, required: true },

    stld: { type: Number, required: false },
    result_status: { type: Number, required: false, default: "" },
    round: { type: Number, required: true }
  },
  {
    collection: "bz_betfair_blackjack_bet_history",
    versionKey: false
  }
);


/*BzBetfairBlackjackBetHistorySchema.index({ uname: 1 });
BzBetfairBlackjackBetHistorySchema.index({ cat_mid: 1 });*/

module.exports = mongoose.model(
    "BzBetfairBlackjackBetHistory",
    BzBetfairBlackjackBetHistorySchema
  );
