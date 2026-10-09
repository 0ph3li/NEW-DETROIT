/* =========================================================
   NEW DETROIT — stay.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const { $, $$ } = ND;
  const pick = (a) => a[Math.random() * a.length | 0];

  /* SC. 01 · DO NOT DISTURB */
  ND.poster({ section: '#sh', inner: '.sh-in', line: '.sh-line', neon: '.sh-neon', foot: '.sh-foot > *' });

  /* =========================================================
     SC. 02 · RECEPTION — keys swing, the bell rings
     ========================================================= */
  const tags = $$('.tag');
  if (ND.motion) {
    // every key sways a little on its own, like the door just closed
    tags.forEach((t, i) => gsap.to(t, { rotation: gsap.utils.random(-2.5, 2.5), duration: gsap.utils.random(1.6, 2.6), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .2 }));
    ScrollTrigger.create({
      trigger: '#rack', start: 'top 80%', once: true,
      onEnter: () => {
        gsap.fromTo('#rack', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.inOut' });
        gsap.fromTo($$('.tag-body'), { yPercent: -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: .08, ease: 'bounce.out', delay: .5 });
      },
    });
  }
  const swing = (t, dir) => {
    if (!ND.motion) return;
    gsap.killTweensOf(t, 'rotation');
    gsap.timeline()
      .to(t, { rotation: 16 * dir, duration: .22, ease: 'power2.out' })
      .to(t, { rotation: -11 * dir, duration: .4, ease: 'sine.inOut' })
      .to(t, { rotation: 6 * dir, duration: .4, ease: 'sine.inOut' })
      .to(t, { rotation: -2 * dir, duration: .4, ease: 'sine.inOut' })
      .to(t, { rotation: 0, duration: .5, ease: 'sine.out' });
  };
  tags.forEach((t) => {
    t.addEventListener('pointerenter', (e) => {
      const r = t.getBoundingClientRect();
      swing(t, e.clientX < r.left + r.width / 2 ? 1 : -1);
    });
    t.addEventListener('click', (e) => {
      e.preventDefault();
      const room = $('b', t).textContent, name = $('.tag-body span', t).textContent;
      const go = () => ND.scrollTo(t.getAttribute('href'));
      ND.toast(`■ room ${room} · ${name.toLowerCase()} · the key is yours`);
      if (!ND.motion) { go(); return; }
      // yank it off the hook, then hang it back once you're gone
      gsap.killTweensOf(t);
      gsap.timeline()
        .to(t, { y: -26, rotation: 0, duration: .18, ease: 'power2.out' })
        .to(t, { y: -140, opacity: 0, duration: .45, ease: 'power3.in' })
        .call(go)
        .set(t, { y: -40 }, '+=1.6')
        .to(t, { y: 0, opacity: 1, duration: .8, ease: 'bounce.out' });
    });
  });

  let rings = 0;
  const desk = ['front desk: we know.', 'the night porter is busy being fabulous.', 'ding. nobody comes. it\'s 2 AM.', 'reception is on a smoke break. since 1988.', 'someone shouts "coming!" from very far away.'];
  $('#bell').addEventListener('click', () => {
    rings++;
    ND.toast('■ ' + (rings >= 6 ? 'please stop. — reception' : pick(desk)));
    if (!ND.hasGsap || ND.reduced) return;
    gsap.timeline()
      .to('.bell-btn, .bell-stem', { y: 4, duration: .06, transformOrigin: '50% 100%' })
      .to('.bell-btn, .bell-stem', { y: 0, duration: .25, ease: 'back.out(4)' })
      .fromTo('.bell svg', { rotation: -6 }, { rotation: 0, duration: .6, ease: 'elastic.out(1,.25)', transformOrigin: '50% 100%' }, 0);
  });

  /* =========================================================
     SC. 03 · THE ROOMS — vacancy signs, reveals, guestbooks
     ========================================================= */
  const hotels = $$('.hotel');
  const full = pick(hotels.filter((h) => h.id !== 'champagne-motel'));
  hotels.forEach((h) => {
    const v = $('.vacancy', h), b = $('b', v);
    if (h === full) { b.textContent = 'NO VACANCY'; v.classList.add('is-full'); }
    if (h.id === 'champagne-motel') b.textContent = 'VACANCY?';
  });
  // signs buzz and drop out now and then
  if (ND.motion) {
    setInterval(() => {
      const v = $('.vacancy', pick(hotels));
      gsap.timeline().to(v, { opacity: .25, duration: .05 }).to(v, { opacity: 1, duration: .05 }).to(v, { opacity: .4, duration: .08 }).to(v, { opacity: 1, duration: .1 });
    }, 1400);

    hotels.forEach((h) => ScrollTrigger.create({
      trigger: h, start: 'top 78%', once: true,
      onEnter: () => {
        gsap.fromTo($('.h-main', h), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' });
        gsap.fromTo($('.h-room', h), { y: 80, rotation: 18, opacity: 0 }, { y: 0, rotation: 4, opacity: 1, duration: 1.2, ease: 'expo.out', delay: .6 });
        gsap.fromTo($$('.h-info > *', h), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .07, ease: 'expo.out', delay: .2 });
        gsap.fromTo($('.h-book', h), { y: 120, rotation: 6, opacity: 0 }, { y: 0, rotation: innerWidth > 900 ? -1 : 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: .4 });
        const b = $('.vacancy b', h); ND.scramble(b, b.textContent, 900);
      },
    }));
  }

  // guestbook: your own reviews stay in the book (this browser only)
  const KEY = 'reviews';
  const load = () => { try { return JSON.parse(ND.store.get(KEY) || '{}'); } catch (e) { return {}; } };
  const book = load();
  const stars = (n) => '★'.repeat(n) + `<i>${'★'.repeat(5 - n)}</i>`;
  const ago = (t) => {
    const m = Math.round((Date.now() - t) / 60000);
    return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
  };
  const addReview = (h, r, animate) => {
    const li = document.createElement('li');
    li.className = 'rv is-mine';
    li.innerHTML = `<span class="rv-stars" aria-label="${r.s} out of 5">${stars(r.s)}</span><p></p><span class="mono">you · ${ago(r.at)}</span>`;
    $('p', li).textContent = r.t; // never as html: it's your words
    $('.rv-list', h).prepend(li);
    if (animate && ND.hasGsap && !ND.reduced) gsap.fromTo(li, { height: 0, opacity: 0, x: -20 }, { height: 'auto', opacity: 1, x: 0, duration: .7, ease: 'expo.out' });
  };
  hotels.forEach((h) => {
    (book[h.id] || []).forEach((r) => addReview(h, r, false));
    const form = $('.sign', h), btns = $$('.sign-stars button', form), input = $('input', form);
    let val = 0;
    const light = (n) => btns.forEach((b, i) => b.classList.toggle('is-lit', i < n));
    btns.forEach((b, i) => {
      b.addEventListener('pointerenter', () => light(i + 1));
      b.addEventListener('click', () => { val = i + 1; btns.forEach((x, k) => x.setAttribute('aria-checked', k === i)); light(val); });
    });
    $('.sign-stars', form).addEventListener('pointerleave', () => light(val));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = input.value.trim();
      if (!val || !t) { ND.toast('■ the book wants stars and words. both.'); return; }
      const r = { s: val, t: t.slice(0, 80), at: Date.now() };
      (book[h.id] ||= []).push(r);
      ND.store.set(KEY, JSON.stringify(book));
      addReview(h, r, true);
      ND.flash(.25);
      ND.toast(`■ signed. ${h.dataset.name.toLowerCase()} will remember you.`);
      input.value = ''; val = 0; light(0); btns.forEach((x) => x.setAttribute('aria-checked', 'false'));
    });
  });

  if (ND.hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
