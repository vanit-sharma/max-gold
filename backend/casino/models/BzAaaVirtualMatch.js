var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BzAaaVirtualMatchSchema = new Schema({
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
  rnr3: { type: String, required: true },
  rnr3sid: { type: String, required: true },
  rnr3s: { type: Number, required: true },
  lockamt: { type: Number, required: true },
  winamt: { type: Number, required: true },
  stmp: { type: Date, required: true, default: Date.now },
  stld: { type: Number, required: true, default: 0 }
}, { collection: 'bz_aaa_virtual_match' });
BzAaaVirtualMatchSchema.index({ uname: 1 });
BzAaaVirtualMatchSchema.index({ cat_mid: 1 });
BzAaaVirtualMatchSchema.index({ stld: 1 });
module.exports = mongoose.model('BzAaaVirtualMatch', BzAaaVirtualMatchSchema);
