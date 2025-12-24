// models/BetfairEventBet.js
const mongoose = require("mongoose");

const PunterShareSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    master_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    sharing: { type: Number },
    sharing_role: { type: Number } // or String if you really want "80"
  },
  { _id: false } // don’t create extra _id for each share
);

const BetfairEventBetsSchema = new mongoose.Schema(
  {
    cat_mid: {
      type: String,
      required: true,
      index: true
    },
    uname: {
      type: String,
      required: true,
      index: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Punter",
      index: true
    },
    rnr1: {
      type: String,
      required: true
    },
    rnr1sid: {
      type: Number,
      required: true
    },
    rnr1s: {
      type: Number,
      required: true
    },
    rnr2: {
      type: String,
      required: true
    },
    rnr2sid: {
      type: Number,
      required: true
    },
    rnr2s: {
      type: Number,
      required: true
    },
    rnr3: {
      type: String,
      required: true
    },
    rnr3sid: {
      type: Number,
      required: true
    },
    rnr3s: {
      type: Number,
      required: true
    },
    lockamt: {
      type: Number,
      required: true
    },
    winamt: {
      type: Number,
      required: true,
      default: 0.0
    },
    stmp: {
      type: Date,
      required: true,
      default: () => Date.now()
    },
    stld: {
      type: Number,
      required: true,
      default: 0
    },
    market_type: {
      type: Number,
      required: true,
      default: 1,
      index: true
    },
    bet_game_type: {
      type: Number,
      required: true,
      default: 0
    },
    is_process: {
      type: Number,
      required: true,
      default: 0
    },
    calculative_amt: {
      type: Number,
      required: true,
      default: 0.0
    },
    voided_record: {
      type: Number,
      required: true,
      default: 0
    },
    parent_cat_mid: {
      type: String,
      required: false,
      index: true
    },
    event_name: {
      type: String,
      required: false
    },
    punterSharing: { type: [PunterShareSchema], default: [] }
  },
  {
    collection: "bz_betfair_events_bets",
    versionKey: false
  }
);
module.exports = mongoose.model("BetfairEventBets", BetfairEventBetsSchema);