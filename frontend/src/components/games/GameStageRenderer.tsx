import React, { useRef } from 'react';
import { ValentineGashapon } from './ValentineGashapon';
import { BeautyLuckyDrawStage } from './stages/BeautyLuckyDrawStage';
import { FlowerPickingStage } from './stages/FlowerPickingStage';
import { LoveLetterStage } from './stages/LoveLetterStage';
import { ChristmasTreeStage } from './stages/ChristmasTreeStage';
import { SantaGiftStage } from './stages/SantaGiftStage';
import { SnowCatcherStage } from './stages/SnowCatcherStage';
import { LuckyEnvelopeStage } from './stages/LuckyEnvelopeStage';
import { GoldenDragonStage } from './stages/GoldenDragonStage';
import { FireworkFortuneStage } from './stages/FireworkFortuneStage';

interface GameStageProps {
  slug: string;
  onCompleteGame: (score: number, telemetry?: any[], preCalculatedReward?: import('../../types/game').Reward) => void;
  soundEnabled: boolean;
  sessionId?: string | null;
}

export const GameStageRenderer: React.FC<GameStageProps> = ({
  slug,
  onCompleteGame,
  soundEnabled,
  sessionId,
}) => {
  // Telemetry event accumulator
  const telemetry = useRef<any[]>([]);

  const trackEvent = (type: string, val = 1) => {
    telemetry.current.push({
      eventType: type,
      timestampMs: Date.now(),
      value: val,
    });
  };

  // 1. GAME: VALENTINE GASHAPON (Capsule Machine with Bouncy Balls & Rotary Crank)
  if (slug === 'lucky-heart') {
    return (
      <ValentineGashapon
        onComplete={(s: number, reward?: import('../../types/game').Reward) =>
          onCompleteGame(s, telemetry.current, reward)
        }
        soundEnabled={soundEnabled}
        track={trackEvent}
        sessionId={sessionId}
      />
    );
  }

  // 2. GAME: BEAUTY LUCKY DRAW (Aphrodite Royal Cards)
  if (slug === 'beauty-lucky-draw') {
    return (
      <BeautyLuckyDrawStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 3. GAME: FLOWER PICKING (Botanical Orchid Garden)
  if (slug === 'flower-picking') {
    return (
      <FlowerPickingStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 4. GAME: LOVE LETTER (Baroque Parchment & Wax Seal)
  if (slug === 'love-letter') {
    return (
      <LoveLetterStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 5. GAME: LUCKY CHRISTMAS TREE (Bethlehem Star Illumination)
  if (slug === 'lucky-christmas-tree') {
    return (
      <ChristmasTreeStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 6. GAME: SANTA GIFT (Aurora & Arctic Brass Bell)
  if (slug === 'santa-gift') {
    return (
      <SantaGiftStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 7. GAME: SNOW CATCHER (15s Snowflake Arcade)
  if (slug === 'snow-catcher') {
    return (
      <SnowCatcherStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 8. GAME: LUCKY ENVELOPE (Imperial Red Packets)
  if (slug === 'lucky-envelope') {
    return (
      <LuckyEnvelopeStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 9. GAME: GOLDEN DRAGON (Dragon Orb Tap Arcade)
  if (slug === 'golden-dragon') {
    return (
      <GoldenDragonStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  // 10. GAME: FIREWORK FORTUNE (Metropolis Cannon Launch)
  if (slug === 'firework-fortune') {
    return (
      <FireworkFortuneStage
        onComplete={(s: number) => onCompleteGame(s, telemetry.current)}
        soundEnabled={soundEnabled}
        track={trackEvent}
      />
    );
  }

  return (
    <div className="text-center p-8">
      <p className="text-sm font-sans text-neutral-400">Trò chơi đang cập nhật sân khấu...</p>
    </div>
  );
};
