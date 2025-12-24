const mongoose = require("mongoose");

const UserLogsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    linkid: {
      type: String,
      required: true,
      index: true,
    },
    ptrans: {
      type: String,
      required: true,
    },
    otrans: {
      type: String,
      required: false,
    },
    points: {
      type: String,
      required: true,
    },
    obal: {
      type: String,
      required: true,
    },
    uname: {
      type: String,
      required: true,
      index: true,
    },
    ptype: {
      type: String,
      required: true,
    },
    cname: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  {
    collection: "user_logs",
    versionKey: false,
  }
);

module.exports = mongoose.model("UserLogs", UserLogsSchema);
