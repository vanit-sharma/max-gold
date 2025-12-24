const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BzRollDiceRatesSchema = new Schema({
  evt_id: { type: Number, required: true },
  evt_evt: { type: String, required: true },
  evt_od: { type: Date, required: true },
  evt_close_date: { type: Date, required: true },

  // Betting values
  b1: { type: Number, required: true },
  b2: { type: Number, required: true },
  b3: { type: Number, required: true },
  b4: { type: Number, required: true },
  b5: { type: Number, required: true },
  b6: { type: Number, required: true },
  b7: { type: Number, required: true },
  b8: { type: Number, required: true },
  b9: { type: Number, required: true },
  b10: { type: Number, required: true },
  b11: { type: Number, required: true },
  b12: { type: Number, required: true },

  // Category and runner IDs
  cat_sid1: { type: Number, default: 1 },
  cat_rnr1: { type: String, required: true },
  cat_sid2: { type: Number, default: 2 },
  cat_rnr2: { type: String, required: true },
  cat_sid3: { type: Number, default: 3 },
  cat_rnr3: { type: String, required: true },
  cat_sid4: { type: Number, default: 4 },
  cat_rnr4: { type: String, required: true },
  cat_sid5: { type: Number, default: 5 },
  cat_rnr5: { type: String, required: true },
  cat_sid6: { type: Number, default: 6 },
  cat_rnr6: { type: String, required: true },
  cat_sid7: { type: Number, default: 7 },
  cat_rnr7: { type: String, required: true },
  cat_sid8: { type: Number, default: 8 },
  cat_rnr8: { type: String, required: true },
  cat_sid9: { type: Number, default: 9 },
  cat_rnr9: { type: String, required: true },
  cat_sid10: { type: Number, default: 10 },
  cat_rnr10: { type: String, required: true },
  cat_sid11: { type: Number, default: 11 },
  cat_rnr11: { type: String, required: true },
  cat_sid12: { type: Number, default: 12 },
  cat_rnr12: { type: String, required: true },

  evt_status: { type: String, required: true },
  result: { type: String, required: true },
  result2: { type: String, required: true },
  result_total: { type: String, required: true },
  left_time: { type: String, required: true },

  stld: { type: Number, default: 0 },

  // Suspend flags
  suspend1: { type: Number, default: 0 },
  suspend2: { type: Number, default: 0 },
  suspend3: { type: Number, default: 0 },
  suspend4: { type: Number, default: 0 },
  suspend5: { type: Number, default: 0 },
  suspend6: { type: Number, default: 0 },
  suspend7: { type: Number, default: 0 },
  suspend8: { type: Number, default: 0 },
  suspend9: { type: Number, default: 0 },
  suspend10: { type: Number, default: 0 },
  suspend11: { type: Number, default: 0 },
  suspend12: { type: Number, default: 0 },

  updated_at: { type: Date, required: true },
  tmp_result: { type: Number, required: true },
  tmp_result2: { type: Number, required: true },
  is_bet_place: { type: Number, default: 0 }
}, {
  timestamps: false,
  collection: 'bz_roll_dice_rates'
});

// Optional indexes (same as SQL keys)
BzRollDiceRatesSchema.index({ evt_id: 1 });
BzRollDiceRatesSchema.index({ result: 1 });
BzRollDiceRatesSchema.index({ result_total: 1 });
BzRollDiceRatesSchema.index({ evt_status: 1 });
BzRollDiceRatesSchema.index({ stld: 1 });

module.exports = mongoose.model('BzRollDiceRates', BzRollDiceRatesSchema);
