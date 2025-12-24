var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BzUserBetTp32cardsVirtualHistorySchema = new Schema(
  {
    tid: { type: Number, required: true, unique: true, index: true },
    uname: { type: String, required: true, index: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    cat_mid: { type: String, required: true, index: true },
    rnr: { type: String, required: true },
    rnrsid: { type: String, required: true },
    type: { type: String, required: true },
    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },
    stmp: { type: Date, required: true, default: Date.now },
    cla: { type: Number, required: true },
    result_status: { type: Number, required: true }
  },
  { collection: 'bz_user_bet_tp_32cards_virtual_history' }
);

module.exports = mongoose.model('BzUserBetTp32cardsVirtualHistory', BzUserBetTp32cardsVirtualHistorySchema);
