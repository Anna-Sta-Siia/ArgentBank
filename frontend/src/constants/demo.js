// src/constants/demo.js

export const DEMO_EMAIL = 'demo@argent.bank';
export const DEMO_PASS = '123456';

// 1) Marqueur "cette session est en mode démo" (rôle démo)
export const DEMO_FLAG = 'demo_role';

// 2) (optionnel) Pour afficher un toast/bannière "mode démo"
export const DEMO_NOTICE_FLAG = 'demo_show_notice';

// 3) Clé de stockage éphémère pour les modifs de profil (ex: userName)
export const DEMO_PROFILE_OVERLAY = 'demo_profile';

// 4) (optionnel) Garder l’overlay pour un seul reload après logout
export const DEMO_KEEP_ONCE = 'demo_keep_once';

// Petit helper pratique
export const isDemo = () => sessionStorage.getItem(DEMO_FLAG) === '1';
