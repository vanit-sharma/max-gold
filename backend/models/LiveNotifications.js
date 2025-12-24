const mongoose = require("mongoose");

const LiveNotificationsSchema = new mongoose.Schema(
  {
    evt_id: {
      type: String,
      required: true,
    },
    game_type: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    created_on: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
  },
  {
    collection: "live_notifications",
    versionKey: false,
  }
);

module.exports = mongoose.model("LiveNotifications", LiveNotificationsSchema);
