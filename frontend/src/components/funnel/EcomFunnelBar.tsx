import React, { useState } from 'react';
import {
  ShoppingBag,
  QrCode,
  Gamepad2,
  Gift,
  Store,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { QrOrderSimulatorModal } from './QrOrderSimulatorModal';
import { BrandStoreCheckoutModal } from './BrandStoreCheckoutModal';
import { sound } from '../../utils/audio';
import { useGameStore } from '../../store/useGameStore';

export const EcomFunnelBar: React.FC = () => {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showBrandStoreModal, setShowBrandStoreModal] = useState<boolean>(false);

  const steps = [
    {
      step: 1,
      title: 'MUA HÀNG TRÊN SÀN',
      desc: 'Shopee • Lazada • TikTok • Tiki',
      icon: ShoppingBag,
      color: '#f97316',
      badge: 'Đơn Hàng',
    },
    {
      step: 2,
      title: 'QUÉT MÃ QR',
      desc: 'Trên thiệp / tem gói hàng',
      icon: QrCode,
      color: '#06b6d4',
      badge: 'Camera',
    },
    {
      step: 3,
      title: 'CHƠI MINI GAME',
      desc: '3 - 5 giây, trúng quà 100%',
      icon: Gamepad2,
      color: '#d4af37',
      badge: 'Trải Nghiệm',
    },
    {
      step: 4,
      title: 'NHẬN VOUCHER',
      desc: 'Giảm 50k - 500k tức thì',
      icon: Gift,
      color: '#ec4899',
      badge: 'Ưu Đãi',
    },
    {
      step: 5,
      title: 'MUA LẠI TRÊN WEBSITE',
      desc: 'Áp dụng tại BrandStore.vn',
      icon: Store,
      color: '#10b981',
      badge: 'D2C Retention',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-8 sm:mb-12">
      <div className="rounded-[22px] sm:rounded-[26px] p-4 sm:p-6 bg-gradient-to-r from-[#0d1017] via-[#141926] to-[#0d1017] border border-[#d4af37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Interactive Trigger */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-5 border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#f5e6c8] text-[#06080d] flex items-center justify-center font-bold text-sm shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-editorial font-bold text-base sm:text-lg text-[#fcfbfa]">
                  Luồng Chuyển Đổi Khách Hàng E-Commerce D2C
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-mono-num font-bold text-[#d4af37] px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40">
                  5 BƯỚC CHUẨN OMNI-CHANNEL
                </span>
              </div>
              <p className="text-xs text-[#8b95a8] mt-0.5 font-sans">
                Từ đơn hàng trên Sàn TMĐT ➔ Quét QR trong bưu kiện ➔ Nhận Voucher ➔ Kéo khách mua lại tại Website
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                sound.playClick(soundEnabled);
                setShowQrModal(true);
              }}
              className="flex-1 md:flex-none px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] text-xs font-serif-editorial font-bold shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mô Phỏng Quét QR Từ Gói Hàng</span>
            </button>

            <button
              onClick={() => {
                sound.playClick(soundEnabled);
                setShowBrandStoreModal(true);
              }}
              className="px-3.5 py-2 rounded-full bg-[#121624] border border-[#d4af37]/30 text-[#f5e6c8] text-xs font-mono-num font-semibold hover:border-[#d4af37] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              title="Xem demo màn hình mua lại trên Website BrandStore.vn"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Demo Website Đích</span>
            </button>
          </div>
        </div>

        {/* 5-Step Visual Progression Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative group p-3 sm:p-3.5 rounded-[16px] bg-[#101420]/90 border border-white/[0.08] hover:border-[#d4af37]/50 transition-all duration-300 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-3 sm:gap-2 shadow-inner hover:shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className="w-6 h-6 rounded-full text-white font-mono-num font-bold text-xs flex items-center justify-center shadow"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.step}
                  </span>
                  <span className="text-[9px] font-mono-num font-bold text-[#7b8496] uppercase px-1.5 py-0.5 rounded bg-white/[0.05]">
                    {s.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 sm:w-full">
                  <div className="flex items-center gap-1.5 sm:mt-1">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
                    <h4 className="font-serif-editorial font-bold text-xs text-[#fcfbfa] group-hover:text-[#f5e6c8] transition-colors line-clamp-1">
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-[#8b95a8] mt-0.5 font-sans line-clamp-1 sm:line-clamp-2">
                    {s.desc}
                  </p>
                </div>

                {/* Arrow Connector for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-[#d4af37]/40 pointer-events-none">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <QrOrderSimulatorModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />

      <BrandStoreCheckoutModal
        isOpen={showBrandStoreModal}
        onClose={() => setShowBrandStoreModal(false)}
      />
    </div>
  );
};
