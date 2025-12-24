const mongoose = require("mongoose");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const BetLimit = require('../models/BetLimit.js');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const betLimitData = {
      user_id: new mongoose.Types.ObjectId("6880987406fdba6d0f55b1b5"),
      soccer_min: "100",
      soccer: "200000",
      tennis_min: "100",
      tennis: "200000",
      cricket_min: "100",
      cricket: "5000000",
      fancy_min: "100",
      fancy: "200000",
      hrace_min: "100",
      hrace: "200000",
      casino: "50000",
      greyhound_min: "100",
      greyhound: "50000",
      bookMaker_min: "100",
      bookMaker: "2000000",
      virtual_min: "100",
      virtual: "20000",
      toss_min: "100",
      toss: "0",
      tie_min: "100",
      tie: "0",
      evenodd_min: "100",
      evenodd: "0",
      figure_min: "100",
      figure: "0",
      soccer_exp: "500000",
      tennis_exp: "500000",
      cricket_exp: "2000000",
      fancy_exp: "1000000",
      hrace_exp: "200000",
      greyhound_exp: "500000",
      bookMaker_exp: "1000000",
      virtual_exp: "1000000",
      toss_exp: "1000000",
      tie_exp: "1000000",
      evenodd_exp: "1000000",
      figure_exp: "1000000",
      created_date: "2024-11-23 19:08:15",
      updated_date: "2024-11-23 23:46:12",
    };

    const existing = await BetLimit.findOne({ user_id: new mongoose.Types.ObjectId("6880987406fdba6d0f55b1b5") });
    if (existing) {
      console.log(
        `A BetLimit for user is already exists. Skipping insert.`
      );
    } else {
      const doc = await BetLimit.create(betLimitData);
      console.log("Seeded BetLimit:", doc);
    }
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
    process.exit(0);
  }
}

seed();
