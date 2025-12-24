var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BzUserBetTp32cardsVirtualSchema = new Schema(
  {
    sno: { type: Number, required: true, unique: true, index: true },
    uname: { type: String, required: true, index: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    cat_mid: { type: String, required: true, index: true },
    rnr1: { type: String, required: true },
    rnr1sid: { type: String, required: true },
    rnr1s: { type: Number, required: true },
    rnr2: { type: String, required: true },
    rnr2sid: { type: String, required: true },
    rnr2s: { type: Number, required: true },
    rnr3: { type: String, required: true },
    rnr3sid: { type: String, required: true },
    rnr3s: { type: Number, required: true },
    rnr4: { type: String, required: true },
    rnr4sid: { type: String, required: true },
    rnr4s: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    winamt: { type: Number, required: true },
    stmp: { type: Date, required: true, default: Date.now },
    stld: { type: Number, required: true, default: 0 }
  },
  { collection: 'bz_user_bet_tp_32cards_virtual' }
);

module.exports = mongoose.model('BzUserBetTp32cardsVirtual', BzUserBetTp32cardsVirtualSchema);
