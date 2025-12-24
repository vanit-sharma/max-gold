var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzUserBetTp20VirtualSchema = new Schema({
  sno: { type: Number, required: true },
  uname: { type: String, required: true, maxlength: 50, trim: true, index: true },
  user_id: { type: Number, required: true },
  cat_mid: { type: String, required: true, maxlength: 500, trim: true, index: true },

  rnr1: { type: String, required: true, maxlength: 100, trim: true },
  rnr1sid: { type: String, required: true, maxlength: 100, trim: true },
  rnr1s: { type: Number, required: true },

  rnr2: { type: String, required: true, maxlength: 100, trim: true },
  rnr2sid: { type: String, required: true, maxlength: 100, trim: true },
  rnr2s: { type: Number, required: true },

  lockamt: { type: Number, required: true },
  winamt: { type: Number, required: true },

  stmp: { type: Date, default: Date.now, required: true },
  stld: { type: Number, default: 0, required: true },
  typeMain: { type: Number, default: 1, required: true } // 1 - main, 2 - pair
}, {
  collection: 'bz_user_bet_tp_20_virtual'
});

bzUserBetTp20VirtualSchema.index({ sno: 1 }, { unique: true });
bzUserBetTp20VirtualSchema.index({ cat_mid: 1, stld: 1 });

module.exports = mongoose.model('BzUserBetTp20Virtual', bzUserBetTp20VirtualSchema);
