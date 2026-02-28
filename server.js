const express      = require('express');
const session      = require('express-session');
const bcrypt       = require('bcryptjs');
const bodyParser   = require('body-parser');
const path         = require('path');
const fs           = require('fs');

const app  = express();
const PORT = 3000;

// ── Fichier de stockage des utilisateurs ────────────────────────────────────
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Crée le dossier data + fichier users.json si inexistants
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'mon_secret_super_securise_changez_moi',  // ← changez ce secret en prod
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24  // 24 heures
  }
}));

// ── Middleware : protéger les routes privées ─────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: 'Non authentifié. Veuillez vous connecter.' });
}

// ── Routes API ───────────────────────────────────────────────────────────────

// Inscription
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères.' });
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Connecter automatiquement après inscription
  req.session.user = { id: newUser.id, name: newUser.name, email: newUser.email };
  res.status(201).json({ message: 'Compte créé avec succès !', user: req.session.user });
});

// Connexion
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const users  = getUsers();
  const user   = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }

  req.session.user = { id: user.id, name: user.name, email: user.email };
  res.json({ message: 'Connexion réussie !', user: req.session.user });
});

// Déconnexion
app.post('/api/signout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Déconnecté avec succès.' });
  });
});

// Vérifier la session courante
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// ── Page protégée (exemple) ──────────────────────────────────────────────────
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Serveur démarré sur http://localhost:${PORT}`);
});
