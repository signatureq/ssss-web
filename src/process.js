// A parametric torus: a thought finding its form, drawn from real geometry.
export function createProcessArt(canvas, reducedMotion) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const section = canvas.closest(".process");
  let width = 0,
    height = 0,
    visible = false,
    frame = 0;
  const TAU = Math.PI * 2;
  function draw() {
    frame = 0;
    if (!width || !height) return;
    const rect = section.getBoundingClientRect();
    const progress = reducedMotion.matches
      ? 0.3
      : Math.min(
          1,
          Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)),
        );
    const ax = 0.6 + progress * 0.8;
    const ay = -0.65 + progress * 1.65;
    const az = -0.35 + progress * 0.3;
    const scale = Math.min(width * 0.29, height * 0.34);
    ctx.clearRect(0, 0, width, height);
    function point(u, v) {
      const radius = 1.13 + 0.42 * Math.cos(v);
      let x = radius * Math.cos(u),
        y = radius * Math.sin(u),
        z = 0.42 * Math.sin(v);
      [y, z] = [
        y * Math.cos(ax) - z * Math.sin(ax),
        y * Math.sin(ax) + z * Math.cos(ax),
      ];
      [x, z] = [
        x * Math.cos(ay) + z * Math.sin(ay),
        -x * Math.sin(ay) + z * Math.cos(ay),
      ];
      [x, y] = [
        x * Math.cos(az) - y * Math.sin(az),
        x * Math.sin(az) + y * Math.cos(az),
      ];
      const perspective = 4.3 / (4.3 - z);
      return {
        x: width * 0.5 + x * scale * perspective,
        y: height * 0.51 + y * scale * perspective,
        z,
      };
    }
    const lines = [];
    for (let i = 0; i < 48; i++) {
      const points = [];
      for (let j = 0; j <= 64; j++)
        points.push(point((i / 48) * TAU, (j / 64) * TAU));
      lines.push(points);
    }
    for (let j = 0; j < 22; j++) {
      const points = [];
      for (let i = 0; i <= 112; i++)
        points.push(point((i / 112) * TAU, (j / 22) * TAU));
      lines.push(points);
    }
    lines.sort(
      (a, b) =>
        a.reduce((s, p) => s + p.z, 0) / a.length -
        b.reduce((s, p) => s + p.z, 0) / b.length,
    );
    for (const points of lines) {
      const depth = points.reduce((sum, p) => sum + p.z, 0) / points.length;
      const alpha = 0.15 + ((depth + 1.7) / 3.4) * 0.53;
      ctx.strokeStyle = `rgba(231,154,108,${alpha})`;
      ctx.lineWidth = depth > 0.2 ? 0.9 : 0.6;
      ctx.beginPath();
      points.forEach((p, i) =>
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
      );
      ctx.stroke();
    }
  }
  function requestDraw() {
    if (visible && !document.hidden && !frame)
      frame = requestAnimationFrame(draw);
  }
  new ResizeObserver(() => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    requestDraw();
  }).observe(canvas);
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      requestDraw();
    },
    { rootMargin: "150px" },
  ).observe(canvas);
  window.addEventListener("scroll", requestDraw, { passive: true });
  reducedMotion.addEventListener("change", requestDraw);
  document.addEventListener("visibilitychange", requestDraw);
}
