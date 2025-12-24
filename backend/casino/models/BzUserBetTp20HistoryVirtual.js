var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzUserBetTp20HistoryVirtualSchema = new Schema({
  tid: { type: Number, required: true },
  user_id: { type: Number, required: true },
  uname: { type: String, required: true, maxlength: 50, trim: true },
  cat_mid: { type: String, required: true, maxlength: 500, trim: true },
  rnr: { type: String, required: true, maxlength: 255, trim: true },
  rnrsid: { type: String, required: true, maxlength: 500, trim: true },
  type: { type: String, required: true, maxlength: 100, trim: true },
  rate: { type: Number, required: true },
  amnt: { type: Number, required: true },
  pro: { type: Number, required: true },
  lib: { type: Number, required: true },
  stmp: { type: Date, default: Date.now, required: true },
  cla: { type: Number, required: true },
  typeMain: { type: Number, required: true },
  stld: { type: Number, required: true },
  result_status: { type: Number, required: true }
}, {
  collection: 'bz_user_bet_tp_20_history_virtual'
});

bzUserBetTp20HistoryVirtualSchema.index({ tid: 1 }, { unique: true });
bzUserBetTp20HistoryVirtualSchema.index({ uname: 1 });
bzUserBetTp20HistoryVirtualSchema.index({ cat_mid: 1 });

module.exports = mongoose.model('BzUserBetTp20HistoryVirtual', bzUserBetTp20HistoryVirtualSchema);
