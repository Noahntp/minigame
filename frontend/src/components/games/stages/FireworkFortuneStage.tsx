import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, RefreshCw, Trophy, ShieldCheck, Crown } from 'lucide-react';
import { Button } from '../../common/Button';
import { sound } from '../../../utils/audio';

interface FireworkFortuneStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

// Particle types for canvas simulation
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  drag: number;
  flicker: boolean;
  history: { x: number; y: number }[];
  maxHistory: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: 'peony-magenta' | 'peony-cyan' | 'willow-gold' | 'chrysanthemum-tri';
  history: { x: number; y: number }[];
}

export const FireworkFortuneStage: React.FC<FireworkFortuneStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  const [shellsFired, setShellsFired] = useState<number>(0);
  const [isPlayingSymphony, setIsPlayingSymphony] = useState<boolean>(true);
  const [grandFinaleComplete, setGrandFinaleComplete] = useState<boolean>(false);
  const [skyFlashColor, setSkyFlashColor] = useState<string | null>(null);

  // Simulation stores
  const rockets = useRef<Rocket[]>([]);
  const sparks = useRef<Spark[]>([]);
  const symphonyFrame = useRef<number>(0);
  const isSymphonyActive = useRef<boolean>(true);

  // Sound ref
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const triggerFlash = (color: string) => {
    setSkyFlashColor(color);
    setTimeout(() => setSkyFlashColor(null), 150);
  };

  // 1. Launch a grand sweeping ground fan fountain (matching bottom tier in user's photo)
  const launchGroundFanPlumes = useCallback((originX: number, count = 18) => {
    sound.playFireworkLaunch(soundEnabledRef.current);
    sound.playFireworkWillow(soundEnabledRef.current);

    const h = containerRef.current?.clientHeight || 480;
    const baseAngle = -Math.PI / 2;
    const spread = 1.35; // ~78 degrees wide sweeping fan

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = baseAngle - spread / 2 + t * spread;
      // High upward velocity so plumes soar into mid-sky (200px - 280px tall)
      const speed = 10.5 + Math.random() * 3.5;

      // Create stream of glowing sparks along each fan ray
      for (let s = 0; s < 28; s++) {
        const speedFrac = speed * (0.55 + (s / 28) * 0.48);
        const jitter = (Math.random() - 0.5) * 0.04;
        sparks.current.push({
          x: originX + (Math.random() - 0.5) * 4,
          y: h - 30,
          vx: Math.cos(angle + jitter) * speedFrac,
          vy: Math.sin(angle + jitter) * speedFrac,
          alpha: 1,
          decay: 0.007 + Math.random() * 0.005, // long burn
          color: Math.random() > 0.3 ? '#fde047' : '#ffffff',
          size: 1.8 + Math.random() * 1.4,
          gravity: 0.075,
          drag: 0.991, // low drag so plumes soar gracefully
          flicker: true,
          history: [],
          maxHistory: 12,
        });
      }
    }
  }, []);

  // 2. Explode an aerial shell into hundreds of fine starlight particles (matching peonies & willows in photo)
  const explodeShell = useCallback((x: number, y: number, type: string) => {
    sound.playFireworkBurst(soundEnabledRef.current);

    if (type === 'willow-gold') {
      sound.playFireworkWillow(soundEnabledRef.current);
      triggerFlash('rgba(251, 191, 36, 0.4)');
      // Grand Weeping Willow (Kamuro) - 280 golden streaming sparks cascading down
      const count = 280;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 8.0;
        sparks.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.0055 + Math.random() * 0.004, // very long weeping burn
          color: Math.random() > 0.35 ? '#fbbf24' : '#fffbeb',
          size: 1.8 + Math.random() * 1.4,
          gravity: 0.055, // gentle slow fall
          drag: 0.984,
          flicker: true,
          history: [],
          maxHistory: 14,
        });
      }
    } else if (type === 'peony-magenta') {
      triggerFlash('rgba(244, 63, 94, 0.45)');
      // Giant Imperial Magenta/Violet Peony (Center-top in photo) - 260 starlight filaments
      const count = 260;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 9.5;
        const color = Math.random() > 0.4 ? '#f43f5e' : Math.random() > 0.5 ? '#e879f9' : '#c026d3';
        sparks.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.010 + Math.random() * 0.006,
          color,
          size: 2.2 + Math.random() * 1.2,
          gravity: 0.045,
          drag: 0.982,
          flicker: false,
          history: [],
          maxHistory: 10,
        });
      }
      // Sparkling white strobe core
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 3.8;
        sparks.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.035,
          color: '#ffffff',
          size: 2.6,
          gravity: 0.02,
          drag: 0.96,
          flicker: true,
          history: [],
          maxHistory: 4,
        });
      }
    } else if (type === 'peony-cyan') {
      triggerFlash('rgba(56, 189, 248, 0.4)');
      // Electric Cyan / Turquoise Dahlia (Right side in photo) - 220 filaments
      const count = 220;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.2 + Math.random() * 8.8;
        const color = Math.random() > 0.4 ? '#38bdf8' : '#a5f3fc';
        sparks.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.011 + Math.random() * 0.006,
          color,
          size: 2.0 + Math.random() * 1.2,
          gravity: 0.045,
          drag: 0.982,
          flicker: false,
          history: [],
          maxHistory: 10,
        });
      }
    } else {
      // Chrysanthemum Tri-Color (Orange, Gold, Ruby)
      triggerFlash('rgba(251, 146, 60, 0.4)');
      const count = 240;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.0 + Math.random() * 9.0;
        const color = Math.random() > 0.5 ? '#f97316' : Math.random() > 0.5 ? '#fde047' : '#ef4444';
        sparks.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.006,
          color,
          size: 2.2 + Math.random() * 1.0,
          gravity: 0.05,
          drag: 0.982,
          flicker: true,
          history: [],
          maxHistory: 10,
        });
      }
    }
  }, []);

  // 3. Launch a rising rocket shell
  const launchRocket = useCallback(
    (startX: number, targetX: number, targetY: number, type: Rocket['type']) => {
      sound.playFireworkLaunch(soundEnabledRef.current);
      setShellsFired((c) => c + 1);

      const h = containerRef.current?.clientHeight || 480;
      const vy = -Math.sqrt(2 * 0.16 * Math.max(80, h - targetY));
      const flightFrames = Math.max(25, Math.abs(vy / 0.16));
      const vx = (targetX - startX) / flightFrames;

      rockets.current.push({
        x: startX,
        y: h - 30,
        targetY,
        vx,
        vy,
        color:
          type === 'peony-magenta'
            ? '#f43f5e'
            : type === 'peony-cyan'
            ? '#38bdf8'
            : type === 'willow-gold'
            ? '#fbbf24'
            : '#f97316',
        type,
        history: [],
      });
    },
    []
  );

  // 4. Start/Restart Grand Symphony
  const startGrandSymphony = useCallback(() => {
    symphonyFrame.current = 0;
    isSymphonyActive.current = true;
    setIsPlayingSymphony(true);
    setGrandFinaleComplete(false);
    track('FIREWORK_GRAND_SYMPHONY', 1);
  }, [track]);

  // Click on canvas to launch direct firework at cursor
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const types: Rocket['type'][] = ['peony-magenta', 'peony-cyan', 'willow-gold', 'chrysanthemum-tri'];
    const selectedType = types[Math.floor(Math.random() * types.length)];

    launchRocket(x + (Math.random() - 0.5) * 60, x, y, selectedType);
    track('TAP_FIREWORK', 1);
  };

  // 5. Canvas Simulation Loop (60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Main animation loop
    const loop = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      // 1. Frame-based Symphony Choreography
      if (isSymphonyActive.current) {
        const f = symphonyFrame.current++;

        // Act 1: FULL MULTI-TIER SYMPHONY (ALL 3 TIERS AS IN PHOTO)
        if (f === 1) {
          // Tier 1: Sweeping Ground Fan Willow Plumes soaring into mid-sky
          launchGroundFanPlumes(w * 0.16, 16);
          launchGroundFanPlumes(w * 0.38, 16);
          launchGroundFanPlumes(w * 0.62, 16);
          launchGroundFanPlumes(w * 0.84, 16);
        }

        if (f === 2) {
          // Tier 2: Giant Imperial Magenta Peony blooms (Center-Left in photo)
          explodeShell(w * 0.36, h * 0.28, 'peony-magenta');
        }

        if (f === 3) {
          // Tier 2: Electric Cyan / Turquoise Dahlia blooms (Right in photo)
          explodeShell(w * 0.72, h * 0.34, 'peony-cyan');
        }

        if (f === 4) {
          // Tier 3: Golden Weeping Willow Canopy blooms (Center-Top in photo)
          explodeShell(w * 0.52, h * 0.22, 'willow-gold');
          // Launch next ascending rockets
          launchRocket(w * 0.24, w * 0.26, h * 0.38, 'chrysanthemum-tri');
          launchRocket(w * 0.78, w * 0.74, h * 0.30, 'peony-magenta');
        }

        // Act 2: Continuous Grand Waves
        if (f === 75) {
          launchGroundFanPlumes(w * 0.26, 14);
          launchGroundFanPlumes(w * 0.50, 16);
          launchGroundFanPlumes(w * 0.74, 14);
        }

        if (f === 125) {
          launchRocket(w * 0.42, w * 0.42, h * 0.22, 'willow-gold');
          launchRocket(w * 0.58, w * 0.58, h * 0.24, 'willow-gold');
          launchGroundFanPlumes(w * 0.15, 14);
          launchGroundFanPlumes(w * 0.85, 14);
        }

        if (f === 190) {
          explodeShell(w * 0.50, h * 0.24, 'willow-gold');
          launchGroundFanPlumes(w * 0.35, 16);
          launchGroundFanPlumes(w * 0.65, 16);
        }

        // Symphony Climax End
        if (f >= 320) {
          isSymphonyActive.current = false;
          setIsPlayingSymphony(false);
          setGrandFinaleComplete(true);
          sound.playReward(soundEnabledRef.current);
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Atmospheric Motion Blur trail
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(6, 8, 14, 0.22)';
      ctx.fillRect(0, 0, w, h);

      // Additive lighting for intense glowing sparks
      ctx.globalCompositeOperation = 'lighter';

      // 2. Update & Render Rockets
      for (let i = rockets.current.length - 1; i >= 0; i--) {
        const r = rockets.current[i];
        r.history.push({ x: r.x, y: r.y });
        if (r.history.length > 8) r.history.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.16; // gravity slowing rocket ascent

        // Rocket Trail
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        if (r.history.length > 1) {
          ctx.moveTo(r.history[0].x, r.history[0].y);
          for (let j = 1; j < r.history.length; j++) {
            ctx.lineTo(r.history[j].x, r.history[j].y);
          }
        }
        ctx.stroke();

        // Sparkle head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Detonation condition
        if (r.vy >= 0 || r.y <= r.targetY) {
          explodeShell(r.x, r.y, r.type);
          rockets.current.splice(i, 1);
        }
      }

      // 3. Update & Render Sparks
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i];
        s.history.push({ x: s.x, y: s.y });
        if (s.history.length > s.maxHistory) s.history.shift();

        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= s.drag;
        s.vy *= s.drag;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.current.splice(i, 1);
          continue;
        }

        // Draw spark tail
        if (s.history.length > 1) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.size * (s.flicker && Math.random() > 0.4 ? 0.65 : 1);
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.beginPath();
          ctx.moveTo(s.history[0].x, s.history[0].y);
          for (let j = 1; j < s.history.length; j++) {
            ctx.lineTo(s.history[j].x, s.history[j].y);
          }
          ctx.stroke();
        }

        // Glowing head
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // 4. Render Ground Silhouette (Tree branches along the horizon as in reference photo)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#030206';
      ctx.beginPath();
      ctx.moveTo(0, h - 30);
      ctx.quadraticCurveTo(w * 0.15, h - 42, w * 0.3, h - 34);
      ctx.quadraticCurveTo(w * 0.45, h - 48, w * 0.6, h - 34);
      ctx.quadraticCurveTo(w * 0.75, h - 44, w * 0.9, h - 36);
      ctx.quadraticCurveTo(w * 0.96, h - 44, w, h - 30);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Tree silhouette branches
      ctx.strokeStyle = '#030206';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      const treePositions = [0.12, 0.26, 0.42, 0.58, 0.74, 0.88];
      treePositions.forEach((pos) => {
        const tx = w * pos;
        const ty = h - 34;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, ty - 16);
        ctx.lineTo(tx - 6, ty - 24);
        ctx.moveTo(tx, ty - 12);
        ctx.lineTo(tx + 7, ty - 22);
        ctx.stroke();
      });

      ctx.restore();

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [launchGroundFanPlumes, launchRocket, explodeShell]);

  return (
    <div className="relative w-full max-w-4xl flex flex-col items-center justify-center select-none py-2 px-2 sm:px-4">
      {/* 1. Header Bar: Imperial Fireworks Symphony */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-[#101420]/80 border border-[#d4af37]/30 rounded-t-[18px] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#121624] border border-[#d4af37] flex items-center justify-center shadow-gold">
            <Flame className="w-5 h-5 text-[#f59e0b] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-num font-semibold text-[#d4af37] tracking-[0.2em] uppercase">
                ATELIER ROYAL N° 10
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-num font-bold text-[#f43f5e] bg-[#f43f5e]/15 border border-[#f43f5e]/30">
                TẾT HOÀNG TRIỀU
              </span>
            </div>
            <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#fcfbfa]">
              Đại Tiệc Pháo Hoa Thượng Đỉnh
            </h2>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono-num">
          <div className="text-right">
            <div className="text-[10px] text-[#8b95a8] uppercase">Đã Khai Hỏa</div>
            <div className="text-sm font-bold text-[#fbbf24]">{shellsFired} Quả</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-right">
            <div className="text-[10px] text-[#8b95a8] uppercase">Đặc Quyền</div>
            <div className="text-sm font-bold text-[#34d399]">+680 PTS</div>
          </div>
        </div>
      </div>

      {/* 2. Main High-Performance Canvas Stage */}
      <div
        ref={containerRef}
        className="relative w-full h-[420px] sm:h-[500px] bg-[#06080e] border-x border-[#d4af37]/30 overflow-hidden cursor-crosshair shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]"
      >
        {/* Sky Detonation Flash Overlay */}
        <AnimatePresence>
          {skyFlashColor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              style={{
                background: `radial-gradient(circle at 50% 32%, ${skyFlashColor} 0%, transparent 70%)`,
              }}
              className="absolute inset-0 pointer-events-none z-10"
            />
          )}
        </AnimatePresence>

        {/* Canvas for 60fps Particle Engine */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block relative z-0"
        />

        {/* Hint banner */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-3.5 py-1 rounded-full bg-[#06080e]/75 border border-[#d4af37]/30 backdrop-blur-md">
          <span className="text-[11px] font-sans font-medium text-[#f5e6c8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] animate-spin" />
            <span>Chạm bất kỳ điểm nào trên bầu trời đêm để tự phóng pháo hoa</span>
          </span>
        </div>

        {/* 3. Grand Fortune Scroll / Reward Reveal */}
        <AnimatePresence>
          {grandFinaleComplete && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <div className="relative w-full max-w-md bg-[#101420]/95 border-2 border-[#d4af37] rounded-[24px] p-6 text-center shadow-[0_24px_80px_rgba(212,175,55,0.35)] overflow-hidden">
                {/* Gold filigree halo */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none" />

                {/* Crest */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#831843] via-[#d4af37] to-[#f5e6c8] p-[1.5px] mx-auto mb-3 shadow-gold">
                  <div className="w-full h-full rounded-full bg-[#06080d] flex items-center justify-center">
                    <Crown className="w-7 h-7 text-[#fbbf24]" />
                  </div>
                </div>

                <span className="text-[10px] font-mono-num font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                  KHAI XUÂN ĐẮC LỘC • PHÁT TÀI PHÁT LỘC
                </span>

                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#fcfbfa] mt-1 mb-2">
                  Đại Cát Đại Lợi 2026
                </h3>

                <p className="text-xs font-sans text-[#8b95a8] mb-4">
                  Pháo hoa đã nở rộ thắp sáng hoàng triều. Bạn đã xuất sắc nhận được phần quà Jackpot may mắn nhất:
                </p>

                {/* Reward Plaque */}
                <div className="bg-[#161c2e] border border-[#d4af37]/40 rounded-[14px] p-3.5 mb-5 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-mono-num uppercase text-[#d4af37] tracking-wider block">
                      VOUCHER HOÀNG GIA
                    </span>
                    <span className="text-base font-serif-editorial font-bold text-[#f5e6c8]">
                      Giảm 1.000.000 VNĐ
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-num font-bold text-[#34d399] bg-[#064e3b]/40 border border-[#059669]/50 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>+680 PTS</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={startGrandSymphony}
                    className="bg-[#161c2e] hover:bg-[#1f2740] text-[#f5e6c8] border border-[#d4af37]/40 font-serif-editorial text-xs font-bold px-4 py-2.5 rounded-[12px]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    <span>Bắn Lại Pháo Hoa</span>
                  </Button>

                  <Button
                    onClick={() => onComplete(680)}
                    className="bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial text-xs font-bold px-5 py-2.5 rounded-[12px] shadow-gold hover:opacity-95"
                  >
                    <Trophy className="w-3.5 h-3.5 mr-1.5" />
                    <span>Lưu Vào Kho Quà</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Action Control Footbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#101420]/90 border border-t-0 border-[#d4af37]/30 rounded-b-[18px] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Button
            size="md"
            onClick={startGrandSymphony}
            disabled={isPlayingSymphony}
            className="bg-gradient-to-r from-[#d4af37] via-[#f5e6c8] to-[#d4af37] text-[#06080d] font-serif-editorial font-bold shadow-gold text-xs px-5"
          >
            <Flame className="w-4 h-4 mr-1.5 text-[#831843]" />
            <span>{isPlayingSymphony ? 'Đang Diễn Ra Đại Tiệc...' : 'Khai Hỏa Đại Pháo (Full Symphony)'}</span>
          </Button>

          <Button
            size="md"
            onClick={() => launchGroundFanPlumes(containerRef.current ? containerRef.current.clientWidth * 0.5 : 400, 20)}
            className="bg-[#161c2e] hover:bg-[#202842] text-[#f5e6c8] border border-[#d4af37]/40 font-serif-editorial font-bold text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-[#fbbf24]" />
            <span>Bắn Quạt Pháo Sáng</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-num text-[#8b95a8]">
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
          <span>Vật lý 60fps • Mô phỏng chuẩn lễ hội</span>
        </div>
      </div>
    </div>
  );
};
