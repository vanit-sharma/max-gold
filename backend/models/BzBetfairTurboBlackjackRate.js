const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBetfairTurboBlackjackRateSchema = new Schema(
  {
    sno: { type: Number, required: true, unique: true, index: true },

    evt_id: { type: String, required: true, index: true },
    evt_evt: { type: String, required: true },
    evt_od: { type: Date, required: true, index: true },
    open_date: { type: Date, required: true },

    cat_mid: { type: String, required: true, index: true },

    cat_rnr1: { type: String, required: true },
    cat_rnr2: { type: String, required: true },
    cat_rnr3: { type: String, required: true },
    cat_rnr4: { type: String, required: true },
    cat_rnr5: { type: String, required: true },
    cat_rnr6: { type: String, required: true },
    cat_rnr7: { type: String, required: true },
    cat_rnr8: { type: String, required: true },

    cat_sid1: { type: String, required: true, maxlength: 100 },
    cat_sid2: { type: String, required: true, maxlength: 100 },
    cat_sid3: { type: String, required: true, maxlength: 100 },
    cat_sid4: { type: String, required: true, maxlength: 100 },
    cat_sid5: { type: String, required: true, maxlength: 100 },
    cat_sid6: { type: String, required: true, maxlength: 100 },
    cat_sid7: { type: String, required: true, maxlength: 100 },
    cat_sid8: { type: String, required: true, maxlength: 100 },

    evt_status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "SUSPENDED_GAME_ROUND_OVER", "CLOSED"],
      index: true,
    },
    market_status: {
      type: String,
      required: true,
      enum: ["RUNNING", "ABANDONED", "STOPPED"],
    },
    result: { type: String, required: true, maxlength: 5 },

    rnr1_status: {
      type: String,
      required: true,
      enum: ["IN_PLAY", "LOSER", "TIED_DEAD_HEAT", "WINNER"],
    },
    rnr2_status: { type: String, required: true },
    rnr3_status: { type: String, required: true },
    rnr4_status: { type: String, required: true },
    rnr5_status: { type: String, required: true },
    rnr6_status: { type: String, required: true },
    rnr7_status: { type: String, required: true },
    rnr8_status: { type: String, required: true },

    game_type: { type: Number, required: true, index: true },
    left_time: { type: String, required: true, maxlength: 100 },
    stld: { type: Number, required: true, default: 0 },

    runner1b1: { type: Number, required: true },
    runner1b2: { type: Number, required: true },
    runner1b3: { type: Number, required: true },
    runner1l1: { type: Number, required: true },
    runner1l2: { type: Number, required: true },
    runner1l3: { type: Number, required: true },

    runner2b1: { type: Number, required: true },
    runner2b2: { type: Number, required: true },
    runner2b3: { type: Number, required: true },
    runner2l1: { type: Number, required: true },
    runner2l2: { type: Number, required: true },
    runner2l3: { type: Number, required: true },

    cards_desc: { type: String, required: true },
    rnr1_desc: { type: String, required: true },
    rnr2_desc: { type: String, required: true },
    rnr3_desc: { type: String, required: true },
    rnr4_desc: { type: String, required: true },

    suspend1: { type: Number, required: true },
    suspend2: { type: Number, required: true },
    suspend3: { type: Number, required: true },
    suspend4: { type: Number, required: true },
    suspend5: { type: Number, required: true },
    suspend6: { type: Number, required: true },
    suspend7: { type: Number, required: true },
    suspend8: { type: Number, required: true },

    update_at: { type: Date, required: true, default: Date.now },
    counter: { type: Number, required: true, default: 0 },
    diamond_id: { type: String, required: true, maxlength: 100 },

    round: { type: Number, required: true, default: 0 },
    time: { type: String, required: true, maxlength: 100 },
    time_percentage: { type: String, required: true, maxlength: 100 },

    round_od: { type: Date, required: true },
    round_close_date: { type: Date, required: true },

    prediction: { type: String, required: true, maxlength: 100 },
    market_id1: { type: String, required: true },
    is_bet_place: { type: Number, required: true, default: 0 },
  },
  {
    collection: "bz_betfair_turbo_blackjack_rates",
    versionKey: false,
  }
);

BzBetfairTurboBlackjackRateSchema.index({ evt_status: 1, stld: 1 });

module.exports = mongoose.model(
    "BzBetfairTurboBlackjackRate",
    BzBetfairTurboBlackjackRateSchema
  );
