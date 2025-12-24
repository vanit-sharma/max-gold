require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require('mongoose');
const TestRecord = require('../models/TestRecord');

(async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB...', uri);
    if (!uri) throw new Error('Missing MONGO_URI in .env');
    await mongoose.connect(uri);
    console.log('MongoDB connected');

    // compute range: last 5 days (floor to 30-min boundary)
    const now = new Date();
    const end = new Date(Math.floor(now.getTime() / (30*60*1000)) * 30*60*1000);
    const start = new Date(end.getTime() - (5 * 24 * 60 * 60 * 1000)); // 5 days back

    const docs = [];
    for (let t = start.getTime(); t <= end.getTime(); t += 30*60*1000) {
      const d = new Date(t);
      docs.push({
        ts: d,
        name: `Record ${d.toISOString()}`, // easy to verify visually
      });
    }

    // Optional: wipe existing for clean testing
    // await TestRecord.deleteMany({});

    if (docs.length) {
      const res = await TestRecord.insertMany(docs, { ordered: false });
      console.log(`Inserted ${res.length} records from ${start.toISOString()} to ${end.toISOString()}`);
    } else {
      console.log('No docs to insert? Check time math.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
