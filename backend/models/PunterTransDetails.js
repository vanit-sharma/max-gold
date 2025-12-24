const mongoose = require("mongoose");
const { Schema } = mongoose;

const BtPunterTransDetailSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: false,
      index: true
    },
    type: { type: Number, required: true, index: true },
    payment_type: { type: Number, required: true, default: 0 },
    remark: { type: String, required: false, maxlength: 500 },
    cat_mid: { type: String, required: false, index: true },
    evt_id: { type: String, required: false },
    amount: { type: Number, required: true },
    sharing: { type: String, required: false, maxlength: 10 },
    before_balance: { type: Number, required: false },
    after_balance: { type: Number, required: false },
    game_type: { type: Number, required: false, index: true },
    market_type: { type: Number, required: false, index: true },
    summary_id: { type: Schema.Types.ObjectId, required: false, index: true },
    child_user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: false,
      index: true
    },
    player_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: false,
      index: true
    },
    tid: { type: Number, required: false },
    win_amount: { type: Number, required: false },
    created_date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    reference_id: { type: String, required: true, default: "0", index: true },
    bettor_c: { type: Number, default: 0.0 },
    bettor_d: { type: Number, default: 0.0 },
    master_c: { type: Number, default: 0.0 },
    master_d: { type: Number, default: 0.0 },
    smaster_c: { type: Number, default: 0.0 },
    smaster_d: { type: Number, default: 0.0 },
    admin_c: { type: Number, default: 0.0 },
    admin_d: { type: Number, default: 0.0 },
    sadmin_c: { type: Number, default: 0.0 },
    sadmin_d: { type: Number, default: 0.0 },
    company_c: { type: Number, default: 0.0 },
    company_d: { type: Number, default: 0.0 },
    scompany_c: { type: Number, default: 0.0 },
    scompany_d: { type: Number, default: 0.0 },
    owner_c: { type: Number, default: 0.0 },
    owner_d: { type: Number, default: 0.0 },
    comm_amount: { type: Number, default: 0.0 },
    voided: { type: Number, required: true, default: 0 },
    uname: { type: String, required: false },
    event_name: { type: String, required: false },
    win_amount: { type: Number, required: false }
  },
  {
    collection: "bz_bt_punter_trans_details",
    versionKey: false,
    strict: true
  }
);

module.exports = mongoose.model(
  "PunterTransDetails",
  BtPunterTransDetailSchema
);
