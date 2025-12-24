const mongoose = require('mongoose');

const PunterShareSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    master_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    sharing: { type: Number },
    sharing_role: { type: Number } // or String if you really want "80"
  },
  { _id: false } // don’t create extra _id for each share
);

const BtMatchSSSchema = new mongoose.Schema(
  {
    uname: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
      index: true
    },
    mid_mid: {
      type: String,
      required: true,
      maxlength: 120,
      trim: true,
      index: true
    },
    cat_mid: { type: String, required: true, maxlength: 100, trim: true },
    rnr_nam: { type: String, required: true, maxlength: 40, trim: true },
    mid_stat: { type: String, required: false, maxlength: 20, trim: true },
    rnr_sid: { type: Number, required: true, index: true },

    bak: { type: Number, required: true },
    lay: { type: Number, required: true },
    lockamt: { type: Number, required: true },

    stmp: { type: Date, required: true, default: Date.now },
    mid_name: { type: String, maxlength: 60, trim: true, default: null },
    evt_id: { type: Number, required: true, index: true },
    b_nam: { type: String, required: true, maxlength: 500, trim: true },
    ov: { type: String, required: false, maxlength: 11, trim: true },
    stld: { type: Number, required: true, default: 0, index: true },

    team: { type: String, required: false }, // TEXT
    jackpot_team: { type: String, required: false }, // TEXT

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },

    fancy_bet_type: {
      type: String,
      required: true,
      maxlength: 20,
      trim: true,
      default: "f"
    },
    result_val: { type: String, required: false, maxlength: 100, trim: true },
    betfair_fancy: { type: Number, required: true, default: 0 },
    settled_by: { type: String, maxlength: 100, trim: true, default: null },
    event_name: { type: String, required: false },
    punterSharing: { type: [PunterShareSchema], default: [] }
  },
  {
    collection: "bt_match_ss"
  }
);


// BtMatchSSSchema.index({ cat_mid: 1 });
// BtMatchSSSchema.index({ mid_stat: 1, evt_id: 1 });
// BtMatchSSSchema.index({ mid_stat: 1, stmp: 1, evt_id: 1, stld: 1 });
// BtMatchSSSchema.index({ uname: 1, evt_id: 1, rnr_nam: 1, b_nam: 1 });

module.exports = mongoose.model('BtMatchSS', BtMatchSSSchema);
