var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BzAviatorBethistorySchema = new Schema({
tid: { type: Number, required: true, unique: true },
uname: { type: String, required: true },
user_id: { type: Number, required: true },
game_type: { type: Number, required: true, default: 1 },
cat_mid: { type: String, required: true },
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
}, { collection: 'bz_aviator_bethistory' });

BzAviatorBethistorySchema.index({ uname: 1 });
BzAviatorBethistorySchema.index({ cat_mid: 1 });
BzAviatorBethistorySchema.index({ user_id: 1 });

module.exports = mongoose.model('BzAviatorBethistory', BzAviatorBethistorySchema, 'bz_aviator_bethistory');