var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzUserBetTpRace17VirtualHistorySchema = new Schema({
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
  type: { type: String, required: true },
  rate: { type: Number, required: true },
  amnt: { type: Number, required: true },
  pro: { type: Number, required: true },
  lib: { type: Number, required: true },
  stmp: { type: Date, default: Date.now },
  cla: { type: Number, required: true },
  result_status: { type: Number, required: true } // 1-win, 2-loss
}, {
  collection: 'bz_user_bet_tp_race17_virtual_history'
});

bzUserBetTpRace17VirtualHistorySchema.index({ tid: 1 }, { unique: true });
bzUserBetTpRace17VirtualHistorySchema.index({ uname: 1 });
bzUserBetTpRace17VirtualHistorySchema.index({ cat_mid: 1 });

module.exports = mongoose.models.BzUserBetTpRace17VirtualHistory || mongoose.model('BzUserBetTpRace17VirtualHistory', bzUserBetTpRace17VirtualHistorySchema);
