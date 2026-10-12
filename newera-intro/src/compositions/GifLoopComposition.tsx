import React from 'react';
import {
  Interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';

// Corner pulse animation component
const CornerPulse: React.FC<{ x: number; y: number; delay: number }> = ({
  x,
  y,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

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
        opacity: Interpolate(scale, [0.5, 1, 1.5], [0, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    />
  );
};

const GifLoopComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Loop progress (0 to 1, repeating)
  const loopProgress = (frame % durationInFrames) / durationInFrames;

  // Breathing scale for the main text
  const breatheScale = spring({
    frame: frame * 0.5,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  // Rotating square
  const rotation = Interpolate(loopProgress, [0, 1], [0, 360]);

  // Pulsing circle
  const pulseScale = spring({
    frame: frame * 2,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Moving line position
  const lineX = Interpolate(loopProgress, [0, 0.5, 1], [0, 460, 0]);

  // Opacity wave for "FULL VIBE"
  const textOpacity = Interpolate(loopProgress, [0, 0.25, 0.5, 0.75, 1], [1, 0.3, 1, 0.3, 1]);

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
          left: lineX,
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
