/* ═══════════════════════════════════════════════════════════════
   yildirim.sec — Vanilla JavaScript
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── Utilities ─────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Nav: Scroll & Active Section ──────────────────────────────────
(function initNav() {
  const navbar   = $('#navbar');
  const backTop  = $('#back-top');
  const navLinks = $$('.nav-link');
  const hamburger = $('#nav-hamburger');
  const navMenu   = $('#nav-links');

  // Scrolled state
  const handleScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    backTop.classList.toggle('visible', y > 400);
    highlightActiveLink();
  };

  // Active section highlight
  const sections = $$('section[id]');
  const highlightActiveLink = () => {
    const offset = 80;
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on nav link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Back to top
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── Smooth Scroll for all anchor links ────────────────────────────
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64');
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

// ── Intersection Observer: Reveal Animations ───────────────────────
(function initReveal() {
  const revealEls = [
    ...$$('.skill-card'),
    ...$$('.project-card'),
    ...$$('.timeline-item'),
    ...$$('.cert-card'),
    ...$$('.platform-card'),
    ...$$('.stat-item'),
    $('#hero-cta-writeups'),
    $('#hero-cta-contact'),
  ].filter(Boolean);

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => obs.observe(el));
})();

// ── Counter Animation (Hero Stats) ────────────────────────────────
(function initCounters() {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 900;
    const step = 16;
    const steps = Math.ceil(duration / step);
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current);
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, step);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

// ── Project Filter ─────────────────────────────────────────────────
(function initProjectFilter() {
  const buttons     = $$('.filter-btn');
  const cards       = $$('.project-card');
  const wrapEl      = $('#show-more-wrap');
  const btnEl       = $('#show-more-btn');
  const btnText     = $('#show-more-text');
  const btnIcon     = $('#show-more-icon');
  const MAX_VISIBLE = 6;

  let currentFilter = 'all';
  let isExpanded    = false;

  const applyFilter = () => {
    const matching = cards.filter(c =>
      currentFilter === 'all' || c.dataset.category === currentFilter
    );
    const nonMatching = cards.filter(c =>
      currentFilter !== 'all' && c.dataset.category !== currentFilter
    );

    // Hide cards that don't match the filter
    nonMatching.forEach(c => c.classList.add('hidden-card'));

    // Show/limit matching cards
    matching.forEach((c, i) => {
      const overLimit = !isExpanded && i >= MAX_VISIBLE;
      if (overLimit) {
        c.classList.add('hidden-card');
      } else {
        c.classList.remove('hidden-card');
        requestAnimationFrame(() => c.classList.add('in-view'));
      }
    });

    // Show/hide the "Tümünü Göster" button
    if (wrapEl) {
      const needsButton = matching.length > MAX_VISIBLE;
      wrapEl.style.display = needsButton ? 'flex' : 'none';
      if (needsButton) {
        const remaining = matching.length - MAX_VISIBLE;
        btnText.textContent = isExpanded
          ? 'Daha Az Göster'
          : `Tümünü Göster (${remaining} daha)`;
        btnIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      isExpanded = false;
      applyFilter();
    });
  });

  if (btnEl) {
    btnEl.addEventListener('click', () => {
      isExpanded = !isExpanded;
      applyFilter();
    });
  }

  // Initial state
  applyFilter();
})();

// ── Contact Form Validation ────────────────────────────────────────
(function initContactForm() {
  const form    = $('#contact-form');
  if (!form) return;

  const fields  = {
    name:    { el: $('#form-name'),    err: $('#err-name'),    msg: 'İsim alanı boş bırakılamaz.' },
    email:   { el: $('#form-email'),   err: $('#err-email'),   msg: 'Geçerli bir e-posta adresi girin.' },
    subject: { el: $('#form-subject'), err: $('#err-subject'), msg: 'Konu alanı boş bırakılamaz.' },
    message: { el: $('#form-message'), err: $('#err-message'), msg: 'Mesaj alanı boş bırakılamaz.' },
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let valid = true;
    Object.entries(fields).forEach(([key, f]) => {
      const val = f.el.value.trim();
      let err = '';
      if (!val) {
        err = f.msg;
        valid = false;
      } else if (key === 'email' && !emailRegex.test(val)) {
        err = 'Geçerli bir e-posta adresi girin.';
        valid = false;
      }
      f.err.textContent = err;
      f.el.classList.toggle('error', !!err);
    });
    return valid;
  };

  // Real-time inline validation on blur
  Object.entries(fields).forEach(([key, f]) => {
    f.el.addEventListener('blur', () => {
      const val = f.el.value.trim();
      let err = '';
      if (!val) err = f.msg;
      else if (key === 'email' && !emailRegex.test(val)) err = 'Geçerli bir e-posta adresi girin.';
      f.err.textContent = err;
      f.el.classList.toggle('error', !!err);
    });
    f.el.addEventListener('input', () => {
      if (f.el.classList.contains('error') && f.el.value.trim()) {
        f.err.textContent = '';
        f.el.classList.remove('error');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn  = $('#form-submit');
    const submitText = $('#submit-text');
    const submitOk   = $('#submit-ok');

    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    submitOk.classList.remove('hidden');

    // Reset after 3s
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitOk.classList.add('hidden');
      Object.values(fields).forEach(f => {
        f.el.classList.remove('error');
        f.err.textContent = '';
      });
    }, 3000);
  });
})();

// ── Terminal Typewriter (on hover / auto) ─────────────────────────
(function initTerminalTypewriter() {
  const terminal = $('#terminal-body');
  if (!terminal) return;

  const commands = [
    { cmd: 'nmap -sV -p- 10.10.10.1', out: 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9p1\n80/tcp open  http    Apache httpd 2.4.54' },
    { cmd: 'python3 exploit.py --target 10.10.10.1', out: '[*] Bağlantı kuruldu...\n[+] Shell alındı — uid=0(root)' },
    { cmd: 'cat /etc/passwd | head -3', out: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin' },
    { cmd: 'sqlmap -u "http://target.local/?id=1" --dbs', out: '[INFO] Hedef görünüyor savunmasız\n[+] Veritabanları: admin_db, users' },
  ];

  let cmdIndex = 0;
  let isAnimating = false;
  let animTimeout = null;

  const promptLine = terminal.querySelector('.t-cmd.t-cursor')?.closest('.t-line');

  const clearDynamic = () => {
    $$('.t-dynamic', terminal).forEach(el => el.remove());
  };

  const typeCommand = (text, callback) => {
    if (!promptLine) return;
    const cmdEl = promptLine.querySelector('.t-cmd');
    const cursor = promptLine.querySelector('.t-cursor');
    if (cursor) cursor.style.display = 'none';
    cmdEl.textContent = '';

    let i = 0;
    const type = () => {
      if (i < text.length) {
        cmdEl.textContent += text[i++];
        animTimeout = setTimeout(type, 90);          // was 55ms → softer typing
      } else {
        if (cursor) cursor.style.display = '';
        if (callback) animTimeout = setTimeout(callback, 500); // was 300ms
      }
    };
    type();
  };

  const showOutput = (text, callback) => {
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      const div = document.createElement('div');
      div.className = 't-line t-out t-dynamic';
      div.textContent = line;
      div.style.opacity = '0';
      div.style.transition = 'opacity 0.4s ease';   // smooth fade-in
      terminal.insertBefore(div, promptLine);
      animTimeout = setTimeout(() => { div.style.opacity = '1'; }, idx * 140); // was 80ms
    });
    if (callback) animTimeout = setTimeout(callback, lines.length * 140 + 700); // was +400
  };

  const runNext = () => {
    if (isAnimating) return;
    isAnimating = true;
    clearDynamic();

    const { cmd, out } = commands[cmdIndex % commands.length];
    cmdIndex++;

    typeCommand(cmd, () => {
      showOutput(out, () => {
        isAnimating = false;
        animTimeout = setTimeout(runNext, 3800); // was 2800ms
      });
    });
  };

  // Start after initial delay
  animTimeout = setTimeout(runNext, 2200);
})();
