import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Check } from 'lucide-react';
import { sound } from '../../../utils/audio';

interface LuckyEnvelopeStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface RedEnvelope {
  id: string;
  char: string;
  meaning: string;
  blessing: string;
  voucher: string;
  score: number;
}

interface FlyingCoin {
  id: number;
  x: number;
  y: number;
  rotate: number;
  delay: number;
}

export const LuckyEnvelopeStage: React.FC<LuckyEnvelopeStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [coins, setCoins] = useState<FlyingCoin[]>([]);
  const [rewardRevealed, setRewardRevealed] = useState<boolean>(false);

  const envelopes: RedEnvelope[] = [
    {
      id: 'phuc',
      char: 'PHÚC',
      meaning: 'Phúc Tinh Cao Chiếu',
      blessing: 'Gia đạo an khang, vạn điều may mắn',
      voucher: 'Voucher Khai Xuân 500.000 VNĐ',
      score: 570,
    },
    {
      id: 'loc',
      char: 'LỘC',
      meaning: 'Tấn Tài Tấn Lộc',
      blessing: 'Kinh doanh phát đạt, tiền tài hanh thông',
      voucher: 'Jackpot Phúc Lộc 1.000.000 VNĐ',
      score: 600,
    },
    {
      id: 'tho',
      char: 'THỌ',
      meaning: 'Khang Ninh Vô Biên',
      blessing: 'Sức khỏe dồi dào, tâm an vạn sự cát',
      voucher: 'Voucher Sức Khỏe VIP 300.000 VNĐ',
      score: 550,
    },
    {
      id: 'tai',
      char: 'TÀI',
      meaning: 'Kim Ngọc Mãn Đường',
      blessing: 'Phú quý vinh hoa, rạng danh sự nghiệp',
      voucher: 'Thỏi Vàng 24K May Mắn',
      score: 590,
    },
  ];

  const handleSelectEnvelope = (env: RedEnvelope, idx: number) => {
    if (selectedId) return;
    setSelectedId(env.id);
    sound.playClick(soundEnabled);
    track('ENVELOPE_SELECT', idx + 1);

    // 1. Mở nắp bao lì xì đỏ
    setTimeout(() => {
      setIsOpened(true);
      sound.playReward(soundEnabled);

      // 2. Tiền vàng & điểm bay ra (Fountain of gold coins)
      const generatedCoins: FlyingCoin[] = Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 240,
        y: -160 - Math.random() * 120,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.4,
      }));
      setCoins(generatedCoins);
      track('COIN_BURST', generatedCoins.length);

      // 3. Hiện voucher / điểm
      setTimeout(() => {
        setRewardRevealed(true);
        sound.playWin(soundEnabled);

        setTimeout(() => {
          onComplete(env.score);
        }, 1800);
      }, 900);
    }, 450);
  };

  const selectedEnv = envelopes.find((e) => e.id === selectedId);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-6 px-4">
      {/* Spring Tet Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 mb-2 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-amber-300 font-semibold">
            Đại Sảnh Khai Xuân Cung Đình
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Lì Xì Phát Tài Khai Xuân
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Chọn 1 bao lì xì đỏ — Bao mở nắp, tiền vàng và điểm số tuôn trào đón tài lộc đầu năm
        </p>
      </div>

      {/* Spring Palace Red Stage Canvas */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-gradient-to-b from-[#180709]/95 via-[#120406]/95 to-[#080203]/98 border border-red-500/20 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center min-h-[440px]">
        {/* Ambient Golden & Red Radiance */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/15 via-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* 1. TIỀN VÀNG / ĐIỂM BAY RA TỪ BAO LÌ XÌ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ y: 20, x: 0, opacity: 0, scale: 0.4 }}
              animate={{
                y: [20, coin.y, coin.y + 40],
                x: coin.x,
                rotate: coin.rotate,
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1.2, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: coin.delay,
                ease: 'easeOut',
              }}
              className="absolute"
            >
              {/* Ancient Chinese Gold Coin with Square Hole */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 border-2 border-amber-200 shadow-[0_0_15px_#fde047] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-amber-950/80 border border-amber-300/60" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. FOUR IMPERIAL RED ENVELOPES */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-center justify-center w-full min-h-[300px]">
          {envelopes.map((env, idx) => {
            const isSelected = selectedId === env.id;
            const isOther = selectedId !== null && !isSelected;

            return (
              <motion.div
                key={env.id}
                animate={{
                  scale: isSelected ? 1.15 : isOther ? 0.85 : 1,
                  opacity: isOther ? 0.25 : 1,
                  y: isSelected ? -15 : 0,
                }}
                whileHover={!selectedId ? { y: -8, transition: { duration: 0.2 } } : {}}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onClick={() => handleSelectEnvelope(env, idx)}
                className={`group relative flex flex-col items-center cursor-pointer p-2 rounded-xl transition-all ${
                  !selectedId ? 'hover:scale-105' : ''
                }`}
              >
                {/* Envelope Body */}
                <div className="relative w-36 h-52 sm:w-40 sm:h-56 rounded-xl bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] border-2 border-amber-400/50 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex flex-col items-center justify-between p-3 overflow-hidden">
                  {/* Gold Foil Trim Borders */}
                  <div className="absolute inset-1.5 rounded-lg border border-amber-300/30 pointer-events-none" />

                  {/* Top Flap (Opens in 3D when selected) */}
                  <motion.div
                    style={{ transformOrigin: 'top center', perspective: 800 }}
                    animate={{
                      rotateX: isSelected && isOpened ? -160 : 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute top-0 inset-x-0 h-16 pointer-events-none z-10"
                  >
                    <svg viewBox="0 0 160 70" className="w-full h-full drop-shadow-md">
                      <polygon
                        points="0,0 80,60 160,0"
                        fill="#7f1d1d"
                        stroke="#fde047"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>

                  {/* Calligraphy Emblem Medallion */}
                  <div className="relative z-0 mt-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 border-2 border-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.6)] flex items-center justify-center">
                    <span className="font-serif text-xl sm:text-2xl font-black text-red-950 tracking-widest">
                      {env.char}
                    </span>
                  </div>

                  {/* Envelope Title */}
                  <div className="relative z-0 mb-3 text-center">
                    <span className="text-[11px] font-sans font-bold text-amber-200 uppercase tracking-wider block">
                      {env.meaning}
                    </span>
                    <p className="text-[9.5px] text-amber-300/70 font-sans mt-0.5 line-clamp-1">
                      {env.blessing}
                    </p>
                  </div>
                </div>

                {/* Prompt Badge */}
                {!selectedId && (
                  <div className="mt-3 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-sans text-amber-300 font-medium group-hover:bg-amber-500/20 transition-all">
                    Chạm Để Mở
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 3. REWARD BANNER (KHI TIỀN VÀNG ĐÃ BAY RA) */}
        <AnimatePresence>
          {rewardRevealed && selectedEnv && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="relative z-30 mt-6 mx-auto w-full max-w-md p-4 rounded-xl bg-gradient-to-r from-red-950/85 via-neutral-900/90 to-red-950/85 border border-amber-400/60 shadow-[0_10px_30px_rgba(251,191,36,0.25)] text-center backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Tiền Vàng Phát Tài Đầu Năm</span>
              </div>
              <h3 className="font-serif text-lg text-amber-200 font-normal">
                {selectedEnv.voucher}
              </h3>
              <p className="text-xl font-serif text-white font-semibold mt-0.5">
                Đại Cát Đại Lợi
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-sans text-emerald-400 font-medium">
                <Check className="w-4 h-4" />
                <span>+{selectedEnv.score} Điểm Phúc Lộc Đầu Xuân</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Guidance */}
      <p className="text-xs text-neutral-400 font-sans tracking-wide mt-5 text-center">
        {selectedId === null
          ? 'Chạm chọn 1 phong bao lì xì đỏ may mắn để khai tài khai lộc.'
          : isOpened
          ? 'Bao lì xì đã mở — Tiền vàng rực rỡ đang mang may mắn đến cho bạn!'
          : 'Đang mở bao lì xì...'}
      </p>
    </div>
  );
};
