/* Esfahani Lab · site behaviour (no dependencies) */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Theme toggle (remembers choice; falls back to system) */
  const root = document.documentElement;
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  $$('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  }));

  /* Header shadow + mobile nav */
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = $('[data-nav-toggle]'), nav = $('#site-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  /* Reveal on scroll */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
    setTimeout(() => revealEls.forEach(el => el.classList.add('is-visible')), 2500); /* safety net */
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  /* Publications: highlight lab authors, expand author lists, filter + search */
  const HIGHLIGHT = /(Shahrokh Esfahani M\b|Esfahani MS?\b|Esfahani M\b)/g;
  $$('.pub-authors').forEach(el => {
    el.innerHTML = el.textContent.replace(HIGHLIGHT, '<b>$1</b>');
    const btn = el.parentElement.querySelector('.expand');
    if (btn) {
      requestAnimationFrame(() => { if (el.scrollHeight <= el.clientHeight + 2) btn.hidden = true; });
      btn.addEventListener('click', () => { const open = el.classList.toggle('is-open'); btn.textContent = open ? 'fewer authors' : 'all authors'; });
    }
  });
  const pubList = $('[data-pub-list]');
  if (pubList) {
    const search = $('[data-pub-search]'); const segs = $$('[data-pub-filter] button');
    let type = 'all', q = '';
    const apply = () => {
      $$('.pub', pubList).forEach(p => {
        const okType = type === 'all' || p.dataset.type === type;
        const okQ = !q || p.textContent.toLowerCase().includes(q);
        p.hidden = !(okType && okQ);
      });
      $$('.pub-year', pubList).forEach(y => { y.hidden = !$$('.pub:not([hidden])', y).length; });
      const n = $$('.pub:not([hidden])', pubList).length; const c = $('[data-pub-count]'); if (c) c.textContent = n + (n === 1 ? ' item' : ' items');
    };
    segs.forEach(b => b.addEventListener('click', () => { segs.forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); type = b.dataset.value; apply(); }));
    if (search) search.addEventListener('input', () => { q = search.value.trim().toLowerCase(); apply(); });
    apply();
  }

  /* Hero: drifting cell-free DNA fragments */
  const canvas = $('[data-hero-canvas]');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, dpr, frags = [], raf;
    const css = () => getComputedStyle(root);
    const palette = () => ({ ink: css().getPropertyValue('--ink').trim(), accent: css().getPropertyValue('--accent').trim(), signal: css().getPropertyValue('--signal').trim() });
    let pal = palette();
    const rand = (a, b) => a + Math.random() * (b - a);
    function make() {
      const isTumor = Math.random() < 0.12;
      const len = isTumor ? rand(60, 110) : rand(90, 150);       /* tumor-derived fragments run shorter */
      return { x: rand(-100, W + 100), y: rand(-50, H + 50), len, ang: rand(-0.35, 0.35), vx: rand(-0.12, 0.12), vy: rand(-0.06, 0.06), vr: rand(-0.0008, 0.0008), tumor: isTumor, beads: Math.random() < 0.7 ? 1 : 2, alpha: isTumor ? rand(0.45, 0.8) : rand(0.14, 0.32) };
    }
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(130, (W * H) / 11000));
      frags = Array.from({ length: n }, make);
      pal = palette();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const f of frags) {
        if (!reduceMotion) { f.x += f.vx; f.y += f.vy; f.ang += f.vr; }
        if (f.x < -200) f.x = W + 150; if (f.x > W + 200) f.x = -150;
        if (f.y < -120) f.y = H + 80; if (f.y > H + 120) f.y = -80;
        ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.ang); ctx.globalAlpha = f.alpha;
        const col = f.tumor ? pal.accent : pal.ink;
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-f.len / 2, 0); ctx.lineTo(f.len / 2, 0); ctx.stroke();
        /* nucleosome core(s): the ~147 bp wrapped around a histone octamer */
        const r = 5.2;
        if (f.beads === 1) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(-f.len / 4, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(f.len / 4, 0, r, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
    new MutationObserver(() => { pal = palette(); if (reduceMotion) draw(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { pal = palette(); if (reduceMotion) draw(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduceMotion) raf = requestAnimationFrame(draw); });
  }
})();
