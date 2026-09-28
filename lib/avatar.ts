// Procedural chibi avatars (Xbox-style) built from primitives with Three.js.
// Loaded lazily by the app; one shared WebGL renderer draws every avatar into
// plain 2D canvases, so any number of avatars costs a single GL context.
import * as THREE from 'three';

export type AvatarConfig = {
  skin: string;
  hair: string;
  hairColor: string;
  top: string;
  bottom: string;
  acc: string;
  face: string;
};

export const SKINS = ['#FBD9C0', '#F1C09A', '#DDA078', '#C1845C', '#9C6441', '#6E4530'];
export const HAIR_STYLES: [string, string][] = [
  ['short', 'Short'], ['long', 'Long'], ['curly', 'Curly'], ['bun', 'Bun'],
  ['ponytail', 'Ponytail'], ['buzz', 'Buzz'], ['bald', 'Bald'],
];
export const HAIR_COLORS = ['#1f1a17', '#3b2518', '#6b3e22', '#a0652f', '#d9b36a', '#b8483a', '#e6e2da', '#7a5cc2'];
export const TOP_COLORS = ['#FF6B5B', '#0EA5A0', '#FFC93C', '#8A5FBF', '#FF6F91', '#2B6CB0', '#FFFFFF', '#2B1B33', '#3F8F5C', '#F4A261'];
export const BOTTOM_COLORS = ['#2B3A55', '#1f1a17', '#6b4f3a', '#d8c9a7', '#3F8F5C', '#FFFFFF'];
export const ACCESSORIES: [string, string][] = [
  ['none', 'None'], ['sunglasses', '🕶️ Shades'], ['cap', '🧢 Cap'], ['sunhat', '👒 Sun hat'],
  ['beanie', '🧶 Beanie'], ['headphones', '🎧 Headphones'],
];
export const FACES: [string, string][] = [['none', 'None'], ['mustache', 'Mustache'], ['beard', 'Beard'], ['stubble', 'Stubble']];

export function defaultAvatar(who: string): AvatarConfig {
  return who === 'luis'
    ? { skin: '#DDA078', hair: 'short', hairColor: '#1f1a17', top: '#FF6B5B', bottom: '#2B3A55', acc: 'none', face: 'none' }
    : { skin: '#F1C09A', hair: 'long', hairColor: '#3b2518', top: '#0EA5A0', bottom: '#2B3A55', acc: 'sunglasses', face: 'none' };
}

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
export function randomAvatar(): AvatarConfig {
  return {
    skin: pick(SKINS),
    hair: pick(HAIR_STYLES)[0],
    hairColor: pick(HAIR_COLORS),
    top: pick(TOP_COLORS),
    bottom: pick(BOTTOM_COLORS),
    acc: pick(ACCESSORIES)[0],
    face: Math.random() < 0.7 ? 'none' : pick(FACES)[0],
  };
}

// ---- materials ----
let toonRamp: THREE.DataTexture | null = null;
function ramp() {
  if (!toonRamp) {
    toonRamp = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
    toonRamp.minFilter = THREE.NearestFilter;
    toonRamp.magFilter = THREE.NearestFilter;
    toonRamp.needsUpdate = true;
  }
  return toonRamp;
}
const materials = new Map<string, THREE.Material>();
function toon(color: string, opacity = 1) {
  const key = color + '|' + opacity;
  let m = materials.get(key);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color: new THREE.Color(color), gradientMap: ramp(), transparent: opacity < 1, opacity });
    materials.set(key, m);
  }
  return m;
}
function flat(color: string) {
  const key = 'flat|' + color;
  let m = materials.get(key);
  if (!m) { m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) }); materials.set(key, m); }
  return m;
}
let shadowTexture: THREE.CanvasTexture | null = null;
function shadowMaterial() {
  if (!shadowTexture) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, 'rgba(20,10,30,0.45)');
    grad.addColorStop(1, 'rgba(20,10,30,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    shadowTexture = new THREE.CanvasTexture(c);
  }
  const key = 'shadow';
  let m = materials.get(key);
  if (!m) { m = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }); materials.set(key, m); }
  return m;
}
function shade(hex: string, amount: number) {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, amount);
  return '#' + c.getHexString();
}

// ---- model ----
type Rig = {
  root: THREE.Group;
  body: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  eyes: THREE.Object3D[];
  armL: THREE.Group;
  armR: THREE.Group;
  blinkEvery: number;
  blinkOffset: number;
};

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}
function cap(radius: number, theta: number, mat: THREE.Material) {
  return mesh(new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, theta), mat);
}

function buildArm(side: number, cfg: AvatarConfig) {
  const arm = new THREE.Group();
  arm.position.set(side * 0.47, 1.47, 0);
  arm.add(mesh(new THREE.SphereGeometry(0.165, 16, 12), toon(cfg.top)));
  arm.add(mesh(new THREE.CapsuleGeometry(0.13, 0.12, 6, 12), toon(cfg.top), 0, -0.13, 0));
  arm.add(mesh(new THREE.CapsuleGeometry(0.105, 0.34, 6, 12), toon(cfg.skin), 0, -0.36, 0));
  arm.add(mesh(new THREE.SphereGeometry(0.13, 16, 12), toon(cfg.skin), 0, -0.6, 0.02));
  arm.rotation.z = side * 0.14;
  return arm;
}

function buildHair(cfg: AvatarConfig, head: THREE.Group, covered: boolean) {
  const mat = toon(cfg.hairColor);
  const style = cfg.hair;
  if (style === 'bald') return;
  const capR = covered ? 0.74 : style === 'buzz' ? 0.735 : 0.765;
  const top = cap(capR, Math.PI * (style === 'buzz' ? 0.47 : 0.52), mat);
  top.position.y = 0.04;
  top.rotation.x = -0.28;
  head.add(top);
  if (style === 'long') {
    const back = mesh(new THREE.CapsuleGeometry(0.6, 0.75, 8, 16), mat, 0, -0.5, -0.3);
    back.scale.set(1.15, 1, 0.62);
    head.add(back);
    [-1, 1].forEach(s => head.add(mesh(new THREE.CapsuleGeometry(0.15, 0.6, 6, 12), mat, s * 0.63, -0.42, 0.08)));
  } else if (style === 'curly' && !covered) {
    const n = 46;
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 1.3;
      if (y < -0.05) continue;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = i * 2.39996;
      const p = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(0.74);
      if (p.z > 0.35 && p.y < 0.45) continue; // keep the face clear
      head.add(mesh(new THREE.SphereGeometry(0.19, 12, 10), mat, p.x, p.y + 0.06, p.z - 0.04));
    }
  } else if (style === 'bun' && !covered) {
    head.add(mesh(new THREE.SphereGeometry(0.29, 16, 12), mat, 0, 0.74, -0.28));
  } else if (style === 'ponytail') {
    head.add(mesh(new THREE.SphereGeometry(0.2, 16, 12), mat, 0, 0.2, -0.74));
    const tail = mesh(new THREE.CapsuleGeometry(0.14, 0.55, 6, 12), mat, 0, -0.25, -0.88);
    tail.rotation.x = 0.35;
    head.add(tail);
  }
}

function buildAccessory(cfg: AvatarConfig, head: THREE.Group) {
  const acc = cfg.acc;
  if (acc === 'sunglasses') {
    const lens = toon('#1d1d2b');
    [-1, 1].forEach(s => {
      const l = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 24), lens, s * 0.25, 0.06, 0.69);
      l.rotation.x = Math.PI / 2;
      head.add(l);
      const glint = mesh(new THREE.CircleGeometry(0.035, 12), flat('#ffffff'), s * 0.25 + 0.05, 0.11, 0.715);
      head.add(glint);
      // Runs from the outer edge of the lens back to the ear.
      const temple = mesh(new THREE.BoxGeometry(0.03, 0.03, 0.62), lens, s * 0.55, 0.1, 0.41);
      temple.rotation.y = -s * 0.48;
      head.add(temple);
    });
    head.add(mesh(new THREE.BoxGeometry(0.16, 0.035, 0.035), lens, 0, 0.1, 0.71));
  } else if (acc === 'cap') {
    const color = toon(cfg.top === '#FFFFFF' ? '#e8453c' : cfg.top);
    const crown = cap(0.785, Math.PI * 0.5, color);
    crown.position.y = 0.06;
    crown.rotation.x = -0.18;
    head.add(crown);
    const brim = mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 32, 1, false, 0, Math.PI), color, 0, 0.2, 0.55);
    brim.rotation.y = -Math.PI / 2;
    brim.rotation.x = 0.12;
    head.add(brim);
    head.add(mesh(new THREE.SphereGeometry(0.06, 10, 8), toon(shade(cfg.top, -0.15)), 0, 0.84, -0.05));
  } else if (acc === 'sunhat') {
    const straw = toon('#E9C46A');
    head.add(mesh(new THREE.CylinderGeometry(0.52, 0.66, 0.42, 32), straw, 0, 0.62, -0.04));
    head.add(mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.05, 40), straw, 0, 0.42, -0.04));
    const band = mesh(new THREE.TorusGeometry(0.64, 0.05, 8, 32), toon('#FF6B5B'), 0, 0.46, -0.04);
    band.rotation.x = Math.PI / 2;
    head.add(band);
  } else if (acc === 'beanie') {
    const color = toon(cfg.top === '#FFFFFF' ? '#8A5FBF' : cfg.top);
    const crown = cap(0.8, Math.PI * 0.55, color);
    crown.position.y = 0.04;
    crown.rotation.x = -0.1;
    head.add(crown);
    const fold = mesh(new THREE.TorusGeometry(0.73, 0.09, 10, 32), toon(shade(cfg.top, -0.1)), 0, 0.14, 0.03);
    fold.rotation.x = Math.PI / 2 - 0.1;
    head.add(fold);
    head.add(mesh(new THREE.SphereGeometry(0.15, 12, 10), toon('#FFFFFF'), 0, 0.86, -0.08));
  } else if (acc === 'headphones') {
    const dark = toon('#2B1B33');
    const band = mesh(new THREE.TorusGeometry(0.8, 0.05, 8, 32, Math.PI), dark, 0, 0.02, 0);
    head.add(band);
    [-1, 1].forEach(s => {
      const cup = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 20), toon(cfg.top === '#2B1B33' ? '#FF6B5B' : cfg.top), s * 0.78, 0, 0);
      cup.rotation.z = Math.PI / 2;
      head.add(cup);
    });
  }
}

function buildAvatar(cfg: AvatarConfig): Rig {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const shadow = mesh(new THREE.PlaneGeometry(1.7, 1.7), shadowMaterial(), 0, 0.005, 0);
  shadow.rotation.x = -Math.PI / 2;
  root.add(shadow);

  const skin = toon(cfg.skin);
  const pants = toon(cfg.bottom);
  const shoe = toon(cfg.bottom === '#FFFFFF' ? '#2B1B33' : '#FFFFFF');
  [-1, 1].forEach(s => {
    body.add(mesh(new THREE.CapsuleGeometry(0.17, 0.4, 6, 12), pants, s * 0.2, 0.43, 0));
    const foot = mesh(new THREE.SphereGeometry(0.2, 16, 12), shoe, s * 0.21, 0.1, 0.07);
    foot.scale.set(1, 0.62, 1.4);
    body.add(foot);
  });
  const hips = mesh(new THREE.SphereGeometry(0.4, 20, 14), pants, 0, 0.8, 0);
  hips.scale.set(1, 0.55, 0.82);
  body.add(hips);
  const torso = mesh(new THREE.CapsuleGeometry(0.39, 0.4, 8, 18), toon(cfg.top), 0, 1.16, 0);
  torso.scale.set(1, 1, 0.8);
  body.add(torso);
  body.add(mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 16), skin, 0, 1.68, 0));

  const armL = buildArm(-1, cfg);
  const armR = buildArm(1, cfg);
  body.add(armL, armR);

  const head = new THREE.Group();
  head.position.set(0, 2.28, 0);
  body.add(head);
  const skull = mesh(new THREE.SphereGeometry(0.72, 36, 24), skin);
  skull.scale.set(1, 0.95, 0.95);
  head.add(skull);
  [-1, 1].forEach(s => {
    const ear = mesh(new THREE.SphereGeometry(0.15, 14, 10), skin, s * 0.7, -0.03, 0);
    ear.scale.set(0.55, 1, 1);
    head.add(ear);
  });

  const eyes: THREE.Object3D[] = [];
  const eyeMat = toon('#1f1a17');
  [-1, 1].forEach(s => {
    const eye = new THREE.Group();
    eye.position.set(s * 0.25, 0.05, 0.62);
    const ball = mesh(new THREE.SphereGeometry(0.088, 16, 12), eyeMat);
    ball.scale.set(1, 1.35, 0.6);
    eye.add(ball);
    eye.add(mesh(new THREE.SphereGeometry(0.028, 8, 6), flat('#ffffff'), 0.03, 0.05, 0.05));
    head.add(eye);
    eyes.push(eye);
    const brow = mesh(new THREE.BoxGeometry(0.2, 0.045, 0.05), toon(cfg.hair === 'bald' ? shade(cfg.skin, -0.25) : cfg.hairColor), s * 0.25, 0.27, 0.63);
    brow.rotation.z = -s * 0.08;
    head.add(brow);
    const blush = mesh(new THREE.SphereGeometry(0.1, 12, 8), toon('#ff8f8f', 0.45), s * 0.42, -0.14, 0.53);
    blush.scale.set(1, 0.6, 0.3);
    head.add(blush);
  });
  head.add(mesh(new THREE.SphereGeometry(0.065, 12, 10), toon(shade(cfg.skin, -0.06)), 0, -0.08, 0.7));
  const mouth = mesh(new THREE.TorusGeometry(0.12, 0.026, 8, 18, Math.PI), toon('#7a2e2e'), 0, -0.24, 0.655);
  mouth.rotation.z = Math.PI;
  head.add(mouth);

  if (cfg.face === 'mustache') {
    const m = mesh(new THREE.CapsuleGeometry(0.05, 0.2, 6, 10), toon(cfg.hairColor), 0, -0.155, 0.69);
    m.rotation.z = Math.PI / 2;
    head.add(m);
  } else if (cfg.face === 'beard' || cfg.face === 'stubble') {
    const beard = mesh(
      new THREE.SphereGeometry(0.735, 32, 16, 0, Math.PI, Math.PI * 0.56, Math.PI * 0.34),
      toon(cfg.hairColor, cfg.face === 'stubble' ? 0.35 : 1),
    );
    beard.scale.set(1, 0.95, 0.95);
    head.add(beard);
    if (cfg.face === 'beard') mouth.position.z = 0.7;
  }

  const covered = cfg.acc === 'cap' || cfg.acc === 'beanie' || cfg.acc === 'sunhat';
  buildHair(cfg, head, covered);
  buildAccessory(cfg, head);

  return { root, body, torso, head, eyes, armL, armR, blinkEvery: 3.2 + Math.random() * 2.5, blinkOffset: Math.random() * 3 };
}

function disposeRig(rig: Rig) {
  rig.root.traverse(obj => {
    const m = obj as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
  });
}

type Action = { name: 'wave' | 'celebrate'; start: number; loop: boolean };

function animate(rig: Rig, t: number, action: Action | null) {
  const breath = Math.sin(t * 2.2);
  rig.body.position.y = breath * 0.025;
  rig.torso.scale.y = 1 + breath * 0.012;
  rig.head.rotation.set(Math.sin(t * 0.5) * 0.04, Math.sin(t * 0.6) * 0.18, Math.sin(t * 0.9) * 0.05);
  const blinking = ((t + rig.blinkOffset) % rig.blinkEvery) < 0.13;
  rig.eyes.forEach(e => { e.scale.y = blinking ? 0.12 : 1; });
  rig.armL.rotation.z = -0.14 - breath * 0.02;
  rig.armR.rotation.z = 0.14 + breath * 0.02;
  rig.armL.rotation.x = 0;
  rig.armR.rotation.x = 0;

  if (!action) return;
  const e = t - action.start;
  if (action.name === 'wave') {
    const up = Math.min(1, e * 4) * Math.min(1, Math.max(0, (2.2 - e) * 4));
    rig.armR.rotation.z = 0.14 + up * (2.35 + Math.sin(e * 11) * 0.35);
    rig.head.rotation.z += up * 0.12;
  } else {
    const jump = Math.abs(Math.sin(e * 5.5));
    rig.body.position.y = jump * 0.45;
    rig.armL.rotation.z = -2.6 - Math.sin(e * 11) * 0.2;
    rig.armR.rotation.z = 2.6 + Math.sin(e * 11) * 0.2;
    rig.head.rotation.x = -0.15;
  }
}
function actionDone(action: Action | null, t: number) {
  if (!action || action.loop) return false;
  return t - action.start > (action.name === 'wave' ? 2.2 : 2.8);
}

// ---- rendering ----
const BUF = 768;
let renderer: THREE.WebGLRenderer | null = null;
function getRenderer() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(BUF, BUF, false);
    renderer.setClearColor(0x000000, 0);
    renderer.setScissorTest(true);
  }
  return renderer;
}

export type Framing = 'full' | 'bust' | 'face';
function makeScene(framing: Framing) {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a5fbf, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(3, 6, 5);
  scene.add(sun);
  const camera = new THREE.PerspectiveCamera(framing === 'full' ? 28 : framing === 'bust' ? 26 : 24, 1, 0.1, 50);
  if (framing === 'full') { camera.position.set(0, 1.75, 8.6); camera.lookAt(0, 1.6, 0); }
  else if (framing === 'bust') { camera.position.set(0, 2.15, 4.9); camera.lookAt(0, 1.95, 0); }
  else { camera.position.set(0, 2.3, 3.5); camera.lookAt(0, 2.22, 0); }
  return { scene, camera };
}

function renderInto(scene: THREE.Scene, camera: THREE.PerspectiveCamera, w: number, h: number) {
  const r = getRenderer();
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  r.setViewport(0, 0, w, h);
  r.setScissor(0, 0, w, h);
  r.clear();
  r.render(scene, camera);
  return r.domElement;
}

type View = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rig: Rig;
  cfgKey: string;
  yaw: number;
  baseYaw: number;
  dragYaw: number;
  lastTouch: number;
  action: Action | null;
};
const views = new Set<View>();
let rafId = 0;
const clock = new THREE.Clock();

function frame() {
  rafId = 0;
  const t = clock.getElapsedTime();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  views.forEach(view => {
    if (!view.canvas.isConnected) {
      disposeRig(view.rig);
      views.delete(view);
      return;
    }
    const cssW = view.canvas.clientWidth, cssH = view.canvas.clientHeight;
    if (!cssW || !cssH) return;
    const scale = Math.min(dpr, BUF / Math.max(cssW, cssH));
    const w = Math.round(cssW * scale), h = Math.round(cssH * scale);
    if (view.canvas.width !== w || view.canvas.height !== h) { view.canvas.width = w; view.canvas.height = h; }
    if (actionDone(view.action, t)) view.action = null;
    animate(view.rig, t, view.action);
    // Drag spins the avatar; it eases back to its resting pose after a moment.
    if (t - view.lastTouch > 1.5) view.dragYaw *= 0.93;
    view.yaw += (view.baseYaw + view.dragYaw - view.yaw) * 0.18;
    view.rig.root.rotation.y = view.yaw;
    const src = renderInto(view.scene, view.camera, w, h);
    view.ctx.clearRect(0, 0, w, h);
    view.ctx.drawImage(src, 0, BUF - h, w, h, 0, 0, w, h);
  });
  if (views.size) rafId = requestAnimationFrame(frame);
}
function kick() { if (!rafId && views.size) rafId = requestAnimationFrame(frame); }

export type AvatarHandle = {
  setConfig: (cfg: AvatarConfig) => void;
  play: (name: 'wave' | 'celebrate', loop?: boolean) => void;
};

export function mountAvatar(
  canvas: HTMLCanvasElement,
  cfg: AvatarConfig,
  opts: { framing?: Framing; baseYaw?: number; action?: 'wave' | 'celebrate'; loop?: boolean; interactive?: boolean } = {},
): AvatarHandle {
  const ctx = canvas.getContext('2d')!;
  const { scene, camera } = makeScene(opts.framing || 'full');
  const rig = buildAvatar(cfg);
  scene.add(rig.root);
  const view: View = {
    canvas, ctx, scene, camera, rig, cfgKey: JSON.stringify(cfg),
    yaw: opts.baseYaw || 0, baseYaw: opts.baseYaw || 0, dragYaw: 0, lastTouch: -10,
    action: opts.action ? { name: opts.action, start: clock.getElapsedTime() + 0.3, loop: !!opts.loop } : null,
  };
  views.add(view);

  if (opts.interactive !== false) {
    let startX = 0, lastX = 0, moved = 0, active = false;
    canvas.style.touchAction = 'pan-y';
    canvas.addEventListener('pointerdown', e => {
      active = true; startX = lastX = e.clientX; moved = 0;
      view.lastTouch = clock.getElapsedTime();
    });
    canvas.addEventListener('pointermove', e => {
      if (!active) return;
      view.dragYaw += (e.clientX - lastX) * 0.02;
      moved = Math.max(moved, Math.abs(e.clientX - startX));
      lastX = e.clientX;
      view.lastTouch = clock.getElapsedTime();
    });
    const end = () => {
      if (!active) return;
      active = false;
      if (moved < 6) view.action = { name: 'wave', start: clock.getElapsedTime(), loop: false };
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', () => { active = false; });
  }
  kick();

  return {
    setConfig(next) {
      const key = JSON.stringify(next);
      if (key === view.cfgKey) return;
      scene.remove(view.rig.root);
      disposeRig(view.rig);
      view.rig = buildAvatar(next);
      scene.add(view.rig.root);
      view.cfgKey = key;
      kick();
    },
    play(name, loop = false) {
      view.action = { name, start: clock.getElapsedTime(), loop };
      kick();
    },
  };
}

const thumbCache = new Map<string, string>();
// A still headshot as a data URL, for small spots (buttons, feed, map pins).
export function avatarThumb(cfg: AvatarConfig, size = 160): string {
  const key = JSON.stringify(cfg) + '|' + size;
  const cached = thumbCache.get(key);
  if (cached) return cached;
  const { scene, camera } = makeScene('face');
  const rig = buildAvatar(cfg);
  rig.root.rotation.y = 0.18;
  scene.add(rig.root);
  animate(rig, 0.4, null);
  rig.eyes.forEach(e => { e.scale.y = 1; });
  const src = renderInto(scene, camera, size, size);
  const out = document.createElement('canvas');
  out.width = out.height = size;
  out.getContext('2d')!.drawImage(src, 0, BUF - size, size, size, 0, 0, size, size);
  disposeRig(rig);
  const url = out.toDataURL('image/png');
  thumbCache.set(key, url);
  return url;
}
