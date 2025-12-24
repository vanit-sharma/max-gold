var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzUserBetTpRace17VirtualSchema = new Schema({
  uname: { type: String, required: true },
  user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
  cat_mid: { type: String, required: true },

  rnr1: { type: String, required: true },
  rnr1sid: { type: String, required: true },
  rnr1s: { type: Number, required: true },

  rnr2: { type: String, required: true },
  rnr2sid: { type: String, required: true },
  rnr2s: { type: Number, required: true },

  winamt: { type: Number, required: true },
  lockamt: { type: Number, required: true },

  stmp: { type: Date, default: Date.now },
  stld: { type: Number, default: 0 },
  market_type: { type: Number, default: 0 }
}, {
  collection: 'bz_user_bet_tp_race17_virtual'
});

bzUserBetTpRace17VirtualSchema.index({ sno: 1 }, { unique: true });
bzUserBetTpRace17VirtualSchema.index({ uname: 1 });
bzUserBetTpRace17VirtualSchema.index({ cat_mid: 1 });

module.exports = mongoose.model('BzUserBetTpRace17Virtual', bzUserBetTpRace17VirtualSchema);
