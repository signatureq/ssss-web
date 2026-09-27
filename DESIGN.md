---
name: ssss / web developer
description: A personal Russian-language site with cinematic warm light and expressive geometric typography.
colors:
  accent: "#f45135"
  ink: "#080808"
  panel: "#111110"
  text: "#f0eeea"
  muted: "#a6a39e"
  line: "#30302e"
  menu-surface: "#121211"
  menu-button: "#1a1a19"
  menu-button-hover: "#30302d"
  scene-surface: "#141413"
  wordmark: "#ecdcc1"
  contact-surface: "#e9e6dd"
  contact-ink: "#171714"
  contact-muted: "#68665f"
  contact-arrow: "#1b1b18"
  contact-hover: "#c84228"
  object-paper: "#ded9c9"
  object-ink: "#28251f"
  code-surface: "#20201e"
  reveal-dim: "#484844"
  process-surface: "#080808"
  process-accent: "#e6b795"
  process-muted: "#bfaa9a"
typography:
  wordmark:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(160px, 22vw, 440px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  wordmark-role:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(45px, 6.5vw, 130px)"
    fontWeight: 500
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(48px, 7.5vw, 112px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  hero-headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(60px, 6.35vw, 116px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(43px, 5.2vw, 80px)"
    fontWeight: 500
    lineHeight: 1.13
    letterSpacing: "-0.04em"
  contact-display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(58px, 9.4vw, 155px)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(23px, 2.5vw, 38px)"
    fontWeight: 400
    letterSpacing: "-0.03em"
  body-lead:
    fontFamily: "Manrope, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    fontWeight: 400
  link:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  code:
    fontFamily: "ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(8px, 1vw, 14px)"
    fontWeight: 400
    lineHeight: 1.9
rounded:
  object: "5px"
  code: "6px"
  menu: "9px"
  scene: "12px"
  circle: "50%"
spacing:
  gutter: "clamp(24px, 4vw, 72px)"
  gutter-mobile: "22px"
  link-gap: "14px"
  copy-gap: "22px"
  service-padding: "30px 0"
  section-heading: "65px"
  about-top: "180px"
  about-bottom: "175px"
  expertise-bottom: "160px"
  section-mobile: "95px"
components:
  menu-toggle:
    backgroundColor: "{colors.menu-button}"
    textColor: "{colors.text}"
    typography: "{typography.link}"
    rounded: "{rounded.menu}"
    padding: "15px 19px"
  menu-toggle-hover:
    backgroundColor: "{colors.menu-button-hover}"
  text-link:
    textColor: "{colors.text}"
    typography: "{typography.link}"
  arrow-circle:
    textColor: "{colors.text}"
    rounded: "{rounded.circle}"
    width: "46px"
    height: "46px"
  arrow-circle-hover:
    backgroundColor: "{colors.text}"
    textColor: "{colors.ink}"
  service:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    padding: "{spacing.service-padding}"
    width: "100%"
  service-active:
    textColor: "{colors.accent}"
  scene:
    backgroundColor: "{colors.scene-surface}"
    rounded: "{rounded.scene}"
  telegram-arrow:
    backgroundColor: "{colors.contact-arrow}"
    textColor: "{colors.text}"
    rounded: "{rounded.circle}"
    width: "62px"
    height: "62px"
  telegram-arrow-hover:
    backgroundColor: "{colors.contact-hover}"
  process:
    backgroundColor: "{colors.process-surface}"
    textColor: "{colors.text}"
    padding: "120px 0 50px"
  navigation:
    backgroundColor: "{colors.menu-surface}"
    textColor: "{colors.text}"
---

# Design System: ssss / web developer

## Overview

**Creative North Star: "Warm light through black"**

A quiet near-black canvas carries warm scarlet light, very large Manrope lettering, and generous empty space. The user pinned midu.design as the visual authority; this phrase describes that existing direction rather than introducing a new concept. Wording and procedural artwork are original to ssss / web developer.

The full nickname is the indivisible identity ssss / web developer; retain the complete phrase in the header, hero, and footer. Russian copy stays direct, and Telegram @added08 is the contact destination. Large type and the broad red hero glow are deliberate exceptions to generic advice against oversized typography or atmospheric gradients.

**Key Characteristics:**

- Near-black sections followed by a warm paper contact section.
- Self-hosted geometric type, tight display spacing, restrained labels.
- A centered large headline, complete wordmark, living light field, scroll-lit words, capability scene, and copper process interlude.
- Thin dividers, open rows, circular arrows, and minimal surface rounding.

## Colors

The functional accent is warm scarlet; neutral colors lean slightly warm rather than blue.

- **Primary — Scarlet:** `accent` marks active services, the spark, focus, and selection. The implemented token is #f45135.
- **Neutral — Ink, panel, text, muted, line:** the root CSS variables govern the dark document, readable text hierarchy, and thin separators.
- **Neutral — Warm paper and contact ink:** `contact-surface` / `contact-ink` invert the closing section. Its muted copy and arrow hover have their own extracted values.
- **Process — Copper on black:** `process-surface`, `process-accent`, and `process-muted` define the black interlude with copper accents and its three-step sequence.
- **Artwork:** the complete hero wordmark is warm cream with normal blending. The scene adds paper, charcoal code, and locally rendered ember/amber light; these illustrative hues do not define new UI status colors.

**The Reference Exception Rule.** Preserve the pinned reference's large cream wordmark and warm red light field; do not normalize them into a small logo or a generic flat hero.

## Typography

Manrope is self-hosted from `/fonts/manrope-regular.ttf`, `manrope-semibold.ttf`, and `manrope-extrabold.ttf`, with Cyrillic support and `font-display: swap`. The declared weight ranges are 400–500, 600–700, and 800 respectively. All interface and prose use `Manrope, sans-serif`; only the illustrative code window uses a system monospace stack.

The frontmatter captures actual desktop roles rather than an invented modular scale. The complete wordmark is a centered flex composition without horizontal stretching: the name uses 600 weight and 0.9 line height; the slash is 0.7em/400; the role uses 500 weight and 0.99 line height. Its name and role scale at 22vw and 6.5vw within the documented clamps. The full header nickname is 19px/600 and the footer nickname 18px/600, both with −0.025em tracking. Headings generally use 500 weight and −0.04em tracking. About copy is limited to 510px, service descriptions to 410px. Supporting about prose is 15px/1.8, distinct from the 14px service body role.

At 640px and below, the wordmark name is 21vw and role 6.3vw; header and footer nicknames are 15px and 17px. The centered hero title is `clamp(31px, 7.7vw, 49px)`/1.12; the reveal title is `clamp(34px, 8.5vw, 52px)`/1.2; service titles are 27px; contact type is `clamp(42px, 11.2vw, 69px)`/1.1. Service descriptions remain 14px. Functional scene labels and service tags remain 11px; the hero baseline uses 10px.

## Layout

Use the fluid gutter token, changing to 22px at 640px. Main dark sections have a maximum width of 1800px; the contact content and footer have 1656px. Desktop about and contact copy use two equal columns. Expertise uses a 1.08fr/1fr grid with a 7vw gap. The hero uses `max(100svh, 880px)`, bounded by 880–1400px. Its enlarged statement is centered between the gutters at `clamp(155px, 17svh, 230px)` from the top; the complete wordmark is centered 65px above the bottom.

- **At 1800px and above:** position hero metadata 460px and the wordmark 75px above the bottom; preserve the clamped name/role sizes.
- **At 1000px and below:** hide the header contact link, tighten spacing, and use equal scene/service columns with a 5vw gap. The hero has an 840px minimum; centered copy begins 170px from the top with a 6.8vw headline.
- **At 640px and below:** use single-column content, 95px about spacing, a 93px header, and a `max(94svh, 760px)` hero bounded by 760–1100px. Centered hero copy begins 155px from the top with 18px side insets; the complete wordmark sits 85px above the bottom. The scene precedes the service list; its aspect ratio is 1.05. The footer wraps.
- **Desktop service scene:** above 1000px with no reduced-motion preference, the visual stays sticky at 110px while service rows occupy `clamp(290px, 44svh, 430px)` minimum height. Scrolling never switches scenes. Selection only follows a click or keyboard activation and never scrolls the page.

The process section uses 120px/50px vertical padding and a 1656px content maximum. Its three equal step columns have a 6vw gap; at 640px they stack with a 34px gap, 70px/35px section padding, and the torus placed below the introduction.

## Elevation & Depth

The page itself is flat: separation comes from space, thin rules, and the closing palette inversion. Depth belongs to the illustrative scene, hero light, and projected copper torus. The paper mockup uses `0 24px 65px #0007`; the code window uses `0 24px 60px #0008`; the orb uses `inset -9px -12px 26px #48261577`. Perspective is 1200px. Do not spread these artwork shadows to every UI control.

## Shapes

Rows and document sections remain open and square. Small exceptions are the 9px menu button, 12px scene viewport, 5px paper window, and 6px code window. Arrow controls are circles, 46px or 62px on desktop; the Telegram arrow becomes 51px on mobile. Rules are normally 1px. The shared arrow SVG uses 1.6 stroke width with round caps and joins; the four-point spark is filled without a stroke.

## Components

- **Navigation:** a fixed 112px header shrinks to 82px over an almost opaque ink background after 40px of scroll. The four-dot menu button opens a full-viewport charcoal panel via a 0.7s inset clip. Large divider-separated links turn scarlet on hover. The menu manages focus, Escape, inert content, and scroll locking.
- **Text and round links:** compact labels accompany thin northeast arrows. Text-link arrows move 3px on hover; circular arrows invert to cream/ink and rotate 45°. Interactive elements use a 2px scarlet focus outline with 7px offset. Telegram uses a dark filled circle that becomes burnt scarlet and rotates on hover.
- **Service rows:** three buttons retain their descriptive text, with the active title and arrow turning scarlet and the arrow rotating 90°. All tags remain visible and occupy the same space regardless of selection. `aria-pressed` records the selection. Clicking changes the scene without moving the viewport or changing row heights.
- **Capability scene:** a square dark stage presents design, code, and pre-launch quality checks. The paper layout, charcoal code panel, guide marks, warm orb, and quality-check sheet are illustrative artwork, not client projects or measured test results. State changes use a 0.4s opacity crossfade between fixed poses. There is no looping movement or scroll-triggered switching.
- **Process interlude:** the shared black surface and copper accents frame a large title (`clamp(55px, 6.1vw, 98px)`/1.08) and a semantic three-step sequence with thin progress rules. `src/process.js` projects a true parametric torus into a 2D canvas; scroll rotates it on three axes. Depth changes line opacity and 0.6–0.9px strokes. Drawing is requested only on scroll, resize, visibility, or motion-preference changes, capped at 1.5 device ratio. Reduced motion uses a fixed 0.3 progress pose and complete step rules. At 640px the title becomes `clamp(37px, 10vw, 62px)`/1.1 and steps stack.
- **Hero light:** local WebGL draws grainy ember and amber plumes through black, responding softly to pointer and scroll. Rendering is capped near 33fps and 1600px width / 1.5 device ratio; it pauses offscreen and in hidden tabs. CSS radial gradients remain as the fallback.
- **Scroll reveal:** the about heading brightens word by word from `reveal-dim` to `text`, between top 85% and bottom 43%, with 0.6 scrub and 0.14 stagger. The spark rotates 130° through its section. Text exists fully readable before scripting.
- **Motion access:** Lenis uses duration 1.15 with smooth wheel and native touch (`syncTouch: false`). Reduced motion at load disables Lenis and GSAP entrance/reveal animations; CSS disables transitions and loops, forces readable reveal text, and removes sticky service behavior. WebGL draws a still frame. Service buttons and navigation remain usable.

## Do's and Don'ts

- **Do** preserve the complete indivisible nickname ssss / web developer and the direct Telegram destination @added08.
- **Do** keep oversized type, warm hero light, generous spacing, and thin separators as the pinned visual language.
- **Do** keep body copy readable and interactive states visible on small screens and with reduced motion.
- **Do** reserve dimensional shadows and perspective for the capability artwork and copper torus.
- **Don't** invent projects, clients, testimonials, prices, or commercial claims.
- **Don't** replace the reference-led hero with generic cards, stock imagery, or a small conventional logo.
- **Don't** make animation necessary to read copy or choose a service.
