var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var betDuskadumVirtualSchema = new Schema({
  id: { type: Number, required: true },
  evt_id: { type: String, required: true },
  evt_evt: { type: String, required: true },
  evt_od: { type: Date, required: true },
  evt_close_date: { type: Date, required: true },

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
  cat_sid7: { type: String, required: true },
  cat_rnr7: { type: String, required: true },
  cat_sid8: { type: String, required: true },
  cat_rnr8: { type: String, required: true },
  cat_sid9: { type: String, required: true },
  cat_rnr9: { type: String, required: true },
  cat_sid10: { type: String, required: true },
  cat_rnr10: { type: String, required: true },

  evt_status: { type: String, required: true },
  result: { type: String, required: true },
  resultPairA: { type: String, required: true },
  resultPairB: { type: String, required: true },

  game_type: { type: Number, required: true },
  left_time: { type: String, required: true },

  stld: { type: Number, default: 0 },
  stld_pair: { type: Number, default: 0 },

  b1: { type: Number, required: true },
  l1: { type: Number, required: true },
  b2: { type: Number, required: true },
  l2: { type: Number, required: true },
  pairA: { type: Number, required: true },
  pairB: { type: Number, required: true },

  j1: { type: String, required: true },
  ac1: { type: String, required: true },
  ac2: { type: String, required: true },
  ac3: { type: String, required: true },
  bc1: { type: String, required: true },
  bc2: { type: String, required: true },
  bc3: { type: String, required: true },

  cards_desc: { type: String, required: true },

  suspend1: { type: Number, required: true },
  suspend2: { type: Number, required: true },
  suspend3: { type: Number, required: true },
  suspend4: { type: Number, required: true },

  update_at: { type: Date, default: Date.now },
  counter: { type: Number, default: 0 },
  is_bet_place: { type: Number, default: 0 }
}, {
  collection: 'bet_duskadum_virtual'
});

betDuskadumVirtualSchema.index({ id: 1 }, { unique: true });
betDuskadumVirtualSchema.index({ evt_od: 1 });
betDuskadumVirtualSchema.index({ cat_mid: 1 });
betDuskadumVirtualSchema.index({ evt_status: 1 });

module.exports = mongoose.model('BetDuskadumVirtual', betDuskadumVirtualSchema);
