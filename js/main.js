/* ============================================
   GREY INK PROJECTS - Main JS v3
   ============================================ */

// ---- Loader ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

// ---- Hero background video (lazy-loaded, respects reduced motion) ----
(function() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // poster/fallback image remains visible

  const startVideo = () => {
    if (video.getAttribute('data-loading') === 'true') return;
    video.setAttribute('data-loading', 'true');
    video.addEventListener('canplay', () => video.classList.add('loaded'), { once: true });
    video.preload = 'auto';
    video.load();
    video.play().catch(() => {
      // Autoplay blocked — fallback poster image stays visible, no error surfaced to user
    });
  };

  // Defer loading the video until the page has finished loading so it never
  // competes with critical above-the-fold resources.
  if (document.readyState === 'complete') {
    startVideo();
  } else {
    window.addEventListener('load', startVideo, { once: true });
  }
})();

// ---- Navigation ----
(function() {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.style.display = isOpen ? 'flex' : 'none';
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileMenu.style.display = 'none';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }
})();

// ---- Scroll Reveal ----
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ---- Typing animation ----
(function() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = ['Web Development', 'Shopify Stores', 'Site Deployment', 'Site Management', 'Brand Strategy'];
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) { deleting = true; setTimeout(type, 1600); return; }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  setTimeout(type, 3200);
})();

// ---- FAQ Accordion ----
(function() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    };

    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();

// ---- Particle canvas ----
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 50; i++) {
    particles.push({ x: Math.random()*1400, y: Math.random()*900, r: Math.random()*1.3+0.3, vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25, alpha: Math.random()*0.35+0.08 });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(91,156,246,${p.alpha})`; ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(91,156,246,${0.05*(1-dist/110)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---- Contact Form ----
(function() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  const INSTANTDB_APP_ID = '42fc606b-da0f-4373-bbb7-86a4d564b49b';
  const EMAIL_GMAIL      = 'greyinkagency@gmail.com';
  const EMAIL_OUTLOOK    = 'greyinkagency@outlook.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn    = form.querySelector('.form-submit-btn');
    const status = document.getElementById('formStatus');
    const saved  = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled  = true;
    status.className   = 'form-status';
    status.textContent = '';

    const data = {
      name:      form.querySelector('#name').value.trim(),
      email:     form.querySelector('#email').value.trim(),
      phone:     form.querySelector('#phone').value.trim()   || 'N/A',
      company:   form.querySelector('#company').value.trim() || 'N/A',
      service:   form.querySelector('#service').value,
      message:   form.querySelector('#message').value.trim(),
      timestamp: new Date().toISOString()
    };

    if (!data.name || !data.email || !data.service || !data.message) {
      status.textContent = 'Please fill in all required fields.';
      status.className   = 'form-status show error';
      btn.innerHTML = saved; btn.disabled = false;
      return;
    }

    const subject = `New Inquiry from ${data.name} - Grey Ink Projects`;
    let emailOk = false;
    let dbOk    = false;

    // ── 1. INSTANTDB ──────────────────────────────────────────
    // Using the permissioned client SDK endpoint
    try {
      const id = self.crypto.randomUUID();
      const res = await fetch('https://api.instantdb.com/admin/transact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: INSTANTDB_APP_ID,
          steps: [{ action: 'update', ns: 'inquiries', id, args: { ...data, status: 'new' } }]
        })
      });
      if (res.ok) dbOk = true;
    } catch (_) {}

    // ── 2. EMAIL via EmailJS ───────────────────────────────────
    // EmailJS Public Key + Service ID + Template ID
    // These are set in SETUP_INSTRUCTIONS.txt — owner must create free account
    // and paste their own keys. The code below is ready — just fill in the keys.
    const EMAILJS_PUBLIC_KEY  = window.EMAILJS_PUBLIC_KEY  || '';
    const EMAILJS_SERVICE_ID  = window.EMAILJS_SERVICE_ID  || '';
    const EMAILJS_TEMPLATE_ID = window.EMAILJS_TEMPLATE_ID || '';

    if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
      try {
        // EmailJS browser SDK loaded from CDN in HTML
        await emailjs.init(EMAILJS_PUBLIC_KEY);
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name:  data.name,
          from_email: data.email,
          to_email:   EMAIL_GMAIL,
          cc_email:   EMAIL_OUTLOOK,
          phone:      data.phone,
          company:    data.company,
          service:    data.service,
          message:    data.message,
          timestamp:  data.timestamp,
          subject:    subject
        });
        emailOk = true;
      } catch (_) {}
    }

    // ── 3. FALLBACK — FormSubmit (no-JS form POST) ─────────────
    // Works even without EmailJS configured. Uses multipart/form-data
    // which bypasses CORS preflight issues.
    if (!emailOk) {
      try {
        const fd = new FormData();
        fd.append('name',      data.name);
        fd.append('email',     data.email);
        fd.append('phone',     data.phone);
        fd.append('company',   data.company);
        fd.append('service',   data.service);
        fd.append('message',   data.message);
        fd.append('_subject',  subject);
        fd.append('_cc',       EMAIL_OUTLOOK);
        fd.append('_captcha',  'false');
        fd.append('_template', 'table');
        fd.append('_next',     'https://greyinkprojects.co.za');

        const r = await fetch(`https://formsubmit.co/${EMAIL_GMAIL}`, {
          method: 'POST',
          body:   fd
        });
        // FormSubmit returns redirect HTML on success — status 200 means it accepted
        if (r.status === 200 || r.redirected) emailOk = true;
      } catch (_) {}
    }

    // ── 4. FEEDBACK ────────────────────────────────────────────
    if (emailOk || dbOk) {
      status.textContent = 'Inquiry received. We will be in touch within 24 hours.';
      status.className   = 'form-status show';
      form.reset();
    } else {
      // Last resort — pre-filled mailto link so nothing is lost
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company}\nService: ${data.service}\n\nMessage:\n${data.message}`
      );
      status.innerHTML = `Automatic sending failed. <a href="mailto:${EMAIL_GMAIL}?cc=${EMAIL_OUTLOOK}&subject=${encodeURIComponent(subject)}&body=${body}" style="color:var(--blue-dim);text-decoration:underline;">Click here to send via your email app</a> or WhatsApp us on <a href="https://wa.me/27605406057" style="color:var(--blue-dim);">060 540 6057</a>.`;
      status.className = 'form-status show error';
    }

    btn.innerHTML = saved;
    btn.disabled  = false;
  });
})();

// ---- Cookie Consent Banner ----
(function() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  if (!banner || !acceptBtn) return;

  const STORAGE_KEY = 'gip_cookie_consent';
  let hasConsented = false;
  try { hasConsented = localStorage.getItem(STORAGE_KEY) === 'accepted'; } catch (_) {}

  if (!hasConsented) {
    setTimeout(() => { banner.hidden = false; }, 1200);
  }

  acceptBtn.addEventListener('click', () => {
    banner.hidden = true;
    try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch (_) {}
  });
})();

// ---- Smooth anchor scrolling ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
