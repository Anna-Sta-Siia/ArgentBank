// backend/server/config/jwt.js
require('dotenv').config();

const SECRET = process.env.SECRET_KEY;

if (!SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('SECRET_KEY manquante en production');
}

// En dev on tolère une valeur par défaut
module.exports = SECRET || 'default-secret-key';
