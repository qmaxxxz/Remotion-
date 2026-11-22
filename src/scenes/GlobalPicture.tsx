import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Reveal} from '../components/Reveal';
import {Kicker} from '../components/Text';
import {BEATS, GLOBAL} from '../data';
import {fontFamily} from '../fonts';
import {C} from '../theme';
import {CL, easeInOut} from '../utils';

const CX = 520;
const CY = 470;
const R = 220;
const SW = 64;
const CIRC = 2 * Math.PI * R;

export const GlobalPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const b = BEATS.global;

  const online = interpolate(sec, [b.donutStart, b.donutEnd], [0, 1], {...CL, easing: easeInOut});
  const offline = interpolate(sec, [b.offlineDrawStart, b.offlineDrawEnd], [0, 1], {...CL, easing: easeInOut});
  const pct = Math.round(online * GLOBAL.onlinePct);
  const bigCount = interpolate(sec, [b.offlineBig, b.offlineBig + 4], [0, GLOBAL.offlineBillions], {...CL, easing: easeInOut});
  const onlineFrac = GLOBAL.onlinePct / 100;

  return (
    <AbsoluteFill style={{fontFamily, color: C.text}}>
      <Background />
      <Reveal at={0.5} style={{position: 'absolute', left: 120, top: 90}}>
        <Kicker>The global picture · 2024</Kicker>
      </Reveal>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.grid} strokeWidth={SW} />
        <circle
          cx={CX} cy={CY} r={R} fill="none" stroke={C.cyan} strokeWidth={SW}
          strokeDasharray={`${CIRC * onlineFrac * online} ${CIRC}`}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        <circle
          cx={CX} cy={CY} r={R} fill="none" stroke={C.amber} strokeWidth={SW}
          strokeDasharray={`${CIRC * (1 - onlineFrac) * offline} ${CIRC}`}
          strokeDashoffset={-CIRC * onlineFrac}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        <text x={CX} y={CY + 30} textAnchor="middle" fontSize={96} fontWeight={800} fill={C.text} fontFamily={fontFamily}>
          {pct}%
        </text>
        <text x={CX} y={CY + 76} textAnchor="middle" fontSize={26} fill={C.muted} fontFamily={fontFamily}>
          online
        </text>
      </svg>

      <Reveal at={b.offlineBig} style={{position: 'absolute', left: 0, width: CX * 2, top: 780, textAlign: 'center', fontSize: 54, fontWeight: 700}}>
        <span style={{color: C.amber, fontVariantNumeric: 'tabular-nums'}}>~{bigCount.toFixed(1)}</span> Billion Offline
      </Reveal>

      <Reveal at={b.onlineLabel} style={{position: 'absolute', left: 1000, top: 190, fontSize: 112, fontWeight: 800, color: C.cyan}}>
        5.5B online
      </Reveal>
      <Reveal at={b.offlineLabel} style={{position: 'absolute', left: 1000, top: 340, fontSize: 112, fontWeight: 800, color: C.amber}}>
        ~2.6B offline
      </Reveal>
      <Reveal at={b.headline} style={{position: 'absolute', left: 1000, top: 600, width: 780, fontSize: 64, fontWeight: 700, lineHeight: 1.15}}>
        A global average hides the story
        <div style={{marginTop: 24, width: 160, height: 6, background: C.amber, borderRadius: 3}} />
      </Reveal>
    </AbsoluteFill>
  );
};
