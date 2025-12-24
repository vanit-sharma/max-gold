const mongoose = require("mongoose");


const PunterShareSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    master_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    sharing: { type: Number },
    sharing_role: { type: Number } // or String if you really want "80"
  },
  { _id: false } // don’t create extra _id for each share
);

const BtMatchEvenOddSchema = new mongoose.Schema(
  {
    uname: { type: String, required: true, maxlength: 50, index: true },
    mid_mid: { type: String, required: true, maxlength: 120, index: true },
    cat_mid: { type: String, required: true, maxlength: 100, index: true },
    rnr_nam: { type: String, required: true, maxlength: 40 },
    mid_stat: { type: String, required: false, maxlength: 20, index: true },
    rnr_sid: { type: String, required: true, index: true },
    bak: { type: Number, required: true },
    lay: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    stmp: { type: Date, required: true, default: Date.now },
    mid_name: { type: String, maxlength: 60 },
    evt_id: { type: Number, required: true, index: true },
    b_nam: { type: String, required: true, maxlength: 120 },
    ov: { type: String, required: false, maxlength: 11 },
    stld: { type: Number, required: true, default: 0, index: true },
    team: { type: String, required: false },
    jackpot_team: { type: String, required: false },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    punterSharing: { type: [PunterShareSchema], default: [] }
  },
  {
    collection: "bt_match_evenodd",
    versionKey: false
  }
);

BtMatchEvenOddSchema.index({ mid_stat: 1, evt_id: 1 });
BtMatchEvenOddSchema.index({ mid_stat: 1, stmp: 1, evt_id: 1, stld: 1 });
BtMatchEvenOddSchema.index({ uname: 1, evt_id: 1, rnr_nam: 1, b_nam: 1 });

module.exports = mongoose.model("BtMatchEvenOdd", BtMatchEvenOddSchema);
