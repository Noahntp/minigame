import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Check } from 'lucide-react';
import { sound } from '../../../utils/audio';

interface ChristmasTreeStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface TreeLight {
  x: number;
  y: number;
  color: string;
  delay: number;
}

export const ChristmasTreeStage: React.FC<ChristmasTreeStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [starTapped, setStarTapped] = useState<boolean>(false);
  const [treeIlluminated, setTreeIlluminated] = useState<boolean>(false);
  const [giftAppeared, setGiftAppeared] = useState<boolean>(false);

  // Fairy lights cascading down the tree tiers
  const lights: TreeLight[] = [
    { x: 50, y: 35, color: '#FACC15', delay: 0.1 },
    { x: 42, y: 50, color: '#F43F5E', delay: 0.2 },
    { x: 58, y: 52, color: '#38BDF8', delay: 0.25 },
    { x: 34, y: 70, color: '#34D399', delay: 0.35 },
    { x: 50, y: 72, color: '#FBBF24', delay: 0.4 },
    { x: 66, y: 70, color: '#EC4899', delay: 0.45 },
    { x: 26, y: 92, color: '#F43F5E', delay: 0.55 },
    { x: 40, y: 94, color: '#38BDF8', delay: 0.6 },
    { x: 60, y: 94, color: '#FACC15', delay: 0.65 },
    { x: 74, y: 92, color: '#34D399', delay: 0.7 },
    { x: 18, y: 118, color: '#FBBF24', delay: 0.8 },
    { x: 32, y: 120, color: '#EC4899', delay: 0.85 },
    { x: 50, y: 122, color: '#38BDF8', delay: 0.9 },
    { x: 68, y: 120, color: '#F43F5E', delay: 0.95 },
    { x: 82, y: 118, color: '#FACC15', delay: 1.0 },
  ];

  const handleTapStar = () => {
    if (starTapped) return;
    setStarTapped(true);
    sound.playClick(soundEnabled);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    track('STAR_TAP', 1);

    // 1. Cây sáng lung linh (Sóng ánh sáng lan tỏa từ đỉnh xuống)
    setTimeout(() => {
      setTreeIlluminated(true);
      sound.playReward(soundEnabled);
      track('TREE_ILLUMINATED', 1);

      // 2. Quà xuất hiện dưới gốc cây
      setTimeout(() => {
        setGiftAppeared(true);
        sound.playWin(soundEnabled);

        setTimeout(() => {
          onComplete(540);
        }, 1800);
      }, 1000);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-3 sm:py-6 px-2 sm:px-4 touch-none">
      {/* Noel Header */}
      <div className="text-center mb-3 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-1.5 sm:mb-2 backdrop-blur-md">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-emerald-300 font-semibold">
            Cây Thông May Mắn Hoàng Gia
          </span>
        </div>
        <h2 className="font-serif text-xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Chạm Ngôi Sao Trên Cây
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-400 font-light mt-0.5 sm:mt-1">
          Chạm vào Ngôi Sao Bethlehem trên đỉnh — Cây sẽ sáng lung linh và hộp quà xuất hiện
        </p>
      </div>

      {/* Pine Tree Stage Canvas */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#060c18]/95 via-[#081220]/95 to-[#040810]/98 border border-cyan-500/20 p-3 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center min-h-[340px] sm:min-h-[440px]">
        {/* Soft Northern Aurora Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        {/* Drifting Snowflakes */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 320],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + (i % 4),
              delay: i * 0.3,
              ease: 'linear',
            }}
            style={{
              top: '-10px',
              left: `${5 + (i * 7.5) % 90}%`,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px] pointer-events-none"
          />
        ))}

        {/* Tree Container */}
        <div className="relative w-72 sm:w-96 flex flex-col items-center justify-end scale-[0.88] sm:scale-100 origin-bottom">
          {/* 1. NGÔI SAO TRÊN ĐỈNH CÂY (TAP TARGET) */}
          <div
            onPointerDown={handleTapStar}
            onClick={handleTapStar}
            className="relative z-30 cursor-pointer flex flex-col items-center -mb-4 group touch-none"
          >
            {/* Pulsing Star Halo */}
            <motion.div
              animate={{
                scale: starTapped ? [1, 1.8, 1.4] : [1, 1.2, 1],
                opacity: starTapped ? [0.6, 1, 0.8] : [0.3, 0.7, 0.3],
              }}
              transition={{ repeat: Infinity, duration: starTapped ? 1.2 : 2.5 }}
              className="absolute inset-0 rounded-full blur-xl pointer-events-none bg-amber-400"
            />

            {/* Radiant Starburst Rays when tapped */}
            <AnimatePresence>
              {starTapped && (
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1.5, rotate: 180 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute w-32 h-32 pointer-events-none"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1="50"
                        y1="50"
                        x2={50 + 46 * Math.cos((deg * Math.PI) / 180)}
                        y2={50 + 46 * Math.sin((deg * Math.PI) / 180)}
                        stroke="#FEF08A"
                        strokeWidth="2"
                        strokeDasharray="2 4"
                      />
                    ))}
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 8-pointed Golden Bethlehem Star */}
            <motion.div
              whileHover={!starTapped ? { scale: 1.2, rotate: 10 } : {}}
              whileTap={!starTapped ? { scale: 0.9 } : {}}
              animate={{
                scale: starTapped ? 1.15 : 1,
              }}
              className="relative w-16 h-16 flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_#FACC15]">
                <defs>
                  <linearGradient id="starGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="50%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>
                {/* 8-Point Diamond Star Path */}
                <path
                  d="M50 4 L57 36 L88 20 L66 45 L98 50 L66 55 L88 80 L57 64 L50 96 L43 64 L12 80 L34 55 L2 50 L34 45 L12 20 L43 36 Z"
                  fill="url(#starGold)"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <circle cx="50" cy="50" r="7" fill="#FFFFFF" />
              </svg>
            </motion.div>

            {!starTapped && (
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300 shadow-md whitespace-nowrap"
              >
                Chạm Ngôi Sao
              </motion.div>
            )}
          </div>

          {/* 2. MAJESTIC NORDIC PINE TREE WITH FAIRY LIGHTS */}
          <div className="relative w-full h-[280px]">
            <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-2xl overflow-visible">
              <defs>
                <linearGradient id="pineGradTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#065F46" />
                  <stop offset="100%" stopColor="#022C22" />
                </linearGradient>
                <linearGradient id="pineGradMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#047857" />
                  <stop offset="100%" stopColor="#064E3B" />
                </linearGradient>
                <linearGradient id="pineGradBot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#065F46" />
                </linearGradient>
              </defs>

              {/* Tree Trunk */}
              <rect x="91" y="138" width="18" height="22" rx="3" fill="#451A03" stroke="#78350F" strokeWidth="1" />

              {/* Tier 4 (Bottom) */}
              <path
                d="M100 80 L185 142 Q100 134 15 142 Z"
                fill="url(#pineGradBot)"
                stroke="#A7F3D0"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              {/* Tier 3 */}
              <path
                d="M100 55 L168 108 Q100 102 32 108 Z"
                fill="url(#pineGradMid)"
                stroke="#A7F3D0"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              {/* Tier 2 */}
              <path
                d="M100 32 L150 78 Q100 73 50 78 Z"
                fill="url(#pineGradMid)"
                stroke="#A7F3D0"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              {/* Tier 1 (Top) */}
              <path
                d="M100 14 L132 50 Q100 46 68 50 Z"
                fill="url(#pineGradTop)"
                stroke="#A7F3D0"
                strokeWidth="1"
                strokeOpacity="0.4"
              />

              {/* Golden Garland Swags */}
              <path
                d="M74 46 Q100 58 126 46"
                stroke={treeIlluminated ? '#FDE047' : '#713F12'}
                strokeWidth="2"
                strokeDasharray="3 3"
                fill="none"
              />
              <path
                d="M58 74 Q100 92 142 74"
                stroke={treeIlluminated ? '#FDE047' : '#713F12'}
                strokeWidth="2.5"
                strokeDasharray="4 4"
                fill="none"
              />
              <path
                d="M40 104 Q100 126 160 104"
                stroke={treeIlluminated ? '#FDE047' : '#713F12'}
                strokeWidth="3"
                strokeDasharray="4 4"
                fill="none"
              />

              {/* Individual Fairy Lights that Cascade On */}
              {lights.map((l, i) => (
                <g key={i}>
                  <circle
                    cx={l.x * 2}
                    cy={l.y}
                    r={treeIlluminated ? 4.5 : 2.5}
                    fill={treeIlluminated ? l.color : '#374151'}
                    className={treeIlluminated ? 'transition-all duration-300' : ''}
                    style={{
                      transitionDelay: treeIlluminated ? `${l.delay}s` : '0s',
                      filter: treeIlluminated ? `drop-shadow(0 0 6px ${l.color})` : 'none',
                    }}
                  />
                  {treeIlluminated && (
                    <circle
                      cx={l.x * 2}
                      cy={l.y}
                      r="8"
                      fill={l.color}
                      opacity="0.3"
                      className="animate-pulse"
                      style={{ animationDelay: `${l.delay}s` }}
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* 3. QUÀ XUẤT HIỆN DƯỚI GỐC CÂY */}
        <AnimatePresence>
          {giftAppeared && (
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="relative z-30 mt-4 mx-auto w-full max-w-md p-4 rounded-xl bg-gradient-to-r from-emerald-950/85 via-neutral-900/90 to-emerald-950/85 border border-amber-400/60 shadow-[0_10px_30px_rgba(250,204,21,0.25)] text-center backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Quà Giáng Sinh Đã Xuất Hiện</span>
              </div>
              <h3 className="font-serif text-lg text-amber-200 font-normal">
                Hộp Quà Noel Thần Kỳ
              </h3>
              <p className="text-xl font-serif text-white font-semibold mt-0.5">
                Voucher 500.000 VNĐ
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-sans text-emerald-400 font-medium">
                <Check className="w-4 h-4" />
                <span>+540 Điểm Giáng Sinh An Lành</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Guidance */}
      <p className="text-xs text-neutral-400 font-sans tracking-wide mt-5 text-center">
        {!starTapped
          ? 'Chạm vào Ngôi Sao Bethlehem trên đỉnh cây để bắt đầu thắp sáng.'
          : treeIlluminated
          ? 'Cây thông đã bừng sáng lung linh — Hộp quà đã xuất hiện dưới gốc thông!'
          : 'Ngôi sao đang truyền luồng ánh sáng diệu kỳ xuống cây thông...'}
      </p>
    </div>
  );
};
