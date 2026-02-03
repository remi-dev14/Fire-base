const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = process.env.AUTH_API_PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load users from users.json for offline/local auth (persisted)
const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, 'users.json');
let users = [];
try {
  const raw = fs.readFileSync(usersFile, 'utf8');
  users = JSON.parse(raw);
} catch (err) {
  console.warn('users.json non trouvé ou invalide — utilisation du store en mémoire par défaut');
  users = [
    {
      id: '1',
      email: 'admin@example.com',
      // password: 'password'
      passwordHash: bcrypt.hashSync('password', 8),
      name: 'Admin'
    }
  ];
}

// Setup Postgres client if configured
let pgClient = null;
const { Client } = require('pg');
if (process.env.DATABASE_URL || process.env.PGHOST) {
  const clientConfig = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  };
  pgClient = new Client(clientConfig);
  pgClient.connect().then(() => console.log('Connected to Postgres for auth-api')).catch(err => {
    console.warn('Impossible de se connecter à Postgres:', err.message || err);
    pgClient = null;
  });
}

function generateToken(user) {
  const payload = { sub: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

app.post(
  '/api/auth/login',
  [
    body('email').isEmail().withMessage('email invalide'),
    body('password').isLength({ min: 1 }).withMessage('mot de passe requis'),
    body('mode').optional().isIn(['online', 'offline'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, mode } = req.body;

    // Try online Firebase auth first unless mode = 'offline'
    const tryOnline = mode === 'online' || (mode !== 'offline' && !!process.env.FIREBASE_API_KEY);
    if (tryOnline) {
      // If FIREBASE_API_KEY isn't set we will attempt local auth below
      if (process.env.FIREBASE_API_KEY) {
        // Minimal implementation using Firebase REST API: signInWithPassword
        // Requires FIREBASE_API_KEY in env. Uses global fetch (Node 18+).
        const firebaseUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
        try {
          // call Firebase REST API
          // Note: Firebase expects JSON: { email, password, returnSecureToken: true }
          const fbRes = await fetch(firebaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true })
          });
          if (fbRes.ok) {
            const fbJson = await fbRes.json();
            const user = { id: fbJson.localId || `fb-${fbJson.localId}`, email: fbJson.email, name: fbJson.displayName || fbJson.email.split('@')[0] };
            const token = generateToken(user);
            return res.json({ token, expiresIn: JWT_EXPIRES_IN, user, firebase: true });
          }
          // If Firebase returned 400/401 etc, fallthrough to local auth
        } catch (err) {
          // Network error or timeout — fallback to local
          console.warn('Erreur lors de l\'appel Firebase:', (err && err.message) ? err.message : err);
        }
      }
    }

    // Offline / local auth — prefer Postgres if disponible
    if (pgClient) {
      try {
        const q = await pgClient.query('SELECT id,email,password_hash AS passwordhash,name FROM users WHERE lower(email)=lower($1) LIMIT 1', [email]);
        if (q.rowCount === 0) return res.status(401).json({ error: 'Utilisateur introuvable' });
        const row = q.rows[0];
        const ok = bcrypt.compareSync(password, row.passwordhash);
        if (!ok) return res.status(401).json({ error: 'Mot de passe incorrect' });
        const user = { id: row.id, email: row.email, name: row.name };
        const token = generateToken(user);
        return res.json({ token, expiresIn: JWT_EXPIRES_IN, user });
      } catch (err) {
        console.warn('Erreur Postgres auth lookup:', err && err.message ? err.message : err);
        // fallback to file-based users
      }
    }

    // Fallback to file-based users
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = generateToken(user);
    res.json({ token, expiresIn: JWT_EXPIRES_IN, user: { id: user.id, email: user.email, name: user.name } });
  }
);

// Retourne les infos du token
app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Authorization header manquant' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Format token invalide' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
});

app.get('/', (req, res) => res.json({ service: 'auth-api', status: 'ok' }));

app.listen(PORT, () => console.log(`auth-api listening on ${PORT}`));
