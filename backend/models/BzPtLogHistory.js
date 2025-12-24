const mongoose = require("mongoose");

const bzPtLogHistorySchema = new mongoose.Schema(
  {
    uname: { type: String, required: true, maxlength: 200, trim: true },
    cat_mid: { type: String, required: false, maxlength: 255, trim: true },
    linkid: { type: String, required: true },
    points: { type: String, required: true, maxlength: 50, trim: true },
    type: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: false, collection: "bz_pt_log_history" }
);

module.exports = mongoose.model("BzPtLogHistory", bzPtLogHistorySchema);
