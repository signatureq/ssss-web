import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Shared chrome for every page: smooth scroll, header, menu, cursor and reveals.
export function initSite() {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = motionPreference.matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let lenis;
  if (!reduced) {
    // Touch scrolling is eased too, a quarter slower than the native swipe.
    lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 0.75,
      anchors: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      lenis?.destroy();
      lenis = undefined;
    }
  });

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu-panel");
  const main = document.querySelector("main");
  let menuOpen = false;
  function setMenu(open, restoreFocus = false) {
    menuOpen = open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector(".menu-label").textContent = open
      ? "Закрыть"
      : "Меню";
    menu.classList.toggle("open", open);
    menu.inert = !open;
    main.inert = open;
    document.body.classList.toggle("menu-open", open);
    header.classList.remove("concealed");
    if (open) {
      lenis?.stop();
      menu.querySelector("a").focus({ preventScroll: true });
    } else {
      lenis?.start();
      if (restoreFocus) menuButton.focus({ preventScroll: true });
    }
  }
  menuButton.addEventListener("click", () => setMenu(!menuOpen));
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (!menuOpen) return;
    if (event.key === "Escape") setMenu(false, true);
    if (event.key === "Tab") {
      const focusable = [
        ...header.querySelectorAll("a,button"),
        ...menu.querySelectorAll("a"),
      ];
      const visible = focusable.filter(
        (element) => element.getClientRects().length,
      );
      const first = visible[0];
      const last = visible.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // The header steps aside while reading down and returns on any upward scroll.
  let lastY = window.scrollY;
  function updateHeader() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    if (!menuOpen && Math.abs(y - lastY) > 6) {
      header.classList.toggle("concealed", y > lastY && y > 700);
      lastY = y;
    }
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
  header.addEventListener("focusin", () => header.classList.remove("concealed"));

  document.querySelector(".brand").addEventListener("click", () => {
    if (menuOpen) setMenu(false);
  });
  function scrollToHash(hash, smooth = true) {
    const target = document.querySelector(hash);
    if (!target) return false;
    const top =
      hash === "#top"
        ? 0
        : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 100);
    if (lenis && smooth) {
      lenis.start();
      lenis.resize();
      lenis.scrollTo(top, { duration: 1.15, force: true });
    } else window.scrollTo({ top, behavior: "instant" });
    return true;
  }
  document.querySelectorAll("a[href*='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      if (!scrollToHash(url.hash)) return;
      event.preventDefault();
      if (menuOpen) setMenu(false);
      history.replaceState(null, "", url.hash);
    });
  });
  document.querySelectorAll(".js-year").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  if (finePointer.matches && !reduced) {
    initCursor();
    initMagnetic();
  }
  initMarquees(reduced, () => lenis?.velocity ?? 0);
  if (!reduced) initReveals();
  document.fonts.ready.then(() => ScrollTrigger.refresh());

  return { lenis, reduced, motionPreference, gsap, ScrollTrigger, scrollToHash };
}

function initCursor() {
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="cursor-label"></span>';
  document.body.append(cursor);
  document.documentElement.classList.add("has-cursor");
  const label = cursor.querySelector(".cursor-label");
  const moveX = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
  const moveY = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });
  let shown = false;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(cursor, { x: event.clientX, y: event.clientY });
        cursor.classList.add("visible");
        shown = true;
      }
      moveX(event.clientX);
      moveY(event.clientY);
      const target = event.target.closest?.("[data-cursor], a, button, label");
      const text = target?.dataset.cursor;
      cursor.classList.toggle("is-label", Boolean(text));
      cursor.classList.toggle("is-link", Boolean(target) && !text);
      cursor.classList.toggle("is-dark", target?.dataset.cursorTone === "dark");
      cursor.classList.toggle(
        "is-text",
        Boolean(event.target.closest?.("input, textarea")),
      );
      if (text && label.textContent !== text) label.textContent = text;
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => cursor.classList.remove("visible"));
  document.addEventListener("pointerenter", () => shown && cursor.classList.add("visible"));
  window.addEventListener("pointerdown", () => cursor.classList.add("pressed"));
  window.addEventListener("pointerup", () => cursor.classList.remove("pressed"));
}

function initMagnetic() {
  document.querySelectorAll("[data-magnetic]").forEach((element) => {
    const strength = Number(element.dataset.magnetic) || 0.35;
    const moveX = gsap.quickTo(element, "x", { duration: 0.6, ease: "power3" });
    const moveY = gsap.quickTo(element, "y", { duration: 0.6, ease: "power3" });
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      moveX((event.clientX - rect.left - rect.width / 2) * strength);
      moveY((event.clientY - rect.top - rect.height / 2) * strength);
    });
    element.addEventListener("pointerleave", () => {
      moveX(0);
      moveY(0);
    });
  });
}

// Each marquee track holds two identical halves; looping at half width is seamless.
function initMarquees(reduced, velocity) {
  document.querySelectorAll("[data-marquee]").forEach((marquee) => {
    const track = marquee.querySelector(".marquee-track");
    if (reduced || !track) return;
    const direction = marquee.dataset.marquee === "right" ? 1 : -1;
    let x = 0;
    let half = track.scrollWidth / 2;
    let visible = false;
    new ResizeObserver(() => (half = track.scrollWidth / 2)).observe(track);
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(marquee);
    gsap.ticker.add((_, delta) => {
      if (!visible || !half) return;
      const boost = Math.min(Math.abs(velocity()) * 0.1, 1.2);
      x += direction * (0.027 * delta + boost);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  });
}

// Wrap every word in a mask so headings rise line by line while staying one text node for readers.
export function splitWords(root) {
  const words = [];
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (!part.trim()) {
            fragment.append(document.createTextNode(part));
            return;
          }
          const mask = document.createElement("span");
          mask.className = "word-mask";
          const inner = document.createElement("span");
          inner.className = "word-inner";
          inner.textContent = part;
          mask.append(inner);
          fragment.append(mask);
          words.push(inner);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
        walk(child);
      }
    });
  };
  walk(root);
  return words;
}

function initReveals() {
  document.querySelectorAll("[data-reveal='words']").forEach((heading) => {
    const words = splitWords(heading);
    gsap.from(words, {
      yPercent: 110,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.06,
      scrollTrigger: { trigger: heading, start: "top 88%", once: true },
    });
  });
  gsap.utils.toArray("[data-reveal='fade']").forEach((element) => {
    gsap.from(element, {
      y: 36,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: Number(element.dataset.delay) || 0,
      scrollTrigger: { trigger: element, start: "top 92%", once: true },
    });
  });
  // Wide screens open each frame with a scrubbed wipe and parallax; phones just let it rise in.
  gsap.matchMedia().add(
    { wide: "(min-width: 641px)", narrow: "(max-width: 640px)" },
    ({ conditions }) => {
      gsap.utils.toArray("[data-reveal='image']").forEach((frame) => {
        if (conditions.narrow) {
          gsap.from(frame, {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 92%", once: true },
          });
          return;
        }
        const image = frame.querySelector("img");
        gsap.fromTo(
          frame,
          { clipPath: "inset(18% 6% 18% 6% round 14px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "power2.out",
            scrollTrigger: { trigger: frame, start: "top 95%", end: "top 45%", scrub: 0.8 },
          },
        );
        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.18, yPercent: -4 },
            {
              scale: 1.04,
              yPercent: 4,
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
    },
  );
}
