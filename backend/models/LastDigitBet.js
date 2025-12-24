var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const PunterShareSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    master_id: { type: mongoose.Schema.Types.ObjectId, ref: "Punter" },
    sharing: { type: Number },
    sharing_role: { type: Number } // or String if you really want "80"
  },
  { _id: false } // don’t create extra _id for each share
);

var lastDigitBetSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true
    },
    lastdigit_id: { type: String, required: true },
    rnr_name: { type: String, required: true },
    num_0: { type: Number, required: true },
    num_1: { type: Number, required: true },
    num_2: { type: Number, required: true },
    num_3: { type: Number, required: true },
    num_4: { type: Number, required: true },
    num_5: { type: Number, required: true },
    num_6: { type: Number, required: true },
    num_7: { type: Number, required: true },
    num_8: { type: Number, required: true },
    num_9: { type: Number, required: true },
    cat_mid: { type: String, required: true },
    evt_name: { type: String, required: false },
    uname: { type: String, required: false },
    team_name: { type: String, required: true },
    bet_number: { type: String, required: true },
    market_type: { type: String, required: true, default: "m" },
    lock_amt: { type: Number, required: true },
    win_amt: { type: Number, required: true },
    create_date: { type: Date, required: true },
    stld: { type: Number, required: false, default: 0 },
    stld_date: { type: Date, required: false },
    punterSharing: { type: [PunterShareSchema], default: [] }
  },
  {
    collection: "last_digit_bet"
  }
);

lastDigitBetSchema.index({ id: 1 }, { unique: true });
lastDigitBetSchema.index({ user_id: 1 });
lastDigitBetSchema.index({ lastdigit_id: 1 });
lastDigitBetSchema.index({ cat_mid: 1 });
lastDigitBetSchema.index({ bet_number: 1 });

module.exports = mongoose.model("LastDigitBet", lastDigitBetSchema);
