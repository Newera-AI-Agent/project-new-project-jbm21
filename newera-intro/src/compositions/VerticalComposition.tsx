import React from 'react';
import {Composition, useCurrentFrame, useVideoConfig, Audio, staticFile} from 'remotion';
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

const audioSrc = staticFile('life_force.mp3');

const WIDTH = 1080;
const HEIGHT = 1920;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const DURATION = 140;
const FPS = 30;

// Vertical layout sections - adapted from MainComposition
const IntroSectionVertical: React.FC<{progress: number; energy: number}> = ({progress, energy}) => {
  const logoProgress = clamp(progress * 2, 0, 1);
  const textProgress = clamp((progress - 0.3) * 2, 0, 1);
  const shapeProgress = clamp((progress - 0.1) * 1.5, 0, 1);

  return (
    <ShapeGroup>
      {/* Background grid that fades in */}
      <Grid
        cols={12}
        rows={20}
        cellSize={90}
        color={COLOR_PALETTE.gray300}
        strokeWidth={1}
        opacity={energy * 0.3 * easings.easeOutExpo(progress)}
        offsetX={-270}
        offsetY={-450}
      />

      {/* Pulsing circles on downbeats */}
      {Array.from({length: 4}).map((_, i) => (
        <PulsingCircle
          key={`pulse-${i}`}
          x={CENTER_X}
          y={CENTER_Y - 200 + i * 150}
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
        y={CENTER_Y - 300}
        text="NewEra"
        progress={logoProgress}
        fontSize={TYPOGRAPHY.displayLarge.size * 1.2}
        fontWeight={TYPOGRAPHY.displayLarge.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={TYPOGRAPHY.displayLarge.letterSpacing}
        animationType="scaleUp"
        easing="easeOutBack"
      />

      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 180}
        text="AI AGENT"
        progress={textProgress}
        fontSize={TYPOGRAPHY.headlineLarge.size * 1.1}
        fontWeight={TYPOGRAPHY.headlineLarge.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.15}
        animationType="fadeUp"
        easing="easeOutExpo"
        delay={0.1}
      />

      {/* Accent line */}
      <Rect
        x={CENTER_X - 150 * easings.easeOutExpo(textProgress)}
        y={CENTER_Y - 100}
        width={300 * easings.easeOutExpo(textProgress)}
        height={4}
        fill={true}
        color={COLOR_PALETTE.accent}
        opacity={textProgress}
      />

      {/* Subtitle */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 40}
        text="Founded by Naman Soni"
        progress={clamp((progress - 0.5) * 2, 0, 1)}
        fontSize={TYPOGRAPHY.bodyLarge.size * 1.2}
        fontWeight={TYPOGRAPHY.bodyLarge.weight}
        color={COLOR_PALETTE.gray600}
        letterSpacing={0.05}
        animationType="fadeUp"
        easing="easeOutCubic"
        delay={0.2}
      />

      {/* Website */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y + 40}
        text="newera.namansoni.in"
        progress={clamp((progress - 0.6) * 2, 0, 1)}
        fontSize={TYPOGRAPHY.bodyMedium.size * 1.1}
        fontWeight={TYPOGRAPHY.bodyMedium.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.1}
        animationType="fadeUp"
        easing="easeOutCubic"
        delay={0.3}
      />

      {/* Decorative elements at bottom */}
      {Array.from({length: 3}).map((_, i) => (
        <ExpandingRing
          key={`deco-${i}`}
          x={CENTER_X}
          y={CENTER_Y + 400}
          startRadius={50 + i * 80}
          endRadius={300 + i * 100}
          progress={shapeProgress}
          color={COLOR_PALETTE.accent}
          strokeWidth={2}
          opacity={energy * 0.4 * (1 - i * 0.2)}
          easing="easeOutExpo"
        />
      ))}
    </ShapeGroup>
  );
};

const BuildSectionVertical: React.FC<{progress: number; energy: number; measureProgress: number}> = ({progress, energy, measureProgress}) => {
  const gridProgress = clamp(progress * 1.2, 0, 1);
  const textProgress = clamp((progress - 0.2) * 1.5, 0, 1);
  const lineProgress = clamp((progress - 0.1) * 2, 0, 1);
  const tensionProgress = easings.easeInExpo(progress);

  return (
    <ShapeGroup>
      {/* Expanding grid */}
      <Grid
        cols={16}
        rows={28}
        cellSize={60}
        color={COLOR_PALETTE.gray400}
        strokeWidth={1}
        opacity={energy * 0.4 * gridProgress}
        offsetX={-240}
        offsetY={-420}
      />

      {/* Rotating squares on beat */}
      {Array.from({length: 6}).map((_, i) => (
        <RotatingSquare
          key={`rot-${i}`}
          x={CENTER_X + Math.cos((i / 6) * Math.PI * 2) * 180 * energy}
          y={CENTER_Y - 100 + Math.sin((i / 6) * Math.PI * 2) * 180 * energy}
          size={40 + energy * 60}
          progress={measureProgress}
          color={COLOR_PALETTE.accent}
          strokeWidth={2}
          rotations={energy}
          easing="easeInOutCubic"
        />
      ))}

      {/* Horizontal lines building up */}
      {Array.from({length: 10}).map((_, i) => (
        <Line
          key={`hline-${i}`}
          x1={CENTER_X - 350 * easings.easeOutExpo(lineProgress)}
          y1={CENTER_Y - 300 + i * 60}
          x2={CENTER_X + 350 * easings.easeOutExpo(lineProgress)}
          y2={CENTER_Y - 300 + i * 60}
          color={i % 3 === 0 ? COLOR_PALETTE.accent : COLOR_PALETTE.gray500}
          strokeWidth={i % 3 === 0 ? 3 : 1}
          opacity={energy * 0.6 * lineProgress}
        />
      ))}

      {/* Building text */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 400}
        text="BUILDING"
        progress={textProgress}
        fontSize={TYPOGRAPHY.displayMedium.size * 1.1}
        fontWeight={TYPOGRAPHY.displayMedium.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={0.2}
        animationType="fadeUp"
        easing="easeOutExpo"
      />

      {/* Progress indicator */}
      <Rect
        x={CENTER_X - 250}
        y={CENTER_Y + 300}
        width={500 * tensionProgress}
        height={4}
        fill={true}
        color={COLOR_PALETTE.accent}
      />

      {/* Energy circles */}
      {Array.from({length: 4}).map((_, i) => (
        <Circle
          key={`energy-${i}`}
          x={CENTER_X - 180 + i * 120}
          y={CENTER_Y + 330}
          radius={8 + energy * 20}
          color={COLOR_PALETTE.accent}
          fill={true}
          opacity={energy * (1 - i * 0.2)}
        />
      ))}
    </ShapeGroup>
  );
};

const DropSectionVertical: React.FC<{progress: number; energy: number; measureProgress: number; isSecondDrop: boolean}> = ({progress, energy, measureProgress, isSecondDrop}) => {
  const explosionProgress = easings.easeOutExpo(progress);
  const patternProgress = measureProgress;
  const typographyProgress = clamp((progress - 0.1) * 1.2, 0, 1);

  return (
    <ShapeGroup>
      {/* Massive expanding rings on downbeats */}
      {Array.from({length: 8}).map((_, i) => (
        <ExpandingRing
          key={`ring-${i}`}
          x={CENTER_X}
          y={CENTER_Y}
          startRadius={50 + i * 80}
          endRadius={1200 + i * 150}
          progress={patternProgress}
          color={COLOR_PALETTE.accent}
          strokeWidth={isSecondDrop ? 6 : 4}
          opacity={energy * 0.8 * (1 - i * 0.12)}
          easing="easeOutExpo"
        />
      ))}

      {/* Particle burst */}
      {Array.from({length: 20}).map((_, i) => (
        <Circle
          key={`particle-${i}`}
          x={CENTER_X + Math.cos((i / 20) * Math.PI * 2) * 400 * explosionProgress}
          y={CENTER_Y + Math.sin((i / 20) * Math.PI * 2) * 400 * explosionProgress}
          radius={4 + energy * 12}
          color={i % 2 === 0 ? COLOR_PALETTE.accent : COLOR_PALETTE.foreground}
          fill={true}
          opacity={energy * (1 - explosionProgress) * 0.8}
        />
      ))}

      {/* Main drop text */}
      <GlitchText
        x={CENTER_X}
        y={CENTER_Y - 200}
        text="DROP"
        progress={typographyProgress}
        fontSize={TYPOGRAPHY.displayLarge.size * 1.5}
        fontWeight={TYPOGRAPHY.displayLarge.weight}
        color={COLOR_PALETTE.foreground}
        glitchIntensity={energy * 0.5}
        glitchColor={COLOR_PALETTE.accent}
      />

      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 100}
        text="NEWERA AI AGENT"
        progress={typographyProgress}
        fontSize={TYPOGRAPHY.headlineLarge.size * 1.1}
        fontWeight={TYPOGRAPHY.headlineLarge.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.15}
        animationType="scaleUp"
        easing="easeOutBack"
        delay={0.05}
      />

      {/* Beat-reactive bars at bottom */}
      {Array.from({length: 16}).map((_, i) => (
        <Rect
          key={`bar-${i}`}
          x={CENTER_X - 400 + i * 50}
          y={CENTER_Y + 500 - energy * 300}
          width={30}
          height={energy * 400}
          fill={true}
          color={i % 4 === 0 ? COLOR_PALETTE.accent : COLOR_PALETTE.gray600}
          opacity={energy * 0.7}
        />
      ))}
    </ShapeGroup>
  );
};

const BreakdownSectionVertical: React.FC<{progress: number; energy: number; measureProgress: number}> = ({progress, energy, measureProgress}) => {
  const calmProgress = easings.easeInOutSine(progress);
  const textProgress = clamp((progress - 0.1) * 1.5, 0, 1);
  const ringProgress = measureProgress;

  return (
    <ShapeGroup>
      {/* Subtle grid */}
      <Grid
        cols={14}
        rows={24}
        cellSize={70}
        color={COLOR_PALETTE.gray400}
        strokeWidth={0.5}
        opacity={energy * 0.2 * calmProgress}
        offsetX={-245}
        offsetY={-420}
      />

      {/* Slow rotating morphing shapes */}
      {Array.from({length: 3}).map((_, i) => (
        <MorphingShape
          key={`morph-${i}`}
          x={CENTER_X + (i - 1) * 250}
          y={CENTER_Y - 100}
          progress={ringProgress}
          color={i === 1 ? COLOR_PALETTE.accent : COLOR_PALETTE.gray600}
          strokeWidth={2}
          sides={3 + i}
          easing="easeInOutSine"
        />
      ))}

      {/* Breakdown text */}
      <TrackingText
        x={CENTER_X}
        y={CENTER_Y - 300}
        text="BREAKDOWN"
        progress={textProgress}
        fontSize={TYPOGRAPHY.displayMedium.size * 1.1}
        fontWeight={TYPOGRAPHY.displayMedium.weight}
        color={COLOR_PALETTE.foreground}
        maxTracking={0.5}
        easing="easeOutExpo"
      />
    </ShapeGroup>
  );
};

export const VerticalComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const progress = frame / videoConfig.durationInFrames;
  const energy = getEnergyAtTime(frame / FPS);
  const measureProgress = getProgressInMeasure(frame / FPS);
  const section = getSectionAtTime(frame / FPS);
  const sectionProgress = getProgressInSection(frame / FPS);
  const isSecondDrop = section === 'drop2';

  return (
    <>
      <Audio src={audioSrc} />
      {section === 'intro' && <IntroSectionVertical progress={sectionProgress} energy={energy} />}
      {section === 'build' && <BuildSectionVertical progress={sectionProgress} energy={energy} measureProgress={measureProgress} />}
      {(section === 'drop1' || section === 'drop2') && (
        <DropSectionVertical
          progress={sectionProgress}
          energy={energy}
          measureProgress={measureProgress}
          isSecondDrop={isSecondDrop}
        />
      )}
      {section === 'breakdown' && <BreakdownSectionVertical progress={sectionProgress} energy={energy} measureProgress={measureProgress} />}
      {section === 'outro' && <IntroSectionVertical progress={1 - sectionProgress} energy={energy * 0.5} />}
    </>
  );
};

export const VerticalComp = () => (
  <Composition
    id="VerticalComposition"
    component={VerticalComposition}
    durationInFrames={DURATION * FPS}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{}}
  />
);