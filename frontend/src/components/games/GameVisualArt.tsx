import React from 'react';
import { motion } from 'framer-motion';

interface GameVisualArtProps {
  slug: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24 sm:w-28 sm:h-28',
  lg: 'w-40 h-40 sm:w-48 sm:h-48',
  xl: 'w-64 h-64',
};

export const GameVisualArt: React.FC<GameVisualArtProps> = ({
  slug,
  className = '',
  size = 'md',
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClass} ${className}`}>
      {/* 1. LUCKY HEART: SWISS GASHAPON AUTOMATON & FACETED RUBY */}
      {slug === 'lucky-heart' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_24px_rgba(225,29,72,0.5)]">
          <defs>
            <radialGradient id="gh-glow" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="35%" stopColor="#f43f5e" />
              <stop offset="75%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>
            <linearGradient id="gh-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>
          {/* Outer Brass Clockwork Rim */}
          <circle cx="60" cy="60" r="54" fill="#0d111d" stroke="url(#gh-gold)" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.7" />
          {/* Faceted Ruby Orb */}
          <circle cx="60" cy="60" r="36" fill="url(#gh-glow)" stroke="#fecdd3" strokeWidth="1.2" />
          <polygon points="60,30 80,42 80,78 60,90 40,78 40,42" fill="none" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.7" />
          <polygon points="60,40 72,48 72,72 60,80 48,72 48,48" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="0.9" />
          {/* Heart Emblem */}
          <path d="M60 52 C57 46 51 46 49 51 C47 56 54 62 60 66 C66 62 73 56 71 51 C69 46 63 46 60 52 Z" fill="#ffffff" filter="drop-shadow(0 0 5px #fff)" />
          {/* Cogwheel Teeth Accents */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 60 + Math.cos(rad) * 52;
            const y1 = 60 + Math.sin(rad) * 52;
            const x2 = 60 + Math.cos(rad) * 57;
            const y2 = 60 + Math.sin(rad) * 57;
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f5e6c8" strokeWidth="2.5" strokeLinecap="round" />;
          })}
        </svg>
      )}

      {/* 2. BEAUTY LUCKY DRAW: APHRODITE CRYSTAL FLACON */}
      {slug === 'beauty-lucky-draw' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_24px_rgba(168,85,247,0.5)]">
          <defs>
            <linearGradient id="beauty-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <radialGradient id="beauty-liquid" cx="45%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#f5d0fe" />
              <stop offset="40%" stopColor="#c084fc" />
              <stop offset="80%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#3b0764" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="#0d111d" stroke="url(#beauty-gold)" strokeWidth="2" />
          {/* Crystal Flacon Cap */}
          <rect x="52" y="24" width="16" height="12" rx="3" fill="url(#beauty-gold)" />
          <rect x="46" y="36" width="28" height="5" rx="2" fill="#d4af37" stroke="#fef08a" strokeWidth="0.8" />
          {/* Flacon Body */}
          <path
            d="M38 45 C32 45 32 60 32 76 C32 94 44 100 60 100 C76 100 88 94 88 76 C88 60 88 45 82 45 Z"
            fill="url(#beauty-liquid)"
            stroke="url(#beauty-gold)"
            strokeWidth="2"
          />
          <circle cx="60" cy="74" r="14" fill="#121724" stroke="#d4af37" strokeWidth="1.2" />
          <polygon points="60,65 63,71 70,71 64.5,76 67,82 60,78 53,82 55.5,76 50,71 57,71" fill="#fef08a" />
          {/* Specular Glare */}
          <ellipse cx="44" cy="62" rx="4" ry="12" fill="#ffffff" opacity="0.6" transform="rotate(-15 44 62)" />
        </svg>
      )}

      {/* 3. FLOWER PICKING: VICTORIAN BOTANICAL ORCHID */}
      {slug === 'flower-picking' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_24px_rgba(244,114,182,0.5)]">
          <defs>
            <radialGradient id="flower-petal" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fdf2f8" />
              <stop offset="40%" stopColor="#fbcfe8" />
              <stop offset="80%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#be185d" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="#0b1319" stroke="#10b981" strokeWidth="2" strokeOpacity="0.6" />
          {/* 5 Petals */}
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 60 + Math.cos(rad) * 20;
            const cy = 60 + Math.sin(rad) * 20;
            return (
              <circle
                key={angle}
                cx={cx}
                cy={cy}
                r="18"
                fill="url(#flower-petal)"
                stroke="#fff"
                strokeWidth="1"
                strokeOpacity="0.8"
              />
            );
          })}
          {/* Gold Filigree Core Medallion */}
          <circle cx="60" cy="60" r="14" fill="#fbbf24" stroke="#d4af37" strokeWidth="2" />
          <circle cx="60" cy="60" r="8" fill="#78350f" />
          <circle cx="60" cy="60" r="4" fill="#ffffff" />
        </svg>
      )}

      {/* 4. LOVE LETTER: ANIME ROYAL WAX-SEALED ENVELOPE */}
      {slug === 'love-letter' && (
        <div className="relative w-full h-full flex items-center justify-center p-1 group">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/assets/games/anime_sealed_envelope.png"
              alt="Thư Tình Hoàng Gia"
              className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(244,63,94,0.6)] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-amber-300/60 animate-ping opacity-40 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 5. CHRISTMAS TREE: ANIME HOLIDAY PINE & ENHANCED VIBRATION FX */}
      {slug === 'lucky-christmas-tree' && (
        <div className="relative w-full h-full flex items-center justify-center group cursor-pointer">
          {/* Emerald Aurora Ambient Aura */}
          <div className="absolute inset-1 rounded-full bg-emerald-500/25 blur-xl animate-pulse pointer-events-none" />
          <div className="absolute inset-3 rounded-full bg-cyan-400/20 blur-lg pointer-events-none" />
          
          {/* Circular Frame matching the exhibition style */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:border-amber-300 transition-colors duration-500 pointer-events-none" />
          <div className="absolute inset-1 rounded-full border border-emerald-300/20 pointer-events-none" />

          {/* Stardust Sparkle Accents */}
          <div className="absolute top-1 right-3 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] animate-ping opacity-60 pointer-events-none" />
          <div className="absolute bottom-3 left-2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#38bdf8] animate-pulse opacity-80 pointer-events-none" />

          {/* Anime Christmas Tree with Rhythmic Sway & Jiggle/Vibration Animation */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center p-1"
            animate={{
              y: [-2, 2, -2],
              rotate: [-1.2, 1.2, -1.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.08,
              rotate: [0, -3.5, 3.5, -2.5, 2.5, -1, 1, 0],
              transition: {
                rotate: {
                  repeat: Infinity,
                  duration: 0.35,
                  ease: "easeInOut",
                },
                scale: { duration: 0.2 },
              }
            }}
            whileTap={{
              scale: 0.95,
              rotate: [0, -6, 6, -5, 5, -2, 2, 0],
              transition: { duration: 0.35 },
            }}
          >
            <img
              src="/assets/games/anime_christmas_tree.png"
              alt="Anime Christmas Tree"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(251,191,36,0.6)] select-none pointer-events-none"
              draggable={false}
            />

            {/* Radiant Top Star Flare */}
            <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-amber-300/40 blur-sm animate-pulse" />
            </div>

            {/* Shimmer Light Sweeping Overlay */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-amber-400/10 via-transparent to-emerald-300/15 pointer-events-none" />
          </motion.div>
        </div>
      )}

      {/* 6. SANTA GIFT: ANIME GOLDEN BELL & AURORA GLOW */}
      {slug === 'santa-gift' && (
        <div className="relative w-full h-full flex items-center justify-center p-2">
          <div className="absolute inset-3 rounded-full bg-cyan-500/20 blur-xl" />
          <div className="absolute inset-4 rounded-full bg-amber-400/20 blur-lg" />
          <img
            src="/assets/games/anime_golden_bell.png"
            alt="Anime Golden Bell"
            className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(251,191,36,0.95)] contrast-110 select-none transform hover:scale-105 transition-transform duration-300"
            draggable={false}
          />
        </div>
      )}

      {/* 7. SNOW CATCHER: MACRO ICE CRYSTAL SNOWFLAKE */}
      {slug === 'snow-catcher' && (
        <div className="relative w-full h-full flex items-center justify-center p-3">
          <div className="absolute inset-4 rounded-full bg-cyan-500/20 blur-xl" />
          <img
            src="/assets/games/crystal_snowflake_ice.png"
            alt="Crystal Snowflake"
            className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(56,189,248,0.9)] contrast-125 select-none"
            draggable={false}
          />
        </div>
      )}

      {/* 8. LUCKY ENVELOPE: IMPERIAL HUE LACQUER PACKET */}
      {slug === 'lucky-envelope' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_24px_rgba(220,38,38,0.6)]">
          <circle cx="60" cy="60" r="54" fill="#180709" stroke="#d4af37" strokeWidth="2" />
          {/* Red Lacquer Packet */}
          <rect x="34" y="24" width="52" height="74" rx="10" fill="#b91c1c" stroke="#d4af37" strokeWidth="2" />
          <path d="M34 24 C44 42 76 42 86 24 Z" fill="#991b1b" stroke="#d4af37" strokeWidth="1.5" />
          {/* Gold "LỘC" Medallion */}
          <circle cx="60" cy="60" r="16" fill="#fbbf24" stroke="#d4af37" strokeWidth="2" />
          <rect x="54" y="54" width="12" height="12" fill="#b91c1c" rx="2" />
          <circle cx="60" cy="60" r="3" fill="#fbbf24" />
        </svg>
      )}

      {/* 9. GOLDEN DRAGON: IMPERIAL GOLDEN DRAGON (USER REFERENCE) */}
      {slug === 'golden-dragon' && (
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_8px_24px_rgba(245,158,11,0.6)] group-hover:scale-105 transition-transform">
          <img
            src="/assets/games/golden_dragon_artwork.jpg"
            alt="Thần Long Hoàng Kim"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-110"
          />
        </div>
      )}

      {/* 10. FIREWORK FORTUNE: GRAND FESTIVAL FIREWORKS (MATCHING PHOTO) */}
      {slug === 'firework-fortune' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_28px_rgba(217,70,239,0.5)]">
          <defs>
            <radialGradient id="fw-night-sky" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#2e0838" />
              <stop offset="35%" stopColor="#120624" />
              <stop offset="75%" stopColor="#080410" />
              <stop offset="100%" stopColor="#040208" />
            </radialGradient>
            <radialGradient id="fw-magenta-glow" cx="42%" cy="36%" r="45%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#c026d3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c026d3" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="fw-cyan-glow" cx="72%" cy="56%" r="35%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fw-fan-gold" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#fde047" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>
            <clipPath id="fw-circle-clip">
              <circle cx="60" cy="60" r="54" />
            </clipPath>
          </defs>

          {/* Background Night Sky Dome */}
          <circle cx="60" cy="60" r="54" fill="url(#fw-night-sky)" stroke="#d4af37" strokeWidth="1.5" />
          
          <g clipPath="url(#fw-circle-clip)">
            {/* Atmospheric Bursts Ambient Glow */}
            <circle cx="46" cy="38" r="42" fill="url(#fw-magenta-glow)" />
            <circle cx="78" cy="58" r="30" fill="url(#fw-cyan-glow)" />

            {/* --- TIER 3 (TOP): GIANT MAGENTA/PURPLE PEONY (Left-Center) --- */}
            {/* Fine Radial Filaments */}
            {[...Array(36)].map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const len = 16 + (i % 3) * 5;
              const x1 = 46 + Math.cos(angle) * 3;
              const y1 = 38 + Math.sin(angle) * 3;
              const x2 = 46 + Math.cos(angle) * len;
              const y2 = 38 + Math.sin(angle) * len;
              return (
                <line
                  key={`peony-m-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? '#f472b6' : '#e879f9'}
                  strokeWidth="0.8"
                  strokeOpacity={0.85}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Outer Spark Tips */}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const dist = 22 + (i % 2) * 4;
              const cx = 46 + Math.cos(angle) * dist;
              const cy = 38 + Math.sin(angle) * dist;
              return <circle key={`peony-tip-${i}`} cx={cx} cy={cy} r="0.7" fill="#ffffff" />;
            })}
            {/* Magenta Core Strobe */}
            <circle cx="46" cy="38" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px #f43f5e)" />

            {/* --- TIER 2: ELECTRIC CYAN & TURQUOISE PEONY (Right) --- */}
            {[...Array(28)].map((_, i) => {
              const angle = (i * (360 / 28) * Math.PI) / 180;
              const len = 11 + (i % 3) * 4;
              const x1 = 80 + Math.cos(angle) * 2;
              const y1 = 54 + Math.sin(angle) * 2;
              const x2 = 80 + Math.cos(angle) * len;
              const y2 = 54 + Math.sin(angle) * len;
              return (
                <line
                  key={`cyan-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? '#38bdf8' : '#a5f3fc'}
                  strokeWidth="0.75"
                  strokeOpacity={0.9}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="80" cy="54" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 5px #38bdf8)" />

            {/* --- TIER 2: GOLDEN CHRYSANTHEMUM WILLOW BURST (Top-Right) --- */}
            {[...Array(24)].map((_, i) => {
              const angle = ((i * 15 + 180) * Math.PI) / 180;
              const len = 13 + (i % 2) * 5;
              const x1 = 76 + Math.cos(angle) * 2;
              const y1 = 28 + Math.sin(angle) * 2;
              const x2 = 76 + Math.cos(angle) * len;
              const y2 = 28 + Math.sin(angle) * len + (len * len) * 0.015; // willow curve drop
              return (
                <line
                  key={`gold-willow-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#fbbf24"
                  strokeWidth="0.8"
                  strokeOpacity={0.8}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="76" cy="28" r="2.2" fill="#fffbeb" filter="drop-shadow(0 0 4px #fbbf24)" />

            {/* --- TIER 1 (BOTTOM): GRAND FAN WILLOW PLUMES (GROUND FOUNTAINS AS IN PHOTO) --- */}
            {/* Left Fan Plumes */}
            {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((deg, idx) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const len = 34 + Math.sin(Math.abs(deg) * 0.05) * 6;
              const bx = 32;
              const by = 112;
              const cx = bx + Math.cos(rad) * (len * 0.55);
              const cy = by + Math.sin(rad) * (len * 0.6);
              const ex = bx + Math.cos(rad) * len + (deg > 0 ? 3 : -3);
              const ey = by + Math.sin(rad) * len + 2;
              return (
                <path
                  key={`fan-l-${idx}`}
                  d={`M ${bx} ${by} Q ${cx} ${cy} ${ex} ${ey}`}
                  fill="none"
                  stroke="url(#fw-fan-gold)"
                  strokeWidth="1.2"
                  strokeOpacity={0.85}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Right Fan Plumes */}
            {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((deg, idx) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const len = 36 + Math.sin(Math.abs(deg) * 0.05) * 6;
              const bx = 86;
              const by = 112;
              const cx = bx + Math.cos(rad) * (len * 0.55);
              const cy = by + Math.sin(rad) * (len * 0.6);
              const ex = bx + Math.cos(rad) * len + (deg > 0 ? 3 : -3);
              const ey = by + Math.sin(rad) * len + 2;
              return (
                <path
                  key={`fan-r-${idx}`}
                  d={`M ${bx} ${by} Q ${cx} ${cy} ${ex} ${ey}`}
                  fill="none"
                  stroke="url(#fw-fan-gold)"
                  strokeWidth="1.2"
                  strokeOpacity={0.85}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Falling Golden Embers / Willow Droplets */}
            {[
              { cx: 38, cy: 78 }, { cx: 48, cy: 82 }, { cx: 26, cy: 86 },
              { cx: 72, cy: 84 }, { cx: 88, cy: 80 }, { cx: 98, cy: 88 },
              { cx: 60, cy: 72 }, { cx: 54, cy: 62 }, { cx: 66, cy: 48 }
            ].map((pt, i) => (
              <circle key={`ember-${i}`} cx={pt.cx} cy={pt.cy} r="0.8" fill="#fde047" opacity={0.75} />
            ))}

            {/* Ground Silhouette (Tree branches along the bottom horizon as in photo) */}
            <path
              d="M 6 114 Q 18 106 28 111 Q 38 104 50 110 Q 64 105 78 110 Q 92 103 104 110 Q 112 107 118 114 L 118 120 L 6 120 Z"
              fill="#030206"
            />
            {/* Tree branches silhouette details */}
            <path
              d="M 18 108 L 20 102 M 20 104 L 24 103 M 48 107 L 50 101 M 50 103 L 53 102 M 76 108 L 78 101 M 78 104 L 82 103 M 102 108 L 104 102"
              stroke="#030206"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          {/* Luxury Astronomical Gilded Bezel Ring */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 4" opacity={0.4} />
          <circle cx="60" cy="60" r="57" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity={0.3} />
        </svg>
      )}
    </div>
  );
};
