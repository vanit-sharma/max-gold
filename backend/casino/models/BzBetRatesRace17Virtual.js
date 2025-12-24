var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBetRatesRace17VirtualSchema = new Schema({
  sno: { type: Number, required: true },
  evt_id: { type: String, required: true },
  evt_evt: { type: String, required: true },
  evt_od: { type: Date, required: true },
  evt_close_date: { type: Date, required: true },
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

  result: { type: String, required: true },      // '1-Yes, 2-No'
  resultTotal: { type: Number, default: 0 },

  evt_status: { type: String, required: true },
  c1: { type: String, required: true },
  c2: { type: String, required: true },
  c3: { type: String, required: true },
  c4: { type: String, required: true },
  c5: { type: String, required: true },

  game_type: { type: Number, required: true },
  left_time: { type: String, required: true },
  stld: { type: Number, default: 0 },

  b1: { type: Number, required: true },
  l1: { type: Number, required: true },
  b2: { type: Number, required: true },
  l2: { type: Number, required: true },

  suspend1: { type: Number, required: true },
  suspend2: { type: Number, required: true },

  is_any_zero: { type: Number, default: 0 },

  update_at: { type: Date, default: Date.now },
  counter: { type: Number, default: 0 },
  diamond_id: { type: String, required: true },
  is_bet_place: { type: Number, default: 0 }
}, {
  collection: 'bz_bet_rates_race17_virtual'
});

bzBetRatesRace17VirtualSchema.index({ sno: 1 }, { unique: true });
bzBetRatesRace17VirtualSchema.index({ evt_id: 1 });
bzBetRatesRace17VirtualSchema.index({ evt_od: 1 });
bzBetRatesRace17VirtualSchema.index({ cat_mid: 1 });
bzBetRatesRace17VirtualSchema.index({ evt_status: 1 });
bzBetRatesRace17VirtualSchema.index({ game_type: 1 });
bzBetRatesRace17VirtualSchema.index({ evt_status: 1, stld: 1 });

module.exports = mongoose.models.BzBetRatesRace17Virtual || mongoose.model('BzBetRatesRace17Virtual', bzBetRatesRace17VirtualSchema);
