// backend/server/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const userController   = require('../controllers/userController');
const tokenValidation  = require('../middleware/tokenValidation');
const requireAdmin     = require('../middleware/requireAdmin'); // ⬅️ nouveau

// Public
router.post('/signup', userController.createUser);
router.post('/login',  userController.loginUser);

// Lecture profil (OK pour demo + admin)
// ⚠️ Si ton front appelle POST /profile (spec OC), garde POST ici.
// Tu as mis GET /profile : c’est ok si ton front est en GET.
// Choisis UNE seule version côté front + back.
router.post(           // <-- POST (pas GET)
  '/profile',
  tokenValidation.validateToken,
  userController.getUserProfile
);

router.put(
  '/profile',
  tokenValidation.validateToken,
  requireAdmin,        // écriture réservée à l’admin
  userController.updateUserProfile
);

module.exports = router;
