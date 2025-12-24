const mongoose = require("mongoose");
const { Schema } = mongoose;

const PunterFinalsheetSchema = new Schema(
  {
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true,
    },
    child_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true,
    },
    share_amount: {
      type: Schema.Types.Decimal128,
      default: null,
    },
    win_amount: {
      type: Schema.Types.Decimal128,
      default: null,
    },
    updated_date: {
      type: Date,
      default: null,
    },
    type: {
      type: String,
      default: "f",
      maxlength: 20,
    },
  },
  {
    collection: "punter_finalsheet",
    versionKey: false,
  }
);

module.exports = mongoose.model("PunterFinalsheet", PunterFinalsheetSchema);