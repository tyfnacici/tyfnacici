/* Hero 3D layer: editorial wireframe form. Progressive enhancement only. */
const hero = document.querySelector('.hero');
const host = hero && hero.querySelector('.hero-3d');

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

if (host &&
    !(matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (navigator.connection && navigator.connection.saveData) ||
      !webglOK())) {
  const start = () => init().catch(() => {});
  const idle = () => ('requestIdleCallback' in window
    ? requestIdleCallback(start, { timeout: 2000 })
    : setTimeout(start, 200));
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}

async function init() {
  const T = await import('./vendor/three.module.min.js');
  const root = document.documentElement;
  const small = matchMedia('(max-width: 900px)');
  const finePointer = matchMedia('(pointer: fine)').matches;

  const renderer = new T.WebGLRenderer({
    alpha: true,
    antialias: devicePixelRatio < 2,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const canvas = renderer.domElement;
  canvas.className = 'hero-3d__canvas';
  host.appendChild(canvas);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 0, 5);
  const group = new T.Group();
  scene.add(group);

  const edges = new T.LineSegments(
    new T.EdgesGeometry(new T.IcosahedronGeometry(1.25, 1)),
    new T.LineBasicMaterial({ transparent: true, opacity: 0.9 })
  );
  const inner = new T.LineSegments(
    new T.EdgesGeometry(new T.IcosahedronGeometry(0.7, 0)),
    new T.LineBasicMaterial({ transparent: true, opacity: 0.6 })
  );
  group.add(edges, inner);

  // Deterministic sparse point field on a shell around the form.
  const count = small.matches ? 90 : 220;
  const pos = new Float32Array(count * 3);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2;
    const r = 2 + rnd() * 1.4, s = Math.sqrt(1 - u * u);
    pos.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th)], i * 3);
  }
  const pg = new T.BufferGeometry();
  pg.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  const points = new T.Points(pg, new T.PointsMaterial({ size: 0.03, transparent: true, opacity: 0.8, sizeAttenuation: true }));
  group.add(points);

  function colors() {
    const cs = getComputedStyle(root);
    const get = (n) => cs.getPropertyValue(n).trim();
    const c = new T.Color();
    const set = (m, n) => { try { c.set(get(n)); m.color.copy(c); } catch (e) { /* keep */ } };
    set(edges.material, '--tb-green');
    set(inner.material, '--tb-green-light');
    set(points.material, '--tb-border-strong');
  }
  colors();
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const onScheme = () => requestAnimationFrame(colors);
  mq.addEventListener('change', onScheme);

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Desktop: form sits right of centre; mobile: centred behind the photo.
    const off = small.matches ? 0 : 0.28;
    camera.setViewOffset(w, h, -w * off, 0, w, h);
    camera.updateProjectionMatrix();
    group.scale.setScalar(small.matches ? 0.8 : 1);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  const onMove = (e) => {
    target.x = (e.clientX / innerWidth - 0.5) * 0.3;
    target.y = (e.clientY / innerHeight - 0.5) * 0.3;
  };
  if (finePointer) addEventListener('pointermove', onMove, { passive: true });

  window.__hero3dFrames = 0;
  let visible = true, raf = 0, last = 0;
  const frame = (t) => {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((t - last) / 1000 || 0, 0.05);
    last = t;
    const h = hero.offsetHeight || 1;
    const p = Math.min(Math.max(scrollY / h, 0), 1.5);
    cur.x += (target.x - cur.x) * 0.06;
    cur.y += (target.y - cur.y) * 0.06;
    group.rotation.y += dt * 0.12;
    group.rotation.x = 0.35 + p * 0.5 + cur.y * 0.5;
    group.rotation.z = cur.x * 0.5;
    camera.position.y = -p * 0.8;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    window.__hero3dFrames++;
    raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); });
  io.observe(hero);
  document.addEventListener('visibilitychange', kick);
  kick();
  host.classList.add('is-ready');

  addEventListener('pagehide', () => {
    cancelAnimationFrame(raf);
    io.disconnect(); ro.disconnect();
    mq.removeEventListener('change', onScheme);
    removeEventListener('pointermove', onMove);
    [edges, inner, points].forEach((o) => { o.geometry.dispose(); o.material.dispose(); });
    renderer.dispose();
  }, { once: true });
}
