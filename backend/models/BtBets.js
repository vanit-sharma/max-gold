const mongoose = require('mongoose');

const btBetsSchema = new mongoose.Schema(
  {
    uname: {
      type: String,
      required: true,
      maxlength: 50
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    cat_mid: {
      type: String,
      required: true,
      maxlength: 100
    },
    evt_id: {
      type: Number,
      default: null
    },
    rnr: {
      type: String,
      required: true,
      maxlength: 255
    },
    rnrsid: {
      type: String,
      required: true,
      maxlength: 50
    },
    type: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    amnt: {
      type: Number,
      required: true
    },
    pro: {
      type: Number,
      required: true
    },
    lib: {
      type: Number,
      required: true
    },
    inplay: {
      type: String,
      required: true,
      maxlength: 4
    },
    stmp: {
      type: Date,
      required: true,
      default: Date.now
    },
    mid_stat: {
      type: String,
      maxlength: 15,
      default: null
    },
    cla: {
      type: Number,
      required: true
    },
    m_nam: {
      type: String,
      required: false
    },
    bet_type: {
      type: String,
      required: true,
      maxlength: 50
    },
    is_loss: {
      type: Boolean,
      default: false
    },
    is_settled: {
      type: Number,
      default: 0
    },
    bet_summery_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    section: {
      type: String,
      maxlength: 200,
      default: null
    },
    is_cashout_bet: {
      type: Number,
      required: false
    },
    ip_address: {
      type: String,
      required: true,
      maxlength: 100
    },
    team1_book: {
      type: String,
      required: true,
      maxlength: 100
    },
    team2_book: {
      type: String,
      required: true,
      maxlength: 100
    },
    team3_book: {
      type: String,
      required: true,
      maxlength: 100
    },
    after_bet_balance: {
      type: String,
      required: true,
      maxlength: 100
    },
    bet_market_type: {
      type: String,
      required: true,
      maxlength: 100
    },
    book_lock_amount: {
      type: String,
      required: false,
      maxlength: 100
    },
    g_type: {
      type: Number,
      required: true,
      default: 0
    },
    parent_cat_mid: {
      type: String,
      required: false,
      maxlength: 100
    },
    session_size: {
      type: String,
      required: false,
      maxlength: 100
    },
    b1: {
      type: String,
      required: false,
      maxlength: 50
    },
    l1: {
      type: String,
      required: false,
      maxlength: 50
    },
    b2: {
      type: String,
      required: false,
      maxlength: 50
    },
    l2: {
      type: String,
      required: false,
      maxlength: 50
    },
    b3: {
      type: String,
      required: false,
      maxlength: 50
    },
    l3: {
      type: String,
      required: false,
      maxlength: 50
    },
    bet_game_type: {
      type: Number,
      default: null
    },
    is_void: {
      type: Number,
      default: 0
    },
    is_pending_bet: {
      type: Number,
      default: 0
    },
    bf_bets: {
      type: Number,
      required: true,
      default: 0
    },
    user_bet_rate: {
      type: String,
      maxlength: 50,
      default: null
    },
    api_response: {
      type: String,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    bet_device: {
      type: String,
      maxlength: 1500,
      default: null
    },
    event_name: {
      type: String,
      maxlength: 5000,
      default: null
    }
  },
  {
    collection: "bt_bets",
    versionKey: false
  }
);

// Indexes
// btBetSchema.index({ tid: 1 });
// btBetSchema.index({ cat_mid: 1 });
// btBetSchema.index({ uname: 1 });
// btBetSchema.index({ evt_id: 1 });
// btBetSchema.index({ rnrsid: 1 });
// btBetSchema.index({ bet_type: 1 });
// btBetSchema.index({ bet_summery_id: 1 });

module.exports = mongoose.model('BtBets', btBetsSchema);