const mongoose = require('mongoose');

const CatEvtsFancySchema = new mongoose.Schema(
  {
    evt_id: { type: Number, required: true, index: true },
    mid_mid: {
      type: String,
      required: true,
      unique: true,
      maxlength: 25,
      trim: true
    },
    mid_typ: { type: String, required: true, maxlength: 20, trim: true },
    mid_nam: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true,
      index: true
    },
    mid_ir: { type: String, required: true },
    mid_ir_f: { type: String, required: true },
    mid_stat: { type: String, required: true, maxlength: 20, trim: true },
    mid_st: { type: Date, required: true, default: Date.now },
    mid_inp: { type: Number, required: true },
    mid_rnr: { type: Number, required: true },
    stld: { type: Number, required: true, default: 0, index: true },
    display_status: { type: Number, required: true },
    overs: { type: String, required: true },
    a_overs: { type: String, required: true },
    fwicket: { type: String, required: true },
    plname: { type: String, required: true },
    score: { type: Number, required: true, default: 0 },
    score_f: { type: Number, required: true, default: 0 },
    inn: { type: Number, required: true },
    sortcol: { type: Number, required: true },
    perover: { type: String, required: true },
    f_type: { type: Number, required: true, default: 1 },
    counter: { type: Number, required: true, default: 0 },
    not_settle: { type: Number, required: true },
    line_mid: { type: String, required: true },
    section_id: { type: Number, default: null },
    min_limit: { type: Number, default: null },
    max_limit: { type: Number, default: null },
    is_bf: { type: Number, default: 0 },
    event_name: { type: String, required: false }
  },
  {
    collection: "cat_evts_fancy"
  }
);

CatEvtsFancySchema.index({ evt_id: 1, stld: 1, mid_stat: 1 });

module.exports = mongoose.model('CatEvtsFancy', CatEvtsFancySchema);