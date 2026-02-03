const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.BACKEND_PORT || 4100;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory reports store
const reports = [
  { id: 'r1', title: 'Exemple', description: 'Signalement d ex.', status: 'open', createdAt: new Date().toISOString() }
];

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Authorization header manquant' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Format token invalide' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

app.get('/', (req, res) => res.json({ service: 'backend', status: 'ok' }));

// List reports (public)
app.get('/api/reports', (req, res) => res.json({ reports }));

// Get one
app.get('/api/reports/:id', [param('id').isString()], (req, res) => {
  const r = reports.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Non trouvé' });
  res.json(r);
});

// Create (protected)
app.post(
  '/api/reports',
  authMiddleware,
  [body('title').isLength({ min: 1 }), body('description').optional().isString(), body('status').optional().isIn(['open', 'closed', 'in_progress'])],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, description, status } = req.body;
    const newReport = { id: uuidv4(), title, description: description || '', status: status || 'open', createdAt: new Date().toISOString(), author: req.user.email };
    reports.push(newReport);
    res.status(201).json(newReport);
  }
);

// Update (protected)
app.put(
  '/api/reports/:id',
  authMiddleware,
  [param('id').isString(), body('title').optional().isString(), body('description').optional().isString(), body('status').optional().isIn(['open', 'closed', 'in_progress'])],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const r = reports.find((x) => x.id === req.params.id);
    if (!r) return res.status(404).json({ error: 'Non trouvé' });
    const { title, description, status } = req.body;
    if (title !== undefined) r.title = title;
    if (description !== undefined) r.description = description;
    if (status !== undefined) r.status = status;
    r.updatedAt = new Date().toISOString();
    res.json(r);
  }
);

// Delete (protected)
app.delete('/api/reports/:id', authMiddleware, [param('id').isString()], (req, res) => {
  const idx = reports.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Non trouvé' });
  const removed = reports.splice(idx, 1)[0];
  res.json({ removed });
});

// Sync endpoints (simulate Firebase sync)
app.post('/api/sync/push', authMiddleware, [body().isArray()], (req, res) => {
  const incoming = req.body;
  if (!Array.isArray(incoming)) return res.status(400).json({ error: 'Tableau attendu' });
  let added = 0;
  incoming.forEach((rep) => {
    if (!rep.id) rep.id = uuidv4();
    const exists = reports.find((r) => r.id === rep.id);
    if (!exists) {
      reports.push(Object.assign({ createdAt: new Date().toISOString() }, rep));
      added++;
    }
  });
  res.json({ added, total: reports.length });
});

app.get('/api/sync/pull', authMiddleware, (req, res) => {
  res.json({ reports });
});

app.listen(PORT, () => console.log(`backend listening on ${PORT}`));
