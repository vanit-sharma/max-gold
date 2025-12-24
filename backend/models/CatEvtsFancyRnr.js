const mongoose = require('mongoose');

const CatEvtsFancyRnrSchema = new mongoose.Schema({
  evt_id:   { type: Number, required: true, maxlength: 25, trim: true, index: true },
  mid_mid:  { type: String, required: true, maxlength: 25, trim: true, index: true },
  rnr_nam:  { type: String, required: true, maxlength: 255, trim: true, index: true },
  mid_stat: { type: String, required: true, maxlength: 100, trim: true },
  rnr_sid:  { type: String, required: true, maxlength: 100, trim: true, index: true },

  bak: { type: Number, required: true },
  lay: { type: Number, required: true },

  bakrate: { type: Number, required: true },
  layrate: { type: Number, required: true },


  stmp: { type: Date, required: true, default: Date.now },

  is_bf_fancy: { type: Number, default: 0 }
}, {
  collection: 'cat_evts_fancy_rnr'
});

module.exports = mongoose.model('CatEvtsFancyRnr', CatEvtsFancyRnrSchema);
