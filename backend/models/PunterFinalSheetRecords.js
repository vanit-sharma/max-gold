const mongoose = require("mongoose");

const PunterFinalSheetRecordsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter", default: null },
    my_share_amount: { type: Number, default: 0 },
    upline_share_amount: { type: Number, default: 0 },
    updated_date: { type: Date, default: null },
    type: { type: String, default: "f", maxlength: 20, trim: true },
    settled_date: { type: Date, default: null },
    remark: { type: String, default: "", maxlength: 100, trim: true },
    txt_remark: { type: String, default: null, maxlength: 200, trim: true },
  },
  { timestamps: false, collection: "punter_finalsheet_records" }
);

// module.exports = mongoose.model("PunterFinalSheetRecords", PunterFinalSheetRecordsSchema);
module.exports = mongoose.models.PunterFinalSheetRecords || mongoose.model('PunterFinalSheetRecords', PunterFinalSheetRecordsSchema);
