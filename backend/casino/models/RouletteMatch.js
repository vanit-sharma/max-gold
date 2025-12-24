var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RouletteMatchSchema = new Schema({
  sno: { type: Number, required: true, unique: true },
  uname: { type: String, required: true },
  user_id: { type: Number, required: true, default: 0 },
  game_type: { type: Number, required: true, default: 1 },
  mid_mid: { type: String, required: true },
  rnr_nam: { type: String, required: true },
  rnr_sid: { type: String, required: true },
  mid_stat: { type: String, required: true },
  rate: { type: String, required: true },
  bak: { type: Number, required: true },
  lay: { type: Number, required: true },
  lockamt: { type: Number, required: true },
  evt_id: { type: String, required: true },
  stmp: { type: Date, required: true, default: Date.now },
  stld: { type: Number, required: true, default: 0 },
  bet_type: { type: String, required: true },
  fee: { type: Number, required: true },
  contract_money: { type: Number, required: true },
  delivery: { type: Number, required: true },
  result_status: { type: Number, required: true },
  result_data: { type: Schema.Types.Mixed, default: null }
}, { collection: 'roulette_match' });

RouletteMatchSchema.index({ uname: 1 });
RouletteMatchSchema.index({ mid_mid: 1 });
RouletteMatchSchema.index({ stld: 1 });
RouletteMatchSchema.index({ user_id: 1 });

module.exports = mongoose.model('RouletteMatch', RouletteMatchSchema, 'roulette_match');