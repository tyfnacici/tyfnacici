/* Scroll-driven 3D drift field (home page only). three.js is loaded lazily and only
   when motion, data and WebGL allow it; otherwise the page stays exactly as-is. */
(() => {
  const host = document.getElementById('scene3d');
  if (!host) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const conn = navigator.connection;
  if (reduce.matches || (conn && conn.saveData)) return;
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return;
  } catch (e) { return; }

  const start = async () => {
    if (reduce.matches) return;
    const T = await import('./vendor/three.module.min.js');
    const mobile = matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    const finePointer = !mobile && matchMedia('(pointer: fine)').matches;
    const SHARDS = mobile ? 45 : 150, PARTS = mobile ? 500 : 1800;
    const FADE_START = 0.6, P_MAX = 1.6;

    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'low-power' });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // Seeded Park-Miller PRNG: deterministic layout.
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(60, 1, 0.1, 80);
    camera.position.z = 6;
    const amb = new T.AmbientLight(0xffffff, 1.1);
    const sun = new T.DirectionalLight(0xffffff, 2.2);
    sun.position.set(3, 4, 5);
    scene.add(amb, sun);

    const NEAR = 8, FAR = -34, SPAN = NEAR - FAR; // z range for shards
    const kinds = [new T.IcosahedronGeometry(1, 0), new T.OctahedronGeometry(1, 0), new T.TetrahedronGeometry(1, 0)];
    const mat = new T.MeshStandardMaterial({ flatShading: true, roughness: 0.45, metalness: 0.15, transparent: true, opacity: 0.5, depthWrite: false });
    const per = SHARDS / 3;
    const layers = kinds.map((g) => {
      const m = new T.InstancedMesh(g, mat, per);
      m.frustumCulled = false;
      scene.add(m);
      return m;
    });
    const items = [];
    for (let k = 0; k < 3; k++) for (let i = 0; i < per; i++) {
      const a = rnd() * Math.PI * 2, r = 2 + rnd() * 9;
      items.push({
        k, i, ax: Math.cos(a) * r, ay: Math.sin(a) * r * 0.65, z: FAR + rnd() * SPAN,
        s: 0.1 + Math.pow(rnd(), 2) * 0.4, rx: rnd() * 6.28, ry: rnd() * 6.28,
        vx: (rnd() - 0.5) * 0.6, vy: (rnd() - 0.5) * 0.6, push: 0, ph: rnd() * 6.28,
      });
    }

    const pg = new T.BufferGeometry();
    const pos = new Float32Array(PARTS * 3);
    for (let i = 0; i < PARTS; i++) {
      const a = rnd() * Math.PI * 2, r = 1 + rnd() * 14;
      pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.sin(a) * r * 0.7;
      pos[i * 3 + 2] = FAR + rnd() * SPAN;
    }
    pg.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const cx = cv.getContext('2d');
    const gr = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.35, 'rgba(255,255,255,.45)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64);
    const tex = new T.CanvasTexture(cv);
    const pmat = new T.PointsMaterial({ size: 0.16, map: tex, transparent: true, depthWrite: false, sizeAttenuation: true, opacity: 0.85 });
    const points = new T.Points(pg, pmat);
    points.frustumCulled = false;
    scene.add(points);

    const dummy = new T.Object3D();
    const tint = new T.Color();
    const css = (n, fb) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;
    const applyTheme = () => {
      const dark = matchMedia('(prefers-color-scheme: dark)').matches;
      const names = ['--tb-green', '--tb-green-light', '--tb-border-strong', '--tb-accent'];
      const fb = ['#173b2a', '#224a32', '#9fb8a6', '#4ec07e'];
      const cols = names.map((n, i) => css(n, fb[i]));
      for (const it of items) {
        try { tint.set(cols[(it.k + it.i) % 4]); } catch (e) { tint.set(fb[0]); }
        if (dark) tint.offsetHSL(0, 0, 0.12);
        layers[it.k].setColorAt(it.i, tint);
      }
      layers.forEach((l) => { if (l.instanceColor) l.instanceColor.needsUpdate = true; });
      const bg = css('--tb-bg', dark ? '#0d1511' : '#f4f7f1');
      try { scene.fog = new T.Fog(bg, 10, 38); } catch (e) { scene.fog = null; }
      try { pmat.color.set(css('--tb-accent', '#4ec07e')); } catch (e) { /* keep default */ }
      pmat.blending = dark ? T.AdditiveBlending : T.NormalBlending;
      pmat.needsUpdate = true;
    };
    applyTheme();
    const mq = matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', applyTheme);

    // Scroll / size state (no layout reads inside the loop).
    let heroH = Math.max(innerHeight, 1), W = 0, H = 0;
    const heroEl = document.querySelector('.hero') || document.body;
    const measure = () => {
      heroH = Math.max(heroEl.getBoundingClientRect().height + 80, innerHeight * 0.9);
      W = innerWidth; H = innerHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    measure();
    const ro = new ResizeObserver(() => { measure(); wake(); });
    ro.observe(document.documentElement);

    let target = 0, p = 0, vel = 0, lastP = 0, lastY = scrollY;
    let px = 0, py = 0, tpx = 0, tpy = 0;
    const onScroll = () => { target = Math.min(Math.max(scrollY / heroH, 0), P_MAX); wake(); };
    const onPointer = (e) => { tpx = e.clientX / innerWidth - 0.5; tpy = e.clientY / innerHeight - 0.5; wake(); };
    addEventListener('scroll', onScroll, { passive: true });
    if (finePointer) addEventListener('pointermove', onPointer, { passive: true });
    target = Math.min(Math.max(scrollY / heroH, 0), P_MAX);

    const state = (window.__scene3d = { frames: 0, progress: 0, running: false, opacity: 1, shards: SHARDS, particles: PARTS });
    let raf = 0, last = performance.now(), t = 0, disposed = false;

    const frame = (now) => {
      raf = 0;
      if (disposed) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now; t += dt;
      p += (target - p) * Math.min(1, dt * 6);
      vel += (Math.abs(p - lastP) / Math.max(dt, 1e-3) - vel) * Math.min(1, dt * 5);
      lastP = p;
      const v = Math.min(vel, 3); // smoothed scroll speed

      const camZ = 6 - (p / P_MAX) * 20; // 6 -> -14 across p 0..1.6
      camera.position.z = camZ;
      px += (tpx - px) * 0.04; py += (tpy - py) * 0.04;
      camera.position.x = px * 1.2; camera.position.y = -py * 0.8;
      camera.lookAt(px * 0.4, -py * 0.3, camZ - 10);

      for (const it of items) {
        it.push += (v * 1.6 - it.push) * Math.min(1, dt * 3);
        it.rx += dt * (0.25 + it.ph * 0.05 + v * 1.4);
        it.ry += dt * (0.2 + it.ph * 0.04 + v * 1.1);
        // Wrap shards that passed the camera back to the far plane.
        if (it.z > camZ - 1.5) it.z -= SPAN;
        else if (it.z < camZ - SPAN - 2) it.z += SPAN;
        const spread = 1 + it.push * 0.5;
        dummy.position.set(
          it.ax * spread + Math.sin(t * 0.3 + it.ph) * 0.4 + it.vx * t * 0.3,
          it.ay * spread + Math.cos(t * 0.25 + it.ph) * 0.4 + it.vy * t * 0.3,
          it.z);
        dummy.rotation.set(it.rx, it.ry, 0);
        dummy.scale.setScalar(it.s * (1 + v * 0.15));
        dummy.updateMatrix();
        layers[it.k].setMatrixAt(it.i, dummy.matrix);
      }
      layers.forEach((l) => { l.instanceMatrix.needsUpdate = true; });
      points.rotation.z = t * 0.03 + p * 0.6 + v * 0.1;
      points.rotation.y = Math.sin(t * 0.1) * 0.15;

      let o = p <= FADE_START ? 1 : Math.max(0, 1 - (p - FADE_START) / (P_MAX - FADE_START));
      if (o < 0.01) o = 0;
      host.style.setProperty('--scene3d-o', o.toFixed(3));
      host.classList.add('is-ready');
      renderer.render(scene, camera);

      state.frames++; state.progress = p; state.opacity = o;
      const idle = target >= P_MAX && p > P_MAX - 0.002;
      if (document.hidden || idle) { state.running = false; return; }
      state.running = true;
      raf = requestAnimationFrame(frame);
    };
    function wake() {
      if (disposed || document.hidden || raf) return;
      if (target >= P_MAX && p >= P_MAX - 0.002 && state.running === false && state.frames > 0) {
        // Already faded out; leave paused until scrolled back.
        if (Math.abs(target - p) < 0.002) return;
      }
      last = performance.now();
      state.running = true;
      raf = requestAnimationFrame(frame);
    }
    const onVis = () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; state.running = false; } else wake();
    };
    document.addEventListener('visibilitychange', onVis);
    reduce.addEventListener('change', () => { if (reduce.matches) dispose(); });

    function dispose() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVis);
      mq.removeEventListener('change', applyTheme);
      ro.disconnect();
      kinds.forEach((g) => g.dispose());
      layers.forEach((l) => l.dispose());
      mat.dispose(); pg.dispose(); pmat.dispose(); tex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      state.running = false;
    }
    addEventListener('pagehide', dispose);
    wake();
  };

  const go = () => (window.requestIdleCallback
    ? requestIdleCallback(start, { timeout: 2000 })
    : setTimeout(start, 200));
  if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
})();
