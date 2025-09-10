// backend/server/middleware/tokenValidation.js
const jwt = require('jsonwebtoken');
const SECRET = require('../config/jwt');

module.exports.validateToken = (req, res, next) => {
  // Récupère l'en-tête "Authorization: Bearer <token>"
  const auth = req.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Missing or malformed Authorization header' });
  }

  const token = auth.slice(7).trim(); // retire "Bearer "

  try {
    // Vérifie la signature et l’expiration
    const decoded = jwt.verify(token, SECRET);

    // Standardise ce qu’on expose aux routes suivantes
    // (⚠️ le payload est signé au login sous la forme { userId, role })
    req.user = { id: decoded.userId, role: decoded.role };

    return next();
  } catch (err) {
    console.error('tokenValidation error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
