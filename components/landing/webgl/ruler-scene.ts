import {
  BufferAttribute,
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { motionPause } from '../motion/pause';
import { rulerState } from './ruler-state';

/*
 * The ruler field: the page's own measure, ticks at the 24px gutter pitch with a
 * heavier mark every fifth, stood up on a floor and seen at a shallow angle. It
 * is decoration, not a chart: nothing on it stands for a contract or a date.
 * A few ticks are red because red is this page's colour for "needs attention
 * soon", and that is the only meaning they carry.
 *
 * It does three things. It sways slowly. The pointer is a lens that lifts the
 * ticks under it. And the hero's analysis drives it: a band sweeps across while
 * the software reads, and a ring spreads when the reading is done.
 *
 * One draw call: every tick is an instance of one quad, widened in clip space
 * so a tick stays about a pixel and a quarter wide at every depth.
 */

const COLUMN_STEP = 0.16;
const HALF_WIDTH = 12;
const ROW_Z = [-12.0, -11.0, -10.0, -9.0, -8.0, -7.0, -6.0, -5.0, -4.0, -3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0];

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform vec2 uResolution;
  uniform float uLineWidth;
  uniform vec2 uLens;
  uniform float uLensR;
  uniform float uLensGain;
  uniform float uSweep;
  uniform float uPulse;
  uniform float uHalf;
  uniform float uFade;

  attribute vec3 aOffset;
  attribute float aKind;

  varying float vAlpha;
  varying float vKind;
  varying float vY;
  varying float vHeat;

  void main() {
    float x = aOffset.x;
    float z = aOffset.y;
    float seed = aOffset.z;

    float base = aKind > 1.5 ? 0.95 : (aKind > 0.5 ? 0.52 : 0.28);
    float wave = sin(x * 0.52 + uTime * 0.65 - z * 0.42);
    float h = base * (0.94 + 0.12 * seed) * (1.0 + 0.2 * uAmp * wave);

    // The lens: ticks stand up where the pointer is.
    vec2 d = vec2(x, z) - uLens;
    float lens = exp(-dot(d, d) / (uLensR * uLensR));

    // The reading sweep: a band that travels along the ruler.
    float sx = mix(-uHalf, uHalf, clamp(uSweep, 0.0, 1.0));
    float on = step(0.0, uSweep) * (1.0 - step(1.0, uSweep));
    float dx = x - sx;
    float band = exp(-dx * dx / 0.8) * on;

    // The pulse: a ring that spreads from the middle once the reading is done.
    float dr = length(vec2(x, z + 3.0)) - uPulse * 17.0;
    float ring = exp(-dr * dr / 1.6) * step(0.0, uPulse) * (1.0 - smoothstep(0.65, 1.0, uPulse));

    float heat = lens * uLensGain + band + ring;
    h += lens * uLensGain * 1.05 + band * 0.9 + ring * 0.75;

    vec3 pos = vec3(x, position.y * h, z);
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    clip.x += position.x * uLineWidth * 2.0 / uResolution.x * clip.w;
    gl_Position = clip;

    // Far rows and the sides dissolve into the ground.
    float depth = clamp((z + 12.0) / 16.0, 0.0, 1.0);
    float edge = 1.0 - smoothstep(uHalf * 0.5, uHalf, abs(x));
    vAlpha = (0.05 + 0.95 * pow(depth, 1.15)) * edge * uFade;
    vKind = aKind;
    vY = position.y;
    vHeat = heat;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uBright;
  uniform vec3 uRed;

  varying float vAlpha;
  varying float vKind;
  varying float vY;
  varying float vHeat;

  void main() {
    vec3 col = vKind > 1.5 ? uRed : (vKind > 0.5 ? uBright : uInk);
    float tip = 0.45 + 0.55 * vY;
    float weight = vKind > 1.5 ? 1.25 : (vKind > 0.5 ? 0.85 : 0.52);
    float heat = clamp(vHeat, 0.0, 1.0);
    float a = vAlpha * tip * weight + heat * 0.4 * vAlpha;
    gl_FragColor = vec4(mix(col, uBright, heat * 0.75), clamp(a, 0.0, 1.0));
  }
`;

export interface RulerScene {
  setVisible(visible: boolean): void;
  /** Pointer position over the canvas, -1 to 1 on both axes, or null when it left. */
  setPointer(point: { x: number; y: number } | null): void;
  /** 0 at rest, 1 once the field has scrolled out of view: it tips back and fades. */
  setProgress(progress: number): void;
  dispose(): void;
}

export interface RulerSceneOptions {
  /** How much the field sways and how bright the lens is. 1 is the hero; the contact block runs calmer. */
  intensity: number;
  /** Called once if the device cannot hold the frame rate, after the scene has stopped itself. */
  onDegrade: () => void;
}

export function createRulerScene(canvas: HTMLCanvasElement, options: RulerSceneOptions): RulerScene | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'default' });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 80);
  // A level camera with a shifted frustum, like a shift lens: the floor sits in the lower
  // part of the frame and every tick stays vertical, so the field reads as a measure and not as rain.
  const cameraHome = new Vector3(0, 2.2, 9);
  const lookAt = new Vector3(0, 2.2, -10);
  /** How far the horizon sits above the middle of the frame, as a share of its height. */
  const HORIZON_SHIFT = 0.13;

  // Geometry: one quad, a unit tall and one wide, standing on the floor.
  const quad = new InstancedBufferGeometry();
  quad.setAttribute(
    'position',
    new BufferAttribute(new Float32Array([-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0]), 3),
  );
  quad.setIndex([0, 1, 2, 0, 2, 3]);

  // Instances, far rows first so nearer ticks paint over them.
  const columns = Math.floor((HALF_WIDTH * 2) / COLUMN_STEP) + 1;
  const count = columns * ROW_Z.length;
  const offsets = new Float32Array(count * 3);
  const kinds = new Float32Array(count);
  let hash = 7;
  const random = () => {
    hash = (hash * 16807) % 2147483647;
    return hash / 2147483647;
  };
  let i = 0;
  for (const z of ROW_Z) {
    for (let c = 0; c < columns; c += 1) {
      const x = -HALF_WIDTH + c * COLUMN_STEP;
      offsets[i * 3] = x;
      offsets[i * 3 + 1] = z;
      offsets[i * 3 + 2] = random();
      kinds[i] = c % 5 === 0 ? 1 : 0;
      i += 1;
    }
  }
  // A handful of ticks are red. Chosen once, and kept off the very edges.
  for (let n = 0; n < 12; n += 1) {
    const row = 4 + Math.floor(random() * (ROW_Z.length - 4));
    const column = 24 + Math.floor(random() * (columns - 48));
    kinds[row * columns + column] = 2;
  }
  quad.setAttribute('aOffset', new InstancedBufferAttribute(offsets, 3));
  quad.setAttribute('aKind', new InstancedBufferAttribute(kinds, 1));
  quad.instanceCount = count;

  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: options.intensity },
    uResolution: { value: new Vector2(1, 1) },
    uLineWidth: { value: 1.5 },
    uLens: { value: new Vector2(0, -3) },
    uLensR: { value: 2.1 },
    uLensGain: { value: 0.75 * options.intensity },
    uSweep: { value: -1 },
    uPulse: { value: -1 },
    uHalf: { value: HALF_WIDTH },
    uFade: { value: 1 },
    uInk: { value: new Color('#b9c8e6') },
    uBright: { value: new Color('#ffffff') },
    uRed: { value: new Color('#e4566a') },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new Mesh(quad, material);
  mesh.frustumCulled = false;
  scene.add(mesh);


  // --- sizing -------------------------------------------------------------
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cssWidth = 1;
  let cssHeight = 1;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    cssWidth = Math.max(1, Math.round(rect.width));
    cssHeight = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(dpr);
    renderer.setSize(cssWidth, cssHeight, false);
    uniforms.uResolution.value.set(cssWidth * dpr, cssHeight * dpr);
    camera.aspect = cssWidth / cssHeight;
    // A tall, narrow stage (a phone) needs a wider view to keep the field's width.
    camera.fov = camera.aspect < 0.9 ? 44 : camera.aspect < 1.2 ? 36 : 30;
    camera.setViewOffset(cssWidth, cssHeight, 0, Math.round(cssHeight * HORIZON_SHIFT), cssWidth, cssHeight);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  // --- pointer: a lens on the floor ---------------------------------------
  const lensTarget = new Vector2(0, -3);
  const lensNow = new Vector2(0, -3);
  let pointerActive = false;
  const ray = new Vector3();
  const hit = new Vector3();

  const setPointer = (point: { x: number; y: number } | null) => {
    if (!point) {
      pointerActive = false;
      return;
    }
    pointerActive = true;
    ray.set(point.x, point.y, 0.5).unproject(camera).sub(camera.position).normalize();
    if (ray.y < -0.0001) {
      const t = -camera.position.y / ray.y;
      hit.copy(camera.position).addScaledVector(ray, t);
      lensTarget.set(
        Math.max(-HALF_WIDTH, Math.min(HALF_WIDTH, hit.x)),
        Math.max(ROW_Z[0], Math.min(ROW_Z[ROW_Z.length - 1], hit.z)),
      );
    }
  };

  // --- the loop -----------------------------------------------------------
  let visible = false;
  let disposed = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let progress = 0;

  // Quality governor: the first frames decide whether this device keeps up.
  const frames: number[] = [];
  let stage: 'full' | 'lean' = 'full';

  const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

  const frame = (now: number) => {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) {
      last = 0;
      return;
    }
    const elapsed = last ? now - last : 0;
    const dt = Math.min(elapsed / 1000, 0.05);
    last = now;
    // "Pause motion" freezes the sway and the idle drift. The lens still follows the pointer,
    // because that motion is the visitor's own.
    const frozen = motionPause.get();
    if (!frozen) clock += dt;

    // Idle, the lens drifts along a slow path, so the field is alive without a pointer.
    if (!pointerActive && !frozen) {
      lensTarget.set(Math.sin(clock * 0.21) * 7.5, -3.2 + Math.cos(clock * 0.17) * 2.4);
    }
    lensNow.lerp(lensTarget, 1 - Math.exp(-dt * (pointerActive ? 7 : 1.6)));
    uniforms.uLens.value.copy(lensNow);
    uniforms.uLensR.value = pointerActive ? 2.3 : 1.8;

    uniforms.uTime.value = clock;
    uniforms.uSweep.value = rulerState.sweep;
    uniforms.uPulse.value = rulerState.pulse;
    uniforms.uFade.value = 1 - progress * 0.85;

    camera.position.set(cameraHome.x, cameraHome.y + progress * 1.2, cameraHome.z + progress * 2.4);
    camera.lookAt(lookAt.x, camera.position.y, lookAt.z);

    renderer.render(scene, camera);

    // A stall of a quarter second or more is the tab being throttled, not the device being slow.
    if (elapsed > 0 && elapsed < 250 && frames.length < 120) {
      frames.push(elapsed);
      // A steady 30 fps (power saving, a capped display) is fine. Below about 22 fps the device is struggling.
      if (frames.length === 60 && stage === 'full' && median(frames) > 42) {
        stage = 'lean';
        dpr = 1;
        resize();
      }
      if (frames.length === 120 && stage === 'lean' && median(frames.slice(60)) > 55) {
        dispose();
        options.onDegrade();
      }
    }
  };
  raf = requestAnimationFrame(frame);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    dispose();
    options.onDegrade();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    canvas.removeEventListener('webglcontextlost', onContextLost);
    quad.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return {
    setVisible: (next) => {
      visible = next;
    },
    setPointer,
    setProgress: (next) => {
      progress = Math.max(0, Math.min(1, next));
    },
    dispose,
  };
}
