const mongoose = require('mongoose');
const { Schema } = mongoose;

const BetfairEventsRunnerSchema = new Schema(
  {

    betfair_event_id: { type: Number, required: true, index: true },
    runner_name: { type: String, required: true, trim: true, maxlength: 200 },
    section_id: { type: Number, required: true, index: true },
    sort_priority: { type: Number, required: true, index: true },
    event_id: { type: Number, required: true },

    cat_mid: { type: String, required: true, trim: true, maxlength: 100, index: true },
    game_type: { type: Number, required: true, index: true },

    creation_date: { type: Date, required: true },

    is_winner: { type: Number, required: true, default: 0, min: 0, max: 1, index: true },
    is_settled_bet: { type: Number, required: true, default: 0, min: 0, max: 1 },
    is_removed: { type: Number, required: true, default: 0, min: 0, max: 1 },

    jockey_name: { type: String, required: true, trim: true, maxlength: 100 },
    trainer_name: { type: String, required: true, trim: true, maxlength: 100 },
    age: { type: String, required: true, trim: true, maxlength: 100 },
    weight_value: { type: String, required: true, trim: true, maxlength: 100 },
    days_since_last_run: { type: String, required: true, trim: true, maxlength: 100 },
    wearing: { type: String, required: true, trim: true, maxlength: 100 },

    colours_filename: { type: String, trim: true, maxlength: 200, default: null },
  },
  {
    collection: 'bz_betfair_events_runner',
    timestamps: { createdAt: 'creation_date', updatedAt: false },
  }
);

module.exports = mongoose.model('BetfairEventsRunner', BetfairEventsRunnerSchema);
