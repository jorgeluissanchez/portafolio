/**
 * Nombre de partículas (WebGL, solo escritorio con mouse).
 *
 * - El nombre se dibuja letra por letra en un canvas 2D, en la posición exacta del texto HTML, y cada
 *   píxel con tinta se convierte en una partícula (con su cobertura como transparencia: bordes suaves).
 * - Entrada: las partículas llenan todo el inicio, semitransparentes, y se comprimen todas a la vez
 *   hasta formar el nombre (se vuelven sólidas al llegar).
 * - Hover: el cursor las empuja como un fluido y vuelven a su lugar.
 * - El canvas siempre pinta el nombre (el texto HTML queda invisible) para que nunca haya un salto entre los dos;
 *   en reposo no se vuelve a dibujar (cero consumo). El canvas lleva el mismo parallax que el nombre (CSS).
 * Inspirado en «Fluid Particle Text» (Framer); implementación propia.
 */
const VERT = `#version 300 es
in vec2 pos; in vec2 home; in vec2 shade; // shade.x = altura (degradado), shade.y = cobertura del píxel
uniform vec2 res, offset; uniform float size, spread;
out vec2 vShade; out float vA;
void main(){
  vec2 p = pos + offset;
  vec2 c = p / res * 2. - 1.;
  gl_Position = vec4(c.x, -c.y, 0., 1.);
  gl_PointSize = size;
  vShade = shade;
  // Lejos de su lugar: semitransparente; al llegar: sólida
  float far = smoothstep(0., spread, distance(pos, home));
  vA = mix(1., .32, far);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec2 vShade; in float vA; out vec4 o;
void main(){
  vec3 a = vec3(.106,.102,.098), b = vec3(.29,.271,.255), c = vec3(.49,.447,.412);
  float h = vShade.x;
  vec3 col = h < .55 ? mix(a, b, h/.55) : mix(b, c, (h-.55)/.45);
  float al = vShade.y * vA;
  o = vec4(col * al, al);
}`;

export function initParticulas() {
  const el = document.querySelector<HTMLElement>('[data-nombre]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-metal]');
  const hero = document.querySelector<HTMLElement>('[data-hero-parallax]');
  const off = () => document.documentElement.classList.remove('intro-nombre');
  if (!el || !canvas || !hero) return off();
  if (!matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return off();
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return off();

  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return off();
  gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('res'), uSize = U('size'), uOffset = U('offset'), uSpread = U('spread');
  const posBuf = gl.createBuffer(), homeBuf = gl.createBuffer(), shadeBuf = gl.createBuffer();
  const attr = (name: string, buf: WebGLBuffer | null, n: number) => {
    const loc = gl.getAttribLocation(prog, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, n, gl.FLOAT, false, 0, 0);
  };

  let dpr = 1, W = 0, H = 0, step = 1, count = 0;
  let home = new Float32Array(0), pos = new Float32Array(0), vel = new Float32Array(0);
  let introF = -1; // fotogramas de la entrada (−1 = sin entrada)

  /** El canvas se mueve con el parallax por CSS, igual que el nombre: no hace falta desplazar en el shader. */
  const nameOffset = () => [0, 0];

  /** Muestrea el nombre: una partícula por píxel con tinta (máx. ~450 000). */
  const build = () => {
    const cr = canvas.getBoundingClientRect();
    if (!cr.width) return false;
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = Math.round(cr.width * dpr);
    H = canvas.height = Math.round(cr.height * dpr);

    const cs = getComputedStyle(el);
    const fontPx = parseFloat(cs.fontSize);
    const c2 = document.createElement('canvas');
    c2.width = W; c2.height = H;
    const ctx = c2.getContext('2d', { willReadFrequently: true })!;
    ctx.font = `${cs.fontWeight} ${fontPx * dpr}px ${cs.fontFamily}`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#000';
    const fm = ctx.measureText('JS');
    const asc = fm.fontBoundingBoxAscent, desc = fm.fontBoundingBoxDescent;
    // Posición de cada letra relativa al canvas (los dos llevan el mismo parallax)
    const ox = cr.left, oy = cr.top;
    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let top = Infinity, bottom = -Infinity;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const raw = node.textContent ?? '';
      const txt = cs.textTransform === 'uppercase' ? raw.toUpperCase() : raw;
      for (let i = 0; i < txt.length; i++) {
        if (!txt[i].trim()) continue;
        range.setStart(node, i); range.setEnd(node, i + 1);
        const b = range.getBoundingClientRect();
        const x = (b.left - ox) * dpr;
        const yTop = (b.top - oy) * dpr;
        const y = yTop + (b.height * dpr - (asc + desc)) / 2 + asc;
        top = Math.min(top, yTop); bottom = Math.max(bottom, yTop + b.height * dpr);
        ctx.fillText(txt[i], x, y);
      }
    }
    const data = ctx.getImageData(0, 0, W, H).data;
    let ink = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 8) ink++;
    step = Math.max(1, Math.ceil(Math.sqrt(ink / 450000)));
    const pts: number[] = [], shades: number[] = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        let a = 0;
        for (let yy = y; yy < Math.min(y + step, H); yy++) for (let xx = x; xx < Math.min(x + step, W); xx++) a += data[(yy * W + xx) * 4 + 3];
        a /= step * step;
        if (a > 8) {
          pts.push(x + step / 2, y + step / 2);
          shades.push(Math.min(1, Math.max(0, (y - top) / (bottom - top))), a / 255);
        }
      }
    }
    count = pts.length / 2;
    home = new Float32Array(pts);
    pos = new Float32Array(pts);
    vel = new Float32Array(pts.length);
    gl.viewport(0, 0, W, H);
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uSize, step);
    gl.uniform1f(uSpread, 60 * dpr);
    gl.bindBuffer(gl.ARRAY_BUFFER, shadeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shades), gl.STATIC_DRAW);
    attr('shade', shadeBuf, 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, homeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, home, gl.STATIC_DRAW);
    attr('home', homeBuf, 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    attr('pos', posBuf, 2);
    return true;
  };

  // Cursor (px del canvas, sin el parallax) y su velocidad: el empuje sigue el movimiento, como un fluido
  let mx = -1e5, my = -1e5, pmx = mx, pmy = my, active = false, raf = 0;
  const physics = () => {
    const R = 110 * dpr, R2 = R * R;
    const vx = (mx - pmx) * 0.35, vy = (my - pmy) * 0.35;
    pmx = mx; pmy = my;
    // Entrada: la atracción crece poco a poco → todas se comprimen a la vez hacia las letras
    let spring = 0.045, damp = 0.86;
    if (introF >= 0) {
      const p = Math.min(1, introF / 70);
      spring = 0.004 + p * p * 0.05;
      damp = 0.9 - p * 0.04;
      introF = p >= 1 ? -1 : introF + 1;
    }
    let moving = 0;
    for (let i = 0; i < count * 2; i += 2) {
      let x = pos[i], y = pos[i + 1];
      const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
      if (d2 >= R2 && vel[i] === 0 && vel[i + 1] === 0 && x === home[i] && y === home[i + 1]) continue;
      if (active && d2 < R2) {
        const d = Math.sqrt(d2) || 1, f = 1 - d / R, k = f * f * 9;
        vel[i] += (dx / d) * k + vx * f * 0.9;
        vel[i + 1] += (dy / d) * k + vy * f * 0.9;
      }
      vel[i] += (home[i] - x) * spring; vel[i + 1] += (home[i + 1] - y) * spring;
      vel[i] *= damp; vel[i + 1] *= damp;
      x += vel[i]; y += vel[i + 1];
      pos[i] = x; pos[i + 1] = y;
      if (introF >= 0 || Math.abs(vel[i]) + Math.abs(vel[i + 1]) > 0.02 || Math.abs(home[i] - x) + Math.abs(home[i + 1] - y) > 0.3) moving++;
      else { pos[i] = home[i]; pos[i + 1] = home[i + 1]; vel[i] = 0; vel[i + 1] = 0; }
    }
    return moving;
  };
  const draw = () => {
    const [ox, oy] = nameOffset();
    gl.uniform2f(uOffset, ox, oy);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);
    gl.drawArrays(gl.POINTS, 0, count);
  };
  let ready = false;
  const show = (on: boolean) => {
    if (!ready) return;
    el.classList.toggle('metal-on', on);
    canvas.style.visibility = on ? 'visible' : 'hidden';
  };
  const loop = () => {
    const moving = physics();
    draw();
    raf = active || moving ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  hero.addEventListener('pointermove', (e) => {
    const b = canvas.getBoundingClientRect();
    const nx = (e.clientX - b.left) * dpr, ny = (e.clientY - b.top) * dpr;
    if (!active) { pmx = nx; pmy = ny; }
    mx = nx; my = ny;
    const nr = el.getBoundingClientRect();
    active = e.clientX > nr.left - 60 && e.clientX < nr.right + 60 && e.clientY > nr.top - 60 && e.clientY < nr.bottom + 60;
    if (active || raf) kick();
  });
  hero.addEventListener('pointerleave', () => { active = false; kick(); });

  /** Entrada: partículas por todo el inicio, semitransparentes, que se comprimen hasta formar el nombre. */
  const intro = () => {
    for (let i = 0; i < count * 2; i += 2) {
      pos[i] = Math.random() * W;
      pos[i + 1] = Math.random() * H;
      vel[i] = (Math.random() - 0.5) * 2; vel[i + 1] = (Math.random() - 0.5) * 2;
    }
    introF = 0;
    show(true);
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    off();
    if (!build()) return;
    ready = true;
    show(true);
    if (scrollY < innerHeight * 0.5) intro(); else draw();
  };
  // Espera a que la fuente real (Anton) esté cargada; si el canvas usara la de respaldo, las letras cambiarían de tamaño
  const cs0 = getComputedStyle(el);
  document.fonts.ready
    .then(() => document.fonts.load(`${cs0.fontWeight} 100px ${cs0.fontFamily}`, 'JORGESANCHEZ'))
    .catch(() => undefined)
    // Si está la firma de entrada, el nombre se arma cuando ella termina
    .then(() => (document.documentElement.classList.contains('splash') ? new Promise((r) => addEventListener('splash:done', r, { once: true })) : undefined))
    .then(start);
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { if (build()) draw(); }, 150); });
}
