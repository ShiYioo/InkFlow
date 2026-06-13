# Blue Archive CN Website — Comprehensive Design Analysis

> Source: https://bluearchive-cn.com/
> Tech stack: **Vue 3** (SPA) + **Pinia** (state) + **Vue Router** + **Swiper.js** + **GSAP** + **Live2D Cubism SDK** (WebGL) + **Alova** (HTTP) + **mitt** (event bus)
> Built with **Vite**, deployed on **Aliyun OSS + CDN** (`webcnstatic.yostar.net`)

---

## 1. Architecture Overview

### SPA Structure
The site is a **single-page application** with no server-side rendering. All routes serve the same `index.html` shell with `<div id="app">`. Content is rendered client-side.

### Routing (Vue Router)
```
/                → Home (the main immersive experience)
/news/:id        → NewsContent (individual article)
/download        → Download page
/agreement       → Legal agreement
/privacy_policy  → Privacy policy
/limit           → Age/limit screen
```

**Important**: `/news`, `/character`, `/worldview`, `/about` are **NOT separate routes**. They are **slides within the Home page's full-screen Swiper**. The entire site is a single scroll-snap experience.

### Home Page Sections (Swiper Slides)
The Home page uses **Swiper.js** configured as:
- **Desktop (≥828px)**: Vertical swiper with **mousewheel** control, `"slides-per-view": "auto"`, no transition effect
- **Mobile (<828px)**: Horizontal swiper with **fade** effect, **parallax**, `simulate-touch`, 1 slide per view

Slides (in order):
1. **Index** — Hero/landing with logo, download buttons, PV, age card
2. **Worldview** — World setting introduction
3. **School** — Faction/school showcase with character group art
4. **Characters** — Individual character detail with Live2D
5. **Atlas** — Wallpaper gallery + 4-panel comic gallery
6. **News** — Latest news carousel
7. **Footer** — Copyright, legal links, company logos (desktop only)

### Modal/Overlay System (Pinia State-Driven)
Overlays appear via Vue `<Transition>` wrappers, controlled by boolean store flags:

| Component | Store Flag | Transition | Purpose |
|-----------|-----------|------------|---------|
| HeaderM | `headerMState` | `fade` | Mobile navigation menu |
| Scroll | `scroll` | `fade` | Scroll indicator |
| PvPopup | `pvPopupState` | `fade` | Promotional video popup |
| NewsList (full) | `newsListState` | `slide-in-right` | Full news listing overlay |
| WallpaperDetail | `wallpaperDetailState` | `slide-in-right` | Wallpaper detail (desktop) |
| WallpaperDetailM | `wallpaperDetailMState` | `fade` | Wallpaper detail (mobile) |
| ComicDetail | `comicDetailState` | `slide-in-right` | 4-panel comic reader |
| Footer | `footerState` | `slide-in-top` | Slide-up footer |
| WeChat QR | `wechatState` | `fade` | WeChat QR modal |
| AgeInfoModal | `infoModalState` | `fade` | Age rating info |
| MumuModal | `mumuModalVisible` | `fade` | Mumu emulator download |

---

## 2. Color Palette

### Primary Brand Colors
| Color | Hex | Usage Count | Purpose |
|-------|-----|-------------|---------|
| **Blue Archive Blue** | `#1189F9` / `#1289f9` | ~90 occurrences | Primary accent, borders, type badges, links, active states, decorative lines |
| **Bright Cyan** | `#21bbff` | Header hover/active | Navigation hover state |
| **Light Blue Glow** | `#a7d8ea` | Shadows | `box-shadow: 2px 4px 12px #a7d8ea` for glowing card effect |
| **Blue Glow** | `#128dff` | Various | Box shadow glows (`#128dff1f`, `#128dff59`, `#128dff75`) |

### Neutral Palette
| Color | Hex | Purpose |
|-------|-----|---------|
| White | `#fff` / `#ffffff` | Text on dark backgrounds, card backgrounds, type badge text |
| Near-black | `#29292c` | Character info text |
| Dark gray | `#2b2b2b` | Mobile nav text |
| Medium gray | `#6a6a6a` | News titles, menu items |
| Gray | `#696969` | News descriptions |
| Light gray | `#919191` | Secondary text |
| Silver | `#afb1b5` / `#b2b4b8` | Inactive pagination dots, outlined text |
| Pale gray | `#c4c4c4` | Divider lines |
| Off-white | `#e7e7e7` | Twig/horizontal band backgrounds (`#e7e7e7bf`, `#e7e7e799`) |
| Dark blue-gray | `#49618c` | Age info modal title |
| Steel | `#47494f` | Character full name text |
| Very dark | `#3f3f3f` | CV separator lines (mobile) |

### Semi-transparent Colors
| Color | Hex | Purpose |
|-------|-----|---------|
| Dark overlay | `#0000008a` | Modal backdrop |
| Dark overlay | `#00000080` | PV popup background |
| Dark overlay | `#000000bd` | Another modal backdrop |
| White translucent | `#ffffffbd` | Close button background |
| White translucent | `rgba(255,255,255,.9)` | Close button bg |
| White translucent | `rgba(255,255,255,.93)` | Modal elements |
| Twig band | `#e7e7e7bf` (75%) | Semi-transparent horizontal decorative bands |
| Twig band | `#e7e7e799` (60%) | Mobile twig bands |
| Twig band | `#e7e7e77f` (50%) | Students wrap background |

### Key Insight: No CSS Gradients
The site uses **zero CSS gradients** (`linear-gradient`, `radial-gradient`). All visual richness comes from:
- Solid colors with opacity
- Background images (PNG/WebP)
- `box-shadow` glows
- Pseudo-element decorative shapes
- Video backgrounds

---

## 3. Typography System

### Font Families (15 @font-face declarations)

| Font | Format | Purpose | Frequency |
|------|--------|---------|-----------|
| **TVPS-Vain-Capital-2** | `.ttf` | English display/titles, pagination numbers, loading % | 25 uses |
| **FZLanTYJW_Cu** (方正兰亭圆-粗) | `.ttf` | Chinese UI headings, news titles, menu items | 20 uses |
| **FZLanTYJW_Xi** (方正兰亭圆-细) | `.ttf` | Chinese secondary text | 8 uses |
| **FZLanTYK_Zhong** (方正兰亭黑-中) | `.otf` | Chinese body/mobile headings | 13 uses |
| **FZLanTYK_Cu** (方正兰亭黑-粗) | `.otf` | Chinese bold headings | 3 uses |
| **SourceHanSansCN-Regular** (思源黑体) | `.otf` | Chinese body text | 10 uses |
| **SourceHanSansCN-Normal** | `.otf` | Character CV info | 6 uses |
| **SourceHanSansCN-Light** | `.otf` | Light weight body | — |
| **SourceHanSansCN-Heavy** | `.otf` | Heavy display | 5 uses |
| **SourceHanSansCN-Bold** | `.otf` | Bold body | 4 uses |
| **junegull_rg** | `.ttf` | Decorative pagination numbers on desktop | 4 uses |
| **BUNGEE** | `.ttf` | Bold outlined serial numbers in mobile nav | 2 uses |
| **Gilroy-Light** | `.otf` | Character full names (uppercase) | 3 uses |
| **Gilroy-ExtraBold** | `.ttf` | Latin display | 2 uses |
| **xhy** | `.ttf` | Special decorative Chinese font | 3 uses |

### Font Size Scale (rem-based, root = 1.5625vw on desktop)
- Hero titles: `4.467rem` (~70px), `3.168rem`
- Section titles: `2.2rem`, `2.733rem`, `2.867rem`
- Subtitles: `1.856rem`, `2.033rem`, `2.112rem`
- Nav/body: `1.166rem`, `.896rem`, `.736rem`
- Small UI: `.6rem`, `.566rem`, `.533rem`, `.512rem`, `.433rem`
- Fine print: `.4rem`, `.3rem`

### Responsive Font Sizing
```css
/* Desktop */
html { font-size: 1.5625vw; }        /* ~25px at 1600px */

/* Mobile */
@media (max-width: 828px) {
  html { font-size: 4.1667vw; }      /* ~35px at 840px */
}

/* Narrow desktop */
@media (max-width: 1300px) and (min-width: 828px) {
  html { font-size: 20.3125px; }
}
```

### Typography Techniques
- **Text stroke** for outlined numbers: `-webkit-text-stroke: .032rem #AFB1B5; color: #fff0;` (transparent fill, outlined text)
- **Text transform uppercase** for character names: `text-transform: uppercase`
- **Line clamping**: `-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;`
- **Letter spacing**: `letter-spacing: .32rem` for decorative outlined text in mobile nav

---

## 4. Layout & Composition

### Full-Screen Section Pattern
Every section uses the same base structure:
```css
.section-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  /* or: display: flex; align-items: center; justify-content: center; */
}
```

### Min-Width Lock (Desktop)
```css
body { min-width: 1300px; }          /* Desktop: forces horizontal scroll below 1300px */
@media (max-width: 828px) {
  body { min-width: 100%; }          /* Mobile: no min-width */
}
```

### Absolute Positioning Heavy
The design heavily uses `position: absolute` with `transform: translate(-50%, -50%)` for centering. Almost no CSS Grid (only used in the Mumu modal icon list).

### Common Layout Patterns
- **Centered absolute**: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`
- **Flex column centered**: `display: flex; flex-direction: column; align-items: center; justify-content: center;`
- **Flex space-between**: Used in news items, menus, headers

### Twig Bands (Distinctive Design Element)
Semi-transparent horizontal bands that act as section dividers/decorative strips:
```css
.twig {
  width: 100%;
  height: 2.9rem;              /* Desktop */
  height: 2.784rem;            /* Mobile */
  background-color: #e7e7e7bf; /* Semi-transparent gray */
}
```

---

## 5. Decorative Elements & Pseudo-Elements

### Blue Underline Lines (Signature Element)
Thin blue lines used as dividers, with a small thick accent:
```css
/* Thin full-width line */
.top:before {
  content: "";
  position: absolute;
  bottom: 0;
  width: 100%;
  height: .0333333333rem;       /* ~0.5px */
  background-color: #1189f9;
}

/* Small thick accent on the left */
.top:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(40%);
  width: .9333333333rem;        /* ~15px */
  height: .1rem;                /* ~1.5px */
  background-color: #1189f9;
}
```

### Twigline (Character Section)
Similar pattern — a long thin line with a thick starting accent:
```css
.twigline {
  width: 44.667rem;
  height: .033rem;
  background-color: #1189f9;
}
.twigline:before {
  content: "";
  position: absolute;
  top: 50%; left: 0;
  transform: translateY(-50%);
  width: 1rem; height: .1rem;
  background-color: #1189f9;
}
```

### Clip-Path Arrow (Scroll Down Indicator)
```css
.scroll .text:after {
  content: "";
  position: absolute;
  bottom: -.8rem;
  left: 50%;
  transform: translate(-50%);
  width: .704rem;
  height: .512rem;
  clip-path: polygon(100% 0, 0 0, 50% 100%);  /* Downward triangle/chevron */
}
```

### Clip-Path Chevron Arrows
```css
/* Right-pointing chevron */
clip-path: polygon(100% 0, 0 50%, 100% 100%);

/* Triangle */
clip-path: polygon(100% 0, 0 0, 50% 100%);
```

### Bullet Dot Separators
Menu items separated by small dots:
```css
.menu-item:not(:last-child):before {
  content: "";
  position: absolute;
  right: -.667rem;
  top: 50%;
  transform: translateY(-50%);
  width: .133rem;
  height: .133rem;
  border-radius: 50%;
  background-color: #6a6a6a;
}
```

### Vertical Separator Lines
```css
.nav a:not(:last-child):after {
  content: "";
  position: absolute;
  top: 50%;
  right: -.733rem;
  transform: translateY(-50%);
  width: .033rem;                /* Thin vertical line */
  height: .467rem;
  background-color: #000;
}
```

### Character Info Bullet Points
Square blue dots with rounded corners before info lines:
```css
.info .content:before {
  content: "";
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: .533rem;
  height: .533rem;
  background-color: #1189f9;
  border-radius: 50%;
}
```

### Speech Bubble Tail (School Section)
```css
.lines .text:after {
  content: "";
  position: absolute;
  top: 40%;
  left: .033rem;
  transform: translate(-100%, -50%);
  width: 0; height: 0;
  border: .167rem solid transparent;
  border-right-color: #1189f9;   /* CSS triangle tail */
}
```

### News Item Underline (Hover Effect)
```css
.news-item:after {
  content: "";
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  height: .033rem;
  background-color: #c4c4c4;     /* Default gray line */
  transition: all .3s ease;
}
.news-item:before {
  content: "";
  position: absolute;
  bottom: 0; left: 0;
  width: .967rem;                /* Short blue accent */
  height: .1rem;
  background-color: #1189f9;
  opacity: 0;                    /* Hidden by default */
  transition: all .3s ease;
}
/* On hover/active: blue line appears */
```

---

## 6. Button Design System

### Primary Button Pattern (Pill/Outline Style)
The signature button is an **outlined pill** with a circular icon on the right:

```css
.button {
  width: 7.1rem;
  height: 1.633rem;
  border: .067rem solid #1189F9;       /* Thin blue outline */
  border-radius: 1.667rem;              /* Full pill shape */
  transition: all .3s ease;
  display: flex;
  align-items: center;
}

/* Circular icon container on the right */
.button .iconBox {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: .167rem;
  width: 1.333rem;
  height: 1.333rem;
  border-radius: 50%;
  overflow: hidden;
}

/* Inner dot that animates */
.button .iconBox:after {
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: .333rem;
  height: .333rem;
  border-radius: 50%;
  background-color: #1189f9;
  transition: all .3s ease;
}
```

### Button Interaction States
The `.iconBox` circle expands on hover (transition: `all .3s ease`), and the inner dot scales up — creating a **fill animation** where the circle grows to fill the button.

### "Directory" Button (Compact)
```css
.directory {
  width: 3.264rem;
  height: 1.216rem;
  border: .032rem solid #1189F9;
  border-radius: 1.6rem;
}
```

### Download/CTA Buttons (Image-Based)
The Index section uses image-based buttons (`<img>` with two states — normal and hover) rather than CSS-styled buttons:
```css
.button img {
  width: 100%;
  position: absolute;
  transition: all .3s ease;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

---

## 7. Card & Panel Designs

### News List Item Card
```css
.item {
  width: 23.9rem;
  height: 6.533rem;
  border-radius: .6rem;                    /* Rounded rectangle */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item .img {
  width: 9.233rem;
  height: 5.2rem;
  border-radius: .6rem;
  overflow: hidden;
  margin-right: .8rem;
  box-shadow: -.067rem .067rem .167rem #141c252d;  /* Subtle drop shadow */
}
```

### Comic Item Card
```css
.comic-item {
  width: 16rem;
  height: 8.133rem;
  box-shadow: -.067rem .133rem .167rem #6b6b6b33;
  border-radius: .533rem;
  border: .033rem solid #F1F1F1;
}
```

### Wallpaper Card
```css
.wallpaper-content {
  width: 28.8rem;
  margin: 1rem;
  flex-shrink: 0;
  border-radius: .333rem;
  overflow: hidden;
  box-shadow: 0 0 .333rem #4e4e4e8a;
}
```

### Wallpaper Detail (Mobile)
```css
.walls-item-content {
  width: 18.24rem;
  height: 9.92rem;
  box-shadow: 0 0 .48rem #6b6b6b54;
  border-radius: .64rem;
  background-color: #fff;
}
```

### Modal Dialog
```css
.modal_contain {
  position: absolute;
  border-radius: .6rem;
  padding: 1.267rem 1.233rem 1.4rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.modal_cover {
  width: 100%; height: 100%;
  position: absolute;
  background-color: #0000008a;    /* Dark translucent backdrop */
  backdrop-filter: blur(0);
  transition: all .3s;
}
```

### Type Badge (News Category)
```css
.typeBox {
  width: 2.333rem;
  height: .767rem;
  background: #1189F9;             /* Solid blue fill */
  border-radius: .3rem;
  position: relative;
}
.typeBox .type {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  color: #fff;
  font-size: .567rem;
  font-family: FZLanTYJW_Cu;
}
```

### Inset Shadow Effect (Swiper Inputs)
```css
box-shadow: inset 0 0 5px rgba(0,0,0,.2);
box-shadow: inset 0 0 5px #0003;
```

---

## 8. Navigation Patterns

### Desktop Header Navigation
- Fixed position at top, `z-index: 99`
- Logo on left, nav items center-right, social/menu icons far right
- Nav items: `font-family: FZLanTYJW_Cu; font-size: .6rem; color: #fff`
- Active/hover: `color: #21bbff` (bright cyan)
- On non-home pages: `color: #666` (`.another` class)
- Transition: `all .3s ease` with `backface-visibility: hidden; transform: translateZ(0)` for GPU acceleration

### Mobile Header Navigation (Full-screen overlay)
- Full-screen white background (`background-color: #fff; height: 100vh`)
- Each nav item is a large card:
  ```css
  .nav {
    width: 20.672rem;
    height: 3.328rem;
    border-radius: .416rem;
  }
  .nav.active {
    box-shadow: 0 0 .32rem #128dff59;    /* Blue glow shadow */
  }
  ```
- Nav card contains: Chinese name (top-left), English name + outlined serial number (bottom)
- Serial numbers use **BUNGEE font with text-stroke** (outlined, transparent fill):
  ```css
  .serial {
    font-family: BUNGEE;
    font-size: 1.152rem;
    color: #fff0;                         /* Transparent fill */
    -webkit-text-stroke: .032rem #AFB1B5; /* Gray outline */
    font-style: oblique;
  }
  .nav.active .serial {
    -webkit-text-stroke: .032rem #1289f9; /* Blue outline when active */
  }
  ```

### Custom Cursor System
The site replaces the default cursor entirely:
```css
html, a { cursor: none; }
```
Uses **Cursorjs** library to create a custom cursor with:
- Multiple hover states mapped to selectors
- `body.type1` and `body.type2` variants (likely for desktop/mobile or theme variations)
- Cursor has an `:after` pseudo-element with a base64 PNG image
- `.hovercursor` class toggled on hover over interactive elements

Hover target selectors:
```js
".default-cursor", ".swiper-pagination-bullet", ".wallpaper-content",
".close", ".button", ".comic-item", ".ant-pagination-prev",
".ant-pagination-next", "a", ".news-bullet", ".newsList-bullet"
```

### Swiper Pagination
- **Desktop**: Fraction format `"01 / 06"` using `junegull_rg` font, positioned bottom-left
- **Mobile**: Custom pagination with fraction numbers in `TVPS-Vain-Capital-2` font

---

## 9. Animation & Transition System

### Vue Component Transitions

| Transition Name | Enter From | Duration | Delay | Use Case |
|----------------|------------|----------|-------|----------|
| `fade` | `opacity: 0` | 0.5s ease | — | General overlay show/hide |
| `slide-in-top` | `translateY(100%)` | 1s ease | — | Footer slide up |
| `slide-in-right` | `opacity: 0; translateX(3.333rem)` | 1s ease | — | News, wallpaper, comic panels |

### Character Section Transitions (Staggered Sequence)
When switching characters, multiple elements animate in sequence:

| Element | Enter From | Duration | Delay |
|---------|-----------|----------|-------|
| `charracter-students` | `translateY(-3.333rem); opacity: 0` | 1s ease | — |
| `charracter-nameen` (English name) | `translateX(3.333rem); opacity: 0` | 0.5s ease | — |
| `charracter-namezn` (Chinese name) | `translateX(3.333rem); opacity: 0` | 0.5s ease | 0.2s |
| `charracter-info01` | `translateX(3.333rem); opacity: 0` | 0.5s ease | 0.4s |
| `charracter-info02` | `translateX(3.333rem); opacity: 0` | 1s ease | 1.5s |
| `charracter-info03` | `translateX(3.333rem); opacity: 0` | 1s ease | 2.0s |
| `char` (character image) | Enter: `translateX(-6.667rem)` / Leave: `translateX(6.667rem)` | 0.5s ease | — |

### Keyframe Animations

**Bounce (Scroll Indicator)**:
```css
@keyframes box {
  0%   { transform: translateY(-1.667rem); }
  50%  { transform: translateY(0); }
  100% { transform: translateY(-1.667rem); }
}
/* Applied as: animation: box 1s both infinite; */
```

**Float (Mobile Scroll Indicator)**:
```css
@keyframes float {
  /* 3s ease-in-out infinite - gentle floating motion */
}
```

### Transition Video (Slide Change Effect)
On desktop, when the Swiper changes slides, a **transition video** (`transfrom.webm`) plays at `z-index: 9999` with `muted`, creating a dynamic wipe/transform effect between sections.

### GPU Acceleration Pattern
Almost every animated element includes:
```css
transition: all .3s ease;
-webkit-backface-visibility: hidden;
backface-visibility: hidden;
transform: translateZ(0);
will-change: transform, opacity;
```

### GSAP Usage
GSAP is loaded (`gsap.00bd110a.js`) and used for:
- Body scroll locking: `document.body.style.overflow = "hidden"`
- Timeline animations: `AA.from(n.value, {y: -30, duration: ...})`
- ScrollTrigger-like behavior with `onEnter`/`onLeave` callbacks

### Live2D Character Animation
The **Live2D Cubism SDK** renders characters on a `<canvas class="live2d">` using WebGL:
- Only active on **mobile** (non-pcsp mode) or when not using video backgrounds
- Uses `experimental-webgl` context
- Blend mode: `SRC_ALPHA, ONE_MINUS_SRC_ALPHA`
- Depth testing enabled
- Models loaded from `.model3.json` files
- Real-time parameter animation (breathing, blinking, etc.)
- Mouse/touch interaction for character response

---

## 10. Image Asset Patterns

### Character Sprite System
Characters have multiple image states:
- **Normal**: `[Name].png` — default appearance
- **Hover/Selected**: `[Name]-yes.png` — highlighted state
- **Unselected**: `[Name]-no.png` — dimmed state
- **Portrait**: `[Name].png` (multiple hashes for different resolutions)
- **Arms/Weapon**: `arms-[name].png` — weapon/equipment image
- **Card**: Individual character cards
- **Sign**: Character signature image

### School/Faction Assets
Each school has:
- `[School]-char.png` — Character group illustration
- `[School]-p.png` — Portrait/school icon
- `[School]-p-sp.png` — Special portrait variant
- `[School].png` — School logo/emblem

Schools: Abydos, Gehenna, Hyakkiyako, Millennium, Trinity, Shanhaijing (山海经)

### Background Images
- `bg.png` / `bgM.png` — Section backgrounds (multiple variants: bgM1, bgM2, bgM3, bgM40, bgM41)
- `loading_bg_pc.png` / `loading_bg_sp.png` — Loading screen
- `kivotos.png` — City of Kivotos illustration
- `Welcome_to_Kivotos.png` — Welcome banner

### Video Assets
- `home1.mp4` — Main hero background video (desktop)
- `home2.mp4` — Secondary hero video
- `pv.mp4` — Promotional video (in popup)
- `transfrom.webm` — Transition effect video between sections

### UI Assets
- `4_panels_comic.png` — 4-panel manga preview
- `ageCard.png` — Age rating card (CADPA)
- `audio.gif` — Animated audio indicator
- `manga_title.png` — Section title image
- `wallpaper_title.png` — Wallpaper section title
- `title.png` — Main title
- `twig_news.png` — News section decorative branch/twig
- `qr.png` — QR code for WeChat
- `avatar1/2/3.png` — Loading screen avatar images

---

## 11. Anime/二次元 Design Motifs

### Distinctive Anime Web Design Elements

1. **Full-Screen Immersive Experience**: No traditional scrolling pages — the entire site is a controlled Swiper experience with video transitions, mimicking a visual novel / anime opening sequence.

2. **Live2D Interactive Characters**: Characters rendered with Live2D Cubism SDK on WebGL canvas, responding to user interaction — a staple of modern 二次元 game websites.

3. **Character Sprite Swapping**: The `-no`/`-yes` image pattern creates the classic gacha game character selection feel (dimmed → highlighted on hover).

4. **4-Panel Manga (4コマ)**: Dedicated comic gallery section with traditional 4-panel manga format — a quintessential anime marketing element.

5. **School/Faction System**: Visual showcase of in-game schools (Abydos, Gehenna, Trinity, etc.) with group character art and colored themes.

6. **Speech Bubble UI**: Character dialogue presented in blue speech bubbles with CSS triangle tails, mimicking visual novel dialogue boxes.

7. **Decorative Twigs/branches**: Organic decorative elements (`twig_news.png`, `wallpaperTwig`) overlaying the UI — softening the geometric layout with organic anime illustration touches.

8. **Kivotos City Illustration**: Stylized cityscape artwork positioned as a decorative anchor element in the news section.

9. **Serial Number Navigation**: Mobile nav uses large outlined serial numbers (01, 02, 03...) in BUNGEE font with text-stroke — a manga chapter listing aesthetic.

10. **Age Rating Card (CADPA)**: Prominent age rating display — mandatory for CN game sites, styled as a small card overlay.

11. **Custom Cursor**: Replaces system cursor with a branded cursor that changes on hover — common in premium Japanese/Korean game websites.

12. **Transition Video Wipe**: Using actual video files (`.webm`) for section transitions creates cinematic anime-style scene changes.

### Color Psychology
The near-monochromatic **blue + white + gray** palette with no gradients creates a clean, clinical aesthetic reminiscent of:
- Military/academy themes (fitting the game's school setting)
- Digital/tech UI interfaces
- Japanese minimalism with functional color accents

The single accent blue (`#1189F9`) is used surgically for:
- Interactive element borders
- Category badges
- Active/hover states
- Decorative line accents
- Small dot indicators

### Typography Hierarchy
The multi-font system creates visual variety typical of anime marketing:
- **TVPS-Vain-Capital-2**: Geometric, slightly quirky Latin display font for headings/numbers
- **方正兰亭圆/黑 (FZLanTY)**: Clean Chinese fonts with weight variety
- **思源黑体 (Source Han Sans)**: Reliable Chinese body text
- **BUNGEE**: Ultra-bold decorative for serial numbers (text-stroke outlined)
- **junegull_rg**: Handwritten-style for pagination
- **Gilroy**: Modern sans-serif for English names

---

## 12. CSS Techniques Summary

| Technique | Usage |
|-----------|-------|
| `clip-path: polygon()` | Arrow/chevron shapes for scroll indicators |
| `-webkit-text-stroke` | Outlined text for serial numbers (transparent fill + colored stroke) |
| `backdrop-filter: blur()` | Modal backdrops (though mostly set to `blur(0)`) |
| `transform: translateZ(0)` | GPU acceleration on all animated elements |
| `backface-visibility: hidden` | Prevent flickering during transforms |
| `will-change: transform, opacity` | Performance hint for animated elements |
| `user-select: none` | Prevent text selection on images and interactive elements |
| `-webkit-line-clamp` | Multi-line text truncation for news descriptions |
| `object-fit: cover` | Background video/image fitting |
| Pseudo-element `:before`/`:after` | Decorative lines, dots, arrows, speech bubble tails, divider accents |
| CSS variables (`--custom`) | NOT USED — all values are hardcoded |
| `min-width: 1300px` | Desktop layout lock preventing responsive collapse |
| `1.5625vw` root font | Responsive scaling based on viewport width |
| `data-v-[hash]` scoped CSS | Vue SFC scoped styles (15 unique scope IDs) |
| `overflow: hidden` + `border-radius` | Image clipping for rounded cards |

### Breakpoint Strategy
- **≥828px**: Desktop layout (min-width: 1300px enforced)
- **<828px**: Mobile layout
- **828px–1300px**: Desktop with fixed 20.3125px root font
- **iPad portrait (768-1200px)**: Treated as desktop
- **iPad landscape (768-1024px)**: Treated as desktop

---

## 13. Key CSS Class Naming Patterns

```
Section wrappers:   [section]-wrap, [section]-wrap .[section]
                    index-wrap, worldview-wrap, school-wrap,
                    characters-wrap, atlas-wrap, news-wrap

Overlays/modals:    [name]-wrapper, [name]-wrap
                    mumu-wrapper, info_wrapper, pv-popup,
                    wallpaperDetail-wrap, comicDetail-wrap

Lists:              [name]-container, [name]List
                    news-container, NewList, newsList

Navigation:         navBox, nav, menu, menubar, menu-item,
                    menuBox, directory

Interactive:        button, iconBox, close, typeBox,
                    pointList, point

Decorative:         twig, twigline, twig_news, twigtext,
                    parallax, mark, linesBox, lines

Character:          character-info, character-wrap, students,
                    student, nameBox, starBox, cv, infoImg,
                    card, arms, sign, fullName

Swiper:             sw-wrap, sw-slide, sw-img-wrap,
                    home-swiper, home-slide, newsList-pagination
```

---

## 14. Responsive Design Patterns

Every component has two complete CSS variants:
- `@media screen and (min-width: 828px)` — Desktop
- `@media screen and (max-width: 828px)` — Mobile

Key differences:
- Desktop: Absolute positioning, precise pixel placement, video backgrounds
- Mobile: Flex layouts, percentage widths, image backgrounds, horizontal swiper
- Mobile character section uses `background: url(bgM*.png)` instead of video
- Mobile nav is full-screen overlay vs desktop inline nav
- Mobile buttons are smaller (scaled by root font change)
- Mobile adds extra close buttons and bottom-positioned controls

---

## 15. Performance & Technical Notes

### Loading Strategy
- Initial HTML loads instantly (shell only)
- Main JS bundle (248KB) + CSS (54KB) loaded with `modulepreload`
- Home chunk (326KB) lazy-loaded — contains Live2D SDK
- CSS chunks loaded dynamically via Vite's CSS code splitting
- `live2dcubismcore.min.js` loaded as blocking script in `<head>`

### Preconnect/DNS Prefetch
```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
```

### Anti-IE Fallback
Hidden iframe with `forIE.html` shown only for IE browsers.

### Analytics
- Google Analytics (`G-EXSE9ZVYTH`)
- Baidu conversion tracking
- Tencent GDT (advertising)
- 360 Analytics

### Performance Monitoring
Custom `performance.timing` logging on load, tracking DNS, TCP, request, DOM, and load times.
