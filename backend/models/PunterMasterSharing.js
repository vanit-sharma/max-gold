// models/PunterMasterSharing.js
const mongoose = require("mongoose");

const PunterMasterSharingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Punter",
      index: true,
    },

    master_id: {
      type: Number,
      required: true,
      index: true,
    },

    sharing: {
      type: String,
      required: true,
    },

    sharing_role: {
      type: Number,
      required: true,
      default: 8,
    },

    created_date: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "bz_bt_punter_master_sharing",
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "PunterMasterSharing",
  PunterMasterSharingSchema
);
