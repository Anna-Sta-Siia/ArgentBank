// server/server.js
const path = require('path');
// Charge .env en local ; sur Render les vars viennent de l'env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

// ⬇️ importe la fonction et garde le même nom
const connectDB = require('./database/connection');

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
    if (!origin) return cb(null, true);
    if (!isProd && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return cb(null, true);
    }
    if (ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  maxAge: 600,
};

app.use((_req, res, next) => {
  res.set('Vary', 'Origin');
  res.set('Cache-Control', 'private, no-store');
  next();
});
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* ---------- Parsers ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- DB (une seule fois !) ---------- */
connectDB();

/* ---------- Healthcheck ---------- */
app.get('/api/v1/ping', (_req, res) => res.json({ ok: true }));

/* ---------- Routes API ---------- */
app.use('/api/v1/user', require('./routes/userRoutes'));

/* ---------- Swagger ---------- */
const swaggerDocs = yaml.load(path.join(__dirname, '..', 'swagger.yaml'));
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

/* ---------- Root ---------- */
app.get('/', (_req, res) => {
  res.send('Hello from my Express server v2!');
});

/* ---------- Gestion erreurs CORS ---------- */
app.use((err, _req, res, next) => {
  if (err && String(err.message || '').startsWith('Not allowed by CORS')) {
    return res.status(403).json({ status: 403, message: err.message });
  }
  next(err);
});

/* ---------- Start ---------- */
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
