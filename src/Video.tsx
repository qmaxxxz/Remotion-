
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import timing from './timing.json';

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  let elapsedFrames = 0;
  let sceneIndex = 0;

  for (let i = 0; i < timing.scenes.length; i++) {
    const sceneFrames = timing.scenes[i].seconds * fps;

    if (frame < elapsedFrames + sceneFrames) {
      sceneIndex = i;
      break;
    }

    elapsedFrames += sceneFrames;
    sceneIndex = i;
  }

  const scene = timing.scenes[sceneIndex];
  const localFrame = frame - elapsedFrames;
  const sceneFrames = scene.seconds * fps;

  const fadeIn = interpolate(localFrame, [0, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    localFrame,
    [sceneFrames - 25, sceneFrames],
    [1, 0],
    {extrapolateLeft: 'clamp'},
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const titleY = interpolate(localFrame, [0, 35], [40, 0], {
    extrapolateRight: 'clamp',
  });

  const progress = frame / durationInFrames;

  const seconds = Math.floor(frame / fps);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  const time = `${String(minutes).padStart(2, '0')}:${String(
    remaining,
  ).padStart(2, '0')}`;

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at center, #17375f, #09172d 55%, #050b16)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,180,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.06) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
        }}
      />

      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          width: 750,
          height: 750,
          border: '1px solid rgba(91,180,255,0.2)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Scene content */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 120,
          textAlign: 'center',
          opacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            color: '#65c7ff',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 6,
            marginBottom: 45,
          }}
        >
          {String(sceneIndex + 1).padStart(2, '0')} /{' '}
          {String(timing.scenes.length).padStart(2, '0')}
        </div>

        <div
          style={{
            fontSize: 78,
            fontWeight: 900,
            lineHeight: 1.2,
            maxWidth: 1500,
            textShadow: '0 8px 35px rgba(0,0,0,0.5)',
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            marginTop: 45,
            width: 110,
            height: 5,
            borderRadius: 10,
            background: '#54c5ff',
          }}
        />
      </AbsoluteFill>

      {/* Timer */}
      <div
        style={{
          position: 'absolute',
          bottom: 65,
          right: 85,
          color: '#80bde9',
          fontSize: 22,
        }}
      >
        {time} / 09:00
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progress * 100}%`,
          height: 8,
          background: '#54c5ff',
        }}
      />
    </AbsoluteFill>
  );
};
