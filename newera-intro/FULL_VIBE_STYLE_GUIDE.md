# Full Vibe Style Guide — NewEra AI Agent Intro

> **Design Philosophy**: Clean motion graphics. High-contrast typography. Smooth transitions. Geometric precision. Everything synced to the beat.

---

## 1. Color System

### Primary Palette
| Role | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Background** | `#000000` | 0, 0, 0 | Canvas base, negative space |
| **Foreground** | `#FFFFFF` | 255, 255, 255 | Primary text, shapes, lines |
| **Accent — Electric Green** | `#00FF41` | 0, 255, 65 | CTAs, highlights, glitch pulses, beat markers |
| **Accent Dim** | `#00CC33` | 0, 204, 51 | Hover states, secondary accents |
| **Muted** | `#333333` | 51, 51, 51 | Grid lines, scanlines, subtle geometry |

### Semantic Color Tokens (CSS Custom Properties)
```css
:root {
  --color-bg: #000000;
  --color-fg: #FFFFFF;
  --color-accent: #00FF41;
  --color-accent-dim: #00CC33;
  --color-muted: #333333;
  --color-glitch-1: #FF0066;
  --color-glitch-2: #00FFFF;
}
```

### Contrast Ratios (WCAG 2.1)
- White on Black: **21:1** (AAA)
- Electric Green on Black: **10.5:1** (AAA for large text, AA for normal)
- Electric Green on White: **2.1:1** (fails — never use green text on white)

**Rule**: Accent color only appears on black backgrounds. Never on white.

---

## 2. Typography System

### Font Stack
```css
--font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
--font-fallback: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale (Fluid, clamp-based)
| Token | Desktop | Mobile | Line Height | Letter Spacing | Weight |
|-------|---------|--------|-------------|----------------|--------|
| `--text-hero` | `clamp(4rem, 12vw, 14rem)` | `clamp(3rem, 15vw, 6rem)` | 1.0 | `-0.02em` | 700 |
| `--text-display` | `clamp(2.5rem, 6vw, 5rem)` | `clamp(2rem, 8vw, 3.5rem)` | 1.05 | `-0.01em` | 600 |
| `--text-title` | `clamp(1.5rem, 3vw, 2.5rem)` | `clamp(1.25rem, 4vw, 2rem)` | 1.15 | `0` | 500 |
| `--text-body` | `1rem` | `0.9375rem` | 1.6 | `0` | 400 |
| `--text-caption` | `0.75rem` | `0.75rem` | 1.5 | `0.02em` | 400 |
| `--text-mono` | `0.875rem` | `0.8125rem` | 1.5 | `0` | 400 |

### Kerning & Tracking Rules
- **Hero/Display**: Negative tracking (`-0.01em` to `-0.02em`) for tight, confident presence
- **Body**: Normal tracking (`0`)
- **Mono/Captions**: Slight positive tracking (`+0.02em`) for legibility
- **Beat-sync moments**: Animated tracking `0 → 0.5em → 0` on downbeats

### Text Animation Presets
```typescript
// Tracking pulse on beat
tracking: interpolate(frame, [beatStart, beatEnd], [0, 0.3, 0])

// Typewriter reveal
opacity: interpolate(frame, [start, start + chars * 2], [0, 1])

// Glitch displacement
offsetX: random(-4, 4) * glitchIntensity
offsetY: random(-2, 2) * glitchIntensity
```

---

## 3. Motion & Easing

### Core Easing Functions
```typescript
// Sine-based — primary for Full Vibe
easeInSine(t)    = 1 - cos((t * π) / 2)
easeOutSine(t)   = sin((t * π) / 2)
easeInOutSine(t) = -(cos(π * t) - 1) / 2

// Exponential — for dramatic entrances
easeInExpo(t)    = t === 0 ? 0 : 2^(10(t - 1))
easeOutExpo(t)   = t === 1 ? 1 : 1 - 2^(-10 * t)

// Circular — for orbital/radial motion
easeInCirc(t)    = 1 - sqrt(1 - t^2)
easeOutCirc(t)   = sqrt(1 - (t - 1)^2)

// Back — for overshoot personality
easeOutBack(t)   = 1 + 2.70158 * (t - 1)^3 + 1.70158 * (t - 1)^2
```

### Motion Principles
1. **Never linear** — every movement has ease-in and/or ease-out
2. **Beat-aligned** — major transitions land on downbeats (1, 2, 3, 4)
3. **Staggered entrances** — 80-120ms cascade for multi-element reveals
4. **Duration tiers**:
   - Micro: 150-200ms (hover, tap feedback)
   - Standard: 300-500ms (section transitions)
   - Macro: 600-1000ms (hero entrances, major drops)
   - Epic: 1200-2000ms (opening/closing sequences)

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 4. Geometry & Shapes

### Primitive Library
| Shape | Construction | Animation Behaviors |
|-------|--------------|---------------------|
| **Circle** | `border-radius: 50%` | Pulse (scale 1→1.2→1), orbit, morph to square |
| **Square** | `aspect-ratio: 1` | Rotate (45° steps), scale, morph to circle |
| **Line** | `width: 100%, height: 1-2px` | Draw (stroke-dashoffset), sweep, scan |
| **Grid** | CSS Grid / Canvas lines | Fade rows/cols, wave distortion, perspective shift |
| **Scanlines** | Repeating linear-gradient | Vertical scroll, opacity pulse, glitch displacement |
| **Triangle** | `clip-path: polygon(...)` | Rotate, scale, flip, tessellate |
| **Ring** | `border: 2px solid, border-radius: 50%` | Dash animate, multi-ring stagger, stroke width pulse |

### Shape Interaction Rules
- **Alignment**: All shapes snap to 8px baseline grid
- **Spacing**: Minimum 16px between distinct elements
- **Hierarchy**: Max 3 simultaneous animated shapes per section
- **Exit**: Shapes fade/scale out before new section enters (no hard cuts between sections unless beat demands)

### Morphing System
```typescript
// Circle ↔ Square interpolation
const morph = (t: number) => (
  `polygon(${interpolatePoints(circlePoints, squarePoints, t)})`
)

// SVG path interpolation for complex morphs
const pathMorph = (from: string, to: string, t: number) =>
  flubber.interpolate(from, to)(t)
```

---

## 5. Composition & Layout

### Safe Zones (1920×1080 Landscape)
```
┌─────────────────────────────────────────────────────────────┐
│  ██████████████████████████████████████████████████████████  │ 108px (10%)
│  █  TITLE SAFE (90% = 1728×972)  █  █  █  █  █  █  █  █  █  │
│  █                                █  █  █  █  █  █  █  █  █  │
│  █   ┌────────────────────────┐   █  █  █  █  █  █  █  █  █  │
│  █   │  ACTION SAFE (80% =    │   █  █  █  █  █  █  █  █  █  │
│  █   │  1536×864)             │   █  █  █  █  █  █  █  █  █  │
│  █   │                        │   █  █  █  █  █  █  █  █  █  │
│  █   └────────────────────────┘   █  █  █  █  █  █  █  █  █  │
│  █                                █  █  █  █  █  █  █  █  █  │
│  ██████████████████████████████████████████████████████████  │ 108px
└─────────────────────────────────────────────────────────────┘
```

### Grid System
- **Base unit**: 8px
- **Columns**: 12-column (landscape) / 8-column (portrait)
- **Gutter**: 24px (landscape) / 16px (portrait)
- **Margin**: 48px (landscape) / 32px (portrait)

### Section Architecture
Each 16-32 beat section follows:
```
[0-2 beats]   Entrance transition (easeOutExpo)
[2-12 beats]  Primary content hold (subtle idle animation)
[12-14 beats] Beat-accent moments (glitch, pulse, flash)
[14-16 beats] Exit transition (easeInExpo) → next section
```

---

## 6. Visual Effects

### Glitch Effect
```typescript
interface GlitchConfig {
  intensity: 0-1;
  frequency: beats between glitches;
  displacement: max px offset;
  colorSplit: boolean; // RGB channel separation
  scanlineJitter: boolean;
}

// Applied on: drop beats, section transitions, emphasis moments
```

### Scanlines
```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,255,255,0.03) 2px,
    rgba(255,255,255,0.03) 4px
  );
  animation: scanScroll 8s linear infinite;
}
@keyframes scanScroll {
  to { background-position-y: 100%; }
}
```

### Grid Distortion
- **Perspective tilt**: `transform: perspective(500px) rotateX(15deg)` on section intro
- **Wave warp**: Sinusoidal vertex displacement on beat
- **Glitch slices**: Horizontal strips with random time offsets

### Particle / Dust System
- 40-80 particles max
- Size: 1-3px
- Opacity: 0.1-0.4
- Motion: Brownian + subtle downward drift
- Spawn on: heavy impacts, transitions

---

## 7. Audio-Visual Sync

### Beat Grid (Life Force — 255.68 BPM)
```
Beat duration: 234.6ms @ 30fps = 7.04 frames/beat
Measure (4 beats): 28.16 frames
Section (16 beats): 112.64 frames ≈ 113 frames
```

### Sync Points
| Musical Event | Visual Response |
|---------------|-----------------|
| **Kick drum** | Shape pulse (scale 1→1.15), grid flash |
| **Snare/Clap** | Hard cut, text glitch, shape morph |
| **Hi-hat 1/8** | Micro-pulse (opacity 1→0.7→1) |
| **Bass note** | Background glow pulse, ring expansion |
| **Synth lead** | Text tracking animate, line draw |
| **Drop (major)** | Full screen flash, all shapes reset, new section |
| **Breakdown** | Minimal geometry, slow pulse, wide tracking |
| **Build-up** | Accelerating pulse rate, increasing glitch |

### Audio Reactive Values (Remotion)
```typescript
const beatProgress = (frame: number, beatTime: number) =>
  (frame / 30 - beatTime) / (234.6 / 1000)

const onBeat = (frame: number, beatFrame: number) =>
  Math.abs(frame - beatFrame) < 2 // ±2 frame tolerance
```

---

## 8. Video Specifications

### Master Deliverable
| Spec | Value |
|------|-------|
| **Resolution** | 1920×1080 (16:9) |
| **Frame Rate** | 30 fps (exact, not 29.97) |
| **Duration** | 140 seconds (4200 frames) |
| **Video Codec** | H.264 High Profile, Level 4.2 |
| **Audio Codec** | AAC-LC, 48kHz, Stereo, 192 kbps |
| **Color Space** | BT.709 (sRGB) |
| **Bitrate** | ~20 Mbps (VBR) |

### Variant Deliverables
| Variant | Resolution | Codec | Use Case |
|---------|------------|-------|----------|
| **4K Landscape** | 3840×2160 | H.264 | Archive, projection |
| **Vertical 1080p** | 1080×1920 | H.264 | Reels, Shorts, TikTok |
| **4K Vertical** | 2160×3840 | H.264 | High-res vertical |
| **Poster Frame** | 1920×1080 | PNG | Thumbnail, OG image |
| **GIF Loop** | 480×270 | GIF | Embedded previews |

### File Naming Convention
```
newera-intro_[variant]_[version].[ext]
Examples:
- newera-intro_landscape_1080p_v1.mp4
- newera-intro_vertical_1080p_v1.mp4
- newera-intro_4k_landscape_v1.mp4
- newera-intro_poster_v1.png
```

---

## 9. Web Showcase Standards

### Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <title>NewEra AI Agent — Full Vibe Intro</title>
  <meta property="og:title" content="NewEra AI Agent Intro">
  <meta property="og:description" content="Full Vibe motion graphics intro synced to Life Force">
  <meta property="og:image" content="poster_frame.png">
  <meta property="og:video" content="video.mp4">
  <meta property="og:video:type" content="video/mp4">
  <meta property="og:video:width" content="1920">
  <meta property="og:video:height" content="1080">
</head>
```

### Performance Budget
- **Total page weight**: < 5 MB (excluding video)
- **Critical CSS**: < 14 KB (inlined)
- **JS bundle**: < 50 KB (gzipped)
- **Fonts**: Preloaded, `font-display: swap`
- **Video**: `preload="metadata"`, lazy-load offscreen

### Accessibility Checklist
- [ ] `prefers-reduced-motion` honored
- [ ] `prefers-contrast: more` supported
- [ ] Semantic HTML5 (`<main>`, `<section>`, `<article>`)
- [ ] Focus visible on all interactive elements
- [ ] Video has `controls`, no autoplay with sound
- [ ] Alt text for poster frame
- [ ] Color contrast AAA for all text
- [ ] No flashing > 3Hz (WCAG 2.3.1)

---

## 10. Component API Reference

### Typography Components
```tsx
<GlitchText
  text="NEON"
  intensity={0.5}
  triggerFrame={1200}
  duration={30}
  color="#00FF41"
/>

<TrackingText
  text="NEWERA AI AGENT"
  baseTracking={0}
  maxTracking={0.5}
  beatFrames={[100, 200, 300]}
  fontSize={120}
/>

<TypeWriterText
  text="Building the future..."
  startFrame={0}
  charsPerFrame={0.5}
  cursor={true}
/>

<KineticText
  text="MOTION"
  velocity={2}
  direction="right"
  wrap={true}
/>
```

### Geometry Components
```tsx
<PulsingCircle
  centerX={960}
  centerY={540}
  baseRadius={100}
  pulseAmount={0.3}
  beatFrames={[0, 28, 56, ...]}
  color="#00FF41"
  strokeWidth={2}
/>

<RotatingSquare
  centerX={960}
  centerY={540}
  size={200}
  rotationSpeed={0.25} // rotations per beat
  beatAlign={true}
  color="#FFFFFF"
/>

<MorphingShape
  centerX={960}
  centerY={540}
  size={300}
  progress={0-1}
  fromShape="circle"
  toShape="square"
  color="#00FF41"
/>

<GridLines
  cols={12}
  rows={8}
  lineWidth={1}
  color="#333333"
  animate={"wave" | "fade" | "perspective"}
  beatSync={true}
/>

<ScanLines
  density={4}
  opacity={0.03}
  speed={0.5}
  glitchFrames={[1200, 2400]}
/>
```

### Transition Components
```tsx
<HardCut
  from={<SectionA />}
  to={<SectionB />}
  cutFrame={1120}
/>

<SlideReveal
  from={<SectionA />}
  to={<SectionB />}
  startFrame={1120}
  duration={28}
  direction="up"
  easing={easeOutExpo}
/>

<IrisWipe
  from={<SectionA />}
  to={<SectionB />}
  startFrame={1120}
  duration={56}
  center={{x: 960, y: 540}}
/>

<GlitchTransition
  from={<SectionA />}
  to={<SectionB />}
  startFrame={1120}
  duration={14}
  intensity={0.8}
/>

<MatchCut
  from={<ShapeA />}
  to={<ShapeB />}
  startFrame={1120}
  duration={28}
  morphPath={true}
/>
```

---

## 11. Quality Assurance Checklist

### Pre-Render Validation
- [ ] All TypeScript compiles (`npx tsc --noEmit`)
- [ ] No Remotion bundler warnings
- [ ] Composition registry lists all 3 compositions
- [ ] Beat timeline JSON validates against schema
- [ ] Audio file present and correct duration

### Post-Render Validation
- [ ] File size within expected range (±20%)
- [ ] Duration exactly 140.0s (ffprobe)
- [ ] Frame rate exactly 30 fps
- [ ] Audio present, stereo, 48kHz
- [ ] No black frames at start/end
- [ ] Key visual moments align to beat grid (±1 frame)
- [ ] 4K renders have 4× pixel count of 1080p

### Cross-Platform Testing
- [ ] Chrome/Edge (Windows, Mac, Linux)
- [ ] Firefox
- [ ] Safari (macOS, iOS)
- [ ] Mobile Chrome (Android)
- [ ] Reduced motion OS setting
- [ ] High contrast OS setting

---

## 12. Version Control & Collaboration

### Git Conventions
```
feat: new component or animation
design: visual polish, color/typography tweaks
perf: render optimization, bundle size
fix: bug in timing, sync, or rendering
docs: style guide, README, analysis updates
chore: config, deps, CI
```

### Branch Strategy
- `main` — production-ready renders
- `develop` — work-in-progress compositions
- `feature/*` — individual sections or components
- `release/v*` — tagged deliverable versions

### Asset Storage
- **Source**: Git LFS for `.mp3`, `.mp4` > 10MB
- **Renders**: `out/` (gitignored), uploaded to catbox/litterbox
- **Analysis**: Markdown in repo (small, diffable)

---

## 13. Future Extensibility

### Planned Enhancements
1. **WebGL Shader Layer** — Custom fragment shaders for advanced glitch/distortion
2. **Real-time Audio Analysis** — Web Audio API for live-reactive preview
3. **Component Playground** — Interactive Remotion Studio for tweaking params
4. **Multi-track Audio** — Stems (kick, bass, synth) for granular sync
5. **AI-Assisted Timing** — Beat detection refinement via ML
6. **Localization** — Text swap system for multi-language renders

### Integration Points
- **Pollinations AI** — Generate variant geometries/textures via `gpt-image-2`
- **Trellis 3D** — 3D assets for future 3D intro version
- **FFmpeg MCP** — Automated transcode, thumbnail extraction, GIF generation
- **Exa Search** — Reference gathering for design trends

---

*Style Guide Version 1.0 — NewEra AI Agent Intro Project*
*Full Vibe Aesthetic — "Clean. Precise. Synced."*