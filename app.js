const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal with per-element timing.
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((element) => {
  element.style.setProperty('--delay', `${element.dataset.delay || 0}ms`);
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Deep links should never land on content that is still waiting to reveal.
if (window.location.hash) {
  const hashTarget = document.querySelector(window.location.hash);
  hashTarget?.classList.add('is-visible');
  hashTarget?.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

// Compact mobile navigation.
const nav = document.querySelector('.nav');
const menuButton = document.querySelector('.menu-button');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', scrollY > 30), { passive: true });

// Interactive terminal commands.
const commandElement = document.querySelector('.typed-command');
const outputElement = document.querySelector('[data-terminal-output]');
const commandButtons = document.querySelectorAll('[data-command]');
let typingTimer;
let settleTimer;
const terminalContent = {
  whoami: `
    <p class="output-name">Amir Hossein Shahedi</p>
    <p>Backend Engineer <span class="muted">// Geospatial Systems</span></p>
    <div class="output-rule"></div>
    <p><span class="output-key">experience</span> 5+ years in backend</p>
    <p><span class="output-key">languages</span>  Python, Go, SQL</p>
    <p><span class="output-key">shipping</span>   APIs, GIS, Infrastructure</p>
    <p><span class="output-key">uptime</span>     <span class="terminal-ok">● ready to build</span></p>`,
  stack: `
    <p class="output-name">./stack --production</p>
    <p class="muted">Loading trusted tools...</p>
    <div class="output-rule"></div>
    <p><span class="output-key">backend</span>    Python · Django · FastAPI · Go</p>
    <p><span class="output-key">data</span>       PostgreSQL · PostGIS · Redis</p>
    <p><span class="output-key">infra</span>      Docker · Nginx · Linux</p>
    <p class="terminal-ok">✓ all systems operational</p>`,
  contact: `
    <p class="output-name">Open a new connection</p>
    <p class="muted">Secure channel available.</p>
    <div class="output-rule"></div>
    <p><span class="output-key">email</span> <a class="terminal-link" href="mailto:amirh3347@gmail.com">amirh3347@gmail.com</a></p>
    <p><span class="output-key">linkedin</span> <a class="terminal-link" href="https://www.linkedin.com/in/amir-hossein-shahedi/" target="_blank" rel="noopener noreferrer">connect ↗</a></p>
    <p><span class="output-key">response</span> <span class="terminal-ok">● channel open</span></p>`
};

function typeCommand(command) {
  if (!commandElement || !outputElement) return;
  window.clearInterval(typingTimer);
  window.clearTimeout(settleTimer);
  commandButtons.forEach((button) => {
    const active = button.dataset.command === command;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  outputElement.classList.add('is-changing');
  commandElement.textContent = '';

  if (reduceMotion) {
    commandElement.textContent = command;
    outputElement.innerHTML = terminalContent[command];
    outputElement.classList.remove('is-changing');
    return;
  }

  let index = 0;
  typingTimer = window.setInterval(() => {
    commandElement.textContent += command[index];
    index += 1;
    if (index < command.length) return;
    window.clearInterval(typingTimer);
    settleTimer = window.setTimeout(() => {
      outputElement.innerHTML = terminalContent[command];
      outputElement.classList.remove('is-changing');
    }, 130);
  }, 48);
}

commandButtons.forEach((button) => button.addEventListener('click', () => typeCommand(button.dataset.command)));

// Fine-pointer glow and card-local lighting.
const cursorGlow = document.querySelector('.cursor-glow');
if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = '1';
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
}

document.querySelectorAll('.project').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--my', `${event.clientY - bounds.top}px`);
  });
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
