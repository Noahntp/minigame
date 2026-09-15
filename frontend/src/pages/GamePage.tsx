import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { MINI_GAMES } from '../data/games';
import type { MiniGame } from '../types/game';
import { api } from '../services/api';
import { MiniGameShell } from '../components/shell/MiniGameShell';
import { GameStageRenderer } from '../components/games/GameStageRenderer';
import { Button } from '../components/common/Button';

export const GamePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<MiniGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;
    const found = MINI_GAMES.find((g) => g.slug === slug || g.id === slug);
    if (found) {
      setGame(found);
      setLoading(false);
    } else {
      api.getGameBySlug(slug).then((res) => {
        setGame(res || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center text-[#fcfbfa]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-serif-editorial text-sm font-bold text-[#f5e6c8]">Đang khởi tạo sân khấu hoàng gia...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-4 text-[#fcfbfa]">
        <div className="bg-[#101420] rounded-[20px] p-8 max-w-md text-center border border-[#d4af37]/30 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#121624] border border-[#d4af37] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-[#d4af37]" />
          </div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#fcfbfa] mb-2">
            Không Tìm Thấy Trò Chơi
          </h2>
          <p className="text-xs text-[#8b95a8] mb-6 font-sans">
            Mã trò chơi "{slug}" không tồn tại hoặc đã tạm ngưng phát hành.
          </p>
          <Button
            onClick={() => navigate('/mini-games')}
            className="bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold shadow-gold"
          >
            Trở Về Sảnh Triển Lãm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <MiniGameShell game={game}>
      {({ onCompleteGame, soundEnabled, sessionId }) => (
        <GameStageRenderer
          slug={game.slug}
          onCompleteGame={onCompleteGame}
          soundEnabled={soundEnabled}
          sessionId={sessionId}
        />
      )}
    </MiniGameShell>
  );
};
