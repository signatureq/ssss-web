import { initSite } from "./site.js";
import { createProcessArt } from "./process.js";
import { createHeroLight } from "./hero-light.js";
import { initContactForm } from "./contact-form.js";

initContactForm(document.querySelector(".contact-form"));

const { reduced, motionPreference, gsap } = initSite();

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
  // The wordmark drifts apart slightly as the hero leaves, adding depth without moving copy.
  gsap.to(".hero-wordmark", {
    yPercent: 18,
    opacity: 0.35,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-lead", {
    yPercent: -30,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.from(".footer-wordmark span", {
    yPercent: 100,
    duration: 1.3,
    ease: "power4.out",
    stagger: 0.08,
    scrollTrigger: { trigger: ".footer-wordmark", start: "top 95%", once: true },
  });
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

// The intro curtain plays once per visit; afterwards the page opens directly.
try {
  sessionStorage.setItem("ssss-intro", "1");
} catch {}
