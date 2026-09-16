import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, ShieldCheck, Crown, Cpu, Award } from 'lucide-react';
import { MINI_GAMES } from '../data/games';
import { GameCard } from '../components/games/GameCard';
import { GameVisualArt } from '../components/games/GameVisualArt';
import { EcomFunnelBar } from '../components/funnel/EcomFunnelBar';
import { api } from '../services/api';
import type { MiniGame } from '../types/game';

export const MiniGamesPage: React.FC = () => {
  const [games, setGames] = useState<MiniGame[]>(MINI_GAMES);
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');

  useEffect(() => {
    api.getGames().then((res) => {
      if (res && res.length) setGames(res);
    });
  }, []);

  const seasons = [
    { key: 'ALL', label: 'Tất Cả', count: 10 },
    { key: 'Valentine', label: 'Valentine', count: 2 },
    { key: 'Phái Đẹp', label: 'Phái Đẹp', count: 2 },
    { key: 'Giáng Sinh', label: 'Giáng Sinh', count: 3 },
    { key: 'Tết Cổ Truyền', label: 'Tết Hoàng Triều', count: 3 },
  ];

  const filteredGames =
    selectedSeason === 'ALL'
      ? games
      : games.filter((g) => g.season === selectedSeason);

  const featuredGame = games[0] || MINI_GAMES[0];

  return (
    <div className="min-h-screen bg-[#06080d] text-[#fcfbfa] pb-28 select-none">
      {/* 1. Haute Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Volumetric Radial Ambient Gold Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#d4af37]/15 via-[#831843]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Imperial Crest Monogram */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101420] border border-[#d4af37]/40 shadow-lg text-[#f5e6c8] text-xs font-mono-num font-semibold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ATELIER ROYALE • BỘ SƯU TẬP MINI GAME CAO CẤP</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fcfbfa] max-w-4xl mx-auto leading-[1.15]">
            Trải Nghiệm Chiến Dịch{' '}
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] bg-clip-text text-transparent">
              Quà Tặng Thượng Lưu
            </span>
          </h1>

          <p className="text-sm sm:text-base font-sans text-[#8b95a8] max-w-2xl mx-auto mt-6 mb-12 leading-relaxed">
            Bộ sưu tập 10 tuyệt phẩm mini game tương tác theo mùa — thiết kế chuẩn Haute Horlogerie,
            cơ chế rơi đa bảo ngọc Multi-Drop, xác thực C# Engine chống gian lận và tối ưu tỷ lệ thu thập
            SĐT chuyển đổi D2C.
          </p>

          {/* Key Metric Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { value: '100% SĐT', label: 'Thu Thập Zero-Party Data', icon: Crown, color: '#d4af37' },
              { value: 'Multi-Drop', label: 'Cơ Chế Rơi 1 - 3 Bảo Ngọc', icon: Award, color: '#f5e6c8' },
              { value: 'C# Engine', label: 'Bảo Chứng Chống Gian Lận', icon: Cpu, color: '#38bdf8' },
              { value: '1.000.000đ', label: 'Đặc Quyền Jackpot Hoàng Gia', icon: Sparkles, color: '#fbbf24' },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="p-5 rounded-[16px] bg-[#101420]/80 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col items-center justify-center text-center group"
                >
                  <Icon className="w-5 h-5 mb-2 transition-transform group-hover:scale-110" style={{ color: m.color }} />
                  <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#fcfbfa]">
                    {m.value}
                  </div>
                  <div className="text-[10px] font-mono-num text-[#7b8496] uppercase tracking-wider mt-1">
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5-Step E-Commerce D2C Conversion Funnel Bar */}
      <EcomFunnelBar />

      {/* 2. Featured Spotlight Exhibition Plaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="rounded-[20px] p-8 sm:p-12 bg-gradient-to-r from-[#101420] via-[#1a0812] to-[#101420] border border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Lore */}
          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f5e6c8] text-[10.5px] font-mono-num font-bold uppercase tracking-[0.2em] mb-4">
              <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>TIÊU ĐIỂM CHIẾN DỊCH HÔM NAY</span>
            </div>

            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#fcfbfa] mb-2 leading-tight">
              {featuredGame.name}
            </h2>
            <p className="text-xs sm:text-sm font-mono-num font-semibold text-[#d4af37] uppercase tracking-widest mb-4">
              {featuredGame.subtitle}
            </p>
            <p className="text-xs sm:text-sm font-sans text-[#8b95a8] leading-relaxed max-w-xl mb-8">
              {featuredGame.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              <Link
                to={`/mini-games/${featuredGame.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold text-sm tracking-wider shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Khám Phá Sân Khấu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2 text-xs font-mono-num text-[#8b95a8]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Bảo chứng chống gian lận</span>
              </div>
            </div>
          </div>

          {/* Right Artwork Display */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="relative p-6 rounded-full bg-gradient-to-b from-[#161c2e] to-[#0d1017] border-2 border-[#d4af37]/40 shadow-2xl">
              <GameVisualArt slug={featuredGame.slug} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Season Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {seasons.map((s) => {
            const isSelected = selectedSeason === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSelectedSeason(s.key)}
                className={`px-5 py-2 rounded-full text-xs font-serif-editorial font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-[#101420] text-[#8b95a8] border border-white/10 hover:border-[#d4af37]/40 hover:text-[#f5e6c8]'
                }`}
              >
                <span>{s.label}</span>
                <span
                  className={`text-[10px] font-mono-num px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#06080d]/20 text-[#06080d]' : 'bg-white/10 text-[#7b8496]'
                  }`}
                >
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. The 10 Bespoke Game Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredGames.map((game, idx) => (
            <GameCard key={game.slug} game={game} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
};
