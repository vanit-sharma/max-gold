const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBtPunterMasterSharingSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Punter",
    },
    master_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Punter",
    },
    sharing: {
      type: String,
      required: true,
      maxlength: 10,
    },
    sharing_role: {
      type: Number,
      required: true,
      default: 8,
    },
    created_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "bz_bt_punter_master_sharing",
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "BzBtPunterMasterSharing",
  BzBtPunterMasterSharingSchema
);
