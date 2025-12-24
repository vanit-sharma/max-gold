const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BzAviatorxBethistorySchema = new Schema({
  tid: { type: Number, required: false, index: true },
  uname: { type: String, required: true, index: true },
  user_id: { type: Number, required: true, index: true },
  game_type: { type: Number, required: true, default: 1 },
  cat_mid: { type: String, required: true, index: true },
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
  bet_type: { type: String, required: true },
  fee: { type: Number, required: true },
  contract_money: { type: Number, required: true },
  delivery: { type: Number, required: true }
}, {
  collection: 'bz_aviatorx_bethistory',
  versionKey: false
});

module.exports = mongoose.model('BzAviatorxBethistory', BzAviatorxBethistorySchema);