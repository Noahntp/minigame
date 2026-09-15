import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Check } from 'lucide-react';
import { sound } from '../../../utils/audio';

interface FlowerPickingStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface BotanicalFlower {
  id: string;
  name: string;
  title: string;
  petalColor: string;
  innerColor: string;
  goldTone: string;
  voucherName: string;
  voucherValue: string;
  score: number;
}

export const FlowerPickingStage: React.FC<FlowerPickingStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [isBlooming, setIsBlooming] = useState<boolean>(false);
  const [rewardRevealed, setRewardRevealed] = useState<boolean>(false);

  const flowers: BotanicalFlower[] = [
    {
      id: 'rose',
      name: 'Hồng Sa Mạc Hoàng Triều',
      title: 'Rose Royale',
      petalColor: '#F43F5E',
      innerColor: '#BE123C',
      goldTone: '#FDE047',
      voucherName: 'Bó Hoa Hồng Nhập Khẩu VIP',
      voucherValue: '680.000 VNĐ',
      score: 520,
    },
    {
      id: 'orchid',
      name: 'Lan Hoàng Thảo Pha Lê',
      title: 'Orchidée d\'Or',
      petalColor: '#A855F7',
      innerColor: '#7E22CE',
      goldTone: '#FACC15',
      voucherName: 'Chậu Lan Hồ Điệp Phú Quý',
      voucherValue: '1.500.000 VNĐ',
      score: 550,
    },
    {
      id: 'lotus',
      name: 'Sen Tuyết Cực Phẩm',
      title: 'Lotus de Neige',
      petalColor: '#38BDF8',
      innerColor: '#0284C7',
      goldTone: '#E0F2FE',
      voucherName: 'Voucher Trà Thảo Mộc Tuyết',
      voucherValue: '450.000 VNĐ',
      score: 510,
    },
    {
      id: 'peony',
      name: 'Mẫu Đơn Cung Đình',
      title: 'Pivoine Impériale',
      petalColor: '#FB7185',
      innerColor: '#E11D48',
      goldTone: '#FEF08A',
      voucherName: 'Hộp Hoa Lụa Nghệ Thuật',
      voucherValue: '850.000 VNĐ',
      score: 530,
    },
    {
      id: 'camellia',
      name: 'Trà My Quý Tộc',
      title: 'Camélia de Soie',
      petalColor: '#F59E0B',
      innerColor: '#D97706',
      goldTone: '#FEF9C3',
      voucherName: 'Set Quà Hoa Sáp & Nến Thơm',
      voucherValue: '550.000 VNĐ',
      score: 520,
    },
  ];

  const handlePickFlower = (flower: BotanicalFlower) => {
    if (pickedId) return;
    setPickedId(flower.id);
    sound.playClick(soundEnabled);
    track('FLOWER_PICK', 1);

    // Bông hoa bay lên cao và BUNG CÁNH
    setTimeout(() => {
      setIsBlooming(true);
      sound.playReward(soundEnabled);
      track('FLOWER_BLOOM', 1);

      // Hiện thưởng từ nhụy hoa
      setTimeout(() => {
        setRewardRevealed(true);
        sound.playWin(soundEnabled);

        setTimeout(() => {
          onComplete(flower.score);
        }, 1800);
      }, 1000);
    }, 450);
  };

  const selectedFlower = flowers.find((f) => f.id === pickedId);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-6 px-4">
      {/* Royal Conservatory Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-2 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-emerald-300 font-semibold">
            Jardin Botanique Impérial
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Hái Hoa Nhận Quà
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Vuốt hoặc chạm nhẹ để hái bông hoa ngọc — Hoa sẽ bung cánh hé lộ phần thưởng bên trong
        </p>
      </div>

      {/* Royal Greenhouse Stage */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0b1210]/95 via-[#080d0c]/95 to-[#040706]/98 border border-emerald-500/20 p-2.5 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Ambient Fireflies & Mist */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-amber-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

        {/* Floating Firefly Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -18, 0],
              x: [0, (i % 2 === 0 ? 10 : -10), 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5 + (i % 4),
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
            style={{
              top: `${15 + (i * 7) % 65}%`,
              left: `${8 + (i * 8) % 84}%`,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399] pointer-events-none"
          />
        ))}

        {/* 1. GARDEN BED OF 5 FLOWERS */}
        <div className="relative z-10 grid grid-cols-5 gap-1 sm:gap-6 items-end justify-center min-h-[250px] sm:min-h-[320px]">
          {flowers.map((flower, idx) => {
            const isSelected = pickedId === flower.id;
            const isOther = pickedId !== null && !isSelected;

            return (
              <motion.div
                key={flower.id}
                animate={{
                  scale: isSelected ? (isBlooming ? 1.25 : 1.1) : isOther ? 0.35 : 1,
                  opacity: isOther ? 0.2 : 1,
                  y: isSelected ? (isBlooming ? -40 : -20) : 0,
                }}
                whileHover={
                  !pickedId
                    ? { y: -10, transition: { duration: 0.2 } }
                    : {}
                }
                transition={{ duration: 0.5, ease: 'easeOut' }}
                onClick={() => handlePickFlower(flower)}
                className={`group relative flex flex-col items-center justify-end cursor-pointer p-1 sm:p-3 rounded-xl transition-all ${
                  !pickedId ? 'hover:bg-emerald-500/[0.04]' : ''
                }`}
              >
                {/* STEM & LEAVES */}
                <div className="relative w-14 sm:w-28 h-36 sm:h-48 flex items-end justify-center">
                  <svg viewBox="0 0 100 160" className="w-full h-full overflow-visible">
                    {/* Natural organic stem */}
                    <path
                      d="M50 160 Q48 110 50 65"
                      stroke="#059669"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Foliage leaves with gold veins */}
                    <path
                      d="M50 120 Q30 110 24 95 Q38 98 50 110"
                      fill="#047857"
                      stroke="#34D399"
                      strokeWidth="1"
                    />
                    <path
                      d="M50 100 Q70 90 76 75 Q62 78 50 90"
                      fill="#047857"
                      stroke="#34D399"
                      strokeWidth="1"
                    />

                    {/* Calyx & Sepals holding the flower */}
                    <path d="M42 66 Q50 60 58 66 L50 74 Z" fill="#065F46" />
                  </svg>

                  {/* FLOWER HEAD (BUD -> BLOOM ANIMATION) */}
                  <div className="absolute top-0 sm:top-2 w-16 sm:w-28 h-16 sm:h-28 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {!isSelected || !isBlooming ? (
                        /* Giai đoạn NỤ HOA (Elegant Bud) */
                        <motion.div
                          key="bud"
                          animate={{
                            rotate: [0, -2, 2, 0],
                            y: [0, -3, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3.5 + idx * 0.4,
                            ease: 'easeInOut',
                          }}
                          className="relative w-20 h-24 flex items-center justify-center drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
                        >
                          <svg viewBox="0 0 100 120" className="w-full h-full">
                            {/* Outer Bud Petals layered tightly */}
                            <ellipse cx="50" cy="55" rx="20" ry="36" fill={flower.petalColor} opacity="0.9" />
                            <path
                              d="M50 18 Q32 40 38 78 Q50 86 50 86 Q50 86 62 78 Q68 40 50 18 Z"
                              fill={flower.innerColor}
                            />
                            {/* Subtle petal tip fold */}
                            <path
                              d="M50 20 Q44 32 44 48 Q50 42 56 48 Q56 32 50 20 Z"
                              fill={flower.goldTone}
                              opacity="0.8"
                            />
                          </svg>
                        </motion.div>
                      ) : (
                        /* Giai đoạn HOA BUNG CÁNH (Magnificent Blooming Blossom) */
                        <motion.div
                          key="blooming"
                          initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                          animate={{ scale: 1.15, rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.65, ease: 'easeOut' }}
                          className="relative w-32 h-32 flex items-center justify-center"
                        >
                          {/* Radial Blooming Aura */}
                          <motion.div
                            initial={{ scale: 0.2, opacity: 0 }}
                            animate={{ scale: [1, 1.4, 1.2], opacity: [0.5, 0.9, 0.7] }}
                            transition={{ repeat: Infinity, duration: 2.2 }}
                            className="absolute inset-0 rounded-full blur-xl pointer-events-none"
                            style={{ background: flower.petalColor }}
                          />

                          {/* Pollen Starlight Dust */}
                          {[...Array(10)].map((_, pIdx) => (
                            <motion.div
                              key={pIdx}
                              initial={{ opacity: 1, scale: 0 }}
                              animate={{
                                opacity: [1, 0],
                                scale: [0, 1.5],
                                x: Math.cos((pIdx * 36 * Math.PI) / 180) * 60,
                                y: Math.sin((pIdx * 36 * Math.PI) / 180) * 60,
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.2,
                                delay: pIdx * 0.1,
                                ease: 'easeOut',
                              }}
                              className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] pointer-events-none"
                            />
                          ))}

                          {/* Bespoke Layered Multi-petal Blooming Blossom */}
                          <svg viewBox="0 0 140 140" className="w-full h-full relative z-10">
                            {/* Layer 1: Outer Petals (8 petals) */}
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                              <g key={deg} transform={`rotate(${deg} 70 70)`}>
                                <path
                                  d="M70 70 Q52 35 70 12 Q88 35 70 70 Z"
                                  fill={flower.petalColor}
                                  stroke="#FFFFFF"
                                  strokeOpacity="0.25"
                                  strokeWidth="1"
                                />
                              </g>
                            ))}

                            {/* Layer 2: Middle Petals (offset 22.5 deg) */}
                            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
                              <g key={deg} transform={`rotate(${deg} 70 70)`}>
                                <path
                                  d="M70 70 Q56 42 70 24 Q84 42 70 70 Z"
                                  fill={flower.innerColor}
                                  stroke="#FEF08A"
                                  strokeOpacity="0.4"
                                  strokeWidth="1"
                                />
                              </g>
                            ))}

                            {/* Center Gilded Pistil / Stamen */}
                            <circle cx="70" cy="70" r="16" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
                            {[0, 60, 120, 180, 240, 300].map((deg) => (
                              <circle
                                key={deg}
                                cx={70 + 9 * Math.cos((deg * Math.PI) / 180)}
                                cy={70 + 9 * Math.sin((deg * Math.PI) / 180)}
                                r="3"
                                fill="#F59E0B"
                              />
                            ))}
                            <circle cx="70" cy="70" r="5" fill="#FFF" className="animate-pulse" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Planter Pot Stone Rim */}
                <div className="w-full h-2 sm:h-3 rounded-full bg-neutral-900 border border-emerald-900/60 mt-1" />

                {/* Flower Name Tag */}
                <div className="mt-1.5 sm:mt-3 text-center w-full px-0.5">
                  <span className="text-[7.5px] sm:text-[9.5px] font-sans uppercase tracking-wider text-emerald-400 font-semibold block truncate">
                    {flower.title}
                  </span>
                  <h4 className="font-serif text-[9px] sm:text-sm font-medium text-neutral-200 mt-0.5 truncate leading-tight">
                    {flower.name}
                  </h4>
                </div>

                {/* Prompt Badge */}
                {!pickedId && (
                  <div className="mt-1 sm:mt-2 px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] sm:text-[10px] font-sans text-emerald-300 font-medium group-hover:bg-emerald-500/25 transition-all hidden sm:block">
                    Chạm Để Hái
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 2. HIỆN THƯỞNG KHI HOA BUNG CÁNH */}
        <AnimatePresence>
          {rewardRevealed && selectedFlower && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="relative z-30 mt-6 mx-auto max-w-md p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-neutral-900/90 to-emerald-950/80 border border-emerald-400/50 shadow-[0_10px_30px_rgba(52,211,153,0.25)] text-center backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hoa Đã Bung Cánh Trao Thưởng</span>
              </div>
              <h3 className="font-serif text-lg text-emerald-200 font-normal">
                {selectedFlower.voucherName}
              </h3>
              <p className="text-xl font-serif text-white font-semibold mt-0.5">
                {selectedFlower.voucherValue}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-sans text-amber-300 font-medium">
                <Check className="w-4 h-4" />
                <span>+{selectedFlower.score} Điểm Cát Tường</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Guidance */}
      <p className="text-xs text-neutral-400 font-sans tracking-wide mt-5 text-center">
        {pickedId === null
          ? 'Hái một bông hoa ngọc bằng cách vuốt hoặc chạm nhẹ vào cành hoa.'
          : isBlooming
          ? 'Hoa đã bung cánh rạng rỡ — Quà tặng đang tỏa hương khai mở!'
          : 'Đang hái bông hoa ngọc...'}
      </p>
    </div>
  );
};
