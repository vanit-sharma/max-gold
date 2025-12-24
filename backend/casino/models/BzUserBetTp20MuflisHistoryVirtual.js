var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BzUserBetTp20MuflisHistoryVirtualSchema = new Schema({
  tid: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  uname: { type: String, required: true },
  cat_mid: { type: String, required: true },
  rnr: { type: String, required: true },
  rnrsid: { type: String, required: true },
  type: { type: String, required: true },
  rate: { type: Number, required: true },
  amnt: { type: Number, required: true },
  pro: { type: Number, required: true },
  lib: { type: Number, required: true },
  stmp: { type: Date, required: true, default: Date.now },
  cla: { type: Number, required: true },
  typeMain: { type: Number, required: true },
  stld: { type: Number, required: true },
  result_status: { type: Number, required: true }
}, { collection: 'bz_user_bet_tp_20muflis_history_virtual' });
BzUserBetTp20MuflisHistoryVirtualSchema.index({ uname: 1 });
BzUserBetTp20MuflisHistoryVirtualSchema.index({ cat_mid: 1 });
module.exports = mongoose.model('BzUserBetTp20MuflisHistoryVirtual', BzUserBetTp20MuflisHistoryVirtualSchema);
