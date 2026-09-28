export function createHeroLight(canvas, motionPreference) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return;

  const vertexSource =
    "attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}";
  const fragmentSource = `
    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 pointer;
    uniform float time;
    uniform float scroll;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3. - 2. * f);
      return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x),
                 mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y);
    }
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      float t = time * .075 + 1.1;
      vec2 p = uv;
      p += (pointer - .5) * vec2(.12, .08);
      p.y += scroll * .08;

      // Two slow currents bend the light rather than moving a flat gradient.
      vec2 flow = vec2(
        noise(p*vec2(2.1,1.8) + vec2(t*.28,-t*.16)),
        noise(p*vec2(1.7,2.2) + vec2(-t*.19,t*.22))
      );
      p += (flow - .5) * vec2(.16,.12);
      float wave = .16 + .105*sin(p.x*4.6+t*.65)
                        + .065*cos(p.x*7.1-t*.48);
      float field = p.y - wave - (flow.x-.5)*.22;
      float plume = exp(-pow(field/.27,2.));
      float ember = exp(-pow(field/.15,2.));
      float core = exp(-pow((field+.045)/.065,2.));
      float breath = .88 + .12*sin(t*.55+p.x*2.4);
      float left = exp(-length((p-vec2(-.08,.18+.045*sin(t*.7)))
                            * vec2(1.9,2.1))*2.6);
      float right = exp(-length((p-vec2(1.08,.14+.055*cos(t*.6)))
                             * vec2(1.9,2.))*3.);

      vec3 color = vec3(.027);
      color += vec3(.42,.016,.006)*plume*breath;
      color += vec3(.46,.06,.017)*ember;
      color += vec3(.16,.10,.035)*core*(.6+.4*flow.y);
      color += vec3(.28,.028,.007)*(left+right);
      color = mix(vec3(.027),color,1.-smoothstep(.20,.74,uv.y));
      float grain = (hash(gl_FragCoord.xy)-.5)*.025;
      gl_FragColor = vec4(color+grain,1.);
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
  if (!vertex || !fragment) {
    canvas.style.display = "none";
    return;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.style.display = "none";
    return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = Object.fromEntries(
    ["resolution", "pointer", "time", "scroll"].map((key) => [
      key, gl.getUniformLocation(program, key),
    ]),
  );
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const hero = canvas.closest(".hero");
  let visible = true, active = true, raf = 0, lastFrame = 0, elapsed = 0;
  let targetX = .5, targetY = .5, currentX = .5, currentY = .5, currentScroll = 0;

  function draw(delta = 0) {
    const still = motionPreference.matches;
    const follow = 1 - Math.exp(-delta / 1.15);
    currentX += (targetX - currentX) * follow;
    currentY += (targetY - currentY) * follow;
    const targetScroll = Math.min(Math.max(window.scrollY / canvas.clientHeight, 0), 1);
    currentScroll += (targetScroll - currentScroll) * (1 - Math.exp(-delta / .8));
    if (!still) elapsed += delta;
    gl.uniform2f(uniforms.pointer, still ? .5 : currentX, still ? .5 : currentY);
    gl.uniform1f(uniforms.time, still ? 0 : elapsed);
    gl.uniform1f(uniforms.scroll, still ? 0 : currentScroll);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function pause() {
    cancelAnimationFrame(raf);
    raf = 0;
    lastFrame = 0;
  }
  function tick(now) {
    if (!active || !visible || document.hidden || motionPreference.matches) {
      pause();
      return;
    }
    const interval = 1000 / (finePointer.matches ? 60 : 30) - .5;
    if (!lastFrame || now - lastFrame >= interval) {
      // The local clock pauses with the canvas, preventing a jump on return.
      draw(lastFrame ? Math.min((now-lastFrame)/1000, .075) : 0);
      lastFrame = now;
    }
    raf = requestAnimationFrame(tick);
  }
  function resume() {
    if (!raf && active && visible && !document.hidden && !motionPreference.matches)
      raf = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(
      devicePixelRatio || 1, 1.5, 1600 / Math.max(rect.width, 1),
      Math.sqrt(1600000 / Math.max(rect.width * rect.height, 1)),
    );
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    draw();
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resume();
    else pause();
  }).observe(canvas);
  hero.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || event.pointerType !== "mouse") return;
    const rect = canvas.getBoundingClientRect();
    targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    targetY = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { targetX = .5; targetY = .5; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else resume();
  });
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) { pause(); draw(); }
    else resume();
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    active = false;
    pause();
    canvas.style.opacity = "0";
  });
  resize();
  resume();
}
