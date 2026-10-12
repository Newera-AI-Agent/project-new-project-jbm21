## Progress so far
### Decisions
- **Video Engine**: Remotion v4 – React components → video, TypeScript-native, frame-accurate.  
- **Language**: TypeScript + TSX for type-safe timing math.  
- **Styling**: Inline styles + CSS custom properties (zero runtime, frame-perfect control).  
- **Audio**: FFmpeg concat (Remotion internal) – sample-accurate sync.  
- **Easing**: Custom sine/expo/circ/back functions – non-linear motion required by Full Vibe.  
- **Build**: npm scripts + `npx remotion render` – reproducible, CI-friendly.  
- **File layout**: `newera-intro/` with `src/index.tsx`, `src/compositions/`, `src/components/`, `src/data/`, `src/utils/`, `public/`, `out/`, docs (`FULL_VIBE_STYLE_GUIDE.md`, `MAKING_OF.md`, `LIFE_FORCE_BEAT_ANALYSIS.md`, `MANUS_2.0_ANALYSIS.md`), `showcase.html`, `package.json`, `remotion.config.ts`, `tsconfig.json`.  
- **Naming convention**: `newera-intro_[variant]_[version].[ext]` (e.g. `newera-intro_4k_landscape_v1.mp4`).  
- **Trade-offs**: Remotion gives precise control but higher memory per frame; `concurrency=4` optimal for 4 vCPU/16 GB RAM; 4K renders need `--scale=2`; external hosting (litterbox.catbox.moe) keeps repo light.  

### Files written or changed
- `newera-intro/FULL_VIBE_STYLE_GUIDE.md` — 545-line style guide covering colour system, typography, motion principles, geometry library, composition & layout, video specifications, component API, QA checklist, version-control conventions, and future extensibility.  
- `newera-intro/MAKING_OF.md` — 440-line making-of document covering project genesis, technical architecture, composition design (3 compositions, 10 sections), component engineering (14 primitives), beat-sync implementation, render pipeline, challenges & solutions, quality metrics, asset delivery, lessons learned, credits, and future work.  
- `newera-intro/out/video.mp4` — 37 MB, 1920x1080, 30 fps, 140 s, hero deliverable.  
- `newera-intro/out/video_vertical.mp4` — 16 MB, 1080x1920, 30 fps, 140 s, social-media variant.  
- `newera-intro/out/video_4k.mp4` — 81 MB, 3840x2160, 30 fps, 140 s, 4K landscape archive.  
- `newera-intro/out/video_4k_vertical.mp4` — 35 MB, 2160x3840, 30 fps, 140 s, 4K vertical.  
- `newera-intro/out/poster_frame.png` — 193 KB, 1920x1080 PNG, thumbnail/OG image.  
- `newera-intro/out/video_webm.webm` — 31.7 MB, VP9 codec, 30 fps, 140 s, web fallback.  
- `newera-intro/out/loop_final.gif` — 1.9 MB, 480x270, 15 fps, 5 s loop, GIF loop variant generated.  
- `newera-intro/src/compositions/GifLoopComposition.tsx` — 212-line GIF loop composition for 5-second loop (480x270, 15 fps), using custom animation utilities from `src/utils/animation.ts`.  
- `newera-intro/src/index.tsx` — registered `GifLoopComposition` as a new composition.  

### Verified facts
- `cd newera-intro && npx remotion render src/index.tsx MainComposition out/video_4k.mp4 --concurrency=4 --scale=2` — exit 0, rendered 4200 frames, output 81.4 MB.  
- `cd newera-intro && npx remotion render src/index.tsx VerticalComposition out/video_4k_vertical.mp4 --concurrency=4 --scale=2` — exit 0, rendered 4200 frames, output 35.4 MB.  
- `ls -la newera-intro/out/` — exit 0, listed all video files + poster + GIF.  
- `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 out/video.mp4` → `140.000000`.  
- `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 out/video.mp4` → `1920,1080,30/1`.  
- `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of csv=p=0 out/video.mp4` → `aac,48000,2`.  
- URLs that work: `https://litter.catbox.moe/fhjxv5.mp4` (landscape 1080p), `https://litter.catbox.moe/v7wlez.mp4` (vertical 1080p), `https://litter.catbox.moe/6wwxmx.png` (poster).  
- Errors already diagnosed and resolved:  
  - Remotion `interpolateColor` → `interpolateColors` API change; fixed globally across `Typography.tsx`, `GeometricShapes.tsx`, `Transitions.tsx`.  
  - Vertical composition not registering; resolved by single `RemotionRoot` wrapper with all three `<Composition>` children.  
  - TypeScript prop mismatches (`glitchIntensity`→`intensity`, `maxTracking`→`maxLetterSpacing`); fixed systematically.  
  - 4K memory pressure; `--concurrency=4` with 16 GB RAM works; `--scale=2` handles resolution correctly.  
  - GIF loop export fixed by removing Remotion `Interpolate`/`spring` imports and using project-specific animation utilities (`easings`, `lerp`, `mapRange`, `clamp`, `easings.easeInOutSine`).  

### Open items
- Burn-in subtitle track for accessibility.  
- Apply HDR grade (PQ/BT.2100) to 4K deliverable.  
- Implement WebGL shader layer for advanced glitch/distortion effects.  
- Build real-time preview with Web Audio API.  
- Create multi-language text-swap system.  
- Develop component playground (Storybook-style) for interactive tweaking.  
- Set up automated QA (frame-diff comparison against reference renders).  
- Explore cloud render farm for parallel 4K rendering.  
- (Longer term) 3D version with Trellis-generated assets, AI-assisted beat refinement, generative variation engine, live performance mode (MIDI/OSC control).