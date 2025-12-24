const mongoose = require('mongoose');
const { Schema } = mongoose;

const admBetStartSchema = new Schema({
  sno:                { type: Number, required: true, unique: true, default: 1 },

  IsBettingStart:     { type: Number, default: 1 },
  IsTakeOff:          { type: Number, default: 1 },

  T20:                { type: Number, default: 1 },
  OneDay:             { type: Number, default: 1 },
  Card32:             { type: Number, default: 1 },
  AAA:                { type: Number, default: 1 },
  Card32_b:           { type: Number, default: 1 },
  SuperOver:          { type: Number, default: 1 },
  AndarBahar:         { type: Number, default: 1 },
  DraganTiger:        { type: Number, default: 1 },
  Lucky7:             { type: Number, default: 0 },
  lucky7b:            { type: Number, default: 1 },
  wroli:              { type: Number, default: 1 },
  backupStop:         { type: Number, required: true },
  StartTransfer:      { type: Number, required: true },

  video20:            { type: String, default: '' },
  video32:            { type: String, default: '' },
  videoonedy:         { type: String, default: '' },
  dragan_tiger:       { type: String, default: '' },
  Lucky7Video:        { type: String, default: '' },
  CardVideo32B:       { type: String, default: '' },

  bollywood:          { type: Number, default: 1 },
  '3card':            { type: Number, default: 1 },
  race20:             { type: Number, default: 1 },
  withdrawalStart:    { type: Number, default: 1 },
  colorgame:          { type: Number, default: 1 },
  bigsmall:           { type: Number, default: 1 },
  dragan_tiger_od:    { type: Number, default: 1 },
  auto_fancy_result:  { type: Number, default: 1 },
  lastfigure:         { type: Number, default: 1 },
  aviator:            { type: Number, default: 1 },
  rolldice:           { type: Number, default: 1 },
  head_tail:          { type: Number, default: 1 },
  roulette:           { type: Number, default: 1 },
  odd_even:           { type: Number, default: 1 },
  hilo:               { type: Number, default: 1 },

  virtual_lucky7:         { type: Number, default: 1 },
  virtual_dt:             { type: Number, default: 1 },
  virtual_tp20:           { type: Number, default: 1 },
  virtual_card32:         { type: Number, default: 1 },
  virtual_bollywood:      { type: Number, default: 1 },
  virtual_highcard:       { type: Number, default: 1 },
  virtual_casinowar:      { type: Number, default: 1 },
  virtual_aaa:            { type: Number, default: 1 },
  virtual_andarbahar:     { type: Number, default: 1 },
  virtual_tp20muflis:     { type: Number, default: 1 },
  virtual_lucky7second:   { type: Number, default: 1 },
  virtual_sicbo:          { type: Number, default: 1 },
  virtual_race17:         { type: Number, default: 1 },
  virtual_race20:         { type: Number, default: 1 },

  wheel:               { type: Number, default: 1 },

  betfair_hold:             { type: Number, default: 1 },
  betfair_turbo_hold:       { type: Number, default: 1 },
  betfair_hilo:             { type: Number, default: 1 },
  betfair_turbo_hilo:       { type: Number, default: 1 },
  betfair_blackjack:        { type: Number, default: 1 },
  betfair_turbo_blackjack:  { type: Number, default: 1 },
  betfair_omaha:            { type: Number, default: 1 },
  betfair_baccarat:         { type: Number, default: 1 },
  betfair_turbo_baccarat:   { type: Number, default: 1 },

  dream_catcher:        { type: Number, default: 1 },
  blastoff:             { type: Number, default: 1 },
  virtual_centercard:   { type: Number, default: 1 },
  aviatorx:             { type: Number, default: 1 },
  virtual_duskadum:     { type: Number, default: 1 },
  virtual_queenrace:    { type: Number, default: 1 },

  galaxy_lucky7:        { type: Number, default: 1 },
  galaxy_andarbahar:    { type: Number, default: 1 },
  galaxy_dt:            { type: Number, default: 1 },
  galaxy_tp20:          { type: Number, default: 1 },
  galaxy_hilo:          { type: Number, default: 1 },
}, {
  versionKey: false,
  collection: 'adm_bet_start'
});

module.exports = mongoose.model('AdmBetStart', admBetStartSchema);
