const express = require('express');
const router = express.Router();
const TestRecord = require('../models/TestRecord');

// POST /api/test-records/query
// Body: { from: "2025-09-25T00:00:00Z", to: "2025-09-28T23:59:59Z" }
router.get('/query', async (req, res) => {
    res.status(200).json({ message: 'Please use POST with { from, to } in body' });
});
router.post('/query', async (req, res) => {
  try {
    const { from, to } = req.body || {};
    if (!from || !to) return res.status(400).json({ message: 'from and to are required (ISO strings)' });

    const fromDate = new Date(from);
    const toDate   = new Date(to);
    if (isNaN(fromDate) || isNaN(toDate)) {
      return res.status(400).json({ message: 'Invalid from/to date' });
    }

    const records = await TestRecord.find({
      ts: { $gte: fromDate, $lte: toDate }
    }).sort({ ts: 1 }).select({ _id: 0, name: 1, ts: 1 });

    return res.json({ count: records.length, records });
  } catch (err) {
    console.error('query error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// OPTIONAL: GET /api/test-records/seed  -> quick reseed (last 5 days @ 30-min)
router.get('/seed', async (req, res) => {
  try {
    const now = new Date();
    const end = new Date(Math.floor(now.getTime() / (30*60*1000)) * 30*60*1000);
    const start = new Date(end.getTime() - (5 * 24 * 60 * 60 * 1000));

    const bulk = [];
    for (let t = start.getTime(); t <= end.getTime(); t += 30*60*1000) {
      const d = new Date(t);
      bulk.push({
        insertOne: { document: { ts: d, name: `Record ${d.toISOString()}` } }
      });
    }
    if (bulk.length) await TestRecord.bulkWrite(bulk, { ordered: false });

    return res.json({ message: 'Seeded', start: start.toISOString(), end: end.toISOString(), inserted: bulk.length });
  } catch (err) {
    console.error('seed error:', err);
    return res.status(500).json({ message: 'Seed failed' });
  }
});

module.exports = router;
