var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lastdigitEventSchema = new Schema({
  id: { type: Number, required: true },
  cat_mid: { type: String, required: true },
  evt_id: { type: String, required: true },
  team_name: { type: String, required: true },
  over: { type: Number, required: true },
  odd: { type: Number, required: true },
  result: { type: String, required: true },
  close_over: { type: String, required: true },
  creation_date: { type: Date, required: true },
  closed_date: { type: Date, required: true },
  status: { type: Number, default: 0 },
  IsDisplayStatus: { type: Number, default: 0 },
  is_settled: { type: Number, default: 0 },
  settled_date: { type: Date, required: true },
  is_deleted: { type: Number, default: 0 }
}, {
  collection: 'lastdigit_event'
});

lastdigitEventSchema.index({ id: 1 }, { unique: true });
lastdigitEventSchema.index({ cat_mid: 1 });
lastdigitEventSchema.index({ is_settled: 1 });

module.exports = mongoose.model('LastdigitEvent', lastdigitEventSchema);