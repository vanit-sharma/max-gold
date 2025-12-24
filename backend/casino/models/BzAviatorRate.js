const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BzAviatorRateSchema = new Schema({
id: { type: Number, required: true, unique: true },
evt_id: { type: Number, required: true },
evt_evt: { type: String, required: true },
evt_od: { type: Date, required: true },
evt_close_date: { type: Date, required: true },
b1: { type: Number, required: true },
cat_sid1: { type: Number, required: true, default: 1 },
cat_rnr1: { type: String, required: true },
evt_status: { type: String, required: true },
result: { type: String, required: true },
left_time: { type: String, required: true },
game_time: { type: String, required: true },
stld: { type: Number, required: true, default: 0 },
suspend1: { type: Number, required: true, default: 0 },
updated_at: { type: Date, required: true },
start: { type: Number, required: true },
end: { type: Number, required: true },
is_bet_place: { type: Number, required: true, default: 0 }
}, { collection: 'bz_aviator_rates' });

BzAviatorRateSchema.index({ evt_id: 1 });
BzAviatorRateSchema.index({ result: 1 });
BzAviatorRateSchema.index({ evt_status: 1 });
BzAviatorRateSchema.index({ stld: 1 });

module.exports = mongoose.model('BzAviatorRate', BzAviatorRateSchema, 'bz_aviator_rates');