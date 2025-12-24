const mongoose = require("mongoose");

const bzUserLoginHistorySchema = new mongoose.Schema(
  {
    uname: {
      type: String,
      required: true,
      maxlength: 20,
      index: true,
    },
    ssid: {
      type: String,
      required: true,
      maxlength: 100,
      unique: true,
    },
    ipaddr: {
      type: String,
      required: true,
      maxlength: 40,
    },
    stmp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    logon: {
      type: Number,
      required: true,
      index: true,
    },
    userAutoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Punter",
      index: true,
    },
    refUrl: {
      type: String,
      required: true,
      maxlength: 200,
    },
    site_toke: {
      type: String,
      required: true,
      maxlength: 400,
    },
    city: {
      type: String,
      required: false,
      maxlength: 200,
    },
    latitude: {
      type: String,
      required: false,
      maxlength: 100,
    },
    longitude: {
      type: String,
      required: false,
      maxlength: 100,
    },
    country: {
      type: String,
      required: false,
      maxlength: 200,
    },
    org: {
      type: String,
      required: false,
      maxlength: 200,
    },
    timezone: {
      type: String,
      required: false,
      maxlength: 100,
    },
  },
  {
    collection: "bz_user_login_history",
    versionKey: false,
  }
);

// Compound or single-field indexes as per the original table
// bzUserLoginHistorySchema.index({ uname: 1 });
// bzUserLoginHistorySchema.index({ ssid: 1 }, { unique: true });
// bzUserLoginHistorySchema.index({ userAutoId: 1 });
// bzUserLoginHistorySchema.index({ logon: 1 });

module.exports = mongoose.model("BzUserLoginHistory", bzUserLoginHistorySchema);
