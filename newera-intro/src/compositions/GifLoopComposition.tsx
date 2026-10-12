import React from 'react';
import {Interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BeatsData, getBeatAtTime, getSectionAtTime} from '../data/beats';
import {
  TextReveal,
  TypewriterText,
  GlitchText,
  TrackingText,
} from '../components/Typography';
import {
  PulseCircle,
  RotatingSquare,
  GridLines,
  OrbitingDots,
  WaveformBars,
} from '../components/GeometricShapes';
import {
  Cut,
  Crossfade,
  SlideReveal,
  IrisWipe,
  GlitchFlash,
} from '../components/Transitions';
import '../index.css';

interface Props {}

export const GifLoopComposition: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const beat = getBeatAtTime(time);
  const section = getSectionAtTime(time);
  
  // Use the drop section (around 30-50s) for the loop
  // Loop frames 0-74 (5 seconds at 15fps)
  const loopFrame = frame % 75;
  const loopProgress = loopFrame / 75;
  const beatTime = loopFrame / 15; // 15fps for GIF
  
  // Find a beat near the loop time
  const currentBeat = BeatsData.find(b => Math.abs(b.time - beatTime) < 0.5);
  const isDownbeat = currentBeat && currentBeat.confidence > 0.8;
  
  return (
    <div
      style={{
        width: '480px',
        height: '270px',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Space Grotesk", sans-serif',
        color: '#FFFFFF',
      }}
    >
      {/* Background grid pulse */}
      <GridLines
        rows={6}
        cols={10}
        lineWidth={1}
        color="#00FF41"
        opacity={0.15}
        animate={true}
        speed={2}
        intensity={loopProgress * 0.5 + (isDownbeat ? 0.5 : 0)}
      />
      
      {/* Pulse circle on downbeats */}
      <PulseCircle
        x={240}
        y={135}
        baseRadius={30}
        maxRadius={120}
        color="#00FF41"
        strokeWidth={2}
        trigger={isDownbeat}
        duration={30}
        easing="easeOutExpo"
      />
      
      {/* Rotating square - continuous */}
      <RotatingSquare
        x={240}
        y={135}
        size={80}
        rotationSpeed={45}
        color="#00FF41"
        strokeWidth={3}
        fill="none"
      />
      
      {/* Orbiting dots - 3 dots */}
      <OrbitingDots
        centerX={240}
        centerY={135}
        radius={100}
        dotCount={3}
        dotSize={8}
        color="#FFFFFF"
        speed={60}
        phaseOffset={loopProgress * 360}
      />
      
      {/* Waveform bars at bottom */}
      <WaveformBars
        x={40}
        y={220}
        width={400}
        height={40}
        barCount={32}
        color="#00FF41"
        audioData={BeatsData.map(b => b.confidence)}
        currentFrame={loopFrame}
        fps={15}
        style="rounded"
      />
      
      {/* Main title - loops with tracking animation */}
      <TrackingText
        text="NEWERA AI AGENT"
        x={240}
        y={80}
        fontSize={28}
        fontWeight={700}
        color="#FFFFFF"
        baseLetterSpacing={0.05}
        maxLetterSpacing={0.3}
        speed={0.5}
        center={true}
      />
      
      {/* Subtitle with typewriter effect */}
      <TypewriterText
        text="Full Vibe Aesthetic"
        x={240}
        y={115}
        fontSize={14}
        fontWeight={400}
        color="#00FF41"
        charsPerFrame={0.3}
        startFrame={0}
        center={true}
        cursor={false}
      />
      
      {/* Glitch accent on downbeats */}
      {isDownbeat && (
        <GlitchText
          text="LIFE FORCE"
          x={240}
          y={180}
          fontSize={20}
          fontWeight={700}
          color="#00FF41"
          intensity={0.3}
          frequency={0.5}
          seed={loopFrame}
          center={true}
        />
      )}
      
      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '4px',
          height: '4px',
          backgroundColor: '#00FF41',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '4px',
          height: '4px',
          backgroundColor: '#00FF41',
          animation: 'pulse 2s ease-in-out infinite 0.5s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '4px',
          height: '4px',
          backgroundColor: '#00FF41',
          animation: 'pulse 2s ease-in-out infinite 1s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '4px',
          height: '4px',
          backgroundColor: '#00FF41',
          animation: 'pulse 2s ease-in-out infinite 1.5s',
        }}
      />
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default GifLoopComposition;