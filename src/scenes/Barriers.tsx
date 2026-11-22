import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Reveal} from '../components/Reveal';
import {Kicker} from '../components/Text';
import {BEATS} from '../data';
import {fontFamily} from '../fonts';
import {C} from '../theme';
import {CL, easeInOut} from '../utils';

const PhoneIcon: React.FC<{active: number}> = ({active}) => (
  <svg width={200} height={200} viewBox="0 0 200 200" fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round">
    <rect x={50} y={20} width={80} height={160} rx={16} />
    <line x1={80} y1={160} x2={100} y2={160} />
    {[0, 1, 2].map((i) => {
      const r = 22 + i * 14;
      const dx = r * 0.707;
      return (
        <path
          key={i}
          d={`M ${130 + dx} ${60 - dx} A ${r} ${r} 0 0 1 ${130 + dx} ${60 + dx}`}
          opacity={i < active ? 1 : 0.2}
        />
      );
    })}
  </svg>
);

const TagIcon: React.FC = () => (
  <svg width={200} height={200} viewBox="0 0 200 200" fill="none" stroke={C.amber} strokeWidth={6} strokeLinejoin="round">
    <path d="M 30 100 L 100 30 L 170 30 L 170 100 L 100 170 Z" />
    <circle cx={140} cy={60} r={9} />
    <text x={98} y={118} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.amber} stroke="none" fontFamily={fontFamily}>
      $
    </text>
  </svg>
);

const SpeedIcon: React.FC<{angle: number}> = ({angle}) => (
  <svg width={200} height={200} viewBox="0 0 200 200" fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round">
    <path d="M 20 140 A 80 80 0 0 1 180 140" />
    {[-60, -30, 0, 30, 60].map((a) => (
      <line key={a} x1={100} y1={70} x2={100} y2={82} transform={`rotate(${a} 100 140)`} strokeWidth={4} opacity={0.6} />
    ))}
    <line x1={100} y1={140} x2={100} y2={76} stroke={C.amber} transform={`rotate(${angle} 100 140)`} />
    <circle cx={100} cy={140} r={9} fill={C.amber} stroke="none" />
  </svg>
);

const Card: React.FC<{
  index: number;
  at: number;
  title: string;
  note: string;
  noteColor: string;
  icon: React.ReactNode;
  widget: React.ReactNode;
}> = ({index, at, title, note, noteColor, icon, widget}) => (
  <Reveal
    at={at}
    duration={1.2}
    style={{
      position: 'absolute',
      left: 120 + index * 580,
      top: 170,
      width: 520,
      height: 700,
      background: C.panel,
      border: `1px solid ${C.grid}`,
      borderRadius: 28,
      padding: 40,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <div style={{alignSelf: 'flex-start', fontSize: 38, fontWeight: 700}}>
      <span style={{color: C.muted, marginRight: 14}}>{index + 1}</span>
      {title}
    </div>
    {icon}
    <div style={{height: 90, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{widget}</div>
    <div style={{fontSize: 40, fontWeight: 800, color: noteColor, textAlign: 'center'}}>{note}</div>
  </Reveal>
);

export const Barriers: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const b = BEATS.barriers;
  const signal = 1 + (Math.floor(sec * 1.4) % 3);
  const needle = -55 + 50 * Math.sin(sec * 0.9) + 20 * Math.sin(sec * 2.3);
  const bar = interpolate(sec, [b.col2 + 2, b.col2 + 5], [0, 1], {...CL, easing: easeInOut});

  return (
    <AbsoluteFill style={{fontFamily, color: C.text}}>
      <Background />
      <Reveal at={0.5} style={{position: 'absolute', left: 120, top: 80}}>
        <Kicker>Barriers to access</Kicker>
      </Reveal>

      <Card
        index={0} at={b.col1} title="Mobile On-Ramp" note="Coverage ≠ Usage" noteColor={C.cyan}
        icon={<PhoneIcon active={signal} />}
        widget={<div style={{fontSize: 28, color: C.muted, textAlign: 'center'}}>A signal is not a smartphone or a data plan</div>}
      />
      <Card
        index={1} at={b.col2} title="Affordability" note="UN target: 1GB ≤ 2% income" noteColor={C.amber}
        icon={<TagIcon />}
        widget={
          <div style={{width: 400}}>
            <div style={{position: 'relative', height: 28, background: C.bg, borderRadius: 14}}>
              <div style={{position: 'absolute', left: 0, top: 0, height: 28, width: 400 * 0.02 * 5 * bar, background: C.amber, borderRadius: 14}} />
            </div>
            <div style={{marginTop: 10, fontSize: 24, color: C.muted}}>2% of monthly income (scaled ×5)</div>
          </div>
        }
      />
      <Card
        index={2} at={b.col3} title="Speed & Skills" note="Speed is a divide" noteColor={C.cyan}
        icon={<SpeedIcon angle={needle} />}
        widget={<div style={{fontSize: 28, color: C.muted, textAlign: 'center'}}>Slow links turn opportunities into delays</div>}
      />

      <Reveal at={b.closing} style={{position: 'absolute', left: 0, width: 1920, top: 930, textAlign: 'center', fontSize: 48, fontWeight: 700}}>
        Digital inclusion is not just a cable. It is a <span style={{color: C.amber}}>system</span>.
      </Reveal>
    </AbsoluteFill>
  );
};
  
