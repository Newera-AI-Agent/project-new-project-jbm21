// Life Force - Beat Analysis Data
// BPM: ~128 (typical for aura farming / melodic techno)
// Duration: ~2:00-2:20
// Structure: Intro -> Build -> Drop -> Breakdown -> Drop -> Outro

export interface Beat {
  time: number; // in seconds
  measure: number;
  beat: number; // 1-4
  intensity: number; // 0-1
  type: 'kick' | 'snare' | 'hihat' | 'percussion' | 'bass' | 'melody' | 'downbeat';
}

export interface Measure {
  index: number;
  startTime: number;
  endTime: number;
  section: 'intro' | 'build' | 'drop' | 'breakdown' | 'drop2' | 'outro';
  energy: number; // 0-1
}

// Assuming 128 BPM = 128 beats per minute = 2.133 beats per second
// 4 beats per measure = 0.533 measures per second
// 1 measure = 1.875 seconds
const BPM = 128;
const BEATS_PER_MEASURE = 4;
const SECONDS_PER_BEAT = 60 / BPM; // ~0.46875
const SECONDS_PER_MEASURE = SECONDS_PER_BEAT * BEATS_PER_MEASURE; // ~1.875

// Generate beat grid for ~140 seconds (2:20)
export function generateBeatGrid(duration: number = 140): Beat[] {
  const beats: Beat[] = [];
  const totalBeats = Math.floor(duration / SECONDS_PER_BEAT);

  for (let i = 0; i < totalBeats; i++) {
    const time = i * SECONDS_PER_BEAT;
    const measure = Math.floor(i / BEATS_PER_MEASURE);
    const beatInMeasure = (i % BEATS_PER_MEASURE) + 1;
    const isDownbeat = beatInMeasure === 1;

    // Determine section based on time
    let section: Beat['type'] = 'kick';
    let intensity = 0.5;

    if (time < 15) { // Intro (0:00-0:15)
      section = isDownbeat ? 'downbeat' : 'percussion';
      intensity = 0.3 + (time / 15) * 0.2;
    } else if (time < 45) { // Build (0:15-0:45)
      if (beatInMeasure === 1) section = 'downbeat';
      else if (beatInMeasure === 3) section = 'snare';
      else section = 'hihat';
      intensity = 0.4 + ((time - 15) / 30) * 0.4;
    } else if (time < 75) { // First Drop (0:45-1:15)
      if (beatInMeasure === 1 || beatInMeasure === 3) section = 'kick';
      else section = 'bass';
      intensity = 0.9;
    } else if (time < 105) { // Breakdown (1:15-1:45)
      if (beatInMeasure === 1) section = 'downbeat';
      else section = 'melody';
      intensity = 0.3 + Math.sin((time - 75) / 30 * Math.PI) * 0.2;
    } else if (time < 135) { // Second Drop (1:45-2:15)
      if (beatInMeasure === 1 || beatInMeasure === 3) section = 'kick';
      else section = 'bass';
      intensity = 1.0;
    } else { // Outro (2:15+)
      section = isDownbeat ? 'downbeat' : 'percussion';
      intensity = Math.max(0.1, 1 - (time - 135) / 20);
    }

    beats.push({
      time,
      measure,
      beat: beatInMeasure,
      intensity,
      type: section,
    });
  }

  return beats;
}

export function generateMeasures(duration: number = 140): Measure[] {
  const measures: Measure[] = [];
  const totalMeasures = Math.floor(duration / SECONDS_PER_MEASURE);

  for (let i = 0; i < totalMeasures; i++) {
    const startTime = i * SECONDS_PER_MEASURE;
    const endTime = (i + 1) * SECONDS_PER_MEASURE;

    let section: Measure['section'] = 'intro';
    let energy = 0.3;

    if (startTime < 15) { // Intro
      section = 'intro';
      energy = 0.2 + (startTime / 15) * 0.2;
    } else if (startTime < 45) { // Build
      section = 'build';
      energy = 0.4 + ((startTime - 15) / 30) * 0.5;
    } else if (startTime < 75) { // Drop 1
      section = 'drop';
      energy = 0.9;
    } else if (startTime < 105) { // Breakdown
      section = 'breakdown';
      energy = 0.6 - ((startTime - 75) / 30) * 0.3;
    } else if (startTime < 135) { // Drop 2
      section = 'drop2';
      energy = 1.0;
    } else { // Outro
      section = 'outro';
      energy = Math.max(0.1, 1 - (startTime - 135) / 20);
    }

    measures.push({
      index: i,
      startTime,
      endTime,
      section,
      energy,
    });
  }

  return measures;
}

// Pre-computed beat grid for the track
export const BEATS = generateBeatGrid(140);
export const MEASURES = generateMeasures(140);

// Key moments in the track (in seconds)
export const KEY_MOMENTS = {
  introStart: 0,
  buildStart: 15,
  firstDrop: 45,
  breakdownStart: 75,
  secondDrop: 105,
  outroStart: 135,
  trackEnd: 140,
};

// Helper functions
export function getBeatAtTime(time: number): Beat | null {
  return BEATS.find(b => Math.abs(b.time - time) < SECONDS_PER_BEAT / 2) || null;
}

export function getMeasureAtTime(time: number): Measure | null {
  return MEASURES.find(m => time >= m.startTime && time < m.endTime) || null;
}

export function getBeatsInRange(startTime: number, endTime: number): Beat[] {
  return BEATS.filter(b => b.time >= startTime && b.time <= endTime);
}

export function getDownbeatsInRange(startTime: number, endTime: number): Beat[] {
  return BEATS.filter(b => b.time >= startTime && b.time <= endTime && b.type === 'downbeat');
}

export function getProgressInMeasure(time: number): number {
  const measure = getMeasureAtTime(time);
  if (!measure) return 0;
  return (time - measure.startTime) / (measure.endTime - measure.startTime);
}

export function getProgressInSection(time: number): number {
  const measure = getMeasureAtTime(time);
  if (!measure) return 0;
  
  const sectionMeasures = MEASURES.filter(m => m.section === measure.section);
  const sectionStart = sectionMeasures[0].startTime;
  const sectionEnd = sectionMeasures[sectionMeasures.length - 1].endTime;
  
  return (time - sectionStart) / (sectionEnd - sectionStart);
}

export function getSectionAtTime(time: number): Measure['section'] {
  const measure = getMeasureAtTime(time);
  return measure?.section || 'intro';
}

export function getEnergyAtTime(time: number): number {
  const measure = getMeasureAtTime(time);
  return measure?.energy || 0;
}

// Visual sync points - exact times for major visual changes
export const VISUAL_SYNC_POINTS = [
  {time: 0, label: 'Intro - Fade in NewEra logo', type: 'title'},
  {time: 3.75, label: 'Measure 2 - Geometric pulse', type: 'shape'},
  {time: 7.5, label: 'Measure 4 - Text reveal', type: 'text'},
  {time: 11.25, label: 'Measure 6 - Shape expansion', type: 'shape'},
  {time: 15, label: 'BUILD START - Rhythm intensifies', type: 'transition'},
  {time: 18.75, label: 'Measure 10 - Grid formation', type: 'shape'},
  {time: 22.5, label: 'Measure 12 - Typography build', type: 'text'},
  {time: 26.25, label: 'Measure 14 - Line animations', type: 'shape'},
  {time: 30, label: 'Measure 16 - Pre-drop tension', type: 'transition'},
  {time: 33.75, label: 'Measure 18 - Snare rolls', type: 'shape'},
  {time: 37.5, label: 'Measure 20 - Final build', type: 'transition'},
  {time: 41.25, label: 'Measure 22 - Silence before drop', type: 'transition'},
  {time: 45, label: 'FIRST DROP - Full energy', type: 'drop'},
  {time: 48.75, label: 'Measure 26 - Bass sync', type: 'shape'},
  {time: 52.5, label: 'Measure 28 - Geometric explosion', type: 'shape'},
  {time: 56.25, label: 'Measure 30 - Typography lock', type: 'text'},
  {time: 60, label: 'Measure 32 - Pattern shift', type: 'transition'},
  {time: 63.75, label: 'Measure 34 - Morphing shapes', type: 'shape'},
  {time: 67.5, label: 'Measure 36 - Color flash', type: 'transition'},
  {time: 71.25, label: 'Measure 38 - Pre-breakdown', type: 'transition'},
  {time: 75, label: 'BREAKDOWN - Atmospheric', type: 'transition'},
  {time: 78.75, label: 'Measure 42 - Melodic focus', type: 'text'},
  {time: 82.5, label: 'Measure 44 - Minimal geometry', type: 'shape'},
  {time: 86.25, label: 'Measure 46 - Text breathing', type: 'text'},
  {time: 90, label: 'Measure 48 - Slow build', type: 'transition'},
  {time: 93.75, label: 'Measure 50 - Rising tension', type: 'shape'},
  {time: 97.5, label: 'Measure 52 - Drum return', type: 'transition'},
  {time: 101.25, label: 'Measure 54 - Final buildup', type: 'transition'},
  {time: 105, label: 'SECOND DROP - Maximum energy', type: 'drop'},
  {time: 108.75, label: 'Measure 58 - Complex patterns', type: 'shape'},
  {time: 112.5, label: 'Measure 60 - Full typography', type: 'text'},
  {time: 116.25, label: 'Measure 62 - Shape chaos', type: 'shape'},
  {time: 120, label: 'Measure 64 - Peak moment', type: 'drop'},
  {time: 123.75, label: 'Measure 66 - Variation', type: 'transition'},
  {time: 127.5, label: 'Measure 68 - Wind down', type: 'transition'},
  {time: 131.25, label: 'Measure 70 - Fade preparation', type: 'transition'},
  {time: 135, label: 'OUTRO - Gentle close', type: 'transition'},
  {time: 138.75, label: 'Measure 74 - Final logo', type: 'title'},
  {time: 140, label: 'END', type: 'end'},
];

// Color palette for Full Vibe aesthetic
export const COLOR_PALETTE = {
  background: '#000000',
  foreground: '#FFFFFF',
  accent: '#00FF88', // Neon green for NewEra brand
  accentDim: '#00CC6A',
  accentBright: '#33FF99',
  gray100: '#1A1A1A',
  gray200: '#333333',
  gray300: '#4D4D4D',
  gray400: '#666666',
  gray500: '#808080',
  gray600: '#999999',
  gray700: '#B3B3B3',
  gray800: '#CCCCCC',
  gray900: '#E6E6E6',
  red: '#FF3333',
  blue: '#3399FF',
  yellow: '#FFCC00',
};

// Typography scale
export const TYPOGRAPHY = {
  fontFamily: 'Space Grotesk',
  displayLarge: {size: 120, weight: 700, letterSpacing: -0.02, lineHeight: 1.1},
  displayMedium: {size: 80, weight: 600, letterSpacing: -0.01, lineHeight: 1.15},
  displaySmall: {size: 56, weight: 500, letterSpacing: 0, lineHeight: 1.2},
  headlineLarge: {size: 48, weight: 600, letterSpacing: 0, lineHeight: 1.25},
  headlineMedium: {size: 36, weight: 500, letterSpacing: 0, lineHeight: 1.3},
  headlineSmall: {size: 28, weight: 500, letterSpacing: 0, lineHeight: 1.35},
  titleLarge: {size: 22, weight: 600, letterSpacing: 0.01, lineHeight: 1.4},
  titleMedium: {size: 18, weight: 500, letterSpacing: 0.01, lineHeight: 1.45},
  titleSmall: {size: 14, weight: 500, letterSpacing: 0.02, lineHeight: 1.5},
  bodyLarge: {size: 16, weight: 400, letterSpacing: 0, lineHeight: 1.5},
  bodyMedium: {size: 14, weight: 400, letterSpacing: 0.01, lineHeight: 1.55},
  bodySmall: {size: 12, weight: 400, letterSpacing: 0.02, lineHeight: 1.6},
  labelLarge: {size: 14, weight: 600, letterSpacing: 0.05, lineHeight: 1.4},
  labelMedium: {size: 12, weight: 600, letterSpacing: 0.05, lineHeight: 1.45},
  labelSmall: {size: 11, weight: 600, letterSpacing: 0.05, lineHeight: 1.5},
};

// Spacing scale (8px base)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 96,
  massive: 128,
};

// Border radius
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};
