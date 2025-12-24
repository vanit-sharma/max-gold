var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BzAaaVirtualBetHistorySchema = new Schema({
  tid: { type: Number, required: true, unique: true },
  uname: { type: String, required: true },
  user_id: { type: Number, required: true },
  cat_mid: { type: String, required: true },
  rnr: { type: String, required: true },
  sid: { type: Number, required: true },
  rnrsid: { type: String, required: true },
  type: { type: String, required: true },
  rate: { type: Number, required: true },
  amnt: { type: Number, required: true },
  pro: { type: Number, required: true },
  lib: { type: Number, required: true },
  stmp: { type: Date, required: true, default: Date.now },
  cla: { type: Number, required: true },
  result_status: { type: Number, required: true }
}, { collection: 'bz_aaa_virtual_bet_history' });
BzAaaVirtualBetHistorySchema.index({ uname: 1 });
BzAaaVirtualBetHistorySchema.index({ cat_mid: 1 });
module.exports = mongoose.model('BzAaaVirtualBetHistory', BzAaaVirtualBetHistorySchema);