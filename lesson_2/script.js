// ---------- Per-tab data for the left profile card ----------
const profileData = {
  about: {
    role: 'Grade 7 · ISHCMC',
    accent: 'var(--accent-about)',
    facts: [
      ['Location', 'Ho Chi Minh City, VN'],
      ['Time in VN', '2.5 years'],
      ['School', 'ISHCMC']
    ]
  },
  academics: {
    role: 'Grade 7 · IB MYP',
    accent: 'var(--accent-academics)',
    facts: [
      ['School', 'ISHCMC'],
      ['Founded', '1993'],
      ['Curriculum', 'IB Programme']
    ]
  },
  'hobbies-skills': {
    role: 'Gamer 🎮 · Swimmer 🏊',
    accent: 'var(--accent-hobbies)',
    facts: [
      ['Favorite', 'Video Games'],
      ['Best skill', 'Swimming'],
      ['Level', 'Advanced']
    ]
  },
  contacts: {
    role: 'Get in touch',
    accent: 'var(--accent-contacts)',
    facts: [
      ['Email', 'your.email@example.com'],
      ['Instagram', '@your_handle'],
      ['Status', 'Keep it private!']
    ]
  }
};

// resolve a CSS custom property like 'var(--accent-about)' to its hex value
function resolveAccent(token){
  const name = token.match(/--[\w-]+/)[0];
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ---------- Tab switching (drives left card, right panel, and accent) ----------
const navButtons = document.querySelectorAll('.nav-link[data-target]');
const panels = document.querySelectorAll('.panel');
const roleEl = document.getElementById('profile-role');
const factsEl = document.getElementById('profile-facts');
const avatarFrame = document.getElementById('avatar-frame');
const root = document.documentElement;

function updateLeftCard(target){
  const data = profileData[target];
  if (!data) return;

  root.style.setProperty('--accent', resolveAccent(data.accent));

  roleEl.style.opacity = 0;
  factsEl.style.opacity = 0;

  setTimeout(() => {
    roleEl.textContent = data.role;
    factsEl.innerHTML = data.facts
      .map(([label, value]) => `<li><span>${label}</span><b>${value}</b></li>`)
      .join('');
    roleEl.style.opacity = 1;
    factsEl.style.opacity = 1;
  }, 150);

  avatarFrame.classList.add('pulse');
  setTimeout(() => avatarFrame.classList.remove('pulse'), 250);
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    navButtons.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(target).classList.add('active');

    updateLeftCard(target);
  });
});

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Avatar fallback if me.png is missing ----------
const avatarImg = document.getElementById('avatar-img');
if (avatarImg) {
  avatarImg.addEventListener('error', () => {
    avatarImg.style.display = 'none';
    const frame = avatarImg.parentElement;
    const placeholder = document.createElement('div');
    placeholder.className = 'avatar-placeholder';
    placeholder.textContent = 'Add me.png';
    frame.appendChild(placeholder);
  });
}