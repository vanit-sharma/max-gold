var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BzAaaVirtualMatchOtherSchema = new Schema({
  sno: { type: Number, required: true, unique: true },
  uname: { type: String, required: true },
  user_id: { type: Number, required: true },
  mid_mid: { type: String, required: true },
  rnr_nam: { type: String, required: true },
  rnr_sid: { type: String, required: true },
  mid_stat: { type: String, required: true },
  bak: { type: Number, required: true },
  lay: { type: Number, required: true },
  lockamt: { type: Number, required: true },
  evt_id: { type: String, required: true },
  stmp: { type: Date, required: true, default: Date.now },
  stld: { type: Number, required: true, default: 0 }
}, { collection: 'bz_aaa_virtual_match_other' });
BzAaaVirtualMatchOtherSchema.index({ uname: 1 });
BzAaaVirtualMatchOtherSchema.index({ mid_mid: 1 });
BzAaaVirtualMatchOtherSchema.index({ stld: 1 });
module.exports = mongoose.model('BzAaaVirtualMatchOther', BzAaaVirtualMatchOtherSchema);