import React, {useMemo} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

type V = {x: number; y: number; z: number};
const TILT = 0.38;

const fib = (n: number): V[] =>
  Array.from({length: n}, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    return {x: Math.cos(th) * r, y, z: Math.sin(th) * r};
  });

const rot = (p: V, a: number): V => {
  const x = p.x * Math.cos(a) + p.z * Math.sin(a);
  const z = -p.x * Math.sin(a) + p.z * Math.cos(a);
  return {
    x,
    y: p.y * Math.cos(TILT) - z * Math.sin(TILT),
    z: p.y * Math.sin(TILT) + z * Math.cos(TILT),
  };
};

const slerp = (a: V, b: V, t: number): V => {
  const d = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const w = Math.acos(d);
  const s = Math.sin(w) || 1;
  const k1 = Math.sin((1 - t) * w) / s;
  const k2 = Math.sin(t * w) / s;
  return {x: a.x * k1 + b.x * k2, y: a.y * k1 + b.y * k2, z: a.z * k1 + b.z * k2};
};

const SAMPLES = 32;

export const Globe: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  reveal?: number; // 0..1, berapa banyak koneksi yang sudah muncul
  opacity?: number;
}> = ({cx, cy, radius: R, reveal = 1, opacity = 1}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const {dots, hubs, arcs} = useMemo(() => {
    const dots = fib(520);
    const hubs = Array.from(
      {length: 30},
      (_, i) => dots[Math.floor(random(`hub-${i}`) * dots.length)],
    );
    const arcs = Array.from({length: 26}, (_, i) => {
      const a = hubs[Math.floor(random(`a-${i}`) * hubs.length)];
      const b = hubs[Math.floor(random(`b-${i}`) * hubs.length)];
      const pts = Array.from({length: SAMPLES}, (_, k) => {
        const t = k / (SAMPLES - 1);
        const p = slerp(a, b, t);
        const l = 1 + 0.22 * Math.sin(Math.PI * t);
        return {x: p.x * l, y: p.y * l, z: p.z * l};
      });
      return {pts, delay: random(`d-${i}`) * 0.6, amber: i % 6 === 0};
    });
    return {dots, hubs, arcs};
  }, []);

  const angle = frame * 0.0045 + 0.8;
  const X = (p: V) => cx + p.x * R;
  const Y = (p: V) => cy - p.y * R;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', left: 0, top: 0, opacity}}
    >
      <defs>
        <radialGradient id="sphere" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#13213a" />
          <stop offset="100%" stopColor="#070c18" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={cx} cy={cy} r={R * 1.04} fill="none" stroke={C.cyan} strokeOpacity={0.18} strokeWidth={10} filter="url(#glow)" />
      <circle cx={cx} cy={cy} r={R} fill="url(#sphere)" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={2} />

      {dots.map((d, i) => {
        const p = rot(d, angle);
        if (p.z <= 0) return null;
        return <circle key={i} cx={X(p)} cy={Y(p)} r={1.5} fill={C.muted} opacity={0.12 + 0.45 * p.z} />;
      })}

      {arcs.map((arc, i) => {
        const q = Math.min(1, Math.max(0, (reveal - arc.delay) / 0.4));
        if (q <= 0) return null;
        const n = Math.max(2, Math.ceil(q * SAMPLES));
        let d = '';
        let prevVisible = false;
        for (let k = 0; k < n; k++) {
          const p = rot(arc.pts[k], angle);
          const vis = p.z > 0.02;
          if (vis) d += `${prevVisible ? 'L' : 'M'}${X(p).toFixed(1)} ${Y(p).toFixed(1)} `;
          prevVisible = vis;
        }
        const color = arc.amber ? C.amber : C.cyan;
        const head = rot(arc.pts[Math.floor((((frame / 70 + i * 0.13) % 1) * (SAMPLES - 1)))], angle);
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.75} filter="url(#glow)" />
            {q >= 1 && head.z > 0.02 ? <circle cx={X(head)} cy={Y(head)} r={4} fill={color} filter="url(#glow)" /> : null}
          </g>
        );
      })}

      {hubs.map((h, i) => {
        const p = rot(h, angle);
        if (p.z <= 0.05) return null;
        const r = 3.5 + 1.5 * Math.sin(frame * 0.08 + i);
        return <circle key={i} cx={X(p)} cy={Y(p)} r={r} fill={C.cyan} filter="url(#glow)" opacity={Math.min(1, reveal * 2)} />;
      })}
    </svg>
  );
};
