import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Check, Star, Heart } from 'lucide-react';
import { sound } from '../../../utils/audio';

interface FlowerPickingStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface RoyalFlower {
  id: 'peony' | 'rose' | 'tulip';
  name: string;
  title: string;
  tag: string;
  budImg: string;
  openingImg?: string;
  bloomImg: string;
  glowColor: string;
  accentGold: string;
  petalColor: string;
  innerColor: string;
  voucherName: string;
  voucherValue: string;
  voucherCode: string;
  score: number;
}

interface PollenParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
}

export const FlowerPickingStage: React.FC<FlowerPickingStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [pickedId, setPickedId] = useState<'peony' | 'rose' | 'tulip' | null>(null);
  const [bloomPhase, setBloomPhase] = useState<'idle' | 'awakening' | 'unfurling' | 'bloomed'>('idle');
  const [rewardRevealed, setRewardRevealed] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const flowers: RoyalFlower[] = [
    {
      id: 'rose',
      name: 'Hồng Sa Mạc Nhung Đỏ',
      title: 'Rose Royale Velvet',
      tag: '🌹 Quý Phái',
      budImg: '/assets/games/flower_rose_bud.jpg',
      bloomImg: '/assets/games/flower_rose.jpg',
      glowColor: '#f43f5e',
      accentGold: '#fef08a',
      petalColor: '#e11d48',
      innerColor: '#9f1239',
      voucherName: 'Set Nước Hoa & Hoa Hồng Pháp VIP',
      voucherValue: '850.000 VNĐ',
      voucherCode: 'ROSE_ROYALE_VIP',
      score: 550,
    },
    {
      id: 'peony',
      name: 'Mẫu Đơn Cung Đình Bừng Nở',
      title: 'Pivoine Impériale',
      tag: '👑 Vương Giả • Tuyệt Tác',
      budImg: '/assets/games/flower_peony_bud.jpg',
      openingImg: '/assets/games/flower_peony_opening.jpg',
      bloomImg: '/assets/games/flower_peony.jpg',
      glowColor: '#ec4899',
      accentGold: '#ffd700',
      petalColor: '#fb7185',
      innerColor: '#be123c',
      voucherName: 'Chậu Mẫu Đơn Cung Đình Thượng Uyển',
      voucherValue: '1.500.000 VNĐ',
      voucherCode: 'PEONY_IMPERIAL',
      score: 600,
    },
    {
      id: 'tulip',
      name: 'Tulip Hoàng Kim Thần Tài',
      title: 'Tulipe d\'Or Solaire',
      tag: '🌟 May Mắn',
      budImg: '/assets/games/flower_tulip_bud.jpg',
      bloomImg: '/assets/games/flower_tulip.jpg',
      glowColor: '#eab308',
      accentGold: '#fff099',
      petalColor: '#f59e0b',
      innerColor: '#b45309',
      voucherName: 'Voucher Hoa Tươi May Mắn Thần Tài',
      voucherValue: '500.000 VNĐ',
      voucherCode: 'TULIP_GOLDEN',
      score: 500,
    },
  ];

  // Pollen particle explosion & floating stardust animation
  useEffect(() => {
    if (bloomPhase !== 'unfurling' && bloomPhase !== 'bloomed') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: PollenParticle[] = [];
    const colors = ['#fde047', '#facc15', '#fef08a', '#ffffff', '#fb7185', '#34d399'];

    // Spawn initial burst of pollen motes
    const spawnX = canvas.width / 2;
    const spawnY = canvas.height * 0.46;

    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50 + (Math.random() - 0.5) * 0.5;
      const speed = 1.2 + Math.random() * 3.8;
      particles.push({
        id: i,
        x: spawnX + (Math.random() - 0.5) * 20,
        y: spawnY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1.2 + Math.random() * 1.5), // slight upward draft
        size: 1.5 + Math.random() * 3.5,
        alpha: 0.85 + Math.random() * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
      });
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Continuous gentle ambient pollen emission while bloomed
      if (particles.length < 65 && Math.random() > 0.6) {
        particles.push({
          id: Math.random(),
          x: spawnX + (Math.random() - 0.5) * 40,
          y: spawnY + (Math.random() - 0.5) * 25,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -(0.6 + Math.random() * 1.5),
          size: 1.2 + Math.random() * 2.8,
          alpha: 0.9,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;
        p.vx *= 0.985;
        p.vy += 0.025 * 60 * dt; // slight gravity
        p.life -= 0.35 * dt;

        if (p.life <= 0 || p.y > canvas.height || p.x < 0 || p.x > canvas.width) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life * p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 3;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle for larger particles
        if (p.size > 2.8) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 1.8, p.y);
          ctx.lineTo(p.x + p.size * 1.8, p.y);
          ctx.moveTo(p.x, p.y - p.size * 1.8);
          ctx.lineTo(p.x, p.y + p.size * 1.8);
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [bloomPhase]);

  // Handle Flower Selection and Cinematic Time-Lapse Blooming
  const handlePickFlower = (flower: RoyalFlower) => {
    if (pickedId) return;
    setPickedId(flower.id);
    sound.playClick(soundEnabled);
    track('FLOWER_PICK', 1);

    // Phase 1: Thức giấc & Đài hoa hé mở (Awakening - 1.3s để người chơi cảm nhận nụ hoa cựa mình)
    setBloomPhase('awakening');
    sound.playFlowerBloom(soundEnabled);

    // Phase 2: Bung nở từng lớp cánh chậm rãi, duyên dáng (Time-Lapse Unfurling - 2.2s)
    setTimeout(() => {
      setBloomPhase('unfurling');
      sound.playPollenBurst(soundEnabled);
      track('FLOWER_BLOOM_UNFURL', 1);

      // Phase 3: Hoa bừng nở hoàn mỹ & Nhụy hoa tỏa hào quang (Full Bloom Glory - 1.8s)
      setTimeout(() => {
        setBloomPhase('bloomed');
        track('FLOWER_FULL_BLOOM', 1);

        // Phase 4: Quà tặng thăng hoa từ nhụy hoa sau khi ngắm hoa nở viên mãn
        setTimeout(() => {
          setRewardRevealed(true);
          sound.playWin(soundEnabled);

          setTimeout(() => {
            onComplete(flower.score);
          }, 3200);
        }, 1500);
      }, 2200);
    }, 1300);
  };

  const selectedFlower = flowers.find((f) => f.id === pickedId);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-1 sm:py-6 px-1 sm:px-4">
      {/* Conservatory Royal Header */}
      <div className="text-center mb-2 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-emerald-300 font-bold">
            Jardin Botanique Royal • 8/3 & 20/10
          </span>
        </div>
        <h2 className="font-serif text-xl sm:text-3xl text-neutral-100 font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Hái Hoa Bừng Nở Nhận Quà
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-400 font-light mt-0.5 sm:mt-1">
          Chạm vào nụ hoa yêu thích — Chứng kiến từng lớp cánh hoa hé nở tuyệt mỹ
        </p>
      </div>

      {/* Royal Botanical Glasshouse Stage */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0a1510]/95 via-[#060d0a]/95 to-[#020504]/98 border border-emerald-500/25 p-2 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden min-h-[360px] sm:min-h-[480px] flex flex-col items-center justify-center">
        {/* Greenhouse Ambient Light Shafts & Pool Reflections */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-amber-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        
        {/* Soft Water Ripple Waves on Stage Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-emerald-950/40 via-emerald-900/10 to-transparent pointer-events-none" />

        {/* Ambient Firefly Motes */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -22, 0],
              x: [0, (i % 2 === 0 ? 12 : -12), 0],
              opacity: [0.25, 0.85, 0.25],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.5 + (i % 5),
              delay: i * 0.35,
              ease: 'easeInOut',
            }}
            style={{
              top: `${12 + (i * 7) % 68}%`,
              left: `${6 + (i * 7.5) % 88}%`,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047] pointer-events-none z-10"
          />
        ))}

        {/* 1. GARDEN BED: 3 ROYAL BOTANICAL BUDS (Desktop & Mobile Optimized) */}
        {!pickedId ? (
          <div className="relative z-20 w-full grid grid-cols-3 gap-2 sm:gap-8 items-end justify-center max-w-2xl px-1 sm:px-6">
            {flowers.map((flower) => {
              const isCenter = flower.id === 'peony';

              return (
                <motion.div
                  key={flower.id}
                  id={`flower-card-${flower.id}`}
                  data-testid={`flower-${flower.id}`}
                  role="button"
                  tabIndex={0}
                  whileHover={{ y: -10, scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handlePickFlower(flower)}
                  className={`group relative flex flex-col items-center justify-end cursor-pointer p-1 sm:p-4 rounded-2xl transition-all touch-manipulation select-none ${
                    isCenter
                      ? 'bg-gradient-to-b from-emerald-900/30 via-emerald-950/20 to-transparent border border-amber-400/35 shadow-[0_10px_30px_rgba(251,191,36,0.15)] -translate-y-2 sm:-translate-y-4'
                      : 'bg-emerald-950/15 border border-emerald-500/20 hover:border-emerald-400/40'
                  }`}
                >
                  {/* Center Flower Crown Halo */}
                  {isCenter && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                      className="absolute -top-6 text-amber-300 text-lg sm:text-xl filter drop-shadow-[0_0_8px_#ffd700]"
                    >
                      👑
                    </motion.div>
                  )}

                  {/* Ambient Flower Aura Glow */}
                  <div
                    className="absolute top-4 w-24 sm:w-36 h-24 sm:h-36 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none"
                    style={{ background: flower.glowColor }}
                  />

                  {/* Circular Crystal Glass Frame with Bud Artwork */}
                  <div className="relative w-20 h-20 sm:w-36 sm:h-36 rounded-full p-1 sm:p-1.5 border-2 border-emerald-400/40 group-hover:border-amber-400 shadow-[0_8px_25px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all overflow-hidden bg-black/80 flex items-center justify-center">
                    {/* Bud Image with Breathing Scale */}
                    <motion.img
                      src={flower.budImg}
                      alt={flower.name}
                      animate={{ scale: [1, 1.035, 1] }}
                      transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Crystal Glass Lens Shimmer */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                  </div>

                  {/* Calyx & Pedestal Pillar Base */}
                  <div className="flex flex-col items-center mt-1 sm:mt-2 w-full">
                    {/* Calyx foliage leaves */}
                    <svg viewBox="0 0 60 20" className="w-10 sm:w-16 h-3 sm:h-5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      <path d="M10 18 Q30 4 50 18 Q30 0 10 18 Z" fill="#059669" stroke="#34d399" strokeWidth="0.8" />
                    </svg>
                    {/* Golden stem pillar */}
                    <div className="w-1.5 sm:w-2 h-4 sm:h-8 bg-gradient-to-b from-emerald-500 via-emerald-600 to-amber-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    {/* Golden plinth */}
                    <div className="w-12 sm:w-20 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                  </div>

                  {/* Nameplate Card */}
                  <div className="mt-2 text-center w-full px-1">
                    <span className="text-[8px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300 block truncate">
                      {flower.tag}
                    </span>
                    <h4 className="font-serif text-[10px] sm:text-sm font-medium text-neutral-100 mt-0.5 truncate">
                      {flower.name}
                    </h4>
                  </div>

                  {/* Tap Prompt Badge */}
                  <div className="mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[8px] sm:text-[10px] font-sans font-medium text-emerald-300 group-hover:bg-amber-400/20 group-hover:text-amber-200 group-hover:border-amber-400/50 transition-all">
                    Chạm Để Hái
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* 2. CINEMATIC TIME-LAPSE BLOOMING SHOWCASE (Pixabay 41710 Replication) */
          <div className="relative z-20 w-full flex flex-col items-center justify-center py-2">
            {/* Pollen Canvas Particles */}
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              className="absolute inset-0 w-full h-full pointer-events-none z-30"
            />

            {/* Expanding Water Ripple Shockwaves on Bloom Start */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: [0.6, 2.8], opacity: [0.85, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
              className="absolute w-44 sm:w-64 h-44 sm:h-64 rounded-full border-2 border-emerald-400/60 shadow-[0_0_40px_rgba(52,211,153,0.5)] pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.2, opacity: 0.7 }}
              animate={{ scale: [0.3, 2.2], opacity: [0.75, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.6, ease: 'easeOut' }}
              className="absolute w-44 sm:w-64 h-44 sm:h-64 rounded-full border border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.4)] pointer-events-none"
            />

            {/* Solar Godray Halo radiating behind blooming blossom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: bloomPhase === 'bloomed' ? [0.6, 0.95, 0.6] : 0.4,
                scale: bloomPhase === 'bloomed' ? [1.1, 1.25, 1.1] : 0.8,
                rotate: 360,
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 24, ease: 'linear' },
                opacity: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
                scale: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
              }}
              className="absolute w-64 sm:w-96 h-64 sm:h-96 rounded-full pointer-events-none z-0 blur-2xl"
              style={{
                background: `radial-gradient(circle, ${selectedFlower?.glowColor || '#f43f5e'} 0%, ${selectedFlower?.accentGold || '#ffd700'} 45%, transparent 75%)`,
              }}
            />

            {/* FLOWER HEAD TIME-LAPSE PETAL CONTAINER (Scales smoothly upward when reward appears) */}
            <motion.div
              animate={{
                y: rewardRevealed ? -24 : 0,
                scale: rewardRevealed ? 0.82 : 1,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-48 h-48 sm:w-72 sm:h-72 flex items-center justify-center z-20"
            >
              {/* STAGE A: BUD AWAKENING (Chậm rãi cựa mình thức giấc) */}
              <AnimatePresence>
                {bloomPhase === 'awakening' && selectedFlower && (
                  <motion.div
                    key="bud-frame"
                    initial={{ scale: 0.75, opacity: 0.8 }}
                    animate={{ scale: [0.75, 1.08], opacity: [0.9, 1] }}
                    exit={{ opacity: 0, scale: 1.15, transition: { duration: 0.8 } }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-40 h-40 sm:w-60 sm:h-60 rounded-full p-1.5 border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.5)] overflow-hidden bg-black/90">
                      <img
                        src={selectedFlower.budImg}
                        alt="Nụ hoa"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-emerald-950/50 via-transparent to-white/20" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STAGE B: INTERMEDIATE UNFURLING PETALS (Cánh hoa từ từ bung xòe từng lớp) */}
              <AnimatePresence>
                {bloomPhase === 'unfurling' && selectedFlower && (
                  <motion.div
                    key="unfurling-frame"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 1, rotate: [0, 5] }}
                    exit={{ opacity: 0, scale: 1.15, transition: { duration: 1.0 } }}
                    transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-44 h-44 sm:w-68 sm:h-68 rounded-full p-2 border-3 border-amber-400/70 shadow-[0_0_50px_rgba(251,191,36,0.6)] overflow-hidden bg-black">
                      <img
                        src={selectedFlower.openingImg || selectedFlower.bloomImg}
                        alt="Hoa đang bung nở"
                        className="w-full h-full object-cover rounded-full scale-105"
                      />
                      {/* Luminous Petal Specular Glare */}
                      <motion.div
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: '100%', opacity: 0.75 }}
                        transition={{ duration: 1.8, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STAGE C: FULL GLORIOUS BLOOM & LIVING BREATH (Bừng nở viên mãn trọn vẹn) */}
              <AnimatePresence>
                {bloomPhase === 'bloomed' && selectedFlower && (
                  <motion.div
                    key="bloomed-frame"
                    initial={{ scale: 0.88, opacity: 0, rotate: -4 }}
                    animate={{ scale: [1, 1.03, 1], opacity: 1, rotate: 0 }}
                    transition={{
                      scale: { repeat: Infinity, duration: 4.8, ease: 'easeInOut' },
                      opacity: { duration: 1.2, ease: 'easeOut' },
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Golden Stamen Pulsing Center Burst Ring */}
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.9, 0.5] }}
                      transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                      className="absolute w-28 sm:w-40 h-28 sm:h-40 rounded-full border-2 border-amber-300 shadow-[0_0_35px_#fde047] pointer-events-none z-30"
                    />

                    {/* Masterpiece Botanical Bloom Frame */}
                    <div className="relative w-48 h-48 sm:w-72 sm:h-72 rounded-full p-2 border-3 border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.8),_0_0_90px_rgba(244,63,94,0.5)] overflow-hidden bg-black">
                      <img
                        src={selectedFlower.bloomImg}
                        alt="Hoa bừng nở"
                        className="w-full h-full object-cover rounded-full scale-105"
                      />

                      {/* Golden Dust Shimmer on Center Pistil */}
                      <div className="absolute inset-0 rounded-full bg-radial-vignette pointer-events-none" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-amber-300/15 to-transparent pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Status Announcement Banner */}
            {!rewardRevealed && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-2 sm:mt-3 text-center z-30"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                  <span className="text-xs sm:text-sm font-serif text-amber-200 font-semibold tracking-wide">
                    {bloomPhase === 'awakening'
                      ? 'Nụ hoa đang cựa mình thức giấc...'
                      : bloomPhase === 'unfurling'
                      ? 'Từng lớp cánh hoa đang hé mở rạng rỡ...'
                      : 'ĐÓA HOA ĐÃ BỪNG NỞ VIÊN MÃN!'}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
                </div>
              </motion.div>
            )}

            {/* 3. REWARD CARD EMERGING FROM BLOOMING FLOWER */}
            <AnimatePresence>
              {rewardRevealed && selectedFlower && (
                <motion.div
                  initial={{ y: 40, opacity: 0, scale: 0.9 }}
                  animate={{ y: -10, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                  className="relative z-40 mt-1 sm:mt-2 mx-auto max-w-sm w-full p-3.5 sm:p-5 rounded-2xl bg-gradient-to-b from-neutral-900/95 via-[#0b1b14]/98 to-neutral-950/95 border-2 border-amber-400/70 shadow-[0_15px_40px_rgba(251,191,36,0.35)] text-center backdrop-blur-xl"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-1.5 border border-amber-400/40">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lộc Hoa Nở Sắc • Trao Thưởng May Mắn</span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base text-emerald-200 font-normal">
                    {selectedFlower.voucherName}
                  </h3>
                  <p className="text-lg sm:text-2xl font-serif text-white font-bold mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100">
                    {selectedFlower.voucherValue}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs font-sans text-emerald-300 font-semibold bg-emerald-950/60 py-1.5 px-3 rounded-xl border border-emerald-500/30">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>+{selectedFlower.score} Điểm Cát Tường Đã Nhận</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Guidance */}
      <p className="text-[11px] sm:text-xs text-neutral-400 font-sans tracking-wide mt-2 sm:mt-4 text-center">
        {pickedId === null
          ? 'Chạm nhẹ vào nụ hoa để đánh thức đóa hoa cung đình hé nụ bừng nở.'
          : bloomPhase === 'bloomed'
          ? 'Hương sắc viên mãn — Quà tặng may mắn đã thuộc về bạn!'
          : 'Đang bung cánh theo dòng thời gian tuyệt mỹ...'}
      </p>
    </div>
  );
};
