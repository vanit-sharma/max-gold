const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const STATUS_VALUES = ["ACTIVE", "SUSPENDED_GAME_ROUND_OVER", "CLOSED"];
const MARKET_STATUS_VALUES = ["RUNNING", "ABANDONED", "STOPPED"];
const RUNNER_STATUS_VALUES = ["IN_PLAY", "LOSER", "TIED_DEAD_HEAT", "WINNER"];

const BetfairDerbyRateSchema = new Schema(
  {
    sno: { type: Number, index: true, unique: true },
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
    evt_status: { type: String, enum: STATUS_VALUES, required: true },
    market_status: { type: String, enum: MARKET_STATUS_VALUES, required: true },
    result: { type: String, required: true },
    rnr1_status: { type: String, enum: RUNNER_STATUS_VALUES, required: true },
    rnr2_status: { type: String, required: true },
    rnr3_status: { type: String, required: true },
    rnr4_status: { type: String, required: true },
    game_type: { type: Number, required: true },
    left_time: { type: String, required: true },
    stld: { type: Number, default: 0, required: true },
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
    update_at: { type: Date, default: Date.now, required: true },
    counter: { type: Number, default: 0, required: true },
    diamond_id: { type: String, required: true },
    round: { type: Number, default: 0, required: true },
    time: { type: String, required: true },
    time_percentage: { type: String, required: true },
    round_od: { type: Date, required: true },
    round_close_date: { type: Date, required: true },
    is_bet_place: { type: Number, default: 0, required: true }
  },
  {
    collection: "bz_betfair_card_rates",
    versionKey: false
  }
);

BetfairDerbyRateSchema.index({ evt_id: 1 });
BetfairDerbyRateSchema.index({ evt_od: 1 });
BetfairDerbyRateSchema.index({ cat_mid: 1 });
BetfairDerbyRateSchema.index({ evt_status: 1 });
BetfairDerbyRateSchema.index({ game_type: 1 });
BetfairDerbyRateSchema.index({ evt_status: 1, stld: 1 });

module.exports = mongoose.model("BetfairDerbyRate", BetfairDerbyRateSchema);