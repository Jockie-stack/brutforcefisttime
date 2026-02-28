function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', (i === 0 && tab === 'signin') || (i === 1 && tab === 'signup'))
  );
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

function flash(id) {
  const el = document.getElementById(id);
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function handleSignIn() {
  const email = document.getElementById('si-email').value;
  const pass  = document.getElementById('si-pass').value;
  if (!email || !pass) return shake();
  flash('flash-signin');
}

function handleSignUp() {
  const name  = document.getElementById('su-name').value;
  const email = document.getElementById('su-email').value;
  const pass  = document.getElementById('su-pass').value;
  if (!name || !email || !pass) return shake();
  flash('flash-signup');
}

function shake() {
  const card = document.querySelector('.card');
  card.style.animation = 'none';
  card.style.transform = 'translateX(-6px)';
  setTimeout(() => { card.style.transform = 'translateX(6px)';  }, 80);
  setTimeout(() => { card.style.transform = 'translateX(-4px)'; }, 160);
  setTimeout(() => { card.style.transform = 'translateX(0)';    }, 240);
}
