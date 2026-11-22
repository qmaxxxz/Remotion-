import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Globe} from '../components/Globe';
import {Reveal} from '../components/Reveal';
import {Kicker} from '../components/Text';
import {BEATS} from '../data';
import {fontFamily} from '../fonts';
import {C} from '../theme';
import {CL, easeInOut} from '../utils';

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const b = BEATS.hook;
  const count = interpolate(sec, [b.counterStart, b.counterEnd], [1, 5.5], {...CL, easing: easeInOut});
  const reveal = interpolate(sec, [0, b.globeReveal], [0, 1], CL);

  return (
    <AbsoluteFill style={{fontFamily, color: C.text}}>
      <Background />
      <Globe cx={1300} cy={540} radius={400} reveal={reveal} />
      <Reveal at={0.5} style={{position: 'absolute', left: 120, top: 110}}>
        <Kicker>How the World Connects · The Internet in 9 Minutes</Kicker>
      </Reveal>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 220,
          fontSize: 250,
          fontWeight: 800,
          lineHeight: 1,
          color: C.cyan,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count.toFixed(1)}B
      </div>
      <Reveal at={b.line2005} style={{position: 'absolute', left: 124, top: 520, fontSize: 52, fontWeight: 600}}>
        1B online in 2005
      </Reveal>
      <Reveal at={b.lineToday} style={{position: 'absolute', left: 124, top: 600, fontSize: 52, fontWeight: 600, color: C.amber}}>
        5.5B today
      </Reveal>
      <Reveal at={b.lineTwoThirds} style={{position: 'absolute', left: 124, top: 720, fontSize: 72, fontWeight: 800}}>
        Two-thirds of humanity
      </Reveal>
    </AbsoluteFill>
  );
};
