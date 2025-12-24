require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require('mongoose');
const CatEvtsFancy = require('../models/CatEvtsFancy'); // <-- path to the model you created

async function getNextSno() {
  const last = await CatEvtsFancy.findOne({}, { sno: 1 }).sort({ sno: -1 }).lean();
  return (last?.sno || 0) + 1;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const baseSno = await getNextSno();

  const docs = [
    {
      sno: baseSno,
      evt_id: 34577324,
      mid_mid: '1.246226042',
      mid_typ: 'fancy',
      mid_nam: 'Team A runs',
      mid_ir: '[]',
      mid_ir_f: '[]',
      mid_stat: 'OPEN',
      mid_inp: 1,
      mid_rnr: 1,
      display_status: 1,
      overs: '[]',
      a_overs: '[]',
      fwicket: '[]',
      plname: 'test',
      inn: 1,
      sortcol: 1,
      perover: '[]',
      not_settle: 0,
      line_mid: 'LINE-001',
      section_id: 10,
      min_limit: 100,
      max_limit: 5000,
      is_bf: 0
    },
    {
      sno: baseSno + 1,
      evt_id: 34577324,
      mid_mid: 'FAN-002',
      mid_typ: 'fancy',
      mid_nam: 'Team B wickets',
      mid_ir: '[]',
      mid_ir_f: '[]',
      mid_stat: 'OPEN',
      mid_inp: 1,
      mid_rnr: 2,
      display_status: 1,
      overs: '[]',
      a_overs: '[]',
      fwicket: '[]',
      plname: 'test',
      inn: 1,
      sortcol: 2,
      perover: '[]',
      not_settle: 0,
      line_mid: 'LINE-002',
      section_id: 10,
      min_limit: 100,
      max_limit: 5000,
      is_bf: 0
    }
  ];

  const result = await CatEvtsFancy.insertMany(docs, { ordered: true });
  console.log(`Inserted ${result.length} document(s) into cat_evts_fancy`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect().finally(() => process.exit(1));
});
