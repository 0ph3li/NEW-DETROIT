/* =========================================================
   NEW DETROIT — home.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const { $, $$ } = ND;
  const body = document.body;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* =========================================================
     SC. 00 · LOADER — a red DETROIT fills up like a poster being printed
     ========================================================= */
  const loader = $('#loader');
  const ldWord = $('#ldWord'), ldPct = $('#ldPct'), ldMsg = $('#ldMsg');
  const msgs = ['switching on the signs', 'polishing the chrome', 'sharpening the heels', 'teaching the city to pose'];

  const endLoader = () => {
    body.classList.remove('is-loading');
    loader?.remove();
  };

  const runLoader = () => {
    // ?reel forces the loader even in a background tab
    if (!ND.motion || !loader || (document.hidden && !/[?&]reel/.test(location.search))) { endLoader(); window.dispatchEvent(new Event('nd:ready')); intro(); return; }

    // the word is two stacked layers: red outline + red fill revealed bottom-up
    $$('.ld-layer', ldWord).forEach((l) => { l.innerHTML = [...'DETROIT'].map((c) => `<i>${c}</i>`).join(''); });
    const fitLd = () => $$('.ld-layer', ldWord).forEach((l) => ND.stretch(l, ldWord));
    fitLd();
    document.fonts?.ready.then(fitLd);
    window.addEventListener('resize', fitLd);
    const fill = $('.ld-layer--fill', ldWord), clip = $('#ldClip');
    const blocks = $$('.ld-block', loader);
    const jump = () => blocks.forEach((b) => gsap.set(b, { left: rand(4, 80) + '%', top: rand(18, 78) + '%', width: rand(6, 15) + 'vw', height: rand(3, 8) + 'vh', opacity: Math.random() < .75 ? 1 : 0 }));

    const FILL = 2100;
    const st = { p: 0 };
    let step = -1, rise = [];
    const tl = gsap.timeline({ paused: true });
    tl.fromTo('.ld-ask span', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, stagger: .04, ease: 'expo.out' })
      .fromTo('.ld-layer--line i', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, stagger: .05, ease: 'expo.out' }, 0)
      // the red rises on the compositor (Web Animations), the counter just follows it
      .call(() => {
        const opts = { duration: FILL, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' };
        rise = [
          clip.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0%)' }], opts),
          fill.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0%)' }], opts),
        ];
      }, null, .2)
      .to(st, {
        p: 100, duration: FILL / 1000, ease: 'sine.inOut',
        onUpdate() {
          // the number reads the real fill, so it never runs ahead of the red
          const t = rise[0] ? Math.min(1, (rise[0].currentTime || 0) / FILL) : st.p / 100;
          const pct = (.5 - .5 * Math.cos(Math.PI * t)) * 100;
          ldPct.textContent = String(Math.round(pct)).padStart(2, '0');
          const s = Math.min(msgs.length - 1, Math.floor(pct / 25));
          if (s !== step) { step = s; ldMsg.textContent = msgs[s]; jump(); }
        },
      }, .2)
      .set(blocks, { opacity: 0 })
      .call(() => { ldPct.textContent = '100'; })
      .call(() => {
        // hand the finished state back to plain styles so the letters can fly
        rise.forEach((a) => a.cancel());
        clip.style.transform = 'none'; clip.style.overflow = 'visible'; fill.style.transform = 'none';
      })
      // exit: letters shoot up, the black sheet wipes off the hero
      .to('.ld-layer--fill i', { yPercent: -130, duration: .8, stagger: .045, ease: 'expo.in' })
      .to('.ld-layer--line, .ld-ask, .ld-foot', { opacity: 0, duration: .3 }, '<')
      .call(() => { body.classList.remove('is-loading'); window.dispatchEvent(new Event('nd:ready')); intro(); }, null, '-=.2')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' }, '-=.35')
      .call(() => { window.removeEventListener('resize', fitLd); loader.remove(); });

    // start once the condensed font is in, so the word never jumps size mid-fill
    let started = false;
    const go = () => { if (started) return; started = true; fitLd(); tl.play(); };
    document.fonts?.ready.then(go);
    setTimeout(go, 900);

    // impatient? click to skip
    loader.addEventListener('click', () => { rise.forEach((a) => a.finish()); go(); tl.progress(1); }, { once: true });
  };

  /* =========================================================
     SC. 01 · HERO — the campaign: BLADES DON'T LIE / NEITHER DO HEELS
     stretched in red over two B&W photos, Shibuya-style neon on the side
     ========================================================= */
  const htLines = $$('.ht-line');
  const htLetters = htLines.map((l) => ND.letterize($('.ht-in', l)));
  const fitHero = () => {
    const h = innerWidth < 600 ? .14 : .2;
    htLines.forEach((l) => {
      const inn = $('.ht-in', l);
      ND.stretch(inn, l, { width: .95, height: h, maxY: 4 });
      l.style.height = (inn.offsetHeight * parseFloat(l.style.getPropertyValue('--sy'))) + 'px';
    });
  };
  fitHero();
  document.fonts?.ready.then(fitHero);
  window.addEventListener('resize', fitHero);
  const heroVo = $('#heroVo');
  const voWords = ND.motion ? ND.split(heroVo) : [];
  let heroReady = !ND.motion;
  ND.pull(htLetters.flat(), $('#hero'), () => heroReady && window.scrollY < 40);

  function intro() {
    if (!ND.motion) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { heroReady = true; } });
    tl.fromTo('#phL', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.inOut' }, 0)
      .fromTo('#phR', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' }, .1)
      .fromTo('.hero-ph > .slot', { scale: 1.3 }, { scale: 1.05, duration: 2.2 }, .1)
      .fromTo(htLetters.flat(), { scaleY: 0 }, { scaleY: 1, duration: 1.2, stagger: { each: .035, from: 'random' } }, .5)
      .fromTo('.hero-ask-row > span', { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .04 }, .7)
      .fromTo('#neon', { xPercent: 160 }, { xPercent: 0, duration: 1, ease: 'expo.out' }, 1)
      .fromTo('.lbox > span, .hero-sig', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, stagger: .06 }, 1)
      .fromTo(voWords, { opacity: 0 }, { opacity: 1, duration: .2, stagger: .018, ease: 'none' }, 1.2);
  }

  // photos drift a little against the cursor
  if (ND.motion && ND.fine) {
    const ph = $$('.hero-ph > .slot');
    const qx = ph.map((s) => gsap.quickTo(s, 'x', { duration: 1.2, ease: 'power3.out' }));
    const qy = ph.map((s) => gsap.quickTo(s, 'y', { duration: 1.2, ease: 'power3.out' }));
    $('#hero').addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      qx.forEach((f, i) => f(nx * (i ? -22 : 22))); qy.forEach((f) => f(ny * 14));
    });
  }

  // camera timecode, 24 fps
  const tc = $('#tc');
  const t0 = performance.now();
  const p2 = (n) => String(n).padStart(2, '0');
  setInterval(() => {
    const f = Math.floor((performance.now() - t0) / (1000 / 24));
    tc.textContent = `${p2(Math.floor(f / 86400))}:${p2(Math.floor(f / 1440) % 60)}:${p2(Math.floor(f / 24) % 60)}:${p2(f % 24)}`;
  }, 1000 / 24);

  // scroll: the letters scatter like the loader, the street closes to a slit
  if (ND.motion) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=140%', scrub: 1, pin: true, anticipatePin: 1 },
    });
    tl.to(htLetters[0], { yPercent: -260, duration: .5, stagger: { each: .02, from: 'random' }, ease: 'power2.in' }, 0)
      .to(htLetters[1], { yPercent: -260, duration: .5, stagger: { each: .02, from: 'random' }, ease: 'power2.in' }, .12)
      .to('.hero-ask, .hero-foot, .lbox', { opacity: 0, y: -30, duration: .25 }, 0)
      .to('#neon', { xPercent: 180, duration: .3 }, .05)
      .to('#phL', { xPercent: -14, duration: .7 }, 0)
      .to('#phR', { xPercent: 14, duration: .7 }, 0)
      .to('.hero-ph > .slot', { filter: 'brightness(.45)', duration: .5 }, .1)
      .to('.hero-photos', { clipPath: 'inset(48% 0% 48% 0%)', duration: .45, ease: 'power3.in' }, .5);
  }

  // zebra crossing slides with the scroll
  if (ND.motion) {
    gsap.fromTo('.zebra-track', { x: -104 }, { x: 104 * 3, ease: 'none', scrollTrigger: { trigger: '.zebra', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* =========================================================
     SC. 02 · THE BIG SCREEN — subtitles lit word by word by scroll
     ========================================================= */
  const subs = $$('.vo-sub');
  const voIdx = $('#voIdx');
  if (ND.motion && subs.length) {
    const words = subs.map((s) => ND.split(s));
    gsap.set(subs, { autoAlpha: 0 });
    gsap.set(subs[0], { autoAlpha: 1 });
    words.forEach((w) => gsap.set(w, { opacity: .14 }));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#vo', start: 'top top', end: `+=${subs.length * 70}%`, scrub: .6, pin: true, anticipatePin: 1,
        onUpdate: (self) => { voIdx.textContent = p2(Math.min(subs.length, Math.floor(self.progress * subs.length) + 1)); },
      },
    });
    subs.forEach((s, i) => {
      tl.to(words[i], { opacity: 1, duration: .3, stagger: .08, ease: 'none' });
      tl.to({}, { duration: .5 });
      if (i < subs.length - 1) {
        tl.to(s, { autoAlpha: 0, yPercent: -18, scaleY: 1.6, duration: .35 })
          .fromTo(subs[i + 1], { autoAlpha: 0, yPercent: 18, scaleY: .4 }, { autoAlpha: 1, yPercent: 0, scaleY: 1, duration: .35 }, '<.1');
      }
    });
  }
  // population: always rising, nobody leaves
  const pops = $$('.pop');
  let people = 2808808;
  setInterval(() => { people += 1 + (Math.random() * 7 | 0); pops.forEach((p) => { p.textContent = people.toLocaleString('en-US'); }); }, 2200);

  /* =========================================================
     SC. 03 · DISTRICTS — station signs on fabric swatches
     ========================================================= */
  const sws = $$('.sw');
  let refreshT;
  const openSw = (sw) => {
    if (sw.classList.contains('is-open')) return;
    sws.forEach((s) => s.classList.toggle('is-open', s === sw));
    clearTimeout(refreshT);
    refreshT = setTimeout(() => ND.hasGsap && ScrollTrigger.refresh(), 950);
  };
  sws.forEach((sw) => {
    sw.tabIndex = 0;
    sw.setAttribute('role', 'button');
    sw.addEventListener('click', () => openSw(sw));
    sw.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSw(sw); } });
    if (ND.fine) {
      let t;
      sw.addEventListener('pointerenter', () => { t = setTimeout(() => openSw(sw), 160); });
      sw.addEventListener('pointerleave', () => clearTimeout(t));
    }
  });
  if (ND.motion) {
    sws.forEach((sw, i) => {
      ScrollTrigger.create({
        trigger: sw, start: 'top 92%', once: true,
        onEnter: () => {
          gsap.fromTo(sw, { clipPath: i % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.3, ease: 'expo.inOut' });
          // the sign drops in like it's being bolted to the platform
          gsap.fromTo(sw.querySelector('.sw-sign'), { yPercent: -60, rotation: i % 2 ? 3 : -3, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1,.6)', delay: .35 });
        },
      });
    });
  }

  /* =========================================================
     SC. 04 · TONIGHT — departure board, a venue "leaves" every few seconds
     ========================================================= */
  const departures = [
    ['21:00', 'The Cue Club', 'The Pool Hall', 'Heels or blades', 'open'],
    ['22:30', 'Velvet 8', 'Lace District', 'All black, one red', 'last'],
    ['23:00', 'Champagne Motel', 'Fur Coast', "Last night's look", 'open'],
    ['00:00', 'Silk Row Social', 'Silk Row', 'Satin, no sneakers', 'full'],
    ['01:00', 'Chrome Chapel', 'Chrome Heights', 'Mirror shades', 'open'],
    ['02:00', 'Karaoke 24', 'Chrome Heights', 'Whatever survives', 'open'],
    ['03:00', 'Noodle Bar Zero', 'Lace District', 'Sunglasses indoors', 'last'],
    ['04:30', 'The Last Mirror', 'Silk Row', 'Yesterday, but better', 'open'],
  ];
  const ST = { open: 'OPEN', last: 'LAST CALL', full: 'FULL' };
  const boardRows = $('#boardRows');
  const VISIBLE = 5;
  let next = 0;
  const addRow = (d, animate) => {
    const row = document.createElement('div');
    row.className = 'board-row';
    row.innerHTML = `<span class="c-time"></span><span class="c-venue"></span><span class="c-dist"></span><span class="c-dress"></span><span class="c-st st st--${d[4]}"></span>`;
    boardRows.append(row);
    const cells = $$('span', row), vals = [d[0], d[1], d[2], d[3], ST[d[4]]];
    cells.forEach((c, i) => (animate ? ND.scramble(c, vals[i].toUpperCase(), 500 + i * 160) : (c.textContent = vals[i].toUpperCase())));
    return row;
  };
  for (; next < VISIBLE; next++) addRow(departures[next], false);
  const depart = () => {
    const first = boardRows.firstElementChild;
    const d = departures[next++ % departures.length];
    if (!ND.hasGsap) { first.remove(); addRow(d, false); return; }
    gsap.to(first, { height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0, duration: .5, ease: 'power2.in', onComplete: () => { first.remove(); addRow(d, true); } });
  };
  let boardVisible = false;
  new IntersectionObserver(([e]) => { boardVisible = e.isIntersecting; }, { threshold: .3 }).observe($('#board'));
  setInterval(() => { if (boardVisible && !document.hidden) depart(); }, 4200);
  const boardClock = $('#boardClock');
  setInterval(() => { boardClock.textContent = `02:${p2(new Date().getMinutes())}`; }, 1000);
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#board', start: 'top 82%', once: true,
      onEnter: () => {
        gsap.fromTo('#board', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.inOut' });
        $$('.board-row', boardRows).forEach((r, i) => $$('span', r).forEach((c, j) => setTimeout(() => ND.scramble(c, c.textContent, 600 + j * 120), 300 + i * 140)));
      },
    });
  }

  /* =========================================================
     SC. 05 · IT POSES — viewfinder + flash
     ========================================================= */
  const pose = $('#pose'), vf = $('#viewfinder'), flashes = $('#flashes');
  let shots = parseInt(ND.store.get('flashes') || '0', 10) || 0;
  const pad = (n) => String(n).padStart(4, '0');
  flashes.textContent = pad(shots);
  const pzs = $$('.pz');

  if (ND.fine && ND.hasGsap) {
    const qx = gsap.quickTo(vf, 'x', { duration: .35, ease: 'power3.out' });
    const qy = gsap.quickTo(vf, 'y', { duration: .35, ease: 'power3.out' });
    pose.addEventListener('pointerenter', () => pose.classList.add('is-aiming'));
    pose.addEventListener('pointerleave', () => pose.classList.remove('is-aiming'));
    pose.addEventListener('pointermove', (e) => {
      const r = pose.getBoundingClientRect();
      qx(e.clientX - r.left); qy(e.clientY - r.top);
    });
  }

  // click a polaroid: flash, it flies out of the wall and develops like instant film
  const box = $('#pzBox'), print = $('#pzPrint'), pzImg = $('#pzImg');
  let openPz = null;
  const develop = (p) => {
    const img = p.querySelector('.slot > img');
    if (!img) return;
    openPz = p;
    pzImg.src = img.src; pzImg.alt = img.alt;
    pzImg.style.objectPosition = img.style.objectPosition;
    const [num, dist] = [...p.querySelectorAll('figcaption > *')].map((x) => x.textContent);
    $('#pzNum').textContent = `${num} · ${dist}`;
    $('#pzStory').textContent = p.dataset.story;
    box.setAttribute('aria-hidden', 'false');
    ND.lenis?.stop();
    if (!ND.hasGsap || ND.reduced) { box.style.opacity = 1; box.style.visibility = 'visible'; return; }
    gsap.set(box, { autoAlpha: 1 });
    // FLIP: start the print exactly where the polaroid sits on the wall
    const from = p.getBoundingClientRect(), to = print.getBoundingClientRect();
    gsap.timeline()
      .fromTo(box, { backgroundColor: 'rgba(10,10,10,0)' }, { backgroundColor: 'rgba(10,10,10,.86)', duration: .5 }, 0)
      .fromTo(print, {
        x: from.left + from.width / 2 - (to.left + to.width / 2), y: from.top + from.height / 2 - (to.top + to.height / 2),
        scale: from.width / to.width, rotation: p._r || 0,
      }, { x: 0, y: 0, scale: 1, rotation: -2, duration: .9, ease: 'expo.out' }, 0)
      .fromTo(pzImg, { filter: 'brightness(3.2) contrast(.35) saturate(0) blur(4px)' }, { filter: 'brightness(1) contrast(1) saturate(1) blur(0px)', duration: 2.2, ease: 'power2.out' }, .2)
      .fromTo('.pz-print figcaption > *', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6, stagger: .1 }, .9)
      .fromTo('.pz-stamp', { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2)' }, 1.7)
      .fromTo('.pz-close', { opacity: 0 }, { opacity: 1, duration: .4 }, 1.2);
  };
  const closePz = () => {
    if (!openPz) return;
    openPz = null;
    box.setAttribute('aria-hidden', 'true');
    ND.lenis?.start();
    if (!ND.hasGsap || ND.reduced) { box.style.opacity = 0; box.style.visibility = 'hidden'; return; }
    gsap.to(print, { y: 80, rotation: 6, opacity: 0, duration: .45, ease: 'power2.in', onComplete: () => gsap.set(print, { opacity: 1 }) });
    gsap.to(box, { autoAlpha: 0, duration: .5, delay: .1 });
  };
  box.addEventListener('click', closePz);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePz();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('pz')) { e.preventDefault(); ND.flash(); develop(e.target); }
  });

  pose.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .pz-box')) return;
    ND.flash();
    shots++; ND.store.set('flashes', shots); flashes.textContent = pad(shots);
    if (ND.hasGsap) gsap.fromTo(vf, { scale: .9 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
    const p = e.target.closest('.pz');
    if (p) setTimeout(() => develop(p), 120);
  });
  if (ND.motion) {
    pzs.forEach((p) => {
      const r = parseFloat(getComputedStyle(p).rotate) || 0;
      p.style.rotate = 'none';
      gsap.set(p, { rotation: r });
      p._r = r;
    });
    ScrollTrigger.create({
      trigger: '#poseWall', start: 'top 80%', once: true,
      onEnter: () => gsap.fromTo(pzs, { y: 160, opacity: 0, rotation: (i) => pzs[i]._r * 3 }, { y: 0, opacity: 1, rotation: (i) => pzs[i]._r, duration: 1.3, stagger: .1, ease: 'expo.out' }),
    });
  }

  /* =========================================================
     SC. 06 · THE WALL — tear the top poster off
     ========================================================= */
  const posterData = [
    { title: 'Silk Row', sub: 'POP-UP · LEOPARD SEASON · FRI 11PM', big: '08', side: 'POP-UP', loc: '8 silk row<br>new detroit', pos: '50% 28%' },
    { title: 'Chrome Heights', sub: 'ROOFTOP SET · 88TH FLOOR', big: '88', side: 'LIVE', loc: 'tower 8, roof<br>new detroit', pos: '50% 50%' },
    { title: 'Lace District', sub: 'LANTERN NIGHT · KIMONO RUNWAY', big: '00', side: 'RUNWAY', loc: 'lantern alley<br>new detroit', pos: '40% 35%' },
    { title: 'The Pool Hall', sub: 'DOWNSTAIRS · CUE CLUB OPEN', big: '04', side: 'OPEN', loc: 'the cue club<br>new detroit', pos: '50% 50%' },
    { title: 'The Fur Coast', sub: 'BOAT PARTY · PIER 8 · TILL DAWN', big: '01', side: 'AFTER', loc: 'pier 8<br>new detroit', pos: '50% 60%' },
  ];
  const posters = $('#posters');
  const scatter = (el) => gsap.set(el, { xPercent: -50, yPercent: -50, x: rand(-26, 26), y: rand(-20, 20), rotation: rand(-5, 5) });
  // newest poster last in the DOM = on top of the pile
  posterData.slice().reverse().forEach((d, k) => {
    const i = posterData.length - k;
    const f = document.createElement('figure');
    f.className = 'poster'; f.tabIndex = 0; f.setAttribute('role', 'button');
    f.setAttribute('aria-label', `${d.title} poster — ${d.sub}. Press to tear it off.`);
    f.innerHTML = `
      <div class="slot" data-img="img/HOME/poster-${i}.jpg" data-pos="${d.pos}" data-alt="${d.title} poster photo"><span class="slot-label">poster-${i}.jpg<small>poster photo · 5:7</small></span></div>
      <div class="poster-shade"></div>
      <div class="poster-top"><span class="poster-title">${d.title}</span><span class="poster-sub">${d.sub}</span></div>
      <span class="poster-big">${d.big}</span>
      <span class="poster-side">${d.side}</span>
      <div class="poster-foot"><span>${d.loc}</span><b>N.D.</b></div>
      <div class="poster-paste"></div>`;
    posters.append(f);
    const ps = f.querySelector('.slot');
    if (body.classList.contains('is-loading')) window.addEventListener('nd:ready', () => ND.slot(ps), { once: true }); else ND.slot(ps);
    if (ND.hasGsap) scatter(f); else Object.assign(f.style, { transform: 'translate(-50%,-50%)' });
  });
  const hint = document.createElement('p'); hint.className = 'posters-hint mono'; hint.innerHTML = 'click to tear · torn: <b>0</b>';
  posters.append(hint);
  let torn = 0, tearing = false;

  const tear = () => {
    const all = $$('.poster', posters);
    const top = all[all.length - 1];
    if (!top || tearing || !ND.hasGsap) return;
    tearing = true;
    const pts = ND.seam(rand(35, 65));
    const props = ['x', 'y', 'rotation'].reduce((o, k) => (o[k] = gsap.getProperty(top, k), o), {});
    const halves = ['L', 'R'].map((side) => {
      const h = top.cloneNode(true);
      h.removeAttribute('tabindex'); h.setAttribute('aria-hidden', 'true');
      h.classList.add('poster-half'); h.style.clipPath = ND.seamClip(pts, side);
      ND.tearRim(h, pts);
      gsap.set(h, { xPercent: -50, yPercent: -50, ...props, transformPerspective: 900 });
      posters.append(h);
      return h;
    });
    // the original slides to the bottom of the pile, a new one is on top
    posters.prepend(top); scatter(top);
    gsap.fromTo(top, { opacity: 0 }, { opacity: 1, duration: .4, delay: .5 });
    const tl = gsap.timeline({ onComplete: () => { halves.forEach((h) => h.remove()); tearing = false; } });
    // left half peels and crumples away, the right one hangs on a beat longer
    tl.to(halves[0], { x: props.x - rand(140, 220), y: props.y + rand(260, 420), rotation: props.rotation - rand(18, 35), rotationY: -rand(60, 100), scale: .7, '--peel': 1, opacity: 0, duration: 1.1, ease: 'power2.in' }, 0)
      .to(halves[1], { rotationY: 25, '--peel': .6, duration: .35, ease: 'sine.out' }, .1)
      .to(halves[1], { x: props.x + rand(140, 220), y: props.y + rand(220, 380), rotation: props.rotation + rand(14, 30), rotationY: rand(70, 110), scale: .7, opacity: 0, duration: 1, ease: 'power2.in' }, .4);
    torn++; hint.querySelector('b').textContent = torn;
    if (torn === 5) ND.toast('■ the wall is bare. it will be full again by 2 AM.');
  };
  posters.addEventListener('click', (e) => { if (e.target.closest('.poster')) tear(); });
  posters.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.poster')) { e.preventDefault(); tear(); } });
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: posters, start: 'top 80%', once: true,
      onEnter: () => gsap.from($$('.poster', posters), { y: '+=260', rotation: '+=12', opacity: 0, duration: 1.2, stagger: .09, ease: 'expo.out' }),
    });
  }

  /* =========================================================
     SC. 07 · THE KEY — chrome, layered in 3D, drag to spin
     ========================================================= */
  const keyCtl = ND.key3d($('#key3d'), $('#keyIn'), { tilt: $('#key') });
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#key3d', start: 'top 85%', once: true,
      onEnter: () => {
        keyCtl.kick(22);
        gsap.fromTo('#key3d', { y: -160, rotation: -28, opacity: 0, scale: .7 }, { y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1.6, ease: 'elastic.out(1,.55)' });
      },
    });
  }

  /* ---------- go ---------- */
  runLoader();
  if (ND.hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
