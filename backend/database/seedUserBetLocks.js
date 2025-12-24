require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserBetLock = require('../models/UserBetLock');


  
async function seedUserBetLocks() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding.');

    
    // await UserBetLock.deleteMany({});
    // console.log('Cleared existing user_bet_lock documents.');

    
    const seedData = [
      {
        user_id: new mongoose.Types.ObjectId('6880987406fdba6d0f55b1b5'),
        status: 0,
        lock_by: 123,
        create_date: new Date(),
      }
    ];

    const inserted = await UserBetLock.insertMany(seedData);
    console.log(`Inserted ${inserted.length} user_bet_lock document.`);

    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB. Seeder complete.');
  } catch (err) {
    console.error('Error running userBetLockSeeder:', err);
    process.exit(1);
  }
}

seedUserBetLocks();