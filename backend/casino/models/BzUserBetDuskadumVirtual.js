var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzUserBetDuskadumVirtualSchema = new Schema({
  sno: { type: Number, required: true },
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

  rnr3: { type: String, required: true },
  rnr3sid: { type: String, required: true },
  rnr3s: { type: Number, required: true },

  rnr4: { type: String, required: true },
  rnr4sid: { type: String, required: true },
  rnr4s: { type: Number, required: true },

  rnr5: { type: String, required: true },
  rnr5sid: { type: String, required: true },
  rnr5s: { type: Number, required: true },

  rnr6: { type: String, required: true },
  rnr6sid: { type: String, required: true },
  rnr6s: { type: Number, required: true },

  rnr7: { type: String, required: true },
  rnr7sid: { type: String, required: true },
  rnr7s: { type: Number, required: true },

  rnr8: { type: String, required: true },
  rnr8sid: { type: String, required: true },
  rnr8s: { type: Number, required: true },

  rnr9: { type: String, required: true },
  rnr9sid: { type: String, required: true },
  rnr9s: { type: Number, required: true },

  rnr10: { type: String, required: true },
  rnr10sid: { type: String, required: true },
  rnr10s: { type: Number, required: true },

  lockamt: { type: Number, required: true },
  winamt: { type: Number, required: true },
  stmp: { type: Date, default: Date.now },
  stld: { type: Number, default: 0 },
  typeMain: { type: Number, default: 1 }
}, {
  collection: 'bz_user_bet_duskadum_virtual'
});

bzUserBetDuskadumVirtualSchema.index({ sno: 1 }, { unique: true });
bzUserBetDuskadumVirtualSchema.index({ uname: 1 });
bzUserBetDuskadumVirtualSchema.index({ cat_mid: 1 });
bzUserBetDuskadumVirtualSchema.index({ cat_mid: 1, stld: 1 });

module.exports = mongoose.model('BzUserBetDuskadumVirtual', bzUserBetDuskadumVirtualSchema);
