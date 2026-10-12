import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {easings} from '../utils/animation';

interface TextProps {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  opacity?: number;
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  rotation?: number;
}

export const Text: React.FC<TextProps> = ({
  x,
  y,
  text,
  fontSize = 48,
  fontWeight = 400,
  color = '#fff',
  opacity = 1,
  letterSpacing = 0,
  lineHeight = 1.2,
  textAlign = 'center',
  fontFamily = 'Space Grotesk',
  rotation = 0,
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
    <div
      style={
        {
          position: 'absolute',
          left: x,
          top: y,
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          opacity,
          letterSpacing: `${letterSpacing}em`,
          lineHeight,
          textAlign,
          fontFamily,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: textAlign === 'center' ? 'center center' : textAlign === 'right' ? 'right center' : 'left center',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }
      }
    >
      {text}
    </div>
  </AbsoluteFill>
);

interface AnimatedTextProps {
  x: number;
  y: number;
  text: string;
  progress: number; // 0-1
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  animationType?: 'fadeUp' | 'fadeDown' | 'scaleUp' | 'scaleDown' | 'slideLeft' | 'slideRight' | 'typewriter';
  easing?: keyof typeof easings;
  delay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  x,
  y,
  text,
  progress,
  fontSize = 48,
  fontWeight = 400,
  color = '#fff',
  letterSpacing = 0,
  textAlign = 'center',
  fontFamily = 'Space Grotesk',
  animationType = 'fadeUp',
  easing = 'easeOutExpo',
  delay = 0,
}) => {
  const delayedProgress = Math.max(0, (progress - delay) / (1 - delay));
  const easedProgress = easings[easing](delayedProgress);

  let transform = '';
  let opacity = 1;

  switch (animationType) {
    case 'fadeUp':
      transform = `translateY(${(1 - easedProgress) * 50}px)`;
      opacity = easedProgress;
      break;
    case 'fadeDown':
      transform = `translateY(${-(1 - easedProgress) * 50}px)`;
      opacity = easedProgress;
      break;
    case 'scaleUp':
      transform = `scale(${0.5 + easedProgress * 0.5})`;
      opacity = easedProgress;
      break;
    case 'scaleDown':
      transform = `scale(${1.5 - easedProgress * 0.5})`;
      opacity = easedProgress;
      break;
    case 'slideLeft':
      transform = `translateX(${(1 - easedProgress) * 100}px)`;
      opacity = easedProgress;
      break;
    case 'slideRight':
      transform = `translateX(${-(1 - easedProgress) * 100}px)`;
      opacity = easedProgress;
      break;
    case 'typewriter':
      opacity = 1;
      break;
  }

  if (animationType === 'typewriter') {
    const visibleChars = Math.floor(text.length * easedProgress);
    return (
      <Text
        x={x}
        y={y}
        text={text.slice(0, visibleChars)}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        letterSpacing={letterSpacing}
        textAlign={textAlign}
        fontFamily={fontFamily}
      />
    );
  }

  return (
    <Text
      x={x}
      y={y}
      text={text}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      opacity={opacity}
      letterSpacing={letterSpacing}
      textAlign={textAlign}
      fontFamily={fontFamily}
      rotation={0}
      // transform handled by wrapper
    >
      <div style={{transform, transformOrigin: textAlign === 'center' ? 'center center' : textAlign === 'right' ? 'right center' : 'left center'}} />
    </Text>
  );
};

interface TextSequenceProps {
  x: number;
  y: number;
  texts: string[];
  progress: number; // 0-1
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  durationPerText?: number; // fraction of total progress
  gap?: number; // gap between texts
  animationType?: 'fadeUp' | 'fadeDown' | 'scaleUp' | 'crossfade';
  easing?: keyof typeof easings;
}

export const TextSequence: React.FC<TextSequenceProps> = ({
  x,
  y,
  texts,
  progress,
  fontSize = 48,
  fontWeight = 400,
  color = '#fff',
  letterSpacing = 0,
  textAlign = 'center',
  fontFamily = 'Space Grotesk',
  durationPerText = 0.8,
  gap = 0.1,
  animationType = 'crossfade',
  easing = 'easeInOutCubic',
}) => {
  const totalDuration = texts.length * (durationPerText + gap) - gap;
  const normalizedProgress = Math.min(progress * totalDuration, totalDuration);

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
      {texts.map((text, index) => {
        const start = index * (durationPerText + gap);
        const end = start + durationPerText;
        let textProgress = 0;
        let opacity = 0;

        if (normalizedProgress >= start && normalizedProgress <= end) {
          textProgress = (normalizedProgress - start) / durationPerText;
          opacity = easings[easing](textProgress);
        } else if (normalizedProgress > end) {
          opacity = 1;
        }

        if (animationType === 'crossfade') {
          const nextIndex = (index + 1) % texts.length;
          const nextStart = nextIndex * (durationPerText + gap);
          let nextOpacity = 0;
          if (normalizedProgress >= nextStart && normalizedProgress <= nextStart + durationPerText) {
            const nextProgress = (normalizedProgress - nextStart) / durationPerText;
            nextOpacity = easings[easing](nextProgress);
          }

          return (
            <React.Fragment key={index}>
              <Text
                x={x}
                y={y}
                text={text}
                fontSize={fontSize}
                fontWeight={fontWeight}
                color={color}
                opacity={opacity * (1 - nextOpacity)}
                letterSpacing={letterSpacing}
                textAlign={textAlign}
                fontFamily={fontFamily}
              />
            </React.Fragment>
          );
        }

        return (
          <Text
            key={index}
            x={x}
            y={y}
            text={text}
            fontSize={fontSize}
            fontWeight={fontWeight}
            color={color}
            opacity={opacity}
            letterSpacing={letterSpacing}
            textAlign={textAlign}
            fontFamily={fontFamily}
          />
        );
      })}
    </AbsoluteFill>
  );
};

interface GlitchTextProps {
  x: number;
  y: number;
  text: string;
  progress: number;
  intensity?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  glitchColor?: string;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  x,
  y,
  text,
  progress,
  intensity = 1,
  fontSize = 48,
  fontWeight = 400,
  color = '#fff',
  glitchColor = '#ff0000',
  letterSpacing = 0,
  textAlign = 'center',
  fontFamily = 'Space Grotesk',
}) => {
  // Only glitch at specific intervals
  const glitchActive = Math.sin(progress * Math.PI * 20) > 0.95;
  const offsetX = glitchActive ? (Math.random() - 0.5) * 10 * intensity : 0;
  const offsetY = glitchActive ? (Math.random() - 0.5) * 5 * intensity : 0;
  const showGlitch = glitchActive && Math.random() > 0.5;

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
      <Text
        x={x}
        y={y}
        text={text}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        letterSpacing={letterSpacing}
        textAlign={textAlign}
        fontFamily={fontFamily}
      />
      {showGlitch && (
        <Text
          x={x + offsetX}
          y={y + offsetY}
          text={text}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={glitchColor}
          letterSpacing={letterSpacing}
          textAlign={textAlign}
          fontFamily={fontFamily}
          opacity={0.5}
        />
      )}
    </AbsoluteFill>
  );
};

interface TrackingTextProps {
  x: number;
  y: number;
  text: string;
  progress: number; // 0-1, controls letter spacing
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  minLetterSpacing?: number;
  maxLetterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  easing?: keyof typeof easings;
}

export const TrackingText: React.FC<TrackingTextProps> = ({
  x,
  y,
  text,
  progress,
  fontSize = 48,
  fontWeight = 400,
  color = '#fff',
  minLetterSpacing = 0,
  maxLetterSpacing = 0.5,
  textAlign = 'center',
  fontFamily = 'Space Grotesk',
  easing = 'easeOutExpo',
}) => {
  const easedProgress = easings[easing](progress);
  const letterSpacing = minLetterSpacing + (maxLetterSpacing - minLetterSpacing) * easedProgress;

  return (
    <Text
      x={x}
      y={y}
      text={text}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      letterSpacing={letterSpacing}
      textAlign={textAlign}
      fontFamily={fontFamily}
    />
  );
};

interface SplitTextProps {
  x: number;
  y: number;
  text: string;
  progress: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  splitBy?: 'chars' | 'words' | 'lines';
  stagger?: number;
  animationType?: 'fadeUp' | 'fadeDown' | 'scaleUp' | 'rotateX';
  easing?: keyof typeof easings;
}

export const SplitText: React.FC<SplitTextProps> = ({
  x,
  y,
  text,
  progress,
  fontSize = 48,
  fontWeight = 400,
  color = '#fff',
  letterSpacing = 0,
  textAlign = 'center',
  fontFamily = 'Space Grotesk',
  splitBy = 'chars',
  stagger = 0.05,
  animationType = 'fadeUp',
  easing = 'easeOutExpo',
}) => {
  const items = splitBy === 'chars'
    ? text.split('')
    : splitBy === 'words'
    ? text.split(' ')
    : text.split('\n');

  const totalStagger = items.length * stagger;

  return (
    <AbsoluteFill
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: splitBy === 'lines' ? 'column' : 'row',
          gap: splitBy === 'words' ? '0.25em' : splitBy === 'lines' ? '0.5em' : 0,
        }
      }
    >
      {items.map((item, index) => {
        const itemStart = index * stagger;
        const itemEnd = itemStart + (1 - totalStagger);
        let itemProgress = 0;

        if (progress >= itemStart && progress <= itemEnd) {
          itemProgress = (progress - itemStart) / (1 - totalStagger);
        } else if (progress > itemEnd) {
          itemProgress = 1;
        }

        const easedProgress = easings[easing](itemProgress);

        let transform = '';
        let opacity = easedProgress;

        switch (animationType) {
          case 'fadeUp':
            transform = `translateY(${(1 - easedProgress) * 30}px)`;
            break;
          case 'fadeDown':
            transform = `translateY(${-(1 - easedProgress) * 30}px)`;
            break;
          case 'scaleUp':
            transform = `scale(${0.3 + easedProgress * 0.7})`;
            break;
          case 'rotateX':
            transform = `rotateX(${90 - easedProgress * 90}deg)`;
            break;
        }

        return (
          <span
            key={index}
            style={
              {
                display: splitBy === 'lines' ? 'block' : 'inline-block',
                transform,
                transformOrigin: 'center bottom',
                opacity,
                fontSize: `${fontSize}px`,
                fontWeight,
                color,
                letterSpacing: `${letterSpacing}em`,
                fontFamily,
              }
            }
          >
            {item}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};
