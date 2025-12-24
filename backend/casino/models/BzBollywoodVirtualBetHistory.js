var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBollywoodVirtualBetHistorySchema = new Schema({
  tid: { type: Number, required: true },
  uname: { type: String, required: true },
  user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
  cat_mid: { type: String, required: true },
  rnr: { type: String, required: true },
  sid: { type: Number, required: true },
  rnrsid: { type: String, required: true },
  type: { type: String, required: true },
  rate: { type: Number, required: true },
  amnt: { type: Number, required: true },
  pro: { type: Number, required: true },
  lib: { type: Number, required: true },
  stmp: { type: Date, default: Date.now },
  cla: { type: Number, required: true }
}, {
  collection: 'bz_bollywood_virtual_bet_history'
});

bzBollywoodVirtualBetHistorySchema.index({ tid: 1 }, { unique: true });
bzBollywoodVirtualBetHistorySchema.index({ uname: 1 });
bzBollywoodVirtualBetHistorySchema.index({ cat_mid: 1 });

module.exports = mongoose.model('BzBollywoodVirtualBetHistory', bzBollywoodVirtualBetHistorySchema);