import { initSite } from "./site.js";
import { createProcessArt } from "./process.js";
import { createHeroLight } from "./hero-light.js";
import { initContactForm } from "./contact-form.js";

initContactForm(document.querySelector(".contact-form"));

const { reduced, motionPreference, gsap, ScrollTrigger, scrollToY } = initSite();

const studio = document.querySelector(".studio");
const scene = studio.querySelector(".design-object");
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
function setActiveService(next) {
  if (next === currentService) return;
  currentService = next;
  const button = serviceButtons[next];
  serviceButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  scene.dataset.scene = button.dataset.service;
  const [text, index] = scenes[button.dataset.service];
  caption.textContent = text;
  caption.classList.remove("swap");
  void caption.offsetWidth;
  caption.classList.add("swap");
  sceneIndex.textContent = index;
}
const indexAt = (progress) => (progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2);
// Where a click lands inside the list: the calm middle of each service's stretch.
const restingPoints = [0.12, 0.5, 0.88];
let servicesTrigger;

// Wide screens: the pinned visual blends from scene to scene in step with the scroll itself.
function scrubScenes() {
  const [first, second, third] = sceneViews;
  // Fresh objects each time: gsap.set writes duration 0 into the vars it receives.
  // The next card slides up from below the panel and covers the previous one, which recedes.
  const hidden = () => ({ autoAlpha: 1, yPercent: 125, scale: 1 });
  const shown = () => ({ autoAlpha: 1, yPercent: 0, scale: 1 });
  const leaving = () => ({ autoAlpha: 0, yPercent: -4, scale: 0.9 });
  gsap.set(first, shown());
  gsap.set([second, third], reduced ? { autoAlpha: 0 } : hidden());
  gsap.set(".visual-progress i", { scaleX: 0 });
  const timeline = gsap.timeline({
    defaults: { ease: "power1.inOut", duration: 0.19 },
    scrollTrigger: {
      trigger: ".services",
      start: "top 55%",
      end: "bottom 55%",
      scrub: reduced ? true : 0.7,
      onUpdate: (self) => setActiveService(indexAt(self.progress)),
    },
  });
  timeline.to(".visual-progress i", { scaleX: 1, ease: "none", duration: 1 }, 0);
  if (reduced) {
    timeline
      .set(first, { autoAlpha: 0 }, 1 / 3)
      .set(second, { autoAlpha: 1 }, 1 / 3)
      .set(second, { autoAlpha: 0 }, 2 / 3)
      .set(third, { autoAlpha: 1 }, 2 / 3);
  } else {
    timeline
      .to(second, shown(), 0.24)
      .to(first, leaving(), 0.24)
      .to(third, shown(), 0.57)
      .to(second, leaving(), 0.57);
  }
  servicesTrigger = timeline.scrollTrigger;
  return () => {
    servicesTrigger = undefined;
  };
}

// Phones: no pinning; each service gets its own copy of its scene above the text.
function inlineScenes() {
  studio.classList.add("studio--inline");
  const panels = serviceButtons.map((button, index) => {
    const panel = document.createElement("div");
    panel.className = "service-visual";
    panel.setAttribute("aria-hidden", "true");
    const holder = document.createElement("div");
    holder.className = "design-object";
    holder.append(sceneViews[index].cloneNode(true));
    panel.append(holder);
    button.before(panel);
    ScrollTrigger.create({
      trigger: panel,
      start: "top 80%",
      once: true,
      onEnter: () => (holder.dataset.scene = button.dataset.service),
    });
    if (!reduced) {
      gsap.from(panel, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: panel, start: "top 92%", once: true },
      });
    }
    return panel;
  });
  return () => {
    panels.forEach((panel) => panel.remove());
    studio.classList.remove("studio--inline");
  };
}

gsap.matchMedia().add(
  { wide: "(min-width: 641px)", narrow: "(max-width: 640px)" },
  ({ conditions }) => (conditions.wide ? scrubScenes() : inlineScenes()),
);
serviceButtons.forEach((button, index) =>
  button.addEventListener("click", () => {
    if (!servicesTrigger) return;
    const { start, end } = servicesTrigger;
    scrollToY(start + (end - start) * restingPoints[index]);
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
