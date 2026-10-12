import React from 'react';
import {Composition, useCurrentFrame, useVideoConfig, Audio} from 'remotion';
import {
  Circle,
  Rect,
  Line,
  Arc,
  Grid,
  PulsingCircle,
  RotatingSquare,
  ExpandingRing,
  MorphingShape,
  ShapeGroup,
} from '../components/GeometricShapes';
import {
  Transition,
  Crossfade,
  Wipe,
  SlideTransition,
  MorphTransition,
} from '../components/Transitions';
import {
  Text,
  AnimatedText,
  TextSequence,
  GlitchText,
  TrackingText,
  SplitText,
} from '../components/Typography';
import {
  BEATS,
  MEASURES,
  KEY_MOMENTS,
  VISUAL_SYNC_POINTS,
  COLOR_PALETTE,
  TYPOGRAPHY,
  SPACING,
  getBeatAtTime,
  getMeasureAtTime,
  getSectionAtTime,
  getEnergyAtTime,
  getProgressInMeasure,
  getProgressInSection,
} from '../data/beats';
import {easings, lerp, clamp, mapRange} from '../utils/animation';

const WIDTH = 1920;
const HEIGHT = 1080;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const DURATION = 140; // seconds
const FPS = 30;

// Section components
const IntroSection: React.FC<{progress: number; energy: number}> = ({progress, energy}) => {
  const logoProgress = clamp(progress * 2, 0, 1);
  const textProgress = clamp((progress - 0.3) * 2, 0, 1);
  const shapeProgress = clamp((progress - 0.1) * 1.5, 0, 1);

  return (
    <ShapeGroup>
      {/* Background grid that fades in */}
      <Grid
        cols={20}
        rows={12}
        cellSize={96}
        color={COLOR_PALETTE.gray300}
        strokeWidth={1}
        opacity={energy * 0.3 * easings.easeOutExpo(progress)}
        offsetX={-480}
        offsetY={-288}
      />

      {/* Pulsing circles on downbeats */}
      {Array.from({length: 6}).map((_, i) => (
        <PulsingCircle
          key={`pulse-${i}`}
          x={CENTER_X + (i - 2.5) * 120}
          y={CENTER_Y}
          baseRadius={20}
          maxRadius={80 + energy * 100}
          progress={shapeProgress}
          color={COLOR_PALETTE.accent}
          strokeWidth={2}
          easing="easeOutExpo"
        />
      ))}

      {/* Main logo reveal */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 60}
        text="NewEra"
        progress={logoProgress}
        fontSize={TYPOGRAPHY.displayLarge.size}
        fontWeight={TYPOGRAPHY.displayLarge.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={TYPOGRAPHY.displayLarge.letterSpacing}
        animationType="scaleUp"
        easing="easeOutBack"
      />

      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y + 40}
        text="AI AGENT"
        progress={textProgress}
        fontSize={TYPOGRAPHY.headlineLarge.size}
        fontWeight={TYPOGRAPHY.headlineLarge.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.15}
        animationType="fadeUp"
        easing="easeOutExpo"
        delay={0.1}
      />

      {/* Accent line */}
      <Rect
        x={CENTER_X - 120 * easings.easeOutExpo(textProgress)}
        y={CENTER_Y + 100}
        width={240 * easings.easeOutExpo(textProgress)}
        height={3}
        fill={true}
        color={COLOR_PALETTE.accent}
        opacity={textProgress}
      />

      {/* Subtitle */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y + 130}
        text="Founded by Naman Soni"
        progress={clamp((progress - 0.5) * 2, 0, 1)}
        fontSize={TYPOGRAPHY.bodyLarge.size}
        fontWeight={TYPOGRAPHY.bodyLarge.weight}
        color={COLOR_PALETTE.gray600}
        letterSpacing={0.05}
        animationType="fadeUp"
        easing="easeOutCubic"
        delay={0.2}
      />
    </ShapeGroup>
  );
};

const BuildSection: React.FC<{progress: number; energy: number; measureProgress: number}> = ({progress, energy, measureProgress}) => {
  const gridProgress = clamp(progress * 1.2, 0, 1);
  const textProgress = clamp((progress - 0.2) * 1.5, 0, 1);
  const lineProgress = clamp((progress - 0.1) * 2, 0, 1);
  const tensionProgress = easings.easeInExpo(progress);

  return (
    <ShapeGroup>
      {/* Expanding grid */}
      <Grid
        cols={30}
        rows={18}
        cellSize={64}
        color={COLOR_PALETTE.gray400}
        strokeWidth={1}
        opacity={energy * 0.4 * gridProgress}
        offsetX={-480}
        offsetY={-288}
      />

      {/* Rotating squares on beat */}
      {Array.from({length: 8}).map((_, i) => (
        <RotatingSquare
          key={`rot-${i}`}
          x={CENTER_X + Math.cos((i / 8) * Math.PI * 2) * 200 * energy}
          y={CENTER_Y + Math.sin((i / 8) * Math.PI * 2) * 200 * energy}
          size={40 + energy * 60}
          progress={measureProgress}
          color={COLOR_PALETTE.accent}
          strokeWidth={2}
          rotations={energy}
          easing="easeInOutCubic"
        />
      ))}

      {/* Horizontal lines building up */}
      {Array.from({length: 12}).map((_, i) => (
        <Line
          key={`hline-${i}`}
          x1={CENTER_X - 400 * easings.easeOutExpo(lineProgress)}
          y1={CENTER_Y - 200 + i * 40}
          x2={CENTER_X + 400 * easings.easeOutExpo(lineProgress)}
          y2={CENTER_Y - 200 + i * 40}
          color={i % 3 === 0 ? COLOR_PALETTE.accent : COLOR_PALETTE.gray500}
          strokeWidth={i % 3 === 0 ? 3 : 1}
          opacity={energy * 0.6 * lineProgress}
        />
      ))}

      {/* Vertical lines */}
      {Array.from({length: 16}).map((_, i) => (
        <Line
          key={`vline-${i}`}
          x1={CENTER_X - 300 + i * 40}
          y1={CENTER_Y - 150 * easings.easeOutExpo(lineProgress)}
          x2={CENTER_X - 300 + i * 40}
          y2={CENTER_Y + 150 * easings.easeOutExpo(lineProgress)}
          color={COLOR_PALETTE.gray500}
          strokeWidth={1}
          opacity={energy * 0.4 * lineProgress}
        />
      ))}

      {/* Building text */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 180}
        text="BUILDING"
        progress={textProgress}
        fontSize={TYPOGRAPHY.displayMedium.size}
        fontWeight={TYPOGRAPHY.displayMedium.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={0.2}
        animationType="fadeUp"
        easing="easeOutExpo"
      />

      {/* Progress indicator */}
      <Rect
        x={CENTER_X - 300}
        y={CENTER_Y + 200}
        width={600 * tensionProgress}
        height={4}
        fill={true}
        color={COLOR_PALETTE.accent}
      />

      {/* Energy circles */}
      {Array.from({length: 4}).map((_, i) => (
        <Circle
          key={`energy-${i}`}
          x={CENTER_X - 200 + i * 133}
          y={CENTER_Y + 220}
          radius={8 + energy * 20}
          color={COLOR_PALETTE.accent}
          fill={true}
          opacity={energy * (1 - i * 0.2)}
        />
      ))}
    </ShapeGroup>
  );
};

const DropSection: React.FC<{progress: number; energy: number; measureProgress: number; isSecondDrop: boolean}> = ({progress, energy, measureProgress, isSecondDrop}) => {
  const explosionProgress = easings.easeOutExpo(progress);
  const patternProgress = measureProgress;
  const typographyProgress = clamp((progress - 0.1) * 1.2, 0, 1);

  return (
    <ShapeGroup>
      {/* Massive expanding rings on downbeats */}
      {Array.from({length: 6}).map((_, i) => (
        <ExpandingRing
          key={`ring-${i}`}
          x={CENTER_X}
          y={CENTER_Y}
          startRadius={50 + i * 100}
          endRadius={800 + i * 200}
          progress={patternProgress}
          color={COLOR_PALETTE.accent}
          strokeWidth={isSecondDrop ? 6 : 4}
          opacity={energy * 0.8 * (1 - i * 0.15)}
          easing="easeOutExpo"
        />
      ))}

      {/* Geometric explosion - morphing shapes */}
      {Array.from({length: 12}).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 150 + explosionProgress * 400;
        return (
          <MorphingShape
            key={`morph-${i}`}
            x={CENTER_X + Math.cos(angle) * distance}
            y={CENTER_Y + Math.sin(angle) * distance}
            size={30 + energy * 50}
            progress={patternProgress}
            color={i % 2 === 0 ? COLOR_PALETTE.accent : COLOR_PALETTE.foreground}
            strokeWidth={3}
            fill={i % 3 === 0}
            sides={3 + Math.floor(patternProgress * 4)}
          />
        );
      })}

      {/* Central pulsing core */}
      <PulsingCircle
        x={CENTER_X}
        y={CENTER_Y}
        baseRadius={100}
        maxRadius={300}
        progress={measureProgress}
        color={COLOR_PALETTE.accent}
        fill={false}
        strokeWidth={4}
        easing="easeOutExpo"
      />

      {/* Inner rotating squares */}
      {Array.from({length: 3}).map((_, i) => (
        <RotatingSquare
          key={`core-rot-${i}`}
          x={CENTER_X}
          y={CENTER_Y}
          size={200 - i * 60}
          progress={measureProgress * (i + 1)}
          color={COLOR_PALETTE.foreground}
          strokeWidth={2}
          rotations={isSecondDrop ? 2 : 1}
          easing="easeInOutCubic"
        />
      ))}

      {/* Main typography lock */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 200}
        text={isSecondDrop ? "NEVER STOP" : "NEWERA"}
        progress={typographyProgress}
        fontSize={TYPOGRAPHY.displayLarge.size}
        fontWeight={TYPOGRAPHY.displayLarge.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={-0.01}
        animationType="scaleUp"
        easing="easeOutBack"
      />

      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 100}
        text={isSecondDrop ? "BUILDING THE FUTURE" : "AI AGENT"}
        progress={clamp((progress - 0.2) * 1.5, 0, 1)}
        fontSize={TYPOGRAPHY.headlineMedium.size}
        fontWeight={TYPOGRAPHY.headlineMedium.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.1}
        animationType="fadeUp"
        easing="easeOutExpo"
      />

      {/* Glitch effect on key moments */}
      <GlitchText
        x={CENTER_X}
        y={CENTER_Y + 100}
        text={isSecondDrop ? "FULL VIBE" : "AURA FARMING"}
        progress={progress}
        intensity={energy * 2}
        fontSize={TYPOGRAPHY.headlineSmall.size}
        fontWeight={TYPOGRAPHY.headlineSmall.weight}
        color={COLOR_PALETTE.foreground}
        glitchColor={COLOR_PALETTE.accent}
        letterSpacing={0.05}
      />

      {/* Radial lines */}
      {Array.from({length: 36}).map((_, i) => {
        const angle = (i / 36) * Math.PI * 2;
        const innerRadius = 100 + explosionProgress * 100;
        const outerRadius = 200 + explosionProgress * 300;
        return (
          <Line
            key={`radial-${i}`}
            x1={CENTER_X + Math.cos(angle) * innerRadius}
            y1={CENTER_Y + Math.sin(angle) * innerRadius}
            x2={CENTER_X + Math.cos(angle) * outerRadius}
            y2={CENTER_Y + Math.sin(angle) * outerRadius}
            color={i % 2 === 0 ? COLOR_PALETTE.accent : COLOR_PALETTE.gray400}
            strokeWidth={i % 2 === 0 ? 3 : 1}
            opacity={energy * 0.6 * explosionProgress}
          />
        );
      })}
    </ShapeGroup>
  );
};

const BreakdownSection: React.FC<{progress: number; energy: number; measureProgress: number}> = ({progress, energy, measureProgress}) => {
  const atmosphericProgress = easings.easeInOutCubic(progress);
  const textProgress = clamp((progress - 0.1) * 1.2, 0, 1);
  const minimalProgress = easings.easeOutExpo(progress);

  return (
    <ShapeGroup>
      {/* Minimal grid */}
      <Grid
        cols={40}
        rows={24}
        cellSize={48}
        color={COLOR_PALETTE.gray200}
        strokeWidth={0.5}
        opacity={energy * 0.2 * minimalProgress}
        offsetX={-480}
        offsetY={-288}
      />

      {/* Slow rotating large shapes */}
      <RotatingSquare
        x={CENTER_X}
        y={CENTER_Y}
        size={400}
        progress={progress * 0.1}
        color={COLOR_PALETTE.gray300}
        strokeWidth={1}
        rotations={0.2}
        easing="linear"
      />

      <Circle
        x={CENTER_X}
        y={CENTER_Y}
        radius={300 + Math.sin(progress * Math.PI * 2) * 50}
        color={COLOR_PALETTE.accent}
        strokeWidth={2}
        opacity={energy * 0.4}
      />

      {/* Melodic focus text */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 150}
        text="BREATHE"
        progress={textProgress}
        fontSize={TYPOGRAPHY.displayMedium.size}
        fontWeight={TYPOGRAPHY.displayMedium.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={0.3}
        animationType="fadeUp"
        easing="easeOutExpo"
      />

      <TextSequence
        x={CENTER_X}
        y={CENTER_Y - 50}
        texts={["minimal", "precise", "powerful", "newera"]}
        progress={progress}
        fontSize={TYPOGRAPHY.titleLarge.size}
        fontWeight={TYPOGRAPHY.titleLarge.weight}
        color={COLOR_PALETTE.gray500}
        letterSpacing={0.1}
        durationPerText={0.2}
        gap={0.05}
        animationType="crossfade"
        easing="easeInOutCubic"
      />

      {/* Slow expanding rings */}
      {Array.from({length: 3}).map((_, i) => (
        <ExpandingRing
          key={`break-ring-${i}`}
          x={CENTER_X}
          y={CENTER_Y}
          startRadius={100 + i * 150}
          endRadius={600 + i * 150}
          progress={(progress + i * 0.3) % 1}
          color={COLOR_PALETTE.accentDim}
          strokeWidth={1}
          opacity={energy * 0.3}
          easing="easeInOutCubic"
        />
      ))}

      {/* Breathing circle */}
      <Circle
        x={CENTER_X}
        y={CENTER_Y + 200}
        radius={40 + Math.sin(progress * Math.PI * 4) * 20 * energy}
        color={COLOR_PALETTE.accent}
        fill={true}
        opacity={energy * 0.8}
      />
    </ShapeGroup>
  );
};

const OutroSection: React.FC<{progress: number; energy: number}> = ({progress, energy}) => {
  const fadeProgress = easings.easeOutExpo(progress);
  const logoProgress = clamp((progress - 0.3) * 2, 0, 1);

  return (
    <ShapeGroup>
      {/* Fading grid */}
      <Grid
        cols={20}
        rows={12}
        cellSize={96}
        color={COLOR_PALETTE.gray300}
        strokeWidth={1}
        opacity={energy * 0.3 * (1 - fadeProgress)}
        offsetX={-480}
        offsetY={-288}
      />

      {/* Final logo */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 60}
        text="NewEra"
        progress={logoProgress}
        fontSize={TYPOGRAPHY.displayLarge.size}
        fontWeight={TYPOGRAPHY.displayLarge.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={TYPOGRAPHY.displayLarge.letterSpacing}
        animationType="scaleUp"
        easing="easeOutBack"
      />

      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y + 40}
        text="AI AGENT"
        progress={clamp((progress - 0.4) * 2, 0, 1)}
        fontSize={TYPOGRAPHY.headlineLarge.size}
        fontWeight={TYPOGRAPHY.headlineLarge.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.15}
        animationType="fadeUp"
        easing="easeOutExpo"
      />

      {/* Final accent line */}
      <Rect
        x={CENTER_X - 120 * easings.easeOutExpo(clamp((progress - 0.4) * 2, 0, 1))}
        y={CENTER_Y + 100}
        width={240 * easings.easeOutExpo(clamp((progress - 0.4) * 2, 0, 1))}
        height={3}
        fill={true}
        color={COLOR_PALETTE.accent}
        opacity={clamp((progress - 0.4) * 2, 0, 1)}
      />

      {/* Website */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y + 130}
        text="newera.namansoni.in"
        progress={clamp((progress - 0.6) * 2.5, 0, 1)}
        fontSize={TYPOGRAPHY.bodyLarge.size}
        fontWeight={TYPOGRAPHY.bodyLarge.weight}
        color={COLOR_PALETTE.gray600}
        letterSpacing={0.1}
        animationType="fadeUp"
        easing="easeOutCubic"
      />

      {/* Final pulsing ring */}
      <ExpandingRing
        x={CENTER_X}
        y={CENTER_Y}
        startRadius={200}
        endRadius={800}
        progress={progress}
        color={COLOR_PALETTE.accent}
        strokeWidth={2}
        opacity={energy * 0.5}
        easing="easeOutExpo"
      />
    </ShapeGroup>
  );
};

// Main composition component
export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const currentTime = frame / videoConfig.fps;
  const section = getSectionAtTime(currentTime);
  const energy = getEnergyAtTime(currentTime);
  const measure = getMeasureAtTime(currentTime);
  const measureProgress = measure ? getProgressInMeasure(currentTime) : 0;
  const sectionProgress = getProgressInSection(currentTime);

  // Section-specific progress
  const sectionProgressNormalized = (() => {
    switch (section) {
      case 'intro':
        return clamp(currentTime / 15, 0, 1);
      case 'build':
        return clamp((currentTime - 15) / 30, 0, 1);
      case 'drop':
        return clamp((currentTime - 45) / 30, 0, 1);
      case 'breakdown':
        return clamp((currentTime - 75) / 30, 0, 1);
      case 'drop2':
        return clamp((currentTime - 105) / 30, 0, 1);
      case 'outro':
        return clamp((currentTime - 135) / 5, 0, 1);
      default:
        return 0;
    }
  })();

  return (
    <>
      <Audio src="../../life_force.mp3" />
      
      {/* Background */}
      <Rect
        x={0}
        y={0}
        width={WIDTH}
        height={HEIGHT}
        fill={true}
        color={COLOR_PALETTE.background}
      />

      {/* Section content */}
      {section === 'intro' && (
        <IntroSection progress={sectionProgressNormalized} energy={energy} />
      )}
      {section === 'build' && (
        <BuildSection progress={sectionProgressNormalized} energy={energy} measureProgress={measureProgress} />
      )}
      {section === 'drop' && (
        <DropSection progress={sectionProgressNormalized} energy={energy} measureProgress={measureProgress} isSecondDrop={false} />
      )}
      {section === 'breakdown' && (
        <BreakdownSection progress={sectionProgressNormalized} energy={energy} measureProgress={measureProgress} />
      )}
      {section === 'drop2' && (
        <DropSection progress={sectionProgressNormalized} energy={energy} measureProgress={measureProgress} isSecondDrop={true} />
      )}
      {section === 'outro' && (
        <OutroSection progress={sectionProgressNormalized} energy={energy} />
      )}

      {/* Global transition overlays on section boundaries */}
      {VISUAL_SYNC_POINTS.map((syncPoint) => {
        const timeDiff = Math.abs(currentTime - syncPoint.time);
        const transitionDuration = 0.5;
        if (timeDiff < transitionDuration && syncPoint.type === 'transition') {
          const transProgress = 1 - timeDiff / transitionDuration;
          return (
            <Transition
              key={`trans-${syncPoint.time}`}
              progress={transProgress}
              children={null}
              type="iris"
              direction="in"
              color={COLOR_PALETTE.background}
              easing="easeInOutCubic"
            />
          );
        }
        return null;
      })}

      {/* Beat flash on downbeats */}
      {BEATS.filter(b => b.type === 'downbeat' && Math.abs(b.time - currentTime) < 0.1).map((beat) => (
        <ExpandingRing
          key={`beat-flash-${beat.time}`}
          x={CENTER_X}
          y={CENTER_Y}
          startRadius={0}
          endRadius={100}
          progress={(currentTime - beat.time) / 0.1}
          color={COLOR_PALETTE.accent}
          strokeWidth={4}
          opacity={beat.intensity * 0.5}
          easing="easeOutExpo"
        />
      ))}
    </>
  );
};

// Export composition for Remotion
const composition = (
  <Composition
    id="MainComposition"
    component={MainComposition}
    durationInFrames={DURATION * FPS}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{}}
  />
);

export default composition;
