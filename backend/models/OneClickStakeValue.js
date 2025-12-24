const mongoose = require("mongoose");
const { Schema } = mongoose;

const OneClickStakeValueSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true,
    },
    stake: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "one_click_stake_value",
    versionKey: false,
  }
);

module.exports = mongoose.model("OneClickStakeValue", OneClickStakeValueSchema);
