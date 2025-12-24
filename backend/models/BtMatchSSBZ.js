const mongoose = require('mongoose');

const BtMatchSSBZSchema = new mongoose.Schema({
  uname:   { type: String, required: true, maxlength: 50, trim: true, index: true },
  mid_mid: { type: String, required: true, maxlength: 120, trim: true, index: true },
  cat_mid: { type: String, required: true, maxlength: 100, trim: true },
  rnr_nam: { type: String, required: true, maxlength: 40, trim: true },
  mid_stat:{ type: String, required: true, maxlength: 20, trim: true },
  rnr_sid: { type: Number, required: true, index: true },

  
  bak:     { type: Number, required: true },
  lay:     { type: Number, required: true },
  lockamt: { type: Number, required: true },

  stmp:    { type: Date, required: true, default: Date.now },
  mid_name:{ type: String, maxlength: 60, trim: true, default: null },
  evt_id:  { type: Number, required: true, index: true },
  b_nam:   { type: String, required: true, maxlength: 120, trim: true },
  ov:      { type: String, required: true, maxlength: 11, trim: true },
  stld:    { type: Number, required: true, default: 0, index: true },

  team:         { type: String, required: true },          // TEXT
  jackpot_team: { type: String, required: true },          // TEXT
  betfair_fancy:{ type: Number, required: true, default: 0 }
}, {
  collection: 'bt_match_ss_bz'
});

// BtMatchSSBZSchema.index({ uname: 1, rnr_nam: 1, evt_id: 1, b_nam: 1 });
// BtMatchSSBZSchema.index({ uname: 1, mid_mid: 1, evt_id: 1, b_nam: 1 });
// BtMatchSSBZSchema.index({ mid_stat: 1, evt_id: 1 });
// BtMatchSSBZSchema.index({ mid_stat: 1, stmp: 1, evt_id: 1, stld: 1 });
// BtMatchSSBZSchema.index({ cat_mid: 1 });

module.exports = mongoose.model('BtMatchSSBZ', BtMatchSSBZSchema);
