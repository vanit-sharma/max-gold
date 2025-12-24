const mongoose = require("mongoose");
const { Schema } = mongoose;

const StakeSettingsSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true,
    },
    default_stake: {
      type: Number,
      required: true,
    },
    highlight_odds: {
      type: Number,
      required: true,
      default: 0,
    },
    accept_any_odds: {
      type: Number,
      required: true,
      default: 0,
    },
    one_click: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    collection: "stake_settings",
    versionKey: false,
  }
);

module.exports = mongoose.model("StakeSetting", StakeSettingsSchema);
