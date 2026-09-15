import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Sparkles, Tag, ShieldCheck, ArrowRight, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { api } from '../services/api';
import type { Reward } from '../types/game';
import { Button } from '../components/common/Button';

export const RewardsPage: React.FC = () => {
  const { wonVouchers, userPoints } = useGameStore();
  const [catalog, setCatalog] = useState<Reward[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    api.getRewards().then((res) => {
      if (res && res.length) setCatalog(res);
    });
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-[#fcfbfa] pb-28 select-none">
      {/* 1. Page Header */}
      <section className="pt-14 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-[#d4af37]/15 via-[#831843]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101420] border border-[#d4af37]/40 text-[#f5e6c8] text-xs font-mono-num font-semibold uppercase tracking-[0.2em] mb-4">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>KHO QUÀ ĐẶC QUYỀN VIP</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl font-bold text-[#fcfbfa] mb-4">
            Kho Quà &amp; Voucher Thượng Lưu
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#8b95a8] max-w-xl mx-auto leading-relaxed">
            Nơi lưu giữ các phần quà, mã voucher ưu đãi độc quyền và điểm tích lũy bạn đã sở hữu
            từ các mini game trong hệ thống.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#101420] border border-[#d4af37]/30 shadow-lg mt-6">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm font-mono-num font-bold text-[#f5e6c8]">
              Tổng điểm tích lũy: {userPoints.toLocaleString('vi-VN')} PTS
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* 2. My Won Vouchers Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif-editorial text-2xl font-bold text-[#fcfbfa] flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#d4af37]" />
                <span>Ví Voucher Của Bạn ({wonVouchers.length})</span>
              </h2>
              <p className="text-xs text-[#7b8496] mt-0.5 font-sans">
                Các mã voucher bạn đã nhận được trong phiên chơi hiện tại
              </p>
            </div>
          </div>

          {wonVouchers.length === 0 ? (
            <div className="bg-[#101420]/80 rounded-[20px] p-12 border border-[#d4af37]/30 shadow-2xl text-center max-w-md mx-auto">
              <Gift className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-4" />
              <h3 className="font-serif-editorial text-lg font-bold text-[#fcfbfa] mb-1">
                Ví của bạn đang trống
              </h3>
              <p className="text-xs text-[#8b95a8] mb-6 font-sans">
                Hãy tham gia các mini game cao cấp để sở hữu voucher giá trị ngay hôm nay!
              </p>
              <Link to="/mini-games">
                <Button size="md" className="bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold shadow-gold">
                  <span>Khám Phá Game Ngay</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wonVouchers.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#101420] rounded-[16px] p-6 border border-[#d4af37]/30 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono-num font-bold text-[#d4af37] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40">
                      {v.type}
                    </span>
                    <span className="text-[11px] text-[#34d399] font-mono-num font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Hợp lệ</span>
                    </span>
                  </div>

                  <h4 className="font-serif-editorial text-lg font-bold text-[#fcfbfa] mb-1">{v.name}</h4>
                  <p className="text-xs text-[#8b95a8] mb-4 font-sans">{v.description}</p>

                  <div className="p-3.5 rounded-[12px] bg-[#06080d] border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-[#7b8496] font-mono-num font-bold">
                        MÃ VOUCHER
                      </div>
                      <div className="font-mono-num text-sm font-bold text-[#f5e6c8] tracking-widest mt-0.5">
                        {v.code}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(v.code)}
                      className="p-2 rounded-full bg-[#121624] border border-[#d4af37]/40 text-[#d4af37] hover:border-[#d4af37] transition-all hover:scale-105"
                      title="Sao chép mã"
                    >
                      {copiedCode === v.code ? (
                        <Check className="w-4 h-4 text-[#34d399]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Rewards Catalog Section */}
        <section>
          <div className="mb-6">
            <h2 className="font-serif-editorial text-2xl font-bold text-[#fcfbfa] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#d4af37]" />
              <span>Danh Mục Giải Thưởng Thượng Hạng</span>
            </h2>
            <p className="text-xs text-[#7b8496] mt-0.5 font-sans">
              Cơ cấu phần thưởng được phân bổ ngẫu nhiên có kiểm soát từ máy chủ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalog.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#101420]/80 rounded-[16px] p-5 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 shadow-lg flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono-num text-xs text-[#d4af37] font-bold">
                      № {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f5e6c8]">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="font-serif-editorial text-base font-bold text-[#fcfbfa] mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#8b95a8] leading-relaxed mb-4 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-[#7b8496] font-mono-num">Trị giá:</span>
                  <span className="font-mono-num font-bold text-[#fbbf24]">
                    {item.value.toLocaleString('vi-VN')} {item.type === 'POINT' ? 'PTS' : 'VNĐ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
