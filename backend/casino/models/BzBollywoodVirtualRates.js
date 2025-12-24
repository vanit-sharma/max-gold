var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBollywoodVirtualRatesSchema = new Schema({
  id: { type: Number, required: true },
  evt_id: { type: String, required: true },
  evt_evt: { type: String, required: true },
  evt_od: { type: Date, required: true },
  evt_close_date: { type: Date, required: true },
  cat_mid: { type: String, required: true },
  left_time: { type: Number, required: true },
  c1: { type: String, required: true },
  result: { type: String, required: true },
  evt_status: { type: String, required: true },
  stld: { type: Number, default: 0 },
  updated: { type: Date, required: true },
  diamond_id: { type: String, required: true },
  is_bet_place: { type: Number, default: 0 }
}, {
  collection: 'bz_bollywood_virtual_rates'
});

bzBollywoodVirtualRatesSchema.index({ id: 1 }, { unique: true });
bzBollywoodVirtualRatesSchema.index({ cat_mid: 1 });
bzBollywoodVirtualRatesSchema.index({ evt_id: 1 });

module.exports = mongoose.model('BzBollywoodVirtualRates', bzBollywoodVirtualRatesSchema);
