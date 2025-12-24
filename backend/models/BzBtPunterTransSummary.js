const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBtPunterTransSummarySchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, index: true },
    username: { type: String, required: true },
    cricket_amount: { type: Number, default: 0 },
    cricket_bookmaker: { type: Number, default: 0 },
    cricket_fancy_amount: { type: Number, default: 0 },
    cricket_bf_fancy_amount: { type: Number, default: 0 },
    cricket_evenodd: { type: Number, default: 0 },
    cricket_figure: { type: Number, default: 0 },
    cricket_toss: { type: Number, default: 0 },
    cricket_tie: { type: Number, default: 0 },

    football_amount: { type: Number, default: 0 },
    football_set_amount: { type: Number, default: 0 },
    tennis_amount: { type: Number, default: 0 },
    horserace_amount: { type: Number, default: 0 },
    grayhound_amount: { type: Number, default: 0 },

    betfairgames_amount: { type: Number, default: 0 },
    teenpati_studio_amount: { type: Number, default: 0 },
    galaxy_casino_amount: { type: Number, default: 0 },
    world_casino_amount: { type: Number, default: 0 },
    upline_amount: { type: Number, default: 0 },

    created_timestamp: { type: Number, required: true },
    created_date: { type: Date, required: true },
  },
  {
    collection: "bz_bt_punter_trans_summary",
    versionKey: false,
  }
);

// indexes
BzBtPunterTransSummarySchema.index({ user_id: 1, created_timestamp: -1 });

module.exports = mongoose.model(
  "BzBtPunterTransSummary",
  BzBtPunterTransSummarySchema
);
