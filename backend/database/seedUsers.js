require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Punter = require('../models/Punter'); 

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const punterId = new mongoose.Types.ObjectId();
  const users = [
    {
      _id: punterId,
      company_id: 1,
      fname: 'companyuser',
      uname: 'bpSoftware',
      passpin: await bcrypt.hash('trade@star1426', 10),
      user_role: 1,
      bz_balance: 100,
      opin_bal: 50,
      credit_amount: 200,
      credit_reference: 123456,
      bonus_wallet: 20,
      my_sharing: 100,
      parent_sharing: 0,
      total_pl: 0,
      transaction_pl: 0,
      upline_balance: 0,
      total_comm: 0,
      total_casino_pl: 0,
      total_vcasino_pl: 0,
      sponsor: 'Admin',
      sponser_id: punterId,
      email: 'uesr@example.com',
      full_chain: '',
      transaction_pass: 9999,
      stat: 1,
      bet_status: 1,
      mobno: '1234567890',
      ip_address: '127.0.0.1',
      last_login: new Date(),
      show_password: 0,
      currency: 1,
      bet_delay: 5,
      fancy_delay: 3,
      password_change: 0,
      can_settled: 0,
      f_enable: 1,
      c_enble: 1,
      t_enable: 1,
      master_sharing: new mongoose.Types.ObjectId(),
    }
  ];

  // Clean the collection before seeding
  await Punter.deleteMany({ uname: { $in: users.map(u => u.uname) } });

  // Insert users
  await Punter.insertMany(users);

  console.log('Seeded 2 users!');
  await mongoose.disconnect();
}

seedUsers().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
