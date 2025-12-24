const mongoose = require('mongoose')
const { Schema } = mongoose

const UserBetLockSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Punter',
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    lock_by: {
      type: Number,
      required: true
    },
    create_date: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    collection: 'user_bet_lock',
    id: true
  }
)

module.exports = mongoose.model('UserBetLock', UserBetLockSchema)
