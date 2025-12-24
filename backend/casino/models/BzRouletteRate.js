var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BzRouletteRateSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  evt_id: { type: Number, required: true },
  evt_evt: { type: String, required: true },
  evt_od: { type: Date, required: true },
  evt_close_date: { type: Date, required: true },
  b1: { type: Number, required: true },
  b2: { type: Number, required: true },
  b3: { type: Number, required: true },
  cat_sid1: { type: Number, required: true, default: 1 },
  cat_rnr1: { type: String, required: true },
  cat_sid2: { type: Number, required: true, default: 2 },
  cat_rnr2: { type: String, required: true },
  evt_status: { type: String, required: true },
  result: { type: String, required: true },
  left_time: { type: String, required: true },
  stld: { type: Number, required: true, default: 0 },
  suspend1: { type: Number, required: true, default: 0 },
  suspend2: { type: Number, required: true, default: 0 },
  updated_at: { type: Date, required: true },
  tmp_result: { type: Number, required: true },
  tmp_result2: { type: Number, required: true },
  is_bet_place: { type: Number, required: true, default: 0 }
}, { collection: 'bz_roulette_rates' });

BzRouletteRateSchema.index({ evt_id: 1 });
BzRouletteRateSchema.index({ result: 1 });
BzRouletteRateSchema.index({ evt_status: 1 });
BzRouletteRateSchema.index({ stld: 1 });

module.exports = mongoose.model('BzRouletteRate', BzRouletteRateSchema, 'bz_roulette_rates');