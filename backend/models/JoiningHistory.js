const mongoose = require('mongoose');
const { Schema } = mongoose;

const JoiningHistorySchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Punter',
    required: true,
    index: true
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  for_user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Punter',
    required: true,
    index: true
  }
}, {
  collection: 'joining_history',
  versionKey: false
});

module.exports = mongoose.model('JoiningHistory', JoiningHistorySchema);
