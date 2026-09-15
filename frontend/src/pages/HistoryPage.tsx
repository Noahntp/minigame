import React, { useState, useEffect } from 'react';
import { History, Trophy, Gift, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { GamePlayHistory } from '../types/game';
import { Button } from '../components/common/Button';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<GamePlayHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getHistory().then((res) => {
      setHistory(res || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#06080d] text-[#fcfbfa] pb-28 select-none">
      {/* 1. Page Header */}
      <section className="pt-14 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-[#d4af37]/15 via-[#831843]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101420] border border-[#d4af37]/40 text-[#f5e6c8] text-xs font-mono-num font-semibold uppercase tracking-[0.2em] mb-4">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>NHẬT KÝ HOẠT ĐỘNG CHÍNH THỨC</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl font-bold text-[#fcfbfa] mb-4">
            Nhật Ký Lịch Sử Chơi Game
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#8b95a8] max-w-xl mx-auto leading-relaxed">
            Theo dõi hành trình tích lũy điểm số, các lượt chơi đã xác thực chữ ký số C# Engine
            và quà tặng đã nhận được.
          </p>
        </div>
      </section>

      {/* 2. History Table / List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {loading ? (
          <div className="text-center py-16 text-[#d4af37]">
            <div className="animate-spin h-8 w-8 border-4 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="font-mono-num text-xs font-bold text-[#f5e6c8]">Đang tải dữ liệu lịch sử...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-[#101420]/80 rounded-[20px] p-12 border border-[#d4af37]/30 shadow-2xl text-center max-w-md mx-auto">
            <History className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-4" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#fcfbfa] mb-1">
              Chưa có lượt chơi nào
            </h3>
            <p className="text-xs text-[#8b95a8] mb-6 font-sans">
              Bạn chưa tham gia mini game nào trong phiên này. Hãy bắt đầu ngay để ghi danh!
            </p>
            <Link to="/mini-games">
              <Button size="md" className="bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold shadow-gold">
                <span>Khám Phá Trò Chơi</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#101420]/90 rounded-[16px] border border-[#d4af37]/30 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#161c2e] font-mono-num uppercase tracking-wider text-[#d4af37] border-b border-white/10">
                    <th className="py-4 px-6">Trò Chơi</th>
                    <th className="py-4 px-6 text-center">Điểm Số</th>
                    <th className="py-4 px-6">Phần Thưởng</th>
                    <th className="py-4 px-6 text-center">Xác Thực</th>
                    <th className="py-4 px-6 text-right">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {history.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6 font-serif-editorial font-bold text-[#fcfbfa]">
                        <div className="flex items-center gap-2.5">
                          <Trophy className="w-4 h-4 text-[#d4af37]" />
                          <span>{item.gameName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-mono-num font-bold text-[#fbbf24] text-sm">
                        {item.score.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        {item.rewardSummary ? (
                          <div className="flex items-center gap-1.5 font-sans font-medium text-[#f5e6c8]">
                            <Gift className="w-3.5 h-3.5 text-[#f43f5e]" />
                            <span>{item.rewardSummary}</span>
                          </div>
                        ) : (
                          <span className="text-[#7b8496] font-mono-num">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-num font-semibold text-[#34d399] bg-[#064e3b]/30 border border-[#059669]/40">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Đã Ký Số</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono-num text-[#7b8496]">
                        {new Date(item.playedAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' • '}
                        {new Date(item.playedAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
