import * as THREE from 'three';
import { createPages, PAGE_W, PAGE_H } from './pages.js';

// ─── Tuning ──────────────────────────────────────────────────────────────────
// Coordinates: the spine is the y axis at x = 0. An unturned sheet spans
// x ∈ [0, 1] (right page); a turned sheet is rotated π around the spine and
// spans x ∈ [-1, 0] (left page). Progress 0 = right, 1 = left.

const SHEET_ASPECT = 1.377;
const HALF_HEIGHT = SHEET_ASPECT / 2;

const CURL = {
  angleMaxDeg: 45, // how far the fold line tilts toward the grabbed corner
  arc: 0.88, // how much of a half turn the page bends through mid-flip
  arcJitter: 0.2,
  angleJitter: 0.3,
  tiltJitterDeg: 6,
  cornerRollMax: 2.3, // caps the bend so corners don't roll into a tube
  directionSmoothTime: 0.4,
  curveSmoothTime: 0.5,
  settleEpsilon: 1e-4,
};
const HOVER = { progress: 0.03, smoothTime: 2, gapToSheetAbove: 0.1 };
const HOLD = {
  startTime: 0.22, firstFlipTime: 1.2, fastestFlipTime: 0.5, speedUpSheets: 20,
  firstGapShare: 0.15, fastestGapShare: 0.05, moveSlopPx: 40,
};
const DRAG = {
  turnFraction: 0.8, progressSmoothTime: 0.9, fallTime: 1, fallTimeExponent: 0.5,
  landingSpeed: 0.5, commitProgress: 0.2, clickSlopPx: 5,
};
const FLIP_TIME = 0.85;
const FOLLOW_ARC_GAIN = [1, 1.08];
const INITIAL_TURNED = 0;

// Portrait screens show one page at a time: every page gets its own
// single-sided sheet. A turned sheet first turns over to the left like on
// desktop, then rolls back round the spine and tucks in behind the magazine,
// leaving a rounded roll of paper visible along the left edge.
// Must match the media query in the page's CSS.
const SINGLE_QUERY = '(max-aspect-ratio: 1/1)';
const SINGLE = matchMedia(SINGLE_QUERY).matches;
const FOLD_BACK = {
  turnShare: 0.5, // share of a turn spent turning over; the rest rolls it back
  rollStart: 0.025, // flat stretch left of the spine before the roll
  rollRadius: 0.05, // roll of the sheet folded most recently (innermost)
  rollRadiusPerSheet: 0.004, // earlier sheets wrap round the outside of later ones
  tuckDrop: 0.07, // tucked sheets slope down behind, so their bottom edges peek out
  tuckDropPerSheet: 0.01, // ...fanning a little further for earlier sheets
  cameraLift: 0.32, // camera height above the page centre, for a slight top-down view
  margin: 1.12,
};

// ─── Shaders ─────────────────────────────────────────────────────────────────

const SHARED_GLSL = /* glsl */ `
  const float SHEET_ASPECT = ${SHEET_ASPECT.toFixed(3)};
  const float NORMAL_EPSILON = 0.03;
  const float DEFORM = 0.13;
  const float DEFORM_SCALE = 1.2;
  const float PATTERN_SIZE = 1.46;
  const float TEXTURE_COLOR = 0.17;
  const float PATTERN_ROUGHNESS = 0.33;
  const float PAPER_TRANSPARENCY = 0.04;
  const float INK_GLOSS = 0.33;
  const float SHADOW_OFFSET_X = 0.004;
`;

const SHEET_VERTEX_GLSL = /* glsl */ `
  ${SHARED_GLSL}
  uniform float uFlipProgress;
  uniform float uWrinkleSide;   // flips wrinkle relief as the sheet turns over
  uniform float uBendAngle;     // total angle the curled part wraps through
  uniform vec2  uFold;          // (cos, sin) of the fold-line tilt
  uniform vec2  uCurl;          // (curl start, curl length) along the fold axis
  uniform vec2  uFlipRotation;  // (cos, sin) of rotation around the spine
  uniform float uDirection;     // +1 turning forward, -1 turning back
  uniform float uStackLift;     // per-sheet height in the stack
  uniform float uRestLift;      // scales the resting profile (0 once folded behind)
  uniform float uArcClamp;      // 1: bend only over uCurl.y, then carry on straight
  uniform float uTuck;          // downward slope of the part past the roll
  varying vec2 vGrainUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float valueNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p), b = smoothstep(0.0, 1.0, f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), b.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), b.x), b.y);
  }
  float paperNoise(vec2 uv) {
    vec2 p = vec2(uv.x, (uv.y - 0.5) * SHEET_ASPECT) / DEFORM_SCALE + vec2(615.0, 357.0);
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * valueNoise(p); a *= 0.5; p *= 2.0; }
    return v;
  }

  // Resting profile of a page lying open: rises off the spine, dips, then
  // lifts slightly at the outer edge.
  float restingLift(float x) {
    if (x <= 0.14) return 0.04 * sin(x / 0.14 * 1.5707963);
    if (x <= 0.58) return mix(0.04, 0.035, smoothstep(0.14, 0.58, x));
    if (x <= 0.72) return mix(0.035, 0.04, smoothstep(0.58, 0.72, x));
    return mix(0.04, 0.03, 1.0 - cos((x - 0.72) / 0.28 * 1.5707963));
  }

  vec3 sheetPosition(vec2 uv) {
    vec2 flatPos = vec2(uv.x, (uv.y - 0.5) * SHEET_ASPECT);

    float n = paperNoise(uv);
    float wrinkle = (mix(n, 1.0 - n, uFlipProgress) - 0.5)
      * smoothstep(0.0, 0.35, uv.x) * DEFORM * uStackLift;

    // Into fold space: u runs perpendicular to the (tilted) fold line.
    float u =  flatPos.x * uFold.x + flatPos.y * uFold.y;
    float v = -flatPos.x * uFold.y + flatPos.y * uFold.x;

    // Everything past the curl start wraps around a cylinder.
    float beyond = max(0.0, u - uCurl.x);
    // With uArcClamp, only the first uCurl.y wraps (a roll); the rest leaves
    // the cylinder along its tangent.
    float arc = mix(beyond, min(beyond, uCurl.y), uArcClamp);
    float straight = beyond - arc;
    float a = arc / uCurl.y * uBendAngle;
    float sinc = abs(a) < 1e-4 ? 1.0 : sin(a) / a;
    float versine = abs(a) < 1e-4 ? 0.0 : (1.0 - cos(a)) / a;
    float curledU = u - beyond + arc * sinc + straight * cos(a);
    float curledZ = -uDirection * (arc * versine + straight * sin(a));

    vec2 p = vec2(curledU * uFold.x - v * uFold.y, curledU * uFold.y + v * uFold.x);

    // Rotate around the spine.
    vec3 pos = vec3(p.x * uFlipRotation.x - curledZ * uFlipRotation.y,
                    p.y,
                    p.x * uFlipRotation.y + curledZ * uFlipRotation.x);
    pos.z += restingLift(uv.x) * uRestLift + uWrinkleSide * wrinkle;
    pos.y -= uTuck * straight;
    return pos;
  }
`;

function createSheetMaterial(uniforms) {
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide, metalness: 0.17, roughness: 0.5,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = SHEET_VERTEX_GLSL + shader.vertexShader
      .replace('#include <beginnormal_vertex>', /* glsl */ `
        #include <beginnormal_vertex>
        vec2 du = vec2(NORMAL_EPSILON, NORMAL_EPSILON / SHEET_ASPECT);
        vec3 sheetP = sheetPosition(uv);
        objectNormal = normalize(cross(
          sheetPosition(uv + vec2(du.x, 0.0)) - sheetP,
          sheetPosition(uv + vec2(0.0, du.y)) - sheetP));
      `)
      .replace('#include <begin_vertex>', 'vec3 transformed = sheetP; vGrainUv = uv;');

    shader.fragmentShader = SHARED_GLSL + /* glsl */ `
      uniform sampler2D uBackMap;
      uniform sampler2D uPatternTex;
      varying vec2 vGrainUv;
    ` + shader.fragmentShader
      .replace('#include <normal_fragment_begin>', /* glsl */ `
        #include <normal_fragment_begin>
        // Wrinkled normals can disagree with gl_FrontFacing; always face the camera.
        normal *= normal.z >= 0.0 ? 1.0 : -1.0;
      `)
      .replace('#include <map_fragment>', /* glsl */ `
        vec4 frontColor = texture2D(map, vMapUv);
        vec4 backColor = texture2D(uBackMap, vec2(1.0 - vMapUv.x, vMapUv.y));
        vec4 faceColor = gl_FrontFacing ? frontColor : backColor;
        vec4 otherColor = gl_FrontFacing ? backColor : frontColor;
        // A hint of the other side's ink showing through the paper.
        diffuseColor *= vec4(faceColor.rgb * mix(vec3(1.0), otherColor.rgb, PAPER_TRANSPARENCY), 1.0);
        float inkAmount = 1.0 - dot(faceColor.rgb, vec3(0.299, 0.587, 0.114));
      `)
      .replace('#include <roughnessmap_fragment>', /* glsl */ `
        #include <roughnessmap_fragment>
        roughnessFactor *= 1.0 - inkAmount * INK_GLOSS;
        float pattern = texture2D(uPatternTex, vGrainUv * PATTERN_SIZE * vec2(1.0, SHEET_ASPECT)).r;
        pattern = 2.0 * pow(pattern, 7.0);
        roughnessFactor = clamp(mix(roughnessFactor, 1.0, clamp(pattern * PATTERN_ROUGHNESS, 0.0, 1.0)), 0.0, 1.0);
      `)
      .replace('#include <opaque_fragment>', /* glsl */ `
        #include <opaque_fragment>
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0), pattern * TEXTURE_COLOR);
      `);
  };
  return material;
}

function createSheetDepthMaterial(uniforms) {
  const material = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = SHEET_VERTEX_GLSL + shader.vertexShader.replace(
      '#include <begin_vertex>',
      'vec3 transformed = sheetPosition(uv) - vec3(SHADOW_OFFSET_X, 0.0, 0.0);',
    );
  };
  return material;
}

// Sparse bright specks; the shader raises this to the 7th power so only the
// brightest pixels read as paper fibres.
function createGrainTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(0, 0, size, size);
  ctx.lineCap = 'round';
  for (let i = 0; i < size * 1.5; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const a = Math.random() * Math.PI, len = 1 + Math.random() * 5;
    const v = 190 + Math.random() * 65;
    ctx.strokeStyle = `rgb(${v},${v},${v})`;
    ctx.lineWidth = 0.6 + Math.random() * 0.8;
    // Draw wrapped copies so the texture tiles seamlessly.
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) {
      ctx.beginPath();
      ctx.moveTo(x + ox, y + oy);
      ctx.lineTo(x + ox + Math.cos(a) * len, y + oy + Math.sin(a) * len);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ─── Scene ───────────────────────────────────────────────────────────────────

const container = document.getElementById('magazine');
const pageCanvases = await createPages();
const sheetCount = SINGLE ? pageCanvases.length : Math.ceil(pageCanvases.length / 2);
// Single-page mode never folds the last sheet away, or nothing would be left.
const maxTurned = SINGLE ? sheetCount - 1 : sheetCount;
// Page lying open on the right.
const pageOnRight = () => (SINGLE ? turned : 2 * turned);

// Plain paper for the backs of single-sided sheets.
function blankPage() {
  const blank = document.createElement('canvas');
  blank.width = PAGE_W;
  blank.height = PAGE_H;
  const ctx = blank.getContext('2d');
  ctx.fillStyle = '#f4ede3';
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  return blank;
}

const scene = new THREE.Scene();
// Closer camera so the book fills more of the frame; near plane pulled in so a
// sheet standing upright mid-flip (z ≈ 1) isn't clipped.
const camera = new THREE.PerspectiveCamera(40, 1.44753, 0.5, 4.5);
camera.position.set(0, 0, 2.45);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
container.appendChild(renderer.domElement);
const canvas = renderer.domElement;

scene.add(new THREE.HemisphereLight('#ffffff', '#a1aeaf', 1.5));
const sun = new THREE.DirectionalLight('#ffffff', 2);
sun.position.set(-3.5, 1.3, 4.1);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -0.8, right: 1, top: 0.85, bottom: -1.05, near: 1.5, far: 6.6 });
sun.shadow.bias = -0.001;
scene.add(sun, sun.target);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(6.25, 6.25), new THREE.ShadowMaterial({ opacity: 0.15 }));
ground.position.z = -1e-5;
ground.receiveShadow = true;
// Folded-back sheets pass below the table, so single-page mode floats the book.
if (!SINGLE) scene.add(ground);

const anisotropy = renderer.capabilities.getMaxAnisotropy();
const grain = createGrainTexture();
grain.anisotropy = anisotropy;

const videoPages = [];
function pageTexture(i) {
  const tex = new THREE.CanvasTexture(pageCanvases[i]);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  const { video, redraw } = pageCanvases[i];
  if (video) videoPages.push({ index: i, video, redraw, tex, lastTime: -1 });
  return tex;
}

// Video pages play only while on the open spread or one sheet either side
// (so they're already moving mid-flip); the rest pause to save decoding.
function updateVideos() {
  const right = pageOnRight();
  const [from, to] = SINGLE ? [right - 1, right + 1] : [right - 3, right + 2];
  for (const page of videoPages) {
    const { video } = page;
    const near = page.index >= from && page.index <= to;
    if (near && video.paused) video.play().catch(() => {});
    else if (!near && !video.paused) video.pause();
    if (near && video.readyState >= 2 && video.currentTime !== page.lastTime) {
      page.lastTime = video.currentTime;
      page.redraw();
      page.tex.needsUpdate = true;
    }
  }
}

// Vertex positions are derived from uv in the shader, so the plane's own
// positions only matter for bounds.
const sheetGeometry = new THREE.PlaneGeometry(1, SHEET_ASPECT, 64, 88);
sheetGeometry.translate(0.5, 0, 0);

// Stack height: the top sheet of whichever pile a sheet is on sits highest.
function stackLift(index, progress) {
  const t = sheetCount > 1 ? (index + (sheetCount - 1 - 2 * index) * (1 - progress)) / (sheetCount - 1) : 1;
  return 0.31 + 0.69 * t;
}

let turned = INITIAL_TURNED; // sheets currently on the left (or folded behind)
const blankBack = SINGLE ? new THREE.CanvasTexture(blankPage()) : null;
if (blankBack) blankBack.colorSpace = THREE.SRGBColorSpace;
const sheets = [];
for (let i = 0; i < sheetCount; i++) {
  const uniforms = {
    uDirection: { value: 1 },
    uStackLift: { value: 1 },
    uRestLift: { value: 1 },
    uArcClamp: { value: 0 },
    uTuck: { value: 0 },
    uFlipProgress: { value: 0 },
    uWrinkleSide: { value: -1 },
    uBendAngle: { value: 0 },
    uFold: { value: new THREE.Vector2(1, 0) },
    uCurl: { value: new THREE.Vector2(0, 1) },
    uFlipRotation: { value: new THREE.Vector2(1, 0) },
    uPatternTex: { value: grain },
    uBackMap: { value: SINGLE ? blankBack : pageTexture(2 * i + 1) },
  };
  const material = createSheetMaterial(uniforms);
  material.map = pageTexture(SINGLE ? i : 2 * i);
  const mesh = new THREE.Mesh(sheetGeometry, material);
  mesh.customDepthMaterial = createSheetDepthMaterial(uniforms);
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);
  sheets.push({
    mesh, uniforms,
    flipProgress: i < turned ? 1 : 0,
    direction: 1,
    directionSmooth: 1,
    curve: { curlArc: 0, curlAngleDeg: 0 },
    curveTarget: { curlArc: 0, curlAngleDeg: 0 },
    wobble: { arc: 0.5, angle: 0.5, tilt: 0 },
    liftBase: stackLift(i, 0),
    liftSpan: stackLift(i, 1) - stackLift(i, 0),
    // Later sheets roll up inside earlier ones, closest to the page in front.
    rollRadius: FOLD_BACK.rollRadius + FOLD_BACK.rollRadiusPerSheet * (sheetCount - 1 - i),
    tuckDrop: FOLD_BACK.tuckDrop + FOLD_BACK.tuckDropPerSheet * (sheetCount - 1 - i),
  });
}

// ─── Curl from pointer ───────────────────────────────────────────────────────

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const tablePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const hit = new THREE.Vector3();

function pointerOnTable(x, y) {
  const rect = canvas.getBoundingClientRect();
  ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  if (!raycaster.ray.intersectPlane(tablePlane, hit)) return null;
  return { angle: Math.atan2(hit.y, hit.x), distanceFromSpine: Math.hypot(hit.x, hit.y) };
}

// Largest arc that keeps the far corner from rolling past `cornerRollMax`.
function maxCurlArc(angleDeg) {
  const a = (Math.abs(angleDeg) * Math.PI) / 180;
  const curlLength = 1 - HALF_HEIGHT * Math.sin(a);
  return CURL.cornerRollMax / (Math.PI * (Math.cos(a) / curlLength));
}

let lastFlipped = -1;
const animations = []; // { sheetIndex, fromProgress, toProgress, direction, startTime, duration, launch? }
const isAnimating = (i) => animations.some((a) => a.sheetIndex === i);

// Grab a page near a corner and the fold tilts toward it; grab near the
// spine and it barely tilts.
function curveFromPointer(x, y, sheetIndex) {
  const { wobble } = sheets[sheetIndex];
  const p = pointerOnTable(x, y);
  let angleDeg = 0;
  if (p) {
    let deg = (p.angle * 180) / Math.PI;
    if (deg > 90) deg = 180 - deg;
    if (deg < -90) deg = -180 - deg;
    angleDeg = THREE.MathUtils.clamp(
      -(deg / 90) * CURL.angleMaxDeg * p.distanceFromSpine * (1 - wobble.angle * CURL.angleJitter)
        + wobble.tilt * CURL.tiltJitterDeg,
      -CURL.angleMaxDeg, CURL.angleMaxDeg,
    );
  }

  // If the previous sheet is still mid-flip, follow its shape so the two
  // don't cross.
  const leader = sheets[lastFlipped];
  const leaderBeforeHalf = leader && lastFlipped !== sheetIndex && isAnimating(lastFlipped)
    && (leader.direction > 0 ? leader.flipProgress <= 0.5 : leader.flipProgress >= 0.5);
  if (!leaderBeforeHalf) {
    return { curlArc: Math.min(CURL.arc * (1 - wobble.arc * CURL.arcJitter), maxCurlArc(angleDeg)), curlAngleDeg: angleDeg };
  }
  const lead = leader.curveTarget;
  angleDeg = THREE.MathUtils.clamp(angleDeg, Math.min(0, lead.curlAngleDeg), Math.max(0, lead.curlAngleDeg));
  const gain = THREE.MathUtils.lerp(FOLLOW_ARC_GAIN[0], FOLLOW_ARC_GAIN[1], wobble.arc);
  return {
    curlArc: THREE.MathUtils.clamp(lead.curlArc * gain, lead.curlArc, maxCurlArc(angleDeg)),
    curlAngleDeg: angleDeg,
  };
}

function setCurve(sheet, curve, immediate) {
  Object.assign(sheet.curveTarget, curve);
  if (immediate) Object.assign(sheet.curve, curve);
}

// ─── Flipping ────────────────────────────────────────────────────────────────

function cancelAnimation(i) {
  const idx = animations.findIndex((a) => a.sheetIndex === i);
  if (idx !== -1) animations.splice(idx, 1);
}

function beginTurn(sheetIndex, toProgress) {
  lastFlipped = sheetIndex;
  sheets[sheetIndex].wobble = { arc: Math.random(), angle: Math.random(), tilt: 2 * Math.random() - 1 };
  turned = toProgress === 1 ? sheetIndex + 1 : sheetIndex;
  updateHud();
}

function flip(sheetIndex, forward, toProgress, flipTime = FLIP_TIME) {
  beginTurn(sheetIndex, toProgress);
  const from = sheets[sheetIndex].flipProgress;
  cancelAnimation(sheetIndex);
  animations.push({
    sheetIndex, fromProgress: from, toProgress, direction: forward ? 1 : -1,
    startTime: performance.now(),
    duration: 1000 * flipTime * Math.max(0.2, Math.abs(toProgress - from)),
  });
}

function flipNext(forward, flipTime = FLIP_TIME, x, y) {
  if (forward ? turned >= maxTurned : turned <= 0) return false;
  const i = forward ? turned : turned - 1;
  setCurve(sheets[i], x === undefined ? sheets[i].curveTarget : curveFromPointer(x, y, i), true);
  sheets[i].direction = forward ? 1 : -1;
  flip(i, forward, forward ? 1 : 0, flipTime);
  return true;
}

// Cosine ease for clicks; a Hermite curve for drag releases so the page keeps
// the velocity it was thrown with and lands softly.
function animationProgress(anim, now) {
  const t = THREE.MathUtils.clamp((now - anim.startTime) / anim.duration, 0, 1);
  let e;
  if (anim.launch === undefined) {
    e = 0.5 * (1 - Math.cos(t * Math.PI));
  } else {
    const t2 = t * t, t3 = t2 * t;
    e = (t3 - 2 * t2 + t) * anim.launch + (3 * t2 - 2 * t3) + (t3 - t2) * DRAG.landingSpeed;
  }
  return anim.fromProgress + (anim.toProgress - anim.fromProgress) * e;
}

// ─── Input ───────────────────────────────────────────────────────────────────

let pointer = null; // last hover position
let downAt = null;
let drag = null;
let hold = null;

const movedPast = (e, slop) => downAt && (e.clientX - downAt.x) ** 2 + (e.clientY - downAt.y) ** 2 > slop * slop;

// A link drawn on the open spread (e.g. the Give Now pill), only while every
// sheet is at rest so the flat-page mapping holds.
function linkAt(x, y) {
  if (drag || animations.length || !pointerOnTable(x, y)) return null;
  const right = hit.x >= 0;
  if (SINGLE && !right) return null;
  const page = right ? pageOnRight() : 2 * turned - 1;
  const links = pageCanvases[page]?.links;
  if (!links?.length) return null;
  const px = (right ? hit.x : 1 + hit.x) * PAGE_W;
  const py = ((HALF_HEIGHT - hit.y) / SHEET_ASPECT) * PAGE_H;
  return links.find(({ rect: [lx, ly, lw, lh] }) => px >= lx && px <= lx + lw && py >= ly && py <= ly + lh) ?? null;
}
let pressedLink = null;

function sideAt(clientX) {
  const rect = canvas.getBoundingClientRect();
  const forward = clientX - rect.left >= rect.width / 2;
  if (forward ? turned >= maxTurned : turned <= 0) return null;
  return { sheetIndex: forward ? turned : turned - 1, forward };
}

function stopHold() {
  if (hold) clearTimeout(hold.timer);
  hold = null;
}

// Press and hold: pages keep turning, faster and faster.
function holdTick() {
  if (!hold) return;
  if (!hold.fired) {
    hold.fired = true;
    drag = null;
  }
  const ramp = (a, b) => a + (b - a) * Math.min(hold.count / HOLD.speedUpSheets, 1);
  const flipTime = ramp(HOLD.firstFlipTime, HOLD.fastestFlipTime);
  const gap = flipTime * ramp(HOLD.firstGapShare, HOLD.fastestGapShare);
  const flipped = hold.count === 0
    ? flipNext(hold.forward, flipTime)
    : flipNext(hold.forward, flipTime, hold.x, hold.y);
  if (!flipped) {
    stopHold();
    return;
  }
  hold.count++;
  hold.timer = setTimeout(holdTick, 1000 * gap);
}


canvas.addEventListener('pointermove', (e) => {
  if (hold && movedPast(e, hold.fired ? HOLD.moveSlopPx : DRAG.clickSlopPx)) stopHold();
  if (drag) {
    drag.progress = THREE.MathUtils.clamp(
      drag.base - (e.clientX - downAt.x) / drag.rectWidth / DRAG.turnFraction, 0, 1);
    drag.targetCurve = curveFromPointer(e.clientX, e.clientY, drag.sheetIndex);
    if (hold) { hold.x = e.clientX; hold.y = e.clientY; }
    return;
  }
  pointer = { x: e.clientX, y: e.clientY };
  canvas.style.cursor = linkAt(e.clientX, e.clientY) ? 'pointer' : '';
});

canvas.addEventListener('pointerleave', () => { pointer = null; });

canvas.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  pressedLink = linkAt(e.clientX, e.clientY);
  if (pressedLink) {
    downAt = { x: e.clientX, y: e.clientY };
    return;
  }
  const side = sideAt(e.clientX);
  if (!side) return;
  const sheet = sheets[side.sheetIndex];
  if (!isAnimating(side.sheetIndex)) setCurve(sheet, curveFromPointer(e.clientX, e.clientY, side.sheetIndex), true);
  cancelAnimation(side.sheetIndex);
  downAt = { x: e.clientX, y: e.clientY };
  drag = {
    ...side,
    base: sheet.flipProgress,
    progress: sheet.flipProgress,
    rectWidth: canvas.getBoundingClientRect().width,
    targetCurve: { ...sheet.curveTarget },
    speed: 0,
  };
  sheet.direction = side.forward ? 1 : -1;
  stopHold();
  hold = { forward: side.forward, x: e.clientX, y: e.clientY, count: 0, fired: false, timer: setTimeout(holdTick, 1000 * HOLD.startTime) };
  canvas.setPointerCapture(e.pointerId);
});

function onPointerUp(e) {
  stopHold();
  if (pressedLink) {
    if (e.type === 'pointerup' && !movedPast(e, DRAG.clickSlopPx)) window.open(pressedLink.href, '_blank', 'noopener');
    pressedLink = null;
  }
  if (!drag) { downAt = null; return; }
  const d = drag;
  const moved = movedPast(e, DRAG.clickSlopPx);
  drag = null;
  downAt = null;
  try { canvas.releasePointerCapture(e.pointerId); } catch {}

  if (!moved) {
    flip(d.sheetIndex, d.forward, d.forward ? 1 : 0);
    return;
  }

  // Released mid-drag: commit if pulled far enough, otherwise fall back.
  const pulled = (d.forward ? d.progress - d.base : d.base - d.progress) >= DRAG.commitProgress;
  const to = d.forward === pulled ? 1 : 0;
  beginTurn(d.sheetIndex, to);
  const from = sheets[d.sheetIndex].flipProgress;
  const distance = Math.max(Math.abs(to - from), 0.001);
  const duration = DRAG.fallTime * Math.pow(distance, DRAG.fallTimeExponent);
  const speed = to === 1 ? d.speed : -d.speed;
  cancelAnimation(d.sheetIndex);
  animations.push({
    sheetIndex: d.sheetIndex, fromProgress: from, toProgress: to,
    direction: d.forward ? 1 : -1, startTime: performance.now(), duration: 1000 * duration,
    launch: THREE.MathUtils.clamp((speed * duration) / distance, 0, 2),
  });
}
canvas.addEventListener('pointerup', onPointerUp);
canvas.addEventListener('pointercancel', onPointerUp);

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') flipNext(true);
  if (e.key === 'ArrowLeft') flipNext(false);
});

// ─── Frame loop ──────────────────────────────────────────────────────────────

// Single-page mode, second half of a turn: the sheet lies on the left and
// rolls back round the spine into place behind the magazine.
function applyRollBack(sheet, roll) {
  const u = sheet.uniforms;
  u.uFlipProgress.value = 1;
  u.uWrinkleSide.value = 1 - roll; // flatten so tucked-away sheets stay behind
  u.uDirection.value = -1; // curl away from the camera
  u.uStackLift.value = sheet.liftBase + sheet.liftSpan;
  u.uRestLift.value = 0;
  u.uArcClamp.value = 1;
  u.uTuck.value = roll * sheet.tuckDrop;
  u.uBendAngle.value = Math.PI * (0.5 - 0.5 * Math.cos(roll * Math.PI));
  u.uFold.value.set(1, 0);
  u.uCurl.value.set(FOLD_BACK.rollStart, Math.PI * sheet.rollRadius);
  u.uFlipRotation.value.set(-1, 0);
}

function applyUniforms(sheet) {
  const u = sheet.uniforms;
  const { curve, directionSmooth } = sheet;
  let { flipProgress } = sheet;
  if (SINGLE) {
    if (flipProgress > FOLD_BACK.turnShare) {
      applyRollBack(sheet, (flipProgress - FOLD_BACK.turnShare) / (1 - FOLD_BACK.turnShare));
      return;
    }
    flipProgress /= FOLD_BACK.turnShare;
    u.uArcClamp.value = 0;
    u.uTuck.value = 0;
  }
  const baseAngle = flipProgress * Math.PI;
  const bend = Math.sin(baseAngle) * Math.PI * curve.curlArc;
  const fold = (curve.curlAngleDeg * Math.PI) / 180;
  const cosF = Math.cos(fold), sinF = Math.sin(fold);
  const curlLength = 1 - HALF_HEIGHT * Math.sin(Math.abs(fold));
  const curlStart = 1 - curlLength;
  // Lean the whole sheet back by half the angle its curled tip sweeps, so the
  // curl reads as the page bending rather than the spine twisting.
  const tipReach = Math.max(0, cosF + sinF * HALF_HEIGHT * Math.sign(sinF) - curlStart);
  const tipAngle = (tipReach / curlLength) * bend;
  const rotation = baseAngle + 0.5 * directionSmooth
    * (tipReach * (Math.abs(tipAngle) < 1e-4 ? 0 : (1 - Math.cos(tipAngle)) / tipAngle));

  u.uFlipProgress.value = flipProgress;
  u.uWrinkleSide.value = -Math.cos(baseAngle);
  u.uDirection.value = directionSmooth;
  u.uStackLift.value = sheet.liftBase + sheet.liftSpan * flipProgress;
  // Single-page mode lays the sheet flat on the left before it rolls back.
  u.uRestLift.value = u.uStackLift.value * (SINGLE ? Math.cos(baseAngle / 2) : 1);
  u.uBendAngle.value = bend;
  u.uFold.value.set(cosF, sinF);
  u.uCurl.value.set(curlStart, curlLength);
  u.uFlipRotation.value.set(Math.cos(rotation), Math.sin(rotation));
}

let lastTime = 0;
function frame(now) {
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60;
  lastTime = now;
  updateVideos();
  const ease = (smoothTime, floor = 0.001) => 1 - Math.pow(floor, dt / smoothTime);

  for (let k = animations.length - 1; k >= 0; k--) {
    const anim = animations[k];
    const sheet = sheets[anim.sheetIndex];
    sheet.flipProgress = animationProgress(anim, now);
    sheet.direction = anim.direction;
    if (now >= anim.startTime + anim.duration) animations.splice(k, 1);
  }

  if (drag) {
    const sheet = sheets[drag.sheetIndex];
    const step = (drag.progress - sheet.flipProgress) * ease(DRAG.progressSmoothTime, 0.01);
    sheet.flipProgress += step;
    drag.speed = dt > 0 ? step / dt : 0;
    setCurve(sheet, drag.targetCurve, false);
  }

  // Hover: the top page under the cursor lifts a little toward it.
  const hoverSide = pointer && !drag && !hold ? sideAt(pointer.x) : null;
  const hovered = hoverSide && !isAnimating(hoverSide.sheetIndex) ? hoverSide.sheetIndex : -1;
  if (hovered !== -1) setCurve(sheets[hovered], curveFromPointer(pointer.x, pointer.y, hovered), hovered !== frame.prevHovered);
  frame.prevHovered = hovered;

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    if (!isAnimating(i) && !(drag && drag.sheetIndex === i)) {
      const onLeft = i < turned ? 1 : 0;
      const target = i === hovered ? (onLeft ? 1 - HOVER.progress : HOVER.progress) : onLeft;
      const diff = target - sheet.flipProgress;
      sheet.flipProgress = Math.abs(diff) < CURL.settleEpsilon ? target : sheet.flipProgress + diff * ease(HOVER.smoothTime);

      // A sheet can't rise past the one lying on top of it.
      const above = sheets[onLeft ? i + 1 : i - 1];
      if (above) {
        sheet.flipProgress = onLeft
          ? Math.max(sheet.flipProgress, Math.min(1, above.flipProgress + HOVER.gapToSheetAbove))
          : Math.min(sheet.flipProgress, Math.max(0, above.flipProgress - HOVER.gapToSheetAbove));
      }
      sheet.direction = onLeft && sheet.flipProgress !== 1 ? -1 : 1;
      sheet.directionSmooth = sheet.direction;
    }

    const dDir = sheet.direction - sheet.directionSmooth;
    sheet.directionSmooth = Math.abs(dDir) < CURL.settleEpsilon ? sheet.direction : sheet.directionSmooth + dDir * ease(CURL.directionSmoothTime);
    for (const key of ['curlArc', 'curlAngleDeg']) {
      const d = sheet.curveTarget[key] - sheet.curve[key];
      sheet.curve[key] = Math.abs(d) < CURL.settleEpsilon ? sheet.curveTarget[key] : sheet.curve[key] + d * ease(CURL.curveSmoothTime);
    }
    applyUniforms(sheet);

    // Only the top few sheets of each pile need to cast shadows.
    const depth = i >= turned ? i - turned : turned - 1 - i;
    sheet.mesh.castShadow = depth < 3 || isAnimating(i) || (drag && drag.sheetIndex === i);
    sheet.mesh.renderOrder = depth;
  }

  renderer.render(scene, camera);
}

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  if (SINGLE) {
    // Frame just the right-hand page, fitting whichever side is tighter.
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = FOLD_BACK.margin * Math.max(HALF_HEIGHT / t, 0.5 / (t * camera.aspect));
    camera.position.set(0.5, FOLD_BACK.cameraLift * fit / 2.45, fit);
    camera.lookAt(0.5, 0, 0);
  }
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h, false);
}
new ResizeObserver(resize).observe(canvas);
resize();

// ─── HUD ─────────────────────────────────────────────────────────────────────

const hud = document.getElementById('page');
function updateHud() {
  if (!hud) return;
  if (SINGLE) {
    hud.textContent = turned === 0 ? 'Cover'
      : turned === sheetCount - 1 ? 'Back cover'
      : `${String(turned + 1).padStart(2, '0')} / ${String(sheetCount).padStart(2, '0')}`;
    return;
  }
  const left = turned * 2;
  hud.textContent = turned === 0 ? 'Cover'
    : turned === sheetCount ? 'Back cover'
    : `${String(left).padStart(2, '0')}–${String(left + 1).padStart(2, '0')}`;
}
updateHud();

container.dataset.state = 'ready';
renderer.setAnimationLoop(frame);

// The two layouts build different sheets, so rebuild on crossing over (e.g.
// rotating a phone).
matchMedia(SINGLE_QUERY).addEventListener('change', () => location.reload());

// Open the cover shortly after load.
if (!SINGLE) setTimeout(() => {
  if (turned === 0) {
    setCurve(sheets[0], { curlArc: 0.7, curlAngleDeg: -12 }, true);
    flip(0, true, 1, 1.4);
  }
}, 700);
