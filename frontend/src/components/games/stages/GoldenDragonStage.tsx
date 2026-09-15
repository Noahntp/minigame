import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Check, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { sound } from '../../../utils/audio';

interface GoldenDragonStageProps {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
  track: (type: string, val?: number) => void;
}

interface Segment {
  x: number;
  y: number;
  angle: number;
}

interface FoodItem {
  id: number;
  x: number;
  y: number;
  type: 'pearl' | 'loc' | 'ingot';
  points: number;
  label: string;
  pulse: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

// Haptic feedback utility for mobile touch devices
const triggerHaptic = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
};

export const GoldenDragonStage: React.FC<GoldenDragonStageProps> = ({
  onComplete,
  soundEnabled,
  track,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickTouchIdRef = useRef<number | null>(null);

  // Game state
  const [score, setScore] = useState<number>(0);
  const [foodEatenCount, setFoodEatenCount] = useState<number>(0);
  const [isSupernova, setIsSupernova] = useState<boolean>(false);
  const [rewardRevealed, setRewardRevealed] = useState<boolean>(false);
  const [controlMode, setControlMode] = useState<'joystick' | 'touch' | 'dpad'>('joystick');
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const targetFoodCount = 12;

  // Refs for animation loop & physics to avoid stale closures
  const stateRef = useRef({
    score: 0,
    foodEatenCount: 0,
    isSupernova: false,
    dragonHead: { x: 400, y: 260, angle: 0, speed: 3.5 },
    targetAngle: 0,
    segments: [] as Segment[],
    segmentDist: 15,
    foods: [] as FoodItem[],
    particles: [] as SparkParticle[],
    width: 800,
    height: 520,
    pointerTarget: null as { x: number; y: number } | null,
    keysDown: {} as Record<string, boolean>,
    supernovaTimer: 0,
    isBoosting: false,
  });

  // Spawn random food on canvas
  const spawnFoods = useCallback((count: number) => {
    const s = stateRef.current;
    const types: Array<'pearl' | 'loc' | 'ingot'> = ['pearl', 'loc', 'ingot'];
    const margin = 60;

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const points = type === 'pearl' ? 50 : type === 'loc' ? 60 : 80;
      const label = type === 'pearl' ? 'THẦN CHÂU' : type === 'loc' ? 'LỘC' : 'KIM BẢO';
      s.foods.push({
        id: Date.now() + Math.random() * 10000,
        x: margin + Math.random() * (s.width - margin * 2),
        y: margin + Math.random() * (s.height - margin * 2),
        type,
        points,
        label,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  // Initialize dragon body & foods
  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.score = 0;
    s.foodEatenCount = 0;
    s.isSupernova = false;
    s.supernovaTimer = 0;
    s.isBoosting = false;
    s.dragonHead = { x: s.width / 2, y: s.height / 2, angle: 0, speed: 3.5 };
    s.targetAngle = 0;
    s.pointerTarget = null;
    s.particles = [];
    s.foods = [];

    // Create 20 initial dragon segments
    const initSegments: Segment[] = [];
    for (let i = 0; i < 20; i++) {
      initSegments.push({
        x: s.dragonHead.x - i * s.segmentDist,
        y: s.dragonHead.y,
        angle: 0,
      });
    }
    s.segments = initSegments;

    // Spawn 5 initial food items
    spawnFoods(5);

    setScore(0);
    setFoodEatenCount(0);
    setIsSupernova(false);
    setRewardRevealed(false);
    setIsBoosting(false);
    setJoystickPos({ x: 0, y: 0 });
    setIsJoystickActive(false);
  }, [spawnFoods]);

  // Speed Boost actions (Nút Tăng Tốc Hoàng Gia)
  const startBoost = useCallback(() => {
    stateRef.current.dragonHead.speed = 5.6;
    stateRef.current.isBoosting = true;
    setIsBoosting(true);
    setHasInteracted(true);
    triggerHaptic(15);
  }, []);

  const stopBoost = useCallback(() => {
    stateRef.current.dragonHead.speed = 3.5;
    stateRef.current.isBoosting = false;
    setIsBoosting(false);
  }, []);

  // Virtual Joystick actions (Cần Gạt Ảo 360 Độ Cho Ngón Cái)
  const updateJoystick = useCallback((clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 36;
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);
    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: nx, y: ny });
    stateRef.current.targetAngle = angle;
    stateRef.current.pointerTarget = null;
  }, []);

  const handleJoystickTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    joystickTouchIdRef.current = touch.identifier;
    setIsJoystickActive(true);
    setHasInteracted(true);
    updateJoystick(touch.clientX, touch.clientY);
  }, [updateJoystick]);

  const handleJoystickTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  }, [updateJoystick]);

  const handleJoystickTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        joystickTouchIdRef.current = null;
        setIsJoystickActive(false);
        setJoystickPos({ x: 0, y: 0 });
        break;
      }
    }
  }, []);

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
        s.keysDown[e.key] = true;
        s.pointerTarget = null;
        setHasInteracted(true);

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') s.targetAngle = -Math.PI / 2;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') s.targetAngle = Math.PI / 2;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') s.targetAngle = Math.PI;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') s.targetAngle = 0;
      } else if (e.key === ' ' || e.key === 'Shift') {
        startBoost();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      delete stateRef.current.keysDown[e.key];
      if (e.key === ' ' || e.key === 'Shift') {
        stopBoost();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startBoost, stopBoost]);

  // Set direction via virtual D-Pad buttons
  const handleDirectionBtn = (angle: number) => {
    sound.playClick(soundEnabled);
    triggerHaptic(10);
    setHasInteracted(true);
    stateRef.current.pointerTarget = null;
    stateRef.current.targetAngle = angle;
  };

  // Canvas resize & main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI & dynamic resize
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;
    };

    handleResize();
    resetGame();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const spawnSparks = (x: number, y: number, color: string, count: number) => {
      const s = stateRef.current;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 4.5;
        s.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: 1.8 + Math.random() * 3.5,
        });
      }
    };

    const render = () => {
      const s = stateRef.current;
      const w = s.width;
      const h = s.height;

      // 1. UPDATE DRAGON POSITION & STEERING
      if (!s.isSupernova) {
        // Pointer target steering
        if (s.pointerTarget) {
          const dx = s.pointerTarget.x - s.dragonHead.x;
          const dy = s.pointerTarget.y - s.dragonHead.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 18) {
            s.targetAngle = Math.atan2(dy, dx);
          }
        }

        // Smooth angle interpolation (lerp angle)
        let diff = s.targetAngle - s.dragonHead.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        s.dragonHead.angle += diff * (s.isBoosting ? 0.18 : 0.14);

        // Move head forward
        s.dragonHead.x += Math.cos(s.dragonHead.angle) * s.dragonHead.speed;
        s.dragonHead.y += Math.sin(s.dragonHead.angle) * s.dragonHead.speed;

        // Soft screen border glide / bounce
        const margin = 28;
        if (s.dragonHead.x < margin) {
          s.dragonHead.x = margin;
          s.targetAngle = 0;
          spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 3);
        } else if (s.dragonHead.x > w - margin) {
          s.dragonHead.x = w - margin;
          s.targetAngle = Math.PI;
          spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 3);
        }
        if (s.dragonHead.y < margin) {
          s.dragonHead.y = margin;
          s.targetAngle = Math.PI / 2;
          spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 3);
        } else if (s.dragonHead.y > h - margin) {
          s.dragonHead.y = h - margin;
          s.targetAngle = -Math.PI / 2;
          spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 3);
        }
      } else {
        // Supernova victory spiral
        s.supernovaTimer += 0.035;
        s.dragonHead.angle += 0.06;
        s.dragonHead.speed = 6.2;
        s.dragonHead.x += Math.cos(s.dragonHead.angle) * s.dragonHead.speed;
        s.dragonHead.y += Math.sin(s.dragonHead.angle) * s.dragonHead.speed;

        // Loop inside arena
        if (s.dragonHead.x < 30) s.dragonHead.x = w - 30;
        if (s.dragonHead.x > w - 30) s.dragonHead.x = 30;
        if (s.dragonHead.y < 30) s.dragonHead.y = h - 30;
        if (s.dragonHead.y > h - 30) s.dragonHead.y = 30;
      }

      // 2. INVERSE KINEMATICS FOR DRAGON SPINE & SEGMENTS
      let prevX = s.dragonHead.x;
      let prevY = s.dragonHead.y;

      for (let i = 0; i < s.segments.length; i++) {
        const seg = s.segments[i];
        const dx = prevX - seg.x;
        const dy = prevY - seg.y;
        seg.angle = Math.atan2(dy, dx);
        seg.x = prevX - Math.cos(seg.angle) * s.segmentDist;
        seg.y = prevY - Math.sin(seg.angle) * s.segmentDist;

        // Graceful serpentine undulation
        const wave = Math.sin(Date.now() * 0.007 + i * 0.35) * (2.8 * Math.sin((i / s.segments.length) * Math.PI));
        seg.x += Math.cos(seg.angle + Math.PI / 2) * wave;
        seg.y += Math.sin(seg.angle + Math.PI / 2) * wave;

        prevX = seg.x;
        prevY = seg.y;
      }

      // Dragon breath / flame embers from tail
      if (Math.random() < (s.isBoosting ? 0.95 : 0.6) && s.segments.length > 0) {
        const tail = s.segments[s.segments.length - 1];
        s.particles.push({
          x: tail.x + (Math.random() - 0.5) * 10,
          y: tail.y + (Math.random() - 0.5) * 10,
          vx: -Math.cos(tail.angle) * ((s.isBoosting ? 3.5 : 1.5) + Math.random() * 2),
          vy: -Math.sin(tail.angle) * ((s.isBoosting ? 3.5 : 1.5) + Math.random() * 2),
          alpha: 0.95,
          color: s.isBoosting ? '#ef4444' : (Math.random() > 0.4 ? '#fde047' : '#f97316'),
          size: (s.isBoosting ? 3.8 : 2.2) + Math.random() * 3.5,
        });
      }

      // 3. CHECK FOOD CONSUMPTION
      for (let i = s.foods.length - 1; i >= 0; i--) {
        const food = s.foods[i];
        const dist = Math.hypot(s.dragonHead.x - food.x, s.dragonHead.y - food.y);

        if (dist < 38) {
          // Dragon eats food!
          sound.playClick(soundEnabled);
          sound.playCount(soundEnabled);
          triggerHaptic(20);
          track('TAP_DRAGON', 1);
          track('TAP_CELESTIAL_PEARL', food.points);

          const newScore = s.score + food.points;
          const newCount = s.foodEatenCount + 1;
          s.score = newScore;
          s.foodEatenCount = newCount;
          setScore(newScore);
          setFoodEatenCount(newCount);

          // Add 2 segments to dragon body (grows longer!)
          const lastSeg = s.segments[s.segments.length - 1] || s.dragonHead;
          s.segments.push({ x: lastSeg.x, y: lastSeg.y, angle: lastSeg.angle });
          s.segments.push({ x: lastSeg.x, y: lastSeg.y, angle: lastSeg.angle });

          // Spawn celebration sparkles
          spawnSparks(food.x, food.y, food.type === 'pearl' ? '#38bdf8' : '#fbbf24', 20);

          // Remove eaten food
          s.foods.splice(i, 1);

          // Check Supernova Victory Condition
          if (newCount >= targetFoodCount && !s.isSupernova) {
            s.isSupernova = true;
            setIsSupernova(true);
            sound.playReward(soundEnabled);
            triggerHaptic([40, 80, 40, 80, 160]);

            // Explode celestial fireworks
            for (let k = 0; k < 50; k++) {
              spawnSparks(w / 2, h / 2, '#fde047', 40);
            }

            setTimeout(() => {
              setRewardRevealed(true);
              sound.playWin(soundEnabled);

              setTimeout(() => {
                onComplete(600);
              }, 2500);
            }, 1200);
          } else {
            // Respawn new food item to maintain food density
            if (s.foods.length < 5) {
              spawnFoods(1);
            }
          }
        }
      }

      // 4. CANVAS RENDERING
      ctx.clearRect(0, 0, w, h);

      // Deep Palace Silk Grid Background
      ctx.fillStyle = '#060204';
      ctx.fillRect(0, 0, w, h);

      // Radial palace vignette
      const palaceGrad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, Math.max(w, h) * 0.75);
      palaceGrad.addColorStop(0, '#150307');
      palaceGrad.addColorStop(0.5, '#0a0104');
      palaceGrad.addColorStop(1, '#020002');
      ctx.fillStyle = palaceGrad;
      ctx.fillRect(0, 0, w, h);

      // Auspicious Golden Grid
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Auspicious cloud mist (Vân Mây Cát Tường)
      const cloudTime = Date.now() * 0.0003;
      for (let c = 0; c < 3; c++) {
        const cx = ((c * 300 + cloudTime * 50) % (w + 200)) - 100;
        const cy = 100 + c * 130 + Math.sin(cloudTime + c) * 30;
        const cloudGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
        cloudGrad.addColorStop(0, 'rgba(185, 28, 28, 0.14)');
        cloudGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.05)');
        cloudGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // Celestial Target Reticle (Chạm Dẫn Đường Thông Minh)
      if (s.pointerTarget && !s.isSupernova) {
        ctx.save();
        const pulse = Math.sin(Date.now() * 0.008) * 3;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(s.pointerTarget.x, s.pointerTarget.y, 16 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.arc(s.pointerTarget.x, s.pointerTarget.y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(s.pointerTarget.x, s.pointerTarget.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Radial ambient lighting around dragon head
      const glowGrad = ctx.createRadialGradient(
        s.dragonHead.x,
        s.dragonHead.y,
        10,
        s.dragonHead.x,
        s.dragonHead.y,
        s.isBoosting ? 260 : 220
      );
      glowGrad.addColorStop(0, s.isBoosting ? 'rgba(239, 68, 68, 0.38)' : 'rgba(239, 68, 68, 0.28)');
      glowGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.12)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Speed boost fiery aura
      if (s.isBoosting) {
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(s.dragonHead.x, s.dragonHead.y, 30 + Math.random() * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.022;

        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Foods (Mồi Săn)
      s.foods.forEach((food) => {
        food.pulse += 0.05;
        const scale = 1 + Math.sin(food.pulse) * 0.14;

        ctx.save();
        ctx.translate(food.x, food.y);
        ctx.scale(scale, scale);

        if (food.type === 'pearl') {
          // 1. Ngọc Rồng Thần Châu (+50 PTS)
          const haloGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 26);
          haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
          haloGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
          haloGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 26, 0, Math.PI * 2);
          ctx.fill();

          const pearlGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 14);
          pearlGrad.addColorStop(0, '#ffffff');
          pearlGrad.addColorStop(0.35, '#38bdf8');
          pearlGrad.addColorStop(0.8, '#0284c7');
          pearlGrad.addColorStop(1, '#0c4a6e');
          ctx.fillStyle = pearlGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(-4, -4, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (food.type === 'loc') {
          // 2. Chữ LỘC Thư Pháp (+60 PTS)
          const locHalo = ctx.createRadialGradient(0, 0, 10, 0, 0, 28);
          locHalo.addColorStop(0, 'rgba(239, 68, 68, 0.55)');
          locHalo.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
          locHalo.addColorStop(1, 'transparent');
          ctx.fillStyle = locHalo;
          ctx.beginPath();
          ctx.arc(0, 0, 28, 0, Math.PI * 2);
          ctx.fill();

          const locGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 15);
          locGrad.addColorStop(0, '#ef4444');
          locGrad.addColorStop(0.75, '#991b1b');
          locGrad.addColorStop(1, '#450a0a');
          ctx.fillStyle = locGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 12px "Playfair Display", "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('LỘC', 0, 1);
        } else {
          // 3. Kim Nguyên Bảo (+80 PTS)
          const ingotHalo = ctx.createRadialGradient(0, 0, 8, 0, 0, 26);
          ingotHalo.addColorStop(0, 'rgba(250, 204, 21, 0.55)');
          ingotHalo.addColorStop(0.7, 'rgba(217, 119, 6, 0.18)');
          ingotHalo.addColorStop(1, 'transparent');
          ctx.fillStyle = ingotHalo;
          ctx.beginPath();
          ctx.arc(0, 0, 26, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.ellipse(0, 5, 14, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          const topGrad = ctx.createRadialGradient(0, -3, 2, 0, -2, 12);
          topGrad.addColorStop(0, '#fef08a');
          topGrad.addColorStop(0.5, '#eab308');
          topGrad.addColorStop(1, '#a16207');
          ctx.fillStyle = topGrad;
          ctx.beginPath();
          ctx.ellipse(0, -1, 11, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef9c3';
          ctx.beginPath();
          ctx.ellipse(0, -3, 6, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 5. DRAW DRAGON BODY & SCALE OVERLAYS (Top-Down Kinematic Anatomy)
      // Draw Tail Fin first
      if (s.segments.length > 0) {
        const tail = s.segments[s.segments.length - 1];
        ctx.save();
        ctx.translate(tail.x, tail.y);
        ctx.rotate(tail.angle);

        // Triple-fan flame tail
        const tailGlow = ctx.createRadialGradient(0, 0, 4, -20, 0, 35);
        tailGlow.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        tailGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.6)');
        tailGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = tailGlow;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-15, -16, -34, -12);
        ctx.quadraticCurveTo(-22, -4, 0, 0);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-20, 0, -42, 0);
        ctx.quadraticCurveTo(-20, 4, 0, 0);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-15, 16, -34, 12);
        ctx.quadraticCurveTo(-22, 4, 0, 0);
        ctx.fill();

        ctx.restore();
      }

      // Draw Segments from tail to head
      for (let i = s.segments.length - 1; i >= 0; i--) {
        const seg = s.segments[i];
        const t = i / Math.max(1, s.segments.length);
        const radius = 17 * (1 - t * 0.45) + 3;

        ctx.save();
        ctx.translate(seg.x, seg.y);
        ctx.rotate(seg.angle);

        // Outer golden glow
        ctx.shadowColor = 'rgba(251, 191, 36, 0.4)';
        ctx.shadowBlur = 8;

        // Base Scale Body Gradient
        const scaleGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, radius);
        scaleGrad.addColorStop(0, '#fef08a');
        scaleGrad.addColorStop(0.45, '#f59e0b');
        scaleGrad.addColorStop(0.85, '#b45309');
        scaleGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = scaleGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Symmetrical Golden Scale Rim (Viền Vảy Rồng)
        ctx.strokeStyle = '#fef9c3';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, radius, -Math.PI * 0.6, Math.PI * 0.6);
        ctx.stroke();

        // Central Glowing Spine Ridge (Long Tích Ruby Hoàng Kim)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.55, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 6. DRAW DRAGON HEAD (Long Thủ Uy Nghi)
      ctx.save();
      ctx.translate(s.dragonHead.x, s.dragonHead.y);
      ctx.rotate(s.dragonHead.angle);

      // Antlers / Dragon Horns (Cặp Gạc Hươu Hoàng Kim vuốt cong ngược)
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';

      // Left Horn
      ctx.beginPath();
      ctx.moveTo(-4, -10);
      ctx.quadraticCurveTo(-18, -22, -32, -18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-14, -18);
      ctx.quadraticCurveTo(-22, -28, -26, -30);
      ctx.stroke();

      // Right Horn
      ctx.beginPath();
      ctx.moveTo(-4, 10);
      ctx.quadraticCurveTo(-18, 22, -32, 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-14, 18);
      ctx.quadraticCurveTo(-22, 28, -26, 30);
      ctx.stroke();

      // Undulating Whiskers (Long Tu Hoàng Kim uốn lượn phất phơ)
      const whiskerWave = Math.sin(Date.now() * 0.008) * 4;
      ctx.strokeStyle = '#fef9c3';
      ctx.lineWidth = 1.6;

      // Left Whisker
      ctx.beginPath();
      ctx.moveTo(14, -7);
      ctx.quadraticCurveTo(24, -18 + whiskerWave, 38, -12 - whiskerWave);
      ctx.stroke();

      // Right Whisker
      ctx.beginPath();
      ctx.moveTo(14, 7);
      ctx.quadraticCurveTo(24, 18 - whiskerWave, 38, 12 + whiskerWave);
      ctx.stroke();

      // Main Head Skull Oval
      const headGrad = ctx.createRadialGradient(4, 0, 3, 0, 0, 24);
      headGrad.addColorStop(0, '#fffbeb');
      headGrad.addColorStop(0.3, '#fde047');
      headGrad.addColorStop(0.7, '#d97706');
      headGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = headGrad;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.ellipse(3, 0, 21, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Piercing Ruby Eyes (Mắt Rồng Ruby Phát Hào Quang)
      const eyeGlowLeft = ctx.createRadialGradient(8, -6, 1, 8, -6, 7);
      eyeGlowLeft.addColorStop(0, '#ffffff');
      eyeGlowLeft.addColorStop(0.3, '#ef4444');
      eyeGlowLeft.addColorStop(1, 'transparent');
      ctx.fillStyle = eyeGlowLeft;
      ctx.beginPath();
      ctx.arc(8, -6, 5, 0, Math.PI * 2);
      ctx.fill();

      const eyeGlowRight = ctx.createRadialGradient(8, 6, 1, 8, 6, 7);
      eyeGlowRight.addColorStop(0, '#ffffff');
      eyeGlowRight.addColorStop(0.3, '#ef4444');
      eyeGlowRight.addColorStop(1, 'transparent');
      ctx.fillStyle = eyeGlowRight;
      ctx.beginPath();
      ctx.arc(8, 6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Snout nostrils (Mũi rồng hoàng kim)
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(17, -4, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(17, 4, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Request next frame
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [resetGame, soundEnabled, spawnFoods, track]);

  // Pointer move handler (mouse or finger drag)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (controlMode !== 'touch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    stateRef.current.pointerTarget = { x, y };
    setHasInteracted(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handlePointerMove(e);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center select-none py-1 sm:py-3 px-1 sm:px-2 touch-none"
    >
      {/* 1. Desktop Header Info (>= 640px) */}
      <div className="hidden sm:block text-center mb-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-red-500/15 border border-amber-500/30 mb-1 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-amber-300 font-semibold">
            Thần Long Săn Mồi • Arcade Snake Hoàng Gia
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
          Rồng Vàng Săn Mồi
        </h2>
        <p className="text-xs text-neutral-400 font-light mt-0.5 max-w-xl mx-auto">
          Dẫn dắt Thần Long uốn lượn săn ngọc quý, ăn mồi nối dài thân và bứt phá Supernova mở Voucher 1.000.000đ!
        </p>
      </div>

      {/* 2. Mobile Compact HUD (< 640px) - Single line Zero-Scroll Bar */}
      <div className="sm:hidden w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 mb-1.5 bg-neutral-950/90 rounded-xl border border-amber-500/35 backdrop-blur-md shadow-lg">
        {/* Score Badge */}
        <div className="flex items-center gap-1 bg-[#1a0508] px-2.5 py-1 rounded-lg border border-amber-500/40">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="font-serif text-sm font-bold text-amber-300">{score}</span>
          <span className="text-[9px] text-amber-500 font-mono">PTS</span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center gap-1.5 px-1">
          <div className="flex-1 h-2 rounded-full bg-neutral-900 border border-amber-500/40 overflow-hidden p-0.5">
            <motion.div
              animate={{ width: `${Math.min(100, (foodEatenCount / targetFoodCount) * 100)}%` }}
              transition={{ duration: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-yellow-200 shadow-[0_0_8px_#fde047]"
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-300 whitespace-nowrap">
            {foodEatenCount}/{targetFoodCount}
          </span>
        </div>

        {/* Mode Switch & Reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setControlMode(controlMode === 'joystick' ? 'touch' : 'joystick')}
            className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-[10px] font-sans font-bold text-amber-300 flex items-center gap-0.5 active:scale-95"
            title="Đổi cách điều khiển"
          >
            {controlMode === 'joystick' ? '🕹️ Cần Gạt' : '👆 Chạm'}
          </button>
          <button
            onClick={resetGame}
            title="Chơi lại"
            className="p-1 rounded-lg bg-neutral-900 border border-amber-500/30 text-amber-300 active:scale-90"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Desktop Status Bar & Energy Bar (>= 640px) */}
      <div className="hidden sm:flex w-full max-w-3xl items-center justify-between gap-4 mb-2.5 px-2">
        {/* Score & Progress */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5 bg-[#170508] border border-amber-500/40 px-3.5 py-1 rounded-xl shadow-inner">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Điểm Lộc:</span>
            <span className="font-serif text-lg font-bold text-amber-300">
              {score} <span className="text-xs font-sans text-amber-500">PTS</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-amber-300 font-medium">
              Tiến độ Long Khí:
            </span>
            <div className="w-48 h-3 rounded-full bg-neutral-900 border border-amber-500/40 overflow-hidden p-0.5">
              <motion.div
                animate={{ width: `${Math.min(100, (foodEatenCount / targetFoodCount) * 100)}%` }}
                transition={{ duration: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-yellow-200 shadow-[0_0_10px_#fde047]"
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              {foodEatenCount}/{targetFoodCount}
            </span>
          </div>
        </div>

        {/* Mode Toggle & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setControlMode(controlMode === 'touch' ? 'joystick' : 'touch')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-medium border flex items-center gap-1.5 transition-all ${
              controlMode === 'touch'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-neutral-900/60 border-neutral-700 text-neutral-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{controlMode === 'touch' ? 'Chuột / Cảm ứng' : 'Cần Gạt Ảo'}</span>
          </button>
          <button
            onClick={resetGame}
            title="Chơi lại từ đầu"
            className="p-1.5 rounded-lg bg-neutral-900 border border-amber-500/30 text-amber-300 hover:text-white hover:border-amber-400 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Main Canvas Arena (Responsive Height to Fit Mobile Without Scrolling) */}
      <div className="relative w-full max-w-4xl h-[56vh] sm:h-[500px] max-h-[600px] min-h-[350px] rounded-2xl border-2 border-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-center bg-black touch-none">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Mobile Left Thumb: 360° Virtual Joystick */}
        {controlMode === 'joystick' && !isSupernova && (
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
            className="absolute bottom-3 left-3 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/60 backdrop-blur-md border-2 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.25)] flex items-center justify-center touch-none select-none active:border-amber-300"
          >
            {/* Cardinal Dots */}
            <div className="absolute top-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="absolute left-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60" />

            {/* Inner Thumb Knob */}
            <div
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                transition: isJoystickActive ? 'none' : 'transform 0.15s ease-out',
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-300 border-2 border-amber-100 shadow-[0_0_15px_#fbbf24] flex items-center justify-center pointer-events-none"
            >
              <Compass className="w-5 h-5 text-amber-950 animate-pulse" />
            </div>
          </div>
        )}

        {/* Mobile Right Thumb: Speed Boost Button (TĂNG TỐC ⚡) */}
        {!isSupernova && (
          <button
            onPointerDown={startBoost}
            onPointerUp={stopBoost}
            onPointerLeave={stopBoost}
            onPointerCancel={stopBoost}
            className={`absolute bottom-3 right-3 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all touch-none select-none shadow-[0_0_25px_rgba(239,68,68,0.5)] active:scale-95 ${
              isBoosting
                ? 'bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-300 border-white scale-105 shadow-[0_0_35px_#f59e0b]'
                : 'bg-gradient-to-tr from-red-950/95 via-amber-950/85 to-black/95 border-amber-400/70'
            }`}
          >
            <Zap className={`w-6 h-6 sm:w-7 sm:h-7 ${isBoosting ? 'text-white animate-bounce' : 'text-amber-400'}`} />
            <span className="text-[9px] sm:text-[10px] font-sans font-bold text-amber-200 tracking-tighter uppercase mt-0.5">
              TĂNG TỐC
            </span>
          </button>
        )}

        {/* Desktop D-Pad if user prefers */}
        {controlMode === 'dpad' && !isSupernova && (
          <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center gap-1 bg-black/70 backdrop-blur-md p-2 rounded-2xl border border-amber-500/40 shadow-xl pointer-events-auto">
            <button
              onClick={() => handleDirectionBtn(-Math.PI / 2)}
              className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-200 active:scale-90 transition-transform"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => handleDirectionBtn(Math.PI)}
                className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-200 active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDirectionBtn(Math.PI / 2)}
                className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-200 active:scale-90 transition-transform"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDirectionBtn(0)}
                className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-200 active:scale-90 transition-transform"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Sleek Floating Guide Pill (Auto-fades on Interaction) */}
        {!hasInteracted && foodEatenCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-black/85 border border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.4)] backdrop-blur-md pointer-events-none text-center max-w-[92%]"
          >
            <span className="font-serif text-[10.5px] sm:text-xs font-bold text-amber-200 tracking-wide">
              ✦ Dùng cần gạt hoặc chạm lướt để săn ngọc ✦
            </span>
          </motion.div>
        )}

        {/* Supernova Celebration & Đại Lộc Reward Modal */}
        <AnimatePresence>
          {rewardRevealed && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="absolute z-40 mx-auto w-[92%] max-w-[340px] sm:max-w-md p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/98 via-[#180407]/98 to-red-950/98 border-2 border-amber-400 shadow-[0_25px_60px_rgba(251,191,36,0.7)] text-center backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Thần Long Đại Lộc Hoàng Kim</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-amber-200 font-normal">
                Voucher Hoàng Kim Khai Xuân
              </h3>
              <p className="text-2xl sm:text-4xl font-serif text-white font-extrabold mt-1">
                1.000.000 VNĐ
              </p>
              <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 text-xs font-sans text-emerald-400 font-medium">
                <Check className="w-4 h-4" />
                <span>+600 Điểm Phúc Lộc Hoàng Gia</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Instructions / Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-neutral-400 font-sans">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-[0_0_5px_#38bdf8]" />
          Thần Châu: +50
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_5px_#ef4444]" />
          Chữ LỘC: +60
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block shadow-[0_0_5px_#facc15]" />
          Kim Bảo: +80
        </span>
        <span className="hidden sm:inline text-amber-400/80">
          • Phím (↑ ↓ ← →) hoặc WASD • Space/Shift để tăng tốc
        </span>
      </div>
    </div>
  );
};
