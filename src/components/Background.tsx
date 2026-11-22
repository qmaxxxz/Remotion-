import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';

export const Background: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.grid}55 1px, transparent 1px), linear-gradient(90deg, ${C.grid}55 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        opacity: 0.5,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 70% 50%, rgba(34,211,238,0.07), transparent 60%)',
      }}
    />
  </AbsoluteFill>
);
          
