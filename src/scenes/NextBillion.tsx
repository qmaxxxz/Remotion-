import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Globe} from '../components/Globe';
import {Reveal} from '../components/Reveal';
import {Kicker} from '../components/Text';
import {BEATS} from '../data';
import {fontFamily} from '../fonts';
import {C} from '../theme';
import {CL} from '../utils';

const CREDITS = [
  {h: 'Data sources', t: ''},
  {h: 'ITU', t: 'Measuring digital development: Facts and Figures'},
  {h: 'World Bank', t: 'World Development Indicators'},
  {h: 'GSMA', t: 'The State of Mobile Internet Connectivity'},
  {h: '', t: 'Figures are rounded and approximate.'},
];

export const NextBillion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const sec = frame / fps;
  const b = BEATS.next;
  const reveal = interpolate(sec, [0, b.globeReveal], [0, 1], CL);
  const qOn = interpolate(sec, [b.question, b.question + 2], [0, 1], CL);
  const qPulse = 0.85 + 0.15 * Math.sin(sec * 2.2);
  const group = interpolate(sec, [b.creditsStart - 3, b.creditsStart], [1, 0], CL);
  const creditsY = interpolate(sec, [b.creditsStart, b.creditsEnd], [1080, -620], CL);
  const fadeOut = interpolate(frame, [durationInFrames - 60, durationInFrames - 1], [1, 0], CL);

  return (
    <AbsoluteFill style={{fontFamily, color: C.text, opacity: fadeOut}}>
      <Background />
      <div style={{opacity: group}}>
        <Globe cx={960} cy={540} radius={340} reveal={reveal} opacity={0.75} />
        <div
          style={{
            position: 'absolute', left: 0, width: 1920, top: 340, textAlign: 'center',
            fontSize: 330, fontWeight: 800, color: C.cyan, lineHeight: 1,
            opacity: qOn * qPulse, textShadow: `0 0 60px ${C.cyan}99`,
          }}
        >
          ?
        </div>
        <Reveal at={b.line1} style={{position: 'absolute', left: 0, width: 1920, top: 90, textAlign: 'center', fontSize: 66, fontWeight: 800}}>
          The next billion is the hardest
        </Reveal>
        <Reveal at={b.line2} style={{position: 'absolute', left: 0, width: 1920, top: 900, textAlign: 'center', fontSize: 78, fontWeight: 800, color: C.amber}}>
          Who gets to participate?
        </Reveal>
      </div>

      <div style={{position: 'absolute', left: 0, width: 1920, top: creditsY, textAlign: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 40}}>
          <Kicker>Sources: ITU, World Bank, GSMA</Kicker>
        </div>
        {CREDITS.map((c, i) => (
          <div key={i} style={{marginBottom: 36}}>
            {c.h ? <div style={{fontSize: 52, fontWeight: 800, color: C.cyan}}>{c.h}</div> : null}
            {c.t ? <div style={{fontSize: 32, color: C.muted, marginTop: 6}}>{c.t}</div> : null}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
