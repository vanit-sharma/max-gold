const mongoose = require('mongoose');

const bzStakeSettingsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Punter' },
  type: { type: String, enum: ['g', 'p'], required: true },
  button_value: { type: Number, required: true }
}, {
  collection: 'bz_stake_settings'
});

bzStakeSettingsSchema.index({ user_id: 1, type: 1, button_value: 1 }, { unique: true });

module.exports = mongoose.model('BzStakeSettings', bzStakeSettingsSchema);
