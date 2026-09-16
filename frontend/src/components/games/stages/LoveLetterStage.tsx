import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Award, Check, Sparkles, Copy } from 'lucide-react';
import { sound } from '../../../utils/audio';
import { getAssetUrl } from '../../../utils/assets';

interface LoveLetterStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'petal' | 'sparkle' | 'heart';
}

export const LoveLetterStage: React.FC<LoveLetterStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  // Game sequence phases: 'sealed' -> 'breaking' -> 'unfolded' -> 'reward'
  const [phase, setPhase] = useState<'sealed' | 'breaking' | 'unfolded' | 'reward'>('sealed');
  const [copiedCode, setCopiedCode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Canvas particle engine for floating rose petals, embers & stardust
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const petalColors = ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#e11d48'];
    const particles: Particle[] = [];

    // Ambient floating petals
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 14,
        speedX: -0.4 + Math.random() * 0.8,
        speedY: 0.5 + Math.random() * 0.9,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: 0.35 + Math.random() * 0.45,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        type: Math.random() > 0.35 ? 'petal' : 'sparkle',
      });
    }
    particlesRef.current = particles;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'petal') {
          // Draw delicate curved rose petal
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'heart') {
          // Draw heart
          ctx.fillStyle = p.color;
          const s = p.size * 0.4;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.8, -s * 1.6, s * 0.2, 0, s * 1.5);
          ctx.bezierCurveTo(s * 1.6, s * 0.2, s, -s * 0.8, 0, s * 0.3);
          ctx.fill();
        } else {
          // Glowing star sparkle
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // Burst particles on wax crack & letter open
  const triggerBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const petalColors = ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fff'];

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x: width / 2,
        y: height / 2,
        size: 10 + Math.random() * 16,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 1.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        opacity: 0.95,
        color: petalColors[i % petalColors.length],
        type: i % 2 === 0 ? 'petal' : 'heart',
      });
    }
  };

  // Handle player opening the love letter
  const handleOpenLetter = () => {
    if (phase !== 'sealed') return;
    track('LOVE_LETTER_CLICK', 1);

    // 1. Phá vỡ con dấu sáp (Wax seal crack)
    sound.playWaxSealCrack(soundEnabled);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    setPhase('breaking');

    setTimeout(() => {
      // 2. Lá thư trôi ra ngoài hoàn toàn phía trước (Letter emerges fully out to front)
      sound.playParchmentUnfold(soundEnabled);
      setPhase('unfolded');
      triggerBurst();
      track('LOVE_LETTER_UNFOLD', 1);

      // 3. Tự động hiển thị voucher sau 6 giây đọc thư trọn vẹn (hoặc khi người chơi bấm nút nhận quà)
      setTimeout(() => {
        setPhase(current => {
          if (current === 'unfolded') {
            sound.playWin(soundEnabled);
            track('LOVE_LETTER_REWARD_CLAIM', 560);
            return 'reward';
          }
          return current;
        });
      }, 6000);
    }, 550);
  };

  const handleClaimRewardManual = () => {
    sound.playWin(soundEnabled);
    track('LOVE_LETTER_REWARD_CLAIM', 560);
    setPhase('reward');
  };

  const handleCopyVoucher = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('SWEETLOVE142');
    setCopiedCode(true);
    sound.playClick(soundEnabled);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-1 sm:py-3 px-2 sm:px-4 touch-none">
      {/* Valentine Header */}
      <div className="text-center mb-1.5 sm:mb-3">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-rose-500/15 border border-rose-500/35 mb-1 sm:mb-2 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <Heart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-rose-400 fill-rose-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-rose-200 font-semibold">
            Bức Thư Tình Hoàng Gia • Valentine
          </span>
        </div>
        <h2 className="font-serif text-xl sm:text-3xl text-amber-100 font-normal tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Mở Thư Tình Trao Lời Yêu
        </h2>
        <p className="text-[11px] sm:text-xs text-rose-200/80 font-light mt-0.5 max-w-lg mx-auto">
          Chạm vào con dấu sáp trái tim ruby để mở phong thư hoàng gia và đón nhận điều bất ngờ!
        </p>
      </div>

      {/* Main Love Letter Chamber Stage with Anime Twilight Room Background */}
      <div className="relative w-full max-w-2xl min-h-[440px] sm:min-h-[580px] max-h-[calc(100dvh-120px)] rounded-3xl border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center justify-center p-2 sm:p-5">
        {/* Background Image: Romantic candlelit anime desk */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
          style={{
            backgroundImage: `url('${getAssetUrl('/assets/games/anime_love_letter_desk_bg.jpg')}')`,
            filter: phase === 'sealed' ? 'brightness(0.85) contrast(1.05)' : 'brightness(0.95) contrast(1.08)',
          }}
        />

        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />

        {/* Floating Rose Petals & Embers Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Soft Golden Candlelight Glow in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-radial from-amber-400/20 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* ========================================================================= */}
        {/* UNIFIED ENVELOPE ASSEMBLY MATCHING iSTOCK MOTION DYNAMICS */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{
            scale: (phase === 'unfolded' || phase === 'reward') ? 0.88 : 1,
            opacity: 1,
            y: (phase === 'unfolded' || phase === 'reward') ? 50 : (phase === 'sealed' ? [0, -6, 0] : 0),
            rotate: phase === 'sealed' ? [-0.4, 0.4, -0.4] : 0,
          }}
          transition={{
            y: phase === 'sealed' ? { repeat: Infinity, duration: 4, ease: 'easeInOut' } : { duration: 0.5 },
            rotate: phase === 'sealed' ? { repeat: Infinity, duration: 5, ease: 'easeInOut' } : { duration: 0.5 },
            scale: { duration: 0.4 },
            opacity: { duration: 0.3 },
          }}
          onClick={phase === 'sealed' ? handleOpenLetter : undefined}
          className={`relative z-20 w-72 sm:w-[410px] max-w-[92vw] aspect-[1000/904] flex items-end justify-center select-none my-auto ${
            phase === 'sealed' ? 'cursor-pointer active:scale-95 group' : ''
          }`}
          style={{ perspective: 1200 }}
        >
          {/* 1. LAYER BACK: Open Envelope Back (with silk lining) */}
          {/* Top 34.5% is clipped when closed so only rectangular body is visible */}
          <img
            src={getAssetUrl('/assets/games/anime_envelope_back.png')}
            alt="Open Envelope Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] z-10 transition-all"
            style={{
              clipPath: (phase === 'sealed' || phase === 'breaking') ? 'inset(34.5% 0 0 0)' : 'inset(0 0 0 0)',
              transition: 'clip-path 0.48s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          />

          {/* 2. LAYER LETTER: Floats COMPLETELY OUT to front (z-50) so user can read every word! */}
          <motion.div
            initial={false}
            animate={{
              y: (phase === 'unfolded' || phase === 'reward') ? -130 : 35,
              opacity: (phase === 'unfolded' || phase === 'reward') ? 1 : 0,
              scale: (phase === 'unfolded' || phase === 'reward') ? 1.12 : 0.92,
            }}
            transition={{
              y: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.05 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.5 },
            }}
            style={{
              left: '2%',
              width: '96%',
              bottom: '12%',
              aspectRatio: '1055 / 763',
              height: 'auto',
              zIndex: (phase === 'unfolded' || phase === 'reward') ? 50 : 20,
            }}
            className="absolute"
          >
            {/* Natural Parchment Letter with Authentic Deckled Edges */}
            <div className="relative w-full h-full filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
              {/* Authentic Parchment Texture */}
              <img
                src={getAssetUrl('/assets/games/anime_unfolded_letter.png')}
                alt="Love Letter Paper"
                className="w-full h-full object-fill pointer-events-none"
              />

              {/* Vietnamese Royal Romantic Calligraphy Overlay */}
              <div className="absolute inset-0 px-6 sm:px-10 py-3 sm:py-5 flex flex-col justify-between text-neutral-900 pointer-events-none select-text">
                {/* Header Row */}
                <div className="text-center pt-0.5 sm:pt-1">
                  <div className="font-serif text-[11px] sm:text-[13px] tracking-[0.16em] text-[#5c1328] font-bold uppercase drop-shadow-sm flex items-center justify-center gap-1.5">
                    <span>💌</span> THƯ TÌNH TRAO DUYÊN <span>💌</span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#78350f] font-semibold tracking-wider mt-0.5">
                    14.02.2026
                  </div>
                </div>

                {/* Salutation and Poetic Lines */}
                <div className="text-center my-auto px-1 sm:px-2">
                  <p className="font-serif font-bold text-xs sm:text-[14px] text-[#3b0718] tracking-wide mb-1 sm:mb-1.5">
                    Gửi Người Thương Quý Nơi Phương Xa,
                  </p>
                  <p className="font-serif italic text-[11px] sm:text-[13px] text-[#260510] leading-relaxed max-w-sm mx-auto font-medium">
                    "Giữa vạn dặm hồng trần tìm một ánh mắt,<br />
                    dẫu ngàn trùng phong ba lòng vẫn vẹn nguyên.<br />
                    Chúc bạn vạn sự an nhiên, tình duyên viên mãn<br />
                    và đong đầy hạnh phúc!"
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-amber-900/25 pt-1 text-[8.5px] sm:text-[10px] text-[#5c1328] font-serif font-bold px-1">
                  <span>Mắt Bão Minigame Atelier</span>
                  <span>Vĩnh Kết Đồng Tâm 💕</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. LAYER FOREGROUND: Envelope Front Pocket with Pink Bow (z-30) */}
          <img
            src={getAssetUrl('/assets/games/anime_envelope_front.png')}
            alt="Envelope Front Pocket"
            className="absolute bottom-0 left-0 w-full h-auto object-contain z-30 pointer-events-none drop-shadow-[0_-6px_18px_rgba(0,0,0,0.45)]"
          />

          {/* 4. LAYER FLAP: Downward Flap with Gold Filigree (z-35) */}
          {/* 3D Flips UPWARDS like the iStock video when tapped */}
          <motion.div
            initial={false}
            animate={{
              rotateX: (phase === 'sealed') ? 0 : -120,
              opacity: (phase === 'sealed' || phase === 'breaking') ? 1 : 0,
            }}
            transition={{
              rotateX: { duration: 0.44, ease: [0.4, 0, 0.2, 1], delay: phase === 'breaking' ? 0.12 : 0 },
              opacity: { duration: 0.36, delay: phase === 'breaking' ? 0.15 : 0 },
            }}
            style={{
              position: 'absolute',
              top: '34.5%',
              left: 0,
              width: '100%',
              height: '34.5%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              zIndex: 35,
              pointerEvents: phase === 'sealed' ? 'auto' : 'none',
            }}
          >
            <img
              src={getAssetUrl('/assets/games/anime_flap_closed_down.png')}
              alt="Closed Flap"
              className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          {/* 5. WAX SEAL: Ruby Wax Seal with Beacon Ping (z-40) */}
          <AnimatePresence>
            {(phase === 'sealed' || phase === 'breaking') && (
              <motion.div
                key="wax-seal"
                exit={{
                  scale: [1, 1.4, 0],
                  opacity: [1, 1, 0],
                  rotate: [-8, 6, 0],
                }}
                transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1] }}
                className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center pointer-events-none"
              >
                {/* Pulsing Beacon Ring */}
                {phase === 'sealed' && (
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-amber-300/80 animate-ping opacity-60 pointer-events-none" />
                )}
                <img
                  src={getAssetUrl('/assets/games/anime_wax_seal_standalone.png')}
                  alt="Ruby Wax Seal"
                  className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                />

                {/* Breaking Fracture Flash on click */}
                {phase === 'breaking' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.8, 1.8, 2.5], opacity: [1, 1, 0] }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-yellow-200 blur-md pointer-events-none"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 6. TOUCH PROMPT PILL (When Sealed) */}
          {phase === 'sealed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-4 py-1.5 rounded-full bg-gradient-to-r from-neutral-950/90 via-rose-950/95 to-neutral-950/90 border border-amber-400/60 shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center gap-1.5 pointer-events-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-amber-200">
                Chạm Để Mở Thư Tình
              </span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-bounce" />
            </motion.div>
          )}

          {/* 7. PROMPT WHEN UNFOLDED: Claim Voucher Button below the letter */}
          {phase === 'unfolded' && (
            <motion.div
              initial={{ opacity: 0, y: 15, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="absolute -bottom-1 sm:bottom-0 left-1/2 z-50 whitespace-nowrap"
            >
              <button
                type="button"
                onClick={handleClaimRewardManual}
                className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 text-white font-sans font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-200"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
                <span>Đón Nhận Quà Tặng Voucher 🎁</span>
              </button>
            </motion.div>
          )}

          {/* 8. REWARD VOUCHER EMERGENCE (z-50, positioned below without covering the letter!) */}
          <AnimatePresence>
            {phase === 'reward' && (
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.9, x: '-50%' }}
                animate={{ y: 0, opacity: 1, scale: 1, x: '-50%' }}
                transition={{ type: 'spring', damping: 18, stiffness: 180 }}
                className="absolute -bottom-6 sm:-bottom-5 left-1/2 z-50 w-[94%] max-w-[360px] p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-neutral-900/98 via-rose-950/95 to-neutral-950/98 border-2 border-amber-400/80 shadow-[0_20px_45px_rgba(244,63,94,0.6)] text-center backdrop-blur-xl"
              >
                {/* Top Golden Ribbon */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Voucher Tình Yêu Trao Tay</span>
                </div>

                <h3 className="font-serif text-xs sm:text-sm text-rose-200 font-semibold">
                  Tiệc Tối Lãng Mạn Ánh Nến Cho 2 Người
                </h3>

                <div className="text-base sm:text-lg font-serif text-amber-300 font-bold tracking-tight my-0.5 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
                  500.000 VNĐ
                </div>

                {/* Voucher Code Box */}
                <div className="mt-1 flex items-center justify-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-black/60 border border-rose-500/30 font-mono text-[11px] sm:text-xs text-rose-200 font-bold tracking-wider">
                    Mã: SWEETLOVE142
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVoucher}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-200 text-[11px] sm:text-xs font-sans flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 font-medium">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-amber-300" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Complete Button & Points Confirmation */}
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-rose-500/20 pt-1.5">
                  <div className="flex items-center gap-1 text-[10.5px] font-sans text-amber-300 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                    <span>+560 Điểm Vào Ví</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onComplete(560)}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-sans font-bold text-[11px] tracking-wide uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Hoàn Tất ✨
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer Guidance */}
      <p className="text-[11px] sm:text-xs text-neutral-400 font-sans tracking-wide mt-2 sm:mt-3 text-center">
        {phase === 'sealed'
          ? 'Chạm vào phong thư niêm sáp đỏ để mở ra điều kỳ diệu.'
          : phase === 'breaking'
          ? 'Đang phá vỡ niêm sáp... Lời yêu đang hé lộ!'
          : 'Thư tình đã mở! Cơn mưa cánh hoa hồng đang trao gửi phần quà đến bạn!'}
      </p>
    </div>
  );
};
