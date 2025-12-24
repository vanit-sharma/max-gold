const mongoose = require('mongoose');

const MatchBzSchema = new mongoose.Schema({
  cat_mid: {
    type: String,
    required: true,
    index: true
  },
  uname: {
    type: String,
    required: true,
    index: true
  },
  user_id: {
    type: String,
    required: true
  },
  rnr1: {
    type: String,
    required: true
  },
  rnr1sid: {
    type: Number,
    required: true
  },
  rnr1s: {
    type: Number,
    required: true
  },
  rnr2: {
    type: String,
    required: true
  },
  rnr2sid: {
    type: Number,
    required: true
  },
  rnr2s: {
    type: Number,
    required: true
  },
  rnr3: {
    type: String,
    required: true
  },
  rnr3sid: {
    type: Number,
    required: true
  },
  rnr3s: {
    type: Number,
    required: true
  },
  lockamt: {
    type: Number,
    required: true
  },
  winamt: {
    type: Number,
    required: true,
    default: 0.00
  },
  stmp: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  market_type: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  collection: 'bt_match_bz',
  versionKey: false,
  id: false
});

// compound index on (cat_mid, uname)
MatchBzSchema.index({ cat_mid: 1, uname: 1 });

module.exports = mongoose.model('MatchBz', MatchBzSchema);
