/* =========================================================
   NEW DETROIT — districts.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const { $, $$ } = ND;
  const NS = 'http://www.w3.org/2000/svg';
  const stations = [
    { slug: 'silk-row', num: '01', name: 'Silk Row', jp: '絹通り' },
    { slug: 'chrome-heights', num: '02', name: 'Chrome Heights', jp: 'クロム丘' },
    { slug: 'lace-district', num: '03', name: 'Lace District', jp: 'レース街' },
    { slug: 'pool-hall', num: '04', name: 'The Pool Hall', jp: '玉突き場' },
    { slug: 'fur-coast', num: '05', name: 'The Fur Coast', jp: '毛皮海岸' },
  ];

  /* =========================================================
     STRETCHED TITLES — hero + one per district
     ========================================================= */
  // bottom-anchored blocks need their real (stretched) height reserved
  const fitBlock = (inner, host, opts) => {
    ND.stretch(inner, host, opts);
    host.style.height = (inner.offsetHeight * parseFloat(host.style.getPropertyValue('--sy'))) + 'px';
  };
  const dhIn = $('.dh-in'), dhLine = $('.dh-line');
  const dhLetters = ND.letterize(dhIn);
  const chapters = $$('.dc').map((dc) => {
    const inner = $('.dc-name-in', dc), host = $('.dc-name', dc);
    return { dc, inner, host, letters: ND.letterize(inner) };
  });
  const fitAll = () => {
    fitBlock(dhIn, dhLine, { width: .95, height: innerWidth < 600 ? .2 : .36, maxY: 4 });
    chapters.forEach((c) => fitBlock(c.inner, c.host, { width: .95, height: innerWidth < 600 ? .18 : .3, maxY: 4.2 }));
  };
  fitAll();
  document.fonts?.ready.then(() => { fitAll(); ND.hasGsap && ScrollTrigger.refresh(); });
  window.addEventListener('resize', fitAll);

  let heroReady = !ND.motion;
  ND.pull(dhLetters, $('#dh'), () => heroReady);
  if (ND.motion) {
    gsap.timeline({ delay: .35, defaults: { ease: 'expo.out' }, onComplete: () => { heroReady = true; } })
      .fromTo('#dh > .slot', { scale: 1.25 }, { scale: 1.04, duration: 2.4 }, 0)
      .fromTo(dhLetters, { scaleY: 0 }, { scaleY: 1, duration: 1.2, stagger: { each: .05, from: 'random' } }, .2)
      .fromTo('#dh .hero-ask-row > span', { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .04 }, .4)
      .fromTo('.dh-foot > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1 }, .7);
    // scroll away: letters fly off like the home campaign
    gsap.to(dhLetters, {
      yPercent: -200, stagger: { each: .02, from: 'random' }, ease: 'none',
      scrollTrigger: { trigger: '#dh', start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }

  // each district: photo drifts, sign drops in, letters grow, spots rise
  chapters.forEach(({ dc, letters }) => {
    let ready = !ND.motion;
    ND.pull(letters, $('.dc-poster', dc), () => ready);
    if (!ND.motion) return;
    gsap.fromTo($('.dc-poster > .slot', dc), { yPercent: -8, scale: 1.12 }, {
      yPercent: 8, scale: 1.02, ease: 'none',
      scrollTrigger: { trigger: dc, start: 'top bottom', end: 'center top', scrub: true },
    });
    ScrollTrigger.create({
      trigger: dc, start: 'top 65%', once: true,
      onEnter: () => {
        gsap.fromTo(letters, { scaleY: 0 }, { scaleY: 1, duration: 1.3, stagger: { each: .04, from: 'random' }, ease: 'expo.out', onComplete: () => { ready = true; } });
        gsap.fromTo($('.dc-sign', dc), { yPercent: -80, rotation: -4, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.3, ease: 'elastic.out(1,.6)', delay: .2 });
        gsap.fromTo($('.dc-neon', dc), { xPercent: 160 }, { xPercent: 0, duration: 1, ease: 'expo.out', delay: .4 });
      },
    });
    ScrollTrigger.create({
      trigger: $('.dc-body', dc), start: 'top 80%', once: true,
      onEnter: () => {
        gsap.fromTo($('.dc-swatch', dc), { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 1.2, ease: 'expo.out' });
        gsap.fromTo($$('.dc-lead, .dc-facts > div', dc), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .08, ease: 'expo.out' });
      },
    });
    ScrollTrigger.create({
      trigger: $('.dc-spots', dc), start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo($$('.spot', dc), { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .12, ease: 'expo.out' }),
    });
  });

  /* =========================================================
     SPOTS — shutter reveal, tilt toward the cursor, LED "open now"
     ========================================================= */
  $$('.dc').forEach((dc) => {
    const num = dc.dataset.num;
    $$('.spot', dc).forEach((spot) => {
      const ph = $('.slot', spot);
      const hours = $('.spot-hours', spot).textContent;
      const led = document.createElement('div');
      led.className = 'spot-led dot'; led.setAttribute('aria-hidden', 'true');
      const msg = `● OPEN NOW · ${hours} · ND${num} · ${$('.spot-name', spot).textContent.toUpperCase()} ·`;
      led.innerHTML = `<span><span>${msg}</span><span>${msg}</span></span>`;
      ph.append(led);
      if (ND.motion) {
        const bars = document.createElement('div');
        bars.className = 'spot-bars'; bars.innerHTML = '<i></i>'.repeat(6);
        ph.append(bars);
      }
      if (ND.fine && ND.motion) {
        const rx = gsap.quickTo(ph, 'rotationX', { duration: .6, ease: 'power3.out' });
        const ry = gsap.quickTo(ph, 'rotationY', { duration: .6, ease: 'power3.out' });
        gsap.set(ph, { transformPerspective: 800 });
        ph.addEventListener('pointerenter', () => spot.classList.add('is-live'));
        ph.addEventListener('pointermove', (e) => {
          const r = ph.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          ph.style.setProperty('--gx', x * 100 + '%'); ph.style.setProperty('--gy', y * 100 + '%');
          ry((x - .5) * 16); rx((.5 - y) * 12);
        });
        ph.addEventListener('pointerleave', () => { spot.classList.remove('is-live'); rx(0); ry(0); });
      } else {
        // touch: tap to switch the sign on
        ph.addEventListener('click', () => spot.classList.toggle('is-live'));
      }
    });
    if (ND.motion) {
      ScrollTrigger.create({
        trigger: $('.dc-spots', dc), start: 'top 80%', once: true,
        onEnter: () => $$('.spot-bars', dc).forEach((b, k) => gsap.to($$('i', b), {
          scaleY: 0, duration: .9, ease: 'expo.inOut', stagger: { each: .06, from: k % 2 ? 'end' : 'start' }, delay: .25 + k * .15,
          onComplete: () => b.remove(),
        })),
      });
    }
  });

  /* =========================================================
     SC. 02 · THE LOOP LINE — map, moving train, window view
     ========================================================= */
  const svg = $('#loopSvg');
  svg.setAttribute('viewBox', '-170 -20 1340 640');
  const LOOP = 'M330,110 H670 A150,150 0 0 1 820,260 V340 A150,150 0 0 1 670,490 H330 A150,150 0 0 1 180,340 V260 A150,150 0 0 1 330,110 Z';
  const el = (tag, attrs = {}, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    parent.append(n);
    return n;
  };
  const track = el('path', { d: LOOP, class: 'loop-track' });
  el('path', { d: LOOP, class: 'loop-track-in' });
  const L = track.getTotalLength();
  const at = (f) => track.getPointAtLength((((f % 1) + 1) % 1) * L);
  const start = 170 / L; // top centre of the loop

  const win = $('#loopWindow'), loopName = $('#loopName'), loopNow = $('#loopNow');
  const wins = $$('[data-win]', win);
  let hovering = null, shown = null;
  const show = (s, label) => {
    if (shown === s) return;
    shown = s;
    wins.forEach((w) => w.classList.toggle('is-on', s && w.dataset.win === s.slug));
    loopName.textContent = s ? s.name : 'choose a stop';
    loopNow.textContent = s ? `ND${s.num} · ${label}` : 'ND · LOOP LINE';
    $$('.stn', svg).forEach((g) => g.classList.toggle('is-on', s && g.dataset.slug === s.slug));
  };

  stations.forEach((s, k) => {
    s.f = (start + k / stations.length) % 1;
    const p = at(s.f);
    const dx = p.x - 500, dy = p.y - 300, d = Math.hypot(dx, dy) || 1;
    const ux = dx / d, uy = dy / d;
    const g = el('g', { class: 'stn', tabindex: '0', role: 'link', 'aria-label': `ND${s.num} ${s.name}: ride there`, 'data-slug': s.slug });
    el('circle', { cx: p.x, cy: p.y, r: 14, class: 'stn-dot' }, g);
    const lx = p.x + ux * 58, ly = p.y + uy * 58;
    const anchor = ux > .35 ? 'start' : ux < -.35 ? 'end' : 'middle';
    const base = uy < -.5 ? ly - 6 : uy > .5 ? ly + 40 : ly + 14;
    const jp = el('text', { x: lx, y: base - 34, 'text-anchor': anchor, class: 'stn-jp' }, g);
    jp.innerHTML = `<tspan class="stn-badge-t">ND${s.num}</tspan> ${s.jp}`;
    el('text', { x: lx, y: base, 'text-anchor': anchor, class: 'stn-name' }, g).textContent = s.name;
    g.addEventListener('pointerenter', () => { hovering = s; show(s, 'NEXT STOP'); });
    g.addEventListener('pointerleave', () => { hovering = null; });
    g.addEventListener('focus', () => { hovering = s; show(s, 'NEXT STOP'); });
    g.addEventListener('blur', () => { hovering = null; });
    g.addEventListener('click', () => ride(s));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ride(s); } });
  });

  // the train: a little red-nosed carriage riding the loop
  const train = el('g', { class: 'train', 'aria-hidden': 'true' });
  el('rect', { x: -38, y: -14, width: 76, height: 28, rx: 13, class: 'train-body' }, train);
  [-24, -10, 4].forEach((x) => el('rect', { x, y: -7, width: 10, height: 10, rx: 2, class: 'train-win' }, train));
  el('rect', { x: 20, y: -14, width: 18, height: 28, rx: 12, class: 'train-nose' }, train);
  const T = { f: start - .06, speed: ND.reduced ? 0 : .028, riding: false };
  const place = () => {
    const p = at(T.f), q = at(T.f + .002);
    const a = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    train.setAttribute('transform', `translate(${p.x},${p.y}) rotate(${a})`);
    if (hovering || T.riding) return;
    // whichever stop the train is pulling into shows up in the window
    const near = stations.find((s) => Math.abs(((T.f - s.f + 1.5) % 1) - .5) < .035);
    if (near) show(near, 'NOW STOPPING');
  };
  show(stations[0], 'NEXT STOP');
  place();

  let last = performance.now(), visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe($('#loop'));
  const tick = (now) => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (visible && !T.riding) { T.f = (T.f + T.speed * dt) % 1; place(); }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // click a stop: the train runs there, then the page follows
  function ride(s) {
    show(s, 'RIDING TO');
    const go = () => ND.scrollTo('#' + s.slug);
    if (!ND.hasGsap || ND.reduced) { go(); return; }
    T.riding = true;
    let to = s.f;
    while (to <= T.f) to += 1;
    gsap.to(T, {
      f: to, duration: .5 + (to - T.f) * 1.6, ease: 'power2.inOut', onUpdate: place,
      onComplete: () => { T.f %= 1; T.riding = false; ND.flash(.35); go(); },
    });
  }
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#loop', start: 'top 80%', once: true,
      onEnter: () => {
        gsap.fromTo(track, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.8, ease: 'expo.inOut', onComplete: () => track.removeAttribute('style') });
        gsap.fromTo($$('.stn', svg), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'expo.out', delay: .9 });
        gsap.fromTo(win, { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 1.1, ease: 'expo.inOut', delay: .6 });
      },
    });
  }

  /* =========================================================
     RAIL — the route display follows you down the line
     ========================================================= */
  const rail = $('#rail');
  const railLinks = $$('a', rail);
  const setHere = (slug) => railLinks.forEach((a) => a.classList.toggle('is-here', a.dataset.for === slug));
  if (ND.hasGsap) {
    // only over the text part of each stop, never on top of the giant red names
    const inBody = new Set();
    chapters.forEach(({ dc }) => {
      ScrollTrigger.create({
        trigger: dc, start: 'top 55%', end: 'bottom 55%',
        onToggle: (self) => { if (self.isActive) setHere(dc.id); },
      });
      ScrollTrigger.create({
        trigger: $('.dc-body', dc), start: 'top 70%', end: 'bottom 30%',
        onToggle: (self) => { self.isActive ? inBody.add(dc.id) : inBody.delete(dc.id); rail.classList.toggle('is-on', inBody.size > 0); },
      });
    });
  }

  // arriving from the home with #district: ride straight there
  if (location.hash && $(location.hash)) {
    const target = location.hash;
    window.addEventListener('load', () => setTimeout(() => {
      if (ND.lenis) ND.lenis.scrollTo(target, { immediate: true }); else $(target).scrollIntoView();
    }, 60));
  }
  if (ND.hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
