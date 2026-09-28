import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { createProcessArt } from "./process.js";
import { createHeroLight } from "./hero-light.js";

gsap.registerPlugin(ScrollTrigger);
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const reduced = motionPreference.matches;
let lenis;
if (!reduced) {
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

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
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
document.querySelector(".brand").addEventListener("click", () => {
  if (menuOpen) setMenu(false);
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    if (menuOpen) setMenu(false);
    const top = hash === "#top" ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 100);
    if (lenis) {
      lenis.start();
      lenis.resize();
      lenis.scrollTo(top, { duration: 1.15, force: true });
    } else window.scrollTo({ top, behavior: "instant" });
    history.replaceState(null, "", hash);
  });
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

const scene = document.querySelector(".design-object");
const caption = document.querySelector("#visual-caption");
const sceneIndex = document.querySelector(".visual-index");
const serviceButtons = [...document.querySelectorAll(".service")];
const scenes = {
  design: ["Структура и визуальный язык", "01 — 03"],
  code: ["Адаптивная вёрстка", "02 — 03"],
  quality: ["Проверка перед запуском", "03 — 03"],
};
function selectService(button) {
  serviceButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  scene.dataset.scene = button.dataset.service;
  const [text, index] = scenes[button.dataset.service];
  caption.textContent = text;
  sceneIndex.textContent = index;
}
serviceButtons.forEach((button) =>
  button.addEventListener("click", () => selectService(button)),
);

if (!reduced) {
  const title = document.querySelector(".reveal-text");
  const content = [...title.childNodes];
  content.forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) fragment.append(document.createTextNode(part));
      else {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = part;
        fragment.append(span);
      }
    });
    node.replaceWith(fragment);
  });
  gsap.fromTo(
    title.querySelectorAll(".word"),
    { color: "#484844" },
    {
      color: "#f0eeea",
      stagger: 0.14,
      ease: "none",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        end: "bottom 43%",
        scrub: 0.6,
      },
    },
  );
  gsap.from(".hero-lead", {
    opacity: 0.82,
    duration: 1,
    ease: "power3.out",
  });
  gsap.to(".about-mark svg", {
    rotation: 130,
    ease: "none",
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

createProcessArt(document.querySelector("#process-canvas"), motionPreference);
if (!reduced) {
  gsap.fromTo(
    ".process-step",
    { "--step-progress": 0 },
    {
      "--step-progress": 1,
      stagger: 0.25,
      ease: "none",
      scrollTrigger: {
        trigger: ".process-steps",
        start: "top 88%",
        end: "bottom 55%",
        scrub: 0.6,
      },
    },
  );
}

// The hero background owns its local clock and pointer easing.
createHeroLight(document.querySelector("#hero-canvas"), motionPreference);
motionPreference.addEventListener("change", () => {
  if (motionPreference.matches) {
    lenis?.destroy();
    lenis = undefined;
  }
});
