import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles, Check, Star } from 'lucide-react';
import { sound } from '../../../utils/audio';

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
  const [santaAppeared, setSantaAppeared] = useState<boolean>(false);
  const [giftThrown, setGiftThrown] = useState<boolean>(false);
  const [giftOpened, setGiftOpened] = useState<boolean>(false);

  const handleRingBell = () => {
    if (bellRung) return;
    setBellRung(true);

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

    // 4. Santa & Reindeer Sleigh appear and glide across the aurora sky at t = 950ms
    setTimeout(() => {
      setSantaAppeared(true);
      sound.playSleighBells(soundEnabled);
      track('SANTA_APPEAR', 1);

      // 5. Santa reaches center sky (1.8s into the 4.2s flight) and drops the glowing gift box
      setTimeout(() => {
        setGiftThrown(true);
        sound.playMagicChime(soundEnabled);
        track('GIFT_THROWN', 1);

        // 6. Gift lands on ground and opens up, revealing reward
        setTimeout(() => {
          setGiftOpened(true);
          sound.playWin(soundEnabled);

          setTimeout(() => {
            onComplete(600);
          }, 2800);
        }, 1100);
      }, 1800);
    }, 950);
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
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-2 sm:py-6 px-2 sm:px-4 touch-manipulation">
      {/* Arctic Holiday Anime Header */}
      <div className="text-center mb-2.5 sm:mb-6 z-10">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 mb-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[10px] sm:text-[12px] font-sans uppercase tracking-[0.25em] text-cyan-200 font-bold drop-shadow">
            Đêm Giáng Sinh Cổ Tích
          </span>
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl text-amber-100 font-bold tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Rung Chuông Nhận Quà Santa
        </h2>
        <p className="text-[12px] sm:text-sm text-cyan-100/80 font-light mt-0.5 sm:mt-1 drop-shadow">
          Chạm vào chuông vàng thần kỳ — Santa sẽ lướt cỗ xe tuần lộc qua bầu trời trao quà
        </p>
      </div>

      {/* Main Anime Winter Wonderland Stage Container */}
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-300/40 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(251,191,36,0.2)] overflow-hidden flex flex-col items-center justify-between min-h-[360px] sm:min-h-[500px]">
        {/* 1. ANIME WINTER VILLAGE BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: "url('/assets/games/anime_winter_bg.jpg')",
            transform: bellRung ? 'scale(1.03)' : 'scale(1)',
          }}
        />

        {/* Soft Aurora Glow & Twilight Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1c]/40 via-transparent to-[#020712]/75 pointer-events-none" />

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
                y: [ -20, 520 ],
                x: [0, (snow.id % 2 === 0 ? 1 : -1) * 25, 0],
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
        <div className="absolute inset-x-0 top-0 h-72 sm:h-80 overflow-hidden pointer-events-none z-30">
          {santaAppeared && (
            <div className="absolute top-2 left-1/2 flex flex-col items-center pointer-events-none animate-santa-flight">
              {/* Anime Santa & Reindeer Galloping Motion */}
              <div className="relative drop-shadow-[0_15px_35px_rgba(251,191,36,0.95)] animate-reindeer-gallop">
                <img
                  src="/assets/games/anime_santa_reindeer.png"
                  alt="Santa and Reindeer Sleigh"
                  className="w-72 sm:w-96 h-auto object-contain select-none"
                />
                {/* Glowing stardust exhaust stream behind Santa's sleigh (on the right) */}
                <div className="absolute -right-12 top-1/2 w-44 h-8 bg-gradient-to-r from-amber-300/85 via-cyan-300/40 to-transparent blur-md rotate-6 animate-stardust-stream" />
                {/* Trailing golden fairy dust sparkles */}
                <div className="absolute -right-4 top-1/3 text-amber-300 text-sm animate-ping">✨</div>
                <div className="absolute -right-10 top-1/2 text-cyan-200 text-base animate-pulse">★</div>
                <div className="absolute -right-16 top-2/3 text-amber-200 text-xs animate-bounce">🌟</div>
                <div className="absolute -right-22 top-1/2 text-amber-300/70 text-xs animate-pulse">✨</div>
                {/* Sparkle Stars floating around reindeer golden antlers (on the left) */}
                <div className="absolute left-2 -top-3 text-amber-300 text-sm animate-ping">✨</div>
                <div className="absolute left-14 -top-1 text-cyan-200 text-base animate-pulse">★</div>
                <div className="absolute left-24 bottom-4 text-amber-200 text-xs animate-bounce">🌟</div>
              </div>
            </div>
          )}
        </div>

        {/* 3. THROWN ANIME GIFT BOX TRAJECTORY WITH SQUASH & BOUNCE */}
        <AnimatePresence>
          {giftThrown && !giftOpened && (
            <motion.div
              initial={{ x: 0, y: -20, scale: 0.4, rotate: -25 }}
              animate={{
                x: [0, -10, 0],
                y: [-20, 50, 130],
                scale: [0.4, 0.85, 1.15],
                rotate: [-25, 45, 0],
              }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute top-16 z-40 pointer-events-none flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{
                  scaleY: [1, 1.15, 0.75, 1.05, 1],
                  scaleX: [1, 0.88, 1.25, 0.95, 1],
                }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="relative drop-shadow-[0_15px_30px_rgba(244,63,94,0.9)]"
              >
                <img
                  src="/assets/games/anime_gift_box.png"
                  alt="Anime Gift Box"
                  className="w-24 sm:w-32 h-auto object-contain"
                />
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. ORNATE WOODEN BEAM & SWINGING ANIME GOLDEN BELL */}
        <div className="relative z-20 flex flex-col items-center my-auto pb-4">
          {/* Snowy Fir Garland & Wood Beam */}
          <div className="relative flex items-center justify-center mb-1">
            <div className="w-36 sm:w-48 h-3.5 sm:h-4 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 rounded-full border border-amber-500/60 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center">
              <div className="w-full h-1 bg-white/70 rounded-full mx-2 blur-[0.5px]" />
            </div>
            {/* Hanging chain */}
            <div className="absolute top-3 w-1.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-sm border border-amber-200/50 shadow-sm" />
          </div>

          {/* Oscillating Pendulum Bell with Spring Physics */}
          <motion.div
            style={{ transformOrigin: 'top center' }}
            animate={{
              rotate: bellRung
                ? [0, -36, 32, -24, 20, -14, 10, -5, 3, 0]
                : [0, -2, 2, -1, 1, 0],
            }}
            transition={{
              duration: bellRung ? 1.8 : 4,
              repeat: bellRung ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            role="button"
            tabIndex={0}
            whileHover={!bellRung ? { scale: 1.08 } : {}}
            whileTap={!bellRung ? { scale: 0.94 } : {}}
            onClick={handleRingBell}
            className="cursor-pointer relative flex flex-col items-center group touch-manipulation pt-4 px-4 select-none active:scale-95"
          >
            {/* Anime Golden Bell Image with Holly Berries & Bow (1:1 Aspect Ratio) */}
            <div className="relative w-36 sm:w-44 h-36 sm:h-44 flex items-center justify-center">
              {/* Acoustic Golden Soundwave Rings - pinpointed right at the clapper & mouth of the golden bell */}
              {bellRung && (
                <div className="absolute top-[76%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center pointer-events-none z-0">
                  <motion.div
                    key="soundwave-1"
                    initial={{ scale: 0.2, opacity: 0.95 }}
                    animate={{ scale: [0.2, 2.8], opacity: [0.95, 0] }}
                    transition={{ duration: 0.85, ease: 'easeOut' }}
                    className="w-28 sm:w-36 h-28 sm:h-36 rounded-full border-2 border-amber-300 shadow-[0_0_25px_#fde047] flex-shrink-0 absolute"
                  />
                  <motion.div
                    key="soundwave-2"
                    initial={{ scale: 0.2, opacity: 0.95 }}
                    animate={{ scale: [0.2, 3.3], opacity: [0.95, 0] }}
                    transition={{ duration: 0.85, delay: 0.36, ease: 'easeOut' }}
                    className="w-28 sm:w-36 h-28 sm:h-36 rounded-full border-2 border-cyan-300/90 shadow-[0_0_28px_#67e8f9] flex-shrink-0 absolute"
                  />
                  <motion.div
                    key="soundwave-3"
                    initial={{ scale: 0.2, opacity: 0.85 }}
                    animate={{ scale: [0.2, 3.8], opacity: [0.85, 0] }}
                    transition={{ duration: 0.85, delay: 0.72, ease: 'easeOut' }}
                    className="w-28 sm:w-36 h-28 sm:h-36 rounded-full border-2 border-amber-200/75 shadow-[0_0_22px_#fef08a] flex-shrink-0 absolute"
                  />
                </div>
              )}

              <img
                src="/assets/games/anime_golden_bell.png"
                alt="Anime Golden Bell"
                className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(251,191,36,0.85)] filter group-hover:brightness-110 transition-all duration-300 relative z-10"
              />

              {/* Floating Sparkle Stars around Bell */}
              {!bellRung && (
                <>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8], y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 text-amber-300 text-lg filter drop-shadow-[0_0_8px_gold]"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1.1, 0.7], y: [2, -2, 2] }}
                    transition={{ repeat: Infinity, duration: 2.4, delay: 0.5 }}
                    className="absolute bottom-4 -left-2 text-cyan-200 text-base filter drop-shadow-[0_0_8px_cyan]"
                  >
                    🌟
                  </motion.div>
                </>
              )}
            </div>

            {/* Tap Prompt Button Badge */}
            {!bellRung && (
              <motion.div
                animate={{ y: [0, -4, 0], scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="mt-1 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-wider shadow-[0_4px_20px_rgba(251,191,36,0.7)] border border-white flex items-center gap-2 group-hover:shadow-[0_6px_25px_rgba(251,191,36,0.9)]"
              >
                <Bell className="w-4 h-4 text-amber-950 fill-amber-950 animate-bounce" />
                <span>Rung Chuông Ngay</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 5. REVEALED ANIME GIFT RESULT MODAL / BANNER */}
        <div className="w-full min-h-[110px] sm:min-h-[130px] flex items-center justify-center p-3 z-30">
          <AnimatePresence>
            {giftOpened && (
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.75 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 18, stiffness: 240 }}
                className="relative mx-auto w-full max-w-lg p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1a0f28]/95 via-[#0e1628]/95 to-[#0b0f1a]/98 border-2 border-amber-400/80 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(251,191,36,0.35)] text-center backdrop-blur-xl flex flex-col items-center"
              >
                {/* Floating mini anime gift box icon */}
                <div className="absolute -top-7 w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 border-2 border-amber-300 shadow-[0_0_20px_rgba(244,63,94,0.8)] flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/games/anime_gift_box.png"
                    alt="Gift Mini"
                    className="w-12 h-12 object-contain"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-sans font-bold uppercase tracking-wider mb-1 mt-3">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Santa Đã Tặng Quà Cho Bạn</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>

                <h3 className="font-serif text-lg sm:text-2xl text-amber-200 font-bold drop-shadow">
                  Hộp Quà Giáng Sinh Diệu Kỳ
                </h3>

                <div className="my-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-300/40">
                  <p className="text-xl sm:text-2xl font-serif text-white font-extrabold tracking-wide drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">
                    Voucher 600.000 VNĐ
                  </p>
                  <p className="text-[11px] text-amber-200/90 font-sans">
                    Áp dụng cho mọi dịch vụ Cloud & Domain Mắt Bão
                  </p>
                </div>

                <div className="mt-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-sans text-emerald-400 font-semibold">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>+600 Điểm Phúc Lộc Noel Đã Được Cộng</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Guidance */}
      <p className="text-[12px] sm:text-sm text-cyan-200/90 font-sans tracking-wide mt-3 sm:mt-5 text-center drop-shadow">
        {!bellRung
          ? '🔔 Chạm vào chiếc chuông vàng để đánh thức Santa từ xứ sở tuyết trắng!'
          : giftOpened
          ? '🎉 Chúc mừng bạn đã nhận được món quà may mắn từ ông già Noel!'
          : '✨ Tiếng chuông đang vang vọng... Santa cùng đoàn tuần lộc đang đến!'}
      </p>
    </div>
  );
};

