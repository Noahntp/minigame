import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isGamePage =
    location.pathname.startsWith('/mini-games/') &&
    location.pathname !== '/mini-games' &&
    location.pathname !== '/mini-games/history';

  if (isGamePage) return null;

  return (
    <footer className="w-full border-t border-[#d4af37]/20 bg-[#06080d] text-[#8b95a8] py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#121624] via-[#2a0612] to-[#0c0f17] border border-[#d4af37]/50 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-[#f5e6c8]" />
          </div>
          <div className="text-center md:text-left">
            <span className="font-serif-editorial text-[#fcfbfa] font-bold text-base block tracking-wider">
              ATELIER ROYALE
            </span>
            <p className="text-xs text-[#7b8496] max-w-sm leading-relaxed mt-0.5">
              Nền tảng mini game chiến dịch cao cấp, bảo chứng xác thực server-side minh bạch.
            </p>
          </div>
        </div>

        {/* Security & Engine Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono-num text-[#8b95a8]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>Anti-Cheat Validated</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#38bdf8]" />
            <span>C# Microservice RNG</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            <span>Multi-Drop Certified</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right text-[11px] font-mono-num text-[#4e586e]">
          <p>© 2026 Atelier Royale Pavilion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
