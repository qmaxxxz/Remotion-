import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Reveal} from '../components/Reveal';
import {Footnote, Kicker} from '../components/Text';
import {BEATS, REGIONS} from '../data';
import {fontFamily} from '../fonts';
import {C} from '../theme';
import {CL, easeInOut} from '../utils';

const TRACK_X = 480;
const TRACK_W = 1100;
const ROW_H = 96;
const TOP = 250;
const GAP = 50;

export const RegionalDivide: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const b = BEATS.regional;
  const pulse = 0.5 + 0.5 * Math.sin(sec * 3);
  const calloutOn = interpolate(sec, [b.africaCallout, b.africaCallout + 1], [0, 1], CL);

  return (
    <AbsoluteFill style={{fontFamily, color: C.text}}>
      <Background />
      <Reveal at={b.title} style={{position: 'absolute', left: 120, top: 80}}>
        <Kicker>Internet use by region, 2024 · % of population</Kicker>
      </Reveal>

      {REGIONS.map((r, i) => {
        const start = b.firstBar + i * b.barGap;
        const p = interpolate(sec, [start, start + b.barDraw], [0, 1], {...CL, easing: easeInOut});
        const top = TOP + i * (ROW_H + GAP);
        const color = r.highlight ? C.amber : C.cyan;
        const dim = r.highlight ? 1 : 1 - 0.45 * calloutOn;
        return (
          <div key={r.name} style={{position: 'absolute', left: 0, top, width: 1920, height: ROW_H, opacity: dim}}>
            <div style={{position: 'absolute', left: 120, width: 330, height: ROW_H, display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 600}}>
              {r.name}
            </div>
            <div style={{position: 'absolute', left: TRACK_X, width: TRACK_W, height: ROW_H, background: C.panel, borderRadius: 16}} />
            <div
              style={{
                position: 'absolute',
                left: TRACK_X,
                width: (TRACK_W * r.pct * p) / 100,
                height: ROW_H,
                background: color,
                borderRadius: 16,
                boxShadow: r.highlight ? `0 0 ${20 + 30 * pulse * calloutOn}px ${C.amber}88` : 'none',
              }}
            />
            <div style={{position: 'absolute', left: TRACK_X + TRACK_W + 30, height: ROW_H, display: 'flex', alignItems: 'center', fontSize: 52, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>
              {r.highlight ? '~' : ''}
              {Math.round(r.pct * p)}%
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 95,
          fontSize: 72,
          fontWeight: 800,
          color: C.amber,
          opacity: calloutOn,
          transform: `translateY(${(1 - calloutOn) * 20}px)`,
        }}
      >
        Africa ~37%
      </div>
      <Reveal at={b.firstBar} style={{position: 'absolute', left: 120, top: 985}}>
        <Footnote>Source: ITU. Figures rounded.</Footnote>
      </Reveal>
    </AbsoluteFill>
  );
};
