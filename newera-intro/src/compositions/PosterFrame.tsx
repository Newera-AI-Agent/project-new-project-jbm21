import React from 'react';
import {Composition, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
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
  Text,
  AnimatedText,
  TextSequence,
  GlitchText,
  TrackingText,
  SplitText,
} from '../components/Typography';
import {
  COLOR_PALETTE,
  TYPOGRAPHY,
} from '../data/beats';
import {easings, lerp, clamp, mapRange} from '../utils/animation';

const WIDTH = 1920;
const HEIGHT = 1080;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

// Static poster frame - captures the peak moment (first drop)
export const PosterFrame: React.FC = () => {
  // Use a fixed progress at the first drop peak (around 33% through)
  const energy = 0.85;
  const progress = 0.8;

  return (
    <ShapeGroup>
      {/* Background */}
      <Rect
        x={0}
        y={0}
        width={WIDTH}
        height={HEIGHT}
        fill={true}
        color={COLOR_PALETTE.background}
      />

      {/* Subtle grid */}
      <Grid
        cols={24}
        rows={14}
        cellSize={80}
        color={COLOR_PALETTE.gray400}
        strokeWidth={0.5}
        opacity={0.15}
        offsetX={-480}
        offsetY={-280}
      />

      {/* Expanding rings at peak */}
      {Array.from({length: 5}).map((_, i) => (
        <ExpandingRing
          key={`poster-ring-${i}`}
          x={CENTER_X}
          y={CENTER_Y}
          startRadius={80 + i * 120}
          endRadius={600 + i * 150}
          progress={0.7}
          color={COLOR_PALETTE.accent}
          strokeWidth={i === 0 ? 4 : 2}
          opacity={energy * 0.6 * (1 - i * 0.15)}
          easing="easeOutExpo"
        />
      ))}

      {/* Rotating squares */}
      {Array.from({length: 8}).map((_, i) => (
        <RotatingSquare
          key={`poster-rot-${i}`}
          x={CENTER_X + Math.cos((i / 8) * Math.PI * 2) * 180 * energy}
          y={CENTER_Y + Math.sin((i / 8) * Math.PI * 2) * 180 * energy}
          size={50 + energy * 40}
          progress={0.5}
          color={COLOR_PALETTE.accent}
          strokeWidth={2}
          rotations={energy * 0.5}
          easing="easeInOutCubic"
        />
      ))}

      {/* Particle burst */}
      {Array.from({length: 16}).map((_, i) => (
        <Circle
          key={`poster-particle-${i}`}
          x={CENTER_X + Math.cos((i / 16) * Math.PI * 2) * 350 * 0.8}
          y={CENTER_Y + Math.sin((i / 16) * Math.PI * 2) * 350 * 0.8}
          radius={4 + energy * 10}
          color={i % 3 === 0 ? COLOR_PALETTE.accent : COLOR_PALETTE.foreground}
          fill={true}
          opacity={energy * 0.5}
        />
      ))}

      {/* Main title */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 120}
        text="NewEra"
        progress={1}
        fontSize={TYPOGRAPHY.displayLarge.size * 1.3}
        fontWeight={TYPOGRAPHY.displayLarge.weight}
        color={COLOR_PALETTE.foreground}
        letterSpacing={TYPOGRAPHY.displayLarge.letterSpacing}
        animationType="scaleUp"
        easing="easeOutBack"
      />

      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y - 20}
        text="AI AGENT"
        progress={1}
        fontSize={TYPOGRAPHY.headlineLarge.size * 1.2}
        fontWeight={TYPOGRAPHY.headlineLarge.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.15}
        animationType="fadeUp"
        easing="easeOutExpo"
      />

      {/* Accent line */}
      <Rect
        x={CENTER_X - 180}
        y={CENTER_Y + 60}
        width={360}
        height={4}
        fill={true}
        color={COLOR_PALETTE.accent}
        opacity={1}
      />

      {/* Subtitle */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y + 90}
        text="Founded by Naman Soni"
        progress={1}
        fontSize={TYPOGRAPHY.bodyLarge.size * 1.1}
        fontWeight={TYPOGRAPHY.bodyLarge.weight}
        color={COLOR_PALETTE.gray600}
        letterSpacing={0.05}
        animationType="fadeUp"
        easing="easeOutCubic"
      />

      {/* Website */}
      <AnimatedText
        x={CENTER_X}
        y={CENTER_Y + 130}
        text="newera.namansoni.in"
        progress={1}
        fontSize={TYPOGRAPHY.bodyMedium.size * 1.1}
        fontWeight={TYPOGRAPHY.bodyMedium.weight}
        color={COLOR_PALETTE.accent}
        letterSpacing={0.1}
        animationType="fadeUp"
        easing="easeOutCubic"
      />

      {/* Bottom decorative rings */}
      {Array.from({length: 3}).map((_, i) => (
        <ExpandingRing
          key={`poster-deco-${i}`}
          x={CENTER_X}
          y={CENTER_Y + 300}
          startRadius={60 + i * 90}
          endRadius={250 + i * 100}
          progress={0.6}
          color={COLOR_PALETTE.accent}
          strokeWidth={2}
          opacity={energy * 0.3 * (1 - i * 0.2)}
          easing="easeOutExpo"
        />
      ))}
    </ShapeGroup>
  );
};

export const PosterFrameComp = () => (
  <Composition
    id="PosterFrame"
    component={PosterFrame}
    durationInFrames={1}
    fps={30}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{}}
  />
);