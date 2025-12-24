const mongoose = require("mongoose");
const ShareSchema = new mongoose.Schema(
  {
    user_sno: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    uname: { type: String },
    user_role: { type: Number },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      default: null,
    },
    sharing: { type: Number }, // or String if you really want "80"
  },
  { _id: false } // don’t create extra _id for each share
);

const PunterSchema = new mongoose.Schema(
  {
    company_id: { type: Number },
    fname: { type: String },
    uname: { type: String, required: true, unique: true }, // username
    passpin: { type: String },
    user_role: { type: Number },
    bz_balance: { type: Number, default: 0 },
    opin_bal: { type: Number, default: 0 },
    credit_amount: { type: Number, default: 0 },
    credit_reference: { type: Number, default: 0 },
    bonus_wallet: { type: Number, default: 0 },
    my_sharing: { type: Number },
    parent_sharing: { type: Number },
    total_pl: { type: Number, default: 0 },
    transaction_pl: { type: Number, default: 0 },
    upline_balance: { type: Number, default: 0 },
    total_comm: { type: Number, default: 0 },
    total_casino_pl: { type: Number, default: 0 },
    total_vcasino_pl: { type: Number, default: 0 },
    commission: { type: Number, default: 2 },
    sponsor: { type: String },
    sponser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    email: { type: String },
    full_chain: { type: String, default: "" },
    transaction_pass: { type: Number },
    stat: { type: Number, enum: [0, 1], default: 1 }, // status
    bet_status: { type: Number, enum: [0, 1], default: 1 },
    mobno: { type: String },
    joining: { type: Date, default: Date.now },
    Updated: { type: Date },
    ip_address: { type: String },
    last_login: { type: Date },
    show_password: { type: Number, enum: [0, 1], default: 0 }, // 0,1
    currency: { type: Number, default: 1 },
    bet_delay: { type: Number, default: 5 },
    fancy_delay: { type: Number, default: 3 },
    password_change: { type: Number, enum: [0, 1], default: 0 },
    can_settled: { type: Number, enum: [0, 1], default: 0 },
    f_enable: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    c_enble: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    t_enable: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    master_sharing: { type: [ShareSchema], default: [] },
    master_full_chain: { type: String },
  },
  {
    collection: "bz_bt_punter",
  }
);

module.exports = mongoose.model("bz_bt_punter", PunterSchema);
