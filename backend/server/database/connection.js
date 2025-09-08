// connection.js
const mongoose = require('mongoose');

function sanitize(url) {
  if (!url) return '';
  // enlève d'éventuels guillemets / espaces qui auraient été collés dans le dashboard Render
  return String(url).trim().replace(/^['"]|['"]$/g, '');
}

const rawUrl = process.env.DATABASE_URL || process.env.MONGO_URL || '';
const databaseUrl = sanitize(rawUrl);

if (!databaseUrl) {
  console.error('❌ DATABASE_URL est vide ou manquante ! Vérifie les variables Render.');
  process.exit(1);
}

// log non-sensible (on masque mdp)
const masked = databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
console.log('ℹ️ DATABASE_URL (détectée par le serveur) =', masked);

module.exports = async () => {
  try {
    await mongoose.connect(databaseUrl, {
      // options facultatives selon ta version de mongoose
    });
    console.log('✅ Database successfully connected to', masked);
  } catch (error) {
    console.error(`❌ Database Connectivity Error: ${error}`);
    throw error;
  }
};
