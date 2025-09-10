// backend/server/scripts/seedUsers.js (фрагмент)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../database/models/userModel');

const uri = (process.env.DATABASE || process.env.DATABASE_URL || 'mongodb://localhost:27017/argentbank').trim();

async function upsertUser(u) {
  const hash = await bcrypt.hash(u.password, 12);

  // ❗️разделяем email от остальных полей, чтобы не попасть им в $set
  const { email, password, ...rest } = u;

  const doc = await User.findOneAndUpdate(
    { email },                                // критерий поиска
    {
      $setOnInsert: { email },                // email только при создании
      $set: { ...rest, password: hash },      // обновляем остальные поля
    },
    { upsert: true, new: true }
  );

  console.log(`✅ ${doc.email} (role=${doc.role})`);
}

(async () => {
  try {
    // эти опции уберут депрекейшн-предупреждения старого драйвера
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await upsertUser({
      email: 'demo@argent.bank',
      password: '123456',
      firstName: 'Tony',
      lastName: 'Stark',
      userName: 'IronMan',
      role: 'demo',
    });

    await upsertUser({
      email: 'tony@stark.com',   
      password: 'password123',  
      firstName: 'Tony',
      lastName: 'Stark',
      userName: 'IronMan',
      role: 'admin',
    });

    await mongoose.disconnect();
    console.log('🎉 Seed terminé');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed échoué :', e.message);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
})();
