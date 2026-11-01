import { initSite } from "./site.js";
import { createHeroLight } from "./hero-light.js";

const { reduced, motionPreference, gsap } = initSite();

createHeroLight(document.querySelector("#works-canvas"), motionPreference);

// Hovering the index shows the matching homepage beside the pointer.
const preview = document.querySelector(".index-preview");
const images = [...preview.querySelectorAll("img")];
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
if (finePointer.matches && !reduced) {
  const moveX = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
  const moveY = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
  const list = document.querySelector(".index-list");
  list.addEventListener("pointermove", (event) => {
    moveX(event.clientX);
    moveY(event.clientY);
  });
  document.querySelectorAll(".index-row").forEach((row) => {
    row.addEventListener("pointerenter", (event) => {
      if (!preview.classList.contains("visible")) {
        gsap.set(preview, { x: event.clientX, y: event.clientY });
      }
      const index = Number(row.dataset.preview);
      images.forEach((image, i) => image.classList.toggle("active", i === index));
      preview.classList.add("visible");
    });
  });
  list.addEventListener("pointerleave", () => preview.classList.remove("visible"));
}

if (!reduced) {
  gsap.from(".index-row", {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.08,
    scrollTrigger: { trigger: ".index-list", start: "top 90%", once: true },
  });
  gsap.utils.toArray(".work-num").forEach((number) => {
    gsap.fromTo(
      number,
      { yPercent: 40 },
      {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: number.closest(".work"), start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
  gsap.from(".footer-wordmark span", {
    yPercent: 100,
    duration: 1.3,
    ease: "power4.out",
    stagger: 0.08,
    scrollTrigger: { trigger: ".footer-wordmark", start: "top 95%", once: true },
  });
}
