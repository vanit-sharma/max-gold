const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BzHeadTailRatesSchema = new Schema({
  evt_id: { type: Number, required: true, index: true },
  evt_evt: { type: String, required: true },            
  evt_od: { type: Date, required: true },               
  evt_close_date: { type: Date, required: true },       

  b1: { type: Number, required: true },                 
  b2: { type: Number, required: true },                 

  cat_sid1: { type: Number, required: true, default: 1 },
  cat_rnr1: { type: String, required: true },           
  cat_sid2: { type: Number, required: true, default: 2 },
  cat_rnr2: { type: String, required: true },           

  evt_status: { type: String, required: true, index: true }, 
  result: { type: String, required: true, index: true },     
  left_time: { type: String, required: true },               

  stld: { type: Number, required: true, default: 0, index: true },
  suspend1: { type: Number, required: true, default: 0 },
  suspend2: { type: Number, required: true, default: 0 },

  updated_at: { type: Date, required: true, default: Date.now },

  tmp_result: { type: Number, required: true, default: 0 },
  tmp_result2: { type: Number, required: true, default: 0 },

  is_bet_place: { type: Number, required: true, default: 0 }
}, {
  collection: 'bz_head_tail_rates',
  timestamps: false
});


module.exports = mongoose.model('BzHeadTailRate', BzHeadTailRatesSchema);