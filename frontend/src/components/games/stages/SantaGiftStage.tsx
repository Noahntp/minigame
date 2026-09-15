import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Gift, Check } from 'lucide-react';
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
    sound.playClick(soundEnabled);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    track('BELL_RING', 1);

    // 1. Santa xuất hiện lướt qua bầu trời cực quang
    setTimeout(() => {
      setSantaAppeared(true);
      sound.playReward(soundEnabled);
      track('SANTA_APPEAR', 1);

      // 2. Santa ném hộp quà rơi xuống sân khấu
      setTimeout(() => {
        setGiftThrown(true);
        track('GIFT_THROWN', 1);

        // 3. Hộp quà tiếp đất mở nắp lộ thưởng
        setTimeout(() => {
          setGiftOpened(true);
          sound.playWin(soundEnabled);

          setTimeout(() => {
            onComplete(600);
          }, 1800);
        }, 900);
      }, 1100);
    }, 500);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-3 sm:py-6 px-2 sm:px-4 touch-none">
      {/* Arctic Holiday Header */}
      <div className="text-center mb-3 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 mb-1.5 sm:mb-2 backdrop-blur-md">
          <Bell className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-cyan-300 font-semibold">
            Đêm Giáng Sinh Bắc Cực
          </span>
        </div>
        <h2 className="font-serif text-xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Rung Chuông Nhận Hộp Quà
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-400 font-light mt-0.5 sm:mt-1">
          Bấm chiếc chuông đồng cổ điển — Santa sẽ xuất hiện từ bầu trời cực quang và ném hộp quà trao bạn
        </p>
      </div>

      {/* Arctic Aurora Sky Stage */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#050b16]/95 via-[#071324]/95 to-[#030810]/98 border border-cyan-500/20 p-3 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-between min-h-[340px] sm:min-h-[440px]">
        {/* Shimmering Aurora Borealis Gradient Ribbons */}
        <div className="absolute top-0 inset-x-0 h-44 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/25 via-cyan-500/15 to-transparent pointer-events-none blur-xl" />
        <div className="absolute top-8 left-1/4 w-80 h-16 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* 1. SANTA & FLYING SLEIGH CROSSING THE SKY */}
        <div className="relative w-full h-24 overflow-visible">
          <AnimatePresence>
            {santaAppeared && (
              <motion.div
                initial={{ x: -280, y: -20, opacity: 0, scale: 0.75 }}
                animate={{
                  x: giftThrown ? 320 : 60,
                  y: giftThrown ? -40 : 0,
                  opacity: [0, 1, 1, giftThrown ? 0 : 1],
                  scale: giftThrown ? 0.7 : 1,
                }}
                transition={{
                  duration: giftThrown ? 1.4 : 1.1,
                  ease: 'easeOut',
                }}
                className="absolute top-2 left-1/3 z-20 flex items-center gap-3 pointer-events-none"
              >
                {/* Santa Sleigh Artwork SVG */}
                <div className="relative drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                  <svg viewBox="0 0 160 80" className="w-36 h-20">
                    <defs>
                      <linearGradient id="sleighGold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFFBEB" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#B45309" />
                      </linearGradient>
                      <linearGradient id="santaRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#991B1B" />
                      </linearGradient>
                    </defs>

                    {/* Sleigh Runner (Skis) */}
                    <path
                      d="M10 65 Q40 68 110 65 Q130 65 140 50"
                      stroke="url(#sleighGold)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path d="M35 65 L45 52 M90 65 L95 52" stroke="url(#sleighGold)" strokeWidth="2" />

                    {/* Sleigh Carriage Body */}
                    <path
                      d="M25 50 Q15 28 35 25 Q70 25 105 32 Q120 36 122 50 Z"
                      fill="url(#santaRed)"
                      stroke="url(#sleighGold)"
                      strokeWidth="2"
                    />

                    {/* Gift Bag inside Sleigh */}
                    <ellipse cx="45" cy="30" rx="18" ry="14" fill="#B45309" stroke="#FDE68A" strokeWidth="1.5" />

                    {/* Santa Claus Silhouette / Figure */}
                    <circle cx="85" cy="24" r="9" fill="#FEE2E2" />
                    {/* Beard */}
                    <path d="M78 26 Q85 40 92 26 Z" fill="#FFFFFF" />
                    {/* Hat */}
                    <path d="M76 20 Q85 10 98 22 Z" fill="#EF4444" />
                    <circle cx="98" cy="22" r="3" fill="#FFFFFF" />
                  </svg>
                </div>

                {/* Stardust Wake behind Santa */}
                <div className="absolute -left-12 top-4 w-24 h-4 bg-gradient-to-l from-amber-400/60 to-transparent blur-[2px]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. THE THROWN GIFT BOX TRAJECTORY */}
        <AnimatePresence>
          {giftThrown && !giftOpened && (
            <motion.div
              initial={{ x: 80, y: -20, scale: 0.5, rotate: 0 }}
              animate={{
                x: [80, 20, 0],
                y: [-20, -70, 110],
                scale: [0.5, 0.9, 1.15],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute top-20 z-30 pointer-events-none flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-600 to-rose-900 border-2 border-amber-300 shadow-[0_0_25px_#f43f5e] flex items-center justify-center">
                <Gift className="w-9 h-9 text-amber-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. CATHEDRAL BRASS BELL (TAP TARGET) */}
        <div className="relative z-10 flex flex-col items-center my-4">
          {/* Bell Arch Stand */}
          <div className="w-32 h-3 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-full border border-amber-500/40 mb-1" />

          {/* Oscillating Swinging Bell */}
          <motion.div
            style={{ transformOrigin: 'top center' }}
            animate={{
              rotate: bellRung ? [0, -28, 28, -18, 18, -10, 10, -4, 4, 0] : 0,
            }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            whileHover={!bellRung ? { scale: 1.08 } : {}}
            whileTap={!bellRung ? { scale: 0.92 } : {}}
            onPointerDown={handleRingBell}
            onClick={handleRingBell}
            className="cursor-pointer relative flex flex-col items-center group touch-none"
          >
            {/* Acoustic Resonance Rings */}
            {bellRung && (
              <>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
                />
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                  className="absolute inset-0 rounded-full border-2 border-amber-300/60 pointer-events-none"
                />
              </>
            )}

            {/* Bell Body Artwork SVG */}
            <div className="relative w-24 h-28 flex items-center justify-center">
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]">
                <defs>
                  <linearGradient id="bellMetal" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#78350F" />
                    <stop offset="25%" stopColor="#FDE68A" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="75%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                </defs>

                {/* Suspension Ring */}
                <circle cx="50" cy="14" r="8" fill="none" stroke="url(#bellMetal)" strokeWidth="3" />

                {/* Flared Bell Body */}
                <path
                  d="M44 22 L56 22 Q60 55 72 82 Q84 96 88 100 Q50 104 12 100 Q16 96 28 82 Q40 55 44 22 Z"
                  fill="url(#bellMetal)"
                  stroke="#FFFFFF"
                  strokeOpacity="0.3"
                  strokeWidth="1.5"
                />

                {/* Embossed Filigree Band */}
                <path d="M22 88 Q50 94 78 88" stroke="#78350F" strokeWidth="2.5" fill="none" />
                <path d="M16 96 Q50 102 84 96" stroke="#FEF08A" strokeWidth="2" fill="none" />

                {/* Clapper (Con lắc chuông) */}
                <circle cx="50" cy="106" r="7" fill="#B45309" stroke="#FDE68A" strokeWidth="1.5" />
              </svg>
            </div>

            {!bellRung && (
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-2 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300 shadow-md whitespace-nowrap"
              >
                Bấm Rung Chuông
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 4. HỘP QUÀ SANTA TẶNG ĐÃ MỞ (KẾT QUẢ) */}
        <div className="w-full min-h-[90px] flex items-center justify-center">
          <AnimatePresence>
            {giftOpened && (
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                className="relative z-30 mx-auto w-full max-w-md p-4 rounded-xl bg-gradient-to-r from-rose-950/85 via-neutral-900/90 to-rose-950/85 border border-amber-400/60 shadow-[0_10px_30px_rgba(244,63,94,0.25)] text-center backdrop-blur-md"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Santa Đã Tặng Quà Cho Bạn</span>
                </div>
                <h3 className="font-serif text-lg text-amber-200 font-normal">
                  Hộp Quà Giáng Sinh Thần Tốc
                </h3>
                <p className="text-xl font-serif text-white font-semibold mt-0.5">
                  Voucher 600.000 VNĐ
                </p>
                <div className="mt-2 flex items-center justify-center gap-2 text-xs font-sans text-emerald-400 font-medium">
                  <Check className="w-4 h-4" />
                  <span>+600 Điểm Phúc Lộc Noel</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Guidance */}
      <p className="text-xs text-neutral-400 font-sans tracking-wide mt-5 text-center">
        {!bellRung
          ? 'Bấm chiếc chuông đồng để báo hiệu cho Santa mang quà đến.'
          : giftOpened
          ? 'Santa đã ném hộp quà may mắn trao tay bạn!'
          : 'Chuông đang ngân vang báo hiệu đoàn xe tuần lộc...'}
      </p>
    </div>
  );
};
