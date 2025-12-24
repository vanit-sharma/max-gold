const mongoose = require("mongoose");

const LogsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "wallet-update",
        "login",
        "logout",
        "sports",
        "casino",
        "bet-status",
      ],
    },

    narration: {
      type: String,
      required: true,
      maxlength: 255,
    },

    ip: {
      type: String,
      required: true,
      maxlength: 151,
    },

    device: {
      type: String,
      required: true,
      maxlength: 151,
    },

    created_on: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
  },
  {
    collection: "logs",
    versionKey: false,
  }
);

module.exports = mongoose.model("Logs", LogsSchema);
