var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzUserBetTpHighcardVirtualHistorySchema = new Schema({
  tid: { type: Number, required: true },
  uname: { type: String, required: true },
  user_id: { type: Number, required: true },
  cat_mid: { type: String, required: true },
  rnr: { type: String, required: true },
  rnrsid: { type: String, required: true },
  type: { type: String, required: true },
  rate: { type: Number, required: true },
  amnt: { type: Number, required: true },
  pro: { type: Number, required: true },
  lib: { type: Number, required: true },
  stmp: { type: Date, default: Date.now },
  cla: { type: Number, required: true },
  result_status: { type: Number, required: true }
}, {
  collection: 'bz_user_bet_tp_highcard_virtual_history'
});

bzUserBetTpHighcardVirtualHistorySchema.index({ tid: 1 }, { unique: true });
bzUserBetTpHighcardVirtualHistorySchema.index({ uname: 1 });
bzUserBetTpHighcardVirtualHistorySchema.index({ cat_mid: 1 });

module.exports = mongoose.model('BzUserBetTpHighcardVirtualHistory', bzUserBetTpHighcardVirtualHistorySchema);
