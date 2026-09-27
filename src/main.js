import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { createProcessArt } from "./process.js";

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
window.addEventListener(
  "scroll",
  () => header.classList.toggle("scrolled", window.scrollY > 40),
  { passive: true },
);
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
  motion: ["Переходы и реакции", "03 — 03"],
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
  button.addEventListener("click", () => {
    selectService(button);
    if (!motionPreference.matches && window.innerWidth > 1000) {
      lenis?.scrollTo(button, { offset: -window.innerHeight * 0.3 });
    }
  }),
);

const serviceMedia = gsap.matchMedia();
serviceMedia.add(
  "(min-width: 1001px) and (prefers-reduced-motion: no-preference)",
  () => {
    serviceButtons.forEach((button) => {
      ScrollTrigger.create({
        trigger: button,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => selectService(button),
        onEnterBack: () => selectService(button),
      });
    });
  },
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
    y: 22,
    opacity: 0.65,
    duration: 1.4,
    ease: "power3.out",
  });
  gsap.from(".hero-wordmark", {
    yPercent: 10,
    duration: 1.7,
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

// The hero light is drawn locally. No external iframe, image or tracking dependency.
const canvas = document.querySelector("#hero-canvas");
const gl = canvas.getContext("webgl", {
  alpha: false,
  antialias: false,
  powerPreference: "low-power",
  preserveDrawingBuffer: false,
});
if (gl) {
  const vertexSource =
    "attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}";
  const fragmentSource = `
    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 pointer;
    uniform float time;
    uniform float scroll;
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
    void main(){
      vec2 uv=gl_FragCoord.xy/resolution;
      float t=time*.13;
      vec2 p=uv;
      p.x+=(pointer.x-.5)*.065;
      p.y+=(pointer.y-.5)*.045;
      p.y+=scroll*.18;
      float n=noise(vec2(p.x*2.8+t*.3,p.y*2.-t*.2));
      float wave=.14 + .15*sin(p.x*5.3+t) + .08*cos(p.x*8.-t*.7);
      float field=p.y-wave-(n-.5)*.24;
      float plume=exp(-pow(field/ .25,2.));
      float ember=exp(-pow(field/.135,2.));
      float core=exp(-pow((field+.065)/.058,2.));
      float left=exp(-length((p-vec2(-.08,.2+sin(t)*.09))*vec2(1.8,1.8))*2.6);
      float right=exp(-length((p-vec2(1.1,.17+cos(t)*.1))*vec2(1.8,2.0))*3.2);
      vec3 color=vec3(.025,.025,.024);
      color+=vec3(.39,.023,.008)*plume;
      color+=vec3(.52,.08,.025)*ember;
      color+=vec3(.12,.18,.10)*core*(.35+.65*noise(vec2(p.x*3.+t,.5)));
      color+=vec3(.42,.047,.01)*(left+right);
      float darkness=1.-smoothstep(.18,.72,p.y);
      color=mix(vec3(.027),color,darkness);
      float grain=(hash(gl_FragCoord.xy)-.5)*.032;
      gl_FragColor=vec4(color+grain,1.);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (vertex && fragment) {
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const uniforms = {
        resolution: gl.getUniformLocation(program, "resolution"),
        pointer: gl.getUniformLocation(program, "pointer"),
        time: gl.getUniformLocation(program, "time"),
        scroll: gl.getUniformLocation(program, "scroll"),
      };
      let visible = true,
        active = true,
        raf = 0,
        lastFrame = 0;
      let targetX = 0.5,
        targetY = 0.5,
        currentX = 0.5,
        currentY = 0.5;
      function resize() {
        const rect = canvas.getBoundingClientRect();
        const ratio = Math.min(
          window.devicePixelRatio || 1,
          1.5,
          1600 / Math.max(rect.width, 1),
        );
        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        if (motionPreference.matches) draw(5000);
      }
      function draw(now) {
        currentX += (targetX - currentX) * 0.045;
        currentY += (targetY - currentY) * 0.045;
        gl.uniform2f(uniforms.pointer, currentX, currentY);
        gl.uniform1f(uniforms.time, now / 1000);
        gl.uniform1f(
          uniforms.scroll,
          motionPreference.matches
            ? 0
            : Math.min(Math.max(window.scrollY / canvas.clientHeight, 0), 1),
        );
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      function tick(now) {
        if (
          !active ||
          !visible ||
          document.hidden ||
          motionPreference.matches
        ) {
          raf = 0;
          return;
        }
        if (now - lastFrame > 30) {
          draw(now);
          lastFrame = now;
        }
        raf = requestAnimationFrame(tick);
      }
      function resume() {
        if (
          !raf &&
          active &&
          visible &&
          !document.hidden &&
          !motionPreference.matches
        )
          raf = requestAnimationFrame(tick);
      }
      new ResizeObserver(resize).observe(canvas);
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        resume();
      }).observe(canvas);
      document.querySelector(".hero").addEventListener(
        "pointermove",
        (event) => {
          const rect = canvas.getBoundingClientRect();
          targetX = event.clientX / rect.width;
          targetY = 1 - (event.clientY - rect.top) / rect.height;
        },
        { passive: true },
      );
      document.addEventListener("visibilitychange", resume);
      motionPreference.addEventListener("change", () => {
        if (motionPreference.matches) {
          cancelAnimationFrame(raf);
          raf = 0;
          draw(5000);
          lenis?.destroy();
          lenis = undefined;
        } else resume();
      });
      canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        active = false;
        cancelAnimationFrame(raf);
        canvas.style.opacity = "0";
      });
      resize();
      draw(5000);
      resume();
    } else canvas.style.display = "none";
  } else canvas.style.display = "none";
}
