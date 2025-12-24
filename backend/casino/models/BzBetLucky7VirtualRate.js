var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBetLucky7VirtualRateSchema = new Schema({
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
  result: { type: String, required: true },
  c1: { type: String, required: true },
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
  b4: { type: Number, required: true },
  l4: { type: Number, required: true },
  b5: { type: Number, required: true },
  l5: { type: Number, required: true },
  b6: { type: Number, required: true },
  l6: { type: Number, required: true },
  b7: { type: Number, required: true },
  l7: { type: Number, required: true },
  b8: { type: Number, required: true },
  l8: { type: Number, required: true },
  b9: { type: Number, required: true },
  l9: { type: Number, required: true },
  b10: { type: Number, required: true },
  l10: { type: Number, required: true },
  b11: { type: Number, required: true },
  l11: { type: Number, required: true },
  b12: { type: Number, required: true },
  l12: { type: Number, required: true },
  b13: { type: Number, required: true },
  l13: { type: Number, required: true },
  b14: { type: Number, required: true },
  l14: { type: Number, required: true },
  b15: { type: Number, required: true },
  l15: { type: Number, required: true },
  b16: { type: Number, required: true },
  l16: { type: Number, required: true },
  b17: { type: Number, required: true },
  l17: { type: Number, required: true },
  b18: { type: Number, required: true },
  l18: { type: Number, required: true },
  b19: { type: Number, required: true },
  l19: { type: Number, required: true },
  suspend1: { type: Number, required: true },
  suspend2: { type: Number, required: true },
  suspend3: { type: Number, required: true },
  suspend4: { type: Number, required: true },
  suspend5: { type: Number, required: true },
  suspend6: { type: Number, required: true },
  suspend7: { type: Number, required: true },
  suspend8: { type: Number, required: true },
  suspend9: { type: Number, required: true },
  suspend10: { type: Number, required: true },
  suspend11: { type: Number, required: true },
  suspend12: { type: Number, required: true },
  suspend13: { type: Number, required: true },
  suspend14: { type: Number, required: true },
  suspend15: { type: Number, required: true },
  suspend16: { type: Number, required: true },
  suspend17: { type: Number, required: true },
  suspend18: { type: Number, required: true },
  suspend19: { type: Number, required: true },
  update_at: { type: Date, default: Date.now },
  counter: { type: Number, default: 0 },
  diamond_id: { type: String, required: true },
  temp_result: { type: Number, required: true },
  count: { type: Number, required: true },
  is_bet_place: { type: Number, default: 0 }
}, {
  collection: 'bz_bet_lucky7_virtual_rate'
});

bzBetLucky7VirtualRateSchema.index({ id: 1 }, { unique: true });
bzBetLucky7VirtualRateSchema.index({ evt_od: 1 });
bzBetLucky7VirtualRateSchema.index({ cat_mid: 1 });
bzBetLucky7VirtualRateSchema.index({ evt_status: 1 });
bzBetLucky7VirtualRateSchema.index({ game_type: 1 });
bzBetLucky7VirtualRateSchema.index({ evt_status: 1, stld: 1 });
bzBetLucky7VirtualRateSchema.index({ result: 1 });
bzBetLucky7VirtualRateSchema.index({ c1: 1 });
bzBetLucky7VirtualRateSchema.index({ diamond_id: 1 });

module.exports = mongoose.model('BzBetLucky7VirtualRate', bzBetLucky7VirtualRateSchema);
