const mongoose = require("mongoose");

const bzBetfairTurboHoldRateSchema = new mongoose.Schema(
  {
    evt_id: { type: String, required: true, index: true },
    evt_evt: { type: String, required: true },

    evt_od: { type: Date, required: true, index: true },       // KEY (evt_od)
    open_date: { type: Date, required: true },

    cat_mid: { type: String, required: true, index: true },     // KEY (cat_mid)
    cat_sid1: { type: String, required: true, maxlength: 100 },
    cat_rnr1: { type: String, required: true },
    cat_sid2: { type: String, required: true, maxlength: 100 },
    cat_rnr2: { type: String, required: true },
    cat_sid3: { type: String, required: true, maxlength: 100 },
    cat_rnr3: { type: String, required: true },
    cat_sid4: { type: String, required: true, maxlength: 100 },
    cat_rnr4: { type: String, required: true },

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

    runner3b1: { type: Number, required: true },
    runner3b2: { type: Number, required: true },
    runner3b3: { type: Number, required: true },
    runner3l1: { type: Number, required: true },
    runner3l2: { type: Number, required: true },
    runner3l3: { type: Number, required: true },

    runner4b1: { type: Number, required: true },
    runner4b2: { type: Number, required: true },
    runner4b3: { type: Number, required: true },
    runner4l1: { type: Number, required: true },
    runner4l2: { type: Number, required: true },
    runner4l3: { type: Number, required: true },

    cards_desc: { type: String, required: true },
    rnr1_desc: { type: String, required: true },
    rnr2_desc: { type: String, required: true },
    rnr3_desc: { type: String, required: true },
    rnr4_desc: { type: String, required: true },

    suspend1: { type: Number, required: true },
    suspend2: { type: Number, required: true },
    suspend3: { type: Number, required: true },
    suspend4: { type: Number, required: true },

    counter: { type: Number, required: true, default: 0 },

    diamond_id: { type: String, required: true, maxlength: 100 },

    round: { type: Number, required: true, default: 0 },

    time: { type: String, required: true, maxlength: 100 },
    time_percentage: { type: String, required: true, maxlength: 100 },

    round_od: { type: Date, required: true },
    round_close_date: { type: Date, required: true },

    market_id1: { type: String, required: true },

    is_bet_place: { type: Number, required: true, default: 0 },
  },
  {
    collection: "bz_betfair_turbo_hold_rates",
    timestamps: true
  }
);


//bzBetfairTurboHoldRateSchema.index({ evt_status: 1, stld: 1 });


module.exports = mongoose.model("BzBetfairTurboHoldRate", bzBetfairTurboHoldRateSchema);
