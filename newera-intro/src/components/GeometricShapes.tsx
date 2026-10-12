import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {easings} from '../utils/animation';

interface CircleProps {
  x: number;
  y: number;
  radius: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  opacity?: number;
}

export const Circle: React.FC<CircleProps> = ({
  x,
  y,
  radius,
  color = '#fff',
  fill = false,
  strokeWidth = 2,
  opacity = 1,
}) => (
  <AbsoluteFill
    style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }
  >
    <svg
      width={radius * 2}
      height={radius * 2}
      style={
        {
          position: 'absolute',
          left: x - radius,
          top: y - radius,
          opacity,
        }
      }
    >
      <circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        fill={fill ? color : 'none'}
        stroke={fill ? 'none' : color}
        strokeWidth={strokeWidth}
      />
    </svg>
  </AbsoluteFill>
);

interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  borderRadius?: number;
}

export const Rect: React.FC<RectProps> = ({
  x,
  y,
  width,
  height,
  color = '#fff',
  fill = false,
  strokeWidth = 2,
  opacity = 1,
  rotation = 0,
  borderRadius = 0,
}) => (
  <AbsoluteFill
    style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }
  >
    <svg
      width={width}
      height={height}
      style={
        {
          position: 'absolute',
          left: x,
          top: y,
          opacity,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
        }
      }
    >
      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={width - strokeWidth}
        height={height - strokeWidth}
        rx={borderRadius}
        ry={borderRadius}
        fill={fill ? color : 'none'}
        stroke={fill ? 'none' : color}
        strokeWidth={strokeWidth}
      />
    </svg>
  </AbsoluteFill>
);

interface LineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  dashArray?: string;
}

export const Line: React.FC<LineProps> = ({
  x1,
  y1,
  x2,
  y2,
  color = '#fff',
  strokeWidth = 2,
  opacity = 1,
  dashArray,
}) => (
  <AbsoluteFill
    style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }
  >
    <svg
      width="100%"
      height="100%"
      style={
        {
          position: 'absolute',
          left: 0,
          top: 0,
          opacity,
        }
      }
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
      />
    </svg>
  </AbsoluteFill>
);

interface ArcProps {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}

export const Arc: React.FC<ArcProps> = ({
  x,
  y,
  radius,
  startAngle,
  endAngle,
  color = '#fff',
  strokeWidth = 2,
  opacity = 1,
}) => {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = x + radius * Math.cos(startRad);
  const y1 = y + radius * Math.sin(startRad);
  const x2 = x + radius * Math.cos(endRad);
  const y2 = y + radius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

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
      <svg
        width={radius * 2}
        height={radius * 2}
        style={
          {
            position: 'absolute',
            left: x - radius,
            top: y - radius,
            opacity,
          }
        }
      >
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};

interface GridProps {
  cols: number;
  rows: number;
  cellSize: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  offsetX?: number;
  offsetY?: number;
}

export const Grid: React.FC<GridProps> = ({
  cols,
  rows,
  cellSize,
  color = '#fff',
  strokeWidth = 1,
  opacity = 1,
  offsetX = 0,
  offsetY = 0,
}) => {
  const lines = [];
  for (let i = 0; i <= cols; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        x1={offsetX + i * cellSize}
        y1={offsetY}
        x2={offsetX + i * cellSize}
        y2={offsetY + rows * cellSize}
        color={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    );
  }
  for (let i = 0; i <= rows; i++) {
    lines.push(
      <Line
        key={`h-${i}`}
        x1={offsetX}
        y1={offsetY + i * cellSize}
        x2={offsetX + cols * cellSize}
        y2={offsetY + i * cellSize}
        color={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    );
  }
  return <AbsoluteFill>{lines}</AbsoluteFill>;
};

interface PulsingCircleProps {
  x: number;
  y: number;
  baseRadius: number;
  maxRadius: number;
  progress: number; // 0-1
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  easing?: keyof typeof easings;
}

export const PulsingCircle: React.FC<PulsingCircleProps> = ({
  x,
  y,
  baseRadius,
  maxRadius,
  progress,
  color = '#fff',
  fill = false,
  strokeWidth = 2,
  easing = 'easeOutExpo',
}) => {
  const easedProgress = easings[easing](progress);
  const radius = baseRadius + (maxRadius - baseRadius) * easedProgress;
  const opacity = 1 - easedProgress;

  return (
    <Circle
      x={x}
      y={y}
      radius={radius}
      color={color}
      fill={fill}
      strokeWidth={strokeWidth}
      opacity={opacity}
    />
  );
};

interface RotatingSquareProps {
  x: number;
  y: number;
  size: number;
  progress: number; // 0-1
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  rotations?: number;
  easing?: keyof typeof easings;
}

export const RotatingSquare: React.FC<RotatingSquareProps> = ({
  x,
  y,
  size,
  progress,
  color = '#fff',
  fill = false,
  strokeWidth = 2,
  rotations = 1,
  easing = 'easeInOutCubic',
}) => {
  const easedProgress = easings[easing](progress);
  const rotation = easedProgress * 360 * rotations;

  return (
    <Rect
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      color={color}
      fill={fill}
      strokeWidth={strokeWidth}
      rotation={rotation}
    />
  );
};

interface ExpandingRingProps {
  x: number;
  y: number;
  startRadius: number;
  endRadius: number;
  progress: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  easing?: keyof typeof easings;
}

export const ExpandingRing: React.FC<ExpandingRingProps> = ({
  x,
  y,
  startRadius,
  endRadius,
  progress,
  color = '#fff',
  strokeWidth = 3,
  opacity = 1,
  easing = 'easeOutExpo',
}) => {
  const easedProgress = easings[easing](progress);
  const radius = startRadius + (endRadius - startRadius) * easedProgress;
  const ringOpacity = opacity * (1 - easedProgress);

  return (
    <Circle
      x={x}
      y={y}
      radius={radius}
      color={color}
      fill={false}
      strokeWidth={strokeWidth}
      opacity={ringOpacity}
    />
  );
};

interface MorphingShapeProps {
  x: number;
  y: number;
  size: number;
  progress: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  sides?: number;
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  x,
  y,
  size,
  progress,
  color = '#fff',
  fill = false,
  strokeWidth = 2,
  sides = 3,
}) => {
  // Morph between triangle (3), square (4), pentagon (5), hexagon (6), circle (infinite)
  const currentSides = 3 + Math.floor(progress * 4); // 3-6 sides
  const angleStep = (Math.PI * 2) / currentSides;
  const points = [];

  for (let i = 0; i < currentSides; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    points.push(`${px},${py}`);
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
      <svg
        width="100%"
        height="100%"
        style={
          {
            position: 'absolute',
            left: 0,
            top: 0,
          }
        }
      >
        <polygon
          points={points.join(' ')}
          fill={fill ? color : 'none'}
          stroke={fill ? 'none' : color}
          strokeWidth={strokeWidth}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const ShapeGroup: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }
  >
    {children}
  </AbsoluteFill>
);
