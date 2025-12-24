const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserBtnValueSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      maxlength: 10,
    },
    button_value: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "user_btn_values",
    versionKey: false,
  }
);

module.exports = mongoose.model("UserBtnValue", UserBtnValueSchema);
