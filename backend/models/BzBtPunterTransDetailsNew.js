const mongoose = require("mongoose");

const BzBtPunterTransDetailsNewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
      index: true,
    },
    // 1=PL, 2=Settlement, 3=Transfer/Received
    type: { type: Number, required: true },

    // 0=NA, 1=Credit, 2=Cash
    payment_type: { type: Number, required: true, default: 0 },

    remark: { type: String, required: true, maxlength: 500 },
    cat_mid: { type: String, required: false, maxlength: 100 },

    amount: { type: Number, required: true },

    // 1=Cricket,2=Football,3=Tennis,4=Horse Racing,5=GrayHound,6=WorldCasino,7=VirtualCasino,8=StarCasino
    game_type: { type: Number, required: false },

    // 0=Transfer/Received,1=Match,2=Bookmaker,3=Session,4=Toss,5=Tie,6=Figure,7=Casino,8=EvenOdd,...
    market_type: { type: Number, required: true },

    summary_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    player_id: { type: Number, required: false },
    tid: { type: Number, required: false },

    win_amount: { type: Number, required: false },

    created_date: { type: Date, required: true },

    bettor_c: { type: Number, default: 0 },
    bettor_d: { type: Number, default: 0 },
    master_c: { type: Number, default: 0 },
    master_d: { type: Number, default: 0 },
    smaster_c: { type: Number, default: 0 },
    smaster_d: { type: Number, default: 0 },
    admin_c: { type: Number, default: 0 },
    admin_d: { type: Number, default: 0 },
    sadmin_c: { type: Number, default: 0 },
    sadmin_d: { type: Number, default: 0 },
    company_c: { type: Number, default: 0 },
    company_d: { type: Number, default: 0 },
    scompany_c: { type: Number, default: 0 },
    scompany_d: { type: Number, default: 0 },
    owner_c: { type: Number, default: 0 },
    owner_d: { type: Number, default: 0 },

    chain_ids: { type: String, default: null },
  },
  {
    collection: "bz_bt_punter_trans_details_new",
    versionKey: false,
  }
);

BzBtPunterTransDetailsNewSchema.index({ cat_mid: 1 });
BzBtPunterTransDetailsNewSchema.index({ user_id: 1 });
BzBtPunterTransDetailsNewSchema.index({ summary_id: 1 });
BzBtPunterTransDetailsNewSchema.index({ game_type: 1 });
BzBtPunterTransDetailsNewSchema.index({ market_type: 1 });
BzBtPunterTransDetailsNewSchema.index({ player_id: 1 });
BzBtPunterTransDetailsNewSchema.index({ type: 1 });
BzBtPunterTransDetailsNewSchema.index({ created_date: 1 });
BzBtPunterTransDetailsNewSchema.index({ chain_ids: 1 });

BzBtPunterTransDetailsNewSchema.index({ user_id: 1, type: 1, created_date: 1 });

module.exports = mongoose.model(
  "BzBtPunterTransDetailsNew",
  BzBtPunterTransDetailsNewSchema
);
