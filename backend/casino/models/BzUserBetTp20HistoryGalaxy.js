var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bzUserBetTp20HistoryGalaxySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    uname: { type: String, required: true },
    cat_mid: { type: String, required: true },
    rnr: { type: String, required: true },
    rnrsid: { type: String, required: true },
    type: { type: String, required: true },
    rate: { type: Number, required: true },
    amnt: { type: Number, required: true },
    pro: { type: Number, required: true },
    lib: { type: Number, required: true },
    stmp: { type: Date, default: Date.now },
    cla: { type: Number, required: true },
    typeMain: { type: Number, required: true },
    stld: { type: Number, required: true },
    market_type: { type: String, required: true },
    result_status: { type: Number, required: true },
  },
  {
    collection: "bz_user_bet_tp_20_history_galaxy",
  }
);

bzUserBetTp20HistoryGalaxySchema.index({ uname: 1 });
bzUserBetTp20HistoryGalaxySchema.index({ cat_mid: 1 });

module.exports = mongoose.model(
  "BzUserBetTp20HistoryGalaxy",
  bzUserBetTp20HistoryGalaxySchema
);
