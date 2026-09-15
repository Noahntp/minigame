import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, RotateCw, Sparkles, Crown, Award } from 'lucide-react';
import { Button } from '../common/Button';
import { DropRateModal } from './DropRateModal';
import { sound } from '../../utils/audio';
import { api } from '../../services/api';
import type { Reward } from '../../types/game';

interface ValentineGashaponProps {
  onComplete: (score: number, reward?: Reward) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
  sessionId?: string | null;
}

export type JewelType = 'faceted-ruby' | 'gold-crest' | 'rose-quartz' | 'royal-amethyst';

export interface JewelOrb {
  id: number;
  type: JewelType;
  x: number;
  y: number;
  size: number;
  rotation: number;
  name: string;
  depth?: number; // 0 = back, 1 = front for 3D illusion
}

// ============================================================================
// 1. BESPOKE 3D FACETED GEMSTONE SVG RENDERER (Haute Joaillerie Optical Depth)
// ============================================================================
export const FacetedGemVisual: React.FC<{
  type: JewelType;
  size?: number;
  isGlowing?: boolean;
}> = ({ type, size = 44, isGlowing = false }) => {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Outer Prismatic Aura Glow */}
      {isGlowing && (
        <div
          className="absolute -inset-2 rounded-full blur-md opacity-80 animate-pulse pointer-events-none"
          style={{
            background:
              type === 'gold-crest'
                ? 'radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(212,175,55,0.2) 70%, transparent 100%)'
                : type === 'faceted-ruby'
                ? 'radial-gradient(circle, rgba(244,63,94,0.8) 0%, rgba(190,18,60,0.2) 70%, transparent 100%)'
                : type === 'rose-quartz'
                ? 'radial-gradient(circle, rgba(244,114,182,0.8) 0%, rgba(190,24,93,0.2) 70%, transparent 100%)'
                : 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(126,34,206,0.2) 70%, transparent 100%)',
          }}
        />
      )}

      {/* 1. FACETED RUBY (Hồng Ngọc Hoàng Gia) */}
      {type === 'faceted-ruby' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(225,29,72,0.7)]">
          <defs>
            <radialGradient id={`ruby-core-${size}`} cx="38%" cy="36%" r="65%">
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="25%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#be123c" />
              <stop offset="90%" stopColor="#881337" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>
            <linearGradient id={`facet-shine-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#fda4af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#ruby-core-${size})`} stroke="#fecdd3" strokeWidth="1.2" />
          {/* Diamond Cut Brilliant Geometry */}
          <polygon points="50,14 78,28 78,72 50,86 22,72 22,28" fill="none" stroke="#ffe4e6" strokeWidth="0.8" strokeOpacity="0.7" />
          <polygon points="50,24 70,36 70,64 50,76 30,64 30,36" fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth="1" strokeOpacity="0.8" />
          <polygon points="50,32 62,40 62,60 50,68 38,60 38,40" fill="rgba(255,255,255,0.2)" stroke="#fff" strokeWidth="0.8" />
          {/* Facet Bridges */}
          <line x1="50" y1="14" x2="50" y2="32" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="78" y1="28" x2="62" y2="40" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="78" y1="72" x2="62" y2="60" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="50" y1="86" x2="50" y2="68" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="22" y1="72" x2="38" y2="60" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="22" y1="28" x2="38" y2="40" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />
          {/* Center Heart Emblem */}
          <path
            d="M50 44 C47 38 41 38 39 43 C37 48 44 54 50 58 C56 54 63 48 61 43 C59 38 53 38 50 44 Z"
            fill="#ffffff"
            filter="drop-shadow(0 0 4px #fff)"
            opacity="0.95"
          />
          {/* Caustic Specular Glare */}
          <ellipse cx="36" cy="28" rx="10" ry="5" fill={`url(#facet-shine-${size})`} transform="rotate(-30 36 28)" />
          <circle cx="68" cy="68" r="2.5" fill="#ffffff" opacity="0.85" />
        </svg>
      )}

      {/* 2. GOLD CREST (Thần Châu Hoàng Kim 24K) */}
      {type === 'gold-crest' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_14px_rgba(212,175,55,0.8)]">
          <defs>
            <radialGradient id={`gold-core-${size}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#d4af37" />
              <stop offset="85%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
            <linearGradient id={`gold-rim-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#gold-core-${size})`} stroke={`url(#gold-rim-${size})`} strokeWidth="2" />
          {/* Imperial Guilloché Engravings */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.85" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
          {/* 8-Point Compass Star of Bethlehem */}
          <polygon points="50,18 53,42 77,50 53,58 50,82 47,58 23,50 47,42" fill="#ffffff" filter="drop-shadow(0 0 6px #fef08a)" />
          <polygon points="50,26 52,44 70,50 52,56 50,74 48,56 30,50 48,44" fill="#fbbf24" />
          <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
          {/* Specular Glare */}
          <ellipse cx="32" cy="26" rx="9" ry="4.5" fill="#ffffff" opacity="0.8" transform="rotate(-35 32 26)" />
          <circle cx="70" cy="70" r="2.5" fill="#ffffff" opacity="0.9" />
        </svg>
      )}

      {/* 3. ROSE QUARTZ (Bảo Ngọc Thạch Anh Hồng) */}
      {type === 'rose-quartz' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(244,114,182,0.7)]">
          <defs>
            <radialGradient id={`quartz-core-${size}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="28%" stopColor="#fbcfe8" />
              <stop offset="62%" stopColor="#f472b6" />
              <stop offset="88%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#70072b" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#quartz-core-${size})`} stroke="#fdf2f8" strokeWidth="1.4" />
          {/* Crystal Prism Facets */}
          <polygon points="50,16 68,30 68,70 50,84 32,70 32,30" fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth="1" strokeOpacity="0.75" />
          <polygon points="50,26 62,36 62,64 50,74 38,64 38,36" fill="rgba(255,255,255,0.22)" stroke="#fff" strokeWidth="0.8" />
          <polygon points="50,34 56,42 56,58 50,66 44,58 44,42" fill="#ffffff" opacity="0.85" filter="drop-shadow(0 0 4px #fff)" />
          {/* Prismatic Glint */}
          <ellipse cx="32" cy="28" rx="8" ry="4" fill="#ffffff" opacity="0.8" transform="rotate(-30 32 28)" />
          <circle cx="68" cy="68" r="2.5" fill="#ffffff" opacity="0.85" />
        </svg>
      )}

      {/* 4. ROYAL AMETHYST (Ngọc Thạch Anh Tím Hoàng Triều) */}
      {type === 'royal-amethyst' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(168,85,247,0.7)]">
          <defs>
            <radialGradient id={`amethyst-core-${size}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f5d0fe" />
              <stop offset="30%" stopColor="#c084fc" />
              <stop offset="65%" stopColor="#7e22ce" />
              <stop offset="90%" stopColor="#3b0764" />
              <stop offset="100%" stopColor="#1e0136" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#amethyst-core-${size})`} stroke="#fae8ff" strokeWidth="1.4" />
          {/* Hexagonal Geometry */}
          <polygon points="50,18 76,34 76,66 50,82 24,66 24,34" fill="none" stroke="#e9d5ff" strokeWidth="1" strokeOpacity="0.65" />
          <polygon points="50,28 68,40 68,60 50,72 32,60 32,40" fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth="0.9" />
          <circle cx="50" cy="50" r="7" fill="#ffffff" filter="drop-shadow(0 0 5px #e9d5ff)" />
          {/* Specular Glint */}
          <ellipse cx="34" cy="28" rx="8" ry="4" fill="#ffffff" opacity="0.8" transform="rotate(-30 34 28)" />
          <circle cx="68" cy="68" r="2.5" fill="#ffffff" opacity="0.85" />
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// 2. MAIN COMPONENT: HAUTE HORLOGERIE GASHAPON
// ============================================================================
export const ValentineGashapon: React.FC<ValentineGashaponProps> = ({
  onComplete,
  soundEnabled,
  track,
  sessionId,
}) => {
  const [isCranking, setIsCranking] = useState<boolean>(false);
  const [isChurning, setIsChurning] = useState<boolean>(false);
  const [crankAngle, setCrankAngle] = useState<number>(0);
  const [droppedOrbs, setDroppedOrbs] = useState<JewelOrb[]>([]);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [showDropRateModal, setShowDropRateModal] = useState<boolean>(false);
  const [resolvedReward, setResolvedReward] = useState<Reward | null>(null);
  const [dropTierTitle, setDropTierTitle] = useState<string>('');
  const [shakingDome, setShakingDome] = useState<boolean>(false);

  // 12 Bespoke Gemstones inside the dome with orbital coordinates
  const [jewels, setJewels] = useState<JewelOrb[]>([
    { id: 1, type: 'faceted-ruby', x: 30, y: 72, size: 46, rotation: -8, depth: 0.9, name: 'Hồng Ngọc Hoàng Gia' },
    { id: 2, type: 'gold-crest', x: 52, y: 76, size: 48, rotation: 12, depth: 1.0, name: 'Thần Châu 24K' },
    { id: 3, type: 'rose-quartz', x: 72, y: 70, size: 44, rotation: 15, depth: 0.85, name: 'Thạch Anh Hồng' },
    { id: 4, type: 'royal-amethyst', x: 22, y: 60, size: 42, rotation: -20, depth: 0.8, name: 'Amethyst Hoàng Triều' },
    { id: 5, type: 'faceted-ruby', x: 40, y: 58, size: 46, rotation: 10, depth: 0.95, name: 'Hồng Ngọc Hoàng Gia' },
    { id: 6, type: 'gold-crest', x: 62, y: 61, size: 46, rotation: -6, depth: 0.9, name: 'Thần Châu 24K' },
    { id: 7, type: 'rose-quartz', x: 78, y: 58, size: 44, rotation: 18, depth: 0.85, name: 'Thạch Anh Hồng' },
    { id: 8, type: 'royal-amethyst', x: 28, y: 46, size: 42, rotation: -14, depth: 0.8, name: 'Amethyst Hoàng Triều' },
    { id: 9, type: 'faceted-ruby', x: 50, y: 44, size: 46, rotation: 5, depth: 1.0, name: 'Hồng Ngọc Hoàng Gia' },
    { id: 10, type: 'gold-crest', x: 68, y: 45, size: 46, rotation: 22, depth: 0.85, name: 'Thần Châu 24K' },
    { id: 11, type: 'rose-quartz', x: 38, y: 34, size: 40, rotation: -10, depth: 0.75, name: 'Thạch Anh Hồng' },
    { id: 12, type: 'faceted-ruby', x: 60, y: 32, size: 42, rotation: 14, depth: 0.75, name: 'Hồng Ngọc Hoàng Gia' },
  ]);

  const animationFrameRef = useRef<number | null>(null);

  // Smooth physical vortex simulation during churning
  useEffect(() => {
    if (!isChurning) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    let angleOffset = 0;
    const animateVortex = () => {
      angleOffset += 0.08;
      setJewels((prev) =>
        prev.map((j, idx) => {
          const baseAngle = (idx / 12) * Math.PI * 2 + angleOffset;
          const radiusX = 26 + (idx % 3) * 6;
          const radiusY = 20 + (idx % 2) * 5;
          const centerX = 50;
          const centerY = 55;

          const newX = centerX + Math.cos(baseAngle) * radiusX;
          const newY = centerY + Math.sin(baseAngle) * radiusY;
          // Z depth oscillates between 0.7 (back) and 1.15 (front)
          const newDepth = 0.925 + Math.sin(baseAngle) * 0.225;

          return {
            ...j,
            x: Math.max(16, Math.min(84, newX)),
            y: Math.max(28, Math.min(78, newY)),
            rotation: j.rotation + 14,
            depth: newDepth,
          };
        })
      );
      animationFrameRef.current = requestAnimationFrame(animateVortex);
    };

    animationFrameRef.current = requestAnimationFrame(animateVortex);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isChurning]);

  // Turn crank action
  const handleTurnCrank = async () => {
    if (isCranking || droppedOrbs.length > 0) return;

    sound.playClick(soundEnabled);
    track('HORLOGERIE_CRANK_TURN', 1);

    setIsCranking(true);
    setCrankAngle((prev) => prev + 360);
    setIsChurning(true);
    setShakingDome(true);

    // Concurrently fetch server reward calculation
    let rewardResult: Reward | null = null;
    try {
      const activeSessionId = sessionId || `session_${Date.now()}`;
      const res = await api.completeSession('lucky-heart', activeSessionId, 580);
      rewardResult = res.reward;
    } catch {
      rewardResult = {
        id: 'rw-06',
        name: 'Voucher Hoàng Kim 50K',
        type: 'VOUCHER',
        value: 50000,
        code: 'VC50K-DEMO',
        rarity: 'Epic',
      };
    }

    setResolvedReward(rewardResult);

    // Multi-drop classification
    let orbsToDrop: JewelOrb[] = [];
    let banner = '';

    const isJackpot =
      rewardResult.rarity === 'Legendary' ||
      rewardResult.value >= 1000000 ||
      rewardResult.type === 'SPECIAL';

    const isEpic =
      rewardResult.rarity === 'Epic' ||
      rewardResult.value >= 50000 ||
      rewardResult.type === 'GIFT';

    const isRare =
      rewardResult.rarity === 'Rare' ||
      rewardResult.value >= 20000 ||
      rewardResult.value === 50;

    if (isJackpot) {
      orbsToDrop = [
        { id: 101, type: 'gold-crest', x: 50, y: 77, size: 52, rotation: 0, name: 'Thần Châu Hoàng Kim 24K' },
        { id: 102, type: 'faceted-ruby', x: 50, y: 77, size: 50, rotation: 10, name: 'Hồng Ngọc Hoàng Gia' },
        { id: 103, type: 'rose-quartz', x: 50, y: 77, size: 48, rotation: -12, name: 'Kim Cương Tinh Thể' },
      ];
      banner = '★ THẦN KHẢI JACKPOT: LIÊN HOÀN 3 BẢO NGỌC HOÀNG GIA ★';
    } else if (isEpic) {
      orbsToDrop = [
        { id: 101, type: 'faceted-ruby', x: 50, y: 77, size: 50, rotation: 8, name: 'Hồng Ngọc Hoàng Gia' },
        { id: 102, type: 'gold-crest', x: 50, y: 77, size: 50, rotation: -6, name: 'Thần Châu 24K' },
      ];
      banner = '✦ ĐẶC QUYỀN EPIC: RƠI 2 BẢO NGỌC LIÊN HOÀN ✦';
    } else if (isRare) {
      orbsToDrop = [
        { id: 101, type: 'rose-quartz', x: 50, y: 77, size: 48, rotation: 12, name: 'Thạch Anh Hồng' },
      ];
      banner = '◆ GIẢI THƯỞNG RARE: 1 BẢO NGỌC THẠCH ANH HỒNG ◆';
    } else {
      orbsToDrop = [
        { id: 101, type: 'royal-amethyst', x: 50, y: 77, size: 46, rotation: -8, name: 'Amethyst Hoàng Triều' },
      ];
      banner = '● ĐIỂM THƯỞNG VIP: 1 BẢO NGỌC THẠCH ANH TÍM ●';
    }

    setDropTierTitle(banner);

    // Stop churning after 1.5s and trigger physics chute drop
    setTimeout(() => {
      setIsChurning(false);
      setShakingDome(false);
      sound.playCount(soundEnabled);
      setDroppedOrbs(orbsToDrop);

      // Trigger cinematic opening after 1.4s
      setTimeout(() => {
        setIsRevealing(true);
        sound.playWin(soundEnabled);

        setTimeout(() => {
          onComplete(580, rewardResult || undefined);
        }, 2200);
      }, 1400);
    }, 1600);
  };

  return (
    <div className="relative w-full max-w-3xl flex flex-col items-center justify-center select-none py-2 px-3">
      {/* 1. Atelier Royale Exhibition Header */}
      <div className="w-full flex items-center justify-between mb-2 sm:mb-6 px-1 sm:px-4 z-20">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f5e6c8] text-[9.5px] sm:text-[10.5px] font-mono-num font-semibold uppercase tracking-[0.2em] mb-1">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#d4af37]" />
            <span>SWISS AUTOMATON • CỖ MÁY HOÀNG GIA</span>
          </div>
          <h3 className="font-serif-editorial text-xl sm:text-3xl font-bold text-[#fcfbfa]">
            Máy Quay Trứng Tình Yêu
          </h3>
        </div>

        <button
          onClick={() => setShowDropRateModal(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#121724] border border-[#d4af37]/40 shadow-lg hover:border-[#d4af37] text-[#f5e6c8] text-xs font-mono-num font-semibold transition-all hover:scale-105 active:scale-95"
          title="Xem và tùy chỉnh tỷ lệ rớt bảo ngọc"
        >
          <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Tỷ Lệ Thưởng</span>
        </button>
      </div>

      {/* 2. THE MECHANICAL MASTERPIECE MACHINE */}
      <div className="relative w-[310px] sm:w-[400px] flex flex-col items-center z-10 scale-[0.88] sm:scale-100 origin-top touch-none">
        {/* Volumetric Radial Backlight behind the dome */}
        <div
          className={`absolute top-0 w-80 h-80 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isChurning
              ? 'bg-[#d4af37]/25 scale-125'
              : 'bg-gradient-to-b from-[#831843]/20 via-[#d4af37]/15 to-transparent'
          }`}
        />

        {/* 2.1 THE OPTICAL CRYSTAL DOME */}
        <motion.div
          animate={shakingDome ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 0] } : {}}
          transition={{ duration: 0.15, repeat: isChurning ? Infinity : 0 }}
          className="relative w-[310px] sm:w-[350px] h-[310px] sm:h-[350px] rounded-full bg-gradient-to-b from-[#121624]/80 via-[#0d1017]/90 to-[#06080d] flex items-center justify-center overflow-hidden z-20 border-[6px] border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(212,175,55,0.15)]"
        >
          {/* Glass Spherical Caustic Highlights */}
          <div className="absolute top-4 left-10 w-28 h-12 bg-white/20 rounded-full blur-[2px] -rotate-[35deg] pointer-events-none" />
          <div className="absolute bottom-6 right-10 w-36 h-10 bg-[#d4af37]/10 rounded-full blur-[4px] rotate-[20deg] pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />

          {/* Internal Swirling Jewels */}
          <div className="relative w-full h-full pointer-events-none">
            {jewels.map((j) => {
              const depthScale = j.depth || 1;
              return (
                <motion.div
                  key={j.id}
                  style={{
                    left: `${j.x}%`,
                    top: `${j.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: Math.floor(depthScale * 20),
                  }}
                  animate={{
                    rotate: j.rotation,
                    scale: depthScale,
                    opacity: depthScale > 0.85 ? 1 : 0.75,
                  }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                  className="absolute"
                >
                  <FacetedGemVisual type={j.type} size={j.size} isGlowing={isChurning} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 2.2 THE NOBLE BURGUNDY & BRASS PEDESTAL HOUSING */}
        <div className="relative -mt-6 w-[300px] sm:w-[340px] h-[220px] bg-gradient-to-b from-[#2a0612] via-[#1a040b] to-[#0d0205] rounded-b-[32px] rounded-t-[20px] border-2 border-[#d4af37]/60 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col items-center justify-between p-4 z-20">
          {/* Filigree Brass Trim Accent */}
          <div className="absolute top-2 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          <div className="absolute top-3 left-4 text-[#d4af37]/60 text-[10px] font-mono-num tracking-widest uppercase">
            N° 1892 • ATELIER ROYALE
          </div>

          {/* The Swiss Geneva Rotary Crank Dial */}
          <div className="absolute top-5 right-5 flex flex-col items-center z-30">
            <motion.div
              animate={{ rotate: crankAngle }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              onPointerDown={handleTurnCrank}
              onClick={handleTurnCrank}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5e6c8] via-[#d4af37] to-[#854d0e] p-[3px] shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,55,0.4)] cursor-pointer hover:scale-110 active:scale-95 transition-transform group"
              title="Nhấp để xoay bánh răng Thụy Sĩ nhả bảo ngọc"
            >
              <div className="w-full h-full rounded-full bg-[#0d1017] flex items-center justify-center border border-[#d4af37]/60 relative overflow-hidden">
                {/* Geneva Spoke Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[1.5px] bg-[#d4af37]/40" />
                  <div className="h-full w-[1.5px] bg-[#d4af37]/40" />
                </div>
                {/* Center Ruby Cabochon */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9f1239] via-[#f43f5e] to-[#ffffff] border border-[#fef08a] shadow-inner relative z-10 flex items-center justify-center">
                  <RotateCw
                    className={`w-3 h-3 text-white ${isCranking ? 'animate-spin' : 'group-hover:rotate-45'} transition-transform`}
                  />
                </div>
              </div>
            </motion.div>
            <span className="text-[9.5px] font-mono-num font-bold text-[#d4af37] uppercase tracking-wider mt-1">
              XOAY NÚM
            </span>
          </div>

          {/* Dispenser Chute with Velvet Door */}
          <div className="mt-8 relative w-28 h-20 bg-gradient-to-b from-[#06080d] to-[#121624] rounded-t-full border border-[#d4af37]/40 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Chute Light Beam */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/20 to-transparent pointer-events-none" />

            {/* Dropped Orbs Chute Passage */}
            <AnimatePresence>
              {droppedOrbs.length > 0 && !isRevealing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {droppedOrbs.map((orb, index) => (
                    <motion.div
                      key={orb.id}
                      initial={{ y: -80, scale: 0.4, opacity: 0, rotate: -60 }}
                      animate={{
                        y: [ -80, 15, -8, 6, 0 ],
                        scale: [ 0.4, 1.25, 0.9, 1.05, 1 ],
                        rotate: [ -60, 180, 240, 320, 360 ],
                        opacity: 1,
                      }}
                      exit={{ scale: 1.3, opacity: 0 }}
                      transition={{
                        duration: 0.85,
                        delay: index * 0.22,
                        ease: 'easeOut',
                      }}
                      className="absolute z-30"
                    >
                      <FacetedGemVisual type={orb.type} size={orb.size} isGlowing />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Red Velvet Tray Cushion with Gold Studs */}
          <div className="relative w-64 h-14 bg-gradient-to-r from-[#3f0714] via-[#5c0b1e] to-[#3f0714] rounded-full border-2 border-[#d4af37] shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_2px_8px_rgba(0,0,0,0.9)] flex items-center justify-center px-4 overflow-visible">
            {droppedOrbs.length > 0 ? (
              <div className="flex items-center justify-center gap-3 w-full relative z-20">
                {droppedOrbs.map((orb, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, y: -20, rotate: -45 }}
                    animate={{
                      scale: [0, 1.3, 0.95, 1],
                      y: [-20, 4, -3, 0],
                      rotate: [-45, 10, -5, 0],
                    }}
                    transition={{
                      delay: idx * 0.22 + 0.3,
                      duration: 0.6,
                      type: 'spring',
                      stiffness: 300,
                      damping: 14,
                    }}
                    className="relative cursor-pointer hover:scale-110 transition-transform"
                  >
                    {/* Golden Shockwave Contact Ring */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ delay: idx * 0.22 + 0.35, duration: 0.5 }}
                      className="absolute inset-0 rounded-full border-2 border-[#f5e6c8] pointer-events-none"
                    />
                    <FacetedGemVisual type={orb.type} size={36} isGlowing />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-around w-full px-4 opacity-50">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <div key={dot} className="w-2 h-2 rounded-full bg-[#d4af37]/60 shadow-inner" />
                ))}
              </div>
            )}

            {/* 2.3 CINEMATIC REVEAL BURST (Khai Mở Bảo Ngọc Thần Thoại) */}
            <AnimatePresence>
              {isRevealing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: -72 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute -top-16 flex flex-col items-center z-50 pointer-events-none"
                >
                  {/* Rotating Sunburst God-Rays */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                    className="absolute -inset-16 opacity-40 pointer-events-none flex items-center justify-center"
                  >
                    <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-[#d4af37]/40 via-transparent to-[#d4af37]/30 blur-xl" />
                  </motion.div>

                  {/* Levitation Floating Orbs with Prismatic Aura */}
                  <div className="flex items-center gap-3 relative z-10 mb-3">
                    {droppedOrbs.map((orb, idx) => (
                      <motion.div
                        key={idx}
                        animate={{
                          y: [-3, -10, -3],
                          rotate: [-4, 4, -4],
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.2,
                          delay: idx * 0.25,
                          ease: 'easeInOut',
                        }}
                        className="relative"
                      >
                        <FacetedGemVisual type={orb.type} size={48} isGlowing />
                      </motion.div>
                    ))}
                  </div>

                  {/* Imperial Reveal Banner */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#06080d]/95 px-5 py-2 rounded-full border border-[#d4af37] shadow-[0_8px_30px_rgba(212,175,55,0.4)] whitespace-nowrap flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-[#d4af37] animate-pulse" />
                    <span className="text-xs font-serif-editorial font-bold text-[#f5e6c8] uppercase tracking-wider">
                      {resolvedReward
                        ? `${resolvedReward.name} (${dropTierTitle})`
                        : dropTierTitle || 'KHAI MỞ BẢO NGỌC THÀNH CÔNG!'}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Primary Call-to-Action */}
      <div className="mt-8 flex flex-col items-center gap-3 z-20">
        <Button
          size="xl"
          onClick={handleTurnCrank}
          disabled={isCranking || droppedOrbs.length > 0}
          className="min-w-[280px] bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all"
        >
          <RotateCw className={`w-4 h-4 mr-2 ${isCranking ? 'animate-spin' : ''}`} />
          <span>
            {isChurning
              ? 'Đang Xáo Bảo Ngọc...'
              : droppedOrbs.length > 0
              ? 'Đang Khai Quang Phần Thưởng...'
              : 'Xoay Bánh Răng Lấy Quà'}
          </span>
        </Button>
        <p className="text-[11px] font-sans text-[#7b8496]">
          Mỗi lượt quay khởi động cơ chế bánh răng Thụy Sĩ và rơi ngẫu nhiên bảo ngọc tương ứng.
        </p>
      </div>

      {/* 4. Luxury Multi-Drop Legend Guild */}
      <div className="mt-8 w-full max-w-xl p-5 rounded-[16px] bg-[#0d1017]/90 border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
          <div className="flex items-center gap-2 text-xs font-mono-num font-bold text-[#f5e6c8] uppercase tracking-widest">
            <Award className="w-4 h-4 text-[#d4af37]" />
            <span>Phân Cấp Bảo Ngọc ↔ Số Lượng Rơi</span>
          </div>
          <span className="text-[10px] text-[#7b8496] font-mono-num uppercase">HỆ THỐNG MULTI-DROP</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Jackpot: 3 Orbs */}
          <div className="flex items-center gap-3 p-2.5 rounded-[12px] bg-[#121624] border border-[#d4af37]/30 hover:border-[#d4af37] transition-colors">
            <div className="flex -space-x-2 shrink-0">
              <FacetedGemVisual type="gold-crest" size={24} />
              <FacetedGemVisual type="faceted-ruby" size={24} />
              <FacetedGemVisual type="rose-quartz" size={24} />
            </div>
            <div>
              <span className="font-mono-num font-bold text-[#f5e6c8] block text-[11.5px]">
                👑 3 Quả Cầu (Triple Drop):
              </span>
              <span className="text-[10.5px] text-[#7b8496]">Giải Jackpot 1.000.000đ</span>
            </div>
          </div>

          {/* Epic: 2 Orbs */}
          <div className="flex items-center gap-3 p-2.5 rounded-[12px] bg-[#121624] border border-white/10 hover:border-[#d4af37]/40 transition-colors">
            <div className="flex -space-x-2 shrink-0">
              <FacetedGemVisual type="faceted-ruby" size={24} />
              <FacetedGemVisual type="gold-crest" size={24} />
            </div>
            <div>
              <span className="font-mono-num font-bold text-[#f5e6c8] block text-[11.5px]">
                💎 2 Quả Cầu (Double Drop):
              </span>
              <span className="text-[10.5px] text-[#7b8496]">Voucher Epic 50K - 200K</span>
            </div>
          </div>

          {/* Rare: 1 Rose Quartz */}
          <div className="flex items-center gap-3 p-2.5 rounded-[12px] bg-[#121624] border border-white/10 hover:border-pink-500/30 transition-colors">
            <div className="shrink-0">
              <FacetedGemVisual type="rose-quartz" size={24} />
            </div>
            <div>
              <span className="font-mono-num font-bold text-[#f5e6c8] block text-[11.5px]">
                ✨ 1 Bảo Ngọc Thạch Anh:
              </span>
              <span className="text-[10.5px] text-[#7b8496]">Voucher 20K / 50 PTS</span>
            </div>
          </div>

          {/* Common: 1 Amethyst */}
          <div className="flex items-center gap-3 p-2.5 rounded-[12px] bg-[#121624] border border-white/10 hover:border-purple-500/30 transition-colors">
            <div className="shrink-0">
              <FacetedGemVisual type="royal-amethyst" size={24} />
            </div>
            <div>
              <span className="font-mono-num font-bold text-[#f5e6c8] block text-[11.5px]">
                🔮 1 Bảo Ngọc Amethyst:
              </span>
              <span className="text-[10.5px] text-[#7b8496]">Điểm Thưởng 10 - 30 PTS</span>
            </div>
          </div>
        </div>
      </div>

      <DropRateModal
        isOpen={showDropRateModal}
        onClose={() => setShowDropRateModal(false)}
        gameId="lucky-heart"
      />
    </div>
  );
};
