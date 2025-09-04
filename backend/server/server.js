// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const dbConnection = require('./database/connection');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/* ---------- CORS (avant les routes !) ---------- */
const ALLOWED = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const isProd = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin(origin, cb) {
    // Autorise Postman/cURL/healthchecks sans Origin
    if (!origin) return cb(null, true);

    // ✅ En DEV, autorise n'importe quel port localhost/127.0.0.1
    if (!isProd && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return cb(null, true);
    }

    // ✅ En PROD, on reste strict : seulement les origins whitelistes
    if (ALLOWED.includes(origin)) return cb(null, true);

    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  maxAge: 600 // ← 10 minutes de cache du prévol côté navigateur
};

// Ajoute l’en-tête Vary pour caches/proxies
app.use((_req, res, next) => {
  res.set('Vary', 'Origin'); // variantes par Origin si c’est mis en cache
  // Pour les endpoints sensibles (auth, profil), évite tout cache partagé :
  res.set('Cache-Control', 'private, no-store'); // ou au minimum: 'private, no-cache'
  next();
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ← gère le prévol (OPTIONS)

/* ---------- Parsers ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- DB ---------- */
dbConnection();

/* ---------- Healthcheck ---------- */
app.get('/api/v1/ping', (_req, res) => res.json({ ok: true }));

/* ---------- Routes API ---------- */
app.use('/api/v1/user', require('./routes/userRoutes'));

/* ---------- Swagger (chemin robuste) ---------- */
const swaggerDocs = yaml.load(path.join(__dirname, '..', 'swagger.yaml'));
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

/* ---------- Root ---------- */
app.get('/', (_req, res) => {
  res.send('Hello from my Express server v2!');
});

/* ---------- Gestion simple des erreurs CORS ---------- */
app.use((err, _req, res, next) => {
  if (err && String(err.message || '').startsWith('Not allowed by CORS')) {
    return res.status(403).json({ status: 403, message: err.message });
  }
  next(err);
});

/* ---------- Démarrage ---------- */
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
