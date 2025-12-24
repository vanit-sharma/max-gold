const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExposureSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter", // linked with punter id
      required: true
    },
    master_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter", // linked with punter id
      required: true
    },
    sharing_exp_amount: {
      type: Number,
      required: true,
      default: 0
    },
    cat_mid: {
      type: String,
      required: true
    },
    market_type: {
      type: String,
      required: true
    },
    game_type: {
      type: Number,
      required: false
    },
    sharing: {
      type: Number,
      required: true
    },
    isSettled: {
      type: Number, // 0 = false, 1 = true
      enum: [0, 1],
      default: 0
    },
    user_role: {
      type: Number,
      required: true
    },
    runnername: {
      type: String,
      required: false
    },
    event_name: {
      type: String,
      required: false,
      default: ""
    },
    sid: {
      type: String,
      required: false,
      default: ""
    },
    parent_catmid: {
      type: String,
      required: false,
      default: ""
    },
    bet_type: {
      type: String,
      required: false,
      default: ""
    }
  },
  {
    collection: "exposure",
    timestamps: true // adds createdAt, updatedAt
  }
);

module.exports = mongoose.model("Exposure", ExposureSchema);
