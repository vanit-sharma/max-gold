var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BzBetRates32cardsVirtualSchema = new Schema(
  {
    sno: { type: Number, required: true, unique: true, index: true },
    evt_id: { type: String, required: true, index: true },
    evt_evt: { type: String, required: true },
    evt_od: { type: Date, required: true, index: true },
    evt_close_date: { type: Date, required: true },
    open_date: { type: Date, required: true },
    cat_mid: { type: String, required: true, index: true },
    cat_sid1: { type: String, required: true },
    cat_rnr1: { type: String, required: true },
    cat_sid2: { type: String, required: true },
    cat_rnr2: { type: String, required: true },
    cat_sid3: { type: String, required: true },
    cat_rnr3: { type: String, required: true },
    cat_sid4: { type: String, required: true },
    cat_rnr4: { type: String, required: true },
    evt_status: { type: String, required: true, index: true },
    result: { type: String, required: true },
    c1: { type: Number, required: true },
    c2: { type: Number, required: true },
    c3: { type: Number, required: true },
    c4: { type: Number, required: true },
    game_type: { type: Number, required: true, index: true },
    left_time: { type: String, required: true },
    stld: { type: Number, required: true, default: 0 },
    b1: { type: Number, required: true },
    l1: { type: Number, required: true },
    b2: { type: Number, required: true },
    l2: { type: Number, required: true },
    b3: { type: Number, required: true },
    l3: { type: Number, required: true },
    b4: { type: Number, required: true },
    l4: { type: Number, required: true },
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
    update_at: { type: Date, required: true, default: Date.now },
    counter: { type: Number, required: true, default: 0 },
    diamond_id: { type: String, required: true },
    is_bet_place: { type: Number, required: true, default: 0 }
  },
  { collection: 'bz_bet_rates_32cards_virtual' }
);

BzBetRates32cardsVirtualSchema.index({ evt_status: 1, stld: 1 });

module.exports = mongoose.model('BzBetRates32cardsVirtual', BzBetRates32cardsVirtualSchema);
