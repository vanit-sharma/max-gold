var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BzUserBetTp20MuflisVirtualSchema = new Schema({
  sno: { type: Number, required: true, unique: true },
  uname: { type: String, required: true },
  user_id: { type: Number, required: true },
  cat_mid: { type: String, required: true },
  rnr1: { type: String, required: true },
  rnr1sid: { type: String, required: true },
  rnr1s: { type: Number, required: true },
  rnr2: { type: String, required: true },
  rnr2sid: { type: String, required: true },
  rnr2s: { type: Number, required: true },
  lockamt: { type: Number, required: true },
  winamt: { type: Number, required: true },
  stmp: { type: Date, required: true, default: Date.now },
  stld: { type: Number, required: true, default: 0 },
  typeMain: { type: Number, required: true, default: 1 }
}, { collection: 'bz_user_bet_tp_20muflis_virtual' });

BzUserBetTp20MuflisVirtualSchema.index({ uname: 1 });
BzUserBetTp20MuflisVirtualSchema.index({ cat_mid: 1 });
BzUserBetTp20MuflisVirtualSchema.index({ cat_mid: 1, stld: 1 });
module.exports = mongoose.model('BzUserBetTp20MuflisVirtual', BzUserBetTp20MuflisVirtualSchema);