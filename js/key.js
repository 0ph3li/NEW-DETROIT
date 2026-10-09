/* =========================================================
   NEW DETROIT — key.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const { $, $$ } = ND;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* SC. 01 · THE KEY */
  ND.poster({ section: '#kh', inner: '.kh-in', line: '.kh-line', neon: '.kh-neon', foot: '.kh-foot > *' });

  const DIST = {
    'silk-row': { name: 'Silk Row', jp: '絹通り' },
    'chrome-heights': { name: 'Chrome Heights', jp: 'クロム丘' },
    'lace-district': { name: 'Lace District', jp: 'レース街' },
    'pool-hall': { name: 'The Pool Hall', jp: '玉突き場' },
    'fur-coast': { name: 'The Fur Coast', jp: '毛皮海岸' },
  };
  // behind the door: your night, three stops in your district, ending in your room
  const PLAN = {
    'silk-row': { hotel: 'charmeuse', stops: [
      ['21:00', 'bar', 'The Lantern Bar', 'img/DISTRICTS/silk-row-2.jpg', 'nightlife.html#lantern-bar'],
      ['23:00', 'pop-up', 'Leopard Season', 'img/EVENTS/leopard-season.jpg', 'events.html#leopard-season']] },
    'chrome-heights': { hotel: 'the-88', stops: [
      ['01:00', 'club', 'Chrome Chapel', 'img/DISTRICTS/chrome-heights-3.jpg', 'nightlife.html#chrome-chapel'],
      ['02:30', 'runway', 'Rooftop Runway', 'img/EVENTS/rooftop-runway.jpg', 'events.html#rooftop-runway']] },
    'lace-district': { hotel: 'capsule-lace', stops: [
      ['23:30', 'club', 'Club Hikari', 'img/NIGHTLIFE/club-hikari.jpg', 'nightlife.html#club-hikari'],
      ['00:00', 'runway', 'Lantern Night', 'img/EVENTS/lantern-night.jpg', 'events.html#lantern-night']] },
    'pool-hall': { hotel: 'motel-velvet', stops: [
      ['21:00', 'pool hall', 'The Cue Club', 'img/DISTRICTS/pool-hall-1.jpg', 'nightlife.html#cue-club'],
      ['02:00', 'pop-up', 'Downstairs Sale', 'img/EVENTS/downstairs-sale.jpg', 'events.html#downstairs-sale']] },
    'fur-coast': { hotel: 'hotel-polar', stops: [
      ['22:00', 'pool hall', 'Bank Shot', 'img/NIGHTLIFE/bank-shot.jpg', 'nightlife.html#bank-shot'],
      ['00:30', 'runway', 'The Boat Show', 'img/EVENTS/boat-show.jpg', 'events.html#boat-show']] },
  };
  const ROOMS = {
    charmeuse: ['101', 'Hotel Charmeuse', 'img/STAY/charmeuse-room.jpg'],
    'the-88': ['8808', 'The 88', 'img/STAY/the-88-room.jpg'],
    'capsule-lace': ['033', 'Ryokan Lace', 'img/STAY/capsule-lace-room.jpg'],
    'motel-velvet': ['404', 'Motel Velvet', 'img/STAY/motel-velvet-room.jpg'],
    'champagne-motel': ['007', 'Champagne Motel', 'img/STAY/champagne-motel-room.jpg'],
    'hotel-polar': ['1208', 'Hotel Polar', 'img/STAY/hotel-polar-room.jpg'],
  };

  /* =========================================================
     SC. 03 · THE FORGE — engrave as you type, forge with sparks
     ========================================================= */
  const ctl = ND.key3d($('#forgeKey'), $('#forgeKeyIn'), { tilt: $('#forgeStage') });
  const form = $('#forgeForm'), nameIn = $('#kName'), pledge = $('#kPledge');
  const noEl = $('#kNo'), stateEl = $('#kState'), saveBtn = $('#saveKey');
  // nothing is remembered between visits: no name, no answers, no key
  let key = null;
  let chosen = null; // { slug, luxe } once the machine has decided
  const engraveLive = () => ctl.engrave(nameIn.value.trim(), key ? `№${key.no}` : '');
  nameIn.addEventListener('input', () => ctl.engrave(nameIn.value.trim(), key ? `№${key.no}` : ''));

  const showForged = (k, fresh) => {
    noEl.textContent = k.no;
    const d = new Date(k.at);
    stateEl.textContent = `forged ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')} · ${DIST[k.district].name.toLowerCase()} · drag to spin`;
    saveBtn.hidden = false;
    if (fresh) ND.scramble(noEl, k.no, 900);
    setDoor();
  };
  engraveLive();

  // sparks fly off the anvil
  const sparks = $('#sparks');
  const burst = () => {
    if (!ND.hasGsap || ND.reduced) return;
    for (let i = 0; i < 46; i++) {
      const s = document.createElement('i'); s.className = 'spark'; sparks.append(s);
      const a = rand(0, Math.PI * 2), d = rand(120, 420);
      gsap.fromTo(s, { x: 0, y: 0, rotation: a * 180 / Math.PI + 90, opacity: 1, scaleY: rand(.6, 1.6) },
        { x: Math.cos(a) * d, y: Math.sin(a) * d + rand(40, 160), opacity: 0, duration: rand(.6, 1.2), ease: 'power2.out', onComplete: () => s.remove() });
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // the pledge signs itself: nobody here gets turned away at the forge
    if (!pledge.checked) {
      pledge.checked = true;
      if (ND.hasGsap) gsap.fromTo('.pledge', { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)' });
    }
    // no district yet: the machine has to decide first
    if (!chosen) {
      ND.toast('■ the machine decides your district first. six questions.');
      ND.scrollTo('#test');
      return;
    }
    const name = (nameIn.value.trim() || 'anonymous').slice(0, 16);
    key = { name, district: chosen.slug, luxe: chosen.luxe, no: String(Math.floor(rand(1, 9999))).padStart(4, '0'), at: Date.now() };
    // the forge: heat, spin, sparks, engrave, cool down
    const stage = $('#forgeStage');
    stage.classList.add('is-hot');
    ctl.kick(70);
    ND.flash(.6);
    burst();
    setTimeout(burst, 260);
    ctl.engrave(name, `№${key.no}`);
    if (ND.hasGsap && !ND.reduced) gsap.fromTo('#forgeKey', { scale: .85 }, { scale: 1, duration: 1.2, ease: 'elastic.out(1,.4)' });
    setTimeout(() => stage.classList.remove('is-hot'), 1400);
    showForged(key, true);
    ND.toast(`■ key № ${key.no} forged for ${name.toLowerCase()}. don't lose it. you will.`);
  });

  // save your key: a postcard-sized PNG of it
  saveBtn.addEventListener('click', async () => {
    if (!key) return;
    try { await document.fonts.load('700 64px Oswald'); } catch (_) {}
    const c = document.createElement('canvas'); c.width = 1200; c.height = 675;
    const x = c.getContext('2d');
    x.fillStyle = '#0a0a0a'; x.fillRect(0, 0, c.width, c.height);
    const g = x.createRadialGradient(600, 330, 20, 600, 330, 520);
    g.addColorStop(0, 'rgba(236,229,214,.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#d3121b'; x.fillRect(0, 0, c.width, 14);
    const svg = ctl.svg().replace(/ style="[^"]*"/, '').replace('<svg ', '<svg width="900" height="415" ');
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await img.decode().catch(() => {});
    x.drawImage(img, 150, 92, 900, 415);
    x.fillStyle = '#f6f2e8'; x.font = '700 54px Oswald, Arial Narrow, sans-serif'; x.textBaseline = 'top';
    x.fillText('THE KEY TO NEW DETROIT', 60, 50);
    x.fillStyle = '#d3121b'; x.font = '700 84px Oswald, Arial Narrow, sans-serif';
    x.fillText(key.name.toUpperCase(), 60, 520);
    x.fillStyle = '#9a958b'; x.font = '400 20px "Space Mono", monospace';
    x.fillText(`KEY № ${key.no} · ${DIST[key.district].name.toUpperCase()} · OPENS EVERY DOOR AFTER MIDNIGHT`, 60, 622);
    x.textAlign = 'right'; x.fillStyle = '#ece5d6'; x.font = '400 16px "Space Mono", monospace';
    x.fillText('concept, design & code by ghostly.grl ♥', 1140, 58);
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = `new-detroit-key-${key.no}.png`;
    document.body.append(a); a.click(); a.remove();
    ND.toast('■ saved. a key in your camera roll is still a key.');
  });

  /* =========================================================
     SC. 02 · THE NIGHT TEST — six questions, one district, one room
     ========================================================= */
  // every answer leans toward districts (s c l p f) and toward luxe (+) or wild (−)
  const Q = [
    { q: 'It\'s 2 AM. Where are you?', a: [
      ['Trying on something I can\'t afford', { s: 3 }, 1],
      ['Somewhere very high, looking down', { c: 3 }, 1],
      ['In an alley I won\'t find again', { l: 3 }, 0],
      ['Losing at pool. On purpose.', { p: 3 }, -1],
      ['On a boat, apparently', { f: 3 }, -1],
    ] },
    { q: 'Pick a texture.', a: [
      ['Silk', { s: 2 }, 1], ['Chrome', { c: 2 }, 0], ['Lace', { l: 2 }, 0], ['Crushed velvet', { p: 2 }, -1], ['Faux fur', { f: 2 }, 0],
    ] },
    { q: 'Your exit strategy.', a: [
      ['A dramatic one, in heels', { s: 2, f: 1 }, 1],
      ['The elevator, all the way down', { c: 2 }, 1],
      ['A side door only I know', { l: 2, p: 1 }, 0],
      ['There is no exit', { p: 2, l: 1 }, -2],
      ['The last boat out', { f: 2 }, -1],
    ] },
    { q: 'What are you drinking?', a: [
      ['Champagne, obviously', { s: 1, f: 2 }, -1],
      ['Something with a tiger on it', { p: 2 }, -1],
      ['Whatever is glowing', { c: 2 }, 0],
      ['Tea that is not really tea', { l: 2 }, 1],
      ['A martini, on a pillow', { f: 2, s: 1 }, 2],
    ] },
    { q: 'Heels or blades?', a: [
      ['Heels', { s: 2, c: 1 }, 1],
      ['Blades', { p: 2, l: 1 }, -1],
      ['Both. At once.', { f: 1, p: 1, s: 1 }, -1],
      ['Neither. I float.', { c: 2, l: 1 }, 1],
    ] },
    { q: 'How do you want to wake up?', a: [
      ['I don\'t', { p: 2 }, -2],
      ['On silk, at noon', { s: 2 }, 2],
      ['Above the clouds', { c: 2 }, 1],
      ['On tatami, the moon still in the window', { l: 2 }, 1],
      ['On a boat I don\'t remember boarding', { f: 2 }, -2],
    ] },
  ];
  const RES = {
    s: { slug: 'silk-row', num: '01', name: 'Silk Row', jp: '絹通り', why: 'You dress for the window, not the weather. Old money, new mirrors, and a fitting at 3 AM.' },
    c: { slug: 'chrome-heights', num: '02', name: 'Chrome Heights', jp: 'クロム丘', why: 'You like the city best from above, and a little bit on a giant screen. Nothing matte, ever.' },
    l: { slug: 'lace-district', num: '03', name: 'Lace District', jp: 'レース街', why: 'You know the alleys nobody else can find. Lanterns, secrets, and a door only you can open.' },
    p: { slug: 'pool-hall', num: '04', name: 'The Pool Hall', jp: '玉突き場', why: 'Leopard felt, steady hands, no clocks. You call your pocket and you never leave early.' },
    f: { slug: 'fur-coast', num: '05', name: 'The Fur Coast', jp: '毛皮海岸', why: 'Cold air, warm rumours, a boat waiting. You arrive in fur and leave whenever the harbour turns pink.' },
  };
  const ORDER = ['s', 'c', 'l', 'p', 'f'];
  const qText = $('#qText'), qOpts = $('#qOpts'), qNum = $('#qNum'), qBack = $('#qBack'), line = $('#mLine');
  const machine = $('#machine'), tWrap = $('#ticketWrap');
  let answers = [];

  const renderQ = (i, dir = 1) => {
    const q = Q[i];
    qNum.textContent = `Q${i + 1} / ${Q.length}`;
    qText.innerHTML = `<small>QUESTION ${String(i + 1).padStart(2, '0')}</small>`;
    qText.append(q.q);
    qOpts.innerHTML = '';
    q.a.forEach(([label], k) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'q-opt';
      b.innerHTML = `<b>${'ABCDE'[k]}</b><span></span>`;
      $('span', b).textContent = label;
      if (answers[i] === k) b.classList.add('is-picked');
      b.addEventListener('click', () => pickA(i, k, b));
      qOpts.append(b);
    });
    qBack.hidden = i === 0;
    $$('li', line).forEach((li, k) => { li.classList.toggle('is-done', k < i); li.classList.toggle('is-now', k === i); });
    line.style.setProperty('--p', `${(i / (Q.length - 1)) * 100}%`);
    if (ND.hasGsap && !ND.reduced) {
      gsap.fromTo(qText, { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: 'expo.out' });
      gsap.fromTo($$('.q-opt', qOpts), { x: 60 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: .5, stagger: .05, ease: 'expo.out' });
    }
  };
  const pickA = (i, k, b) => {
    answers[i] = k;
    $$('.q-opt', qOpts).forEach((x) => x.classList.toggle('is-picked', x === b));
    setTimeout(() => (i < Q.length - 1 ? renderQ(i + 1) : printTicket()), 260);
  };
  qBack.addEventListener('click', () => {
    const i = Math.max(0, answers.filter((x) => x !== undefined).length - 1);
    answers.length = i; renderQ(i, -1);
  });

  const score = () => {
    const pts = { s: 0, c: 0, l: 0, p: 0, f: 0 }; let luxe = 0;
    answers.forEach((k, i) => { const [, w, lx] = Q[i].a[k]; Object.entries(w).forEach(([d, v]) => { pts[d] += v; }); luxe += lx; });
    const top = ORDER.slice().sort((a, b) => pts[b] - pts[a])[0];
    const max = Math.max(...Object.values(pts)) || 1;
    return { pts, luxe, top, max };
  };

  function printTicket(saved) {
    const r = saved || (() => { const { pts, luxe, top, max } = score(); return { top, luxe, pct: Object.fromEntries(ORDER.map((d) => [d, Math.round(9 + (pts[d] / max) * 91)])), at: Date.now() }; })();
    const d = RES[r.top];
    chosen = { slug: d.slug, luxe: r.luxe };
    // the forge picks it up: this is the district that goes on the key
    $('#forgeDistName').textContent = `ND${d.num} · ${d.name}`;
    $('#forgeDist').classList.add('is-set');
    $('#forgeDistGo').textContent = 'not you? take the test again ↑';
    $('#tNum').textContent = `ND${d.num}`;
    $('#tDist').textContent = d.name;
    $('#tJp').textContent = d.jp;
    $('#tWhy').textContent = d.why;
    const dt = new Date(r.at);
    $('#tDate').textContent = `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')} · 02:${String(dt.getMinutes()).padStart(2, '0')}`;
    $('#tBars').innerHTML = ORDER.map((k) => `<div class="t-bar${k === r.top ? ' is-top' : ''}"><span>${RES[k].name}</span><i style="--w:0%"></i><b>${r.pct[k]}%</b></div>`).join('');
    $('#tRide').href = `districts.html#${d.slug}`;
    $('#tRide').innerHTML = `ride to ${d.name.toLowerCase()} <i aria-hidden="true">→</i>`;
    $$('li', line).forEach((li) => { li.classList.add('is-done'); li.classList.remove('is-now'); });
    line.style.setProperty('--p', '100%');
    qText.innerHTML = '<small>PRINTING</small>Your ticket is coming out.';
    qOpts.innerHTML = ''; qBack.hidden = true; qNum.textContent = 'DONE';
    tWrap.hidden = false;
    ND.reserve?.();
    const fill = () => $$('.t-bar', tWrap).forEach((b, i) => setTimeout(() => { $('i', b).style.setProperty('--w', `${r.pct[ORDER[i]]}%`); }, 300 + i * 120));
    if (ND.hasGsap && !ND.reduced && !saved) {
      ND.flash(.3);
      // the ticket feeds out of the slot, line by line
      gsap.fromTo('#ticket', { clipPath: 'inset(0 0 100% 0)', y: -30 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.6, ease: 'steps(16)', onComplete: () => { fill(); ScrollTrigger.refresh(); } });
      gsap.fromTo('.t-ctl', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, delay: 1.5 });
      ND.scramble($('#tNum'), `ND${d.num}`, 1200);
      setTimeout(() => ND.scrollTo('#ticketWrap'), 300);
    } else { fill(); ND.hasGsap && ScrollTrigger.refresh(); }
  }
  $('#tAgain').addEventListener('click', () => {
    answers = []; tWrap.hidden = true; chosen = null;
    $('#forgeDistName').textContent = 'not decided yet'; $('#forgeDist').classList.remove('is-set');
    $('#forgeDistGo').textContent = 'the machine decides ↑ take the test';
    renderQ(0); ND.scrollTo('#machine'); ND.hasGsap && ScrollTrigger.refresh();
  });
  $('#tForge').addEventListener('click', (e) => { e.preventDefault(); ND.scrollTo('#forge'); setTimeout(() => $('#kName').focus({ preventScroll: true }), 1200); });

  renderQ(0);
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: machine, start: 'top 80%', once: true,
      onEnter: () => gsap.fromTo(machine, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }),
    });
  }

  /* =========================================================
     SC. 04 · THE DOOR — drag the key into the lock
     ========================================================= */
  const wrap = $('#doorWrap'), lock = $('#lock'), mini = $('#miniKey');
  const leafL = $('#leafL'), leafR = $('#leafR');
  let open = false;
  function setDoor() {
    $('#doorHint').innerHTML = key
      ? `Key № ${key.no}. Drag it into the lock. <span class="mono red">(or press "use the key")</span>`
      : 'Drag the key into the lock. <span class="mono red">(no key yet? you get a visitor one)</span>';
    $$('.leaf-no')[1].textContent = key ? key.no : '0808';
  }
  setDoor();
  const lockCenter = () => {
    const l = lock.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    return { x: l.left + l.width / 2 - w.left, y: l.top + 66 - w.top };
  };
  const keyHome = () => ({ x: 0, y: 0 });

  const forgeVisitor = () => {
    if (key) return;
    if (!chosen) {
      const ds = Object.keys(DIST);
      chosen = { slug: ds[Math.random() * ds.length | 0], luxe: 0 };
      $('#forgeDistName').textContent = `${DIST[chosen.slug].name} (visitor)`;
      $('#forgeDist').classList.add('is-set');
    }
    if (!nameIn.value.trim()) nameIn.value = 'visitor';
    pledge.checked = true;
    form.requestSubmit();
  };
  const unlock = () => {
    if (open) return;
    if (!key) forgeVisitor();
    if (!key) return;
    open = true;
    const d = DIST[key.district];
    // the room: from your night test if you took it, otherwise your district's hotel
    // the Fur Coast has two doors: wild answers get the motel
    const hotel = key.district === 'fur-coast' && key.luxe < 0 ? 'champagne-motel' : PLAN[key.district].hotel;
    const [no, hname, rimg] = ROOMS[hotel];
    $('#roomImg').src = rimg; $('#roomImg').alt = `Room ${no} at ${hname}`;
    $('#roomNo').textContent = no;
    $('#roomHotel').textContent = hname;
    $('#roomKey').textContent = `KEY № ${key.no} · ${d.name.toUpperCase()}`;
    const plan = $('#plan');
    plan.innerHTML = '';
    [...PLAN[key.district].stops, ['04:00', 'sleep, eventually', `${hname} · room ${no}`, rimg, `stay.html#${hotel}`]].forEach(([when, what, name, img, href], i) => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="plan-card" data-step="0${i + 1}" href="${href}"><img alt="" src="${img}"><span><span class="when"></span><span class="what"></span><b></b><span class="go">go →</span></span></a>`;
      $('.when', li).textContent = when; $('.what', li).textContent = what; $('b', li).textContent = name;
      plan.append(li);
    });
    $('#lockAgain').hidden = false;
    $('#useKey').hidden = true;
    if (!ND.hasGsap || ND.reduced) { leafL.style.transform = 'rotateY(-100deg)'; leafR.style.transform = 'rotateY(100deg)'; lock.style.opacity = 0; mini.style.opacity = 0; return; }
    const c = lockCenter(), w = wrap.getBoundingClientRect(), m = mini.getBoundingClientRect();
    gsap.timeline()
      // into the hole, a quarter turn, a heavy clunk
      .to(mini, { x: c.x - (m.left - w.left + m.width / 2) + gsap.getProperty(mini, 'x'), y: c.y - (m.top - w.top + m.height / 2) + gsap.getProperty(mini, 'y'), rotation: -90, scale: .55, duration: .5, ease: 'power3.inOut' })
      .to(mini, { rotation: 0, duration: .35, ease: 'back.out(3)' })
      .call(() => { ND.flash(.4); ND.toast(`■ click. room ${no} is yours, ${key.name.toLowerCase()}. so is the night.`); })
      .fromTo(lock, { x: -6 }, { x: 0, duration: .4, ease: 'elastic.out(1,.3)' }, '<')
      .to([lock, mini], { opacity: 0, duration: .3 })
      .to(leafL, { rotationY: -100, duration: 1.6, ease: 'power3.inOut' }, '<')
      .to(leafR, { rotationY: 100, duration: 1.6, ease: 'power3.inOut' }, '<')
      // the room drifts into focus, the plate swings on its nail, the night is dealt like tickets
      .fromTo('#roomImg', { scale: 1.25, filter: 'brightness(.3) blur(6px)' }, { scale: 1.08, filter: 'brightness(1) blur(0px)', duration: 1.6, ease: 'power2.out' }, '<.2')
      .fromTo('#roomPlate', { rotation: -14, transformOrigin: '50% 0%', opacity: 0 }, { rotation: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1,.4)' }, '-=.9')
      .fromTo('.room-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out' }, '-=.9')
      .fromTo('#plan li', { y: 120, rotation: (i) => [-8, 4, -3][i], opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .9, stagger: .14, ease: 'expo.out' }, '-=.6');
  };
  const relock = () => {
    open = false;
    $('#lockAgain').hidden = true;
    $('#useKey').hidden = false;
    if (!ND.hasGsap || ND.reduced) { leafL.style.transform = ''; leafR.style.transform = ''; lock.style.opacity = ''; mini.style.opacity = ''; return; }
    gsap.timeline()
      .to([leafL, leafR], { rotationY: 0, duration: 1.1, ease: 'power3.inOut' })
      .to(lock, { opacity: 1, duration: .3 })
      .set(mini, { x: 0, y: 0, rotation: 0, scale: 1 })
      .to(mini, { opacity: 1, duration: .3 });
  };

  // drag the key; near the hole the lock glows, let go to turn it
  let drag = null;
  mini.addEventListener('pointerdown', (e) => {
    if (open) return;
    drag = { sx: e.clientX, sy: e.clientY, x: ND.hasGsap ? gsap.getProperty(mini, 'x') : 0, y: ND.hasGsap ? gsap.getProperty(mini, 'y') : 0 };
    try { mini.setPointerCapture(e.pointerId); } catch (_) {}
  });
  const near = () => {
    const c = lockCenter(), w = wrap.getBoundingClientRect(), m = mini.getBoundingClientRect();
    return Math.hypot(m.left - w.left + m.width / 2 - c.x, m.top - w.top + m.height / 2 - c.y) < 90;
  };
  mini.addEventListener('pointermove', (e) => {
    if (!drag || !ND.hasGsap) return;
    gsap.set(mini, { x: drag.x + e.clientX - drag.sx, y: drag.y + e.clientY - drag.sy, rotation: (e.clientX - drag.sx) * .05 });
    lock.classList.toggle('is-near', near());
  });
  const drop = () => {
    if (!drag) return;
    drag = null;
    const hit = near();
    lock.classList.remove('is-near');
    if (hit) unlock();
    else if (ND.hasGsap) gsap.to(mini, { ...keyHome(), rotation: 0, duration: .6, ease: 'elastic.out(1,.5)' });
  };
  mini.addEventListener('pointerup', drop);
  mini.addEventListener('pointercancel', drop);
  mini.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); unlock(); } });
  $('#useKey').addEventListener('click', unlock);
  $('#lockAgain').addEventListener('click', relock);

  if (ND.motion) {
    ScrollTrigger.create({
      trigger: '#forgeKey', start: 'top 85%', once: true,
      onEnter: () => { ctl.kick(30); gsap.fromTo('#forgeKey', { y: -140, rotation: -24, opacity: 0, scale: .7 }, { y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1.6, ease: 'elastic.out(1,.55)' }); },
    });
    ScrollTrigger.create({
      trigger: '#doorWrap', start: 'top 80%', once: true,
      onEnter: () => {
        gsap.fromTo([leafL, leafR], { rotationY: (i) => (i ? 8 : -8) }, { rotationY: 0, duration: 1.2, ease: 'elastic.out(1,.5)' });
        gsap.fromTo(mini, { y: 80 }, { y: 0, duration: 1, ease: 'expo.out', delay: .4 });
      },
    });
  }
  if (ND.hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
