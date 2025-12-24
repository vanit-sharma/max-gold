var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var btMatchCentercardVirtualOtherSchema = new Schema({
  uname: { type: String, required: true },
  user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
  mid_mid: { type: String, required: true },
  rnr_nam: { type: String, required: true },
  rnr_sid: { type: String, required: true },
  mid_stat: { type: String, required: true },
  bak: { type: Number, required: true },
  lay: { type: Number, required: true },
  lockamt: { type: Number, required: true },
  evt_id: { type: String, required: true },
  stmp: { type: Date, default: Date.now },
  stld: { type: Number, default: 0 }
}, {
  collection: 'bt_match_centercard_virtual_other'
});

btMatchCentercardVirtualOtherSchema.index({ uname: 1 });
btMatchCentercardVirtualOtherSchema.index({ mid_mid: 1 });
btMatchCentercardVirtualOtherSchema.index({ stld: 1 });

module.exports = mongoose.model('BtMatchCentercardVirtualOther', btMatchCentercardVirtualOtherSchema);
