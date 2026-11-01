import { initSite } from "./site.js";
import { createProcessArt } from "./process.js";
import { createHeroLight } from "./hero-light.js";
import { initContactForm } from "./contact-form.js";

initContactForm(document.querySelector(".contact-form"));

const { reduced, motionPreference, gsap, ScrollTrigger, scrollToY } = initSite();

const scene = document.querySelector(".design-object");
const sceneViews = [...scene.querySelectorAll(".scene")];
const caption = document.querySelector("#visual-caption");
const sceneIndex = document.querySelector(".visual-index");
const serviceButtons = [...document.querySelectorAll(".service")];
const scenes = {
  design: ["Структура и визуальный язык", "01 — 03"],
  code: ["Адаптивная вёрстка", "02 — 03"],
  quality: ["Проверка перед запуском", "03 — 03"],
};
let currentService = 0;
function selectService(button) {
  const next = serviceButtons.indexOf(button);
  if (next === currentService) return;
  currentService = next;
  serviceButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  sceneViews.forEach((view, index) => {
    view.classList.toggle("is-active", index === next);
    view.classList.toggle("is-before", index < next);
  });
  scene.dataset.scene = button.dataset.service;
  const [text, index] = scenes[button.dataset.service];
  caption.textContent = text;
  caption.classList.remove("swap");
  void caption.offsetWidth;
  caption.classList.add("swap");
  sceneIndex.textContent = index;
}

// Scrolling through the list turns the pages; a click scrolls to its row so both stay in step.
let serviceTriggers = [];
gsap.matchMedia().add(
  { wide: "(min-width: 641px)", narrow: "(max-width: 640px)" },
  ({ conditions }) => {
    const line = conditions.wide ? "55%" : "78%";
    serviceTriggers = serviceButtons.map((button) =>
      ScrollTrigger.create({
        trigger: button,
        start: `top ${line}`,
        end: `bottom ${line}`,
        onToggle: (self) => self.isActive && selectService(button),
      }),
    );
    if (conditions.narrow) {
      ScrollTrigger.create({
        trigger: serviceButtons[0],
        start: "top 96px",
        endTrigger: ".studio",
        end: "bottom top",
        toggleClass: { targets: ".studio-visual", className: "masking" },
      });
    }
    gsap.fromTo(
      ".visual-progress i",
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".services",
          start: `top ${line}`,
          end: `bottom ${line}`,
          scrub: true,
        },
      },
    );
  },
);
serviceButtons.forEach((button, index) =>
  button.addEventListener("click", () => {
    selectService(button);
    const trigger = serviceTriggers[index];
    if (trigger) scrollToY(trigger.start + (trigger.end - trigger.start) * 0.3);
  }),
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
  // On larger screens the wordmark drifts as the hero leaves; phones keep the hero still.
  gsap.matchMedia().add("(min-width: 641px)", () => {
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
