// backend/server/services/userService.js
const User = require('../database/models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = require('../config/jwt');

/**
 * Récupère l'utilisateur authentifié depuis req.user (middleware)
 * ou, en fallback, en vérifiant le JWT présent dans l'en-tête Authorization.
 */
function getAuthUser(req) {
  if (req.user?.id) return req.user;

  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    throw new Error('Missing token');
  }
  const token = auth.slice(7).trim();

  const decoded = jwt.verify(token, SECRET);
  return { id: decoded.userId, role: decoded.role };
}

module.exports.createUser = async (body) => {
  try {
    const existing = await User.findOne({ email: body.email });
    if (existing) throw new Error('Email already exists');

    const hash = await bcrypt.hash(body.password, 12);

    // Le rôle est défini par le schéma (default 'demo').
    // Ne JAMAIS accepter "role" venant du client ici.
    const newUser = new User({
      email: body.email,
      password: hash,
      firstName: body.firstName,
      lastName: body.lastName,
      userName: body.userName || '',
    });

    const saved = await newUser.save();
    return saved.toObject(); // le modèle supprime password/_id/__v
  } catch (err) {
    console.error('userService.createUser:', err);
    throw new Error(err.message || String(err));
  }
};

module.exports.loginUser = async (body) => {
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) throw new Error('User not found!');

    const ok = await bcrypt.compare(body.password, user.password);
    if (!ok) throw new Error('Password is invalid');

    // ⬇⬇ Le rôle est signé dans le token
    const payload = { userId: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, SECRET, { expiresIn: '24h' });

    return { token };
  } catch (err) {
    console.error('userService.loginUser:', err);
    throw new Error(err.message || String(err));
  }
};

module.exports.getUserProfile = async (req) => {
  try {
    const { id } = getAuthUser(req);
    const user = await User.findById(id);
    if (!user) throw new Error('User not found!');
    return user.toObject();
  } catch (err) {
    console.error('userService.getUserProfile:', err);
    throw new Error(err.message || String(err));
  }
};

module.exports.updateUserProfile = async (req) => {
  try {
    const { id } = getAuthUser(req);
    const { userName } = req.body || {};

    const updated = await User.findByIdAndUpdate(
      id,
      { userName },
      { new: true }
    );

    if (!updated) throw new Error('User not found!');
    return updated.toObject();
  } catch (err) {
    console.error('userService.updateUserProfile:', err);
    throw new Error(err.message || String(err));
  }
};
