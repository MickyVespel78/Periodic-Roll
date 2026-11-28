/* Atomix 3D: builds a unique monster for every element, its mutation forms and Ultimate mode, and plays its moves.
   Everything is made from code (no model files), seeded by the atomic number so each element always looks the same. */
import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rng = s => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
const col = h => new THREE.Color(h);

/* ---------- textures ---------- */
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
let DOT = null;
const dotTex = () => DOT || (DOT = canvasTex(64, 64, g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.35, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }));
let STARP = null;
const starTex = () => STARP || (STARP = canvasTex(64, 64, g => { g.fillStyle = '#fff'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 12 : 30; g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } g.fill(); }));
let SPACE = null;
const spaceTex = () => SPACE || (SPACE = canvasTex(512, 256, (g, w, h) => {
  g.fillStyle = '#05061a'; g.fillRect(0, 0, w, h); const R = rng(77);
  for (let i = 0; i < 6; i++) { const x = R() * w, y = R() * h, r = 40 + R() * 90, gr = g.createRadialGradient(x, y, 0, x, y, r); const c = ['rgba(143,80,255,.5)', 'rgba(60,160,255,.45)', 'rgba(255,80,190,.4)'][i % 3]; gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  for (let i = 0; i < 700; i++) { g.fillStyle = 'rgba(255,255,255,' + (0.3 + R() * 0.7) + ')'; const s = R() < 0.06 ? 2 : 1; g.fillRect(R() * w, R() * h, s, s); }
}));
function skinTex(seed, base, accent, kind) {
  return canvasTex(256, 256, (g, w, h) => {
    const R = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
    const sh = (a) => { const c = col(base); c.offsetHSL(0, 0, a); return '#' + c.getHexString(); };
    if (kind === 'scales') { for (let y = 0; y < h + 16; y += 14) for (let x = (y / 14 % 2) * 9; x < w + 18; x += 18) { g.strokeStyle = sh(-0.12); g.lineWidth = 2; g.beginPath(); g.arc(x, y, 9, 0, Math.PI); g.stroke(); } }
    else if (kind === 'spots') { for (let i = 0; i < 40; i++) { g.fillStyle = R() < .5 ? accent : sh(-0.1); g.globalAlpha = .55; g.beginPath(); g.ellipse(R() * w, R() * h, 4 + R() * 12, 3 + R() * 9, R() * 3, 0, 7); g.fill(); } }
    else if (kind === 'stripes') { g.globalAlpha = .5; g.fillStyle = sh(-0.16); for (let x = -40; x < w + 40; x += 30 + R() * 10) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 14, 0); g.lineTo(x + 30, h); g.lineTo(x + 16, h); g.fill(); } }
    else if (kind === 'plates') { g.strokeStyle = sh(-0.18); g.lineWidth = 3; for (let y = 0; y < h; y += 42) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let x = (y / 42 % 2) * 32; x < w; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 42); g.stroke(); g.fillStyle = sh(0.1); g.beginPath(); g.arc(x + 8, y + 8, 3, 0, 7); g.fill(); } } }
    else if (kind === 'cracks') { g.strokeStyle = accent; g.lineWidth = 2.5; g.globalAlpha = .9; for (let i = 0; i < 14; i++) { let x = R() * w, y = R() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (R() - .5) * 50; y += (R() - .5) * 50; g.lineTo(x, y); } g.stroke(); } }
    else if (kind === 'facets') { for (let i = 0; i < 60; i++) { g.fillStyle = sh((R() - .5) * 0.25); g.globalAlpha = .6; g.beginPath(); const x = R() * w, y = R() * h; g.moveTo(x, y); g.lineTo(x + 20 + R() * 30, y + (R() - .5) * 40); g.lineTo(x + (R() - .5) * 40, y + 20 + R() * 30); g.fill(); } }
    else if (kind === 'fur') { g.strokeStyle = sh(-0.08); g.globalAlpha = .45; for (let i = 0; i < 900; i++) { const x = R() * w, y = R() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - .5) * 4, y + 6 + R() * 6); g.stroke(); } }
    g.globalAlpha = 1;
  });
}
function emblemTex(sym, ink, ring) {
  return canvasTex(128, 128, g => {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill();
    g.lineWidth = 9; g.strokeStyle = ring; g.beginPath(); g.arc(64, 64, 55, 0, 7); g.stroke();
    g.fillStyle = ink; g.font = '800 ' + (sym.length > 1 ? 54 : 66) + 'px "Bricolage Grotesque",Arial,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sym, 64, 68);
  });
}

/* ---------- geometry helpers ---------- */
function taper(pts, rf, segs = 28, rad = 14) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => p.isVector3 ? p : V(p[0], p[1], p[2])));
  const g = new THREE.TubeGeometry(curve, segs, 1, rad, false);
  const pos = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, P = curve.getPointAt(t), r = Math.max(0.004, typeof rf === 'function' ? rf(t) : rf);
    for (let j = 0; j <= rad; j++) { const k = i * (rad + 1) + j; v.fromBufferAttribute(pos, k).sub(P).multiplyScalar(r).add(P); pos.setXYZ(k, v.x, v.y, v.z); }
  }
  g.computeVertexNormals(); return g;
}
const SG = (r, w = 28, h = 20) => new THREE.SphereGeometry(r, w, h);
function mesh(geo, mat, role) { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; if (role) m.userData.role = role; return m; }
function put(parent, obj, p, r, s) { if (p) obj.position.set(p[0], p[1], p[2]); if (r) obj.rotation.set(r[0], r[1], r[2]); if (s) { if (typeof s === 'number') obj.scale.setScalar(s); else obj.scale.set(s[0], s[1], s[2]); } parent.add(obj); return obj; }
function mirror(fn) { fn(1); fn(-1); }
function matStd(o) {
  return new THREE.MeshStandardMaterial({ color: o.c, map: o.map || null, metalness: o.metal || 0, roughness: o.rough == null ? 0.55 : o.rough, flatShading: !!o.flat, emissive: o.em || 0x000000, emissiveIntensity: o.ei || 0, transparent: !!o.op, opacity: o.op || 1, side: o.side || THREE.FrontSide, depthWrite: o.op ? o.op > 0.9 : true });
}
const glowMat = (c, op = 0.9) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false });
function glowSprite(c, s, op = 0.8) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex(), color: c, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); sp.scale.setScalar(s); return sp; }

/* ---------- parts ---------- */
function eyeSet(parent, n, spacing, r, y, z, iris, R, style) {
  const g = new THREE.Group(); g.userData.eyes = true;
  const white = matStd({ c: style === 'glow' ? iris : '#fbf8ef', rough: 0.25, em: style === 'glow' ? iris : 0, ei: style === 'glow' ? 1.6 : 0 });
  const irisM = matStd({ c: iris, rough: 0.2, em: iris, ei: 0.35 }), pupil = matStd({ c: '#0b0812', rough: 0.15 }), shine = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const slots = n === 1 ? [[0, 0, 1.45]] : n === 3 ? [[-spacing, 0, 1], [spacing, 0, 1], [0, r * 2.1, 0.8]] : n === 4 ? [[-spacing, 0, 1], [spacing, 0, 1], [-spacing * 0.8, -r * 1.9, 0.65], [spacing * 0.8, -r * 1.9, 0.65]] : [[-spacing, 0, 1], [spacing, 0, 1]];
  for (const [x, dy, k] of slots) {
    const e = new THREE.Group(); e.position.set(x, y + dy, z);
    put(e, mesh(SG(r * k, 20, 14), white, 'eye'));
    if (style !== 'glow') {
      const slit = style === 'slit';
      put(e, mesh(SG(r * k * 0.62, 16, 12), irisM, 'eye'), [0, 0, r * k * 0.5], null, [1, 1, 0.55]);
      put(e, mesh(SG(r * k * 0.33, 12, 10), pupil, 'eye'), [0, 0, r * k * 0.78], null, slit ? [0.35, 1.15, 0.5] : [1, 1, 0.5]);
      put(e, mesh(SG(r * k * 0.13, 8, 6), shine), [r * k * 0.25, r * k * 0.28, r * k * 0.92]);
    }
    if (style !== 'nobrow' && R() < 0.6) { const brow = mesh(new THREE.BoxGeometry(r * k * 2.2, r * k * 0.35, r * k * 0.5), matStd({ c: '#20142a' })); put(e, brow, [0, r * k * 1.05, r * k * 0.35], [0, 0, (x < 0 ? -1 : 1) * (0.25 + R() * 0.25)]); }
    g.add(e);
  }
  parent.add(g); return g;
}
function horn(parent, base, dir, len, r, bend, m) {
  const pts = [V(0, 0, 0), V(dir[0] * len * 0.4, len * 0.45, dir[2] * len * 0.3 + bend * len * 0.1), V(dir[0] * len * 0.7 + bend * len * 0.25 * dir[0], len * 0.8, -bend * len * 0.35), V(dir[0] * len * (0.8 + bend * 0.5), len * (1 - bend * 0.35), -bend * len * 0.8)];
  const h = mesh(taper(pts, t => r * (1 - t * 0.92), 18, 10), m, 'accent'); h.position.copy(base); parent.add(h); return h;
}
function spikes(parent, curve, n, size, m, t0 = 0.05, t1 = 0.95) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const t = t0 + (t1 - t0) * (n === 1 ? 0.5 : i / (n - 1)), p = curve.getPointAt(t), tan = curve.getTangentAt(t);
    const s = size * (1 - Math.abs(t - 0.45) * 0.9);
    const c = mesh(new THREE.ConeGeometry(s * 0.45, s * 1.5, 7), m, 'accent');
    c.position.copy(p); const up = V(0, 1, 0); const axis = new THREE.Vector3().crossVectors(tan, V(1, 0, 0)).normalize(); if (axis.y < 0) axis.negate();
    c.quaternion.setFromUnitVectors(up, axis.lengthSq() ? axis : up); g.add(c);
  }
  parent.add(g); return g;
}
function batWing(side, span, m, tint) {
  const s = new THREE.Shape(); const L = span;
  s.moveTo(0, 0); s.quadraticCurveTo(L * 0.35, L * 0.55, L * 0.95, L * 0.62); s.quadraticCurveTo(L * 0.82, L * 0.3, L * 1.0, L * 0.18);
  s.quadraticCurveTo(L * 0.72, L * 0.1, L * 0.78, -L * 0.12); s.quadraticCurveTo(L * 0.5, -L * 0.02, L * 0.5, -L * 0.3); s.quadraticCurveTo(L * 0.25, -L * 0.1, 0, -L * 0.15); s.lineTo(0, 0);
  const g = new THREE.Group();
  const memb = mesh(new THREE.ShapeGeometry(s, 24), matStd({ c: tint, rough: 0.7, side: THREE.DoubleSide, op: 0.96 }), 'wing');
  memb.scale.x = side; g.add(memb);
  for (const [x, y] of [[0.95, 0.62], [1.0, 0.18], [0.78, -0.12], [0.5, -0.3]]) { const b = mesh(taper([V(0, 0, 0.01), V(side * x * L * 0.5, y * L * 0.6, 0.02), V(side * x * L, y * L, 0.01)], t => 0.035 * (1 - t * 0.8) * L, 10, 6), m, 'accent'); g.add(b); }
  return g;
}
function featherWing(side, span, cols, starM) {
  const g = new THREE.Group();
  const rows = [[0.0, 7, 1.0, cols[2]], [0.18, 9, 0.68, cols[1]], [0.33, 8, 0.42, cols[0]]];
  for (const [yo, n, len, c] of rows) {
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), a = -0.25 + k * 1.15;
      const fm = matStd({ c: Array.isArray(c) ? c[i % c.length] : c, rough: 0.75, side: THREE.DoubleSide });
      const f = mesh(new THREE.BoxGeometry(span * len * (0.55 + 0.45 * Math.sin(k * 2.6)), span * 0.11, 0.025), fm, 'wing');
      f.geometry.translate(span * len * 0.3, 0, 0);
      f.position.set(side * span * (0.12 + k * 0.62), -yo * span + k * span * 0.1, -0.01 - yo * 0.02);
      f.rotation.z = side * (-0.55 - a * 0.7); f.scale.x = side; g.add(f);
    }
  }
  if (starM) for (let i = 0; i < 5; i++) { const st = new THREE.Sprite(starM); st.scale.setScalar(span * 0.09); st.position.set(side * span * (0.2 + i * 0.12), span * (0.02 + (i % 2) * 0.05), 0.06); g.add(st); }
  return g;
}

/* ---------- element colors and families ---------- */
const REAL = { 1: '#8FD3FF', 2: '#FFB27A', 3: '#E04B5A', 5: '#8A5A32', 6: '#3A3F4A', 7: '#5B7CFF', 8: '#4FB8FF', 9: '#C9EA2E', 10: '#FF5A2E', 11: '#FFB000', 12: '#E8ECF5', 14: '#5C6E8A', 15: '#FF8A3D', 16: '#F2D22E', 17: '#8FDB3A', 19: '#B57BFF', 20: '#EDE6D6', 22: '#8E9BA8', 24: '#A9C4D6', 26: '#9A4E35', 27: '#2F5BD9', 28: '#B9B3A3', 29: '#D9733A', 30: '#A7B4C2', 33: '#7FA05C', 34: '#C94040', 35: '#9A2B1E', 36: '#D6ECFF', 37: '#C73E8A', 38: '#FF3355', 47: '#C8D0DA', 50: '#C4C8CC', 52: '#B9A6C9', 53: '#6B2FA3', 54: '#6FA8FF', 55: '#F7D774', 56: '#9BE07A', 60: '#A97BFF', 63: '#FF4F7B', 74: '#5F6B78', 76: '#5A7BA8', 77: '#E8EEF5', 78: '#E5E4E2', 79: '#F2C14E', 80: '#B9C4CF', 82: '#5E6470', 86: '#9DFF6B', 88: '#B8FFDA', 92: '#7CFF4F', 94: '#4FFFB0' };
const ARCH = { alk: ['fox', 'imp'], ae: ['shell', 'quad'], tm: ['knight', 'drake', 'quad'], pt: ['drake', 'imp', 'quad'], md: ['crystal', 'imp'], nm: ['imp', 'drake', 'quad'], hal: ['drake', 'imp'], ng: ['ghost', 'serpent'], lan: ['beetle', 'ghost', 'quad'], act: ['brute', 'knight'] };
const SKIN = { alk: ['fur', 'spots'], ae: ['plates', 'spots'], tm: ['plates', 'stripes'], pt: ['scales', 'spots'], md: ['facets'], nm: ['spots', 'scales', 'stripes'], hal: ['scales', 'stripes'], ng: ['none'], lan: ['spots', 'stripes'], act: ['cracks'] };

export function specOf(z, fam, famColor) {
  const R = rng(z * 9973 + 17);
  const pick = a => a[Math.floor(R() * a.length)];
  const base = col(REAL[z] || famColor); if (!REAL[z]) base.offsetHSL((R() - 0.5) * 0.12, (R() - 0.5) * 0.2, (R() - 0.5) * 0.14);
  const acc = base.clone(); acc.offsetHSL(0.42 + R() * 0.2, 0.1, R() < 0.5 ? 0.18 : -0.12);
  const eyeC = col().setHSL(R(), 0.85, 0.55);
  const metal = fam === 'tm' || fam === 'pt' ? 0.55 + R() * 0.35 : fam === 'alk' || fam === 'ae' || fam === 'lan' ? 0.15 + R() * 0.2 : fam === 'act' ? 0.3 : 0;
  return {
    z, fam, R, arch: pick(ARCH[fam] || ['imp']), skin: pick(SKIN[fam] || ['spots']),
    base: '#' + base.getHexString(), acc: '#' + acc.getHexString(), eye: '#' + eyeC.getHexString(),
    metal, rough: metal > 0.5 ? 0.32 : 0.62,
    hs: 0.85 + R() * 0.4, w: 0.85 + R() * 0.35, h: 0.85 + R() * 0.35, limb: 0.8 + R() * 0.45,
    horns: Math.floor(R() * 6), spikes: Math.floor(R() * 9), tail: 0.6 + R() * 1.0,
    wings: fam === 'hal' || fam === 'ng' ? R() < 0.7 : R() < 0.25,
    eyes: [2, 2, 2, 1, 3, 4][Math.floor(R() * 6)], eyeStyle: pick(['round', 'round', 'slit', 'glow']),
    ears: R() < 0.5, crest: R() < 0.4, teeth: R() < 0.7, superheavy: z >= 104
  };
}

/* ---------- body plans ---------- */
function makeMats(S) {
  const tex = S.skin === 'none' ? null : skinTex(S.z * 31, S.base, S.acc, S.skin);
  const skin = matStd({ c: S.skin === 'none' ? S.base : '#ffffff', map: tex, metal: S.metal, rough: S.rough, flat: S.arch === 'crystal', em: S.fam === 'act' ? S.acc : S.fam === 'ng' ? S.base : 0, ei: S.fam === 'act' ? 0.25 : S.fam === 'ng' ? 0.45 : 0, op: S.fam === 'ng' ? 0.82 : 0 });
  if (S.skin === 'none') skin.color = col(S.base);
  const belly = matStd({ c: col(S.base).offsetHSL(0, -0.1, 0.18), rough: 0.6, metal: S.metal * 0.5, flat: S.arch === 'crystal', op: S.fam === 'ng' ? 0.8 : 0 });
  const acc = matStd({ c: S.acc, metal: Math.min(1, S.metal + 0.2), rough: 0.35, flat: S.arch === 'crystal' });
  const dark = matStd({ c: col(S.base).offsetHSL(0, 0, -0.28), rough: 0.6, metal: S.metal });
  const claw = matStd({ c: '#f3eee0', rough: 0.3 });
  return { skin, belly, acc, dark, claw };
}
function limb(parent, origin, pts, r0, r1, m, role) {
  const g = new THREE.Group(); g.position.copy(origin); parent.add(g);
  g.add(mesh(taper(pts, t => r0 + (r1 - r0) * t, 20, 12), m, role || 'skin'));
  return g;
}
function claws(parent, at, n, size, m, dir = 1) { for (let i = 0; i < n; i++) { const c = mesh(new THREE.ConeGeometry(size * 0.3, size, 6), m, 'claw'); c.position.set(at.x + (i - (n - 1) / 2) * size * 0.45, at.y, at.z + size * 0.35 * dir); c.rotation.x = Math.PI / 2 * dir; parent.add(c); } }
function addHead(P, S, M, at, size, opt = {}) {
  const head = new THREE.Group(); head.position.copy(at); P.add(head);
  const R = S.R, hs = size;
  if (S.arch === 'knight' || opt.helm) {
    put(head, mesh(new THREE.BoxGeometry(hs * 0.9, hs * 0.85, hs * 0.85), M.acc, 'skin'));
    put(head, mesh(new THREE.BoxGeometry(hs * 0.72, hs * 0.14, 0.06), glowMat(S.eye, 1)), [0, hs * 0.06, hs * 0.44]);
    put(head, mesh(new THREE.ConeGeometry(hs * 0.12, hs * 0.5, 4), M.acc, 'accent'), [0, hs * 0.65, 0]);
    head.userData.visor = true;
  } else if (S.arch === 'crystal') {
    put(head, mesh(new THREE.OctahedronGeometry(hs * 0.55, 0), M.skin, 'skin'), null, null, [1, 1.2, 1]);
    eyeSet(head, S.eyes, hs * 0.18, hs * 0.1, hs * 0.05, hs * 0.38, S.eye, R, 'glow');
  } else {
    put(head, mesh(SG(hs * 0.5), M.skin, 'skin'), null, null, [1, 0.95, 1]);
    const snout = opt.snout ?? (0.35 + R() * 0.5);
    put(head, mesh(SG(hs * 0.32), M.belly, 'skin'), [0, -hs * 0.12, hs * 0.32 + snout * hs * 0.12], null, [1.05, 0.72, 0.9 + snout * 0.6]);
    put(head, mesh(SG(hs * 0.05, 8, 6), M.dark), [hs * 0.09, -hs * 0.02, hs * 0.48 + snout * hs * 0.32]);
    put(head, mesh(SG(hs * 0.05, 8, 6), M.dark), [-hs * 0.09, -hs * 0.02, hs * 0.48 + snout * hs * 0.32]);
    const mouth = mesh(new THREE.TorusGeometry(hs * 0.18, hs * 0.025, 6, 16, Math.PI), M.dark); put(head, mouth, [0, -hs * 0.2, hs * 0.44 + snout * hs * 0.25], [0, 0, Math.PI]);
    if (S.teeth) for (let i = 0; i < 4; i++) { const t = mesh(new THREE.ConeGeometry(hs * 0.035, hs * 0.11, 5), M.claw, 'claw'); put(head, t, [(i - 1.5) * hs * 0.1, -hs * 0.24, hs * 0.48 + snout * hs * 0.27], [Math.PI, 0, 0]); }
    eyeSet(head, S.eyes, hs * 0.2, hs * 0.11, hs * 0.13, hs * 0.38, S.eye, R, S.eyeStyle);
    if (S.ears) mirror(sd => { const e = mesh(new THREE.ConeGeometry(hs * 0.14, hs * 0.42, 8), M.skin, 'skin'); put(head, e, [sd * hs * 0.32, hs * 0.38, -hs * 0.05], [0, 0, -sd * 0.45]); });
    if (S.crest) { const cr = mesh(new THREE.TorusGeometry(hs * 0.4, hs * 0.07, 6, 18, Math.PI * 0.9), M.acc, 'accent'); put(head, cr, [0, hs * 0.18, -hs * 0.05], [0, Math.PI / 2, Math.PI * 0.05]); }
  }
  const hn = S.horns, hl = hs * (0.5 + R() * 0.6), hr = hs * 0.09;
  if (hn === 1) mirror(sd => horn(head, V(sd * hs * 0.24, hs * 0.32, 0), [sd * 0.35, 1, 0], hl, hr, 0.1, M.acc));
  else if (hn === 2) mirror(sd => horn(head, V(sd * hs * 0.3, hs * 0.28, -hs * 0.05), [sd * 0.9, 1, 0], hl * 1.1, hr * 1.25, 0.9, M.acc));
  else if (hn === 3) mirror(sd => { horn(head, V(sd * hs * 0.26, hs * 0.32, 0), [sd * 0.6, 1, 0], hl, hr * 0.8, 0.2, M.acc); horn(head, V(sd * hs * 0.36, hs * 0.5, -hs * 0.1), [sd * 1.2, 0.6, 0], hl * 0.5, hr * 0.6, 0.1, M.acc); });
  else if (hn === 4) horn(head, V(0, hs * 0.38, hs * 0.18), [0, 1, 0.4], hl * 1.2, hr * 1.2, 0.05, M.acc);
  else if (hn === 5) for (let i = 0; i < 5; i++) { const a = -0.9 + i * 0.45; horn(head, V(Math.sin(a) * hs * 0.36, hs * 0.38, -Math.cos(a) * hs * 0.1), [Math.sin(a), 1, -0.2], hl * (i === 2 ? 0.8 : 0.55), hr * 0.7, 0.05, M.acc); }
  return head;
}
function emblem(P, S, at, size, sym) {
  const m = new THREE.MeshStandardMaterial({ map: emblemTex(sym, '#1b1530', S.acc), roughness: 0.35, metalness: 0.1, transparent: true });
  const e = mesh(new THREE.CircleGeometry(size, 32), m, 'emblem'); e.position.copy(at); P.add(e); return e;
}

function buildBiped(root, S, M, sym, opt = {}) {
  const w = S.w, h = S.h, l = S.limb;
  const legH = (opt.short ? 0.55 : 0.8) * h, torsoY = legH + 0.5 * h;
  const parts = {};
  mirror(sd => {
    const leg = limb(root, V(sd * 0.32 * w, legH, 0), [V(0, 0, 0), V(sd * 0.05, -legH * 0.5, 0.12), V(sd * 0.04, -legH + 0.12, 0.02)], 0.17 * l * w, 0.12 * l, M.skin);
    put(leg, mesh(SG(0.16 * l), M.dark, 'skin'), [sd * 0.04, -legH + 0.08, 0.1], null, [1.1, 0.6, 1.6]);
    claws(leg, V(sd * 0.04, -legH + 0.06, 0.32 * l), 3, 0.12 * l, M.claw);
    parts[sd > 0 ? 'legR' : 'legL'] = leg;
  });
  const torso = new THREE.Group(); torso.position.set(0, torsoY, 0); root.add(torso);
  if (S.arch === 'knight') {
    put(torso, mesh(new THREE.BoxGeometry(0.95 * w, 0.95 * h, 0.7), M.skin, 'skin'));
    put(torso, mesh(new THREE.BoxGeometry(0.8 * w, 0.5 * h, 0.12), M.acc, 'accent'), [0, 0.1 * h, 0.38]);
    mirror(sd => put(torso, mesh(new THREE.SphereGeometry(0.3, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.acc, 'accent'), [sd * 0.58 * w, 0.38 * h, 0], null, [1.1, 0.9, 1.1]));
  } else if (S.arch === 'crystal') {
    put(torso, mesh(new THREE.OctahedronGeometry(0.62, 0), M.skin, 'skin'), null, null, [w, h * 1.15, 0.8]);
    for (let i = 0; i < 6; i++) { const c = mesh(new THREE.OctahedronGeometry(0.16 + S.R() * 0.18, 0), M.acc, 'accent'); put(torso, c, [(S.R() - 0.5) * 0.9 * w, 0.2 + S.R() * 0.6, -0.35 - S.R() * 0.2], [S.R() * 3, S.R() * 3, S.R() * 3], [0.6, 1.8, 0.6]); }
  } else if (S.arch === 'brute') {
    put(torso, mesh(SG(0.62), M.skin, 'skin'), [0, 0.1, 0], null, [1.25 * w, 1.0 * h, 0.85]);
    mirror(sd => put(torso, mesh(SG(0.34), M.dark, 'skin'), [sd * 0.62 * w, 0.42 * h, -0.05], null, [1, 0.8, 1]));
  } else {
    put(torso, mesh(SG(0.55), M.skin, 'skin'), null, null, [w, h, 0.82]);
    put(torso, mesh(SG(0.48), M.belly, 'skin'), [0, -0.05, 0.16], null, [w * 0.78, h * 0.85, 0.62]);
  }
  parts.torso = torso;
  const core = new THREE.Object3D(); core.position.set(0, 0.05 * h, 0.5); torso.add(core); parts.core = core;
  if (!opt.noEmblem) emblem(torso, S, V(0, (S.arch === 'knight' ? 0.1 : 0) * h, S.arch === 'knight' ? 0.45 : S.arch === 'crystal' ? 0.3 : 0.47), 0.15, sym);
  if (S.fam === 'act') { const c = mesh(SG(0.13), glowMat(S.acc, 1)); put(torso, c, [0, 0.25 * h, 0.5]); torso.add(put(new THREE.Group(), glowSprite(S.acc, 0.9), [0, 0.25 * h, 0.55])); }
  const shY = torsoY + 0.36 * h, armL = (S.arch === 'brute' ? 1.45 : 1) * l;
  mirror(sd => {
    const a = limb(root, V(sd * 0.52 * w * (S.arch === 'brute' ? 1.2 : 1), shY, 0.02), [V(0, 0, 0), V(sd * 0.22 * armL, -0.35 * armL, 0.12), V(sd * 0.16 * armL, -0.72 * armL, 0.32)], 0.13 * armL * (S.arch === 'brute' ? 1.5 : 1), 0.09 * armL, S.arch === 'knight' ? M.acc : M.skin);
    put(a, mesh(SG(0.11 * armL * (S.arch === 'brute' ? 1.7 : 1)), M.dark, 'skin'), [sd * 0.16 * armL, -0.74 * armL, 0.34]);
    claws(a, V(sd * 0.16 * armL, -0.8 * armL, 0.38), 3, 0.1 * armL, M.claw);
    a.userData.side = sd; parts[sd > 0 ? 'armR' : 'armL'] = a;
  });
  const headY = torsoY + 0.55 * h + 0.32 * S.hs * (S.arch === 'brute' ? 0.4 : 1);
  parts.head = addHead(root, S, M, V(0, headY, S.arch === 'drake' ? 0.18 : 0.04), 0.78 * S.hs * (S.arch === 'brute' ? 0.75 : 1), opt);
  if (S.arch === 'drake') put(root, mesh(taper([V(0, torsoY + 0.3 * h, -0.05), V(0, headY - 0.1, 0.12)], 0.17, 8, 10), M.skin, 'skin'));
  const tl = S.tail * (S.arch === 'drake' ? 1.4 : 1);
  if (S.arch !== 'knight' || S.R() < 0.4) {
    const tail = new THREE.Group(); tail.position.set(0, torsoY - 0.3 * h, -0.32); root.add(tail);
    const tc = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, -0.2, -0.45 * tl), V(0.2, -0.2, -0.95 * tl), V(0.35, 0.15, -1.3 * tl)]);
    tail.add(mesh(taper(tc.points, t => 0.2 * w * (1 - t * 0.9), 24, 12), M.skin, 'skin'));
    if (S.spikes > 2) spikes(tail, tc, Math.min(6, S.spikes), 0.16, M.acc, 0.15, 0.95);
    else { const tip = mesh(new THREE.ConeGeometry(0.1, 0.3, 4), M.acc, 'accent'); tip.position.copy(tc.getPointAt(1)); tip.rotation.x = -1.2; tail.add(tip); }
    parts.tail = tail;
  }
  if (S.spikes > 3 && S.arch !== 'knight') { const sc = new THREE.CatmullRomCurve3([V(0, headY - 0.2, -0.3), V(0, torsoY + 0.35 * h, -0.45), V(0, torsoY - 0.2 * h, -0.42)]); spikes(root, sc, S.spikes - 2, 0.2, M.acc); }
  if (S.wings || opt.wings) {
    mirror(sd => { const wg = batWing(sd, 1.1 + S.R() * 0.5, M.acc, col(S.acc).offsetHSL(0, -0.1, -0.1)); const pv = new THREE.Group(); pv.position.set(sd * 0.25 * w, shY + 0.05, -0.38); pv.rotation.y = sd * 0.5; pv.add(wg); root.add(pv); parts[sd > 0 ? 'wingR' : 'wingL'] = pv; });
  }
  parts.top = headY + 0.5; return parts;
}

function buildQuad(root, S, M, sym, opt = {}) {
  const w = S.w, l = S.limb, legH = 0.7 * l, bodyY = legH + 0.25;
  const parts = {};
  const body = new THREE.Group(); body.position.set(0, bodyY, 0); root.add(body); parts.torso = body;
  put(body, mesh(SG(0.6), M.skin, 'skin'), null, null, [0.8 * w, 0.62 * S.h, 1.35]);
  put(body, mesh(SG(0.5), M.belly, 'skin'), [0, -0.18, 0.05], null, [0.65 * w, 0.4, 1.15]);
  if (S.arch === 'shell' || S.arch === 'beetle') {
    const sh = mesh(new THREE.SphereGeometry(0.75, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), S.arch === 'beetle' ? matStd({ c: S.acc, metal: 0.55, rough: 0.2 }) : M.acc, 'accent');
    put(body, sh, [0, 0.05, -0.05], null, [0.95 * w, 0.8, 1.25]);
    if (S.arch === 'shell') for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; put(body, mesh(new THREE.DodecahedronGeometry(0.15, 0), M.dark, 'accent'), [Math.cos(a) * 0.4 * w, 0.42, Math.sin(a) * 0.55], [a, a, 0]); }
    else put(body, mesh(new THREE.BoxGeometry(0.02, 0.62, 1.6), M.dark), [0, 0.32, -0.05]);
  }
  const core = new THREE.Object3D(); core.position.set(0, 0.1, 0.8); body.add(core); parts.core = core;
  const legs = S.arch === 'beetle' ? [[0.42, 0.55], [0.48, 0], [0.42, -0.55]] : [[0.38, 0.5], [0.38, -0.5]];
  legs.forEach(([x, zz], i) => mirror(sd => {
    const thin = S.arch === 'beetle';
    const lg = limb(root, V(sd * x * w, bodyY - 0.1, zz), thin ? [V(0, 0, 0), V(sd * 0.35, 0.15, 0), V(sd * 0.5, -legH + 0.05, zz * 0.2)] : [V(0, 0, 0), V(sd * 0.04, -legH * 0.5, 0.06), V(sd * 0.02, -legH + 0.1, 0.02)], thin ? 0.06 : 0.15 * l, thin ? 0.03 : 0.11 * l, thin ? M.dark : M.skin);
    if (!thin) { put(lg, mesh(SG(0.13 * l), M.dark, 'skin'), [sd * 0.02, -legH + 0.07, 0.07], null, [1.1, 0.6, 1.5]); claws(lg, V(sd * 0.02, -legH + 0.05, 0.24 * l), 3, 0.09 * l, M.claw); }
    parts['leg' + i + (sd > 0 ? 'R' : 'L')] = lg;
  }));
  const headAt = V(0, bodyY + 0.45, 0.95);
  root.add(mesh(taper([V(0, bodyY + 0.1, 0.55), V(0, bodyY + 0.35, 0.85)], 0.24 * w, 6, 12), M.skin, 'skin'));
  parts.head = addHead(root, S, M, headAt, 0.72 * S.hs, opt);
  if (S.arch === 'beetle') mirror(sd => horn(parts.head, V(sd * 0.12, -0.12, 0.3), [sd * 0.6, 0.2, 1], 0.35, 0.04, 0.6, M.claw));
  if (S.arch !== 'beetle') {
    const tl = S.tail; const tail = new THREE.Group(); tail.position.set(0, bodyY + 0.05, -0.75); root.add(tail);
    const tc = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 0.15, -0.4 * tl), V(0.15, 0.45, -0.8 * tl), V(0.1, 0.85, -0.95 * tl)]);
    tail.add(mesh(taper(tc.points, t => (S.arch === 'fox' ? 0.24 : 0.16) * (1 - t * (S.arch === 'fox' ? 0.4 : 0.9)), 22, 12), S.arch === 'fox' ? M.belly : M.skin, 'skin'));
    if (S.arch === 'fox') { const tip = mesh(SG(0.16), matStd({ c: '#fff6e0' }), 'skin'); tip.position.copy(tc.getPointAt(1)); tail.add(tip); }
    parts.tail = tail;
  }
  if (S.spikes > 2 && S.arch !== 'shell' && S.arch !== 'beetle') spikes(root, new THREE.CatmullRomCurve3([V(0, bodyY + 0.42, 0.5), V(0, bodyY + 0.42, -0.1), V(0, bodyY + 0.3, -0.7)]), S.spikes, 0.18, M.acc);
  if (S.wings || opt.wings) mirror(sd => { const wg = batWing(sd, 1.0 + S.R() * 0.4, M.acc, col(S.acc).offsetHSL(0, -0.1, -0.1)); const pv = new THREE.Group(); pv.position.set(sd * 0.3 * w, bodyY + 0.35, 0.1); pv.rotation.y = sd * 0.4; pv.add(wg); root.add(pv); parts[sd > 0 ? 'wingR' : 'wingL'] = pv; });
  if (!opt.noEmblem) emblem(body, S, V(0, 0.05, 0.82), 0.13, sym);
  parts.top = headAt.y + 0.5; return parts;
}

function buildGhost(root, S, M, sym) {
  const parts = {}; const R = S.R, h = S.h;
  const curl = (R() - 0.5) * 0.8;
  const body = new THREE.Group(); root.add(body); parts.torso = body; parts.float = true;
  const pts = [V(0, 2.0 * h, 0), V(0.05, 1.5 * h, 0.05), V(curl * 0.4, 1.0 * h, -0.1), V(curl, 0.55, -0.4), V(curl * 1.6, 0.4, -0.95)];
  body.add(mesh(taper(pts, t => (0.62 * S.w) * Math.pow(1 - t, 0.75) + 0.02, 40, 18), M.skin, 'skin'));
  for (let i = 0; i < 3; i++) { const a = (i - 1) * 0.7; body.add(mesh(taper([V(0, 1.1 * h, 0), V(Math.sin(a) * 0.5, 0.7, -0.3 - Math.cos(a) * 0.2), V(Math.sin(a) * 0.8, 0.35, -0.7)], t => 0.14 * (1 - t), 16, 10), M.skin, 'skin')); }
  mirror(sd => { const a = limb(root, V(sd * 0.48 * S.w, 1.55 * h, 0.05), [V(0, 0, 0), V(sd * 0.35, -0.2, 0.2), V(sd * 0.42, -0.5, 0.35)], 0.11, 0.025, M.skin); a.userData.side = sd; parts[sd > 0 ? 'armR' : 'armL'] = a; });
  const head = new THREE.Group(); head.position.set(0, 1.85 * h, 0.05); root.add(head); parts.head = head;
  eyeSet(head, S.eyes, 0.17, 0.1, 0.02, 0.42, S.eye, R, S.eyeStyle === 'glow' ? 'glow' : 'round');
  put(head, mesh(new THREE.TorusGeometry(0.1, 0.022, 6, 14, Math.PI), M.dark), [0, -0.2, 0.5], [0, 0, Math.PI]);
  const halo = mesh(new THREE.TorusGeometry(0.42, 0.04, 10, 40), glowMat(col(S.base).offsetHSL(0, 0, 0.25), 0.95)); put(head, halo, [0, 0.62, -0.05], [Math.PI / 2.2, 0, 0]); parts.halo = halo;
  if (S.horns === 4 || S.horns === 1) mirror(sd => horn(head, V(sd * 0.25, 0.3, 0), [sd * 0.4, 1, 0], 0.4, 0.06, 0.2, M.acc));
  const core = new THREE.Object3D(); core.position.set(0, 1.45 * h, 0.55); root.add(core); parts.core = core;
  emblem(root, S, V(0, 1.35 * h, 0.6), 0.14, sym);
  if (S.wings) mirror(sd => { const wg = batWing(sd, 1.0, M.acc, col(S.base).offsetHSL(0, 0, 0.15)); const pv = new THREE.Group(); pv.position.set(sd * 0.25, 1.6 * h, -0.3); pv.rotation.y = sd * 0.5; pv.add(wg); root.add(pv); parts[sd > 0 ? 'wingR' : 'wingL'] = pv; });
  parts.top = 2.6 * h; return parts;
}

function buildSerpent(root, S, M, sym, sea) {
  const parts = {}; const R = S.R;
  const pts = []; const turns = 1.3 + R() * 0.4;
  for (let i = 0; i <= 16; i++) { const t = i / 16, a = t * Math.PI * 2 * turns, rad = 0.85 - t * 0.55, y = t < 0.62 ? 0.18 + t * 0.15 : 0.27 + (t - 0.62) * 5.2; pts.push(V(Math.cos(a) * rad * (t < 0.62 ? 1 : 1 - (t - 0.62) * 2.2), y, Math.sin(a) * rad * (t < 0.62 ? 1 : 1 - (t - 0.62) * 2.2) - 0.1)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const body = mesh(taper(pts, t => 0.07 + 0.24 * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2) * (1 - t * 0.25), 120, 18), M.skin, 'skin');
  root.add(body); parts.torso = body; parts.body = body;
  const finM = matStd({ c: sea ? '#F2C14E' : S.acc, metal: sea ? 0.7 : 0.2, rough: 0.3, side: THREE.DoubleSide });
  for (let i = 0; i < 14; i++) {
    const t = 0.12 + i * 0.058, p = curve.getPointAt(t), tg = curve.getTangentAt(t);
    const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0.22, 0); s.quadraticCurveTo(0.12, 0.12, -0.04, 0.32); s.lineTo(0, 0);
    const f = mesh(new THREE.ShapeGeometry(s), finM, 'accent'); f.position.copy(p); f.position.y += 0.2 + (1 - t) * 0.04;
    f.lookAt(p.clone().add(tg)); f.rotateY(Math.PI / 2); f.scale.setScalar(0.9 + (1 - t) * 0.6); root.add(f);
  }
  const top = curve.getPointAt(1), tg = curve.getTangentAt(1);
  const head = new THREE.Group(); head.position.copy(top); root.add(head); parts.head = head;
  head.lookAt(top.clone().add(V(tg.x * 0.2, 0, 1)));
  const hs = 0.7 * S.hs;
  put(head, mesh(SG(hs * 0.45), M.skin, 'skin'), [0, 0, 0], null, [1, 0.85, 1.1]);
  put(head, mesh(SG(hs * 0.32), M.belly, 'skin'), [0, -hs * 0.12, hs * 0.45], null, [0.9, 0.55, 1.5]);
  const jaw = mesh(SG(hs * 0.28), M.dark, 'skin'); put(head, jaw, [0, -hs * 0.28, hs * 0.38], null, [0.85, 0.35, 1.4]); parts.jaw = jaw;
  for (let i = 0; i < 6; i++) { const t = mesh(new THREE.ConeGeometry(hs * 0.03, hs * 0.12, 5), M.claw, 'claw'); put(head, t, [(i < 3 ? -1 : 1) * hs * (0.08 + (i % 3) * 0.06), -hs * 0.22, hs * (0.55 + (i % 3) * 0.1)], [Math.PI, 0, 0]); }
  eyeSet(head, sea ? 2 : S.eyes, hs * 0.26, hs * 0.1, hs * 0.12, hs * 0.32, sea ? '#FFE27A' : S.eye, R, 'slit');
  mirror(sd => { const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(0.05, 0.35); fs.lineTo(0.18, 0.2); fs.lineTo(0.3, 0.38); fs.lineTo(0.28, 0.05); fs.lineTo(0, 0); const fin = mesh(new THREE.ShapeGeometry(fs), finM, 'accent'); put(head, fin, [sd * hs * 0.38, 0, -hs * 0.05], [0, sd * 1.9, sd * -0.3], hs * 1.3); });
  const crestN = sea ? 5 : 3; for (let i = 0; i < crestN; i++) horn(head, V((i - (crestN - 1) / 2) * hs * 0.12, hs * 0.3, -hs * 0.15), [(i - (crestN - 1) / 2) * 0.3, 1, -0.6], hs * (0.5 + (i === (crestN - 1) / 2 ? 0.35 : 0.1)), hs * 0.06, 0.6, sea ? finM : M.acc);
  if (sea) mirror(sd => { const w = mesh(taper([V(0, 0, 0), V(sd * 0.15, -0.1, 0.1), V(sd * 0.25, -0.25, 0.05), V(sd * 0.2, -0.4, -0.05)], t => 0.025 * (1 - t), 14, 6), finM, 'accent'); put(head, w, [sd * hs * 0.2, -hs * 0.25, hs * 0.65]); });
  emblem(root, S, curve.getPointAt(0.78).add(V(0, 0, 0.27)), 0.12, sym);
  const core = new THREE.Object3D(); core.position.copy(top).add(V(0, -0.1, 0.5)); root.add(core); parts.core = core;
  parts.top = top.y + 0.5; return parts;
}

/* ---------- custom monsters ---------- */
function buildFrench(root, S, M) {
  S.arch = 'imp'; S.horns = 0; S.ears = true; S.eyes = 2; S.eyeStyle = 'round'; S.wings = false; S.spikes = 0; S.tail = 0.9; S.crest = false; S.teeth = false; S.w = 1.15; S.h = 0.95;
  const shirt = matStd({ map: canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#fbfbf7'; g.fillRect(0, 0, w, h); g.fillStyle = '#1E3A8A'; for (let y = 6; y < h; y += 30) g.fillRect(0, y, w, 13); }), c: '#ffffff', rough: 0.8 });
  const M2 = { ...M, skin: matStd({ c: '#ffffff', map: skinTex(87, '#F2711C', '#FFD24A', 'fur'), rough: 0.75 }) };
  const p = buildBiped(root, S, M2, 'Fr', { noEmblem: true, short: true, snout: 0.75 });
  p.torso.children.forEach(c => { if (c.isMesh && c.material === M2.belly) c.material = shirt; else if (c.isMesh) c.material = shirt; });
  const scarf = mesh(new THREE.TorusGeometry(0.33, 0.07, 10, 24), matStd({ c: '#E5484D', rough: 0.7 }), 'accent'); put(p.torso, scarf, [0, 0.45, 0.02], [Math.PI / 2, 0, 0], [1.25, 1, 1]);
  put(p.torso, mesh(new THREE.ConeGeometry(0.1, 0.28, 3), matStd({ c: '#E5484D' })), [0.12, 0.3, 0.38], [0.3, 0, 2.6]);
  const beretM = matStd({ c: '#121212', rough: 0.9 });
  put(p.head, mesh(SG(0.38), beretM, 'beret'), [0.06, 0.3, -0.02], [0, 0, -0.25], [1.25, 0.32, 1.2]);
  put(p.head, mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.1, 8), beretM), [0.08, 0.44, 0]);
  const mus = matStd({ c: '#2B1606', rough: 0.7 });
  mirror(sd => { const m = mesh(taper([V(0, 0, 0), V(sd * 0.12, -0.03, 0.02), V(sd * 0.24, 0.02, 0), V(sd * 0.27, 0.1, -0.03)], t => 0.045 * (1 - t * 0.7), 16, 8), mus); put(p.head, m, [0, -0.15, 0.52]); });
  put(p.torso, put(new THREE.Group(), (() => { const g = new THREE.Group(); ['#1E3A8A', '#ffffff', '#E5484D'].forEach((c, i) => put(g, mesh(new THREE.BoxGeometry(0.05, 0.1, 0.01), matStd({ c })), [(i - 1) * 0.05, 0, 0])); return g; })(), [-0.2, 0.2, 0.47]));
  const crust = matStd({ c: '#ffffff', map: canvasTex(128, 32, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#E9B871'); gr.addColorStop(1, '#B9772E'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#F6DCA8'; g.lineWidth = 4; for (let x = 10; x < w; x += 20) { g.beginPath(); g.moveTo(x, 6); g.lineTo(x + 10, h - 6); g.stroke(); } }), rough: 0.85 });
  const bag = () => { const b = mesh(new THREE.CapsuleGeometry(0.075, 1.0, 6, 14), crust, 'baguette'); return b; };
  ['armL', 'armR'].forEach((k, i) => { const a = p[k]; const sd = a.userData.side; const b = bag(); put(a, b, [sd * 0.16, -0.78, 0.38], [0.5, 0, sd * 0.25]); a.userData.prop = b; });
  return p;
}
function buildEagle(root, S, M) {
  S.arch = 'eagle';
  const parts = {}; const brown = matStd({ c: '#ffffff', map: skinTex(951, '#5A3A22', '#3B2414', 'fur'), rough: 0.8 });
  const white = matStd({ c: '#F6F4EE', map: skinTex(952, '#F6F4EE', '#DDD8CC', 'fur'), rough: 0.8 });
  const gold = matStd({ c: '#F2B705', rough: 0.35 }), talon = matStd({ c: '#1b1b1b', rough: 0.3 });
  const legH = 0.55;
  mirror(sd => { const lg = limb(root, V(sd * 0.22, legH + 0.1, 0.05), [V(0, 0, 0), V(sd * 0.02, -legH * 0.55, 0.04), V(sd * 0.02, -legH, 0.08)], 0.1, 0.06, gold); for (let i = 0; i < 3; i++) { const t = mesh(taper([V(0, 0, 0), V((i - 1) * 0.07, -0.03, 0.12), V((i - 1) * 0.1, -0.08, 0.18)], t => 0.03 * (1 - t * 0.6), 8, 6), gold); put(lg, t, [sd * 0.02, -legH + 0.02, 0.08]); const c = mesh(new THREE.ConeGeometry(0.025, 0.09, 6), talon, 'claw'); put(lg, c, [sd * 0.02 + (i - 1) * 0.1, -legH - 0.07, 0.27], [2.2, 0, 0]); } parts[sd > 0 ? 'legR' : 'legL'] = lg; });
  const torso = new THREE.Group(); torso.position.set(0, legH + 0.75, 0); root.add(torso); parts.torso = torso;
  put(torso, mesh(SG(0.6), brown, 'skin'), null, [0.15, 0, 0], [0.95, 1.15, 0.85]);
  const shield = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.2, map: canvasTex(128, 160, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#D62839'; for (let x = 0; x < w; x += 25) g.fillRect(x, 50, 12.5, h); g.fillStyle = '#1E3A8A'; g.fillRect(0, 0, w, 50); g.fillStyle = '#fff'; for (let i = 0; i < 7; i++) { const cx = 14 + i * 17, cy = 25; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 3 : 7; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.fill(); } }) });
  const sg = new THREE.Shape(); sg.moveTo(-0.25, 0.25); sg.lineTo(0.25, 0.25); sg.lineTo(0.25, -0.05); sg.quadraticCurveTo(0.2, -0.28, 0, -0.38); sg.quadraticCurveTo(-0.2, -0.28, -0.25, -0.05); sg.lineTo(-0.25, 0.25);
  const shg = new THREE.ShapeGeometry(sg); const uv = shg.attributes.uv; const pp = shg.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (pp.getX(i) + 0.25) / 0.5, (pp.getY(i) + 0.38) / 0.63);
  put(torso, mesh(shg, shield, 'emblem'), [0, 0.02, 0.53], [-0.12, 0, 0]);
  const core = new THREE.Object3D(); core.position.set(0, 0.6, 0.6); torso.add(core); parts.core = core;
  const head = new THREE.Group(); head.position.set(0, legH + 1.55, 0.18); root.add(head); parts.head = head;
  put(head, mesh(SG(0.36), white, 'skin'), null, null, [0.95, 1, 1.1]);
  put(root, mesh(taper([V(0, legH + 1.15, 0.05), V(0, legH + 1.45, 0.15)], 0.28, 6, 14), white, 'skin'));
  const beak = mesh(taper([V(0, 0, 0), V(0, 0.0, 0.2), V(0, -0.06, 0.32), V(0, -0.18, 0.36)], t => 0.13 * (1 - t * 0.85), 18, 12), gold, 'accent'); put(head, beak, [0, -0.04, 0.28]); parts.beak = beak;
  put(head, mesh(SG(0.09), gold), [0, -0.12, 0.3], null, [1, 0.6, 1.2]);
  eyeSet(head, 2, 0.15, 0.075, 0.07, 0.3, '#F2B705', rng(95), 'nobrow');
  mirror(sd => put(head, mesh(new THREE.BoxGeometry(0.15, 0.035, 0.1), matStd({ c: '#E9E4D8' })), [sd * 0.15, 0.17, 0.29], [0.25, 0, sd * 0.3]));
  const starM = new THREE.SpriteMaterial({ map: starTex(), color: '#ffffff', transparent: true, depthWrite: false });
  mirror(sd => { const wg = featherWing(sd, 1.7, [['#1E3A8A'], ['#1E3A8A', '#24449B'], ['#D62839', '#F4F1EA']], starM); const pv = new THREE.Group(); pv.position.set(sd * 0.42, legH + 1.25, -0.25); pv.rotation.set(0, sd * 0.35, 0); pv.add(wg); root.add(pv); parts[sd > 0 ? 'wingR' : 'wingL'] = pv; });
  const tail = new THREE.Group(); tail.position.set(0, legH + 0.45, -0.35); root.add(tail); parts.tail = tail;
  for (let i = 0; i < 7; i++) { const f = mesh(new THREE.BoxGeometry(0.11, 0.6, 0.02), matStd({ c: '#F6F4EE', rough: 0.8, side: THREE.DoubleSide }), 'wing'); f.geometry.translate(0, -0.3, 0); put(tail, f, [0, 0, 0], [-0.7, 0, (i - 3) * 0.18]); }
  parts.top = legH + 2.1; return parts;
}

/* ---------- full build ---------- */
export function buildMonster(z, info) {
  const S = specOf(z, info.fam, info.famColor);
  const root = new THREE.Group(); root.name = 'atomix';
  let parts;
  if (info.custom === 'french') parts = buildFrench(root, S, makeMats(S));
  else if (info.custom === 'eagle') parts = buildEagle(root, S, makeMats(S));
  else if (info.custom === 'serpent') {
    S.base = '#ffffff'; S.skin = 'scales'; const M = makeMats(S);
    M.skin = matStd({ c: '#ffffff', map: skinTex(106, '#15837A', '#5EE6D0', 'scales'), metal: 0.35, rough: 0.35 });
    M.belly = matStd({ c: '#9FF0DD', rough: 0.4 }); M.acc = matStd({ c: '#F2C14E', metal: 0.7, rough: 0.3 }); M.dark = matStd({ c: '#0B4A55' });
    parts = buildSerpent(root, S, M, 'Sg', true);
    const water = mesh(new THREE.TorusGeometry(1.05, 0.1, 10, 60), matStd({ c: '#2A8FD6', op: 0.65, rough: 0.1, metal: 0.1 }), 'water'); put(root, water, [0, 0.06, -0.1], [Math.PI / 2, 0, 0]); parts.water = water;
    put(root, mesh(new THREE.CircleGeometry(1.05, 48), matStd({ c: '#0E3E66', op: 0.55, rough: 0.05 })), [0, 0.03, -0.1], [-Math.PI / 2, 0, 0]);
  } else {
    const M = makeMats(S);
    if (S.arch === 'ghost') parts = buildGhost(root, S, M, info.sym);
    else if (S.arch === 'serpent') parts = buildSerpent(root, S, M, info.sym, false);
    else if (['quad', 'fox', 'shell', 'beetle'].includes(S.arch)) parts = buildQuad(root, S, M, info.sym);
    else parts = buildBiped(root, S, M, info.sym);
    if (S.fam === 'alk') { const sp = new THREE.Group(); for (let i = 0; i < 8; i++) { const t = mesh(new THREE.TetrahedronGeometry(0.06), glowMat('#FFD24A', 1)); t.userData.o = [S.R() * 6.28, 0.5 + S.R() * 0.6, 0.4 + S.R() * 1.4]; sp.add(t); } root.add(sp); parts.sparks = sp; }
    if (S.fam === 'lan') { const ring = mesh(new THREE.TorusGeometry(1.1, 0.025, 8, 80), glowMat(S.acc, 0.85)); put(root, ring, [0, 1.0, 0], [1.2, 0.3, 0]); parts.ring = ring; }
    if (S.fam === 'hal') { const g = new THREE.Group(); for (let i = 0; i < 5; i++) { const d = mesh(SG(0.04, 8, 6), glowMat(S.base, 0.8)); d.userData.o = [S.R(), S.R() * 6.28]; g.add(d); } root.add(g); parts.drips = g; }
    if (S.superheavy) { const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const r = mesh(new THREE.TorusGeometry(0.9 + i * 0.15, 0.01, 6, 60), glowMat(S.acc, 0.6)); r.rotation.set(S.R() * 3, S.R() * 3, 0); g.add(r); } g.position.y = 1.1; root.add(g); parts.orbit = g; }
  }
  root.userData = { S, parts, info };
  return root;
}

/* ---------- mutation forms (normal view, and how Ultimate looks in each) ---------- */
export const FORMS = {
  0: { n: 'Normal', c: null },
  1: { n: 'Planetary', c: '#5B8CFF', tint: '#5B8CFF', amt: 0.35 },
  2: { n: 'Star', c: '#FFB547', tint: '#FFD27A', amt: 0.5, em: '#FF9A1F', ei: 0.55 },
  3: { n: 'Impact', c: '#FF6A3D', tint: '#3A1A10', amt: 0.55, em: '#FF4A12', ei: 0.35, crack: true },
  4: { n: 'Solar System', c: '#FFD76A', tint: '#FFE29A', amt: 0.35, em: '#FFB000', ei: 0.2 },
  5: { n: 'Black Hole', c: '#8F86FF', tint: '#120C22', amt: 0.8, em: '#3A1A7A', ei: 0.4 },
  6: { n: 'Rift', c: '#3FD9D2', tint: '#2A1550', amt: 0.55, em: '#7A2BFF', ei: 0.5, glitch: true },
  11: { n: 'Universe', c: '#5CC8FF', space: true },
  7: { n: 'Multiverse', c: '#B48CFF', tint: '#B48CFF', amt: 0.45, em: '#7A4BFF', ei: 0.3, clones: true },
  8: { n: 'Omniverse', c: '#FF6AD5', irid: true },
  9: { n: 'Absolute', c: '#FF5C9A', tint: '#FFE6F0', amt: 0.75, em: '#FF8AB8', ei: 0.35, crystal: true },
  10: { n: 'The One Before All', c: '#FFFFFF', tint: '#FFFFFF', amt: 0.7, em: '#FFE7A0', ei: 0.55 },
  12: { n: 'Determination', c: '#FF2E2E', tint: '#B01414', amt: 0.6, em: '#FF1E1E', ei: 0.45, heart: true },
  13: { n: '???', c: '#FFE98A', tint: '#FFE98A', amt: 0.55, em: '#FFD24A', ei: 0.6, heart: true, glitch: true }
};
function eachMat(root, fn) { root.traverse(o => { if (o.isMesh && o.userData.role && o.userData.role !== 'eye' && o.userData.role !== 'emblem') { o.material = o.material.clone(); fn(o.material, o.userData.role, o); } }); }
function makeOrbiters(color, n, r, size, geoFn) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const m = mesh(geoFn ? geoFn(i) : SG(size, 16, 12), matStd({ c: color, em: '#FF4A12', ei: 0.5, flat: !!geoFn, rough: 0.8 })); m.userData.o = [i / n * Math.PI * 2, r * (0.85 + (i % 3) * 0.12), (i % 2 ? 1 : -1) * (0.5 + i * 0.08)]; g.add(m); }
  g.userData.orbit = true; return g;
}
function heartGeo(s) { const sh = new THREE.Shape(); sh.moveTo(0, -0.9 * s); sh.bezierCurveTo(1.2 * s, -0.1 * s, 0.8 * s, 0.9 * s, 0, 0.45 * s); sh.bezierCurveTo(-0.8 * s, 0.9 * s, -1.2 * s, -0.1 * s, 0, -0.9 * s); return new THREE.ExtrudeGeometry(sh, { depth: s * 0.4, bevelEnabled: true, bevelSize: s * 0.12, bevelThickness: s * 0.12, bevelSegments: 4, curveSegments: 18 }); }
export function applyForm(mon, form, ult) {
  const F = FORMS[form] || FORMS[0], { S, parts } = mon.userData; const base = parts.top || 2;
  const aura = new THREE.Group(); aura.name = 'aura'; mon.add(aura); const ticks = [];
  const fc = F.c || S.acc;
  if (F.tint || F.space || F.irid) eachMat(mon, (m, role) => {
    if (role === 'claw' || role === 'baguette' || role === 'beret') return;
    if (F.space && (role === 'skin' || role === 'wing')) { m.map = spaceTex(); m.color = col('#ffffff'); m.emissive = col('#2A2A7A'); m.emissiveIntensity = 0.35; m.metalness = 0.2; m.roughness = 0.35; return; }
    if (F.irid) { m.color.lerp(col('#ffffff'), 0.35); m.metalness = 0.9; m.roughness = 0.12; m.emissive = col('#FF6AD5'); m.emissiveIntensity = 0.12; return; }
    m.color.lerp(col(F.tint), role === 'accent' ? F.amt * 0.6 : F.amt);
    if (F.em) { m.emissive = col(F.em); m.emissiveIntensity = (role === 'accent' ? 1.6 : 1) * F.ei; }
    if (F.crystal) { m.roughness = 0.08; m.metalness = 0.25; m.transparent = true; m.opacity = role === 'skin' ? 0.86 : 1; }
    if (F.crack && role === 'skin') { m.emissiveMap = skinTex(S.z + 5, '#000000', '#FF7A1A', 'cracks'); m.emissive = col('#FF5A12'); m.emissiveIntensity = 1.4; }
  });
  const H = base * 0.55;
  const add = (o, tick) => { aura.add(o); if (tick) ticks.push([o, tick]); return o; };
  if (form === 1) { const moon = add(mesh(SG(0.16), matStd({ c: '#C9D6FF', rough: 0.9 }))); const ring = add(mesh(new THREE.TorusGeometry(1.25, 0.03, 8, 90), glowMat('#7FA6FF', 0.6)), (o, t) => { o.rotation.z = t * 0.1; }); ring.rotation.x = 1.25; ring.position.y = H; ticks.push([moon, (o, t) => o.position.set(Math.cos(t * 0.9) * 1.35, H + Math.sin(t * 0.9) * 0.35, Math.sin(t * 0.9) * 1.35)]); }
  if (form === 2) { add(glowSprite('#FFB547', base * 1.6, 0.55), null).position.y = H; for (let i = 0; i < 10; i++) { const r = add(mesh(new THREE.ConeGeometry(0.05, 0.7, 4), glowMat('#FFD27A', 0.85))); r.userData.a = i / 10 * Math.PI * 2; } ticks.push([aura, (o, t) => o.children.forEach(c => { if (c.userData.a != null) { const a = c.userData.a + t * 0.4; c.position.set(Math.cos(a) * 1.25, H, Math.sin(a) * 1.25); c.rotation.set(0, 0, 0); c.lookAt(0, H, 0); c.rotateX(-Math.PI / 2); c.scale.y = 0.7 + 0.4 * Math.sin(t * 4 + c.userData.a * 3); } })]); }
  if (form === 3) add(makeOrbiters('#7A3A22', 7, 1.2, 0.1, () => new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.08, 0)), null).position.y = H;
  if (form === 4) { add(glowSprite('#FFB000', 0.9, 0.9)).position.set(0, base + 0.25, 0); const cols = ['#5B8CFF', '#FF6A3D', '#4FD08A', '#B48CFF', '#FFD76A']; cols.forEach((c, i) => { const r = 0.9 + i * 0.22; const ring = add(mesh(new THREE.TorusGeometry(r, 0.006, 4, 90), glowMat('#ffffff', 0.25))); ring.rotation.x = Math.PI / 2; ring.position.y = H; const p = add(mesh(SG(0.06 + i * 0.015), matStd({ c, em: c, ei: 0.4 }))); ticks.push([p, (o, t) => { const a = t * (0.9 - i * 0.12) + i; o.position.set(Math.cos(a) * r, H, Math.sin(a) * r); }]); }); }
  if (form === 5) { const disk = add(mesh(new THREE.RingGeometry(1.0, 1.7, 80), new THREE.MeshBasicMaterial({ map: canvasTex(256, 16, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(255,170,60,1)'); gr.addColorStop(.5, 'rgba(180,60,255,.8)'); gr.addColorStop(1, 'rgba(40,0,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })), (o, t) => { o.rotation.z = t * 0.8; }); disk.rotation.x = -Math.PI / 2.3; disk.position.y = H; const ug = disk.geometry.attributes.uv, pg = disk.geometry.attributes.position; for (let i = 0; i < ug.count; i++) { const r = Math.hypot(pg.getX(i), pg.getY(i)); ug.setXY(i, (r - 1) / 0.7, 0.5); } }
  if (form === 6) { for (let i = 0; i < 9; i++) { const s = add(mesh(new THREE.OctahedronGeometry(0.1 + Math.random() * 0.1, 0), glowMat(i % 2 ? '#3FD9D2' : '#B44BFF', 0.9))); s.userData.o = [Math.random() * 6.28, 0.9 + Math.random() * 0.6, Math.random() * base]; s.scale.y = 2.4; } ticks.push([aura, (o, t) => o.children.forEach(c => { const q = c.userData.o; if (q) { c.position.set(Math.cos(q[0] + t * 0.5) * q[1], q[2] + Math.sin(t * 2 + q[0]) * 0.1, Math.sin(q[0] + t * 0.5) * q[1]); c.rotation.y = t * 2; } })]); }
  if (form === 11) { const g = new THREE.BufferGeometry(); const n = 300, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const r = 1 + Math.random() * 1.4, a = Math.random() * 6.28, y = Math.random() * base * 1.2; p.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3); } g.setAttribute('position', new THREE.BufferAttribute(p, 3)); add(new THREE.Points(g, new THREE.PointsMaterial({ map: dotTex(), size: 0.07, color: '#BFE4FF', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })), (o, t) => { o.rotation.y = t * 0.15; }); }
  if (form === 7) { for (const sd of [-1, 1]) { const c = buildMonster(S.z, mon.userData.info); c.traverse(o => { if (o.isMesh) { o.material = new THREE.MeshBasicMaterial({ color: sd > 0 ? '#B48CFF' : '#5CC8FF', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }); o.castShadow = false; } }); c.scale.setScalar(0.92); add(c, (o, t) => { o.position.set(sd * (0.9 + Math.sin(t * 1.3) * 0.08), 0.05, -0.5); o.rotation.y = sd * 0.25; }); } }
  if (form === 8) { for (let i = 0; i < 3; i++) { const r = add(mesh(new THREE.TorusGeometry(1.15 + i * 0.12, 0.022, 8, 100), new THREE.MeshBasicMaterial({ color: col().setHSL(i / 3, 1, 0.6), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })), (o, t) => { o.rotation.x = 1.2 + Math.sin(t * 0.7 + i) * 0.4; o.rotation.y = t * (0.3 + i * 0.2); o.material.color.setHSL((t * 0.1 + i / 3) % 1, 1, 0.6); }); r.position.y = H; } }
  if (form === 9) { for (let i = 0; i < 7; i++) { const a = -0.9 + i * 0.3; const cr = add(mesh(new THREE.OctahedronGeometry(0.12, 0), matStd({ c: '#FFE6F0', em: '#FF8AB8', ei: 0.6, rough: 0.05, metal: 0.3 }))); cr.position.set(Math.sin(a) * 0.35, base + 0.05 + (i === 3 ? 0.2 : 0.05), -Math.cos(a) * 0.1); cr.scale.y = i === 3 ? 3 : 2; } const halo = add(mesh(new THREE.TorusGeometry(0.55, 0.03, 8, 60), glowMat('#FFB8D4', 0.9)), (o, t) => { o.rotation.z = t; }); halo.position.set(0, base + 0.25, -0.35); }
  if (form === 10) { for (let i = 0; i < 2; i++) { const h = add(mesh(new THREE.TorusGeometry(0.6 + i * 0.25, 0.025, 8, 70), glowMat('#FFE7A0', 0.9)), (o, t) => { o.rotation.z = t * (i ? -0.6 : 0.6); }); h.position.set(0, base + 0.15, -0.4 - i * 0.05); } const cols = ['#5B8CFF', '#FFB547', '#FF6A3D', '#FFD76A', '#8F86FF', '#3FD9D2', '#5CC8FF', '#B48CFF', '#FF6AD5', '#FF5C9A']; const g = add(new THREE.Group()); cols.forEach((c, i) => { const o = mesh(SG(0.07), glowMat(c, 1)); o.add(glowSprite(c, 0.4, 0.6)); o.userData.o = [i / cols.length * 6.28, 1.3]; g.add(o); }); ticks.push([g, (o, t) => o.children.forEach(c => { const q = c.userData.o; c.position.set(Math.cos(q[0] + t * 0.6) * q[1], H + Math.sin(q[0] * 2 + t) * 0.4, Math.sin(q[0] + t * 0.6) * q[1]); })]); }
  if (F.heart) {
    const hm = mesh(heartGeo(0.14), matStd({ c: form === 13 ? '#FFD24A' : '#FF1E1E', em: form === 13 ? '#FFB000' : '#FF0000', ei: 0.9, rough: 0.3 }));
    const hg = new THREE.Group(); hg.add(hm); hm.position.z = -0.03; hg.add(glowSprite(form === 13 ? '#FFD24A' : '#FF2E2E', 0.8, 0.7)); parts.core.add(hg); aura.userData.heart = hg;
    ticks.push([hg, (o, t) => { const b = 1 + Math.max(0, Math.sin(t * 7)) * 0.25; o.scale.setScalar(b); }]);
    const chain = new THREE.Group(); for (let i = 0; i < 24; i++) { const l = mesh(new THREE.TorusGeometry(0.06, 0.018, 6, 12), matStd({ c: '#8A8F98', metal: 0.9, rough: 0.3 })); const a = i / 24 * Math.PI * 2; l.position.set(Math.cos(a) * 1.15, 0, Math.sin(a) * 1.15); l.rotation.set(i % 2 ? Math.PI / 2 : 0, -a, 0); chain.add(l); }
    chain.position.y = H * 0.8; chain.rotation.x = 0.35; add(chain, (o, t) => { o.rotation.y = t * 0.5; });
    if (form === 13) { const cl = new THREE.Group(); for (let i = 0; i < 4; i++) { const h = mesh(heartGeo(0.07), matStd({ c: '#3FAE4F', em: '#2F8F3F', ei: 0.5 })); h.rotation.z = i * Math.PI / 2; h.position.set(Math.sin(i * Math.PI / 2) * -0.07, Math.cos(i * Math.PI / 2) * 0.07, 0); cl.add(h); } add(cl, (o, t) => { o.position.set(Math.cos(t * 0.8) * 1.3, base + 0.2 + Math.sin(t * 2) * 0.1, Math.sin(t * 0.8) * 1.3); o.rotation.y = t * 2; }); }
  }
  if (F.glitch) ticks.push([mon, (o, t) => { const g = Math.sin(t * 13) > 0.93; o.position.x = g ? (Math.random() - 0.5) * 0.12 : 0; }]);
  if (ult) {
    const uc = col(fc);
    const sz = mon.userData.ultScale = 1.18; mon.scale.setScalar(sz);
    eachMat(mon, (m, role) => { if (role === 'accent' || role === 'claw') { m.emissive = uc.clone(); m.emissiveIntensity = 0.9; } });
    for (let i = 0; i < 7; i++) { const a = -1 + i * 0.33; const c = mesh(new THREE.ConeGeometry(0.06, 0.45 + (i === 3 ? 0.3 : 0), 5), glowMat(uc, 0.95)); c.position.set(Math.sin(a) * 0.3, base + 0.1, -Math.cos(a) * 0.12); c.rotation.z = -a * 0.4; add(c); }
    mirror(sd => { const w = batWing(sd, 1.6, glowMat(uc, 0.9), uc); w.traverse(o => { if (o.isMesh) o.material = new THREE.MeshBasicMaterial({ color: uc, transparent: true, opacity: o.userData.role === 'wing' ? 0.28 : 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }); }); const pv = new THREE.Group(); pv.position.set(sd * 0.2, H * 1.2, -0.55); pv.rotation.y = sd * 0.25; pv.add(w); add(pv, (o, t) => { o.rotation.z = sd * Math.sin(t * 3) * 0.18; }); });
    const g = new THREE.BufferGeometry(); const n = 220, p = new Float32Array(n * 3), sp = new Float32Array(n); for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, r = 0.6 + Math.random() * 0.8; p.set([Math.cos(a) * r, Math.random() * base * 1.3, Math.sin(a) * r], i * 3); sp[i] = 0.5 + Math.random(); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    add(new THREE.Points(g, new THREE.PointsMaterial({ map: dotTex(), size: 0.09, color: uc, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })), (o, t, dt) => { const a = o.geometry.attributes.position; for (let i = 0; i < n; i++) { let y = a.getY(i) + dt * sp[i] * 1.2; if (y > base * 1.4) y = 0; a.setY(i, y); } a.needsUpdate = true; o.rotation.y = t * 0.6; });
    const rune = add(mesh(new THREE.RingGeometry(1.1, 1.3, 6, 1), new THREE.MeshBasicMaterial({ color: uc, transparent: true, opacity: 0.7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })), (o, t) => { o.rotation.z = t * 0.5; }); rune.rotation.x = -Math.PI / 2; rune.position.y = 0.02;
    const rune2 = add(mesh(new THREE.RingGeometry(1.4, 1.46, 64), glowMat(uc, 0.6)), (o, t) => { o.rotation.z = -t * 0.3; }); rune2.rotation.x = -Math.PI / 2; rune2.position.y = 0.02;
    add(glowSprite(uc, base * 2.2, 0.32)).position.y = H;
  }
  aura.userData.ticks = ticks; aura.userData.color = fc;
  return aura;
}

/* ---------- effects ---------- */
function disposeObj(o) { o.traverse(c => { if (c.geometry) c.geometry.dispose(); if (c.material) { (Array.isArray(c.material) ? c.material : [c.material]).forEach(m => { m.dispose(); }); } }); }
class FX {
  constructor(scene) { this.scene = scene; this.list = []; }
  add(obj, dur, upd) { this.scene.add(obj); this.list.push({ obj, t: 0, dur, upd }); return obj; }
  tick(dt) { this.list = this.list.filter(e => { e.t += dt; const k = e.t / e.dur; if (k >= 1) { this.scene.remove(e.obj); disposeObj(e.obj); return false; } e.upd && e.upd(e.obj, k, dt); return true; }); }
  clear() { this.list.forEach(e => { this.scene.remove(e.obj); disposeObj(e.obj); }); this.list = []; }
  burst(pos, color, n = 60, speed = 3, size = 0.12, dur = 0.9, o = {}) {
    const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3), v = [];
    for (let i = 0; i < n; i++) { p.set([pos.x, pos.y, pos.z], i * 3); const d = o.dir ? o.dir.clone().add(V((Math.random() - 0.5) * (o.spread || 0.6), (Math.random() - 0.5) * (o.spread || 0.6), (Math.random() - 0.5) * (o.spread || 0.6))).normalize() : V(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize(); v.push(d.multiplyScalar(speed * (0.4 + Math.random() * 0.8))); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const m = new THREE.PointsMaterial({ map: o.star ? starTex() : dotTex(), size, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: false });
    const pts = new THREE.Points(g, m);
    return this.add(pts, dur, (ob, k, dt) => { const a = ob.geometry.attributes.position; for (let i = 0; i < n; i++) { v[i].y -= (o.grav || 0) * dt; a.setXYZ(i, a.getX(i) + v[i].x * dt, a.getY(i) + v[i].y * dt, a.getZ(i) + v[i].z * dt); } a.needsUpdate = true; m.opacity = 1 - k; });
  }
  ring(pos, color, r0, r1, dur, rot = [-Math.PI / 2, 0, 0], th = 0.08) { const m = mesh(new THREE.TorusGeometry(1, th, 8, 64), glowMat(color, 0.9)); m.position.copy(pos); m.rotation.set(...rot); m.castShadow = false; return this.add(m, dur, (o, k) => { o.scale.setScalar(r0 + (r1 - r0) * k); o.material.opacity = 0.9 * (1 - k); }); }
  flash(pos, color, s0, s1, dur, op = 0.9) { const m = mesh(SG(1, 24, 16), glowMat(color, op)); m.castShadow = false; m.position.copy(pos); return this.add(m, dur, (o, k) => { o.scale.setScalar(s0 + (s1 - s0) * Math.sqrt(k)); o.material.opacity = op * (1 - k); }); }
}

/* ---------- viewer ---------- */
function envMap(renderer) {
  const pm = new THREE.PMREMGenerator(renderer); const sc = new THREE.Scene();
  const sky = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({ side: THREE.BackSide, map: canvasTex(16, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#9db4d8'); gr.addColorStop(0.55, '#2c3446'); gr.addColorStop(1, '#141820'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) }));
  sc.add(sky);
  [[3, 5, 3, '#ffffff', 4], [-4, 2, -2, '#ffd9b0', 2.5], [0, -3, 4, '#a0c0ff', 1.5]].forEach(([x, y, z, c, s]) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); p.position.set(x, y, z); p.lookAt(0, 0, 0); sc.add(p); });
  const t = pm.fromScene(sc, 0.03).texture; pm.dispose(); return t;
}
function stage(renderer) {
  const scene = new THREE.Scene(); scene.environment = envMap(renderer);
  scene.add(new THREE.HemisphereLight('#dfe9ff', '#2a2230', 0.9));
  const key = new THREE.DirectionalLight('#ffffff', 2.4); key.position.set(3, 6, 4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -3; key.shadow.camera.right = 3; key.shadow.camera.top = 4; key.shadow.camera.bottom = -2; key.shadow.bias = -0.0005; scene.add(key);
  const rim = new THREE.DirectionalLight('#9fc4ff', 1.6); rim.position.set(-4, 3, -4); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshStandardMaterial({ color: '#1d2433', roughness: 0.85, metalness: 0.1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const gl = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.55, 64), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12 })); gl.rotation.x = -Math.PI / 2; gl.position.y = 0.005; scene.add(gl);
  return { scene, ground, gl };
}

export function createViewer(host, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  const { scene, gl } = stage(renderer);
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 60); cam.position.set(3.4, 2.4, 5.2);
  const ctl = new OrbitControls(cam, renderer.domElement); ctl.target.set(0, 1.05, 0); ctl.enableDamping = true; ctl.minDistance = 3; ctl.maxDistance = 10; ctl.maxPolarAngle = Math.PI * 0.53; ctl.enablePan = false; ctl.autoRotate = true; ctl.autoRotateSpeed = 1.1;
  ctl.addEventListener('start', () => { ctl.autoRotate = false; clearTimeout(ctl._t); }); ctl.addEventListener('end', () => { clearTimeout(ctl._t); ctl._t = setTimeout(() => { ctl.autoRotate = true; }, 4000); });
  const fx = new FX(scene);
  let mon = null, aura = null, cur = null, act = null, ult = false, running = false, raf = 0, last = 0, t = 0, shake = 0, blockObj = null;
  const clock = () => performance.now() / 1000;
  function resize() { const w = host.clientWidth || 300, h = host.clientHeight || 300; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(host); resize();
  function clearMon() { if (mon) { scene.remove(mon); disposeObj(mon); mon = null; aura = null; } fx.clear(); blockObj = null; act = null; }
  function show(z, info, form, u) {
    clearMon(); cur = { z, info, form: form || 0 }; ult = !!u;
    mon = buildMonster(z, info); aura = applyForm(mon, cur.form, ult); scene.add(mon);
    const top = mon.userData.parts.top || 2; ctl.target.set(0, Math.min(1.6, top * 0.45 * (ult ? 1.15 : 1)), 0);
    gl.material.color.set(aura.userData.color); gl.material.opacity = ult ? 0.4 : 0.15;
    start();
  }
  const fwd = () => V(0, 0, 1);
  const corePos = () => { const p = new THREE.Vector3(); mon.userData.parts.core.getWorldPosition(p); return p; };
  const color = () => col(aura ? aura.userData.color : '#ffffff');
  function special() {
    const S = mon.userData.S, info = mon.userData.info, c = color(), cp = corePos(), k = ult ? 1.5 : 1;
    const famC = col(info.famColor), sc = FORMS[cur.form].c ? c : famC;
    const cust = info.custom;
    if (cust === 'eagle') {
      const hp = new THREE.Vector3(); mon.userData.parts.beak.getWorldPosition(hp);
      ['#D62839', '#F4F1EA', '#1E3A8A'].forEach((cc, i) => { const b = mesh(new THREE.CylinderGeometry(0.09 * k, 0.16 * k, 5, 16, 1, true), glowMat(cc, 0.85)); b.geometry.translate(0, 2.5, 0); b.position.copy(hp); b.rotation.x = Math.PI / 2 - 0.12; b.castShadow = false; fx.add(b, 1.4, (o, q) => { const a = q * 14 + i * 2.09; o.position.set(hp.x + Math.cos(a) * 0.12, hp.y + Math.sin(a) * 0.12, hp.z); o.scale.set(1 + q, Math.min(1, q * 5), 1 + q); o.material.opacity = 0.9 * (1 - Math.max(0, q - 0.6) / 0.4); }); });
      for (let i = 0; i < 4; i++) setTimeout(() => cur && fx.burst(hp.clone().add(V(0, 0, 1 + i * 0.9)), i % 2 ? '#ffffff' : '#FFD24A', 30, 2.4, 0.22 * k, 1.1, { star: true }), i * 160);
      fx.ring(hp.clone().add(V(0, 0, 0.3)), '#ffffff', 0.2, 1.6 * k, 0.6, [0, 0, 0]); shake = 0.25; return 'Freedom Blast';
    }
    if (cust === 'french') {
      for (let i = 0; i < 5; i++) setTimeout(() => { if (!cur) return; const b = mesh(new THREE.CapsuleGeometry(0.06, 0.7, 4, 10), matStd({ c: '#D49A4E', rough: 0.85 })); const s0 = cp.clone().add(V((i - 2) * 0.25, 0.3, 0)); b.position.copy(s0); fx.add(b, 1.0, (o, q) => { o.position.set(s0.x + (i - 2) * q * 0.6, s0.y + Math.sin(q * Math.PI) * 0.8, s0.z + q * 4.5); o.rotation.set(q * 14, q * 9, 0); }); fx.burst(s0, '#F6DCA8', 14, 1.5, 0.06, 0.6, { grav: 4 }); }, i * 120);
      setTimeout(() => cur && fx.burst(cp.clone().add(V(0, 0.4, 3)), '#ffffff', 50, 2, 0.15, 0.8, { star: true }), 700); return 'Baguette Barrage';
    }
    if (cust === 'serpent') { const w = mesh(new THREE.TorusGeometry(1, 0.25, 12, 60), matStd({ c: '#2A8FD6', op: 0.75, rough: 0.05, em: '#0A4A8A', ei: 0.4 })); w.rotation.x = -Math.PI / 2; fx.add(w, 1.6, (o, q) => { o.scale.set(1 + q * 2.4 * k, 1 + q * 2.4 * k, 1 + Math.sin(q * Math.PI) * 4); o.position.y = Math.sin(q * Math.PI) * 0.6; o.material.opacity = 0.8 * (1 - q); }); fx.burst(V(0, 0.4, 0), '#BDE6FF', 120, 3.5 * k, 0.12, 1.4, { grav: 5 }); shake = 0.2; return 'Abyss Surge'; }
    const f = S.fam;
    if (f === 'alk') { const p = cp.clone().add(V(0, 0, 1.2)); fx.flash(p, '#FFD24A', 0.2, 1.4 * k, 0.6); fx.flash(p, '#FF6A1F', 0.1, 1.0 * k, 0.8, 0.7); fx.burst(p, '#FFB547', 120, 4 * k, 0.12, 1, { grav: 3 }); fx.ring(V(p.x, 0.05, p.z), '#FF8A3D', 0.3, 2.4 * k, 0.8); shake = 0.3; }
    else if (f === 'ae') { for (let i = 0; i < 6; i++) setTimeout(() => { if (!cur) return; const sp = mesh(new THREE.ConeGeometry(0.22 * k, 1.1 * k, 6), matStd({ c: S.acc, flat: true, rough: 0.8 })); const zz = 0.6 + i * 0.45; sp.position.set((Math.random() - 0.5) * 0.4, -0.6, zz); fx.add(sp, 1.0, (o, q) => { o.position.y = q < 0.3 ? -0.6 + q / 0.3 * 1.1 : 0.5 - Math.max(0, q - 0.75) * 4; }); fx.burst(V(sp.position.x, 0.1, zz), '#C9A77A', 20, 2, 0.09, 0.6, { grav: 6 }); }, i * 90); shake = 0.2; }
    else if (f === 'tm') { for (let i = 0; i < 8; i++) { const b = mesh(new THREE.BoxGeometry(0.06, 0.5 * k, 0.16), matStd({ c: '#d9e2ec', metal: 1, rough: 0.15, em: sc, ei: 0.4 })); const a0 = i / 8 * Math.PI * 2; fx.add(b, 1.5, (o, q) => { const a = a0 + q * 10; const r = 0.9; if (q < 0.55) o.position.set(cp.x + Math.cos(a) * r, cp.y + Math.sin(a * 0.5) * 0.2, cp.z + Math.sin(a) * r); else { const qq = (q - 0.55) / 0.45; o.position.set(cp.x + Math.cos(a0) * r * (1 - qq), cp.y, cp.z + Math.sin(a0) * r + qq * 5); } o.rotation.set(q * 20, a, 0); }); } }
    else if (f === 'pt') { fx.ring(V(0, 0.05, 0), '#FF8A3D', 0.5, 3 * k, 1.2, undefined, 0.16); fx.ring(V(0, 0.05, 0), '#FFD27A', 0.3, 2.4 * k, 1.0, undefined, 0.08); fx.burst(V(0, 0.2, 0), '#FF6A1F', 80, 2.5 * k, 0.1, 1.1, { grav: 4 }); }
    else if (f === 'md') { for (let i = 0; i < 12; i++) { const c2 = mesh(new THREE.OctahedronGeometry(0.1 * k, 0), matStd({ c: S.acc, em: sc, ei: 0.6, flat: true })); c2.scale.y = 2.4; const d = V((Math.random() - 0.5) * 0.7, (Math.random() - 0.3) * 0.4, 1).normalize(); const s0 = cp.clone(); fx.add(c2, 0.9, (o, q) => { o.position.copy(s0).addScaledVector(d, q * 5); o.lookAt(o.position.clone().add(d)); o.rotateX(Math.PI / 2); }); } }
    else if (f === 'nm') { for (let i = 0; i < 40; i++) { const l = mesh(new THREE.PlaneGeometry(0.14, 0.08), matStd({ c: i % 2 ? '#4FD08A' : S.acc, side: THREE.DoubleSide, em: '#1f6f3a', ei: 0.3 })); const a0 = Math.random() * 6.28, r = 0.6 + Math.random() * 0.6; fx.add(l, 1.6, (o, q) => { const a = a0 + q * 6; o.position.set(Math.cos(a) * r, q * 2.6, Math.sin(a) * r); o.rotation.set(q * 8, a, 0); }); } fx.ring(V(0, 0.1, 0), '#4FD08A', 0.4, 1.6, 1.4); }
    else if (f === 'hal') { const p = cp.clone(); fx.burst(p, S.base, 90, 1.6 * k, 0.55, 2.0, { dir: fwd(), spread: 1.2 }); fx.burst(p, '#FFFFFF', 30, 1.2, 0.2, 1.4, { dir: fwd(), spread: 1.4 }); }
    else if (f === 'ng') { const b = mesh(new THREE.CylinderGeometry(0.12 * k, 0.12 * k, 6, 16, 1, true), glowMat(S.base, 0.95)); b.geometry.translate(0, 3, 0); b.rotation.x = Math.PI / 2; b.position.copy(cp); b.castShadow = false; fx.add(b, 1.2, (o, q) => { o.scale.set(1 + Math.sin(q * 40) * 0.2, Math.min(1, q * 6), 1 + Math.sin(q * 40) * 0.2); o.material.opacity = 0.95 * (1 - Math.max(0, q - 0.7) / 0.3); }); fx.flash(cp, S.base, 0.2, 0.6, 0.5); }
    else if (f === 'lan') { for (let i = 0; i < 4; i++) setTimeout(() => cur && fx.ring(V(0, 1, 0), S.acc, 0.6, 2.8 * k, 0.9, [Math.random() * 3, Math.random() * 3, 0], 0.04), i * 160); fx.burst(V(0, 1, 0), '#d9e2ec', 60, -2, 0.08, 1); }
    else { const p = V(0, 1, 0); for (let i = 0; i < 3; i++) setTimeout(() => cur && fx.ring(V(0, 0.05, 0), '#7CFF4F', 0.4, 3 * k, 1.0), i * 200); fx.flash(cp, '#7CFF4F', 0.2, 1.2 * k, 0.7, 0.6); fx.burst(p, '#B8FF7A', 100, 3 * k, 0.1, 1.2); shake = 0.2; }
    return null;
  }
  function act_(kind) {
    if (!mon) return null;
    let label = null; const c = color(), k = ult ? 1.4 : 1;
    if (kind === 'ult') {
      ult = !ult; const pos = V(0, 1, 0);
      fx.flash(pos, c, 0.3, 3, 0.9, 0.95); fx.ring(V(0, 0.05, 0), c, 0.4, 3.5, 1.0); fx.ring(pos, '#ffffff', 0.3, 2.6, 0.8, [0, 0, 0], 0.05); fx.burst(pos, c, 160, 4, 0.14, 1.2);
      shake = 0.45; const f = cur.form; setTimeout(() => { if (cur) show(cur.z, cur.info, f, ult); }, 180);
      return ult ? 'Ultimate mode' : 'Back to normal';
    }
    act = { kind, t: 0, dur: kind === 'block' ? 1.4 : kind === 'special' ? 1.6 : 0.7 };
    if (kind === 'attack') {
      setTimeout(() => { if (!mon) return; const p = corePos().add(V(0, 0.1, 0.5)); const arc = mesh(new THREE.TorusGeometry(0.7 * k, 0.05 * k, 6, 40, Math.PI * 1.1), glowMat(c, 1)); arc.position.copy(p); arc.rotation.set(0.2, 0, -0.6); arc.castShadow = false; fx.add(arc, 0.35, (o, q) => { o.rotation.z = -0.6 + q * 2.6; o.material.opacity = 1 - q; o.scale.setScalar(1 + q * 0.3); }); fx.burst(p.add(V(0, 0, 0.5)), c, 40, 3 * k, 0.1, 0.5, { dir: fwd(), spread: 1 }); }, 160);
      label = 'Attack';
    } else if (kind === 'block') {
      const top = mon.userData.parts.top || 2;
      blockObj = new THREE.Group(); const sh = mesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); const wf = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.01, 1)), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.8 })); blockObj.add(sh, wf); sh.castShadow = false;
      blockObj.position.set(0, top * 0.48, 0); const R0 = top * 0.62 * (ult ? 1.2 : 1);
      fx.add(blockObj, 1.4, (o, q) => { const s = R0 * (q < 0.15 ? q / 0.15 : 1) * (1 + Math.sin(q * 30) * 0.015); o.scale.setScalar(s); sh.material.opacity = 0.18 * (1 - Math.max(0, q - 0.8) / 0.2); wf.material.opacity = 0.8 * (1 - Math.max(0, q - 0.8) / 0.2); o.rotation.y = q * 1.5; });
      setTimeout(() => { if (!mon) return; const p = V(0, top * 0.5, R0 * 1.0); fx.burst(p, '#ffffff', 30, 2, 0.08, 0.4); fx.ring(p, c, 0.1, 0.8, 0.4, [0, 0, 0], 0.04); }, 500);
      label = 'Block';
    } else if (kind === 'special') { label = special() || mon.userData.info.special || 'Special'; }
    return label;
  }
  const tmpQ = new THREE.Quaternion();
  function animate(dt) {
    t += dt; if (!mon) return;
    const P = mon.userData.parts, S = mon.userData.S;
    const base = mon.userData.ultScale || 1;
    let lunge = 0, crouch = 0, armSwing = 0, rear = 0;
    if (act) { act.t += dt; const q = act.t / act.dur; if (q >= 1) act = null; else if (act.kind === 'attack') { lunge = Math.sin(Math.min(1, q * 1.6) * Math.PI) * 0.45; armSwing = Math.sin(q * Math.PI) * 1.4; } else if (act.kind === 'block') { crouch = Math.sin(Math.min(1, q * 4) * Math.PI / 2) * (1 - Math.max(0, q - 0.85) / 0.15); } else if (act.kind === 'special') { rear = Math.sin(q * Math.PI); } }
    mon.position.z = lunge; mon.position.y = (P.float ? 0.12 + Math.sin(t * 1.6) * 0.08 : 0) - crouch * 0.08;
    mon.scale.set(base * (1 + crouch * 0.05), base * (1 - crouch * 0.1 + Math.sin(t * 2.2) * 0.012), base);
    mon.rotation.x = -rear * 0.12 + lunge * 0.15;
    if (P.torso && P.torso.isGroup) P.torso.rotation.y = Math.sin(t * 0.9) * 0.04;
    if (P.head) { P.head.rotation.y = Math.sin(t * 0.7) * 0.12; P.head.rotation.x = -rear * 0.3 + Math.sin(t * 1.3) * 0.03; }
    for (const k of ['armL', 'armR']) if (P[k]) { const sd = P[k].userData.side || 1; P[k].rotation.x = -armSwing * (k === 'armR' ? 1 : 0.4) - crouch * 1.1 - rear * 0.8 + Math.sin(t * 1.8 + sd) * 0.06; P[k].rotation.z = sd * (crouch * 0.6 + rear * 0.5); }
    for (const k of ['wingL', 'wingR']) if (P[k]) { const sd = k === 'wingR' ? 1 : -1; P[k].rotation.z = sd * (Math.sin(t * (rear ? 9 : 2.6)) * (rear ? 0.45 : 0.16) + crouch * 0.5); P[k].rotation.y = sd * (0.4 - crouch * 0.9); }
    if (P.tail) P.tail.rotation.y = Math.sin(t * 1.7) * 0.25;
    if (P.jaw) P.jaw.position.y = -0.2 * (S.hs || 1) - rear * 0.06;
    if (P.halo) P.halo.rotation.z = t;
    if (P.water) { P.water.scale.setScalar(1 + Math.sin(t * 2) * 0.03); }
    if (P.ring) P.ring.rotation.z = t * 0.6;
    if (P.orbit) P.orbit.children.forEach((r, i) => { r.rotation.y += dt * (0.4 + i * 0.3); });
    if (P.sparks) P.sparks.children.forEach(s => { const o = s.userData.o; const a = o[0] + t * 1.4; s.position.set(Math.cos(a) * o[1], o[2] + Math.sin(t * 3 + o[0]) * 0.1, Math.sin(a) * o[1]); s.rotation.set(t * 3, t * 2, 0); s.visible = Math.sin(t * 9 + o[0] * 5) > -0.3; });
    if (P.drips) P.drips.children.forEach(d => { const o = d.userData.o; const y = ((t * 0.6 + o[0]) % 1); d.position.set(Math.cos(o[1]) * 0.35, 1.4 - y * 1.4, Math.sin(o[1]) * 0.3 + 0.2); d.material.opacity = 0.8 * (1 - y); });
    mon.traverse(o => { if (o.userData.eyes) o.scale.y = (Math.sin(t * 0.8 + S.z) > 0.985) ? 0.1 : 1; });
    if (aura) { aura.userData.ticks.forEach(([o, fn]) => fn(o, t, dt)); aura.children.forEach(c => { if (c.userData && c.userData.orbit) c.children.forEach(m => { const q = m.userData.o; const a = q[0] + t * q[2]; m.position.set(Math.cos(a) * q[1], Math.sin(a * 2) * 0.25, Math.sin(a) * q[1]); m.rotation.y = t; }); }); }
  }
  function frame() {
    if (!running) return; raf = requestAnimationFrame(frame);
    const now = clock(), dt = Math.min(0.05, now - (last || now)); last = now;
    animate(dt); fx.tick(dt); ctl.update();
    if (shake > 0) { shake = Math.max(0, shake - dt); cam.position.x += (Math.random() - 0.5) * shake * 0.3; cam.position.y += (Math.random() - 0.5) * shake * 0.3; }
    renderer.render(scene, cam);
  }
  function start() { if (running) return; running = true; last = 0; frame(); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  return { show, act: act_, start, stop, resize, isUlt: () => ult, dispose() { stop(); clearMon(); renderer.dispose(); host.innerHTML = ''; } };
}

/* ---------- thumbnails ---------- */
let TH = null;
export function thumb(z, info, form) {
  if (!TH) {
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(192, 192, false); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping;
    const st = stage(r); st.scene.remove(st.ground); st.scene.remove(st.gl);
    const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 50); TH = { r, scene: st.scene, cam };
  }
  const m = buildMonster(z, info); const a = applyForm(m, form || 0, false); a.userData.ticks.forEach(([o, fn]) => fn(o, 1.2, 0));
  m.rotation.y = -0.45; TH.scene.add(m);
  const box = new THREE.Box3().setFromObject(m); const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  const d = Math.max(s.y, s.x * 0.9) * 1.55 + 0.6; TH.cam.position.set(c.x + d * 0.38, c.y + d * 0.22, c.z + d * 0.9); TH.cam.lookAt(c.x, c.y - s.y * 0.02, c.z);
  TH.r.render(TH.scene, TH.cam); const url = TH.r.domElement.toDataURL('image/png');
  TH.scene.remove(m); disposeObj(m); return url;
}
