const mongoose = require("mongoose");

const bzPtRecordSchema = new mongoose.Schema(
  {
    from: { type: String, required: true, maxlength: 50, trim: true },
    to: { type: String, required: true, maxlength: 50, trim: true },
    point: { type: Number, required: true },
    type: { type: String, required: true, maxlength: 100, trim: true },
    remark: { type: String, required: true, maxlength: 100, trim: true },
    match: { type: String, default: null, maxlength: 100, trim: true },
    stmp: { type: Date, required: true, default: Date.now },
    lock_amt: { type: String, default: null, maxlength: 10, trim: true },
    win_amt: { type: String, default: null, maxlength: 10, trim: true },
    balance: { type: Number, required: true },
    f_id: { type: String, required: false, maxlength: 500, trim: true },
    rnr_nam: { type: String, default: "-", maxlength: 255, trim: true },
    typ: { type: Number, default: 0 },
    remark2: { type: String, required: true, maxlength: 100, trim: true },
    loginId: { type: String, required: true, maxlength: 255, trim: true },
    ipadd: { type: String, required: false, maxlength: 100, trim: true },
    user_added: { type: Number, default: 0 },
    commission: { type: Number, required: false },
    commission_percentage: { type: String, required: false, maxlength: 10, trim: true },
    game_type: { type: Number, required: false },
    reff_id: { type: Number, required: false },
    market_type: { type: String, required: false, maxlength: 100, trim: true },
    summary_id: { type: Number, default: null },
    bet_place_date: { type: Date, default: null },
    result_value: { type: String, required: false, maxlength: 100, trim: true },
    is_virtual: { type: Number, default: 0 },
    virtual_game_name: { type: Number, default: 0 },
    virtual_market_type: { type: String, required: false, maxlength: 100, trim: true },
    is_voided: { type: Number, default: 0 },
  },
  { timestamps: false, collection: "bz_pt_records" }
);

module.exports =
  mongoose.models.BzPtRecord || mongoose.model("BzPtRecord", bzPtRecordSchema);
