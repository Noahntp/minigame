import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Trophy, Gift, History, Crown } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { sound } from '../../utils/audio';

export const Header: React.FC = () => {
  const location = useLocation();
  const { soundEnabled, toggleSound, userPoints } = useGameStore();
  const isGamePage = location.pathname.startsWith('/mini-games/') && location.pathname !== '/mini-games' && location.pathname !== '/mini-games/history';

  const handleSoundToggle = () => {
    sound.playClick(!soundEnabled);
    toggleSound();
  };

  const navItems = [
    { label: 'Sảnh Triển Lãm', path: '/mini-games', icon: Trophy },
    { label: 'Kho Quà Tặng', path: '/rewards', icon: Gift },
    { label: 'Nhật Ký Thưởng', path: '/mini-games/history', icon: History },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#06080d]/85 border-b border-[#d4af37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${isGamePage ? 'hidden md:block' : 'block'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand: Atelier Monogram */}
        <Link
          to="/mini-games"
          className="flex items-center gap-3 group focus:outline-none rounded-xl p-1"
          aria-label="Trang chủ Atelier Royale"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#121624] via-[#2a0612] to-[#0c0f17] border border-[#d4af37]/60 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:border-[#d4af37] transition-all">
            <Sparkles className="w-5 h-5 text-[#f5e6c8] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-editorial text-lg font-bold text-[#fcfbfa] tracking-wider leading-none group-hover:text-[#f5e6c8] transition-colors">
              ATELIER ROYALE
            </span>
            <span className="text-[9.5px] font-mono-num tracking-[0.2em] text-[#d4af37] font-semibold uppercase mt-1 leading-none">
              Haute Mini Game Pavilion
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/mini-games'
                ? location.pathname === '/mini-games' || location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-xs font-serif-editorial font-bold tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] shadow-[0_4px_20px_rgba(212,175,55,0.4)]'
                    : 'text-[#8b95a8] hover:text-[#f5e6c8] hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* VIP Balance & Sound Controls */}
        <div className="flex items-center gap-3">
          {/* User VIP Balance */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101420] border border-[#d4af37]/30 shadow-inner">
            <Crown className="w-4 h-4 text-[#d4af37]" />
            <div className="flex items-baseline gap-1 font-mono-num text-xs font-bold text-[#f5e6c8]">
              <span>{userPoints.toLocaleString('vi-VN')}</span>
              <span className="text-[10px] text-[#7b8496] font-normal">PTS</span>
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={handleSoundToggle}
            className="w-10 h-10 rounded-full bg-[#101420] border border-white/10 hover:border-[#d4af37]/50 flex items-center justify-center text-[#f5e6c8] transition-all hover:scale-105 active:scale-95 shadow-lg"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-label="Bật tắt âm thanh"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#7b8496]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
