const mongoose = require('mongoose');
const { Schema } = mongoose;

const betlockByMarketSchema = new Schema(
  {
    master_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    bettor_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cat_mid: {
      type: String,
      required: true,
      index: true
    },
    lock_type: {
      type: Number,
      required: true,
      comment: '0 = all, 1 = selected'
    },
    market_type: {
      type: Number,
      required: true,
      comment: '0 = matchodd, 1 = othermarket'
    },
    // comma-separated user ID's
    selected_users: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_date',
      updatedAt: 'updated_date'
    },
    versionKey: false,
    collection: 'betlock_bymarket'
  }
);

module.exports = mongoose.model('BetlockByMarket', betlockByMarketSchema);
