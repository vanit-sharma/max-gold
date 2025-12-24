const mongoose = require("mongoose");
const { Schema } = mongoose;

const BtPunterTransSummarySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: false,
      index: true,
    },
     
    cricket_amount: { type: Number, default: 0.0 },
    cricket_bookmaker: { type: Number, default: 0.0 },
    cricket_fancy_amount: { type: Number, default: 0.0 }, 
    cricket_bf_fancy_amount: { type: Number, default: 0.0 }, 
    cricket_evenodd: { type: Number, default: 0.0 }, 
    cricket_figure: { type: Number, default: 0.0 }, 
    cricket_toss: { type: Number, default: 0.0 }, 
    cricket_tie: { type: Number, default: 0.0 }, 


    football_amount: { type: Number, default: 0.0 },
    football_set_amount: { type: Number, default: 0.0 },

    tennis_amount: { type: Number, default: 0.0 },   
    horserace_amount: { type: Number, default: 0.0 }, 
    grayhound_amount: { type: Number, default: 0.0 }, 
    betfairgames_amount: { type: Number, default: 0.0 },
    teenpati_studio_amount: { type: Number, default: 0.0 },
    galaxy_casino_amount: { type: Number, default: 0.0 }, 
    world_casino_amount: { type: Number, default: 0.0 },

    created_timestamp: { type: Number, default: 0.0},   
    created_date: { type: Date, required: true, default: Date.now, index: true }, 
     
  },
  {
    collection: "bz_bt_punter_trans_summary",
    versionKey: false,
    strict: true,
  }
);

module.exports = mongoose.model(
  "PunterTransSummary",
  BtPunterTransSummarySchema
);
