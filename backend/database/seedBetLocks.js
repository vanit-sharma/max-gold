require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const BetLock = require("../models/BetLock");

async function seedBetLocks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // await BetLock.deleteMany({});

    const now = new Date();
    const seedData = [
      {
        user_id: new mongoose.Types.ObjectId("6880987406fdba6d0f55b1b5"),
        lock_by: 101,
        casino_tp_studio: 1,
        casino_royal_casino: 1,
        casino_star: 1,
        casino_supernowa: 1,
        casino_betfair: 1,
        cric_matchodd: 1,
        cric_fancy: 1,
        cric_toss: 1,
        cric_tie: 1,
        cric_even_odd: 1,
        cric_figure: 1,
        cric_cup: 1,
        greyh_australia: 1,
        greyh_britain: 1,
        greyh_newzealand: 1,
        hrace_dubai: 1,
        hrace_australia: 1,
        hrace_bahrain: 1,
        hrace_france: 1,
        hrace_england: 1,
        hrace_ireland: 1,
        hrace_newzealand: 1,
        hrace_sweden: 1,
        hrace_singapore: 1,
        hrace_america: 1,
        hrace_africa: 1,
        soccer_matchodd: 1,
        soccer_over_under: 1,
        tennis_matchodd: 1,
        created_date: now,
        updated_date: now,
      },
    ];

    const inserted = await BetLock.insertMany(seedData);
    console.log(`Inserted ${inserted.length} bet_lock documents`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Seeder complete.");
  } catch (err) {
    console.error("Error running betLockSeeder:", err);
    process.exit(1);
  }
}

seedBetLocks();
