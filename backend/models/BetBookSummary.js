const mongoose = require('mongoose');

const { Schema } = mongoose;

const BetBookSummarySchema = new Schema(
  {
    bet_summary_id: { type: Schema.Types.ObjectId, index: true },

    summary_cat_mid: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true
    },

    // Link to User
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    runner_sid: { type: Number, trim: true, maxlength: 15 },

    bet_runner_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    lock_amount: { type: Number, default: undefined }, // matches NULL default
    amount: { type: Number, default: undefined },

    // these will be populated by timestamps (see schema options below)
    // creation_date: Date,
    // updation_date: Date,

    is_bet_win: { type: String, required: true, trim: true, maxlength: 20 },

    is_settled: { type: Number, required: true, default: 0, min: 0 },

    jt_rate: { type: String, trim: true, maxlength: 200 },

    calc_amt: {
      type: Number,
      default: 0
    }
  },
  {
    collection: "bet_book_summary",
    timestamps: { createdAt: "creation_date", updatedAt: "updation_date" }
  }
);

// BetBookSummarySchema.index({ user_id: 1 });
// BetBookSummarySchema.index({ bet_summary_id: 1 });
// BetBookSummarySchema.index({ summary_cat_mid: 1 });

module.exports = mongoose.model('BetBookSummary', BetBookSummarySchema);