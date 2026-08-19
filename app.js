const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The document ships in English so the default locale is immediate and SEO-friendly.
// Capture that source copy once, then swap to the original Persian copy on demand.
const translatableElements = [...document.querySelectorAll('[data-i18n]')];
const translatableLabels = [...document.querySelectorAll('[data-i18n-aria-label]')];
const englishCopy = Object.fromEntries(translatableElements.map((element) => [
  element.dataset.i18n,
  element.hasAttribute('data-i18n-html') ? element.innerHTML.trim() : element.textContent.trim()
]));
const englishLabels = Object.fromEntries(translatableLabels.map((element) => [
  element.dataset.i18nAriaLabel,
  element.getAttribute('aria-label')
]));

const persianCopy = {
  skipLink: 'پرش به محتوای اصلی',
  navAbout: 'درباره من',
  navProjects: 'پروژه‌ها',
  navStack: 'تکنولوژی‌ها',
  navContact: 'شروع همکاری',
  heroTitle: 'سیستم‌هایی می‌سازم که <span class="hero__accent">زیر فشار هم</span> درست کار می‌کنند<span class="lime-dot">.</span>',
  heroLead: 'من <strong>امیرحسین شاهدی</strong> هستم؛ توسعه‌دهنده بک‌اند با <strong>بیش از ۵ سال تجربه</strong> و تمرکز بر سرویس‌های مکانی، معماری مقیاس‌پذیر و زیرساخت قابل اتکا.',
  viewProjects: 'مشاهده پروژه‌ها',
  downloadResume: 'دریافت رزومه',
  aboutTitle: 'از یک ایده تا یک سرویس<br><em>واقعاً قابل استفاده.</em>',
  aboutLead: 'مسئله‌های پیچیده را به سرویس‌های <strong>ساده، سریع و نگه‌داشت‌پذیر</strong> تبدیل می‌کنم.',
  aboutBody: 'تجربه من در نقطه اتصال توسعه بک‌اند، داده‌های مکانی و عملیات زیرساخت شکل گرفته است؛ جایی که کیفیت کد باید در دنیای واقعی، با داده واقعی و ترافیک واقعی جواب بدهد.',
  aboutLink: 'بیایید درباره پروژه‌تان حرف بزنیم',
  principlePerformance: 'بهینه‌سازی کوئری‌ها، پردازش async و کش هدفمند برای پاسخ‌گویی سریع‌تر.',
  principleScale: 'معماری ماژولار و سرویس‌هایی که همراه محصول رشد می‌کنند، نه مقابل آن.',
  principleProduction: 'مانیتورینگ، کانتینرسازی و استقرار مطمئن؛ از روز اول توسعه.',
  projectsTitle: 'پروژه‌هایی برای<br><em>دنیای واقعی.</em>',
  projectsIntro: 'منتخبی از سامانه‌های مقیاس‌پذیر، محصولات داده‌محور و زیرساخت‌هایی که ساخته‌ام.',
  projectGeotajak: 'زیرساخت مقیاس‌پذیر داده‌های مکانی برای مدیریت، انتشار و پردازش اطلاعات جغرافیایی در سازمان‌های دولتی و خصوصی.',
  projectGeonet: 'طراحی و توسعه کامل بک‌اند سامانه GeoNet با Django؛ از منطق سمت سرور و APIها تا مدیریت داده‌ها برای ارائه یک سرویس پایدار و قابل اتکا.',
  projectGeoportal: 'نسل جدید سامانه شهروندی ژئوپورتال برای دسترسی ساده‌تر شهروندان به سرویس‌ها و داده‌های شهری.',
  projectAccident: 'سامانه یکپارچه‌سازی و تحلیل داده‌های تصادفات برای پایش و تصمیم‌گیری در مرکز کنترل ترافیک شهرداری.',
  projectTileProxy: 'پروکسی سرور پرسرعت تایل نقشه با Go، احراز هویت JWT و کش Redis برای کاهش بار سرویس‌های اصلی.',
  stackTitle: 'ابزار درست برای<br><em>مسئله درست.</em>',
  stackIntro: 'تکنولوژی فقط یک ابزار است؛ انتخاب معماری مناسب و اجرای دقیق آن چیزی‌ست که محصول را ماندگار می‌کند.',
  contactTitle: 'یک مسئله سخت دارید؟<br><em>بیایید حلش کنیم.</em>',
  contactBody: 'برای همکاری در پروژه‌های بک‌اند، GIS یا طراحی زیرساخت آماده‌ام.',
  backToTop: 'بازگشت به بالا ↑'
};

const persianLabels = {
  navLabel: 'ناوبری اصلی',
  brandLabel: 'صفحه اصلی امیرحسین شاهدی',
  terminalLabel: 'ترمینال تعاملی معرفی امیرحسین',
  geonetLinkLabel: 'مشاهده پروژه GeoNet',
  geoportalLinkLabel: 'مشاهده پروژه ژئوپورتال مشهد'
};

const localeDescriptions = {
  en: 'Portfolio of Amir Hossein Shahedi, a backend engineer with 5+ years of experience in GIS, Python, Django, Go and production infrastructure.',
  fa: 'پورتفولیوی امیرحسین شاهدی؛ توسعه‌دهنده بک‌اند با بیش از ۵ سال تجربه و متخصص در GIS، Python، Django، Go و زیرساخت.'
};

const languageToggle = document.querySelector('[data-language-toggle]');
const languageLabel = document.querySelector('[data-language-label]');
const languageTransition = document.querySelector('[data-language-transition]');
const transitionLabel = document.querySelector('[data-transition-label]');
const transitionStatus = document.querySelector('[data-transition-status]');
const descriptionMeta = document.querySelector('meta[name="description"]');
let currentLanguage = 'en';
let languageTransitioning = false;

function updateMenuLabel() {
  const menuButton = document.querySelector('.menu-button');
  if (!menuButton) return;
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-label', currentLanguage === 'fa'
    ? (open ? 'بستن منو' : 'باز کردن منو')
    : (open ? 'Close menu' : 'Open menu'));
}

function applyLanguage(language) {
  const isPersian = language === 'fa';
  const copy = isPersian ? persianCopy : englishCopy;
  const labels = isPersian ? persianLabels : englishLabels;

  document.documentElement.lang = language;
  document.documentElement.dir = isPersian ? 'rtl' : 'ltr';
  document.body.dataset.language = language;

  translatableElements.forEach((element) => {
    const value = copy[element.dataset.i18n];
    if (value === undefined) return;
    if (element.hasAttribute('data-i18n-html')) element.innerHTML = value;
    else element.textContent = value;
  });
  translatableLabels.forEach((element) => {
    const value = labels[element.dataset.i18nAriaLabel];
    if (value) element.setAttribute('aria-label', value);
  });

  currentLanguage = language;
  languageLabel.textContent = isPersian ? 'EN' : 'FA';
  languageToggle.setAttribute('aria-label', isPersian ? 'تغییر زبان به انگلیسی' : 'Switch to Persian');
  descriptionMeta.setAttribute('content', localeDescriptions[language]);
  updateMenuLabel();
}

function switchLanguage() {
  if (languageTransitioning) return;
  const nextLanguage = currentLanguage === 'en' ? 'fa' : 'en';

  if (reduceMotion) {
    applyLanguage(nextLanguage);
    return;
  }

  languageTransitioning = true;
  languageToggle.disabled = true;
  transitionLabel.textContent = nextLanguage === 'fa' ? 'EN → FA' : 'FA → EN';
  transitionStatus.textContent = nextLanguage === 'fa'
    ? 'LOADING PERSIAN EXPERIENCE'
    : 'LOADING ENGLISH EXPERIENCE';
  languageTransition.classList.remove('is-active');
  void languageTransition.offsetWidth;
  languageTransition.classList.add('is-active');

  window.setTimeout(() => applyLanguage(nextLanguage), 390);
  window.setTimeout(() => {
    languageTransition.classList.remove('is-active');
    languageToggle.disabled = false;
    languageTransitioning = false;
  }, 1050);
}

languageToggle?.addEventListener('click', switchLanguage);

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
  updateMenuLabel();
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  updateMenuLabel();
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
