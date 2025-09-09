/* eslint-disable no-console */
'use strict';
require('dotenv').config();

if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DB_SEED) {
  console.log('⛔️ Refusé en prod (mets ALLOW_DB_SEED=true pour forcer)');
  process.exit(1);
}

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../database/models/userModel');

// ✅ même source que connection.js
const uri = (process.env.DATABASE || process.env.DATABASE_URL || 'mongodb://localhost:27017/argentbank').trim();

async function upsertUser(u){
  const hash = await bcrypt.hash(u.password, 12);
  const doc = await User.findOneAndUpdate(
    { email: u.email },
    { $setOnInsert: { email: u.email }, $set: { ...u, password: hash } },
    { upsert: true, new: true }
  );
  console.log(`✅ ${doc.email} (role=${doc.role})`);
}

(async ()=>{
  await mongoose.connect(uri);
  await upsertUser({ email:'demo@argent.bank', password:'123456', firstName:'Tony', lastName:'Stark', userName:'IronMan', role:'demo' });
  await upsertUser({ email:'ton.email@domaine.com', password:'un-bon-mot-de-passe', firstName:'Ton', lastName:'Nom', userName:'Admin', role:'admin' });
  await mongoose.disconnect();
  console.log('🎉 Seed terminé');
  process.exit(0);
})();
