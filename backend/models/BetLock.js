const mongoose = require('mongoose');
const { Schema } = mongoose;

const BetLockSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Punter',
      required: true
    },
    lock_by: {
      type: Schema.Types.ObjectId,
      ref: 'Punter',
      required: true
    },
    casino_tp_studio:    { type: Number, required: true, default: 1 },
    casino_royal_casino: { type: Number, required: true, default: 1 },
    casino_star:         { type: Number, required: true, default: 1 },
    casino_supernowa:    { type: Number, required: true, default: 1 },
    casino_betfair:      { type: Number, required: true, default: 1 },
    cric_matchodd:       { type: Number, required: true, default: 1 },
    cric_fancy:          { type: Number, required: true, default: 1 },
    cric_toss:           { type: Number, required: true, default: 1 },
    cric_tie:            { type: Number, required: true, default: 1 },
    cric_even_odd:       { type: Number, required: true, default: 1 },
    cric_figure:         { type: Number, required: true, default: 1 },
    cric_cup:            { type: Number, required: true, default: 1 },
    greyh_australia:     { type: Number, required: true, default: 1 },
    greyh_britain:       { type: Number, required: true, default: 1 },
    greyh_newzealand:    { type: Number, required: true, default: 1 },
    hrace_dubai:         { type: Number, required: true, default: 1 },
    hrace_australia:     { type: Number, required: true, default: 1 },
    hrace_bahrain:       { type: Number, required: true, default: 1 },
    hrace_france:        { type: Number, required: true, default: 1 },
    hrace_england:       { type: Number, required: true, default: 1 },
    hrace_ireland:       { type: Number, required: true, default: 1 },
    hrace_newzealand:    { type: Number, required: true, default: 1 },
    hrace_sweden:        { type: Number, required: true, default: 1 },
    hrace_singapore:     { type: Number, required: true, default: 1 },
    hrace_america:       { type: Number, required: true, default: 1 },
    hrace_africa:        { type: Number, required: true, default: 1 },
    soccer_matchodd:     { type: Number, required: true, default: 1 },
    soccer_over_under:   { type: Number, required: true, default: 1 },
    tennis_matchodd:     { type: Number, required: true, default: 1 }
  },
  {
    collection: 'bet_lock',
    timestamps: {
      createdAt: 'created_date',
      updatedAt: 'updated_date'
    }
  }
);

module.exports = mongoose.model('BetLock', BetLockSchema);
