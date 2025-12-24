var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lastdigitBetdetailsSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    runner_name: { type: String, required: true },
    lastdigit_id: { type: String, required: true },
    cat_mid: { type: String, required: true },
    lastdigit_betid: { type: mongoose.Schema.Types.ObjectId, required: true },
    bet_number: { type: String, required: true },
    bet_amount: { type: Number, required: true },
    win_amount: { type: Number, required: true },
    market_type: { type: String, required: true, default: "m" },
    odd: { type: Number, required: true },
    creation_date: { type: Date, default: Date.now },
    settled: { type: Number, required: false, default: 0 },
    settled_date: { type: Date, default: Date.now, required: false },
    is_void: { type: Number, default: 0 },
    is_loss: { type: Number, default: 0 },
    result_number: { type: String, required: false, default: "" },
    event_name: { type: String, required: false, default: "" }
  },
  {
    collection: "lastdigit_betdetails"
  }
);

lastdigitBetdetailsSchema.index({ user_id: 1 });
lastdigitBetdetailsSchema.index({ lastdigit_betid: 1 });

module.exports = mongoose.model('LastdigitBetdetails', lastdigitBetdetailsSchema);