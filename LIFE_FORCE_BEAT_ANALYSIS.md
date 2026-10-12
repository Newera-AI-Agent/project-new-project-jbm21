# Life Force — Audio Spectrum & Beat Analysis

## Track Metadata
- **Title**: Life Force
- **Artist**: ptasinskirjpasin
- **Duration**: 107.91 seconds
- **Sample Rate**: 48 kHz
- **Detected Tempo**: 255.68 BPM (double-time feel: 127.84 BPM half-time)
- **Time Signature**: 4/4
- **Total Measures**: 109
- **Total Beats**: 437

---

## Beat Grid & Sync Points

### Measure Structure
Each measure = 4 beats @ 255.68 BPM → **0.940s per measure**
- Beat interval: **234.7 ms**
- 16th note: **58.7 ms**
- 8th note triplet: **78.2 ms**

### Strong Sync Points (Measure Downbeats)
These are the **primary visual anchor points** — every major transition, logo hit, text reveal, camera cut should land here:

```
0.053s    → Measure 1   (intro downbeat)
2.933s    → Measure 4
6.048s    → Measure 7
8.693s    → Measure 10
12.512s   → Measure 14
16.352s   → Measure 18
20.107s   → Measure 22  (half-time shift feel)
24.032s   → Measure 26
27.787s   → Measure 30
29.792s   → Measure 32
33.557s   → Measure 36
35.552s   → Measure 38
39.392s   → Measure 42
43.232s   → Measure 46
47.072s   → Measure 50
50.912s   → Measure 54
54.592s   → Measure 58
56.672s   → Measure 60
59.787s   → Measure 64
62.432s   → Measure 66
66.187s   → Measure 70
70.112s   → Measure 74
73.792s   → Measure 78
75.872s   → Measure 80
79.552s   → Measure 84
81.632s   → Measure 86
85.312s   → Measure 90
87.317s   → Measure 92
89.312s   → Measure 94
93.152s   → Measure 98
96.992s   → Measure 102
100.832s  → Measure 106
104.672s  → Measure 110 (outro)
107.072s  → Measure 112 (final)
```

### Beat-Level Grid (All 437 Beats)
Available in `beat_timeline.json` — every beat has 4 sub-divisions. Use for:
- **Downbeats (1)**: Major reveals, scene cuts, logo hits
- **Backbeats (3)**: Secondary motion, particle bursts, counter-animations
- **Offbeats (2, 4)**: Micro-interactions, UI ticks, cursor blinks
- **16ths**: High-frequency shimmer, data particle spawns

---

## Spectral Analysis

### Frequency Band Energy (7 Bands)
Normalized 0–1, time-series at ~10118 frames (≈93.7 fps analysis rate)

| Band | Range | Character | Visual Mapping |
|------|-------|-----------|----------------|
| **Sub-bass** | 20–60 Hz | Foundation, weight | Global scale, camera dolly, background glow |
| **Bass** | 60–250 Hz | Groove, punch | Card flips, grid pulses, logo impact |
| **Low-mid** | 250–500 Hz | Body, warmth | Text weight, shape thickness |
| **Mid** | 500–2000 Hz | Presence, clarity | Typography contrast, edge sharpness |
| **High-mid** | 2–4 kHz | Attack, definition | Particle spawn rate, line draw speed |
| **Presence** | 4–6 kHz | Detail, air | Micro-animations, hover states |
| **Brilliance** | 6–20 kHz | Sparkle, transparency | Glint passes, fade-out shimmer |

### Spectral Centroid (Brightness)
- **Range**: ~1000–4500 Hz
- **Mean**: ~2200 Hz
- **Behavior**: Rises during build-ups, drops at drops
- **Visual**: Map to color temperature (cool→warm) or particle size

### Spectral Rolloff
- **85th percentile** of spectral energy
- **Visual**: Controls blur radius / glow spread

### RMS Envelope (Loudness)
- **Frames**: 10118
- **Peak**: ~0.45 (normalized)
- **Noise floor**: ~2e-11 (near-silence intro)
- **Visual**: Global intensity master — scales ALL reactive parameters

### Onset Detection
- **Onset times**: Transient peaks (kick, snare, synth stabs)
- **Peak times**: Local maxima in onset envelope
- **Use**: Frame-accurate trigger points for cuts/flashes

### MFCCs (13 coefficients × 10118 frames)
- **Coeff 0**: Spectral envelope (≈loudness)
- **Coeff 1–2**: Spectral tilt (brightness)
- **Coeff 3–12**: Timbral texture
- **Visual**: Cluster analysis → segment classification (intro/verse/drop/outro)

### Chroma (12 pitch classes × 10118 frames)
- **Key detection**: Harmonic content tracking
- **Visual**: Harmonic color shifts, chord-change triggers

---

## Structural Segments (Derived from Audio)

| Segment | Time Range | Measures | Character | Visual Treatment |
|---------|------------|----------|-----------|------------------|
| **Intro** | 0.0–8.7s | 1–10 | Sparse, building | Minimal geometry, slow reveals |
| **Verse A** | 8.7–20.1s | 10–22 | Groove established | Grid enters, beat-sync cards |
| **Pre-chorus** | 20.1–24.0s | 22–26 | Tension rising | Particles accelerate, camera push |
| **Drop 1** | 24.0–35.6s | 26–38 | Full energy | Pipeline viz, max density |
| **Verse B** | 35.6–47.1s | 38–50 | Stripped back | Code/terminal aesthetic |
| **Build** | 47.1–56.7s | 50–60 | Accelerating | Collaboration orbit, rings |
| **Drop 2** | 56.7–70.1s | 60–74 | Peak intensity | Deploy/scale, counters |
| **Breakdown** | 70.1–85.3s | 74–90 | Minimal, atmospheric | Logo breath, slow motion |
| **Final Drop** | 85.3–100.8s | 90–106 | Maximum density | All systems firing |
| **Outro** | 100.8–107.9s | 106–112 | Fade to silence | Lockup, URL, fade to black |

---

## Remotion Integration Guide

### Frame-Accurate Timing (30 fps)
```typescript
const fps = 30;
const beatInterval = 60 / 255.6818181818182; // 0.2347s
const framesPerBeat = beatInterval * fps; // ~7.04 frames
```

### Beat-to-Frame Helper
```typescript
function beatToFrame(beatTime: number): number {
  return Math.round(beatTime * fps);
}

function measureToFrame(measure: number): number {
  const measureStart = beatTimeline.measures[measure - 1].start;
  return beatToFrame(measureStart);
}
```

### Audio-Reactive Uniforms (Shader/Component Props)
```typescript
interface AudioReactiveProps {
  rms: number;           // 0–1, global intensity
  centroid: number;      // Hz, brightness
  rolloff: number;       // Hz, spread
  bandEnergy: {          // 0–1 each
    subBass: number;
    bass: number;
    lowMid: number;
    mid: number;
    highMid: number;
    presence: number;
    brilliance: number;
  };
  onset: number;         // 0–1, transient trigger
  beatPhase: number;     // 0–1, position within beat
  measurePhase: number;  // 0–1, position within measure
}
```

### Easing Curves (Full Vibe Standard)
```css
/* Primary: easeOutExpo equivalent */
--ease-primary: cubic-bezier(0.22, 1, 0.36, 1);

/ Anticipation: slight overshoot */
--ease-anticipate: cubic-bezier(0.34, 1.56, 0.64, 1);

/ Sharp cut: for hard hits */
--ease-cut: cubic-bezier(0.55, 0.055, 0.675, 0.19);

/ Breath: slow organic */
--ease-breath: cubic-bezier(0.4, 0, 0.6, 1);
```

---

## NewEra Composition Mapping

### Composition Duration: 108 seconds (3240 frames @ 30fps)
Matches track duration exactly.

### Scene Timeline
| Scene | Measures | Frames | Start Frame | End Frame |
|-------|----------|--------|-------------|-----------|
| Logo Reveal | 1–4 | 112 | 0 | 112 |
| Capability Grid | 4–10 | 180 | 112 | 292 |
| Pipeline Viz | 10–18 | 240 | 292 | 532 |
| Terminal/Code | 18–26 | 240 | 532 | 772 |
| Multi-Agent | 26–34 | 240 | 772 | 1012 |
| Deploy/Scale | 34–42 | 240 | 1012 | 1252 |
| Breakdown | 42–54 | 360 | 1252 | 1612 |
| Final Drop | 54–70 | 480 | 1612 | 2092 |
| Outro/Lockup | 70–80 | 300 | 2092 | 2392 |
| Hold/Fade | 80–108 | 840 | 2392 | 3232 |

### Beat-Sync Rules (Enforced in Code)
1. **No animation starts between beats** — all `useCurrentFrame()` triggers quantized to nearest beat
2. **Stagger = 1–2 frames** (33–66ms) for multi-element entrances
3. **Hold minimum 4 beats** (16 frames) for readability
4. **Transition duration = 1 beat** (7 frames) unless musical phrase demands otherwise
5. **Camera moves only on measure boundaries** (every 28 frames)

---

## Data Files
- `beat_timeline.json` — Complete measure/beat grid with strong sync points
- `audio_analysis.json` — Full spectral data (centroid, rolloff, RMS, bands, MFCCs, chroma)
- `analyze_audio.py` — Generation script (librosa-based)

---

*Generated via librosa 0.10+ analysis at 48kHz. All times in seconds. Frame numbers @ 30fps.*