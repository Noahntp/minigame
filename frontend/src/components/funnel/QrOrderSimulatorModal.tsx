import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  QrCode,
  Package,
  ShieldCheck,
  ArrowRight,
  Store,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useGameStore } from '../../store/useGameStore';

interface QrOrderSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGameSlug?: string;
}

export const QrOrderSimulatorModal: React.FC<QrOrderSimulatorModalProps> = ({
  isOpen,
  onClose,
  targetGameSlug = 'trai-tim-may-man',
}) => {
  const navigate = useNavigate();
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const [platform, setPlatform] = useState<'shopee' | 'tiktok' | 'lazada' | 'tiki'>('shopee');
  const [orderCode, setOrderCode] = useState<string>('SPX-VN-88421');
  const [verified, setVerified] = useState<boolean>(false);

  const platforms = [
    { id: 'shopee', name: 'Shopee Mall', color: '#ee4d2d', sampleOrder: 'SPX-VN-88421', logo: '🧡' },
    { id: 'tiktok', name: 'TikTok Shop', color: '#000000', sampleOrder: 'TTS-VN-55219', logo: '🎵' },
    { id: 'lazada', name: 'Lazada LazMall', color: '#0f146d', sampleOrder: 'LEX-VN-77102', logo: '💙' },
    { id: 'tiki', name: 'Tiki Trading', color: '#1a94ff', sampleOrder: 'TIKI-VN-33901', logo: '⚡' },
  ];

  const handleSelectPlatform = (p: typeof platforms[0]) => {
    sound.playClick(soundEnabled);
    setPlatform(p.id as any);
    setOrderCode(p.sampleOrder);
    setVerified(false);
  };

  const handleScanQR = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWin(soundEnabled);
    setVerified(true);
    setTimeout(() => {
      onClose();
      // Navigate to game with query params indicating order & shop verification
      navigate(`/mini-games/${targetGameSlug}?shop=${platform}&order=${encodeURIComponent(orderCode)}&autoStart=true`);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#0d1017] text-[#fcfbfa] rounded-[24px] shadow-2xl overflow-hidden border border-[#d4af37]/40 my-auto"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#121624] via-[#1a0812] to-[#121624] border-b border-[#d4af37]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-[#f5e6c8]">
                <QrCode className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="font-serif-editorial font-bold text-sm sm:text-base text-[#fcfbfa]">
                  Mô Phỏng Quét QR Từ Gói Hàng Sàn TMĐT
                </h3>
                <p className="text-[10px] font-mono-num text-[#d4af37]">
                  BƯỚC 1 & BƯỚC 2: MUA HÀNG TRÊN SÀN ➔ QUÉT MÃ QR
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#8b95a8] hover:text-[#fcfbfa] hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* Step 1: Pick Platform */}
            <div>
              <label className="text-xs font-serif-editorial font-bold text-[#f5e6c8] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#d4af37]" />
                <span>1. Chọn Sàn TMĐT Bạn Đã Mua Hàng</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {platforms.map((p) => {
                  const active = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPlatform(p)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        active
                          ? 'bg-[#101420] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.02]'
                          : 'bg-[#121624]/60 border-white/10 hover:border-white/25 opacity-75'
                      }`}
                    >
                      <span className="text-xl">{p.logo}</span>
                      <span className="text-xs font-bold text-[#fcfbfa]">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Realistic Delivery Box & Thank You Card with QR */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#181d2a] to-[#10131d] border border-white/10 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Parcel Box Mockup */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-800/50 via-amber-900/40 to-amber-950/80 border border-amber-500/40 flex flex-col items-center justify-center p-2 text-center shadow-lg relative flex-shrink-0">
                  <Package className="w-7 h-7 text-amber-300 mb-1" />
                  <span className="text-[9px] font-mono-num font-bold text-amber-200 uppercase tracking-tighter">
                    Gói Hàng Shopee
                  </span>
                  <span className="text-[8px] text-amber-400/80">Tem niêm phong OK</span>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow">
                    ✓
                  </div>
                </div>

                {/* Thank You Card with Live QR Graphic */}
                <div className="flex-1 w-full bg-gradient-to-tr from-[#fdfbf7] to-[#faedd0] text-[#2d2218] p-3.5 rounded-xl border-2 border-[#d4af37] shadow-xl relative">
                  <div className="flex items-center justify-between border-b border-amber-900/15 pb-1.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">❤️</span>
                      <span className="font-serif-editorial font-bold text-xs uppercase tracking-wider text-amber-950">
                        Thank You For Shopping!
                      </span>
                    </div>
                    <span className="text-[9px] font-mono-num font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                      Quà Tri Ân 100%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* QR Code Canvas Mockup */}
                    <div className="w-16 h-16 bg-white p-1 rounded-lg border border-amber-300 shadow-inner flex flex-col items-center justify-center relative flex-shrink-0">
                      <QrCode className="w-full h-full text-slate-900" />
                      <div className="absolute inset-0 m-auto w-4 h-4 rounded bg-red-600 flex items-center justify-center text-[8px] text-white font-bold">
                        🎁
                      </div>
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-serif-editorial font-bold text-amber-950 text-xs sm:text-sm leading-tight">
                        Quét Mã QR Nhận Quà Đặc Biệt
                      </p>
                      <p className="text-[10px] text-amber-900/80 mt-0.5 font-sans">
                        Chạm mở hộp quà & nhận voucher giảm đến <strong>500.000đ</strong> tại Website chính hãng!
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Đơn: {orderCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Order Form */}
            <form onSubmit={handleScanQR} className="space-y-3">
              <div>
                <label className="text-xs font-serif-editorial font-bold text-[#f5e6c8] uppercase tracking-wider block mb-1">
                  2. Mã Đơn Hàng Trên Gói Hàng (Shopee / TikTok)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    required
                    placeholder="Nhập mã đơn hàng (ví dụ: SPX-VN-88421)"
                    className="w-full px-4 py-3 rounded-xl bg-[#06080d] border border-[#d4af37]/40 text-sm font-mono-num text-[#fcfbfa] placeholder-[#7b8496] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  />
                  <div className="absolute right-3 top-3 text-[11px] font-mono-num font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Mã Hợp Lệ</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#101420] border border-white/10 text-xs text-[#8b95a8] flex items-center gap-2 font-sans">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>
                  Hệ thống Multi-tenant tự động phân luồng đúng Shop <strong>{platform.toUpperCase()}</strong>, chỉ cấp 1 lượt chơi duy nhất cho mã đơn này để chống gian lận.
                </span>
              </div>

              <button
                type="submit"
                disabled={verified}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {verified ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                    <span>Xác Nhận Thành Công! Đang Vào Game...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    <span>Mô Phỏng Quét QR & Chơi Mini Game Ngay (Bước 3)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
