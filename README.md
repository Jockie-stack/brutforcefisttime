# Auth App — Node.js + Express + Sessions

## Structure des fichiers

```
auth-app/
├── server.js           ← Serveur Express (API + sessions)
├── package.json
├── data/
│   └── users.json      ← Créé automatiquement au démarrage
└── public/
    ├── index.html      ← Page de connexion / inscription
    ├── dashboard.html  ← Page protégée (après connexion)
    ├── style.css
    └── script.js
```

## Installation et démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le serveur
```bash
npm start
```

### 3. Ouvrir dans le navigateur
```
http://localhost:3000
```

## API

| Méthode | Route          | Description                    |
|---------|----------------|--------------------------------|
| POST    | /api/signup    | Créer un compte                |
| POST    | /api/signin    | Se connecter                   |
| POST    | /api/signout   | Se déconnecter                 |
| GET     | /api/me        | Infos de la session courante   |
| GET     | /dashboard     | Page protégée (session requise)|

## Fonctionnement

- Les mots de passe sont **hashés avec bcrypt** avant d'être stockés.
- La session est gérée par un **cookie HttpOnly** (expire après 24h).
- Les utilisateurs sont stockés dans `data/users.json`.
- Si vous accédez à `/dashboard` sans être connecté, vous êtes redirigé vers `/`.

## Sécurité (pour la production)

- Changez le `secret` dans `server.js` par une valeur aléatoire longue.
- Activez `cookie: { secure: true }` si vous utilisez HTTPS.
- Remplacez le fichier JSON par une vraie base de données (MySQL, MongoDB...).
