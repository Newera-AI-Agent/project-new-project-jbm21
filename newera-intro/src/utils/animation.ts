export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
    return 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
  },
  easeInBack: (t: number) => t * t * (2.70158 * t - 1.70158),
  easeOutBack: (t: number) => 1 + (--t) * t * (2.70158 * t + 1.70158),
  easeInOutBack: (t: number) => {
    const s = 1.70158 * 1.525;
    if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
  },
  elasticOut: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  },
  bounceOut: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
};

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

export function getBeatProgress(currentTime: number, beatTime: number, nextBeatTime: number): number {
  if (currentTime <= beatTime) return 0;
  if (currentTime >= nextBeatTime) return 1;
  return (currentTime - beatTime) / (nextBeatTime - beatTime);
}

export function getMeasureProgress(currentTime: number, measureStart: number, measureEnd: number): number {
  if (currentTime <= measureStart) return 0;
  if (currentTime >= measureEnd) return 1;
  return (currentTime - measureStart) / (measureEnd - measureStart);
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const springConfigs = {
  gentle: {stiffness: 120, damping: 14, mass: 1},
  wobbly: {stiffness: 180, damping: 12, mass: 1},
  stiff: {stiffness: 210, damping: 20, mass: 1},
  slow: {stiffness: 280, damping: 60, mass: 1},
  snappy: {stiffness: 400, damping: 30, mass: 1},
};

// Simple spring simulation for frame-perfect animations
export function springStep(
  current: number,
  target: number,
  velocity: number,
  config: SpringConfig,
  dt: number = 1/30
): {value: number; velocity: number} {
  const {stiffness, damping, mass} = config;
  const force = -stiffness * (current - target);
  const dampingForce = -damping * velocity;
  const acceleration = (force + dampingForce) / mass;
  const newVelocity = velocity + acceleration * dt;
  const newValue = current + newVelocity * dt;
  return {value: newValue, velocity: newVelocity};
}
