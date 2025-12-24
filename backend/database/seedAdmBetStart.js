const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const AdmBetStart = require('../models/AdmBetStart.js');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const sno = 1;
    const existing = await AdmBetStart.findOne({ sno });
    if (existing) {
      console.log(`adm_bet_start with sno=${sno} already exists, skipping.`);
    } else {
      const doc = await AdmBetStart.create({
        sno: 1,
        IsBettingStart: 1,
        IsTakeOff: 0,
        T20: 1,
        OneDay: 1,
        Card32: 1,
        AAA: 1,
        Card32_b: 1,
        SuperOver: 0,
        AndarBahar: 1,
        DraganTiger: 1,
        Lucky7: 1,
        lucky7b: 1,
        wroli: 1,
        backupStop: 1,
        StartTransfer: 1,
        video20: '',
        video32: '',
        videoonedy: '',
        dragan_tiger: '',
        Lucky7Video: '',
        CardVideo32B: '',
        bollywood: 1,
        '3card': 1,
        race20: 1,
        withdrawalStart: 1,
        colorgame: 1,
        bigsmall: 1,
        dragan_tiger_od: 1,
        auto_fancy_result: 1,
        lastfigure: 1,
        aviator: 1,
        rolldice: 1,
        head_tail: 1,
        roulette: 1,
        odd_even: 1,
        hilo: 1,
        virtual_lucky7: 1,
        virtual_dt: 1,
        virtual_tp20: 1,
        virtual_card32: 1,
        virtual_bollywood: 1,
        virtual_highcard: 1,
        virtual_casinowar: 1,
        virtual_aaa: 1,
        virtual_andarbahar: 1,
        virtual_tp20muflis: 1,
        virtual_lucky7second: 1,
        virtual_sicbo: 1,
        virtual_race17: 1,
        virtual_race20: 1,
        wheel: 1,
        betfair_hold: 1,
        betfair_turbo_hold: 1,
        betfair_hilo: 1,
        betfair_turbo_hilo: 1,
        betfair_blackjack: 1,
        betfair_turbo_blackjack: 1,
        betfair_omaha: 1,
        betfair_baccarat: 1,
        betfair_turbo_baccarat: 1,
        dream_catcher: 1,
        blastoff: 1,
        virtual_centercard: 1,
        aviatorx: 1,
        virtual_duskadum: 1,
        virtual_queenrace: 1,
        galaxy_lucky7: 1,
        galaxy_andarbahar: 1,
        galaxy_dt: 1,
        galaxy_tp20: 1,
        galaxy_hilo: 1,
      });
      console.log('Seeded adm_bet_start:', doc);
    }
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  }
}

seed();
