const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BzAviatorxMatchSchema = new Schema({
  sno: { type: Number, required: false, index: true },
  uname: { type: String, required: true, index: true },
  user_id: { type: Number, required: true, default: 0, index: true },
  game_type: { type: Number, required: true, default: 1 },
  mid_mid: { type: String, required: true, index: true },
  rnr_nam: { type: String, required: true },
  rnr_sid: { type: String, required: true },
  mid_stat: { type: String, required: true },
  rate: { type: String, required: true },
  bak: { type: Number, required: true },
  lay: { type: Number, required: true },
  lockamt: { type: Number, required: true },
  evt_id: { type: String, required: true },
  stmp: { type: Date, required: true, default: Date.now },
  stld: { type: Number, required: true, default: 0, index: true },
  bet_type: { type: String, required: true },
  fee: { type: Number, required: true },
  contract_money: { type: Number, required: true },
  delivery: { type: Number, required: true },
  result_status: { type: Number, required: true },
  result_data: { type: Schema.Types.Mixed, default: null }
}, {
  collection: 'bz_aviatorx_match',
  versionKey: false
});

module.exports = mongoose.model('BzAviatorxMatch', BzAviatorxMatchSchema);