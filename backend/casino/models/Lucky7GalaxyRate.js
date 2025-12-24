var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Lucky7GalaxyRateSchema = new Schema(
  {
    evt_id: { type: String, required: true },
    evt_evt: { type: String, required: true },
    evt_od: { type: Date, required: true },
    evt_close_date: { type: Date, required: true },
    cat_mid: { type: String, required: true },
    cat_sid1: { type: String, required: true },
    cat_rnr1: { type: String, required: true },
    cat_sid2: { type: String, required: true },
    cat_rnr2: { type: String, required: true },
    evt_status: { type: String, required: true },
    result: { type: String, required: true, maxlength: 5 },
    c1: { type: String, required: true, maxlength: 10 },
    game_type: { type: Number, required: true },
    left_time: { type: String, required: true },

    stld: { type: Number, default: 0 },
    stld_1: { type: Number, default: 0 },

    b1: Number,
    l1: Number,
    b2: Number,
    l2: Number,
    b3: Number,
    l3: Number,
    b4: Number,
    l4: Number,
    b5: Number,
    l5: Number,
    b6: Number,
    l6: Number,
    b7: Number,
    l7: Number,
    b8: Number,
    l8: Number,
    b9: Number,
    l9: Number,
    b10: Number,
    l10: Number,
    b11: Number,
    l11: Number,
    b12: Number,
    l12: Number,
    b13: Number,
    l13: Number,
    b14: Number,
    l14: Number,
    b15: Number,
    l15: Number,
    b16: Number,
    l16: Number,
    b17: Number,
    l17: Number,
    b18: Number,
    l18: Number,
    b19: Number,
    l19: Number,

    suspend1: Number,
    suspend2: Number,
    suspend3: Number,
    suspend4: Number,
    suspend5: Number,
    suspend6: Number,
    suspend7: Number,
    suspend8: Number,
    suspend9: Number,
    suspend10: Number,
    suspend11: Number,
    suspend12: Number,
    suspend13: Number,
    suspend14: Number,
    suspend15: Number,
    suspend16: Number,
    suspend17: Number,
    suspend18: Number,
    suspend19: Number,

    update_at: { type: Date, default: Date.now },
    counter: { type: Number, default: 0 },
    diamond_id: { type: String, required: true },
    temp_result: { type: Number, required: true },
    count: { type: Number, required: true },
    is_bet_place: { type: Number, default: 0 },
  },
  {
    collection: "bz_bet_lucky7_galaxy_rate",
    versionKey: false,
  }
);

Lucky7GalaxyRateSchema.index({ id: 1 });
Lucky7GalaxyRateSchema.index({ evt_od: 1 });
Lucky7GalaxyRateSchema.index({ cat_mid: 1 });
Lucky7GalaxyRateSchema.index({ evt_status: 1 });
Lucky7GalaxyRateSchema.index({ game_type: 1 });
Lucky7GalaxyRateSchema.index({ evt_status: 1, stld: 1 });
Lucky7GalaxyRateSchema.index({ result: 1 });
Lucky7GalaxyRateSchema.index({ c1: 1 });
Lucky7GalaxyRateSchema.index({ diamond_id: 1 });

module.exports = mongoose.model("Lucky7GalaxyRate", Lucky7GalaxyRateSchema);
