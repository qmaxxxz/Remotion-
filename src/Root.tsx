
import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import timing from './timing.json';

const totalSeconds = timing.scenes.reduce(
  (total, scene) => total + scene.seconds,
  0,
);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Video}
      durationInFrames={totalSeconds * timing.fps}
      fps={timing.fps}
      width={timing.width}
      height={timing.height}
    />
  );
};
