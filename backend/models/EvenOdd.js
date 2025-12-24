// models/evenodd.js
const mongoose = require("mongoose");

const EvenOddSchema = new mongoose.Schema(
  {
    cat_mid: { type: String, required: true, maxlength: 50, index: true },
    evt_id: { type: String, required: true, maxlength: 50, index: true },
    total_over: { type: String, required: true, maxlength: 20 },
    start_over: { type: String, required: true, maxlength: 20 },
    teamname: { type: String, required: true, maxlength: 200 },
    status: { type: Number, required: true, index: true },
    create_date: { type: Date, required: true },
  },
  {
    collection: "evenodd", // keep table/collection name aligned
    versionKey: false,
  }
);

module.exports = mongoose.model("EvenOdd", EvenOddSchema);
