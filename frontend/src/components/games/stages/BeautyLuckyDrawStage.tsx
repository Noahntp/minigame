import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Check } from 'lucide-react';
import { sound } from '../../../utils/audio';

interface BeautyLuckyDrawStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface CosmeticItem {
  id: 'lipstick' | 'perfume' | 'serum';
  name: string;
  sub: string;
  accentColor: string;
  glowColor: string;
  tag: string;
  prizeTitle: string;
  prizeValue: string;
  score: number;
}

export const BeautyLuckyDrawStage: React.FC<BeautyLuckyDrawStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGlowing, setIsGlowing] = useState<boolean>(false);
  const [rewardRevealed, setRewardRevealed] = useState<boolean>(false);

  const cosmetics: CosmeticItem[] = [
    {
      id: 'lipstick',
      name: 'Son Nhung Hoàng Gia',
      sub: 'Rouge Velours Impérial',
      accentColor: '#E11D48',
      glowColor: 'rgba(225, 29, 72, 0.65)',
      tag: 'Édition Or 24K',
      prizeTitle: 'Voucher Son Môi Cao Cấp',
      prizeValue: '500.000 VNĐ',
      score: 550,
    },
    {
      id: 'perfume',
      name: 'Nước Hoa Pha Lê',
      sub: 'Cristal Nectar Eau de Parfum',
      accentColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.75)',
      tag: 'Haute Parfumerie',
      prizeTitle: 'Giftset Nước Hoa Hoàng Gia',
      prizeValue: '1.200.000 VNĐ',
      score: 580,
    },
    {
      id: 'serum',
      name: 'Huyết Thanh Kim Cương',
      sub: 'Élixir Diamant Jeunesse',
      accentColor: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.7)',
      tag: 'Soin Cellulaire',
      prizeTitle: 'Liệu Trình Spa Tế Bào Gốc',
      prizeValue: '850.000 VNĐ',
      score: 560,
    },
  ];

  const handleSelect = (item: CosmeticItem) => {
    if (selectedId) return;
    setSelectedId(item.id);
    sound.playClick(soundEnabled);
    track('ITEM_SELECT', 1);

    // Step 2: Món được chọn phát sáng cực mạnh
    setTimeout(() => {
      setIsGlowing(true);
      sound.playReward(soundEnabled);
      track('ITEM_GLOW', 1);

      // Step 3: Hiện phần thưởng
      setTimeout(() => {
        setRewardRevealed(true);
        sound.playWin(soundEnabled);

        setTimeout(() => {
          onComplete(item.score);
        }, 1800);
      }, 900);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-1.5 sm:py-6 px-2 sm:px-4">
      {/* Royal Atelier Header */}
      <div className="text-center mb-2 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/25 mb-1 sm:mb-2 backdrop-blur-md">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-amber-300 font-semibold">
            L'Atelier De Beauté Royale
          </span>
        </div>
        <h2 className="font-serif text-xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Chọn 1 Trong 3 Món Mỹ Phẩm
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-400 font-light mt-0.5 sm:mt-1">
          Chạm vào món bảo vật làm đẹp bạn ưng ý nhất — Món được chọn sẽ phát sáng trao lộc
        </p>
      </div>

      {/* Cosmetics Dressing Display Table */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0e121a]/95 via-[#090b10]/95 to-[#050608]/98 border border-amber-500/20 p-2 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Background Velvet & Mirror Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* 3 Cosmetics Display */}
        <div className="relative z-10 grid grid-cols-3 gap-1 sm:gap-8 items-end justify-center min-h-[190px] sm:min-h-[340px] touch-manipulation">
          {cosmetics.map((item) => {
            const isSelected = selectedId === item.id;
            const isOther = selectedId !== null && !isSelected;

            return (
              <motion.div
                key={item.id}
                role="button"
                tabIndex={0}
                animate={{
                  scale: isSelected ? 1.06 : isOther ? 0.9 : 1,
                  opacity: isOther ? 0.25 : 1,
                  y: isSelected ? -10 : 0,
                }}
                whileHover={
                  !selectedId
                    ? { y: -6, transition: { duration: 0.2 } }
                    : {}
                }
                whileTap={!selectedId ? { scale: 0.94 } : {}}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onClick={() => handleSelect(item)}
                className={`group relative flex flex-col items-center justify-end cursor-pointer p-1 sm:p-4 rounded-xl transition-colors touch-manipulation select-none active:scale-95 ${
                  !selectedId
                    ? 'hover:bg-amber-500/[0.04]'
                    : isSelected
                    ? 'bg-amber-500/[0.07]'
                    : ''
                }`}
              >
                {/* 1. MÓN ĐƯỢC CHỌN PHÁT SÁNG (Radiant Aura & Light Rays) */}
                <AnimatePresence>
                  {isSelected && isGlowing && (
                    <>
                      {/* Expanding Halo */}
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: [1, 1.35, 1.2], opacity: [0.4, 0.9, 0.75] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                        style={{ background: item.glowColor }}
                      />

                      {/* Rotating Starburst Sunburst Rays */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                        className="absolute w-64 h-64 -top-8 pointer-events-none opacity-40"
                      >
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                            <line
                              key={deg}
                              x1="100"
                              y1="100"
                              x2={100 + 95 * Math.cos((deg * Math.PI) / 180)}
                              y2={100 + 95 * Math.sin((deg * Math.PI) / 180)}
                              stroke="url(#goldRayGrad)"
                              strokeWidth="1.5"
                              strokeDasharray="4 8"
                            />
                          ))}
                          <defs>
                            <linearGradient id="goldRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>

                      {/* Floating Golden Light Sparks */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10, x: (i - 4) * 12 }}
                          animate={{
                            opacity: [0, 1, 0],
                            y: -90 - i * 10,
                            x: (i - 4) * 16 + (i % 2 === 0 ? 8 : -8),
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.4 + (i % 3) * 0.3,
                            delay: i * 0.15,
                            ease: 'easeOut',
                          }}
                          className="absolute w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#fde047] pointer-events-none"
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* 2. BESPOKE 3D LUXURY COSMETIC ARTWORKS */}
                <div className="relative w-24 h-32 sm:w-40 sm:h-48 flex items-center justify-center">
                  {item.id === 'lipstick' && (
                    /* Son Nhung Hoàng Gia - Fluted Gold & Ruby Bullet */
                    <svg viewBox="0 0 160 220" className="w-20 h-28 sm:w-36 sm:h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <defs>
                        <linearGradient id="goldMetal" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8A6B24" />
                          <stop offset="30%" stopColor="#F9E29D" />
                          <stop offset="60%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#5A4312" />
                        </linearGradient>
                        <linearGradient id="rubyLipstick" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#FF1E56" />
                          <stop offset="40%" stopColor="#BE123C" />
                          <stop offset="100%" stopColor="#881337" />
                        </linearGradient>
                        <linearGradient id="velvetSheen" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Angled Ruby Velvet Bullet */}
                      <path d="M60 75 L60 38 Q60 24 74 16 L90 28 Q100 36 100 52 L100 75 Z" fill="url(#rubyLipstick)" />
                      <path d="M64 75 L64 42 Q64 30 76 22 L82 28 Q72 38 72 75 Z" fill="url(#velvetSheen)" />

                      {/* Inner Gold Collar */}
                      <rect x="56" y="75" width="48" height="24" rx="2" fill="url(#goldMetal)" />
                      <line x1="56" y1="84" x2="104" y2="84" stroke="#FFF" strokeOpacity="0.4" strokeWidth="1" />

                      {/* Outer Fluted Gold Cylinder Base */}
                      <rect x="50" y="99" width="60" height="98" rx="5" fill="url(#goldMetal)" />
                      {/* Embossed Luxury Flutes */}
                      {[57, 65, 73, 81, 89, 97].map((x) => (
                        <line key={x} x1={x} y1="104" x2={x} y2="192" stroke="#FFF" strokeOpacity="0.3" strokeWidth="1.5" />
                      ))}
                      {/* Crest Medallion */}
                      <circle cx="80" cy="148" r="11" fill="#422F08" stroke="#FDE68A" strokeWidth="1.5" />
                      <path d="M75 148 L80 142 L85 148 L80 153 Z" fill="#FDE68A" />
                    </svg>
                  )}

                  {item.id === 'perfume' && (
                    /* Nước Hoa Pha Lê - Crystal Flacon & Golden Atomizer Bulb */
                    <svg viewBox="0 0 180 220" className="w-22 h-28 sm:w-38 sm:h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <defs>
                        <linearGradient id="amberPerfume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#B45309" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="crystalEdge" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>

                      {/* Vintage Spray Atomizer Bulb with Tassel */}
                      <path d="M50 48 Q35 48 30 62 Q25 76 38 84 Q48 88 56 80 Q62 72 58 58 Z" fill="#D97706" />
                      <path d="M30 80 Q24 98 28 112" stroke="#FDE68A" strokeWidth="2" strokeDasharray="2 3" fill="none" />

                      {/* Gold Dispenser Neck */}
                      <rect x="80" y="44" width="20" height="24" rx="2" fill="url(#goldMetal)" />
                      <path d="M55 58 L80 54" stroke="url(#goldMetal)" strokeWidth="4" strokeLinecap="round" />

                      {/* Crystal Faceted Bottle */}
                      <polygon points="50,72 130,72 144,115 132,185 48,185 36,115" fill="url(#amberPerfume)" stroke="url(#crystalEdge)" strokeWidth="2.5" />
                      {/* Facet Reflection Lines */}
                      <line x1="50" y1="72" x2="72" y2="185" stroke="#FFF" strokeOpacity="0.45" strokeWidth="1.5" />
                      <line x1="130" y1="72" x2="108" y2="185" stroke="#FFF" strokeOpacity="0.3" strokeWidth="1.5" />
                      <polygon points="68,90 112,90 118,140 62,140" fill="#000000" fillOpacity="0.35" stroke="#FDE68A" strokeWidth="1" />
                      <text x="90" y="112" fill="#FDE68A" fontSize="8" fontFamily="serif" textAnchor="middle" letterSpacing="1">
                        CRISTAL
                      </text>
                      <text x="90" y="124" fill="#FDE68A" fontSize="6.5" fontFamily="serif" textAnchor="middle" letterSpacing="2">
                        PARFUM
                      </text>
                    </svg>
                  )}

                  {item.id === 'serum' && (
                    /* Huyết Thanh Kim Cương - Dropper Bottle with Liquid Droplet */
                    <svg viewBox="0 0 160 220" className="w-20 h-28 sm:w-36 sm:h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <defs>
                        <linearGradient id="purpleSerum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.8" />
                          <stop offset="40%" stopColor="#C084FC" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>

                      {/* Dropper Squeeze Bulb */}
                      <path d="M72 16 Q80 10 88 16 L91 36 L69 36 Z" fill="#3B0764" stroke="#D8B4FE" strokeWidth="1" />
                      {/* Rose Gold Dropper Ring */}
                      <rect x="66" y="36" width="28" height="18" rx="2" fill="url(#goldMetal)" />
                      {/* Glass Pipette Tube */}
                      <rect x="77" y="54" width="6" height="42" fill="#FFF" fillOpacity="0.5" />

                      {/* Heavy Frost Glass Serum Bottle */}
                      <rect x="52" y="70" width="56" height="118" rx="14" fill="url(#purpleSerum)" stroke="url(#crystalEdge)" strokeWidth="2" />
                      {/* Sheen reflection */}
                      <path d="M58 84 L58 174 Q58 180 64 180" stroke="#FFF" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" fill="none" />

                      {/* Gold Badge */}
                      <rect x="60" y="112" width="40" height="34" rx="3" fill="#1E1035" stroke="#FDE68A" strokeWidth="1" />
                      <circle cx="80" cy="122" r="4" fill="#C084FC" />
                      <text x="80" y="136" fill="#FDE68A" fontSize="6.5" fontFamily="serif" textAnchor="middle" letterSpacing="1">
                        ELIXIR
                      </text>
                    </svg>
                  )}
                </div>

                {/* Pedestal Stand */}
                <div className="relative w-20 sm:w-36 h-4 sm:h-5 -mt-1 sm:-mt-2 flex items-center justify-center">
                  <div
                    className={`w-full h-2.5 sm:h-3 rounded-full transition-all duration-500 ${
                      isSelected && isGlowing
                        ? 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 shadow-[0_0_20px_#fde047]'
                        : 'bg-neutral-800/80 border border-neutral-700/50'
                    }`}
                  />
                  <div className="absolute inset-x-2 sm:inset-x-4 -bottom-1 h-1 bg-black/60 rounded-full blur-[1px]" />
                </div>

                {/* Title & Tag */}
                <div className="mt-1.5 sm:mt-3 text-center w-full px-0.5">
                  <span className="text-[8px] sm:text-[10px] font-sans uppercase tracking-wider text-amber-400/80 font-semibold block truncate">
                    {item.tag}
                  </span>
                  <h4 className="font-serif text-[11px] sm:text-base font-medium text-neutral-100 mt-0.5 truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 font-sans italic hidden sm:block">{item.sub}</p>
                </div>

                {/* Tap Prompt Badge */}
                {!selectedId && (
                  <div className="mt-1 sm:mt-2.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] sm:text-[10.5px] font-sans text-amber-300 font-medium group-hover:bg-amber-500/20 transition-all">
                    Chạm Chọn
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 3. REWARD REVEAL BANNER (KHI ĐÃ PHÁT SÁNG) */}
        <AnimatePresence>
          {rewardRevealed && selectedId && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="relative z-30 mt-3 sm:mt-6 mx-auto max-w-md p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-neutral-900/90 to-amber-950/80 border border-amber-400/50 shadow-[0_10px_30px_rgba(212,175,55,0.25)] text-center backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Tuyệt Phẩm Đã Khai Quang</span>
              </div>
              <h3 className="font-serif text-base sm:text-lg text-amber-200 font-normal">
                {cosmetics.find((c) => c.id === selectedId)?.prizeTitle}
              </h3>
              <p className="text-lg sm:text-xl font-serif text-white font-semibold mt-0.5">
                {cosmetics.find((c) => c.id === selectedId)?.prizeValue}
              </p>
              <div className="mt-1.5 sm:mt-2 flex items-center justify-center gap-2 text-xs font-sans text-emerald-400 font-medium">
                <Check className="w-4 h-4" />
                <span>+{cosmetics.find((c) => c.id === selectedId)?.score} Điểm Tích Lũy</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Guidance */}
      <p className="text-[11px] sm:text-xs text-neutral-400 font-sans tracking-wide mt-2 sm:mt-5 text-center">
        {selectedId === null
          ? 'Lựa chọn 1 bảo vật mỹ phẩm đại diện cho vẻ đẹp vĩnh cửu của bạn.'
          : isGlowing
          ? 'Bảo vật mỹ phẩm đã được chọn đang phát sáng vinh danh...'
          : 'Đang mở hộp quà hoàng gia...'}
      </p>
    </div>
  );
};
