import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { MiniGame } from '../../types/game';
import { GameVisualArt } from './GameVisualArt';

interface GameCardProps {
  game: MiniGame;
  index: number;
}

const SEASON_BADGE_STYLE: Record<string, { border: string; text: string; bg: string }> = {
  Valentine: { border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-950/40' },
  'Phái Đẹp': { border: 'border-purple-500/30', text: 'text-purple-300', bg: 'bg-purple-950/40' },
  'Giáng Sinh': { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-950/40' },
  'Tết Cổ Truyền': { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-950/40' },
};

export const GameCard: React.FC<GameCardProps> = ({ game, index }) => {
  const badge = SEASON_BADGE_STYLE[game.season] ?? {
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    bg: 'bg-amber-950/40',
  };

  const romanIndex = String(index + 1).padStart(2, '0');

  return (
    <div className="group relative flex flex-col justify-between bg-[#101420]/90 rounded-[16px] p-6 border border-[#d4af37]/20 hover:border-[#d4af37]/70 transition-all duration-300 overflow-hidden hover:-translate-y-1.5 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.25)] backdrop-blur-xl">
      {/* Gold Filigree Inner Hairline Accent */}
      <div className="absolute inset-2 rounded-[12px] border border-white/[0.04] pointer-events-none group-hover:border-[#d4af37]/20 transition-colors" />

      {/* Top Header: Roman Number + Seasonal Badge */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono-num text-xs font-bold text-[#d4af37] tracking-widest">
            N° {romanIndex}
          </span>
          <span
            className={`text-[10px] font-mono-num font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badge.bg} ${badge.border} ${badge.text}`}
          >
            {game.season}
          </span>
        </div>

        {/* Centerpiece Artwork Display */}
        <div className="flex items-center justify-center my-5 py-3 relative">
          {/* Subtle Ambient Spotlight behind artwork */}
          <div className="absolute w-28 h-28 rounded-full bg-[#d4af37]/10 blur-xl group-hover:bg-[#d4af37]/20 transition-all duration-500 pointer-events-none" />
          <div className="transform group-hover:scale-110 transition-transform duration-500 ease-out relative z-10">
            <GameVisualArt slug={game.slug} size="md" />
          </div>
        </div>

        {/* Typography Block */}
        <div className="text-center mb-3">
          <h3 className="font-serif-editorial text-lg font-bold text-[#fcfbfa] group-hover:text-[#f5e6c8] transition-colors tracking-wide">
            {game.name}
          </h3>
          <p className="text-[10.5px] font-mono-num font-semibold uppercase tracking-wider text-[#d4af37] mt-1 line-clamp-1">
            {game.subtitle}
          </p>
        </div>

        <p className="text-xs font-sans text-[#8b95a8] leading-relaxed line-clamp-2 text-center px-1 mb-6">
          {game.description}
        </p>
      </div>

      {/* Footer Area: Quota & Action */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-mono-num text-[#8b95a8]">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{game.playLimitPerDay} lượt / ngày</span>
        </div>

        <Link
          to={`/mini-games/${game.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-serif-editorial font-bold text-[#06080d] bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] px-4 py-1.5 rounded-full shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.5)] transition-all group/btn"
          aria-label={`Trải nghiệm ${game.name}`}
        >
          <span>Khám Phá</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
