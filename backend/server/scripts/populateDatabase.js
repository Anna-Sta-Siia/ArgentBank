// backend/server/scripts/populateDatabase.js
/* eslint-disable no-console */
'use strict';

///
/// 1) Sécurité : ne pas exécuter le seed en production
///    (sauf si on le force explicitement via ALLOW_DB_SEED)
///
if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DB_SEED) {
  console.log('⛔️ Refusé en production. (définis ALLOW_DB_SEED=true pour forcer, à tes risques)');
  process.exit(1);
}

const axios = require('axios');

///
/// 2) Base URL de l’API (peut être sur Render ou en local)
///    - on retire un slash de fin éventuel
///
const API_BASE = (process.env.API_BASE || 'https://argentbank-6905.onrender.com').replace(/\/$/, '');
const signupApi = `${API_BASE}/api/v1/user/signup`;

///
/// 3) Données de seed (idempotent si ton API renvoie 409 quand l’utilisateur existe)
///
const users = [
  {
    firstName: 'Tony',
    lastName: 'Stark',
    email: 'tony@stark.com',
    password: 'password123',
    userName: 'Iron',
  },
  {
    firstName: 'Steve',
    lastName: 'Rogers',
    email: 'steve@rogers.com',
    password: 'password456',
    userName: 'Captain',
  },
];

///
/// 4) Exécution
///
(async () => {
  console.log(`➡️  Seeding via ${signupApi} (NODE_ENV=${process.env.NODE_ENV || 'undefined'})`);

  for (const user of users) {
    try {
      const res = await axios.post(signupApi, user, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });
      console.log('✅ Created:', user.email, res.status);
    } catch (err) {
      if (err.response) {
        // 409 = déjà créé → OK pour un seed idempotent
        const msg = err.response.data?.message || '';
        console.log(`ℹ️ ${user.email}: ${err.response.status} ${msg}`);
      } else {
        console.error(`❌ ${user.email}:`, err.message);
      }
    }
  }
})();
