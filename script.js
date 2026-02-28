// ── Utilitaires ──────────────────────────────────────────────────────────────

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', (i === 0 && tab === 'signin') || (i === 1 && tab === 'signup'))
  );
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  clearMessages();
}

function showMessage(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
}

function clearMessages() {
  document.querySelectorAll('.flash').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
}

function setLoading(btnId, isLoading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('loading', isLoading);
  btn.disabled = isLoading;
}

function shake() {
  const card = document.querySelector('.card');
  card.style.transition = 'transform 0.08s ease';
  card.style.transform  = 'translateX(-6px)';
  setTimeout(() => { card.style.transform = 'translateX(6px)';  }, 80);
  setTimeout(() => { card.style.transform = 'translateX(-4px)'; }, 160);
  setTimeout(() => { card.style.transform = 'translateX(0)';    }, 240);
}

// ── Connexion ─────────────────────────────────────────────────────────────────

async function handleSignIn() {
  clearMessages();

  const email    = document.getElementById('si-email').value.trim();
  const password = document.getElementById('si-pass').value;

  if (!email || !password) {
    showMessage('error-signin', 'Veuillez remplir tous les champs.');
    return shake();
  }

  setLoading('btn-signin', true);

  try {
    const res  = await fetch('/api/signin', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage('error-signin', data.error || 'Erreur de connexion.');
      shake();
    } else {
      showMessage('flash-signin', data.message + ' Redirection...');
      setTimeout(() => window.location.href = '/dashboard', 1000);
    }
  } catch (err) {
    showMessage('error-signin', 'Impossible de joindre le serveur.');
    shake();
  } finally {
    setLoading('btn-signin', false);
  }
}

// ── Inscription ───────────────────────────────────────────────────────────────

async function handleSignUp() {
  clearMessages();

  const name     = document.getElementById('su-name').value.trim();
  const email    = document.getElementById('su-email').value.trim();
  const password = document.getElementById('su-pass').value;

  if (!name || !email || !password) {
    showMessage('error-signup', 'Veuillez remplir tous les champs.');
    return shake();
  }
  if (password.length < 8) {
    showMessage('error-signup', 'Le mot de passe doit faire au moins 8 caractères.');
    return shake();
  }

  setLoading('btn-signup', true);

  try {
    const res  = await fetch('/api/signup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage('error-signup', data.error || 'Erreur lors de la création du compte.');
      shake();
    } else {
      showMessage('flash-signup', data.message + ' Redirection...');
      setTimeout(() => window.location.href = '/dashboard', 1000);
    }
  } catch (err) {
    showMessage('error-signup', 'Impossible de joindre le serveur.');
    shake();
  } finally {
    setLoading('btn-signup', false);
  }
}

// ── Vérifier si déjà connecté au chargement ───────────────────────────────────
fetch('/api/me')
  .then(r => r.json())
  .then(data => {
    if (data.user) window.location.href = '/dashboard';
  })
  .catch(() => {});
