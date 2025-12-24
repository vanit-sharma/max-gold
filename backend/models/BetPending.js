const mongoose = require('mongoose');

const BetPendingSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    index: true
  },
  cat_mid: {
    type: String
  },
  rnr: {
    type: String
  },
  rnrsid: {
    type: String
  },
  type: {
    type: String
  },
  rate: {
    type: Number
  },
  live_rate: {
    type: Number
  },
  bet_amount: {
    type: Number
  },
  profit: {
    type: Number
  },
  liability: {
    type: Number
  },
  creation_date: {
    type: Date,
    default: () => Date.now()
  },
  ip: {
    type: String
  },
  bet_status: {
    type: Number,
    index: true
  },
  comments: {
    type: String
  },
  status_change_date: {
    type: Date
  },
  status_change_by: {
    type: Number,
    index: true
  },
  bet_id: {
    type: Number,
    index: true
  },
  runner_name: {
    type: String
  },
  event_name: {
    type: String
  },
  game_type: {
    type: Number,
    index: true
  },
  pending_bet_amount: {
    type: Number,
    default: 0.00
  },
  before_main_balance: {
    type: Number
  },
  before_exposure_balance: {
    type: Number
  },
  cancelled_bet_request: {
    type: Number,
    default: 0
  },
  cancelled_bet_request_time: {
    type: Date
  },
  market_type: {
    type: String
  },
  user_rate: {
    type: Number
  },
  event_id: {
    type: Number
  },
  rnr_type: {
    type: String
  }
}, {
  collection: 'bet_pending',
  versionKey: false,
  id: false
});

// compound indexes (if desired)
// BetPendingSchema.index({ user_id: 1 });
// BetPendingSchema.index({ bet_status: 1 });
// BetPendingSchema.index({ status_change_by: 1 });
// BetPendingSchema.index({ bet_id: 1 });
// BetPendingSchema.index({ game_type: 1 });

module.exports = mongoose.model('BetPending', BetPendingSchema);
