<div align="center">

# NEW DETROIT

**blades don't lie. neither do heels.**

*the official visitor bureau of a city that doesn't sleep. it poses.*

`HTML` · `CSS` · `vanilla JS` · `GSAP` · `Lenis` · `SVG` · `Canvas` · `real .ics files`

</div>

---

**NEW DETROIT** is a concept website for a city that doesn't exist: a neon, Shibuya-like town where the trains run all night and every street is a runway. This is its tourism board: districts, nightlife, hotels, events, a map, and a key to the city that you forge yourself.

The whole site is built like a campaign poster: huge **red condensed type stretched over grainy black & white photos**, station signs, LED tickers, departure boards, wheatpaste walls and vertical kanji neon (眠らない街, *the city that never sleeps*). Each page opens like a film scene (`SC. 01`, `SC. 02`…) and gives you something to *do*.

> Personal portfolio project · concept, design & code by **ghostly.grl** ♥

---

## ✦ The pages

### 00 · Loader
A red **DETROIT** prints itself onto the screen like a poster going through the press, outline first and then solid, while red question words scatter around it.

### 01 · Home: *ext. scramble crossing, night*
- **The campaign**: *BLADES DON'T LIE / NEITHER DO HEELS* stretched in red over the street.
- **The big screen**: a building-sized screen with an LED ticker, and subtitles that light up word by word as you scroll.
- **Districts**: five station signs (ND01–ND05) on fabric swatches: silk, chrome, lace, velvet and snow leopard.
- **Tonight**: a station departure board for the night's venues.
- **It poses**: a viewfinder with a flash over a polaroid wall. Click a polaroid and it *develops* in a lightbox with its story and a 撮影済 stamp.
- **On the wall**: wheatpaste posters you can tear off.
- **The key**: a layered 3D chrome key you can drag to spin.

### 02 · Districts: *five stops*
An interactive **loop line map** with a train that moves along the line. Five chapters (**Silk Row, Chrome Heights, Lace District, The Pool Hall, The Fur Coast**), each with LED *next station* strips and spot photos that open with a shutter, tilt and catch the light under your cursor.

### 03 · Nightlife: *after dark*
**ND TOWER 24**, a floor directory from B1 to 8F. Filter by club, pool or bar, and the elevator follows your cursor; click a floor and it dings and takes you there. Every venue has LED opening hours that switch to **OPEN** or **LAST CALL** live (last call is 2 AM), a dress code, and a door you can **try**: *YOU'RE IN* or *NOT TONIGHT*. The places that let you in add up on **your night**, a receipt printed in crawl order.

### 04 · Stay: *do not disturb*
A hotel reception with **six acrylic key tags that swing** and a service bell. Six hotels and motels with VACANCY neon, stars, prices in ND$ (motels also have a *rest* rate), amenities, and a guestbook for each one that you can **sign**.

### 05 · Events: *tear it down*
A wall of **wheatpaste posters in four styles**. Drag across one to tear it along a jagged, fibrous seam: it peels in 3D while you drag and crumples if you fling it. The scraps stay on the wall. Empty a stack and it reads *POST NO BILLS*, then gets pasted over again. Below, the **program**: eight events for October 2026, with filters, a photo preview that follows your cursor, and a real `.ics` file to add each one to your calendar.

### 06 · Map: *you are here*
A night map of the city **drawn entirely in code**: street grid, harbour, the roads meeting at the scramble crossing, districts filled with their fabric, the loop line with its train, and 23 pins for nightlife, hotels and events. Drag, scroll or pinch to zoom, toggle the layers, and switch to **lights out** to explore it with a torch. Every pin is also in the index, and clicking one flies you there.

### 07 · Get the key: *the key*
One chain from start to finish:
1. **The night test**: a ticket machine (券売機) asks you six questions and prints a train ticket with your district and your match.
2. **The forge**: write your name and take the pledge. It's engraved live on the 3D key, with a serial number, then forged with sparks. You can save it as a PNG.
3. **The door**: drag your key into the lock. The steel doors swing open onto **your room**, with its brass room plate and a plan for your night: a bar, an event, and your hotel at 04:00.

---

## ✦ Easter eggs

*(spoilers. obviously.)*

| | how | what happens |
|---|---|---|
| ⬆⬆⬇⬇ | the **konami code** | the whole city flips to **negative**. You found the back door. |
| 📸 | type **`pose`** anywhere | flash. *click. perfect. again.* |
| ✦ | type **`stayshining`** | the city says it back to you |
| ■ | **leave the tab** | the title changes to *the city is still posing…* |
| ⌨ | open the **console** | a cat, the tagline and `ND.help()`, the visitor's handbook |

---

## ✦ How it works

- **Poster type.** The big red titles are Oswald stretched vertically with `transform: scaleY()`. The layout reserves space for the stretch so nothing overlaps.
- **Colour rule.** Photos *behind* red lettering stay black & white; every other photo stays in colour and reacts to you (develops, tilts, reveals).
- **Textures in code.** The snow leopard, lace, grain and fabric patterns are generated on `<canvas>` or in CSS. The map is a single SVG built in JavaScript.
- **Tear.** The poster tear is a generated jagged path used as a `clip-path` on two halves of the poster, with a white paper rim and a 3D peel driven by your drag speed.
- **Loader.** The fill runs on the compositor (Web Animations API, `transform` only), waits for the fonts, and loads the rest of the images only after it finishes.
- **Image slots.** Every photo is a slot with `data-img` (and an optional `data-fallback`). Drop a file with the right name in `img/<PAGE>/` and it appears; until then a labelled placeholder shows the expected file name and ratio.

## ✦ Privacy

Nothing leaves the browser. There is no server, no analytics and no tracking. **The key page saves nothing**: your name, your test and your key are forgotten as soon as you leave. Only *your night* (nightlife) and the hotel guestbooks are kept on your device in `localStorage` (keys start with `nd-`).

## ✦ Run it locally

There is no build step. Serve the folder with any static server:

```bash
python3 -m http.server 5178
```

then open <http://localhost:5178>.

## ✦ Structure

```
index.html · districts.html · nightlife.html · stay.html
events.html · map.html · key.html

css/   style.css (shared: header, menu, footer, slots, poster type, station signs, fabrics)
       + one file per page
js/    main.js   (shared: smooth scroll, slots, loader, poster helpers, tear, 3D key, easter eggs)
       + one file per page
img/   HOME · DISTRICTS · NIGHTLIFE · STAY · EVENTS · MAP · KEY
VIBES/ the moodboard
```

## ✦ Built with

- Plain **HTML, CSS and JavaScript**: no framework, no build step
- [GSAP 3](https://gsap.com/) + ScrollTrigger · [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- SVG · Canvas 2D · Web Animations API
- Google Fonts: Oswald, Inter Tight, Space Mono, DotGothic16, Noto Sans JP, Pinyon Script

Designed for desktop and mobile. Respects `prefers-reduced-motion`.

## ✦ Credits

Concept, design & code: **ghostly.grl** ♥
Photos in `img/` and `VIBES/` are moodboard references and belong to their authors; they're used here for a non-commercial portfolio project.

---

<div align="center">

■ ■ ■ 眠らない街 ■ ■ ■

**STAY SHINING**

</div>
