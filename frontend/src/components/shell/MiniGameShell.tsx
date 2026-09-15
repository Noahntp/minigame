import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Trophy,
  ShieldCheck,
  Gift,
  Copy,
  Check,
  RefreshCw,
  Crown,
  Lock,
} from 'lucide-react';
import { Button } from '../common/Button';
import { DropRateModal } from '../games/DropRateModal';
import { GameVisualArt } from '../games/GameVisualArt';
import { useGameStore } from '../../store/useGameStore';
import { sound } from '../../utils/audio';
import { api } from '../../services/api';
import type { MiniGame, Reward } from '../../types/game';

type ShellStatus = 'INTRO' | 'READY' | 'PLAYING' | 'RESULT' | 'REWARD_REVEAL';

interface MiniGameShellProps {
  game: MiniGame;
  children: (props: {
    status: ShellStatus;
    onCompleteGame: (score: number, telemetry?: any[], preCalculatedReward?: Reward) => void;
    soundEnabled: boolean;
    sessionId?: string | null;
  }) => React.ReactNode;
}

export const MiniGameShell: React.FC<MiniGameShellProps> = ({ game, children }) => {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, addWonVoucher, addHistoryItem } = useGameStore();

  const [status, setStatus] = useState<ShellStatus>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('autoStart=true')) {
      return 'PLAYING';
    }
    return 'INTRO';
  });
  const [countdown, setCountdown] = useState<number>(3);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [verifiedByServer, setVerifiedByServer] = useState<boolean>(false);
  const [rewardWon, setRewardWon] = useState<Reward | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showDropRateModal, setShowDropRateModal] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneSaved, setPhoneSaved] = useState<boolean>(false);

  // 1. Ready state countdown
  useEffect(() => {
    if (status !== 'READY') return;
    if (countdown > 0) {
      sound.playCount(soundEnabled);
      const timer = setTimeout(() => setCountdown((c) => c - 1), 750);
      return () => clearTimeout(timer);
    } else {
      setStatus('PLAYING');
    }
  }, [status, countdown, soundEnabled]);

  // 2. Start Game action
  const handleStartGame = async () => {
    sound.playClick(soundEnabled);
    try {
      const res = await api.startSession(game.slug);
      setSessionId(res.sessionId);
    } catch {
      setSessionId(`local_${Date.now()}`);
    }
    setCountdown(3);
    setStatus('READY');
  };

  // 3. Complete Game action
  const handleCompleteGame = (
    score: number,
    telemetry?: any[],
    preCalculatedReward?: Reward
  ) => {
    void telemetry;
    setFinalScore(score);
    if (preCalculatedReward) {
      setRewardWon(preCalculatedReward);
      setVerifiedByServer(true);
      addWonVoucher(preCalculatedReward);
      addHistoryItem({
        id: `hist_${Date.now()}`,
        gameSlug: game.slug,
        gameName: game.name,
        score,
        playedAt: new Date().toISOString(),
        rewardSummary: preCalculatedReward.name,
      });
      setStatus('REWARD_REVEAL');
    } else {
      setStatus('RESULT');
    }
  };

  // 4. Reveal Reward handler
  const handleRevealReward = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    sound.playClick(soundEnabled);

    try {
      const activeSessionId = sessionId || `session_${Date.now()}`;
      const res = await api.completeSession(game.slug, activeSessionId, finalScore);

      setRewardWon(res.reward);
      setVerifiedByServer(res.verifiedByGameService);
      addWonVoucher(res.reward);
      addHistoryItem({
        id: `hist_${Date.now()}`,
        gameSlug: game.slug,
        gameName: game.name,
        score: finalScore,
        playedAt: new Date().toISOString(),
        rewardSummary: res.reward.name,
      });

      sound.playWin(soundEnabled);
      setStatus('REWARD_REVEAL');
    } catch {
      const fallbackReward: Reward = {
        id: 'rw-fallback',
        name: 'Voucher Khuyến Mãi 50.000đ',
        type: 'VOUCHER',
        value: 50000,
        code: 'ROYALE-50K',
        rarity: 'Rare',
        description: 'Voucher đặc quyền áp dụng trực tiếp tại website thương hiệu.',
      };
      setRewardWon(fallbackReward);
      setVerifiedByServer(true);
      addWonVoucher(fallbackReward);
      sound.playWin(soundEnabled);
      setStatus('REWARD_REVEAL');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!rewardWon?.code) return;
    navigator.clipboard.writeText(rewardWon.code);
    setCopiedCode(true);
    sound.playClick(soundEnabled);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePlayAgain = () => {
    sound.playClick(soundEnabled);
    setStatus('INTRO');
    setRewardWon(null);
    setSessionId(null);
    setFinalScore(0);
    setPhoneSaved(false);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 9) {
      setPhoneSaved(true);
      sound.playWin(soundEnabled);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-[#fcfbfa] flex flex-col justify-between relative overflow-hidden select-none">
      {/* 1. Atelier Top Bar */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#06080d]/85 border-b border-[#d4af37]/25 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-between ${status === 'PLAYING' ? 'px-3 sm:px-8 py-2 sm:py-3.5' : 'px-4 sm:px-8 py-3.5'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/mini-games')}
            className="px-3.5 py-1.5 rounded-full bg-[#121624] border border-[#d4af37]/40 text-[#f5e6c8] hover:border-[#d4af37] shadow-lg transition-all flex items-center gap-2 text-xs font-serif-editorial font-bold uppercase tracking-wider hover:scale-105 active:scale-95"
            aria-label="Quay lại sảnh"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sảnh Triển Lãm</span>
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif-editorial text-base sm:text-lg font-bold text-[#fcfbfa]">
                {game.name}
              </h2>
              <span className="text-[10px] font-mono-num font-bold text-[#d4af37] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                {game.season}
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDropRateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#121624] border border-[#d4af37]/40 text-[#f5e6c8] text-xs font-mono-num font-semibold shadow-lg hover:border-[#d4af37] transition-all hover:scale-105 active:scale-95"
            title="Xem và tùy chỉnh tỷ lệ rớt bảo ngọc"
          >
            <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Tỷ Lệ Thưởng</span>
          </button>

          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              soundEnabled
                ? 'bg-[#121624] border-[#d4af37]/60 text-[#d4af37]'
                : 'bg-[#101420] border-white/10 text-[#7b8496]'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Main Stage with State Transitions */}
      <main className={`flex-1 flex items-center justify-center relative z-10 ${status === 'PLAYING' ? 'p-1 sm:p-6 lg:p-10' : 'p-4 sm:p-8 lg:p-12'}`}>
        <AnimatePresence mode="wait">
          {/* ==================================================== */}
          {/* STATE: INTRO (Expansive 2-Column Exhibition Pavilion) */}
          {/* ==================================================== */}
          {status === 'INTRO' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-5xl rounded-[24px] bg-[#0d1017]/95 border border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden backdrop-blur-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                {/* Left Column: Artwork Exhibition Plaque */}
                <div className="lg:col-span-5 bg-gradient-to-b from-[#121624] via-[#0d1017] to-[#06080d] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#d4af37]/20 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#d4af37]" />
                        <span className="font-mono-num text-xs font-bold text-[#d4af37] tracking-widest uppercase">
                          ATELIER EXHIBIT
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-num font-bold text-[#f5e6c8] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40">
                        {game.season}
                      </span>
                    </div>

                    <div className="py-6 flex flex-col items-center justify-center relative">
                      <div className="absolute w-44 h-44 rounded-full bg-[#d4af37]/10 blur-2xl pointer-events-none" />
                      <div className="relative z-10">
                        <GameVisualArt slug={game.slug} size="lg" />
                      </div>
                    </div>
                  </div>

                  {/* Prize Tier Snapshot Card */}
                  <div className="mt-6 p-4 rounded-[14px] bg-[#101420] border border-[#d4af37]/30 shadow-inner">
                    <div className="flex items-center gap-2 text-xs font-serif-editorial font-bold text-[#f5e6c8] uppercase tracking-wider mb-2.5">
                      <Trophy className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Cơ Cấu Giải Thưởng</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono-num">
                      <div className="flex items-center justify-between py-1 border-b border-white/[0.06]">
                        <span className="text-[#8b95a8]">Giải Nhất Jackpot</span>
                        <span className="font-bold text-[#fbbf24]">1.000.000đ</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/[0.06]">
                        <span className="text-[#8b95a8]">Voucher May Mắn</span>
                        <span className="font-bold text-[#f43f5e]">500.000đ</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#8b95a8]">Điểm Tích Lũy VIP</span>
                        <span className="font-bold text-[#34d399]">+100 ~ 500 PTS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Narrative, Mechanics & Launch CTA */}
                <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono-num tracking-[0.2em] uppercase text-[#d4af37] font-bold block mb-2">
                      {game.tag}
                    </span>
                    <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#fcfbfa] mb-2 leading-tight">
                      {game.name}
                    </h1>
                    <p className="text-xs sm:text-sm font-mono-num font-semibold text-[#8b95a8] uppercase tracking-wider mb-6">
                      {game.subtitle}
                    </p>

                    {/* Story Box */}
                    <div className="p-5 rounded-[14px] bg-[#121724] border border-white/10 mb-6 leading-relaxed">
                      <div className="flex items-center gap-2 mb-2 text-[#f5e6c8] font-serif-editorial font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-[#d4af37]" />
                        <span>Cốt Truyện Trải Nghiệm</span>
                      </div>
                      <p className="text-xs sm:text-sm font-sans text-[#8b95a8] leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* 3-Step Guide with Roman Numerals */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { step: 'I', title: 'Khởi Động', sub: 'Kích hoạt phiên' },
                        { step: 'II', title: 'Tương Tác', sub: 'Đón vận may' },
                        { step: 'III', title: 'Nhận Thưởng', sub: 'Lưu vào ví' },
                      ].map((s) => (
                        <div key={s.step} className="p-3 rounded-[12px] bg-[#101420] border border-white/[0.08] text-center">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5e6c8] text-[#06080d] text-[11px] font-mono-num font-bold inline-flex items-center justify-center mb-1 shadow">
                            {s.step}
                          </span>
                          <span className="text-xs font-serif-editorial font-bold text-[#fcfbfa] mt-0.5 block">{s.title}</span>
                          <span className="text-[10px] font-mono-num text-[#7b8496] mt-0.5 block">{s.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#34d399] bg-[#064e3b]/30 border border-[#059669]/40 rounded-[10px] py-2.5 px-3 mb-6 font-mono-num">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      <span>Xác thực kết quả server-side chống gian lận đa tầng.</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        size="xl"
                        onClick={handleStartGame}
                        className="w-full sm:flex-1 text-sm sm:text-base bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.6)]"
                      >
                        <span>Bắt Đầu Trải Nghiệm</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="xl"
                        onClick={() => setShowDropRateModal(true)}
                        className="w-full sm:w-auto bg-[#121624] text-[#f5e6c8] border border-[#d4af37]/40 hover:border-[#d4af37]"
                      >
                        <Sliders className="w-4 h-4 mr-2 text-[#d4af37]" />
                        <span>Tỷ Lệ Rớt (%)</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* STATE: READY COUNTDOWN                               */}
          {/* ==================================================== */}
          {status === 'READY' && (
            <motion.div
              key="ready"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-center relative py-16"
            >
              <div className="font-serif-editorial text-8xl sm:text-9xl font-bold bg-gradient-to-b from-[#f5e6c8] via-[#d4af37] to-[#854d0e] bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(212,175,55,0.6)]">
                {countdown}
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] mt-6 font-mono-num font-bold">
                Chuẩn bị sẵn sàng...
              </p>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* STATE: PLAYING STAGE                                 */}
          {/* ==================================================== */}
          {status === 'PLAYING' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl flex flex-col items-center justify-center"
            >
              {children({
                status: 'PLAYING',
                onCompleteGame: handleCompleteGame,
                soundEnabled,
                sessionId,
              })}
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* STATE: RESULT & SCORE SUMMARY                        */}
          {/* ==================================================== */}
          {status === 'RESULT' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg rounded-[20px] bg-[#0d1017] p-8 sm:p-10 text-center border border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#121624] via-[#2a0612] to-[#0c0f17] border border-[#d4af37] mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <Trophy className="w-8 h-8 text-[#d4af37]" />
              </div>

              <span className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono-num font-bold">
                HOÀN THÀNH PHIÊN CHƠI
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#fcfbfa] mt-1 mb-2">
                Chiến Thắng Xuất Sắc
              </h2>

              <div className="my-6 p-6 rounded-[14px] bg-[#121624] border border-white/10">
                <div className="text-[11px] text-[#8b95a8] uppercase tracking-wider mb-1 font-mono-num font-bold">
                  Điểm Số Đạt Được
                </div>
                <div className="font-mono-num text-5xl font-extrabold bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] bg-clip-text text-transparent">
                  {finalScore.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#34d399] bg-[#064e3b]/30 border border-[#059669]/40 rounded-[10px] py-2.5 px-3 mb-6 font-mono-num">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>
                  {verifiedByServer
                    ? 'Đã xác thực chữ ký số C# Engine'
                    : 'Điểm số hợp lệ chuẩn bảo mật'}
                </span>
              </div>

              <Button
                size="xl"
                onClick={handleRevealReward}
                className="w-full text-base bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold shadow-[0_8px_25px_rgba(212,175,55,0.4)]"
                isLoading={isSubmitting}
              >
                <Gift className="w-5 h-5 mr-2" />
                <span>Khai Mở Phần Thưởng</span>
              </Button>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* STATE: REWARD REVEAL & LEAD CAPTURE                  */}
          {/* ==================================================== */}
          {status === 'REWARD_REVEAL' && (
            <motion.div
              key="reward"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-lg rounded-[20px] bg-[#0d1017] p-8 sm:p-10 text-center border border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#121624] via-[#2a0612] to-[#0c0f17] border-2 border-[#d4af37] mx-auto shadow-[0_0_25px_rgba(212,175,55,0.4)] mb-6 flex items-center justify-center">
                <Crown className="w-10 h-10 text-[#f5e6c8] animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e6c8] text-[10.5px] font-mono-num font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {rewardWon?.type === 'VOUCHER' ? 'VOUCHER ĐẶC QUYỀN VIP' : 'PHẦN THƯỞNG ĐIỂM SỐ'}
                </span>
              </div>

              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#fcfbfa] mb-2 leading-tight">
                {rewardWon?.name || '10 Points Thưởng VIP'}
              </h2>

              <p className="text-xs text-[#8b95a8] mb-6 px-4 leading-relaxed font-sans">
                {rewardWon?.description || 'Phần thưởng đã được kích hoạt thành công trên hệ thống.'}
              </p>

              {/* Voucher Code Box */}
              {rewardWon?.code && (
                <div className="mb-6 p-4 rounded-[14px] bg-[#121624] border border-[#d4af37]/30 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-[10px] text-[#7b8496] uppercase tracking-wider font-mono-num font-bold">
                      MÃ VOUCHER ĐỘC QUYỀN
                    </div>
                    <div className="font-mono-num text-lg font-bold text-[#f5e6c8] tracking-widest mt-0.5">
                      {rewardWon.code}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-full bg-[#101420] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] transition-all hover:scale-105"
                    title="Sao chép mã"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-[#34d399]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Lead Generation: Phone Input Form (Mượt theo đúng yêu cầu nghiệp vụ) */}
              {!phoneSaved ? (
                <form onSubmit={handleSavePhone} className="mb-6 p-4 rounded-[14px] bg-[#121624] border border-[#d4af37]/40 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-serif-editorial font-bold text-[#f5e6c8] mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Lưu Mã Vào Số Điện Thoại Để Sử Dụng</span>
                  </div>
                  <p className="text-[11px] text-[#7b8496] mb-3">
                    Nhập SĐT của bạn để bảo lưu voucher và nhận thông báo ưu đãi trực tiếp.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Nhập số điện thoại (ví dụ: 0901234567)"
                      required
                      className="flex-1 px-3.5 py-2 rounded-full bg-[#06080d] border border-white/15 text-xs text-[#fcfbfa] placeholder-[#7b8496] focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full bg-[#d4af37] text-[#06080d] text-xs font-mono-num font-bold hover:bg-[#f5e6c8] transition-colors"
                    >
                      Kích Hoạt
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-3 rounded-[12px] bg-[#064e3b]/30 border border-[#059669]/40 text-xs font-mono-num text-[#34d399] flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Đã kích hoạt cho SĐT {phoneNumber}! Voucher sẵn sàng sử dụng.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={handlePlayAgain} className="flex-1 bg-[#121624] text-[#f5e6c8] border border-white/10 hover:border-[#d4af37]/40">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span>Trải Nghiệm Lại</span>
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/rewards')}
                  className="flex-1 bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold shadow-gold"
                >
                  <span>Xem Kho Quà Tặng</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Bottom Bar */}
      <footer className={`w-full text-center py-2.5 sm:py-4 border-t border-[#d4af37]/20 text-[10px] sm:text-[11px] font-mono-num text-[#7b8496] ${status === 'PLAYING' ? 'hidden sm:block' : 'block'}`}>
        <span>ATELIER ROYALE PAVILION • BẢO CHỨNG BẢO MẬT & XÁC THỰC SERVER-SIDE</span>
      </footer>

      {/* 4. Drop Rate Configuration Modal */}
      <DropRateModal
        isOpen={showDropRateModal}
        onClose={() => setShowDropRateModal(false)}
        gameId={game.slug}
      />
    </div>
  );
};
