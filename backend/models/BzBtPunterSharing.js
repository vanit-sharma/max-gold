const mongoose = require("mongoose");
const { Schema } = mongoose;

const BzBtPunterSharingSchema = new Schema(
  {
    user_role: {
      type: Number,
      required: true,
      index: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Punter",
    },
    child_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Punter",
    },
    parent_percentage: {
      type: String,
      required: true,
      maxlength: 100,
    },
    child_percentage: {
      type: String,
      required: true,
      maxlength: 100,
    },
    total_percentage: {
      type: String,
      required: true,
      maxlength: 100,
    },
    created_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updated_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "bz_bt_punter_sharing",
    versionKey: false,
  }
);

BzBtPunterSharingSchema.pre("save", function (next) {
  this.updated_date = new Date();
  next();
});

module.exports = mongoose.model("BzBtPunterSharing", BzBtPunterSharingSchema);
