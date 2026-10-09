/* =========================================================
   NEW DETROIT — nightlife.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const { $, $$ } = ND;
  const pick = (a) => a[Math.random() * a.length | 0];

  /* =========================================================
     SC. 01 · AFTER DARK — stretched poster title
     ========================================================= */
  const nhIn = $('.nh-in'), nhLine = $('.nh-line');
  const nhLetters = ND.letterize(nhIn);
  const fit = () => {
    ND.stretch(nhIn, nhLine, { width: .95, height: innerWidth < 600 ? .2 : .36, maxY: 4 });
    nhLine.style.height = (nhIn.offsetHeight * parseFloat(nhLine.style.getPropertyValue('--sy'))) + 'px';
  };
  fit();
  document.fonts?.ready.then(() => { fit(); ND.hasGsap && ScrollTrigger.refresh(); });
  window.addEventListener('resize', fit);
  let heroReady = !ND.motion;
  ND.pull(nhLetters, $('#nh'), () => heroReady);
  if (ND.motion) {
    gsap.timeline({ delay: .35, defaults: { ease: 'expo.out' }, onComplete: () => { heroReady = true; } })
      .fromTo('#nh > .slot', { scale: 1.25 }, { scale: 1.04, duration: 2.4 }, 0)
      .fromTo(nhLetters, { scaleY: 0 }, { scaleY: 1, duration: 1.2, stagger: { each: .05, from: 'random' } }, .2)
      .fromTo('#nh .hero-ask-row > span', { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .04 }, .4)
      .fromTo('.nh-neon', { xPercent: 160 }, { xPercent: 0, duration: 1 }, .6)
      .fromTo('.nh-foot > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1 }, .7);
    gsap.to(nhLetters, {
      yPercent: -200, stagger: { each: .02, from: 'random' }, ease: 'none',
      scrollTrigger: { trigger: '#nh', start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }

  /* =========================================================
     OPEN / LAST CALL — it's always 2 AM here
     ========================================================= */
  const toMin = (t) => {
    const named = { sunrise: '06:00', late: '05:00', 'till you lose': '05:00' };
    const [h, m] = (named[t] || t).split(':').map(Number);
    return h * 60 + m;
  };
  const venues = $$('.venue');
  venues.forEach((v) => {
    const st = $('.v-status', v);
    if (v.dataset.close === '24/7') { st.textContent = '● OPEN · NEVER CLOSES'; return; }
    const now = 2 * 60 + new Date().getMinutes();
    let open = toMin(v.dataset.open), close = toMin(v.dataset.close), t = now;
    if (close <= open) close += 1440;
    if (t < open) t += 1440;
    const left = close - t;
    if (t >= open && left > 0) {
      if (left <= 120) { st.textContent = `● LAST CALL · ${Math.floor(left / 60)}H ${left % 60}M LEFT`; st.classList.add('is-last'); }
      else st.textContent = '● OPEN NOW';
    } else st.textContent = `○ OPENS ${v.dataset.open}`;
  });

  /* =========================================================
     SC. 02 · THE TOWER — signs light up, the elevator follows you
     ========================================================= */
  const rows = $$('.fl-row');
  const lift = $('#lift'), liftNum = $('#liftNum');
  const flicker = (row, on) => {
    if (!ND.motion) { row.classList.toggle('is-lit', on); return; }
    // neon doesn't just switch: it stutters first
    let n = 0; const steps = on ? 5 : 3;
    const iv = setInterval(() => {
      row.classList.toggle('is-lit', n % 2 === 0 ? on : !on);
      if (++n >= steps) { row.classList.toggle('is-lit', on); clearInterval(iv); }
    }, 70);
  };
  const moveLift = (row) => {
    if (!row) return;
    const shaft = lift.parentElement.getBoundingClientRect(), r = row.getBoundingClientRect();
    const y = r.top - shaft.top + (r.height - lift.offsetHeight) / 2;
    const floor = $('.fl-sign', row).dataset.floor;
    if (ND.hasGsap) gsap.to(lift, { y, duration: .7, ease: 'power3.inOut' }); else lift.style.transform = `translateY(${y}px)`;
    ND.scramble(liftNum, floor, 400);
    rows.forEach((x) => x.classList.toggle('is-here', x === row));
  };
  rows.forEach((row) => {
    const a = $('.fl-sign', row);
    a.addEventListener('pointerenter', () => moveLift(row));
    a.addEventListener('focus', () => moveLift(row));
    a.addEventListener('click', (e) => {
      e.preventDefault();
      moveLift(row);
      // ding: doors open, the page rides down to the venue
      setTimeout(() => { ND.flash(.3); ND.toast(`■ ding. ${a.dataset.floor} — ${$('.fl-name', a).textContent.toLowerCase()}`); ND.scrollTo('#' + row.dataset.slug); }, 650);
    });
  });
  const ground = rows.find((r) => $('.fl-sign', r).dataset.floor === '1F');
  window.addEventListener('load', () => moveLift(ground));
  window.addEventListener('resize', () => moveLift($('.fl-row.is-here') || ground));

  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#towerBox', start: 'top 75%', once: true,
      onEnter: () => {
        gsap.fromTo('#towerBox', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' });
        // bottom floor first, like the building waking up
        rows.slice().reverse().forEach((r, i) => setTimeout(() => flicker(r, true), 700 + i * 140 + Math.random() * 120));
      },
    });
  } else rows.forEach((r) => r.classList.add('is-lit'));

  // filters: other floors go dark, their venues step aside
  const filters = $$('.filter');
  filters.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.f;
    filters.forEach((x) => x.classList.toggle('is-on', x === b));
    rows.forEach((r) => {
      const match = f === 'all' || r.dataset.cat === f;
      r.classList.toggle('is-off', !match);
      if (match !== r.classList.contains('is-lit')) flicker(r, match);
    });
    venues.forEach((v) => v.classList.toggle('is-hidden', !(f === 'all' || v.dataset.cat === f)));
    ND.hasGsap && ScrollTrigger.refresh();
    const first = rows.find((r) => !r.classList.contains('is-off'));
    moveLift(first);
  }));

  /* =========================================================
     SC. 03 · THE VENUES — try the door
     ========================================================= */
  const KEY = 'night';
  const load = () => { try { return JSON.parse(ND.store.get(KEY) || '[]'); } catch (e) { return []; } };
  let night = load();
  const save = () => ND.store.set(KEY, JSON.stringify(night));
  const IN = ['the doorman nods. once.', 'your shoes passed. barely.', 'the rope lifts. don\'t look back.', 'she checks the list. you\'re on it now.'];
  const OUT = ['"not with those shoes."', '"come back with a better story."', '"we\'re full. we\'re always full."', '"try again when you mean it."'];

  const stamp = (v, ok, animate) => {
    const s = $('.v-stamp', v);
    s.textContent = ok ? 'YOU\'RE IN' : 'NOT TONIGHT';
    s.className = 'v-stamp ' + (ok ? 'is-in' : 'is-out');
    if (ND.hasGsap && animate && !ND.reduced) {
      gsap.fromTo(s, { xPercent: -50, yPercent: -50, scale: 2.6, opacity: 0, rotation: -24 }, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, rotation: -10, duration: .35, ease: 'back.out(2.4)' });
      gsap.fromTo($('.v-photo', v), { x: -6 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)', delay: .3 });
    } else {
      s.style.transform = 'translate(-50%,-50%) rotate(-10deg) scale(1)'; s.style.opacity = 1;
    }
  };
  const setIn = (v) => {
    const btn = $('.v-door', v);
    btn.disabled = true;
    btn.querySelector('span').textContent = 'you\'re in';
    btn.querySelector('i').textContent = '✓';
  };
  venues.forEach((v) => {
    const btn = $('.v-door', v), verdict = $('.v-verdict', v);
    if (night.includes(v.id)) { stamp(v, true, false); setIn(v); verdict.innerHTML = '<b>■</b> already on your night.'; }
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      btn.disabled = true;
      ND.scramble(verdict, 'THE DOORMAN IS LOOKING AT YOUR SHOES...', 600);
      setTimeout(() => {
        const ok = Math.random() < .72;
        stamp(v, ok, true);
        if (ok) {
          ND.flash(.5);
          verdict.innerHTML = `<b>■</b> ${pick(IN)}`;
          setIn(v);
          if (!night.includes(v.id)) { night.push(v.id); save(); render(true); }
        } else {
          verdict.innerHTML = `<b>×</b> ${pick(OUT)}`;
          btn.querySelector('span').textContent = 'try again';
          setTimeout(() => { btn.disabled = false; }, 1200);
        }
      }, 1300);
    });
  });

  if (ND.motion) {
    venues.forEach((v) => ScrollTrigger.create({
      trigger: v, start: 'top 78%', once: true,
      onEnter: () => {
        gsap.fromTo($('.v-photo .slot', v), { clipPath: 'inset(0 0 100% 0)', y: 60 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.3, ease: 'expo.inOut' });
        gsap.fromTo($('.v-floor', v), { xPercent: -120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .8, ease: 'expo.out', delay: .6 });
        gsap.fromTo($$('.v-meta, .v-line, .v-grid > *, .v-door', v), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .08, ease: 'expo.out', delay: .2 });
        $$('.v-hours b, .v-status', v).forEach((el) => ND.scramble(el, el.textContent, 900));
      },
    }));
  }

  /* =========================================================
     SC. 04 · YOUR NIGHT — receipt, in crawl order
     ========================================================= */
  const list = $('#rcList'), empty = $('#rcEmpty'), count = $('#rcCount'), pill = $('#nightPill'), pillCount = $('#pillCount');
  const d = new Date();
  $('#rcDate').textContent = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')} · 02:${String(d.getMinutes()).padStart(2, '0')}`;
  const nightOrder = (v) => { const m = toMin(v.dataset.open); return m < 12 * 60 ? m + 1440 : m; };
  function render(fresh) {
    const items = night.map((id) => $('#' + id)).filter(Boolean).sort((a, b) => nightOrder(a) - nightOrder(b));
    list.innerHTML = items.map((v) => `<li><b>${v.dataset.open}</b><span>${v.dataset.name}</span><span>${v.dataset.floor}</span></li>`).join('');
    empty.hidden = items.length > 0;
    count.textContent = items.length;
    pillCount.textContent = items.length;
    pill.classList.toggle('is-on', items.length > 0 && !nightInView);
    if (fresh && ND.hasGsap && !ND.reduced) gsap.fromTo(pill, { scale: 1.3 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
  }
  let nightInView = false;
  new IntersectionObserver(([e]) => { nightInView = e.isIntersecting; pill.classList.toggle('is-on', night.length > 0 && !nightInView); }, { threshold: .2 }).observe($('#night'));
  render(false);
  $('#rcClear').addEventListener('click', () => {
    night = []; save(); render(false);
    venues.forEach((v) => {
      const s = $('.v-stamp', v); s.removeAttribute('style'); s.className = 'v-stamp'; if (ND.hasGsap) gsap.set(s, { clearProps: 'all' });
      const btn = $('.v-door', v); btn.disabled = false; btn.querySelector('span').textContent = 'try the door'; btn.querySelector('i').textContent = '→';
      $('.v-verdict', v).textContent = '';
    });
    ND.toast('■ new night. clean slate. same shoes.');
  });
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#receipt', start: 'top 80%',
      onEnter: () => gsap.fromTo('#receipt', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'steps(14)' }),
    });
  }

  if (ND.hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
