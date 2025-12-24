const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RollDiceMatchSchema = new Schema(
  {
    uname: { type: String, required: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    game_type: { type: Number, default: 1 },
    mid_mid: { type: String, required: true },
    rnr_nam: { type: String, required: true },
    rnr_sid: { type: String, required: true },
    mid_stat: { type: String, required: true },
    rate: { type: String, required: true },
    bak: { type: Number, required: true },
    lay: { type: Number, required: true },
    lockamt: { type: Number, required: true },
    evt_id: { type: String, required: true },
    stmp: { type: Date, default: Date.now },
    stld: { type: Number, default: 0 },
    bet_type: { type: String, required: true },
    fee: { type: Number, required: true },
    contract_money: { type: Number, required: true },
    delivery: { type: Number, required: true },
    result_status: { type: Number, required: true },
    result_data: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: false,
    collection: "rolldice_match",
  }
);

// Optional indexes (to match SQL keys)
RollDiceMatchSchema.index({ uname: 1 });
RollDiceMatchSchema.index({ mid_mid: 1 });
RollDiceMatchSchema.index({ stld: 1 });
RollDiceMatchSchema.index({ user_id: 1 });

module.exports = mongoose.model("RollDiceMatch", RollDiceMatchSchema);
