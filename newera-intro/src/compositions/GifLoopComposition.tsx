import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  lerp,
  mapRange,
  clamp,
  easings,
} from '../utils/animation';

// Corner pulse animation component
const CornerPulse: React.FC<{ x: number; y: number; delay: number }> = ({
  x,
  y,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Simple pulsing animation using sine wave
  const time = (frame - delay * fps) / fps;
  const scale = 0.5 + 0.5 * Math.sin(time * Math.PI * 2);
  const opacity = clamp(scale * 2, 0, 1);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '4px',
        height: '4px',
        backgroundColor: '#00FF41',
        borderRadius: '50%',
        opacity: opacity,
      }}
    />
  );
};

const GifLoopComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Loop progress (0 to 1, repeating)
  const loopProgress = (frame % durationInFrames) / durationInFrames;

  // Breathing scale for the main text using easeInOutSine
  const breatheProgress = (Math.sin(frame / fps * Math.PI) + 1) / 2;
  const breatheScale = lerp(0.95, 1.05, easings.easeInOutSine(breatheProgress));

  // Rotating square
  const rotation = mapRange(loopProgress, 0, 1, 0, 360);

  // Pulsing circle
  const pulseProgress = (Math.sin(frame / fps * Math.PI * 2) + 1) / 2;
  const pulseScale = lerp(0.8, 1.2, easings.easeInOutSine(pulseProgress));

  // Moving line position
  const lineX = mapRange(loopProgress, 0, 1, 0, 460);
  // Make it go back and forth
  const lineXFinal = loopProgress < 0.5 
    ? mapRange(loopProgress, 0, 0.5, 0, 460)
    : mapRange(loopProgress, 0.5, 1, 460, 0);

  // Opacity wave for "FULL VIBE"
  const textOpacity = Math.abs(Math.sin(loopProgress * Math.PI * 4)) * 0.7 + 0.3;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Space Grotesk, JetBrains Mono, monospace',
        color: '#FFFFFF',
      }}
    >
      {/* Centered main text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${breatheScale})`,
          transformOrigin: 'center center',
          textAlign: 'center',
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '8px',
            textTransform: 'uppercase',
            color: '#00FF41',
            textShadow: '0 0 20px #00FF41, 0 0 40px #00FF41',
          }}
        >
          NEWERA
        </div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginTop: '4px',
            color: '#FFFFFF',
          }}
        >
          AI AGENT
        </div>
      </div>

      {/* Rotating square in background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          width: '120px',
          height: '120px',
          border: '2px solid #00FF41',
          opacity: 0.15,
          boxShadow: '0 0 30px #00FF41',
        }}
      />

      {/* Pulsing circle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '1px solid #00FF41',
          opacity: 0.2,
        }}
      />

      {/* Scanning line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: lineXFinal,
          width: '2px',
          height: '100%',
          background: 'linear-gradient(180deg, transparent, #00FF41, transparent)',
          opacity: 0.6,
        }}
      />

      {/* Corner accents - animated */}
      <CornerPulse x={10} y={10} delay={0} />
      <CornerPulse x={466} y={10} delay={0.5} />
      <CornerPulse x={10} y={256} delay={1} />
      <CornerPulse x={466} y={256} delay={1.5} />

      {/* Bottom tag */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#666',
          textTransform: 'uppercase',
        }}
      >
        newera.namansoni.in
      </div>
    </div>
  );
};

GifLoopComp.displayName = 'GifLoopComposition';

export const GifLoopComposition = GifLoopComp;

const GIF_CONFIG = {
  id: 'GifLoopComposition',
  component: GifLoopComp,
  durationInFrames: 75, // 5 seconds at 15fps
  fps: 15,
  width: 480,
  height: 270,
  defaultProps: {},
};

export default GIF_CONFIG;
