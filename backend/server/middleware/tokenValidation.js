// backend/server/middleware/tokenValidation.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY || 'default-secret-key';

module.exports.validateToken = (req, res, next) => {
  const auth = req.get('authorization') || ''; // ex: "Bearer <token>"

  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header' });
  }

  const token = auth.slice(7).trim(); // retire "Bearer "

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // si tu veux l’exposer aux routes suivantes
    return next();
  } catch (err) {
    console.error('Error in tokenValidation.js:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
