import React from 'react';
import {C} from '../theme';

export const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = C.cyan,
}) => (
  <div
    style={{
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

export const Footnote: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 22, color: C.muted, fontWeight: 400}}>{children}</div>
);
