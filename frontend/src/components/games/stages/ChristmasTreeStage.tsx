import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Zap, RotateCcw, Timer, Star, Bell, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/audio';
import { MagicTreeCanvas } from './MagicTreeCanvas';
import { getAssetUrl } from '../../../utils/assets';

interface ChristmasTreeStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface TreePart {
  id: string;
  type: 'star' | 'bell' | 'bauble' | 'gift';
  name: string;
  x: number; // percentage relative to container width
  y: number; // percentage relative to container height
  color: string;
  pitch: number;
}

const TREE_PARTS: TreePart[] = [
  // 1. Crown Bethlehem Star
  { id: 'star-crown', type: 'star', name: 'Ngôi Sao Bethlehem', x: 50, y: 7, color: '#FDE047', pitch: 2.0 },

  // 2. Top tier: Bell & Ruby Bauble
  { id: 'bauble-t1', type: 'bauble', name: 'Cầu Ruby Đỏ', x: 42, y: 26, color: '#F43F5E', pitch: 1.5 },
  { id: 'bell-t1', type: 'bell', name: 'Chuông Vàng Thượng', x: 59, y: 27, color: '#FBBF24', pitch: 1.6 },

  // 3. Mid tier: Sapphire Bauble, Center Bell, Pink Bauble
  { id: 'bauble-m1', type: 'bauble', name: 'Cầu Lam Sapphire', x: 32, y: 44, color: '#38BDF8', pitch: 1.3 },
  { id: 'bell-m1', type: 'bell', name: 'Chuông Vàng Trung', x: 50, y: 47, color: '#F59E0B', pitch: 1.2 },
  { id: 'bauble-m2', type: 'bauble', name: 'Cầu Thạch Anh Hồng', x: 68, y: 44, color: '#EC4899', pitch: 1.4 },

  // 4. Low tier: Emerald, Golden Bells & Amber Baubles
  { id: 'bauble-b1', type: 'bauble', name: 'Cầu Ngọc Lục Bảo', x: 23, y: 64, color: '#34D399', pitch: 1.0 },
  { id: 'bell-b1', type: 'bell', name: 'Chuông Vàng Tả', x: 39, y: 65, color: '#FBBF24', pitch: 1.1 },
  { id: 'bell-b2', type: 'bell', name: 'Chuông Vàng Hữu', x: 61, y: 65, color: '#FBBF24', pitch: 1.15 },
  { id: 'bauble-b2', type: 'bauble', name: 'Cầu Hoàng Kim', x: 77, y: 63, color: '#FACC15', pitch: 1.25 },

  // 5. Base Snowy Gifts
  { id: 'gift-left', type: 'gift', name: 'Hộp Quà Đỏ Lụa', x: 26, y: 88, color: '#EF4444', pitch: 0.9 },
  { id: 'gift-mid', type: 'gift', name: 'Hộp Quà Hoàng Kim', x: 50, y: 90, color: '#F59E0B', pitch: 1.0 },
  { id: 'gift-right', type: 'gift', name: 'Hộp Quà Lam Tuyết', x: 74, y: 88, color: '#0284C7', pitch: 0.95 },
];

type GameState = 'READY' | 'PLAYING' | 'VICTORY' | 'FAILED';

const REQUIRED_ACTIVATIONS = 8;
const TIME_LIMIT = 10; // 10 seconds

export const ChristmasTreeStage: React.FC<ChristmasTreeStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [gameState, setGameState] = useState<GameState>('READY');
  const [activatedParts, setActivatedParts] = useState<Set<string>>(new Set());
  const [animatingParts, setAnimatingParts] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [floatText, setFloatText] = useState<{ text: string; x: number; y: number } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Background snowflakes
  const snowflakes = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: (i * 4.6) % 100,
    size: (i % 3) + 2.5,
    duration: 3.5 + (i % 4),
    delay: (i * 0.22) % 2.5,
    opacity: 0.35 + (i % 5) * 0.12,
  }));

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleTimeOut = () => {
    setGameState('FAILED');
    sound.playCount(soundEnabled);
    track('CHALLENGE_FAILED', activatedParts.size);
  };

  const startChallenge = () => {
    setGameState('PLAYING');
    setActivatedParts(new Set());
    setTimeLeft(TIME_LIMIT);
    sound.playClick(soundEnabled);
    track('CHALLENGE_START', 1);
  };

  const handleInteractPart = (part: TreePart) => {
    if (gameState === 'READY') {
      startChallenge();
    }
    if (gameState === 'FAILED') return;

    // Trigger part-specific animation
    setAnimatingParts((prev) => ({ ...prev, [part.id]: true }));
    setTimeout(() => {
      setAnimatingParts((prev) => ({ ...prev, [part.id]: false }));
    }, 650);

    // Audio & Haptics based on part type
    if (part.type === 'bell') {
      sound.playBell(soundEnabled, part.pitch, 0.4);
      sound.playSleighBells(soundEnabled);
    } else if (part.type === 'star') {
      sound.playBell(soundEnabled, 2.0, 0.45);
      sound.playReward(soundEnabled);
    } else if (part.type === 'gift') {
      sound.playCount(soundEnabled);
      sound.playBell(soundEnabled, part.pitch, 0.3);
    } else {
      sound.playBell(soundEnabled, part.pitch, 0.3);
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(part.type === 'star' ? [40, 60, 40] : 35);
    }

    // Add to activated parts set
    const nextSet = new Set(activatedParts);
    nextSet.add(part.id);
    setActivatedParts(nextSet);

    // Floating text notification at coordinates
    setFloatText({
      text: part.type === 'star' ? '🌟 NGÔI SAO TỎA SÁNG!' : `✨ ${part.name}!`,
      x: part.x,
      y: part.y,
    });
    setTimeout(() => {
      setFloatText(null);
    }, 700);

    track('PART_ACTIVATED', nextSet.size);

    // VICTORY CHECK: When activated required number of unique parts
    if (nextSet.size >= REQUIRED_ACTIVATIONS && gameState === 'PLAYING') {
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState('VICTORY');
      sound.playWin(soundEnabled);

      try {
        confetti({
          particleCount: 110,
          spread: 95,
          origin: { y: 0.5 },
          colors: ['#34d399', '#fde047', '#f43f5e', '#38bdf8', '#fbbf24', '#ffffff'],
        });
      } catch {
        // ignore
      }

      track('CHALLENGE_VICTORY', nextSet.size);
    }
  };

  const progressCount = activatedParts.size;
  const progressPercent = Math.min(100, Math.round((progressCount / REQUIRED_ACTIVATIONS) * 100));

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-1 sm:py-4 px-2 sm:px-4 touch-manipulation font-sans">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-3 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 mb-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-emerald-200 font-extrabold drop-shadow">
            Cây Thông Tương Tác Giáng Sinh
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <h2 className="font-sans text-xl sm:text-3xl text-amber-100 font-extrabold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Đánh Thức Các Bộ Phận Cây Thông
        </h2>
        <p className="text-[11px] sm:text-xs text-emerald-100/80 font-normal mt-0.5 drop-shadow">
          {gameState === 'READY'
            ? 'Chạm vào các quả chuông, quả châu, ngôi sao và hộp quà để thắp sáng toàn bộ cây!'
            : gameState === 'PLAYING'
            ? 'Chạm vào 8 bộ phận khác nhau trên cây trước khi hết thời gian!'
            : gameState === 'FAILED'
            ? 'Hết giờ rồi! Hãy bấm thử lại để tiếp tục thắp sáng cây nhé.'
            : 'Tuyệt vời! Toàn bộ cây thông đã được thắp sáng rực rỡ!'}
        </p>
      </div>

      {/* Main Winter Stage */}
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-emerald-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.25)] overflow-hidden flex flex-col items-center justify-between min-h-[420px] sm:min-h-[530px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('${getAssetUrl('/assets/games/anime_winter_bg.jpg')}')`,
          }}
        />

        {/* Ambient Aurora Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1c]/55 via-emerald-950/25 to-[#020712]/85 pointer-events-none" />

        {/* Ambient Warm Golden Halo behind Tree */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            gameState === 'VICTORY' || progressCount >= 5
              ? 'bg-amber-400/40 scale-125'
              : 'bg-emerald-500/20 scale-100'
          }`}
        />

        {/* Snowflakes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {snowflakes.map((snow) => (
            <motion.div
              key={snow.id}
              className="absolute bg-white rounded-full pointer-events-none"
              style={{
                left: `${snow.x}%`,
                width: `${snow.size}px`,
                height: `${snow.size}px`,
                boxShadow: '0 0 6px rgba(255,255,255,0.9)',
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: [-20, 560],
                x: [0, (snow.id % 2 === 0 ? 1 : -1) * 20, 0],
                opacity: [0, snow.opacity, snow.opacity, 0],
              }}
              transition={{
                duration: snow.duration,
                repeat: Infinity,
                delay: snow.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* CHALLENGE HUD: Progress Bar & Timer */}
        <div className="relative z-30 w-full px-4 sm:px-6 pt-3 pb-1">
          <div className="flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-2xl bg-neutral-950/80 border border-emerald-400/40 shadow-lg backdrop-blur-md">
            {/* Progress Meter */}
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-sans font-extrabold mb-1">
                <span className="flex items-center gap-1 text-emerald-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>Bộ Phận Đã Kích Hoạt</span>
                </span>
                <span className="text-amber-300 font-mono-num text-xs">
                  {progressCount}/{REQUIRED_ACTIVATIONS} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-neutral-900 overflow-hidden border border-emerald-500/30 p-0.5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-[0_0_12px_#34d399]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                />
              </div>
            </div>

            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-sans font-extrabold text-xs sm:text-sm shadow-md transition-colors ${
                timeLeft <= 3 && gameState === 'PLAYING'
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-ping'
                  : 'bg-neutral-900/90 border-amber-400/50 text-amber-300'
              }`}
            >
              <Timer className="w-4 h-4 text-amber-400" />
              <span className="font-mono-num font-bold">0{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Floating Notification Popup */}
        <AnimatePresence>
          {floatText && (
            <motion.div
              initial={{ scale: 0.6, y: 10, opacity: 0 }}
              animate={{ scale: 1.1, y: -15, opacity: 1 }}
              exit={{ scale: 0.8, y: -30, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                top: `${floatText.y}%`,
                left: `${floatText.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-50 px-3 py-1 rounded-full bg-amber-400 text-neutral-950 font-sans font-extrabold text-[11px] sm:text-xs shadow-[0_0_20px_#fde047] border-2 border-white pointer-events-none whitespace-nowrap"
            >
              {floatText.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. CENTER: MULTI-PART INTERACTIVE CHRISTMAS TREE OBJECT */}
        <div className="relative flex-1 w-full flex items-center justify-center p-2 z-20">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-[4/5] flex items-center justify-center">
            {/* Base Tree Image (The Evergreen Trunk and Foliage) */}
            <img
              src={getAssetUrl('/assets/games/anime_christmas_tree.png')}
              alt="Anime Christmas Tree"
              className={`w-full h-full object-contain filter transition-all duration-500 select-none ${
                gameState === 'VICTORY'
                  ? 'drop-shadow-[0_15px_40px_rgba(251,191,36,0.9)] brightness-110'
                  : 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] brightness-100'
              }`}
              draggable={false}
            />

            {/* Stardust Helix Spiral Canvas */}
            <MagicTreeCanvas
              isActive={gameState === 'PLAYING' || gameState === 'VICTORY'}
              energyLevel={progressCount}
              width={400}
              height={500}
            />

            {/* 🌟 12 INDIVIDUAL INTERACTIVE OBJECTS ON THE TREE 🌟 */}
            {TREE_PARTS.map((part) => {
              const isActivated = activatedParts.has(part.id);
              const isAnimating = animatingParts[part.id];

              return (
                <div
                  key={part.id}
                  style={{
                    position: 'absolute',
                    top: `${part.y}%`,
                    left: `${part.x}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: part.type === 'star' ? 40 : 35,
                  }}
                >
                  {/* Part 1: Crown Bethlehem Star */}
                  {part.type === 'star' && (
                    <motion.button
                      type="button"
                      onClick={() => handleInteractPart(part)}
                      whileHover={{ scale: 1.3, rotate: 20 }}
                      whileTap={{ scale: 0.85 }}
                      animate={
                        isAnimating
                          ? { scale: [1, 1.6, 1.2], rotate: [0, 180, 360] }
                          : { scale: isActivated ? [1.1, 1.25, 1.1] : [1, 1.1, 1] }
                      }
                      transition={
                        isAnimating
                          ? { duration: 0.65 }
                          : { repeat: Infinity, duration: 2.5 }
                      }
                      className="relative p-2 cursor-pointer rounded-full group touch-manipulation"
                      title={part.name}
                    >
                      <div className="absolute inset-0 rounded-full bg-amber-300/40 blur-lg animate-pulse" />
                      <Star className="w-8 h-8 sm:w-11 sm:h-11 text-amber-200 fill-amber-300 drop-shadow-[0_0_18px_#fde047] group-hover:fill-white transition-colors" />
                    </motion.button>
                  )}

                  {/* Part 2: Golden Bells (Swinging Physics) */}
                  {part.type === 'bell' && (
                    <motion.button
                      type="button"
                      onClick={() => handleInteractPart(part)}
                      whileHover={{ scale: 1.35 }}
                      whileTap={{ scale: 0.9 }}
                      animate={
                        isAnimating
                          ? {
                              rotate: [0, -35, 35, -20, 20, -10, 10, 0],
                              scale: [1, 1.25, 1],
                            }
                          : isActivated
                          ? { rotate: [-4, 4, -4] }
                          : { rotate: [-2, 2, -2] }
                      }
                      transition={
                        isAnimating
                          ? { duration: 0.65, ease: 'easeInOut' }
                          : { repeat: Infinity, duration: 2 }
                      }
                      className="relative p-1.5 cursor-pointer rounded-full group touch-manipulation"
                      title={part.name}
                    >
                      {isActivated && (
                        <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-md" />
                      )}
                      <div className="p-1 rounded-full bg-neutral-900/40 backdrop-blur-xs border border-amber-300/60 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-400 group-hover:text-white" />
                      </div>
                    </motion.button>
                  )}

                  {/* Part 3: Glass Baubles / Ornaments (Elastic Bounce & Glow) */}
                  {part.type === 'bauble' && (
                    <motion.button
                      type="button"
                      onClick={() => handleInteractPart(part)}
                      whileHover={{ scale: 1.4 }}
                      whileTap={{ scale: 0.85 }}
                      animate={
                        isAnimating
                          ? { scale: [1, 1.45, 0.85, 1.2, 1] }
                          : isActivated
                          ? { scale: [1, 1.15, 1] }
                          : { scale: 1 }
                      }
                      transition={
                        isAnimating
                          ? { duration: 0.55 }
                          : { repeat: Infinity, duration: 2.2 }
                      }
                      className="relative p-1 cursor-pointer rounded-full group touch-manipulation"
                      title={part.name}
                    >
                      {/* Glow halo */}
                      <div
                        className="absolute inset-0 rounded-full blur-md opacity-75"
                        style={{ backgroundColor: part.color }}
                      />
                      {/* Glass Sphere */}
                      <div
                        className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white/80 shadow-[0_0_12px_rgba(255,255,255,0.7)] flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: part.color }}
                      >
                        {/* Specular glass reflection */}
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/90" />
                        <Sparkles className="w-2.5 h-2.5 text-white/90" />
                      </div>
                    </motion.button>
                  )}

                  {/* Part 4: Snowy Base Gifts (Jump & Wobble Physics) */}
                  {part.type === 'gift' && (
                    <motion.button
                      type="button"
                      onClick={() => handleInteractPart(part)}
                      whileHover={{ scale: 1.3, y: -6 }}
                      whileTap={{ scale: 0.85 }}
                      animate={
                        isAnimating
                          ? {
                              y: [0, -18, 4, -8, 0],
                              rotate: [0, -8, 8, -4, 4, 0],
                              scale: [1, 1.2, 1],
                            }
                          : isActivated
                          ? { y: [0, -3, 0] }
                          : { y: 0 }
                      }
                      transition={
                        isAnimating
                          ? { duration: 0.65 }
                          : { repeat: Infinity, duration: 2.5 }
                      }
                      className="relative p-1.5 cursor-pointer rounded-2xl group touch-manipulation"
                      title={part.name}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl blur-md opacity-60"
                        style={{ backgroundColor: part.color }}
                      />
                      <div className="p-1.5 rounded-xl bg-neutral-900/60 border border-white/50 shadow-[0_4px_15px_rgba(0,0,0,0.8)] backdrop-blur-xs">
                        <Gift
                          className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow"
                          style={{ color: part.color }}
                        />
                      </div>
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. BOTTOM CONTROL BAR */}
        <div className="relative z-30 pb-3 sm:pb-5 px-4 flex flex-col items-center">
          {gameState === 'READY' && (
            <motion.button
              type="button"
              onClick={startChallenge}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="px-8 py-3 sm:px-10 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-sans font-extrabold text-sm sm:text-base shadow-[0_10px_30px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.8)] flex items-center gap-2.5 border border-white/60 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-neutral-950 fill-neutral-950 animate-bounce" />
              <span>Bắt Đầu Thử Thách (10s)</span>
              <Sparkles className="w-4 h-4 text-neutral-950" />
            </motion.button>
          )}

          {gameState === 'PLAYING' && (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-950/80 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-sans font-bold shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Chạm trực tiếp vào các chuông, quả cầu hoặc hộp quà trên cây!</span>
            </div>
          )}

          {gameState === 'FAILED' && (
            <motion.button
              type="button"
              onClick={startChallenge}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="px-8 py-3 sm:px-10 sm:py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 text-neutral-950 font-sans font-extrabold text-sm sm:text-base shadow-[0_10px_30px_rgba(244,63,94,0.6)] flex items-center gap-2.5 border border-white/60 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-neutral-950 animate-spin" />
              <span>Thử Lại Ngay Nào!</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* 7. POP-UP GIFT REVEAL MODAL */}
      <AnimatePresence>
        {gameState === 'VICTORY' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              className="relative w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c1f19] via-[#081511] to-[#040807] border-2 border-amber-400/90 shadow-[0_0_60px_rgba(251,191,36,0.45),0_25px_60px_rgba(0,0,0,0.95)] text-center overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />

              {/* Bouncing Gift Box */}
              <div className="relative mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24">
                <img
                  src={getAssetUrl('/assets/games/anime_gift_box.png')}
                  alt="Anime Gift Box"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(251,191,36,0.7)] animate-bounce"
                  style={{ animationDuration: '2s' }}
                />
              </div>

              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] sm:text-xs font-sans font-extrabold uppercase tracking-wider mb-2.5 border border-amber-400/50">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Thử Thách Thành Công!</span>
              </div>

              {/* Item Title */}
              <h3 className="font-sans text-xl sm:text-2xl text-amber-100 font-extrabold tracking-normal">
                Hộp Quà Noel Thần Kỳ
              </h3>

              {/* Voucher */}
              <div className="my-3 py-3 px-4 rounded-2xl bg-neutral-900/80 border border-amber-400/30 shadow-inner">
                <p className="text-2xl sm:text-3xl font-sans text-white font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 drop-shadow">
                  Voucher 500.000 VNĐ
                </p>
              </div>

              {/* Points Earned */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm font-sans text-emerald-300 font-bold bg-emerald-900/50 py-2 px-4 rounded-xl border border-emerald-500/40">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>+540 Điểm Giáng Sinh An Lành</span>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-1">
                <button
                  type="button"
                  onClick={() => onComplete(540)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-sans font-extrabold text-sm sm:text-base shadow-[0_10px_30px_rgba(251,191,36,0.6)] hover:brightness-110 active:scale-98 transition-all cursor-pointer border border-white/60"
                >
                  ✨ Xác Nhận & Nhận Thưởng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Guidance */}
      <p className="text-[11px] sm:text-xs text-neutral-400 font-sans tracking-wide mt-2 sm:mt-3 text-center">
        {gameState === 'READY'
          ? 'Bấm "Bắt Đầu Thử Thách" để thắp sáng 8 bộ phận khác nhau trên cây thông.'
          : gameState === 'PLAYING'
          ? '💡 Mẹo: Chạm vào Ngôi Sao Bethlehem trên đỉnh hoặc các quả chuông vàng để nghe tiếng reo vui!'
          : gameState === 'FAILED'
          ? 'Đừng nản lòng! Bạn có thể bấm Thử Lại Ngay để chinh phục phần quà.'
          : 'Chúc mừng bạn đã thắp sáng toàn bộ cây thông xuất sắc!'}
      </p>
    </div>
  );
};
