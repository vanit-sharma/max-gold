require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Punter = require("../models/Punter");
const BzStakeSettings = require("../models/BzStakeSettings");

async function seedStakeSettings() {
  await mongoose.connect(process.env.MONGO_URI);

  try {
    const punter = await Punter.findOne({ uname: "bettor" });
    if (!punter) {
      console.error("Punter with username 'bettor' not found.");
      return;
    }

    const userId = punter._id; // or punter.user_id, depending on your schema

    const gValues = [500, 100, 2000, 5000];
    const pValues = [1000, 5000, 10000, 25000];

    const seedData = [
      ...gValues.map((value) => ({
        user_id: userId,
        type: "g",
        button_value: value,
      })),
      ...pValues.map((value) => ({
        user_id: userId,
        type: "p",
        button_value: value,
      })),
    ];

    await BzStakeSettings.insertMany(seedData);
    console.log("Seeder ran successfully");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedStakeSettings().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
