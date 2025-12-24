const mongoose = require("mongoose");

const BzBetfairHoldRatesSchema = new mongoose.Schema(
  {
    evt_id: { type: String, required: true },
    evt_evt: { type: String, required: true },
    evt_od: { type: Date, required: true },
    open_date: { type: Date, required: true },

    cat_mid: { type: String, required: true },
    cat_sid1: { type: String, required: true },
    cat_rnr1: { type: String, required: true },
    cat_sid2: { type: String, required: true },
    cat_rnr2: { type: String, required: true },
    cat_sid3: { type: String, required: true },
    cat_rnr3: { type: String, required: true },
    cat_sid4: { type: String, required: true },
    cat_rnr4: { type: String, required: true },

    evt_status: { type: String, required: true },
    market_status: { type: String, required: true },
    result: { type: String, required: true },

    rnr1_status: { type: String, required: true },
    rnr2_status: { type: String, required: true },
    rnr3_status: { type: String, required: true },
    rnr4_status: { type: String, required: true },

    game_type: { type: Number, required: true },
    left_time: { type: String, required: true },
    stld: { type: Number, default: 0 },

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

    update_at: { type: Date, default: Date.now },
    counter: { type: Number, default: 0 },
    diamond_id: { type: String, required: true },
    round: { type: String, default: 0 },
    time: { type: String, required: true },
    time_percentage: { type: String, required: true },

    round_od: { type: Date, required: true },
    round_close_date: { type: Date, required: true },

    market_id1: { type: String, required: true },
    is_bet_place: { type: Number, default: 0 }
  },
  {
    collection: "bz_betfair_hold_rates",
    timestamps: false // since table already has update_at field
  }
);

module.exports = mongoose.model("BzBetfairHoldRate", BzBetfairHoldRatesSchema);
