import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CL, easeOut} from '../utils';

export const Reveal: React.FC<{
  at: number; // detik sejak awal scene
  duration?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, duration = 0.9, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [at * fps, (at + duration) * fps], [0, 1], {
    ...CL,
    easing: easeOut,
  });
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 28}px)`, ...style}}>
      {children}
    </div>
  );
};
