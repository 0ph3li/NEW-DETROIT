/* =========================================================
   NEW DETROIT — map.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const { $, $$ } = ND;
  const NS = 'http://www.w3.org/2000/svg';

  /* SC. 01 · YOU ARE HERE */
  ND.poster({ section: '#mh', inner: '.mh-in', line: '.mh-line', neon: '.mh-neon', foot: '.mh-foot > *' });

  /* =========================================================
     DATA — districts + every pin from the other pages
     ========================================================= */
  const W = 1600, H = 1000;
  const DIST = [
    { slug: 'silk-row', num: '01', name: 'Silk Row', jp: '絹通り', x: 410, y: 265, r: 190, fill: 'url(#f-silk)', stn: [420, 300], img: 'img/HOME/silk-row.jpg', line: 'Old money, new mirrors. The boulevard where every shop window is a dressing room.' },
    { slug: 'chrome-heights', num: '02', name: 'Chrome Heights', jp: 'クロム丘', x: 1180, y: 250, r: 210, fill: 'url(#f-chrome)', stn: [1180, 290], img: 'img/HOME/chrome-heights.jpg', line: 'Towers polished twice a night, screens forty storeys tall.' },
    { slug: 'lace-district', num: '03', name: 'Lace District', jp: 'レース街', x: 1190, y: 620, r: 170, fill: 'url(#f-lace)', stn: [1230, 610], img: 'img/HOME/lace-district.jpg', line: 'Narrow alleys stitched together with paper lanterns.' },
    { slug: 'pool-hall', num: '04', name: 'The Pool Hall', jp: '玉突き場', x: 790, y: 790, r: 175, fill: 'url(#f-velvet)', stn: [790, 790], img: 'img/HOME/pool-hall.jpg', line: 'Leopard felt, diamond lights, quiet hands.' },
    { slug: 'fur-coast', num: '05', name: 'The Fur Coast', jp: '毛皮海岸', x: 340, y: 640, r: 165, fill: 'url(#f-leopard)', stn: [330, 700], img: 'img/HOME/fur-coast.jpg', line: 'The frozen waterfront where the coats come out.' },
  ];
  const P = (layer, slug, name, type, x, y, img, meta, line, href) => ({ layer, slug, name, type, x, y, img, meta, line, href });
  const PINS = [
    P('nightlife', 'chrome-chapel', 'Chrome Chapel', 'club · chrome heights · 8F', 1110, 185, 'img/DISTRICTS/chrome-heights-3.jpg', '01:00 — SUNRISE', 'A red vault on the 88th floor. Nobody leaves before the sun does.', 'nightlife.html#chrome-chapel'),
    P('nightlife', 'champagne-motel', 'Champagne Motel', 'bar · the fur coast · 7F', 300, 590, 'img/DISTRICTS/fur-coast-2.jpg', '00:00 — 24/7', 'Cherry blossoms that never fall and a bar that never closes.', 'nightlife.html#champagne-motel'),
    P('nightlife', 'club-hikari', 'Club Hikari', 'club · lace district · 6F', 1200, 555, 'img/NIGHTLIFE/club-hikari.jpg', '23:30 — 06:00', 'A dance floor under a ceiling of red paper parasols.', 'nightlife.html#club-hikari'),
    P('nightlife', 'tiger-bar', 'The Tiger Bar', 'bar · the pool hall · 5F', 850, 735, 'img/DISTRICTS/pool-hall-3.jpg', '20:00 — 05:00', 'A tiger on the wall, two coupes on the bar.', 'nightlife.html#tiger-bar'),
    P('nightlife', 'corner-pocket', 'Corner Pocket', 'pool hall · silk row · 4F', 480, 225, 'img/NIGHTLIFE/corner-pocket.jpg', '20:00 — 04:00', 'Painted tigers, leopard stools, tables in the back room.', 'nightlife.html#corner-pocket'),
    P('nightlife', 'lantern-bar', 'The Lantern Bar', 'bar · silk row · 3F', 355, 330, 'img/DISTRICTS/silk-row-2.jpg', '18:00 — LATE', 'One giant red lantern, forty regulars, no last orders.', 'nightlife.html#lantern-bar'),
    P('nightlife', 'bank-shot', 'Bank Shot', 'pool hall · the fur coast · 2F', 410, 700, 'img/NIGHTLIFE/bank-shot.jpg', '22:00 — 05:00', 'Koi behind a glass-brick wall, one table that leans left.', 'nightlife.html#bank-shot'),
    P('nightlife', 'cue-club', 'The Cue Club', 'pool hall · the pool hall · 1F', 760, 835, 'img/DISTRICTS/pool-hall-1.jpg', '21:00 — TILL YOU LOSE', 'Leopard felt. Whoever loses buys the next round.', 'nightlife.html#cue-club'),
    P('nightlife', 'downstairs', 'Downstairs', 'club · the pool hall · B1', 705, 760, 'img/DISTRICTS/pool-hall-2.jpg', '23:00 — 07:00', 'A spiral staircase in leopard print. The party is at the bottom.', 'nightlife.html#downstairs'),
    P('stay', 'charmeuse', 'Hotel Charmeuse', 'boutique hotel · silk row', 415, 185, 'img/STAY/charmeuse.jpg', 'ND$ 280 / NIGHT', 'Velvet curtains, a copper bar behind the arch.', 'stay.html#charmeuse'),
    P('stay', 'the-88', 'The 88', 'tower hotel · chrome heights', 1250, 310, 'img/STAY/the-88.jpg', 'ND$ 420 / NIGHT', 'A lounge in the clouds, bathtubs facing the city.', 'stay.html#the-88'),
    P('stay', 'capsule-lace', 'Ryokan Lace', 'ryokan · lace district', 1110, 650, 'img/STAY/capsule-lace.jpg', 'ND$ 160 / NIGHT', 'Tatami floors and a round red moon window.', 'stay.html#capsule-lace'),
    P('stay', 'motel-velvet', 'Motel Velvet', 'motel · the pool hall', 885, 830, 'img/STAY/motel-velvet.jpg', 'ND$ 120 · REST 45', 'Leopard carpet and a pool table in every room.', 'stay.html#motel-velvet'),
    P('stay', 'champagne-motel-stay', 'Champagne Motel', 'motel · the fur coast', 255, 655, 'img/STAY/champagne-motel-room.jpg', 'ND$ 99 · REST 40', 'The only photographed room in the building.', 'stay.html#champagne-motel'),
    P('stay', 'hotel-polar', 'Hotel Polar', 'harbour hotel · the fur coast', 445, 610, 'img/STAY/hotel-polar.jpg', 'ND$ 350 / NIGHT', 'A martini on the pillow instead of a chocolate.', 'stay.html#hotel-polar'),
    P('events', 'rooftop-runway', 'Rooftop Runway', 'runway · observatory 88', 1185, 140, 'img/EVENTS/rooftop-runway.jpg', 'SAT 10.10 · 01:00', 'A catwalk on the edge of the 88th floor.', 'events.html#rooftop-runway'),
    P('events', 'lantern-night', 'Lantern Night', 'runway · lantern alley', 1275, 670, 'img/EVENTS/lantern-night.jpg', 'SUN 11.10 · 00:00', 'A kimono runway down the narrowest alley in town.', 'events.html#lantern-night'),
    P('events', 'downstairs-sale', 'Downstairs Sale', 'pop-up · downstairs', 670, 805, 'img/EVENTS/downstairs-sale.jpg', 'THU 15.10 · 02:00', 'Sample sale at the bottom of the leopard staircase.', 'events.html#downstairs-sale'),
    P('events', 'leopard-season', 'Leopard Season', 'pop-up · maison charmeuse', 520, 300, 'img/EVENTS/leopard-season.jpg', 'FRI 16.10 · 23:00', 'The first leopard of the season sells out by midnight.', 'events.html#leopard-season'),
    P('events', 'boat-show', 'The Boat Show', 'runway · pier 8', 215, 770, 'img/EVENTS/boat-show.jpg', 'SAT 17.10 · 00:30', 'A runway on a moving boat.', 'events.html#boat-show'),
    P('events', 'mirror-market', 'Mirror Market', 'pop-up · the lantern bar', 300, 260, 'img/EVENTS/mirror-market.jpg', 'SUN 18.10 · 22:00', 'Vintage silk in a corridor of red mirrors.', 'events.html#mirror-market'),
    P('events', 'sunrise-show', 'Koi Parade', 'runway · lantern alley', 1300, 570, 'img/EVENTS/sunrise-show.jpg', 'SAT 24.10 · 05:00', 'A parade under giant paper koi, straight into the sunrise.', 'events.html#sunrise-show'),
    P('events', 'first-snow', 'First Snow', 'pop-up · hotel polar', 480, 655, 'img/EVENTS/first-snow.jpg', 'FRI 30.10 · 23:00', 'Faux fur only, ice sculpture in the lobby.', 'events.html#first-snow'),
  ];

  /* =========================================================
     DRAWING — streets, harbour, fabric districts, loop line
     ========================================================= */
  const svg = $('#mapSvg');
  const el = (tag, attrs = {}, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    parent.append(n);
    return n;
  };
  // seeded random: the city looks the same every night
  let seed = 8;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  // closed smooth curve through points (catmull-rom → bezier)
  const smooth = (pts, closed = true) => {
    const n = pts.length; let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    }
    return d + (closed ? 'Z' : '');
  };

  // fabrics for the districts (same textures as the rest of the site)
  const lace = (getComputedStyle(document.documentElement).getPropertyValue('--tex-lace').match(/url\("?(.*?)"?\)$/) || [])[1] || '';
  const defs = el('defs');
  defs.innerHTML = `
    <pattern id="m-grid" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><path d="M46 0H0V46" fill="none" class="m-grid"/></pattern>
    <linearGradient id="f-silk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2a28"/><stop offset=".3" stop-color="#9b978f"/><stop offset=".42" stop-color="#e6e1d6"/><stop offset=".55" stop-color="#4b4a47"/><stop offset=".75" stop-color="#c9c5bc"/><stop offset="1" stop-color="#1d1d1c"/></linearGradient>
    <linearGradient id="f-chrome" x1="0" y1="0" x2="1" y2=".2"><stop offset="0" stop-color="#6f6f6f"/><stop offset=".18" stop-color="#f6f6f3"/><stop offset=".32" stop-color="#9b9b9b"/><stop offset=".46" stop-color="#2f2f2f"/><stop offset=".6" stop-color="#e9e9e6"/><stop offset=".78" stop-color="#7c7c7c"/><stop offset="1" stop-color="#fdfdfb"/></linearGradient>
    <pattern id="f-lace" width="110" height="110" patternUnits="userSpaceOnUse"><rect width="110" height="110" fill="#1a1918"/>${lace ? `<image href="${lace}" width="110" height="110" style="filter:invert(1)"/>` : ''}</pattern>
    <radialGradient id="f-velvet" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#6a6a6a"/><stop offset=".45" stop-color="#262626"/><stop offset="1" stop-color="#090909"/></radialGradient>
    <pattern id="f-leopard" width="340" height="191" patternUnits="userSpaceOnUse"><image href="img/HOME/fur-coast-bg.jpg" width="340" height="191" preserveAspectRatio="xMidYMid slice" style="filter:grayscale(1)"/></pattern>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>`;

  const world = el('g', { id: 'world' });
  el('rect', { x: -400, y: -400, width: W + 800, height: H + 800, fill: '#070707' }, world);
  el('rect', { x: -400, y: -400, width: W + 800, height: H + 800, fill: 'url(#m-grid)' }, world);

  // the harbour
  el('path', { d: 'M-400,690 C120,680 250,800 340,870 C420,930 560,950 700,1400 L-400,1400 Z', class: 'm-water' }, world);
  for (let k = 0; k < 7; k++) el('path', { d: `M${-200 + k * 40},${800 + k * 40} q30,-10 60,0 t60,0 t60,0`, class: 'm-wave' }, world);
  el('text', { x: 40, y: 930, class: 'm-water-label' }, world).textContent = 'the harbour';

  // roads: they all cross at the scramble in the middle
  const roads = ['M-400,470 C400,450 1100,490 2000,460', 'M790,-400 C770,300 810,700 780,1400', 'M-200,-100 L1800,1100', 'M1800,-80 L-100,1150', 'M-400,180 C600,150 1300,210 2000,160', 'M-400,900 C500,870 1200,960 2000,900'];
  roads.forEach((d) => { el('path', { d, class: 'm-road' }, world); el('path', { d, class: 'm-road-in' }, world); });
  // the scramble crossing: zebra stripes all around the centre
  const zebra = el('g', { transform: 'translate(785,468)' }, world);
  for (let a = 0; a < 4; a++) {
    const g = el('g', { transform: `rotate(${a * 90})` }, zebra);
    for (let k = -3; k <= 3; k++) el('rect', { x: 32, y: k * 9 - 3, width: 34, height: 5, fill: '#cfc9bb', opacity: .55 }, g);
  }

  // districts: organic blobs filled with their fabric
  const distG = el('g', {}, world);
  DIST.forEach((d) => {
    const pts = [];
    for (let k = 0; k < 13; k++) {
      const a = (k / 13) * Math.PI * 2, rr = d.r * (.78 + rnd() * .34);
      pts.push([d.x + Math.cos(a) * rr * 1.15, d.y + Math.sin(a) * rr * .85]);
    }
    const g = el('g', { class: 'm-dist-g', 'data-slug': d.slug, tabindex: '0', role: 'button', 'aria-label': `${d.name} district` }, distG);
    const path = smooth(pts);
    el('path', { d: path, fill: d.fill, class: 'm-dist' }, g);
    el('path', { d: path, class: 'm-dist-edge' }, g);
    el('text', { x: d.x, y: d.y - 40, 'text-anchor': 'middle', class: 'm-label-jp' }, g).textContent = d.jp;
    el('text', { x: d.x, y: d.y + 22, 'text-anchor': 'middle', class: 'm-label', transform: `translate(0 ${-(d.y + 22) * .3}) scale(1 1.3)` }, g).textContent = d.name;
    d.g = g;
  });

  // the loop line + its five stations + the little train
  const lineG = el('g', { class: 'm-line-g' }, world);
  const loopD = smooth(DIST.map((d) => d.stn));
  const track = el('path', { d: loopD, class: 'm-line' }, lineG);
  el('path', { d: loopD, class: 'm-line-in' }, lineG);
  DIST.forEach((d) => {
    el('circle', { cx: d.stn[0], cy: d.stn[1], r: 11, class: 'm-stn' }, lineG);
    el('text', { x: d.stn[0] + 18, y: d.stn[1] - 14, class: 'm-stn-t' }, lineG).textContent = `ND${d.num}`;
  });
  const L = track.getTotalLength();
  const train = el('g', {}, lineG);
  el('rect', { x: -22, y: -8, width: 44, height: 16, rx: 8, class: 'm-train-body' }, train);
  el('rect', { x: 10, y: -8, width: 12, height: 16, rx: 7, class: 'm-train-nose' }, train);
  let tf = 0;
  const moveTrain = () => {
    const p = track.getPointAtLength(tf * L), q = track.getPointAtLength(((tf + .002) % 1) * L);
    train.setAttribute('transform', `translate(${p.x},${p.y}) rotate(${Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI})`);
  };
  moveTrain();

  // you are here: the scramble, obviously
  const here = el('g', { class: 'pin-here', transform: 'translate(785,468)' }, world);
  const ring = el('circle', { r: 14, class: 'ring' }, here);
  el('circle', { r: 7 }, here);
  el('text', { x: 20, y: -16 }, here).textContent = 'you are here. so is everyone.';

  // pins
  const pinG = el('g', {}, world);
  PINS.forEach((p) => {
    const g = el('g', { class: `pin pin--${p.layer}`, transform: `translate(${p.x},${p.y})`, tabindex: '0', role: 'button', 'aria-label': `${p.name}, ${p.type}` }, pinG);
    if (p.layer === 'nightlife') {
      el('rect', { x: -14, y: -14, width: 28, height: 28, transform: 'rotate(45)', fill: '#d3121b', class: 'pin-glow', filter: 'url(#glow)' }, g);
      el('rect', { x: -8, y: -8, width: 16, height: 16, transform: 'rotate(45)', class: 'pin-shape' }, g);
    } else if (p.layer === 'stay') {
      el('rect', { x: -12, y: -12, width: 24, height: 24, fill: '#f6f2e8', class: 'pin-glow', filter: 'url(#glow)' }, g);
      el('rect', { x: -7, y: -7, width: 14, height: 14, class: 'pin-shape' }, g);
    } else {
      el('circle', { r: 16, fill: '#d3121b', class: 'pin-glow', filter: 'url(#glow)' }, g);
      el('circle', { r: 9, class: 'pin-shape' }, g);
      el('circle', { r: 3, class: 'pin-core' }, g);
    }
    p.g = g;
  });

  /* =========================================================
     VIEW — drag, wheel, pinch, buttons, fly-to
     ========================================================= */
  const box = $('#mapBox');
  box.setAttribute('data-lenis-prevent', '');
  const view = { x: 0, y: 0, w: W, h: H };
  const MIN_W = 320, MAX_W = W * 1.15;
  const apply = () => svg.setAttribute('viewBox', `${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}`);
  const clampView = () => {
    view.w = Math.max(MIN_W, Math.min(MAX_W, view.w)); view.h = view.w * (H / W);
    view.x = Math.max(-300, Math.min(W + 300 - view.w, view.x));
    view.y = Math.max(-250, Math.min(H + 250 - view.h, view.y));
  };
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  apply();
  const toSvg = (cx, cy) => {
    const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
  const zoomAt = (f, cx, cy, animate) => {
    const p = toSvg(cx, cy);
    const nw = Math.max(MIN_W, Math.min(MAX_W, view.w / f));
    const k = nw / view.w;
    const to = { x: p.x - (p.x - view.x) * k, y: p.y - (p.y - view.y) * k, w: nw, h: nw * (H / W) };
    if (animate && ND.hasGsap) gsap.to(view, { ...to, duration: .6, ease: 'power3.out', onUpdate: () => { clampView(); apply(); } });
    else { Object.assign(view, to); clampView(); apply(); }
  };
  const flyTo = (x, y, w = 620) => {
    const to = { x: x - w / 2, y: y - (w * H / W) / 2, w, h: w * H / W };
    if (!ND.hasGsap || ND.reduced) { Object.assign(view, to); clampView(); apply(); return; }
    gsap.to(view, { ...to, duration: 1.2, ease: 'power3.inOut', onUpdate: () => { clampView(); apply(); } });
  };
  const fit = () => flyTo(W / 2, H / 2, W);

  box.addEventListener('wheel', (e) => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY, true); }, { passive: false });
  const center = () => { const r = box.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  $('#zoomIn').addEventListener('click', () => zoomAt(1.5, ...center(), true));
  $('#zoomOut').addEventListener('click', () => zoomAt(1 / 1.5, ...center(), true));
  $('#zoomReset').addEventListener('click', () => { closeCard(); fit(); });

  // drag + pinch with pointer events
  const ptrs = new Map();
  let drag = null, pinch = null, moved = 0;
  box.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, .card')) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    try { box.setPointerCapture(e.pointerId); } catch (_) {}
    moved = 0;
    if (ptrs.size === 1) drag = { sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, k: svg.getScreenCTM().inverse().a };
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), w: view.w };
      drag = null;
    }
  });
  box.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    box.style.setProperty('--mx', `${e.clientX - r.left}px`); $('#torch').style.setProperty('--mx', `${e.clientX - r.left}px`);
    $('#torch').style.setProperty('--my', `${e.clientY - r.top}px`);
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const target = pinch.w * (pinch.d / d);
      zoomAt(view.w / target, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, false);
      moved = 99;
    } else if (drag) {
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      moved = Math.max(moved, Math.hypot(dx, dy));
      if (moved > 4) box.classList.add('is-dragging');
      view.x = drag.vx - dx * drag.k; view.y = drag.vy - dy * drag.k;
      clampView(); apply();
    }
  });
  const release = (e) => {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (!ptrs.size) { drag = null; box.classList.remove('is-dragging'); }
  };
  box.addEventListener('pointerup', release);
  box.addEventListener('pointercancel', release);

  /* =========================================================
     PINS — tooltip, card, layers
     ========================================================= */
  const tip = $('#tip'), card = $('#card');
  const showTip = (txt, g) => {
    const r = g.getBoundingClientRect(), b = box.getBoundingClientRect();
    tip.textContent = txt;
    tip.style.left = `${r.left + r.width / 2 - b.left}px`; tip.style.top = `${r.top - b.top}px`;
    tip.classList.add('is-on');
  };
  const hideTip = () => tip.classList.remove('is-on');
  let current = null;
  const openCard = (item, kind) => {
    current?.classList.remove('is-on');
    current = item.g; current.classList.add('is-on');
    const img = $('#cardImg');
    img.src = item.img; img.alt = item.name;
    $('#cardType').textContent = kind === 'district' ? `district · ND${item.num} · ${item.jp}` : item.type;
    $('#cardName').textContent = item.name;
    $('#cardMeta').textContent = kind === 'district' ? `ND${item.num} · LOOP LINE` : item.meta;
    $('#cardLine').textContent = item.line;
    const go = $('#cardGo');
    go.href = kind === 'district' ? `districts.html#${item.slug}` : item.href;
    card.hidden = false;
    if (ND.hasGsap && !ND.reduced) gsap.fromTo(card, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: 'expo.out' });
  };
  function closeCard() { card.hidden = true; current?.classList.remove('is-on'); current = null; }
  $('#cardX').addEventListener('click', closeCard);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCard(); });

  const bind = (g, item, kind, x, y, w) => {
    g.addEventListener('pointerenter', () => showTip(item.name, g));
    g.addEventListener('pointerleave', hideTip);
    const open = () => { hideTip(); openCard(item, kind); flyTo(x, y, w); };
    g.addEventListener('click', () => { if (moved < 5) open(); });
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    item.open = open;
  };
  PINS.forEach((p) => bind(p.g, p, 'pin', p.x, p.y, 520));
  DIST.forEach((d) => bind(d.g, d, 'district', d.x, d.y, 820));

  const layers = $$('.layer');
  layers.forEach((b) => b.addEventListener('click', () => {
    const on = !b.classList.contains('is-on');
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on);
    if (b.dataset.layer === 'line') lineG.style.display = on ? '' : 'none';
    else PINS.filter((p) => p.layer === b.dataset.layer).forEach((p) => p.g.classList.toggle('pin-hidden', !on));
    if (current && current.classList.contains('pin-hidden')) closeCard();
  }));

  // lights out: the map goes dark, the cursor is a torch
  const torchBtn = $('#torchBtn');
  torchBtn.addEventListener('click', () => {
    const on = !box.classList.contains('is-dark');
    box.classList.toggle('is-dark', on);
    torchBtn.setAttribute('aria-pressed', on);
    torchBtn.textContent = on ? 'lights on' : 'lights out';
    ND.toast(on ? '■ lights out. your cursor is the only lamp in town.' : '■ the neon is back.');
  });

  /* =========================================================
     LIFE — train, pulsing "here", entrance
     ========================================================= */
  if (!ND.reduced) {
    let last = performance.now(), visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);
    const tick = (now) => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (visible) {
        tf = (tf + dt * .022) % 1; moveTrain();
        const s = 1 + ((now / 900) % 1) * 1.6;
        ring.setAttribute('r', 14 * s); ring.setAttribute('opacity', 2.6 - s);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  if (ND.motion) {
    ScrollTrigger.create({
      trigger: box, start: 'top 75%', once: true,
      onEnter: () => {
        gsap.fromTo(track, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 2, ease: 'expo.inOut', onComplete: () => track.removeAttribute('style') });
        gsap.fromTo($$('.m-dist-g', svg), { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: .15 });
        gsap.fromTo(PINS.map((p) => p.g), { opacity: 0 }, { opacity: 1, duration: .4, stagger: .04, delay: .8 });
      },
    });
  }

  /* =========================================================
     SC. 03 · INDEX — every pin as a list, click to fly there
     ========================================================= */
  const cols = $('#indexCols');
  const groups = [
    ['districts', DIST.map((d) => ({ item: d, sub: `ND${d.num}` }))],
    ['nightlife', PINS.filter((p) => p.layer === 'nightlife').map((p) => ({ item: p, sub: p.meta.split(' — ')[0] }))],
    ['stay', PINS.filter((p) => p.layer === 'stay').map((p) => ({ item: p, sub: p.meta.split(' ')[1] ? `ND$ ${p.meta.split(' ')[1]}` : '' }))],
    ['events', PINS.filter((p) => p.layer === 'events').map((p) => ({ item: p, sub: p.meta.split(' · ')[0] }))],
  ];
  cols.innerHTML = groups.map(([t, list]) => `<div class="index-col"><h3>${t}</h3><ul>${list.map(({ item, sub }, i) => `<li><button type="button" data-g="${t}" data-i="${i}"><b>${item.name}</b><span>${sub}</span></button></li>`).join('')}</ul></div>`).join('');
  $$('button', cols).forEach((b) => b.addEventListener('click', () => {
    const { item } = groups.find(([t]) => t === b.dataset.g)[1][+b.dataset.i];
    ND.scrollTo('#map');
    setTimeout(() => item.open(), 700);
  }));

  if (ND.hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
