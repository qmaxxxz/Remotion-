import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Reveal} from '../components/Reveal';
import {Footnote, Kicker} from '../components/Text';
import {BEATS, GROWTH} from '../data';
import {fontFamily} from '../fonts';
import {C} from '../theme';
import {CL, easeInOut} from '../utils';

const X0 = 200;
const W = 1520;
const Y0 = 880; // baseline
const H = 600;
const MAX = 6;
const N = GROWTH.length - 1;

const xAt = (i: number) => X0 + (i / N) * W;
const yAt = (v: number) => Y0 - (v / MAX) * H;

const linePath = GROWTH.map((g, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)} ${yAt(g.billions)}`).join(' ');
const areaPath = `${linePath} L${xAt(N)} ${Y0} L${xAt(0)} ${Y0} Z`;
const slowFrom = GROWTH.findIndex((g) => g.year === 2022);
const slowPath = GROWTH.slice(slowFrom)
  .map((g, i) => `${i === 0 ? 'M' : 'L'}${xAt(slowFrom + i)} ${yAt(g.billions)}`)
  .join(' ');

const MILESTONES = [
  {year: 2005, label: '2005: 1B'},
  {year: 2015, label: '2015: 3B'},
  {year: 2024, label: '2024: 5.5B'},
];

export const GrowthCurve: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const b = BEATS.growth;
  const progress = interpolate(sec, [b.drawStart, b.drawEnd], [0, 1], {...CL, easing: easeInOut});
  const pos = progress * N;
  const i0 = Math.min(N - 1, Math.floor(pos));
  const frac = pos - i0;
  const headV = GROWTH[i0].billions + (GROWTH[i0 + 1].billions - GROWTH[i0].billions) * frac;
  const headX = X0 + progress * W;
  const slowOn = interpolate(sec, [b.slowing, b.slowing + 1.5], [0, 1], CL);

  return (
    <AbsoluteFill style={{fontFamily, color: C.text}}>
      <Background />
      <Reveal at={0.5} style={{position: 'absolute', left: 120, top: 80}}>
        <Kicker>Internet users worldwide, 2005–2024</Kicker>
      </Reveal>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <clipPath id="reveal">
            <rect x={X0 - 20} y={0} width={progress * W + 20} height={1080} />
          </clipPath>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4, 5, 6].map((v) => (
          <g key={v}>
            <line x1={X0} x2={X0 + W} y1={yAt(v)} y2={yAt(v)} stroke={C.grid} strokeWidth={1.5} />
            <text x={X0 - 24} y={yAt(v) + 8} textAnchor="end" fontSize={24} fill={C.muted} fontFamily={fontFamily}>
              {v}B
            </text>
          </g>
        ))}
        {GROWTH.map((g, i) =>
          g.year % 5 === 0 || g.year === 2024 ? (
            <text key={g.year} x={xAt(i)} y={Y0 + 44} textAnchor="middle" fontSize={26} fill={C.muted} fontFamily={fontFamily}>
              {g.year}
            </text>
          ) : null,
        )}

        <g clipPath="url(#reveal)">
          <path d={areaPath} fill="url(#area)" />
          <path d={linePath} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
          <path d={slowPath} fill="none" stroke={C.amber} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" opacity={slowOn} />
        </g>

        {progress > 0 && progress < 1 ? <circle cx={headX} cy={yAt(headV)} r={12} fill={C.cyan} /> : null}

        {MILESTONES.map((m) => {
          const idx = GROWTH.findIndex((g) => g.year === m.year);
          if (pos < idx) return null;
          const g = GROWTH[idx];
          const x = xAt(idx);
          const y = yAt(g.billions);
          const labelX = Math.min(x, 1700);
          return (
            <g key={m.year}>
              <circle cx={x} cy={y} r={11} fill={C.bg} stroke={C.text} strokeWidth={4} />
              <rect x={labelX - 100} y={y - 92} width={200} height={52} rx={12} fill={C.panel} stroke={C.grid} />
              <text x={labelX} y={y - 56} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.text} fontFamily={fontFamily}>
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>

      <Reveal at={b.slowing} style={{position: 'absolute', left: 980, top: 300, fontSize: 64, fontWeight: 800, color: C.amber}}>
        Growth is slowing
      </Reveal>
      <Reveal at={b.footnote} style={{position: 'absolute', left: 200, top: 985}}>
        <Footnote>Illustrative figures based on ITU estimates, rounded.</Footnote>
      </Reveal>
    </AbsoluteFill>
  );
};
