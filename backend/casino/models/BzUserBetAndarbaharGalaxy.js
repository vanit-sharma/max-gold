var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bzUserBetAndarbaharGalaxySchema = new Schema(
  {
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
    stld: { type: Number, default: 0 },
    typeMain: { type: Number, default: 1 },
  },
  {
    collection: "bz_user_bet_andarbahar_galaxy",
  }
);

bzUserBetAndarbaharGalaxySchema.index({ sno: 1 }, { unique: true });
bzUserBetAndarbaharGalaxySchema.index({ uname: 1 });
bzUserBetAndarbaharGalaxySchema.index({ cat_mid: 1 });
bzUserBetAndarbaharGalaxySchema.index({ cat_mid: 1, stld: 1 });

module.exports = mongoose.model(
  "BzUserBetAndarbaharGalaxy",
  bzUserBetAndarbaharGalaxySchema
);
