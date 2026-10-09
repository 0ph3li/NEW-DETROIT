/* =========================================================
   NEW DETROIT — events.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const { $, $$ } = ND;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* SC. 01 · TEAR IT DOWN */
  ND.poster({ section: '#eh', inner: '.eh-in', line: '.eh-line', neon: '.eh-neon', foot: '.eh-foot > *' });

  /* =========================================================
     DATA — the program list is the single source of truth
     ========================================================= */
  const rows = $$('.ev');
  const events = rows.map((r) => ({
    slug: r.dataset.slug, type: r.dataset.type, date: r.dataset.date, time: r.dataset.time, word: r.dataset.word,
    img: r.dataset.img, fallback: r.dataset.fallback,
    title: $('.ev-title', r).textContent, line: $('.ev-line', r).textContent,
    venue: $('.ev-where', r).firstChild.textContent.trim(), district: $('.ev-where span', r).textContent,
    dd: r.dataset.date.slice(8, 10), mm: r.dataset.date.slice(5, 7),
    day: $('.ev-date .mono', r).textContent.split(' ')[0],
  }));
  const JP = { 'Silk Row': '絹通り', 'Chrome Heights': 'クロム丘', 'Lace District': 'レース街', 'The Pool Hall': '玉突き場', 'The Fur Coast': '毛皮海岸' };

  /* =========================================================
     POSTERS — four print styles, all pasted by hand
     ========================================================= */
  const slotHTML = (e) => `<div class="slot" data-img="${e.img}" data-fallback="${e.fallback}" data-alt="${e.title} poster"><span class="slot-label">${e.slug}.jpg<small>event photo · 5:7</small></span></div>`;
  const TPL = {
    war: (e) => `${slotHTML(e)}<div class="p-shade"></div>
      <div class="p-top"><span class="p-title">${e.title}</span><span class="p-sub">${e.type} · ${e.day} ${e.dd}.${e.mm} · ${e.time}</span></div>
      <span class="p-num">${e.dd}</span><span class="p-side">${e.word}</span>
      <div class="p-foot"><span>${e.venue}<br>${e.district}</span><b>N.D.</b></div>`,
    freedom: (e) => `${slotHTML(e)}
      <div class="p-ask"><span>does</span><span>${e.district}</span><span>ever</span><span>close?</span></div>
      <span class="p-word" style="--fw:${Math.min(34, 200 / e.word.length).toFixed(1)}cqw">${e.word}</span>
      <div class="p-foot"><span>${e.title}</span><span>${e.dd}.${e.mm} · ${e.time}</span></div>`,
    pardon: (e) => {
      const [a, ...rest] = e.title.toUpperCase().split(' ');
      const b = rest.join(' ') || e.word, c = `${e.day} ${e.time}`;
      // every line fits the sheet edge to edge, however long the word is
      const fit = (t, max) => `font-size:${Math.min(max, 84 / (t.length * .47)).toFixed(1)}cqw`;
      return `<span class="p-row p-row--a" style="${fit(a, 14)}">${a}</span><span class="p-row p-row--b" style="${fit(b, 34)}">${b}</span>
        <span class="p-row p-row--c" style="${fit(c, 13)}">${c}</span><span class="p-row p-row--d">${e.dd}.${e.mm}</span>
        <p class="p-small">${e.venue} · ${e.time} · new detroit</p>`;
    },
    grid: (e) => `<span class="p-date">${e.dd}.${e.mm}<small>${e.day} · ${e.time}</small></span>
      <span class="p-jp">${JP[e.district] || '催し'}</span>${slotHTML(e)}
      <span class="p-title">${e.title}</span>
      <div class="p-foot"><span>${e.venue}</span><span>${e.type}</span></div>`,
  };
  const STYLES = Object.keys(TPL);
  const makePoster = (e, style) => {
    const p = document.createElement('div');
    p.className = `pst pst--${style}`;
    p.dataset.slug = e.slug;
    p.setAttribute('role', 'button'); p.tabIndex = 0;
    p.setAttribute('aria-label', `${e.title}, ${e.type}, ${e.dd}.${e.mm} at ${e.time}. Press to tear it off.`);
    p.innerHTML = TPL[style](e);
    $$('.slot', p).forEach((s) => ND.slot(s));
    return p;
  };
  const place = (p) => {
    const t = { x: rand(-8, 8), y: rand(-8, 8), rotation: rand(-2.6, 2.6) };
    if (ND.hasGsap) gsap.set(p, t); else p.style.transform = `translate(${t.x}px,${t.y}px) rotate(${t.rotation}deg)`;
  };

  // every stack: 4 layers deep, the same events repeat in other styles like a real wall
  const stacks = $$('.stack');
  let round = 0;
  // deal so that neighbouring stacks never show the same event or style on top
  const fill = (stack, animate) => {
    $$('.pst, .scrap, .stack-bare', stack).forEach((x) => x.remove());
    const i = stacks.indexOf(stack), r = animate ? ++round : 0;
    const ps = [];
    for (let k = 0; k < 4; k++) {
      const e = events[(i + k * 4 + r * 3) % events.length];
      const style = STYLES[(i + k + r) % STYLES.length];
      const p = makePoster(e, style);
      stack.append(p); place(p); ps.push(p);
    }
    if (animate && ND.motion) {
      // the night crew pastes them back with a brush, top to bottom
      gsap.fromTo(ps, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .7, stagger: .25, ease: 'power2.inOut' });
    }
  };
  stacks.forEach((s) => fill(s, false));

  /* =========================================================
     TEARING — grab, pull, rip along a jagged line
     ========================================================= */
  const tornEl = $('#tornCount');
  let torn = 0;
  const halves = (p, x0) => {
    const pts = ND.seam(x0);
    const base = ND.hasGsap ? { x: gsap.getProperty(p, 'x'), y: gsap.getProperty(p, 'y'), rotation: gsap.getProperty(p, 'rotation') } : { x: 0, y: 0, rotation: 0 };
    const make = (side) => {
      const h = p.cloneNode(true);
      h.classList.add('pst-half'); h.removeAttribute('tabindex'); h.removeAttribute('role'); h.setAttribute('aria-hidden', 'true');
      h.style.clipPath = ND.seamClip(pts, side);
      h.style.visibility = '';
      ND.tearRim(h, pts);
      p.parentElement.append(h);
      // hinge on the tear line so the piece peels off the wall around it
      const mid = pts[Math.floor(pts.length / 2)][0];
      if (ND.hasGsap) gsap.set(h, { ...base, transformOrigin: `${side === 'L' ? mid : mid}% 50%`, transformPerspective: 900 });
      if (side === 'R') h.querySelector('.tear-shade').style.background = 'linear-gradient(270deg, rgba(0,0,0,.55), rgba(0,0,0,0) 60%)';
      return h;
    };
    return { L: make('L'), R: make('R'), base, pts };
  };
  // a jagged strip of the torn poster stays glued to the wall
  const leaveScrap = (stack, half) => {
    const s = half.cloneNode(true);
    s.className = 'scrap ' + [...half.classList].filter((c) => c.startsWith('pst--')).join(' ');
    s.removeAttribute('style');
    const top = rand(0, 60), h = rand(5, 14);
    const pts = [];
    for (let x = 0; x <= 100; x += 10) pts.push(`${x}% ${top + rand(-2, 2)}%`);
    for (let x = 100; x >= 0; x -= 10) pts.push(`${x}% ${top + h + rand(-3, 3)}%`);
    s.style.inset = '0';
    s.style.clipPath = `polygon(${pts.join(', ')})`;
    $$('.tear-rim, .tear-shade', s).forEach((x) => x.remove());
    stack.append(s);
    if (ND.hasGsap) gsap.set(s, { x: gsap.getProperty(half, 'x'), y: gsap.getProperty(half, 'y'), rotation: gsap.getProperty(half, 'rotation') });
    const scraps = $$('.scrap', stack);
    if (scraps.length > 3) scraps[0].remove();
  };
  const afterTear = (stack) => {
    torn++; tornEl.textContent = String(torn).padStart(2, '0');
    if (torn === 10) ND.toast('■ ten posters down. the night crew has noticed you.');
    if (!$('.pst', stack)) {
      const bare = document.createElement('div');
      bare.className = 'stack-bare'; bare.innerHTML = 'POST<br>NO<br>BILLS';
      stack.append(bare);
      setTimeout(() => { fill(stack, true); ND.toast('■ pasted again. it\'s 2 AM, the crew never sleeps either.'); }, 1700);
    }
  };
  // fling the moving half off, the other one peels down after it
  const finish = (stack, p, parts, moving, vx, vy) => {
    const other = moving === parts.L ? parts.R : parts.L;
    const dir = moving === parts.L ? -1 : 1;
    p.remove();
    ND.flash(.12);
    if (!ND.hasGsap || ND.reduced) { parts.L.remove(); parts.R.remove(); afterTear(stack); return; }
    gsap.to(moving, {
      x: `+=${vx * 18 + dir * rand(160, 260)}`, y: `+=${Math.max(260, vy * 18 + 420)}`, rotation: `+=${dir * rand(25, 60)}`,
      rotationY: dir * rand(60, 110), rotationX: rand(-30, 30), scale: rand(.55, .75), opacity: 0,
      duration: 1.1, ease: 'power2.in', onComplete: () => moving.remove(),
    });
    gsap.to(moving, { '--peel': 1, duration: .5 });
    leaveScrap(stack, other);
    gsap.timeline({ delay: .35, onComplete: () => other.remove() })
      .to(other, { rotation: `+=${-dir * 6}`, transformOrigin: dir > 0 ? '0% 0%' : '100% 0%', duration: .45, ease: 'sine.inOut' })
      .to(other, { y: '+=500', rotation: `+=${-dir * 30}`, opacity: 0, duration: .9, ease: 'power2.in' });
    afterTear(stack);
  };

  stacks.forEach((stack) => {
    let st = null;
    const top = () => { const all = $$(':scope > .pst', stack); return all[all.length - 1]; };
    stack.addEventListener('pointerdown', (e) => {
      const p = e.target.closest('.pst');
      if (!p || p !== top()) return;
      const r = p.getBoundingClientRect();
      st = { p, x0: ((e.clientX - r.left) / r.width) * 100, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, vx: 0, vy: 0, parts: null, moving: null, id: e.pointerId };
      try { stack.setPointerCapture(e.pointerId); } catch (_) {}
    });
    stack.addEventListener('pointermove', (e) => {
      if (!st || e.pointerId !== st.id) return;
      const dx = e.clientX - st.sx, dy = e.clientY - st.sy;
      st.vx = e.clientX - st.lx; st.vy = e.clientY - st.ly; st.lx = e.clientX; st.ly = e.clientY;
      if (!st.parts && Math.hypot(dx, dy) > 10) {
        st.parts = halves(st.p, st.x0);
        st.moving = dx >= 0 ? st.parts.R : st.parts.L;
        st.p.style.visibility = 'hidden';
      }
      if (st.parts && ND.hasGsap) {
        const b = st.parts.base;
        const peel = Math.min(1, Math.abs(dx) / 220);
        gsap.set(st.moving, { x: b.x + dx * .55, y: b.y + dy * .7, rotation: b.rotation + dx * .04, rotationY: Math.sign(dx || 1) * peel * 58, '--peel': peel });
        const other = st.moving === st.parts.L ? st.parts.R : st.parts.L;
        gsap.set(other, { rotation: b.rotation - Math.min(Math.abs(dx), 80) * .03 * Math.sign(dx || 1) });
      }
    });
    const up = (e) => {
      if (!st || e.pointerId !== st.id) return;
      const s = st; st = null;
      const dist = Math.hypot(e.clientX - s.sx, e.clientY - s.sy);
      if (!s.parts) {
        // a click: rip it at a random spot, in a random direction
        if (e.type === 'pointerup' && dist < 10) {
          const parts = halves(s.p, rand(30, 70));
          finish(stack, s.p, parts, Math.random() < .5 ? parts.L : parts.R, rand(-4, 4), rand(0, 6));
        }
        return;
      }
      if (dist > 50 && e.type === 'pointerup') { finish(stack, s.p, s.parts, s.moving, s.vx, s.vy); return; }
      // not hard enough: the paste holds, it snaps back
      const { L, R, base } = s.parts;
      if (!ND.hasGsap) { L.remove(); R.remove(); s.p.style.visibility = ''; return; }
      gsap.to([L, R], { ...base, rotationY: 0, '--peel': 0, duration: .35, ease: 'back.out(2)', onComplete: () => { L.remove(); R.remove(); s.p.style.visibility = ''; } });
    };
    stack.addEventListener('pointerup', up);
    stack.addEventListener('pointercancel', up);
    stack.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('pst') && e.target === top()) {
        e.preventDefault();
        const parts = halves(e.target, 50);
        finish(stack, e.target, parts, parts.R, 2, 4);
        top()?.focus();
      }
    });
  });

  // a little "tear" label rides with the cursor over the wall
  if (ND.fine && ND.hasGsap) {
    const cur = $('#tearCursor'), wall = $('#wallBox');
    const qx = gsap.quickTo(cur, 'x', { duration: .25 }), qy = gsap.quickTo(cur, 'y', { duration: .25 });
    wall.addEventListener('pointerenter', () => cur.classList.add('is-on'));
    wall.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    wall.addEventListener('pointermove', (e) => { qx(e.clientX + 16); qy(e.clientY + 18); });
  }
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#wallBox', start: 'top 80%', once: true,
      onEnter: () => stacks.forEach((s, i) => gsap.fromTo($$('.pst', s), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .6, stagger: .12, delay: i * .15, ease: 'power2.inOut' })),
    });
  }

  /* =========================================================
     SC. 03 · THE PROGRAM — filters, cursor preview, .ics
     ========================================================= */
  const filters = $$('.program .filter');
  filters.forEach((b) => b.addEventListener('click', () => {
    filters.forEach((x) => x.classList.toggle('is-on', x === b));
    rows.forEach((r) => r.classList.toggle('is-hidden', !(b.dataset.f === 'all' || r.dataset.type === b.dataset.f)));
    ND.hasGsap && ScrollTrigger.refresh();
  }));

  // poster photo follows the cursor over the list
  const prev = $('#evPreview'), prevImg = $('img', prev);
  const srcFor = (r) => new Promise((res) => {
    const im = new Image();
    im.onload = () => res(r.dataset.img);
    im.onerror = () => res(r.dataset.fallback);
    im.src = r.dataset.img;
  });
  if (ND.fine && ND.hasGsap) {
    const qx = gsap.quickTo(prev, 'x', { duration: .45, ease: 'power3.out' }), qy = gsap.quickTo(prev, 'y', { duration: .45, ease: 'power3.out' });
    const qr = gsap.quickTo(prev, 'rotation', { duration: .6, ease: 'power3.out' });
    let lastX = 0;
    rows.forEach((r) => {
      r.addEventListener('pointerenter', async () => {
        prevImg.src = await srcFor(r);
        gsap.to(prev, { opacity: 1, scale: 1, duration: .3 });
      });
      r.addEventListener('pointerleave', () => gsap.to(prev, { opacity: 0, scale: .9, duration: .3 }));
    });
    window.addEventListener('pointermove', (e) => {
      qx(e.clientX + 30); qy(e.clientY - 120); qr(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * .6)); lastX = e.clientX;
    });
  }

  // + cal: a real calendar file for your phone
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  rows.forEach((r, i) => $('.ev-cal', r).addEventListener('click', () => {
    const e = events[i];
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//New Detroit Visitor Bureau//Events//EN', 'BEGIN:VEVENT',
      `UID:${e.slug}@new-detroit`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${e.date.replace(/-/g, '')}T${e.time.replace(':', '')}00`, 'DURATION:PT4H',
      `SUMMARY:${e.title} — New Detroit`, `LOCATION:${e.venue}\\, ${e.district}\\, New Detroit`,
      `DESCRIPTION:${e.line.replace(/,/g, '\\,')} Dress like it's the last night.`, 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `new-detroit-${e.slug}.ics`;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    ND.toast(`■ ${e.title.toLowerCase()} · ${e.dd}.${e.mm} · saved. don't plan to sleep after.`);
  }));

  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#evList', start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo(rows, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .07, ease: 'expo.out' }),
    });
  }
  if (ND.hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
