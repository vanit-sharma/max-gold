var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBetRatesCasinowarVirtualSchema = new Schema({
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
  cat_sid5: { type: String, required: true },
  cat_rnr5: { type: String, required: true },
  cat_sid6: { type: String, required: true },
  cat_rnr6: { type: String, required: true },
  evt_status: { type: String, required: true },
  result: { type: String, required: true },
  result_desc: { type: String, required: true },
  c1: { type: Number, required: true },
  c2: { type: Number, required: true },
  c3: { type: Number, required: true },
  c4: { type: Number, required: true },
  c5: { type: Number, required: true },
  c6: { type: Number, required: true },
  c7: { type: Number, required: true },
  game_type: { type: Number, required: true },
  left_time: { type: String, required: true },
  stld: { type: Number, default: 0 },
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
  suspend4: { type: Number, required: true },
  suspend5: { type: Number, required: true },
  suspend6: { type: Number, required: true },
  update_at: { type: Date, default: Date.now },
  counter: { type: Number, default: 0 },
  diamond_id: { type: String, required: true },
  is_bet_place: { type: Number, default: 0 }
}, {
  collection: 'bz_bet_rates_casinowar_virtual'
});

bzBetRatesCasinowarVirtualSchema.index({ sno: 1 }, { unique: true });
bzBetRatesCasinowarVirtualSchema.index({ evt_id: 1 });
bzBetRatesCasinowarVirtualSchema.index({ evt_od: 1 });
bzBetRatesCasinowarVirtualSchema.index({ cat_mid: 1 });
bzBetRatesCasinowarVirtualSchema.index({ evt_status: 1 });
bzBetRatesCasinowarVirtualSchema.index({ game_type: 1 });
bzBetRatesCasinowarVirtualSchema.index({ evt_status: 1, stld: 1 });

module.exports = mongoose.model('BzBetRatesCasinowarVirtual', bzBetRatesCasinowarVirtualSchema);