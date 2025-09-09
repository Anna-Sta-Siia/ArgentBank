// backend/server/database/connection.js
require('dotenv').config();
const mongoose = require('mongoose');

function sanitize(u){ return (u||'').trim().replace(/^['"]|['"]$/g,''); }

let uri = sanitize(process.env.DATABASE || process.env.DATABASE_URL);
if (!uri) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Aucune variable DATABASE (ou DATABASE_URL) n’est définie en production.');
    process.exit(1);
  }
  uri = 'mongodb://localhost:27017/argentbank';
}

const masked = uri.replace(/\/\/([^:]*):([^@]*)@/, '//***:***@');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('✅ DB connectée →', masked);
  } catch (e) {
    console.error('❌ Mongo error:', e.message);
    process.exit(1);
  }
};
