const mongoose = require('mongoose');
const { Schema } = mongoose;

const betLimitSchema = new Schema(
  {
    // FK users collection 
    user_id: { type: Schema.Types.ObjectId, ref: 'Punter', required: true, index: true },

    //per-sport stake ceilings & floors
    soccer_min:    { type: Number, default: 100 },
    soccer:        { type: Number, default: 1_000_000 },

    tennis_min:    { type: Number, default: 100 },
    tennis:        { type: Number, default: 250_000 },

    cricket_min:   { type: Number, default: 100 },
    cricket:       { type: Number, default: 5_000_000 },

    fancy_min:     { type: Number, default: 100 },
    fancy:         { type: Number, default: 200_000 },

    hrace_min:     { type: Number, default: 100 },
    hrace:         { type: Number, default: 200_000 },

    casino:        { type: Number, default: 50_000 },

    greyhound_min: { type: Number, default: 100 },
    greyhound:     { type: Number, default: 50_000 },

    bookMaker_min: { type: Number, default: 100 },
    bookMaker:     { type: Number, default: 2_000_000 },

    virtual_min:   { type: Number, default: 100 },
    virtual:       { type: Number, required: true },

    toss_min:      { type: Number, default: 100 },
    toss:          { type: Number, required: true },

    tie_min:       { type: Number, default: 100 },
    tie:           { type: Number, required: true },

    evenodd_min:   { type: Number, default: 100 },
    evenodd:       { type: Number, default: 100_000 },

    figure_min:    { type: Number, default: 100 },
    figure:        { type: Number, default: 100_000 },

    //exposure limits
    soccer_exp:    { type: Number, default: 500_000 },
    tennis_exp:    { type: Number, default: 500_000 },
    cricket_exp:   { type: Number, default: 500_000 },
    fancy_exp:     { type: Number, default: 500_000 },
    hrace_exp:     { type: Number, default: 500_000 },
    greyhound_exp: { type: Number, default: 500_000 },
    bookMaker_exp: { type: Number, default: 500_000 },
    virtual_exp:   { type: Number, default: 500_000 },
    toss_exp:      { type: Number, default: 500_000 },
    tie_exp:       { type: Number, default: 500_000 },
    evenodd_exp:   { type: Number, default: 500_000 },
    figure_exp:    { type: Number, default: 500_000 }
  },
  {
    timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
    collection: 'bet_limit'
  }
);

module.exports = mongoose.model('BetLimit', betLimitSchema);