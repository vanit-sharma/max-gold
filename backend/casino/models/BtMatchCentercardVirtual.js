var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var btMatchCentercardVirtualSchema = new Schema({
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
  lockamt: { type: Number, required: true },
  winamt: { type: Number, required: true },
  stmp: { type: Date, default: Date.now },
  stld: { type: Number, default: 0 }
}, {
  collection: 'bt_match_centercard_virtual'
});

btMatchCentercardVirtualSchema.index({ sno: 1 }, { unique: true });
btMatchCentercardVirtualSchema.index({ uname: 1 });
btMatchCentercardVirtualSchema.index({ cat_mid: 1 });
btMatchCentercardVirtualSchema.index({ stld: 1 });

module.exports = mongoose.model('BtMatchCentercardVirtual', btMatchCentercardVirtualSchema);
