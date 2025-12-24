require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const BetfairEvent = require("../models/BetfairEvent"); 

const MONGO_URI = process.env.MONGO_URI;

function normalizeExtendedJson(obj) {
  if (Array.isArray(obj)) {
    return obj.map(normalizeExtendedJson);
  } else if (obj && typeof obj === "object") {
    // Handle $numberLong, $numberDouble, $date, $oid, etc.
    if (obj.$numberLong) return Number(obj.$numberLong);
    if (obj.$numberDouble) return Number(obj.$numberDouble);
    if (obj.$date && obj.$date.$numberLong)
      return new Date(Number(obj.$date.$numberLong));
    if (obj.$date) return new Date(obj.$date);
    if (obj.$oid) return obj.$oid;
    // Recursively process the rest of the object
    const res = {};
    for (const k in obj) res[k] = normalizeExtendedJson(obj[k]);
    return res;
  }
  return obj;
}

async function seedEvents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Load events from JSON file
    const rawData = JSON.parse(fs.readFileSync("events.json", "utf-8"));
    const normalizedData = normalizeExtendedJson(rawData);

    // Remove _id field from every object:
    const cleanedData = normalizedData.map((doc) => {
      const { _id, ...rest } = doc; // exclude _id
      return rest;
    });

    // clear existing events:
    await BetfairEvent.deleteMany();

    // Insert events
    await BetfairEvent.insertMany(cleanedData);

    console.log(`${cleanedData.length} events seeded!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedEvents();
