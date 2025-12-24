var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBetMatchLucky7GalaxySchema = new Schema({
  uname: {
    type: String,
    required: true
  },
  user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
  mid_mid: {
    type: String,
    required: true
  },
  rnr_nam: {
    type: String,
    required: true
  },
  rnr_sid: {
    type: String,
    required: true
  },
  mid_stat: {
    type: String,
    required: true
  },
  bak: {
    type: Number,
    required: true
  },
  lay: {
    type: Number,
    required: true
  },
  lockamt: {
    type: Number,
    required: true
  },
  evt_id: {
    type: String,
    required: true
  },
  stmp: {
    type: Date,
    default: Date.now
  },
  stld: {
    type: Number,
    default: 0
  }
}, {
  collection: 'bz_bet_match_lucky7_galaxy'
});

module.exports = mongoose.model('BzBetMatchLucky7Galaxy', bzBetMatchLucky7GalaxySchema);
