const mongoose = require('mongoose');


const EvenOddDetailSchema = new mongoose.Schema(
  {
    cat_mid:       { type: String, required: true, maxlength: 50,  index: true },
    evenodd_over:  { type: String, required: true, maxlength: 10 },
    evt_id:        { type: String, required: true, maxlength: 50,  index: true },
    evenodd_id:    { type: Number, required: true,                  index: true },
    team_id:       { type: String, required: true, maxlength: 50 },
    title:         { type: String, required: true, maxlength: 60 },
    inning_txt:    { type: String, required: true, maxlength: 100 },

    // 0 = SUSPENDED, 1 = OPEN, 2 = CLOSED
    status:        { type: Number, required: true, default: 0, index: true },

    back_odd:      { type: String, required: true, maxlength: 10 },
    lay_odd:       { type: String, required: true, maxlength: 10 },

    creation_date: { type: Date,   required: true },
    result:        { type: String, required: true, maxlength: 50, index: true },
    issettle:      { type: Number, required: true },
  },
  {
    collection: 'evenodd_detail',
    versionKey: false,
  }
);

module.exports = mongoose.model('EvenOddDetail', EvenOddDetailSchema);
