/* Living background (home page only): a particle + shard field that drifts on its own
   (slow sin/cos flow field) and reacts to scroll (camera depth, rotation, velocity boost).
   three.js is loaded lazily and only when motion, data and WebGL allow it; otherwise the
   CSS aurora behind it is the whole background. */
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
    const PARTS = mobile ? 140 : 360;
    const SHARDS = mobile ? 9 : 24;
    const O_MIN = 0.35;       // particles never fade below this, page-wide
    const IDLE_MS = 2000;     // no input for this long -> ~30 fps
    const IDLE_FRAME = 1000 / 30;

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
    scene.add(new T.AmbientLight(0xffffff, 1.1));
    const sun = new T.DirectionalLight(0xffffff, 2.2);
    sun.position.set(3, 4, 5);
    scene.add(sun);

    const NEAR = 8, FAR = -34, SPAN = NEAR - FAR; // z window, relative to the camera start
    const kinds = [new T.IcosahedronGeometry(1, 0), new T.OctahedronGeometry(1, 0), new T.TetrahedronGeometry(1, 0)];
    const mat = new T.MeshStandardMaterial({ flatShading: true, roughness: 0.45, metalness: 0.15, transparent: true, opacity: 0.5, depthWrite: false });
    const per = Math.ceil(SHARDS / 3);
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
        s: 0.1 + Math.pow(rnd(), 2) * 0.4, rx: rnd() * 6.28, ry: rnd() * 6.28, ph: rnd() * 6.28, push: 0,
      });
    }

    // Particles: base positions + a per-particle flow offset computed on the CPU (a few hundred points).
    const base = new Float32Array(PARTS * 3);
    const pos = new Float32Array(PARTS * 3);
    const ph = new Float32Array(PARTS);
    for (let i = 0; i < PARTS; i++) {
      const a = rnd() * Math.PI * 2, r = 1 + rnd() * 14;
      base[i * 3] = Math.cos(a) * r; base[i * 3 + 1] = Math.sin(a) * r * 0.7;
      base[i * 3 + 2] = FAR + rnd() * SPAN;
      ph[i] = rnd() * 6.28;
    }
    pos.set(base);
    const pg = new T.BufferGeometry();
    const posAttr = new T.Float32BufferAttribute(pos, 3);
    const colAttr = new T.Float32BufferAttribute(new Float32Array(PARTS * 3), 3);
    pg.setAttribute('position', posAttr);
    pg.setAttribute('color', colAttr);
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const cx = cv.getContext('2d');
    const gr = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.35, 'rgba(255,255,255,.45)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64);
    const tex = new T.CanvasTexture(cv);
    const pmat = new T.PointsMaterial({ size: 0.2, map: tex, transparent: true, depthWrite: false, sizeAttenuation: true, vertexColors: true, opacity: 0.9 });
    const points = new T.Points(pg, pmat);
    points.frustumCulled = false;
    scene.add(points);

    const dummy = new T.Object3D();
    const tint = new T.Color();
    const css = (n, fb) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;
    const state = (window.__scene3d = {
      frames: 0, running: false, progress: 0, opacity: 1, particles: PARTS, shards: SHARDS, idle: false, theme: 'light',
    });
    const applyTheme = () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      state.theme = dark ? 'dark' : 'light';
      const cols = [css('--tb-green', '#183024'), css('--tb-green-light', '#224a32'), css('--tb-accent', '#136a3d')];
      const fb = '#183024';
      for (const it of items) {
        try { tint.set(cols[(it.k + it.i) % 3]); } catch (e) { tint.set(fb); }
        if (dark) tint.offsetHSL(0, 0, 0.08);
        layers[it.k].setColorAt(it.i, tint);
      }
      layers.forEach((l) => { if (l.instanceColor) l.instanceColor.needsUpdate = true; });
      // Particles: brand green with a few soft-yellow sparks (#F4C95D).
      for (let i = 0; i < PARTS; i++) {
        try { tint.set(i % 6 === 0 ? '#F4C95D' : cols[i % 3]); } catch (e) { tint.set(fb); }
        colAttr.setXYZ(i, tint.r, tint.g, tint.b);
      }
      colAttr.needsUpdate = true;
      const bg = css('--tb-bg', dark ? '#0b1510' : '#f4f7f1');
      try { scene.fog = new T.Fog(bg, 10, 38); } catch (e) { scene.fog = null; }
      pmat.blending = dark ? T.AdditiveBlending : T.NormalBlending;
      pmat.needsUpdate = true;
      requestFrame();
    };

    let raf = 0, last = performance.now(), lastRender = 0, t = 0, disposed = false, visible = true;
    let lastInput = performance.now();

    // Size / scroll state (no layout reads inside the loop).
    let heroH = Math.max(innerHeight, 1), maxScroll = 1;
    const heroEl = document.querySelector('.hero') || document.body;
    const measure = () => {
      heroH = Math.max(heroEl.getBoundingClientRect().height + 80, innerHeight * 0.9);
      maxScroll = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    measure();
    const ro = new ResizeObserver(() => { measure(); touch(); });
    ro.observe(document.documentElement);

    let target = 0, p = 0, vel = 0, lastP = 0, heroO = 1;
    let px = 0, py = 0, tpx = 0, tpy = 0;
    const touch = () => { lastInput = performance.now(); requestFrame(); };
    const onScroll = () => {
      target = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      heroO = Math.max(0, 1 - scrollY / heroH);
      touch();
    };
    const onPointer = (e) => { tpx = e.clientX / innerWidth - 0.5; tpy = e.clientY / innerHeight - 0.5; touch(); };
    addEventListener('scroll', onScroll, { passive: true });
    if (finePointer) addEventListener('pointermove', onPointer, { passive: true });
    onScroll();
    p = target; lastP = p;


    function frame(now) {
      raf = 0;
      if (disposed || document.hidden || !visible) { state.running = false; return; }
      raf = requestAnimationFrame(frame);
      state.running = true;
      const idle = now - lastInput > IDLE_MS;
      state.idle = idle;
      if (idle && now - lastRender < IDLE_FRAME - 2) return; // ~30 fps at rest
      lastRender = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now; t += dt;

      p += (target - p) * Math.min(1, dt * 5);
      vel += (Math.abs(p - lastP) * maxScroll / innerHeight / Math.max(dt, 1e-3) - vel) * Math.min(1, dt * 5);
      lastP = p;
      const v = Math.min(vel, 3); // smoothed scroll speed in viewports/second

      const camZ = 6 - p * 20;
      camera.position.z = camZ;
      px += (tpx - px) * 0.04; py += (tpy - py) * 0.04;
      camera.position.x = px * 1.2 + Math.sin(t * 0.07) * 0.5;
      camera.position.y = -py * 0.8 + Math.cos(t * 0.06) * 0.3;
      camera.lookAt(px * 0.4, -py * 0.3, camZ - 10);

      for (const it of items) {
        it.push += (v * 1.6 - it.push) * Math.min(1, dt * 3);
        it.rx += dt * (0.2 + it.ph * 0.04 + v * 1.4);
        it.ry += dt * (0.16 + it.ph * 0.03 + v * 1.1);
        if (it.z > camZ - 1.5) it.z -= SPAN; else if (it.z < camZ - SPAN - 2) it.z += SPAN;
        const spread = 1 + it.push * 0.5;
        dummy.position.set(
          it.ax * spread + Math.sin(t * 0.3 + it.ph) * 0.5,
          it.ay * spread + Math.cos(t * 0.25 + it.ph) * 0.5, it.z);
        dummy.rotation.set(it.rx, it.ry, 0);
        dummy.scale.setScalar(it.s * (1 + v * 0.15));
        dummy.updateMatrix();
        layers[it.k].setMatrixAt(it.i, dummy.matrix);
      }
      layers.forEach((l) => { l.instanceMatrix.needsUpdate = true; });

      // Flow field: each particle orbits its base point; amplitude grows with scroll speed.
      const amp = 0.9 + v * 0.6;
      for (let i = 0; i < PARTS; i++) {
        const j = i * 3, f = ph[i];
        let z = pos[j + 2];
        if (z > camZ - 1.5) z -= SPAN; else if (z < camZ - SPAN - 2) z += SPAN;
        base[j + 2] += z - pos[j + 2];
        pos[j] = base[j] + Math.sin(t * 0.22 + f + base[j + 1] * 0.3) * amp;
        pos[j + 1] = base[j + 1] + Math.cos(t * 0.18 + f * 1.3 + base[j] * 0.25) * amp;
        pos[j + 2] = base[j + 2] + Math.sin(t * 0.12 + f) * 0.6;
      }
      posAttr.array.set(pos);
      posAttr.needsUpdate = true;
      points.rotation.z = t * 0.025 + p * 1.2 + v * 0.05;
      points.rotation.y = Math.sin(t * 0.1) * 0.15;

      const o = O_MIN + (1 - O_MIN) * heroO;
      host.style.setProperty('--scene3d-o', o.toFixed(3));
      host.classList.add('is-ready');
      renderer.render(scene, camera);
      state.frames++; state.progress = p; state.opacity = o;
    }
    function requestFrame() {
      if (disposed || document.hidden || !visible || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    const onVis = () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; state.running = false; } else touch();
    };
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('themechange', applyTheme);
    const io = new IntersectionObserver((es) => {
      visible = es[es.length - 1].isIntersecting;
      if (!visible) { if (raf) cancelAnimationFrame(raf); raf = 0; state.running = false; } else touch();
    });
    io.observe(host);
    reduce.addEventListener('change', () => { if (reduce.matches) dispose(); });

    function dispose() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('themechange', applyTheme);
      io.disconnect(); ro.disconnect();
      kinds.forEach((g) => g.dispose());
      layers.forEach((l) => l.dispose());
      mat.dispose(); pg.dispose(); pmat.dispose(); tex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      state.running = false;
    }
    addEventListener('pagehide', dispose);
    applyTheme();
  };

  const go = () => (window.requestIdleCallback
    ? requestIdleCallback(start, { timeout: 2000 })
    : setTimeout(start, 200));
  if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
})();
