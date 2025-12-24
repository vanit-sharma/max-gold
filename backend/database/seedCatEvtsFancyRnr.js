require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require('mongoose');

// --- model (adjust the path if you already have this model exported elsewhere) ---
const CatEvtsFancyRnr = require('../models/CatEvtsFancyRnr');

// Helpers
async function getNextSno() {
  const last = await CatEvtsFancyRnr.findOne({}, { sno: 1 }).sort({ sno: -1 }).lean();
  return (last?.sno || 0) + 1;
}

function to2(v) {
  // round to 2 decimals like DOUBLE(7,2)
  return Math.round(Number(v) * 100) / 100;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  // Accept CLI args: node seed/catEvtsFancyRnr.seed.js 34577324 FAN-001
  const evtId = '34577324';
  const midMid = '1.246226042-413.FY';

  // Optional: wipe existing seeds for this evt_id + mid_mid (keeps seeding idempotent)
  await CatEvtsFancyRnr.deleteMany({ evt_id: evtId, mid_mid: midMid });

  const baseSno = await getNextSno();

  // Sample data — adjust odds/prices as needed for your domain
  const docs = [
    {
      sno: baseSno,
      evt_id: evtId,
      mid_mid: midMid,
      rnr_nam: 'Yes',         // display name of the runner
      mid_stat: 'OPEN',
      rnr_sid: 'b1',          // internal id / side key
      bak: to2(85.0),
      lay: to2(86.0),
      bakrate: 85,
      layrate: 86,
      // stmp defaults to now in schema; omit if your model has default
      is_bf_fancy: 0
    },
    {
      sno: baseSno + 1,
      evt_id: evtId,
      mid_mid: midMid,
      rnr_nam: 'No',
      mid_stat: 'OPEN',
      rnr_sid: 'l1',
      bak: to2(85.0),
      lay: to2(86.0),
      bakrate: 85,
      layrate: 86,
      is_bf_fancy: 0
    }
  ];

  const inserted = await CatEvtsFancyRnr.insertMany(docs, { ordered: true });
  console.log(`Inserted ${inserted.length} document(s) into cat_evts_fancy_rnr for evt_id=${evtId}, mid_mid=${midMid}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect().finally(() => process.exit(1));
});
