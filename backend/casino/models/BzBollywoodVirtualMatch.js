var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBollywoodVirtualMatchSchema = new Schema({
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

  lockamt: { type: Number, required: true },
  winamt: { type: Number, required: true },
  stmp: { type: Date, default: Date.now },
  stld: { type: Number, default: 0 }
}, {
  collection: 'bz_bollywood_virtual_match'
});

bzBollywoodVirtualMatchSchema.index({ sno: 1 }, { unique: true });
bzBollywoodVirtualMatchSchema.index({ uname: 1 });
bzBollywoodVirtualMatchSchema.index({ cat_mid: 1 });
bzBollywoodVirtualMatchSchema.index({ stld: 1 });

module.exports = mongoose.model('BzBollywoodVirtualMatch', bzBollywoodVirtualMatchSchema);
