var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var btMatchDragonTigerGalaxySchema = new Schema(
  {
    uname: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Punter",
      required: true,
    },
    cat_mid: {
      type: String,
      required: true,
    },
    rnr1: {
      type: String,
      required: true,
    },
    rnr1sid: {
      type: String,
      required: true,
    },
    rnr1s: {
      type: Number,
      required: true,
    },
    rnr2: {
      type: String,
      required: true,
    },
    rnr2sid: {
      type: String,
      required: true,
    },
    rnr2s: {
      type: Number,
      required: true,
    },
    lockamt: {
      type: Number,
      required: true,
    },
    winamt: {
      type: Number,
      required: true,
    },
    stmp: {
      type: Date,
      default: Date.now,
    },
    stld: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "bt_match_dragontiger_galaxy",
  }
);

// optional indexes (to match SQL keys)
btMatchDragonTigerGalaxySchema.index({ uname: 1 });
btMatchDragonTigerGalaxySchema.index({ cat_mid: 1 });
btMatchDragonTigerGalaxySchema.index({ stld: 1 });

module.exports = mongoose.model(
  "BtMatchDragonTigerGalaxy",
  btMatchDragonTigerGalaxySchema
);
