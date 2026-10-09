/* =========================================================
   NEW DETROIT — main.js (shared engine, every page)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const ND = (window.ND = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  ND.$ = $; ND.$$ = $$;
  ND.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  ND.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  ND.hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  ND.motion = ND.hasGsap && !ND.reduced;
  document.documentElement.classList.toggle('motion', ND.motion);

  // storage that never throws (private mode, blocked storage…)
  ND.store = {
    get(k, s = localStorage) { try { return s.getItem('nd-' + k); } catch (e) { return null; } },
    set(k, v, s = localStorage) { try { s.setItem('nd-' + k, v); } catch (e) {} },
  };

  if (ND.hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !ND.reduced) {
    ND.lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    if (ND.hasGsap) {
      ND.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => ND.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { ND.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  ND.scrollTo = (target) => {
    if (ND.lenis) ND.lenis.scrollTo(target, { duration: 1.6 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else (typeof target === 'string' ? $(target) : target)?.scrollIntoView({ behavior: 'smooth' });
  };
  $$('[data-scrollto]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    ND.scrollTo(id === '#top' ? 0 : id);
  }));

  /* =========================================================
     TEXTURES — generated once, shared through CSS variables
     ========================================================= */
  const root = document.documentElement.style;

  // film grain
  const noise = () => {
    const c = document.createElement('canvas'); c.width = c.height = 180;
    const x = c.getContext('2d'); const d = x.createImageData(180, 180);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = Math.random() < .5 ? 38 : 0;
    }
    x.putImageData(d, 0, 0);
    return c.toDataURL();
  };

  // chantilly lace: tulle net + flower + scallops, as an svg tile
  const lace = () => {
    const ink = '#0a0a0a';
    const petals = Array.from({ length: 8 }, (_, i) => `<ellipse cx="60" cy="42" rx="7" ry="16" transform="rotate(${i * 45} 60 60)"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs><pattern id="n" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <path d="M0 4h8M4 0v8" stroke="${ink}" stroke-width=".55" opacity=".55" fill="none"/></pattern></defs>
      <rect width="120" height="120" fill="url(#n)"/>
      <g fill="${ink}" stroke="${ink}" stroke-width="1">${petals}</g>
      <circle cx="60" cy="60" r="9" fill="#f6f2e8" stroke="${ink}" stroke-width="2.5"/>
      <circle cx="60" cy="60" r="3" fill="${ink}"/>
      <g fill="none" stroke="${ink}" stroke-width="2.2">
        <path d="M0 0c10 14 20 14 30 0M90 0c10 14 20 14 30 0M0 120c10-14 20-14 30 0M90 120c10-14 20-14 30 0"/>
        <path d="M0 30c14 10 14 20 0 30M120 30c-14 10-14 20 0 30M0 60c14 10 14 20 0 30M120 60c-14 10-14 20 0 30"/>
      </g>
      <g fill="${ink}"><circle cx="15" cy="15" r="3"/><circle cx="105" cy="15" r="3"/><circle cx="15" cy="105" r="3"/><circle cx="105" cy="105" r="3"/></g>
      <g fill="none" stroke="${ink}" stroke-width="1.6"><path d="M15 15c8 6 14 4 18-4M105 105c-8-6-14-4-18 4M105 15c-6 8-4 14 4 18M15 105c6-8 4-14-4-18"/></g>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/\s{2,}/g, ' '));
  };

  try {
    root.setProperty('--noise', `url(${noise()})`);
    root.setProperty('--tex-lace', `url("${lace()}")`);
  } catch (e) {}

  /* ---------- arriving with #section: land on it once the page has its real height ---------- */
  if (location.hash.length > 1) {
    window.addEventListener('load', () => setTimeout(() => {
      const t = document.getElementById(location.hash.slice(1));
      if (!t) return;
      ND.hasGsap && ScrollTrigger.refresh();
      if (ND.lenis) { ND.lenis.resize(); ND.lenis.scrollTo(t, { immediate: true, offset: -10 }); } else t.scrollIntoView();
    }, 80));
  }

  /* ---------- clock: it is always 2 AM in New Detroit ---------- */
  const clock = $('#clock');
  const tick = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    if (clock) clock.textContent = `02:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  };
  tick(); setInterval(tick, 1000);

  /* ---------- header: hide on scroll down ---------- */
  const hdr = $('#hdr');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hdr?.classList.toggle('is-hidden', y > 260 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });

  /* ---------- nav: caps roll into kanji ---------- */
  $$('.hdr-nav a').forEach((a) => {
    const t = a.textContent.trim();
    a.innerHTML = `<span class="roll"><span>${t}</span><span aria-hidden="true">${a.dataset.jp || t}</span></span>`;
  });

  /* ---------- mobile menu ---------- */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger?.setAttribute('aria-expanded', open);
    menu?.setAttribute('aria-hidden', !open);
    if (ND.lenis) open ? ND.lenis.stop() : ND.lenis.start();
    if (open && ND.hasGsap && !ND.reduced) gsap.fromTo('.menu-list a', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .06, ease: 'expo.out', delay: .2 });
  };
  burger?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- toast ---------- */
  let toastT;
  ND.toast = (msg, ms = 2800) => {
    const t = $('#toast'); if (!t) return;
    t.innerHTML = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), ms);
  };

  // pages still being shot: say so instead of a 404
  const soon = ['still in the edit suite', 'scene not shot yet', 'the location scout is still out', 'that set is being dressed'];
  $$('[data-soon]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const c = (a.querySelector('.roll > span') || a).cloneNode(true);
    c.querySelectorAll('i').forEach((i) => i.remove());
    const label = c.textContent.replace(/[\[\]]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    ND.toast(`■ ${label} — ${soon[Math.random() * soon.length | 0]}`);
  }));

  /* ---------- camera flash ---------- */
  ND.flash = (strength = 1) => {
    const f = $('#flash'); if (!f || ND.reduced) return;
    if (ND.hasGsap) gsap.fromTo(f, { opacity: .95 * strength }, { opacity: 0, duration: .7, ease: 'power2.out' });
  };

  /* ---------- page transitions: the shutter closes ---------- */
  $$('a[href$=".html"]:not([data-soon])').forEach((a) => a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || a.target === '_blank' || !ND.hasGsap || ND.reduced) return;
    e.preventDefault();
    const href = a.href;
    gsap.to('.shutter i', { scaleY: 1, duration: .55, ease: 'expo.inOut', onComplete: () => { location.href = href; } });
  }));
  window.addEventListener('pageshow', () => { if (ND.hasGsap) gsap.set('.shutter i', { scaleY: 0 }); });
  // inner pages arrive through the shutter (the home has its own loader)
  if (document.body.dataset.page !== 'home' && ND.motion) gsap.fromTo('.shutter i', { scaleY: 1 }, { scaleY: 0, duration: .9, ease: 'expo.inOut', delay: .1 });

  /* ---------- image slots: drop a file at data-img and it shows up ---------- */
  // while the home loader runs, only the hero photos load: the rest waits so the fill stays smooth
  const waiting = [];
  $$('.slot').forEach((slot) => {
    if (document.body.classList.contains('is-loading') && !slot.closest('#hero')) waiting.push(slot);
    else slotInit(slot);
  });
  if (waiting.length) {
    let done = false;
    const release = () => { if (done) return; done = true; waiting.forEach(slotInit); };
    window.addEventListener('nd:ready', release, { once: true });
    setTimeout(release, 6000);
  }
  function slotInit(slot) {
    if (slot.dataset.ratio) slot.style.setProperty('--ratio', slot.dataset.ratio.replace('/', ' / '));
    const src = slot.dataset.img; if (!src) return;
    const img = new Image();
    img.decoding = 'async';
    img.alt = slot.dataset.alt || '';
    if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos;
    img.onload = () => {
      slot.prepend(img);
      slot.classList.add('has-img');
      slot.dispatchEvent(new CustomEvent('slot:loaded', { detail: { img } }));
      if (ND.hasGsap) ScrollTrigger.refresh();
    };
    // optional stand-in until the dedicated file exists
    img.onerror = () => { const fb = slot.dataset.fallback; if (fb && !img.src.endsWith(fb)) img.src = fb; };
    img.src = src;
  }
  ND.slot = slotInit;

  /* ---------- split text: words in masks, revealed on enter ---------- */
  ND.split = (el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part;
            w.append(wi); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return $$('.wi', el);
  };
  if (ND.motion) {
    $$('[data-split]').forEach((el) => {
      const words = ND.split(el);
      // from-state is only set when it enters: text is never hidden by default
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.fromTo(words, { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: .045, ease: 'expo.out' }),
      });
    });
  }

  /* ---------- stretched titles: scaleY doesn't take space, so reserve it ---------- */
  const STRETCH = 1.32;
  const reserve = () => $$('.sec-title, [data-stretch]').forEach((t) => { t.style.marginBottom = (t.offsetHeight * (STRETCH - 1) + 22) + 'px'; });
  ND.reserve = reserve;
  reserve();
  document.fonts?.ready.then(reserve);
  window.addEventListener('resize', reserve);

  /* ---------- magnetic buttons ---------- */
  if (ND.fine && ND.hasGsap && !ND.reduced) {
    $$('[data-magnetic]').forEach((el) => {
      const qx = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.4)' });
      const qy = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * .3); qy((e.clientY - r.top - r.height / 2) * .4);
      });
      el.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
  }

  /* ---------- marquee tape: speeds up + skews with scroll ---------- */
  if (ND.motion) {
    $$('.tape-track').forEach((track) => {
      const loop = gsap.to(track, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
      let skewTo = gsap.quickTo(track, 'skewX', { duration: .4 });
      ScrollTrigger.create({
        trigger: track, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity();
          loop.timeScale(1 + Math.min(Math.abs(v) / 300, 6) * (v < 0 ? -1 : 1));
          skewTo(gsap.utils.clamp(-12, 12, v / -200));
        },
      });
      setInterval(() => { if (Math.abs(loop.timeScale()) > 1.05 || loop.timeScale() < 0) gsap.to(loop, { timeScale: 1, duration: .8 }); skewTo(0); }, 400);
    });
  }

  /* =========================================================
     POSTER TYPE — stretched red letters shared by every page
     ========================================================= */
  // fit a word edge to edge, then stretch it tall like a wheatpaste poster
  // sets the font-size on `el` and the vertical stretch as --sy on `host`
  ND.stretch = (el, host = el.parentElement, { width = .94, height = .62, maxY = 3.4 } = {}) => {
    el.style.fontSize = '100px';
    const fs = 100 * (innerWidth * width) / el.offsetWidth; // offsetWidth ignores the stretch transform
    el.style.fontSize = fs + 'px';
    const cap = fs * .74;
    const sy = Math.min(maxY, Math.max(1, (innerHeight * height) / cap));
    host.style.setProperty('--sy', sy.toFixed(3));
  };

  // letters near the cursor stretch taller, like pulling wet paste (hero + footer)
  ND.pull = (letters, area, ready = () => true) => {
    if (!ND.motion || !ND.fine) return;
    const qs = letters.map((l) => gsap.quickTo(l, 'scaleY', { duration: .6, ease: 'power3.out' }));
    area.addEventListener('pointermove', (e) => {
      if (!ready()) return;
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2)) / innerWidth;
        qs[i](1 + Math.max(0, .32 - d) * 1.1);
      });
    });
    area.addEventListener('pointerleave', () => { if (ready()) qs.forEach((q) => q(1)); });
  };
  ND.letterize = (el) => {
    el.innerHTML = [...el.textContent].map((c) => (c === ' ' ? '<i>&nbsp;</i>' : `<i>${c}</i>`)).join('');
    return $$('i', el);
  };

  // a page opener: one word stretched in red over a photo (inner pages)
  // section holds a .slot, .hero-ask, a neon sign, a foot block and the title line
  ND.poster = ({ section, inner, line, neon, foot, height = .36 }) => {
    const sec = $(section), inn = $(inner), ln = $(line);
    if (!sec || !inn || !ln) return;
    const letters = ND.letterize(inn);
    const fit = () => {
      ND.stretch(inn, ln, { width: .95, height: innerWidth < 600 ? .2 : height, maxY: 4 });
      ln.style.height = (inn.offsetHeight * parseFloat(ln.style.getPropertyValue('--sy'))) + 'px';
    };
    fit();
    document.fonts?.ready.then(() => { fit(); ND.hasGsap && ScrollTrigger.refresh(); });
    window.addEventListener('resize', fit);
    let ready = !ND.motion;
    ND.pull(letters, sec, () => ready);
    if (!ND.motion) return;
    const tl = gsap.timeline({ delay: .35, defaults: { ease: 'expo.out' }, onComplete: () => { ready = true; } })
      .fromTo($(':scope > .slot', sec), { scale: 1.25 }, { scale: 1.04, duration: 2.4 }, 0)
      .fromTo(letters, { scaleY: 0 }, { scaleY: 1, duration: 1.2, stagger: { each: .05, from: 'random' } }, .2)
      .fromTo($$('.hero-ask-row > span', sec), { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .04 }, .4);
    if (neon) tl.fromTo(neon, { xPercent: 160 }, { xPercent: 0, duration: 1 }, .6);
    if (foot) tl.fromTo(foot, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1 }, .7);
    gsap.to(letters, {
      yPercent: -200, stagger: { each: .02, from: 'random' }, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: 1 },
    });
  };

  /* ---------- paper tearing (home wall + events wall) ---------- */
  // a torn seam: a slow wander plus tiny fibrous teeth, as % points top → bottom
  ND.seam = (x0 = 50) => {
    const pts = [];
    let wander = 0;
    for (let y = 0; y <= 100; y += 1.6) {
      wander += (Math.random() - .5) * 2.4;
      wander = Math.max(-9, Math.min(9, wander));
      const tooth = (Math.random() < .35 ? (Math.random() - .5) * 3.2 : (Math.random() - .5) * .9);
      pts.push([Math.max(3, Math.min(97, x0 + wander + tooth)), Math.min(100, y)]);
    }
    pts[pts.length - 1][1] = 100;
    return pts;
  };
  ND.seamClip = (pts, side) => {
    const z = pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ');
    return side === 'L' ? `polygon(0% 0%, ${z}, 0% 100%)` : `polygon(${z}, 100% 100%, 100% 0%)`;
  };
  // the white back of the paper showing along the tear (the clip cuts it to a rim)
  ND.tearRim = (el, pts) => {
    const d = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    const rim = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rim.setAttribute('viewBox', '0 0 100 100');
    rim.setAttribute('preserveAspectRatio', 'none');
    rim.setAttribute('class', 'tear-rim');
    rim.innerHTML = `<polyline points="${d}" fill="none" stroke="#efe9dc" stroke-width="7" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
      <polyline points="${d}" fill="none" stroke="#c9c1b0" stroke-width="2.5" stroke-dasharray="1 3" vector-effect="non-scaling-stroke"/>`;
    el.append(rim);
    const shade = document.createElement('i');
    shade.className = 'tear-shade';
    el.append(shade);
  };

  /* ---------- the key to the city: chrome, layered in 3D, drag to spin ---------- */
  let keyUid = 0;
  ND.key3d = (stage, inner, { tilt, layers = 9 } = {}) => {
    const uid = 'k' + (++keyUid);
    const C = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0Z`;
    const bx = 120, by = 120;
    const parts = [
      C(bx, by, 80) + C(bx, by, 52),                                   // bow ring
      C(bx - 90, by, 25) + C(bx - 90, by, 10),                          // lobes
      C(bx, by - 90, 25) + C(bx, by - 90, 10),
      C(bx, by + 90, 25) + C(bx, by + 90, 10),
      `M${bx - 4},${by - 54}h8v108h-8z`, `M${bx - 54},${by - 4}h108v8h-108z`, // cross in the bow
      C(bx, by, 14) + C(bx, by, 6),
      `M${bx + 56},${by - 26}l12,-6 4,6 -4,6z`, `M${bx + 56},${by + 26}l12,6 4,-6 -4,-6z`, // spikes
      `M196,${by - 22}h22v44h-22z`, `M226,${by - 16}h12v32h-12z`,       // collar
      `M210,${by - 11}h270a11,11 0 0 1 0,22h-270z`,                     // shaft
      `M318,${by - 15}h10v30h-10z`,                                     // ring on the shaft
      `M398,${by + 11}v44h16v-14h14v30h16v-22h14v12h16v-50z`,           // bit
    ];
    const chrome = `<linearGradient id="${uid}-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".22" stop-color="#b9b9b9"/><stop offset=".45" stop-color="#f5f5f2"/><stop offset=".55" stop-color="#4a4a4a"/><stop offset=".72" stop-color="#d8d8d4"/><stop offset="1" stop-color="#7a7a7a"/></linearGradient>`;
    const svgOf = (fill, face) => `
      <svg viewBox="-10 0 520 240" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>${chrome}${face ? `<clipPath id="${uid}-${face}">${parts.map((d) => `<path d="${d}" clip-rule="evenodd"/>`).join('')}</clipPath>
          <linearGradient id="${uid}-s${face}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
          <path id="${uid}-arc${face}" d="M${bx - 66},${by} a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0"/>` : ''}</defs>
        <g fill="${fill === 'chrome' ? `url(#${uid}-c)` : fill}" fill-rule="evenodd">${parts.map((d) => `<path d="${d}"/>`).join('')}</g>
        ${face === 'f' ? `<g class="key-eng" fill="#2a2a2a" font-family="Oswald, Arial Narrow, sans-serif" font-weight="700" letter-spacing="2">
          <text font-size="11"><textPath href="#${uid}-arcf" startOffset="0">NEW DETROIT · 新デトロイト · STAY SHINING ·</textPath></text>
          <text class="key-name" x="250" y="${by + 5}" font-size="14"></text>
          <text class="key-no" x="425" y="${by + 6}" font-size="11" text-anchor="middle"></text>
        </g>` : ''}
        ${face ? `<g clip-path="url(#${uid}-${face})"><rect class="key-sheen" x="-200" y="-20" width="110" height="280" fill="url(#${uid}-s${face})" transform="skewX(-20)"/></g>` : ''}
      </svg>`;
    for (let i = 0; i < layers; i++) {
      const edge = i === 0 || i === layers - 1;
      const wrap = document.createElement('div');
      const g = 60 + i * 6;
      wrap.innerHTML = svgOf(edge ? 'chrome' : `rgb(${g},${g},${g})`, edge ? (i ? 'f' : 'b') : '');
      const s = wrap.firstElementChild;
      s.style.transform = `translateZ(${(i - (layers - 1) / 2) * 1.6}px)`;
      inner.append(s);
    }
    const sheens = $$('.key-sheen', inner);
    const front = inner.lastElementChild;
    const k = { ry: 24, rx: 0, vel: 0, base: .55, drag: false, last: 0, visible: false };
    const draw = () => {
      inner.style.transform = `rotateX(${k.rx}deg) rotateY(${k.ry}deg)`;
      const a = ((k.ry % 360) + 360) % 360;
      sheens.forEach((s) => s.setAttribute('x', (a / 360) * 900 - 250));
    };
    draw();
    if (ND.motion) {
      new IntersectionObserver(([e]) => { k.visible = e.isIntersecting; }).observe(stage);
      gsap.ticker.add(() => {
        if (!k.visible) return;
        if (!k.drag) { k.vel += (k.base - k.vel) * .03; k.ry += k.vel; }
        draw();
      });
      stage.addEventListener('pointerdown', (e) => { k.drag = true; k.last = e.clientX; try { stage.setPointerCapture(e.pointerId); } catch (_) {} });
      stage.addEventListener('pointermove', (e) => { if (k.drag) { const dx = e.clientX - k.last; k.last = e.clientX; k.vel = dx * .8; k.ry += k.vel; } });
      const up = () => { k.drag = false; };
      stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
      if (ND.fine && tilt) tilt.addEventListener('pointermove', (e) => { k.rx = (e.clientY / innerHeight - .5) * -24; });
    }
    return {
      kick: (v) => { k.vel = v; },
      engrave: (name = '', no = '') => {
        $('.key-name', front).textContent = name.toUpperCase();
        $('.key-no', front).textContent = no;
      },
      // a flat chrome front, ready to be drawn on a canvas
      svg: () => new XMLSerializer().serializeToString(front),
    };
  };

  // LED scramble for boards and screens: letters settle left to right
  const LED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソタチツテト';
  ND.scramble = (el, text, ms = 700) => {
    if (!ND.motion) { el.textContent = text; return; }
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      const n = Math.floor(text.length * k);
      el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (c === ' ' ? ' ' : LED[Math.random() * LED.length | 0])).join('');
      if (k < 1) requestAnimationFrame(step);
    };
    step();
  };

  /* =========================================================
     FOOTER — STAY SHINING stretched over the crowd, pulls toward you
     ========================================================= */
  const ftWord = $('#ftWord'), ftIn = ftWord && $('.ft-word-in', ftWord);
  if (ftWord) {
    const ftLetters = ND.letterize(ftIn);
    const fitFt = () => ND.stretch(ftIn, ftWord, { width: .93, height: innerWidth < 700 ? .42 : .5, maxY: 5 });
    fitFt();
    document.fonts?.ready.then(fitFt);
    window.addEventListener('resize', fitFt);

    if (ND.motion) {
      let ready = false;
      ScrollTrigger.create({
        trigger: '#ftPoster', start: 'top 70%', once: true,
        onEnter: () => {
          gsap.fromTo(ftLetters, { scaleY: 0 }, { scaleY: 1, duration: 1.3, stagger: { each: .05, from: 'random' }, ease: 'expo.out', onComplete: () => { ready = true; } });
          gsap.fromTo('.ft-ask-row > span', { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .04, ease: 'expo.out', delay: .3 });
        },
      });
      ND.pull(ftLetters, $('#ftPoster'), () => ready);
    }
  }

  /* =========================================================
     EASTER EGGS
     ========================================================= */
  // leave the tab and the city calls you back
  const title = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '■ the city is still posing…' : title;
  });

  // konami: the whole reel flips to negative
  const kon = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0, typed = '';
  document.addEventListener('keydown', (e) => {
    ki = e.key === kon[ki] ? ki + 1 : (e.key === kon[0] ? 1 : 0);
    if (ki === kon.length) { ki = 0; ND.flash(); ND.toast('■ negative mode. you found the back door.'); document.documentElement.classList.toggle('negative'); }
    if (e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-12);
      if (typed.endsWith('pose')) { ND.flash(); ND.toast('■ click. perfect. again.'); }
      if (typed.endsWith('stayshining')) ND.toast('<i>“stay shining.”</i> — the city', 4000);
    }
  });

  // console
  const css = 'font-family:monospace;color:#d3121b;font-size:12px';
  console.log(`%c
     *    /\\_/\\      +
         ( o.o )   <3  ghostly.grl
     +    > ^ <          *

  NEW DETROIT — blades don't lie. neither do heels.
  type ND.help() for the visitor's handbook`, css);
  ND.help = () => {
    console.log('%cND.flash()      — take the city\'s picture\nND.toast(msg)   — whisper something\nkonami code     — negative mode\ntype "pose"     — anywhere on the page\ntype "stayshining"', 'font-family:monospace;color:#ece5d6;background:#0a0a0a;padding:8px');
    return 'stay shining.';
  };
})();
