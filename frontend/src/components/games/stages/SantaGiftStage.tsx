import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles, Check, Star, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/audio';
import { getAssetUrl } from '../../../utils/assets';

interface SantaGiftStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

export const SantaGiftStage: React.FC<SantaGiftStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [bellRung, setBellRung] = useState<boolean>(false);
  const [swoopActive, setSwoopActive] = useState<boolean>(false);
  const [giftThrown, setGiftThrown] = useState<boolean>(false);
  const [giftOpened, setGiftOpened] = useState<boolean>(false);

  const handleOpenGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);
    setSwoopActive(false);
    sound.playWin(soundEnabled);

    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#fbbf24', '#f43f5e', '#38bdf8', '#ffffff', '#10b981'],
      });
    } catch {
      // ignore
    }
    track('GIFT_OPENED', 600);
  };

  const handleRingBell = () => {
    if (bellRung) return;
    setBellRung(true);
    setSwoopActive(true);

    // 1st stroke: Clapper strikes the bell rim immediately upon tap (t = 0ms)
    sound.playBell(soundEnabled, 1.0, 0.35);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    track('BELL_RING', 1);

    // 2nd stroke: Bell swings through to apex on right (+32 deg) at t = 360ms
    setTimeout(() => {
      sound.playBell(soundEnabled, 1.08, 0.28);
    }, 360);

    // 3rd stroke: Bell swings back left (-24 deg) at t = 720ms
    setTimeout(() => {
      sound.playBell(soundEnabled, 0.95, 0.20);
    }, 720);

    // Sleigh bells chime as Santa swoops across the sky
    setTimeout(() => {
      sound.playSleighBells(soundEnabled);
      track('SANTA_APPEAR', 1);
    }, 450);

    // Climax of swoop at center sky (t = 1600ms): Santa releases the glowing gift box
    setTimeout(() => {
      setGiftThrown(true);
      sound.playMagicChime(soundEnabled);
      track('GIFT_THROWN', 1);

      // Auto-open gift if user hasn't tapped after 1400ms of landing
      setTimeout(() => {
        handleOpenGift();
      }, 1400);
    }, 1600);
  };

  // Auto-ring support for preview & verification
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('autoRing=true')) {
      const timer = setTimeout(() => {
        handleRingBell();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Falling snow particles generator for anime atmosphere
  const snowflakes = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 5.8) % 100,
    size: (i % 3) + 3,
    duration: 3 + (i % 4),
    delay: (i * 0.35) % 2.5,
    opacity: 0.4 + (i % 5) * 0.12,
  }));

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-1 sm:py-4 px-2 sm:px-4 touch-manipulation">
      {/* Arctic Holiday Anime Header */}
      <div className="text-center mb-2 sm:mb-4 z-10">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 mb-1 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[10px] sm:text-[12px] font-sans uppercase tracking-[0.25em] text-cyan-200 font-bold drop-shadow">
            Đêm Giáng Sinh Cổ Tích
          </span>
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-amber-100 font-bold tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Rung Chuông Nhận Quà Santa
        </h2>
        <p className="text-[11px] sm:text-sm text-cyan-100/80 font-light mt-0.5 drop-shadow">
          Chạm vào chuông vàng thần kỳ — Santa sẽ lướt cỗ xe tuần lộc qua bầu trời trao quà
        </p>
      </div>

      {/* Main Anime Winter Wonderland Stage Container */}
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-300/40 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(251,191,36,0.2)] overflow-hidden flex flex-col items-center justify-between min-h-[440px] sm:min-h-[500px]">
        {/* 1. ANIME WINTER VILLAGE BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('${getAssetUrl('/assets/games/anime_winter_bg.jpg')}')`,
            transform: bellRung ? 'scale(1.03)' : 'scale(1)',
          }}
        />

        {/* Soft Aurora Glow & Twilight Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1c]/45 via-[#041026]/20 to-[#020712]/80 pointer-events-none" />

        {/* Shimmering Animated Falling Snowflakes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {snowflakes.map((snow) => (
            <motion.div
              key={snow.id}
              className="absolute bg-white rounded-full pointer-events-none"
              style={{
                left: `${snow.x}%`,
                width: `${snow.size}px`,
                height: `${snow.size}px`,
                boxShadow: '0 0 6px rgba(255,255,255,0.8)',
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: [-20, 520],
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

        {/* 2. FLYING ANIME SANTA SLEIGH & REINDEER ACROSS THE AURORA SKY */}
        <div className="absolute inset-x-0 top-0 h-64 sm:h-80 overflow-hidden pointer-events-none z-30">
          <div
            className={`absolute top-1 sm:top-2 left-1/2 flex flex-col items-center pointer-events-none ${
              swoopActive
                ? 'animate-santa-swoop'
                : giftOpened
                ? 'animate-santa-celebrate'
                : 'animate-santa-gliding'
            }`}
          >
            {/* Anime Santa & Reindeer Galloping Motion with Leaping Physics */}
            <div className="relative drop-shadow-[0_15px_35px_rgba(251,191,36,0.95)] animate-reindeer-gallop">
              <img
                src={getAssetUrl('/assets/games/anime_santa_reindeer.png')}
                alt="Santa and Reindeer Sleigh"
                className="w-56 sm:w-76 md:w-92 max-w-[85vw] h-auto object-contain select-none"
              />

              {/* Glowing stardust exhaust stream behind Santa's sleigh */}
              <div className="absolute -right-8 sm:-right-12 top-1/2 w-32 sm:w-44 h-6 sm:h-7 bg-gradient-to-r from-amber-300/85 via-cyan-300/40 to-transparent blur-md rotate-6 animate-stardust-stream pointer-events-none" />

              {/* Trailing golden fairy dust sparkles */}
              <div className="absolute -right-4 top-1/3 text-amber-300 text-xs sm:text-sm animate-ping">✨</div>
              <div className="absolute -right-10 top-1/2 text-cyan-200 text-sm animate-pulse">★</div>
              <div className="absolute -right-16 top-2/3 text-amber-200 text-xs animate-bounce">🌟</div>
              <div className="absolute -right-22 top-1/2 text-amber-300/70 text-xs animate-pulse">✨</div>

              {/* Sparkle Stars floating around reindeer golden antlers */}
              <div className="absolute left-2 -top-3 text-amber-300 text-xs sm:text-sm animate-ping">✨</div>
              <div className="absolute left-12 -top-1 text-cyan-200 text-sm animate-pulse">★</div>
              <div className="absolute left-20 bottom-3 text-amber-200 text-xs animate-bounce">🌟</div>
            </div>
          </div>
        </div>

        {/* 3. CENTER INTERACTIVE ZONE (Bell before drop -> Gift Box & Voucher after drop) */}
        <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full px-2">
          {!giftThrown ? (
            /* A. ORNATE WOODEN BEAM & SWINGING ANIME GOLDEN BELL */
            <motion.div
              key="bell-interactive"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative flex flex-col items-center pb-2 sm:pb-4"
            >
              {/* Snowy Fir Garland & Wood Beam */}
              <div className="relative flex items-center justify-center mb-1">
                <div className="w-32 sm:w-44 h-3 sm:h-3.5 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 rounded-full border border-amber-500/60 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  <div className="w-full h-1 bg-white/70 rounded-full mx-2 blur-[0.5px]" />
                </div>
                {/* Hanging chain */}
                <div className="absolute top-2.5 w-1.5 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-sm border border-amber-200/50 shadow-sm" />
              </div>

              {/* Oscillating Pendulum Bell with Spring Physics */}
              <motion.div
                style={{ transformOrigin: 'top center' }}
                animate={{
                  rotate: bellRung
                    ? [0, -32, 28, -20, 16, -10, 8, -4, 2, 0]
                    : [0, -2, 2, -1, 1, 0],
                }}
                transition={{
                  duration: bellRung ? 1.8 : 4,
                  repeat: bellRung ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
                role="button"
                tabIndex={0}
                whileHover={!bellRung ? { scale: 1.06 } : {}}
                whileTap={!bellRung ? { scale: 0.94 } : {}}
                onClick={handleRingBell}
                className="cursor-pointer relative flex flex-col items-center group touch-manipulation pt-2 px-4 select-none active:scale-95"
              >
                {/* Anime Golden Bell Image with Holly Berries & Bow */}
                <div className="relative w-32 sm:w-40 h-32 sm:h-40 flex items-center justify-center">
                  {/* Acoustic Golden Soundwave Rings */}
                  {bellRung && (
                    <div className="absolute top-[76%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center pointer-events-none z-0">
                      <motion.div
                        key="soundwave-1"
                        initial={{ scale: 0.2, opacity: 0.95 }}
                        animate={{ scale: [0.2, 2.6], opacity: [0.95, 0] }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                        className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-2 border-amber-300 shadow-[0_0_25px_#fde047] flex-shrink-0 absolute"
                      />
                      <motion.div
                        key="soundwave-2"
                        initial={{ scale: 0.2, opacity: 0.95 }}
                        animate={{ scale: [0.2, 3.1], opacity: [0.95, 0] }}
                        transition={{ duration: 0.85, delay: 0.36, ease: 'easeOut' }}
                        className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-2 border-cyan-300/90 shadow-[0_0_28px_#67e8f9] flex-shrink-0 absolute"
                      />
                      <motion.div
                        key="soundwave-3"
                        initial={{ scale: 0.2, opacity: 0.85 }}
                        animate={{ scale: [0.2, 3.6], opacity: [0.85, 0] }}
                        transition={{ duration: 0.85, delay: 0.72, ease: 'easeOut' }}
                        className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-2 border-amber-200/75 shadow-[0_0_22px_#fef08a] flex-shrink-0 absolute"
                      />
                    </div>
                  )}

                  <img
                    src={getAssetUrl('/assets/games/anime_golden_bell.png')}
                    alt="Anime Golden Bell"
                    className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(251,191,36,0.85)] filter group-hover:brightness-110 transition-all duration-300 relative z-10"
                  />

                  {/* Floating Sparkle Stars around Bell */}
                  {!bellRung && (
                    <>
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8], y: [-2, 2, -2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-1 -right-1 text-amber-300 text-base filter drop-shadow-[0_0_8px_gold]"
                      >
                        ✨
                      </motion.div>
                      <motion.div
                        animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1.1, 0.7], y: [2, -2, 2] }}
                        transition={{ repeat: Infinity, duration: 2.4, delay: 0.5 }}
                        className="absolute bottom-2 -left-2 text-cyan-200 text-sm filter drop-shadow-[0_0_8px_cyan]"
                      >
                        🌟
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Tap Prompt Button Badge */}
                {!bellRung && (
                  <motion.div
                    animate={{ y: [0, -3, 0], scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    className="mt-1 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-wider shadow-[0_4px_20px_rgba(251,191,36,0.7)] border border-white flex items-center gap-2 group-hover:shadow-[0_6px_25px_rgba(251,191,36,0.9)] active:scale-95"
                  >
                    <Bell className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-950 fill-amber-950 animate-bounce" />
                    <span>Rung Chuông Nhận Hộp Quà</span>
                    <Gift className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-rose-950 fill-rose-600 animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            /* B. ANIME GIFT BOX & REVEALED VOUCHER (NEVER HIDDEN, PERSISTENT DISPLAY) */
            <div className="relative flex flex-col items-center justify-center w-full">
              {/* The 3D Anime Gift Box */}
              <motion.div
                initial={{ y: -70, scale: 0.35, rotate: -20, opacity: 0 }}
                animate={{
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                onClick={!giftOpened ? handleOpenGift : undefined}
                role={!giftOpened ? 'button' : undefined}
                tabIndex={!giftOpened ? 0 : undefined}
                className={`relative flex items-center justify-center select-none ${
                  !giftOpened ? 'cursor-pointer group' : ''
                }`}
              >
                {/* Radial Glow */}
                <div
                  className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
                    giftOpened
                      ? 'bg-gradient-to-r from-amber-400/60 via-rose-500/50 to-amber-300/60 animate-pulse scale-125'
                      : 'bg-amber-400/40 blur-xl group-hover:scale-110'
                  }`}
                />

                <motion.div
                  animate={
                    !giftOpened
                      ? {
                          scaleY: [1, 1.22, 0.72, 1.08, 1],
                          scaleX: [1, 0.82, 1.28, 0.94, 1],
                        }
                      : {
                          y: [0, -5, 0],
                          scale: [1, 1.04, 1],
                          rotate: [-0.5, 0.5, -0.5],
                        }
                  }
                  transition={
                    !giftOpened
                      ? { duration: 0.65, delay: 0.5 }
                      : { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }
                  }
                  className="relative z-10"
                >
                  <img
                    src={getAssetUrl('/assets/games/anime_gift_box.png')}
                    alt="Hộp Quà Giáng Sinh"
                    className={`${
                      giftOpened
                        ? 'w-24 sm:w-32 h-24 sm:h-32'
                        : 'w-32 sm:w-40 h-32 sm:h-40 group-hover:scale-105'
                    } object-contain drop-shadow-[0_15px_35px_rgba(244,63,94,0.95)] filter brightness-110 transition-all duration-500`}
                  />
                </motion.div>

                {/* Stars around Gift Box */}
                {giftOpened && (
                  <>
                    <div className="absolute -top-1 -right-3 text-amber-300 text-lg animate-ping">✨</div>
                    <div className="absolute -bottom-1 -left-3 text-amber-300 text-base animate-bounce">🌟</div>
                    <div className="absolute top-1/2 -right-5 text-cyan-200 text-sm animate-pulse">★</div>
                  </>
                )}

                {/* Tap to open prompt when unopened */}
                {!giftOpened && (
                  <motion.div
                    animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    className="absolute -bottom-4 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-neutral-950 text-[10px] sm:text-xs font-sans font-extrabold shadow-lg z-20 whitespace-nowrap pointer-events-none border border-white/60"
                  >
                    👆 Chạm Để Mở Quà!
                  </motion.div>
                )}
              </motion.div>

              {/* Voucher Card underneath the Gift Box */}
              <AnimatePresence>
                {giftOpened && (
                  <motion.div
                    initial={{ y: 25, opacity: 0, scale: 0.88 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                    className="relative mx-auto w-full max-w-md mt-1 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-b from-[#1a0f28]/95 via-[#0e1628]/95 to-[#0b0f1a]/98 border-2 border-amber-400/80 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(251,191,36,0.35)] text-center backdrop-blur-xl flex flex-col items-center"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider mb-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Hộp Quà Giáng Sinh Đã Mở</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>

                    <h3 className="font-serif text-base sm:text-lg text-amber-200 font-bold drop-shadow">
                      Phần Quà May Mắn Từ Santa
                    </h3>

                    <div className="my-1 py-1 sm:py-1.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-300/40 w-full">
                      <p className="text-lg sm:text-2xl font-serif text-white font-extrabold tracking-wide drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">
                        Voucher 600.000 VNĐ
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-sans">
                        Áp dụng cho mọi dịch vụ Cloud & Domain Mắt Bão
                      </p>
                    </div>

                    <div className="mt-0.5 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-sans text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      <span>+600 Điểm Phúc Lộc Noel Đã Được Cộng</span>
                    </div>

                    {/* Prominent Action Button to confirm reward & proceed */}
                    <button
                      type="button"
                      onClick={() => onComplete(600)}
                      className="w-full mt-2 sm:mt-2.5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-sans font-extrabold text-xs sm:text-sm shadow-[0_8px_25px_rgba(251,191,36,0.6)] hover:brightness-110 active:scale-98 transition-all cursor-pointer border border-white/70 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-neutral-950" />
                      <span>✨ Xác Nhận & Nhận Thưởng</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Footer Guidance */}
      <p className="text-[11px] sm:text-sm text-cyan-200/90 font-sans tracking-wide mt-2 sm:mt-4 text-center drop-shadow">
        {!bellRung
          ? '🔔 Chạm vào chiếc chuông vàng để gọi Santa lướt cỗ xe tuần lộc qua bầu trời trao quà!'
          : giftOpened
          ? '🎉 Chúc mừng bạn đã nhận được món quà may mắn từ ông già Noel!'
          : '✨ Tiếng chuông đang vang vọng... Santa cùng đoàn tuần lộc đang bay đến trao quà!'}
      </p>
    </div>
  );
};



