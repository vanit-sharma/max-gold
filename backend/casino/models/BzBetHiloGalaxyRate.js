var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBetHiloGalaxyRateSchema = new Schema({
  evt_id: { type: String, required: true },
  evt_evt: { type: String, required: true },
  evt_od: { type: Date, required: true },
  evt_close_date: { type: Date, required: true },
  cat_mid: { type: Number, required: true },
  cat_sid1: { type: String, required: true },
  cat_rnr1: { type: String, required: true },
  cat_sid2: { type: String, required: true },
  cat_rnr2: { type: String, required: true },
  cat_sid3: { type: String, required: true },
  cat_rnr3: { type: String, required: true },
  evt_status: { type: String, required: true },
  result: { type: String, required: true }, // 1-High,2-Low,3-Tie
  c1: { type: String, required: true },
  c2: { type: String, required: true },
  game_type: { type: Number, required: true },
  left_time: { type: String, required: true },
  stld: { type: Number, default: 0 },
  stld_1: { type: Number, default: 0 },
  b1: { type: Number, required: true },
  l1: { type: Number, required: true },
  b2: { type: Number, required: true },
  l2: { type: Number, required: true },
  b3: { type: Number, required: true },
  l3: { type: Number, required: true },
  cards_desc: { type: String, required: true },
  ac1: { type: String, required: true },
  ac2: { type: String, required: true },
  ac3: { type: String, required: true },
  bc1: { type: String, required: true },
  bc2: { type: String, required: true },
  bc3: { type: String, required: true },
  suspend1: { type: Number, required: true },
  suspend2: { type: Number, required: true },
  suspend3: { type: Number, required: true },
  update_at: { type: Date, default: Date.now },
  counter: { type: Number, default: 0 },
  diamond_id: { type: String, required: true },
  temp_result: { type: Number, required: true },
  count: { type: Number, required: true },
  is_bet_place: { type: Number, default: 0 }
}, { 
  collection: 'bz_bet_hilo_galaxy_rate'
});


bzBetHiloGalaxyRateSchema.index({ evt_od: 1 });
bzBetHiloGalaxyRateSchema.index({ cat_mid: 1 });
bzBetHiloGalaxyRateSchema.index({ evt_status: 1 });
bzBetHiloGalaxyRateSchema.index({ game_type: 1 });
bzBetHiloGalaxyRateSchema.index({ evt_status: 1, stld: 1 });
bzBetHiloGalaxyRateSchema.index({ result: 1 });
bzBetHiloGalaxyRateSchema.index({ c1: 1 });
bzBetHiloGalaxyRateSchema.index({ c2: 1 });
bzBetHiloGalaxyRateSchema.index({ diamond_id: 1 });
bzBetHiloGalaxyRateSchema.index({ ac1: 1 });
bzBetHiloGalaxyRateSchema.index({ ac2: 1 });
bzBetHiloGalaxyRateSchema.index({ ac3: 1 });
bzBetHiloGalaxyRateSchema.index({ bc1: 1 });
bzBetHiloGalaxyRateSchema.index({ bc2: 1 });
bzBetHiloGalaxyRateSchema.index({ bc3: 1 });
bzBetHiloGalaxyRateSchema.index({ stld_1: 1 });
bzBetHiloGalaxyRateSchema.index({ evt_status: 1, stld_1: 1 });

module.exports = mongoose.model('BzBetHiloGalaxyRate', bzBetHiloGalaxyRateSchema);