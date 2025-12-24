const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BetlockByMarket = require('../models/BetlockByMarket.js');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Define two seed records
    const records = [
      {
        master_id: new mongoose.Types.ObjectId('64bfcadf0f1e2a3b4c5d6e7f'),
        bettor_id: new mongoose.Types.ObjectId('64bfcadf0f1e2a3b4c5d6e80'),
        cat_mid: 'market_123',
        lock_type: 0,        
        market_type: 1,      
        selected_users: '11734', 
      },
      {
        master_id: new mongoose.Types.ObjectId('64bfcadf0f1e2a3b4c5d6e81'),
        bettor_id: new mongoose.Types.ObjectId('64bfcadf0f1e2a3b4c5d6e82'),
        cat_mid: 'market_456',
        lock_type: 1,         
        market_type: 0,       
        selected_users: '123,234,6880987406fdba6d0f55b1b5,245',
      }
    ];

    // Check existing documents to avoid duplicates
    const existing = await BetlockByMarket.countDocuments();
    if (existing >= records.length) {
      console.log(`Found ${existing} existing documents, skipping insert.`);
    } else {
      const inserted = await BetlockByMarket.insertMany(records);
      console.log(`Seeded ${inserted.length} BetlockByMarket records:`);
      console.dir(inserted, { depth: 1 });
    }
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  }
})();
