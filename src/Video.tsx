
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const scenes = [
  {
    title: 'HOW THE WORLD CONNECTS',
    subtitle: 'The Internet Explained',
    tag: 'A JOURNEY THROUGH THE DIGITAL WORLD',
  },
  {
    title: 'A WORLD WITHOUT BORDERS',
    subtitle: 'Billions of devices connect every day.',
    tag: '01 — THE BIG PICTURE',
  },
  {
    title: 'WHAT IS THE INTERNET?',
    subtitle: 'A global network of interconnected networks.',
    tag: '02 — THE FOUNDATION',
  },
  {
    title: 'THE FIRST CONNECTIONS',
    subtitle: 'A small experiment became a global revolution.',
    tag: '03 — THE HISTORY',
  },
  {
    title: 'THE LANGUAGE OF NETWORKS',
    subtitle: 'Devices communicate through shared protocols.',
    tag: '04 — PROTOCOLS',
  },
  {
    title: 'MEET THE IP ADDRESS',
    subtitle: 'Every destination needs an address.',
    tag: '05 — IDENTIFICATION',
  },
  {
    title: 'HOW DATA TRAVELS',
    subtitle: 'Information is divided into tiny packets.',
    tag: '06 — DATA PACKETS',
  },
  {
    title: 'THE POWER OF ROUTERS',
    subtitle: 'Routers guide packets toward their destination.',
    tag: '07 — ROUTING',
  },
  {
    title: 'UNDER THE OCEAN',
    subtitle: 'Submarine cables carry enormous amounts of data.',
    tag: '08 — GLOBAL INFRASTRUCTURE',
  },
  {
    title: 'THE ROLE OF SERVERS',
    subtitle: 'Servers deliver the content we request.',
    tag: '09 — SERVERS',
  },
  {
    title: 'DNS: THE INTERNET DIRECTORY',
    subtitle: 'DNS translates domain names into IP addresses.',
    tag: '10 — DOMAIN NAMES',
  },
  {
    title: 'INSIDE A DATA CENTER',
    subtitle: 'Thousands of computers work together.',
    tag: '11 — CLOUD COMPUTING',
  },
  {
    title: 'WIRELESS CONNECTIONS',
    subtitle: 'Wi-Fi and mobile networks connect us everywhere.',
    tag: '12 — WIRELESS',
  },
  {
    title: 'THE SPEED OF LIGHT',
    subtitle: 'Data travels through fiber-optic cables as light.',
    tag: '13 — TRANSMISSION',
  },
  {
    title: 'STAYING SAFE ONLINE',
    subtitle: 'Encryption helps protect information.',
    tag: '14 — CYBERSECURITY',
  },
  {
    title: 'THE INTERNET OF THINGS',
    subtitle: 'Everyday objects are becoming connected.',
    tag: '15 — CONNECTED DEVICES',
  },
  {
    title: 'THE FUTURE IS CONNECTED',
    subtitle: 'New technologies are changing how we communicate.',
    tag: '16 — WHAT COMES NEXT',
  },
  {
    title: 'ONE WORLD. ONE NETWORK.',
    subtitle: 'The internet connects more than computers. It connects people.',
    tag: 'THANK YOU FOR WATCHING',
  },
];

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const sceneDuration = 30 * fps;
  const sceneIndex = Math.min(
    Math.floor(frame / sceneDuration),
    scenes.length - 1,
  );

  const scene = scenes[sceneIndex];
  const localFrame = frame % sceneDuration;

  const fadeIn = interpolate(localFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(localFrame, [sceneDuration - 25, sceneDuration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = Math.min(fadeIn, fadeOut);

  const titleY = interpolate(localFrame, [0, 35], [45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const progress = frame / durationInFrames;
  const seconds = Math.floor(frame / fps);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatTime = `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, #17375f 0%, #09172d 48%, #050b16 100%)',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,180,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.055) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          opacity: 0.65,
        }}
      />

      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          width: 750,
          height: 750,
          border: '1px solid rgba(91,180,255,0.18)',
          borderRadius: '50%',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          border: '1px solid rgba(91,180,255,0.13)',
          borderRadius: '50%',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 120,
          opacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: '#65c7ff',
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: 7,
            marginBottom: 42,
          }}
        >
          {scene.tag}
        </div>

        <div
          style={{
            fontSize: sceneIndex === 0 ? 88 : 76,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.15,
            maxWidth: 1500,
            textShadow: '0 8px 35px rgba(0,0,0,0.45)',
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            marginTop: 38,
            fontSize: 34,
            color: '#b8d6f5',
            lineHeight: 1.5,
            maxWidth: 1250,
          }}
        >
          {scene.subtitle}
        </div>

        <div
          style={{
            marginTop: 65,
            width: 100,
            height: 5,
            borderRadius: 10,
            background: '#54c5ff',
          }}
        />
      </AbsoluteFill>

      {/* Scene number */}
      <div
        style={{
          position: 'absolute',
          bottom: 75,
          left: 90,
          color: '#80bde9',
          fontSize: 21,
          letterSpacing: 3,
        }}
      >
        CHAPTER {String(sceneIndex + 1).padStart(2, '0')} / 18
      </div>

      {/* Timer */}
      <div
        style={{
          position: 'absolute',
          bottom: 75,
          right: 90,
          color: '#80bde9',
          fontSize: 21,
          letterSpacing: 2,
        }}
      >
        {formatTime} / 09:00
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 8,
          width: `${progress * 100}%`,
          background: '#54c5ff',
        }}
      />
    </AbsoluteFill>
  );
};
      
