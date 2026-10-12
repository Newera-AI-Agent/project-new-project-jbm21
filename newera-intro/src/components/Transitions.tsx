import React from 'react';
import {AbsoluteFill, interpolateColor} from 'remotion';
import {easings} from '../utils/animation';
import {Rect, Circle, Line} from './GeometricShapes';

interface TransitionProps {
  progress: number; // 0-1
  children: React.ReactNode;
  type?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoom' | 'rotate' | 'iris' | 'grid' | 'scanline';
  direction?: 'in' | 'out';
  easing?: keyof typeof easings;
  color?: string;
}

export const Transition: React.FC<TransitionProps> = ({
  progress,
  children,
  type = 'fade',
  direction = 'in',
  easing = 'easeInOutCubic',
  color = '#000',
}) => {
  const easedProgress = easings[easing](direction === 'in' ? progress : 1 - progress);

  const renderMask = () => {
    switch (type) {
      case 'fade':
        return (
          <AbsoluteFill
            style={
              {
                backgroundColor: color,
                opacity: direction === 'in' ? 1 - easedProgress : easedProgress,
              }
            }
          />
        );
      case 'slideUp':
        return (
          <Rect
            x={0}
            y={direction === 'in' ? 1080 * (1 - easedProgress) : -1080 * easedProgress}
            width={1920}
            height={1080}
            fill={true}
            color={color}
          />
        );
      case 'slideDown':
        return (
          <Rect
            x={0}
            y={direction === 'in' ? -1080 * (1 - easedProgress) : 1080 * easedProgress}
            width={1920}
            height={1080}
            fill={true}
            color={color}
          />
        );
      case 'slideLeft':
        return (
          <Rect
            x={direction === 'in' ? 1920 * (1 - easedProgress) : -1920 * easedProgress}
            y={0}
            width={1920}
            height={1080}
            fill={true}
            color={color}
          />
        );
      case 'slideRight':
        return (
          <Rect
            x={direction === 'in' ? -1920 * (1 - easedProgress) : 1920 * easedProgress}
            y={0}
            width={1920}
            height={1080}
            fill={true}
            color={color}
          />
        );
      case 'zoom':
        return (
          <Rect
            x={960 - 960 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            y={540 - 540 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            width={1920 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            height={1080 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            fill={true}
            color={color}
          />
        );
      case 'rotate':
        return (
          <Rect
            x={960 - 960 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            y={540 - 540 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            width={1920 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            height={1080 * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            fill={true}
            color={color}
            rotation={direction === 'in' ? (1 - easedProgress) * 90 : easedProgress * 90}
          />
        );
      case 'iris':
        return (
          <Circle
            x={960}
            y={540}
            radius={Math.sqrt(960 * 960 + 540 * 540) * (direction === 'in' ? easedProgress : 1 - easedProgress)}
            fill={true}
            color={color}
          />
        );
      case 'grid':
        const gridSize = 20;
        const cells = [];
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const cellProgress = easedProgress - (row + col) * 0.01;
            if (cellProgress > 0 && cellProgress < 1) {
              cells.push(
                <Rect
                  key={`${row}-${col}`}
                  x={col * (1920 / gridSize)}
                  y={row * (1080 / gridSize)}
                  width={1920 / gridSize}
                  height={1080 / gridSize * cellProgress}
                  fill={true}
                  color={color}
                />
              );
            } else if (cellProgress >= 1) {
              cells.push(
                <Rect
                  key={`${row}-${col}`}
                  x={col * (1920 / gridSize)}
                  y={row * (1080 / gridSize)}
                  width={1920 / gridSize}
                  height={1080 / gridSize}
                  fill={true}
                  color={color}
                />
              );
            }
          }
        }
        return <AbsoluteFill>{cells}</AbsoluteFill>;
      case 'scanline':
        const scanlines = [];
        for (let i = 0; i < 50; i++) {
          const lineProgress = easedProgress - i * 0.02;
          if (lineProgress > 0 && lineProgress < 1) {
            scanlines.push(
              <Line
                key={i}
                x1={0}
                y1={i * (1080 / 50) + 1080 / 50 * lineProgress}
                x2={1920}
                y2={i * (1080 / 50) + 1080 / 50 * lineProgress}
                color={color}
                strokeWidth={1080 / 50}
              />
            );
          } else if (lineProgress >= 1) {
            scanlines.push(
              <Line
                key={i}
                x1={0}
                y1={i * (1080 / 50)}
                x2={1920}
                y2={i * (1080 / 50)}
                color={color}
                strokeWidth={1080 / 50}
              />
            );
          }
        }
        return <AbsoluteFill>{scanlines}</AbsoluteFill>;
      default:
        return null;
    }
  };

  return (
    <AbsoluteFill
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }
      }
    >
      {children}
      {renderMask()}
    </AbsoluteFill>
  );
};

interface CrossfadeProps {
  progress: number; // 0-1
  from: React.ReactNode;
  to: React.ReactNode;
  easing?: keyof typeof easings;
}

export const Crossfade: React.FC<CrossfadeProps> = ({
  progress,
  from,
  to,
  easing = 'easeInOutCubic',
}) => {
  const easedProgress = easings[easing](progress);

  return (
    <AbsoluteFill
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }
    >
      <div style={{opacity: 1 - easedProgress}}>{from}</div>
      <div style={{opacity: easedProgress}}>{to}</div>
    </AbsoluteFill>
  );
};

interface WipeProps {
  progress: number; // 0-1
  from: React.ReactNode;
  to: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down' | 'diagonal';
  easing?: keyof typeof easings;
}

export const Wipe: React.FC<WipeProps> = ({
  progress,
  from,
  to,
  direction = 'left',
  easing = 'easeInOutCubic',
}) => {
  const easedProgress = easings[easing](progress);

  let clipPath = '';
  switch (direction) {
    case 'left':
      clipPath = `inset(0 ${1920 * (1 - easedProgress)}px 0 0)`;
      break;
    case 'right':
      clipPath = `inset(0 0 0 ${1920 * easedProgress}px)`;
      break;
    case 'up':
      clipPath = `inset(${1080 * (1 - easedProgress)}px 0 0 0)`;
      break;
    case 'down':
      clipPath = `inset(0 0 ${1080 * easedProgress}px 0)`;
      break;
    case 'diagonal':
      clipPath = `polygon(0 0, ${1920 * easedProgress}px 0, 0 ${1080 * easedProgress}px)`;
      break;
  }

  return (
    <AbsoluteFill
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }
    >
      <div>{from}</div>
      <div style={{clipPath, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
        {to}
      </div>
    </AbsoluteFill>
  );
};

interface SlideTransitionProps {
  progress: number;
  from: React.ReactNode;
  to: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  easing?: keyof typeof easings;
  overlap?: boolean;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  progress,
  from,
  to,
  direction = 'left',
  easing = 'easeOutExpo',
  overlap = true,
}) => {
  const easedProgress = easings[easing](progress);
  const distance = direction === 'left' || direction === 'right' ? 1920 : 1080;
  const sign = direction === 'left' || direction === 'up' ? -1 : 1;

  const fromTransform = overlap
    ? `translate${direction === 'left' || direction === 'right' ? 'X' : 'Y'}(${sign * distance * easedProgress}px)`
    : '';
  const toTransform = `translate${direction === 'left' || direction === 'right' ? 'X' : 'Y'}(${sign * distance * (1 - easedProgress)}px)`;

  return (
    <AbsoluteFill
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }
      }
    >
      <div style={{transform: fromTransform, transition: 'none'}}>{from}</div>
      <div style={{transform: toTransform, transition: 'none'}}>{to}</div>
    </AbsoluteFill>
  );
};

interface MorphTransitionProps {
  progress: number;
  from: React.ReactNode;
  to: React.ReactNode;
  easing?: keyof typeof easings;
}

export const MorphTransition: React.FC<MorphTransitionProps> = ({
  progress,
  from,
  to,
  easing = 'easeInOutCubic',
}) => {
  const easedProgress = easings[easing](progress);
  const scale = 0.8 + 0.2 * Math.sin(easedProgress * Math.PI);
  const opacity = Math.sin(easedProgress * Math.PI);

  return (
    <AbsoluteFill
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }
    >
      <div
        style={
          {
            transform: `scale(${scale})`,
            opacity: 1 - opacity,
            filter: `blur(${20 * Math.sin(easedProgress * Math.PI)}px)`,
          }
        }
      >
        {from}
      </div>
      <div
        style={
          {
            transform: `scale(${2 - scale})`,
            opacity: opacity,
            filter: `blur(${20 * (1 - Math.sin(easedProgress * Math.PI))}px)`,
          }
        }
      >
        {to}
      </div>
    </AbsoluteFill>
  );
};
