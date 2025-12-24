var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzUserBetTpCasinowarVirtualHistorySchema = new Schema({
  tid: { type: Number, required: true },
  uname: { type: String, required: true },
  user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
  cat_mid: { type: String, required: true },
  rnr: { type: String, required: true },
  rnrsid: { type: String, required: true },
  rnr_val: { type: Number, required: true },
  type: { type: String, required: true },
  rate: { type: Number, required: true },
  amnt: { type: Number, required: true },
  pro: { type: Number, required: true },
  lib: { type: Number, required: true },
  stmp: { type: Date, default: Date.now },
  cla: { type: Number, required: true },
  stld: { type: Number, required: true },
  result_status: { type: Number, required: true }
}, {
  collection: 'bz_user_bet_tp_casinowar_virtual_history'
});

bzUserBetTpCasinowarVirtualHistorySchema.index({ tid: 1 }, { unique: true });
bzUserBetTpCasinowarVirtualHistorySchema.index({ uname: 1 });
bzUserBetTpCasinowarVirtualHistorySchema.index({ cat_mid: 1 });

module.exports = mongoose.model('BzUserBetTpCasinowarVirtualHistory', bzUserBetTpCasinowarVirtualHistorySchema);