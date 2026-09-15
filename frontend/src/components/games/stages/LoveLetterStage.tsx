import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Award, Check } from 'lucide-react';
import { sound } from '../../../utils/audio';

interface LoveLetterStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  scale: number;
  color: string;
  delay: number;
  duration: number;
}

export const LoveLetterStage: React.FC<LoveLetterStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'opening' | 'open'>('sealed');
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [voucherRevealed, setVoucherRevealed] = useState<boolean>(false);

  const handleOpenLetter = () => {
    if (envelopeState !== 'sealed') return;
    sound.playClick(soundEnabled);
    track('ENVELOPE_OPEN', 1);
    setEnvelopeState('opening');

    // 1. Thư mở nắp 3D
    setTimeout(() => {
      setEnvelopeState('open');
      sound.playReward(soundEnabled);

      // 2. Hiệu ứng suối tim bay lên (20 floating heart particles)
      const heartColors = ['#F43F5E', '#FDA4AF', '#FB7185', '#F59E0B', '#E11D48'];
      const generatedHearts: FloatingHeart[] = Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 220,
        scale: 0.6 + Math.random() * 0.8,
        color: heartColors[i % heartColors.length],
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 0.8,
      }));
      setHearts(generatedHearts);
      track('HEART_BURST', generatedHearts.length);

      // 3. Nhận voucher
      setTimeout(() => {
        setVoucherRevealed(true);
        sound.playWin(soundEnabled);

        setTimeout(() => {
          onComplete(560);
        }, 1800);
      }, 1000);
    }, 600);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-3 sm:py-6 px-2 sm:px-4 touch-none">
      {/* Valentine Header */}
      <div className="text-center mb-3 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-rose-500/10 border border-rose-500/25 mb-1.5 sm:mb-2 backdrop-blur-md">
          <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-rose-400 fill-rose-400" />
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-rose-300 font-semibold">
            Bức Thư Tình Hoàng Gia
          </span>
        </div>
        <h2 className="font-serif text-xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Mở Thư Tình Nhận Voucher
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-400 font-light mt-0.5 sm:mt-1">
          Bấm vào phong thư niêm sáp đỏ — Nắp thư mở, tim bay ngập tràn trao voucher hẹn hò
        </p>
      </div>

      {/* Love Letter Chamber Stage */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#140b10]/95 via-[#0d070b]/95 to-[#060405]/98 border border-rose-500/20 p-4 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center min-h-[320px] sm:min-h-[420px]">
        {/* Soft Ambient Rose & Golden Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/10 via-amber-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />

        {/* 1. SUỐI PHUN TIM PHÁT SÁNG (HIỆU ỨNG TIM) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ y: 20, x: 0, opacity: 0, scale: 0 }}
              animate={{
                y: -240 - Math.random() * 80,
                x: h.x,
                opacity: [0, 1, 1, 0],
                scale: [0, h.scale, h.scale * 1.1, 0],
              }}
              transition={{
                duration: h.duration,
                delay: h.delay,
                ease: 'easeOut',
              }}
              className="absolute"
            >
              <Heart
                className="drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
                style={{
                  width: `${24 * h.scale}px`,
                  height: `${24 * h.scale}px`,
                  color: h.color,
                  fill: h.color,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* 2. THE 3D ENVELOPE ARTIFACT */}
        <div
          onPointerDown={handleOpenLetter}
          onClick={handleOpenLetter}
          className="relative z-10 w-72 sm:w-96 cursor-pointer flex flex-col items-center group touch-none"
        >
          {/* Letter parchment sliding out */}
          <motion.div
            animate={{
              y: envelopeState === 'open' ? -90 : 0,
              scale: envelopeState === 'open' ? 1.05 : 0.95,
              opacity: envelopeState === 'open' ? 1 : 0.6,
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute z-0 w-[92%] h-44 rounded-lg bg-gradient-to-b from-[#FFFDF5] to-[#F7EED8] p-4 shadow-xl border border-amber-300/60 flex flex-col items-center justify-center text-center"
          >
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-1">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
            <h4 className="font-serif text-sm font-semibold text-neutral-900 tracking-wide">
              Lời Thề Nguyện Vĩnh Cửu
            </h4>
            <p className="text-[10.5px] font-sans text-neutral-600 italic mt-0.5 line-clamp-2 px-2">
              "Trăm năm một chữ đồng tâm, lộc biếc đơm hoa, viên mãn ái tình."
            </p>
          </motion.div>

          {/* Envelope Body (Antique Parchment & Gold Borders) */}
          <div className="relative z-10 w-full h-56 rounded-xl bg-gradient-to-b from-[#2a1721] via-[#1a0f15] to-[#120a0e] border border-rose-400/40 shadow-2xl overflow-hidden flex flex-col justify-end p-4">
            {/* Inner Silk Lining SVG */}
            <svg viewBox="0 0 400 240" className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="envelopeInner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4c1d35" />
                  <stop offset="100%" stopColor="#250e1a" />
                </linearGradient>
              </defs>
              {/* V-fold side flaps */}
              <polygon points="0,0 200,130 0,240" fill="#200d17" />
              <polygon points="400,0 200,130 400,240" fill="#200d17" />
              {/* Bottom flap */}
              <polygon points="0,240 200,110 400,240" fill="url(#envelopeInner)" stroke="#f43f5e" strokeOpacity="0.3" strokeWidth="1.5" />
            </svg>

            {/* Top Flap (Rotates open in 3D) */}
            <motion.div
              style={{ transformOrigin: 'top center', perspective: 1000 }}
              animate={{
                rotateX: envelopeState === 'open' ? -180 : 0,
                zIndex: envelopeState === 'open' ? 0 : 20,
              }}
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
            >
              <svg viewBox="0 0 400 120" className="w-full h-full drop-shadow-md">
                <polygon
                  points="0,0 200,115 400,0"
                  fill="#361525"
                  stroke="#fda4af"
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                />
                <line x1="20" y1="6" x2="195" y2="105" stroke="#f43f5e" strokeOpacity="0.4" strokeWidth="1" />
                <line x1="380" y1="6" x2="205" y2="105" stroke="#f43f5e" strokeOpacity="0.4" strokeWidth="1" />
              </svg>
            </motion.div>

            {/* Ruby Wax Seal (Tap Trigger) */}
            {envelopeState === 'sealed' && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto"
              >
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#881337] shadow-[0_0_20px_rgba(225,29,72,0.6)] flex items-center justify-center border-2 border-amber-300/70">
                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-200/50" />
                  <Heart className="w-7 h-7 text-amber-200 fill-amber-200 group-hover:scale-110 transition-transform" />
                </div>
                <span className="mt-2 text-[10px] font-sans font-bold uppercase tracking-widest text-amber-200 bg-black/60 px-3 py-0.5 rounded-full border border-amber-400/30 whitespace-nowrap">
                  Chạm Để Mở Thư
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* 3. NHẬN VOUCHER BANNER */}
        <AnimatePresence>
          {voucherRevealed && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="relative z-30 mt-8 mx-auto w-full max-w-md p-4 rounded-xl bg-gradient-to-r from-rose-950/85 via-neutral-900/90 to-rose-950/85 border border-rose-400/50 shadow-[0_10px_30px_rgba(244,63,94,0.25)] text-center backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-400/20 text-rose-300 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5 text-rose-400" />
                <span>Nhận Voucher Tình Yêu</span>
              </div>
              <h3 className="font-serif text-lg text-rose-200 font-normal">
                Voucher Tiệc Tối Ánh Nến Lãng Mạn
              </h3>
              <p className="text-xl font-serif text-white font-semibold mt-0.5">
                500.000 VNĐ
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-sans text-amber-300 font-medium">
                <Check className="w-4 h-4" />
                <span>+560 Điểm Duyên Lành</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Guidance */}
      <p className="text-xs text-neutral-400 font-sans tracking-wide mt-5 text-center">
        {envelopeState === 'sealed'
          ? 'Bấm vào phong thư niêm sáp để mở ra điều kỳ diệu.'
          : 'Thư tình đã mở — Cơn mưa trái tim đang trao gửi voucher đến bạn!'}
      </p>
    </div>
  );
};
