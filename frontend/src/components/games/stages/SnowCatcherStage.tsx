import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Award, Sparkles, Check } from 'lucide-react';
import { sound } from '../../../utils/audio';
import { getAssetUrl } from '../../../utils/assets';

interface SnowCatcherStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface FallingSnowflake {
  id: number;
  x: number; // percentage 10 - 90
  y: number; // current y in px
  speed: number;
  type: 'ice' | 'gold';
  points: number;
  size: number;
  isFrozen: boolean;
}

export const SnowCatcherStage: React.FC<SnowCatcherStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [score, setScore] = useState<number>(0);
  const [catchCount, setCatchCount] = useState<number>(0);
  const [snowflakes, setSnowflakes] = useState<FallingSnowflake[]>([]);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Timer Countdown 12s
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameFinished(true);
      sound.playWin(soundEnabled);
      const finalScore = Math.max(score, 360);
      const timer = setTimeout(() => {
        onComplete(finalScore);
      }, 1800);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, score, soundEnabled, onComplete]);

  // 2. Continuous Falling Animation Loop & Spawner
  useEffect(() => {
    if (gameFinished) return;

    // Spawner interval
    const spawnTimer = setInterval(() => {
      const isGold = Math.random() > 0.8;
      const newFlake: FallingSnowflake = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 80) + 10,
        y: -60,
        speed: isGold ? 2.3 : 1.8 + Math.random() * 0.7,
        type: isGold ? 'gold' : 'ice',
        points: isGold ? 60 : 30,
        size: isGold ? 86 : 76,
        isFrozen: false,
      };

      setSnowflakes((prev) => [...prev.slice(-14), newFlake]);
    }, 560);

    // Physics ticker (falling downward)
    const animTicker = setInterval(() => {
      setSnowflakes((prev) =>
        prev
          .map((f) => (f.isFrozen ? f : { ...f, y: f.y + f.speed }))
          .filter((f) => f.y < 380)
      );
    }, 30);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(animTicker);
    };
  }, [gameFinished]);

  // 3. TƯƠNG TÁC: CHẠM BÔNG TUYẾT ĐANG RƠI → ĐÓNG BĂNG THÀNH SỐ ĐIỂM
  const handleTapSnowflake = (flake: FallingSnowflake, e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    if (flake.isFrozen || gameFinished) return;

    sound.playClick(soundEnabled);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    track('CATCH', 1);

    setScore((s) => s + flake.points);
    setCatchCount((c) => c + 1);

    // Freeze the snowflake in place and turn into points badge
    setSnowflakes((prev) =>
      prev.map((f) => (f.id === flake.id ? { ...f, isFrozen: true } : f))
    );

    // Remove frozen badge after 700ms floating up
    setTimeout(() => {
      setSnowflakes((prev) => prev.filter((f) => f.id !== flake.id));
    }, 700);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-1.5 sm:py-6 px-2 sm:px-4 touch-none">
      {/* Arctic Header */}
      <div className="text-center mb-1.5 sm:mb-5">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 mb-1 sm:mb-2 backdrop-blur-md">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-300 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-cyan-200 font-semibold">
            Vườn Tuyết Pha Lê
          </span>
        </div>
        <h2 className="font-serif text-xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Hứng Tuyết Nhận Điểm
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-400 font-light mt-0.5 sm:mt-1">
          Chạm vào bông tuyết đang rơi — Tuyết sẽ đóng băng thành số điểm (+30 / +60 PTS)
        </p>
      </div>

      {/* Header Metrics HUD */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-1.5 mb-2 px-1 sm:px-2">
        <div className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono font-bold backdrop-blur-md">
          <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{timeLeft}s</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-mono font-bold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Bắt: {catchCount}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-neutral-900/80 border border-amber-400/40 text-neutral-100 text-[11px] sm:text-xs font-mono font-bold shadow-md">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{score.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Snowflake Catching Sky Arena */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl h-[min(340px,calc(100dvh-200px))] sm:h-[380px] rounded-2xl bg-gradient-to-b from-[#060e1d]/95 via-[#08152c]/95 to-[#040915]/98 border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer p-3 sm:p-4 touch-none"
      >
        {/* Shimmering Ice Mist & Ambient Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />

        {/* Falling & Frozen Snowflakes */}
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            role="button"
            tabIndex={0}
            onPointerDown={(e) => handleTapSnowflake(flake, e)}
            onClick={(e) => handleTapSnowflake(flake, e)}
            style={{
              left: `${flake.x}%`,
              top: `${flake.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-20 cursor-pointer flex flex-col items-center select-none touch-manipulation p-6 -m-6 active:scale-95"
          >
            {!flake.isFrozen ? (
              /* Đang rơi: Bông tuyết tinh thể pha lê thực tế theo ảnh chụp Macro */
              <motion.div
                whileHover={{ scale: 1.3 }}
                animate={{
                  rotate: flake.type === 'gold' ? 360 : -360,
                }}
                transition={{
                  rotate: {
                    repeat: Infinity,
                    duration: 10 + (flake.id % 6),
                    ease: 'linear',
                  },
                }}
                className="group relative flex items-center justify-center cursor-pointer"
              >
                {/* Real Macro Ice Crystal Snowflake Image */}
                <img
                  src={
                    flake.type === 'gold'
                      ? getAssetUrl('/assets/games/crystal_snowflake_gold.png')
                      : getAssetUrl('/assets/games/crystal_snowflake_ice.png')
                  }
                  alt="Crystal Snowflake"
                  style={{ width: `${flake.size}px`, height: `${flake.size}px` }}
                  className={`object-contain pointer-events-none select-none transition-transform duration-200 ${
                    flake.type === 'gold'
                      ? 'filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] drop-shadow-[0_0_8px_rgba(250,204,21,0.75)]'
                      : 'filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] drop-shadow-[0_0_8px_rgba(56,189,248,0.75)]'
                  }`}
                  draggable={false}
                />
              </motion.div>
            ) : (
              /* ĐÓNG BĂNG THÀNH SỐ ĐIỂM (FROZEN POINTS BADGE) */
              <motion.div
                initial={{ scale: 0.7, y: 0, opacity: 1 }}
                animate={{ scale: [1, 1.3, 1.1], y: -45, opacity: [1, 1, 0] }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="relative flex items-center justify-center pointer-events-none"
              >
                {/* Frozen Crystal Flash */}
                <img
                  src={
                    flake.type === 'gold'
                      ? getAssetUrl('/assets/games/crystal_snowflake_gold.png')
                      : getAssetUrl('/assets/games/crystal_snowflake_ice.png')
                  }
                  alt="Frozen Crystal"
                  className="absolute w-14 h-14 object-contain opacity-60 filter brightness-150 animate-ping pointer-events-none"
                />
                {/* Shattered Ice Crystal Burst Rings */}
                <div className="absolute -inset-4 rounded-full border border-cyan-300 animate-ping pointer-events-none" />
                <div
                  className={`relative z-10 px-3.5 py-1 rounded-full text-xs font-mono font-black tracking-wider shadow-[0_0_25px_rgba(56,189,248,0.9)] border ${
                    flake.type === 'gold'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-200 text-amber-950 border-amber-200'
                      : 'bg-gradient-to-r from-cyan-400 to-sky-100 text-cyan-950 border-cyan-200'
                  }`}
                >
                  +{flake.points} PTS
                </div>
              </motion.div>
            )}
          </div>
        ))}

        {/* 4. FINAL SCORE CELEBRATION MODAL */}
        <AnimatePresence>
          {gameFinished && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-[#0c182c] to-[#060c18] border border-cyan-400/50 shadow-[0_15px_40px_rgba(56,189,248,0.3)] text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Hoàn Thành Hứng Tuyết</span>
                </div>
                <h3 className="font-serif text-2xl text-cyan-100 font-normal">
                  Đóng Băng {catchCount} Bông Tuyết
                </h3>
                <p className="text-3xl font-mono text-amber-300 font-extrabold mt-1">
                  +{score} ĐIỂM
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-sans text-emerald-400 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Đang đồng bộ kết quả phiên chơi...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Guidance */}
      <p className="text-[11px] sm:text-xs text-neutral-400 font-sans tracking-wide mt-2 sm:mt-4 text-center">
        Chạm trực tiếp ngón tay hoặc chuột vào các bông tuyết đang rơi để đóng băng thành số điểm.
      </p>
    </div>
  );
};
