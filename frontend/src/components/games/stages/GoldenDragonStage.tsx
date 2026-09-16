import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Check, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Zap, Flame } from 'lucide-react';
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

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
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
  const activePointersRef = useRef<Set<number>>(new Set());

  // Sprites
  const headSpriteRef = useRef<HTMLImageElement | null>(null);
  const tailSpriteRef = useRef<HTMLImageElement | null>(null);

  // Load high-definition sprites
  useEffect(() => {
    const headImg = new Image();
    headImg.src = '/assets/games/dragon_head_sprite.png';
    headImg.onload = () => {
      headSpriteRef.current = headImg;
    };

    const tailImg = new Image();
    tailImg.src = '/assets/games/dragon_tail_sprite.png';
    tailImg.onload = () => {
      tailSpriteRef.current = tailImg;
    };
  }, []);

  // Game state
  const [score, setScore] = useState<number>(0);
  const [foodEatenCount, setFoodEatenCount] = useState<number>(0);
  const [eatenTypes, setEatenTypes] = useState<Array<'pearl' | 'loc' | 'ingot'>>([]);
  const [combo, setCombo] = useState<number>(1);
  const [isSupernova, setIsSupernova] = useState<boolean>(false);
  const [rewardRevealed, setRewardRevealed] = useState<boolean>(false);
  const [controlMode, setControlMode] = useState<'hybrid' | 'joystick' | 'dpad'>('hybrid');
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [dragonLength, setDragonLength] = useState<number>(20);
  const targetFoodCount = 12;

  // Refs for animation loop & physics to avoid stale closures
  const stateRef = useRef({
    score: 0,
    foodEatenCount: 0,
    combo: 1,
    lastEatTime: 0,
    isSupernova: false,
    dragonHead: { x: 300, y: 300, angle: 0, speed: 3.4 },
    targetAngle: 0,
    segments: [] as Segment[],
    segmentDist: 10,
    foods: [] as FoodItem[],
    particles: [] as SparkParticle[],
    floatingTexts: [] as FloatingText[],
    shockwaves: [] as Shockwave[],
    width: 600,
    height: 500,
    pointerTarget: null as { x: number; y: number } | null,
    isPointerDown: false,
    travelDistance: 0,
    keysDown: {} as Record<string, boolean>,
    supernovaTimer: 0,
    isBoosting: false,
    scaleFactor: 1.0,
  });

  // Spawn random food on canvas
  const spawnFoods = useCallback((count: number) => {
    const s = stateRef.current;
    const types: Array<'pearl' | 'loc' | 'ingot'> = ['pearl', 'loc', 'ingot'];
    const margin = Math.round(50 * s.scaleFactor);
    const w = Math.max(280, s.width);
    const h = Math.max(260, s.height);

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const points = type === 'pearl' ? 50 : type === 'loc' ? 60 : 80;
      const label = type === 'pearl' ? 'THẦN CHÂU' : type === 'loc' ? 'LỘC' : 'KIM BẢO';
      s.foods.push({
        id: Date.now() + Math.random() * 10000,
        x: margin + Math.random() * (w - margin * 2),
        y: margin + Math.random() * (h - margin * 2),
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
    s.combo = 1;
    s.lastEatTime = 0;
    s.isSupernova = false;
    s.supernovaTimer = 0;
    s.isBoosting = false;
    s.travelDistance = 0;
    s.isPointerDown = false;
    s.dragonHead = { x: s.width / 2 || 200, y: s.height / 2 || 250, angle: 0, speed: 3.4 };
    s.targetAngle = 0;
    s.pointerTarget = null;
    s.particles = [];
    s.floatingTexts = [];
    s.shockwaves = [];
    s.foods = [];

    // Create 20 initial dragon segments neatly trailing behind head
    const initSegments: Segment[] = [];
    for (let i = 0; i < 20; i++) {
      initSegments.push({
        x: s.dragonHead.x - (i + 1) * s.segmentDist,
        y: s.dragonHead.y,
        angle: 0,
      });
    }
    s.segments = initSegments;

    // Spawn 5 initial food items
    spawnFoods(5);

    setScore(0);
    setFoodEatenCount(0);
    setEatenTypes([]);
    setCombo(1);
    setDragonLength(20);
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
    stateRef.current.dragonHead.speed = 3.4;
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
    const maxRadius = 38;
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);
    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: nx, y: ny });
    stateRef.current.targetAngle = angle;
    stateRef.current.pointerTarget = null;
  }, []);

  const handleJoystickTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    joystickTouchIdRef.current = touch.identifier;
    setIsJoystickActive(true);
    setHasInteracted(true);
    updateJoystick(touch.clientX, touch.clientY);
  }, [updateJoystick]);

  const handleJoystickTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  }, [updateJoystick]);

  const handleJoystickTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
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

    // Handle high DPI & dynamic resize with adaptive mobile scaling
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;

      // Adaptive scaling factor for mobile screens
      const scale = Math.min(1.0, Math.max(0.68, rect.width / 720));
      stateRef.current.scaleFactor = scale;
      stateRef.current.segmentDist = Math.round(11 * scale);
    };

    handleResize();
    resetGame();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const spawnSparks = (x: number, y: number, color: string, count: number) => {
      const s = stateRef.current;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (1.2 + Math.random() * 4.8) * s.scaleFactor;
        s.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: (1.8 + Math.random() * 3.6) * s.scaleFactor,
        });
      }
    };

    const addFloatingText = (x: number, y: number, text: string, color: string) => {
      stateRef.current.floatingTexts.push({
        id: Date.now() + Math.random(),
        x,
        y,
        text,
        color,
        alpha: 1,
        scale: 1.2,
        vy: -1.6,
      });
    };

    const addShockwave = (x: number, y: number, color: string) => {
      const s = stateRef.current;
      s.shockwaves.push({
        x,
        y,
        radius: 10 * s.scaleFactor,
        maxRadius: 60 * s.scaleFactor,
        color,
        alpha: 0.9,
      });
    };

    let lastTime = performance.now();

    const render = (currentTime?: number) => {
      const nowTime = currentTime || performance.now();
      const elapsed = nowTime - lastTime;
      lastTime = nowTime;

      // Normalized delta time: 1.0 at 60 FPS (16.667ms)
      // Clamped to [0.1, 2.0] to prevent sudden jumps if tab is throttled
      const dt = Math.min(2.0, Math.max(0.1, elapsed / 16.667));

      const s = stateRef.current;
      const w = s.width;
      const h = s.height;
      const sf = s.scaleFactor;

      // 1. UPDATE DRAGON POSITION & STEERING
      if (!s.isSupernova) {
        // Pointer target steering with arrival easing
        if (s.pointerTarget) {
          const dx = s.pointerTarget.x - s.dragonHead.x;
          const dy = s.pointerTarget.y - s.dragonHead.y;
          const dist = Math.hypot(dx, dy);

          // Only steer if beyond arrival threshold to avoid 180-degree flip snapping
          if (dist > 22 * sf) {
            s.targetAngle = Math.atan2(dy, dx);
          } else if (dist < 12 * sf && !s.isPointerDown) {
            // Once dragon arrives at a tapped destination, release target so it glides smoothly forward
            s.pointerTarget = null;
          }
        }

        // Smooth angle interpolation (lerp angle) with clamped turn rate per frame
        let diff = s.targetAngle - s.dragonHead.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        // Clamped turn rate per frame guarantees silky curved paths, never snapping
        const maxTurnRate = (s.isBoosting ? 0.14 : 0.095) * dt;
        const turnStep = Math.max(-maxTurnRate, Math.min(maxTurnRate, diff * 0.22 * dt));
        s.dragonHead.angle += turnStep;

        // Move head forward with dt scaling
        const baseSpeed = s.isBoosting ? 5.6 : 3.4;
        const currentSpeed = baseSpeed * sf * dt;
        s.dragonHead.speed = baseSpeed;
        s.dragonHead.x += Math.cos(s.dragonHead.angle) * currentSpeed;
        s.dragonHead.y += Math.sin(s.dragonHead.angle) * currentSpeed;
        s.travelDistance += currentSpeed;

        // Soft screen border repulsion and glide
        const margin = 28 * sf;
        if (s.dragonHead.x < margin * 1.8 && Math.cos(s.dragonHead.angle) < 0) {
          s.targetAngle = s.dragonHead.y > h / 2 ? -Math.PI * 0.35 : Math.PI * 0.35;
        } else if (s.dragonHead.x > w - margin * 1.8 && Math.cos(s.dragonHead.angle) > 0) {
          s.targetAngle = s.dragonHead.y > h / 2 ? -Math.PI * 0.65 : Math.PI * 0.65;
        }
        if (s.dragonHead.y < margin * 1.8 && Math.sin(s.dragonHead.angle) < 0) {
          s.targetAngle = s.dragonHead.x > w / 2 ? Math.PI * 0.8 : Math.PI * 0.2;
        } else if (s.dragonHead.y > h - margin * 1.8 && Math.sin(s.dragonHead.angle) > 0) {
          s.targetAngle = s.dragonHead.x > w / 2 ? -Math.PI * 0.8 : -Math.PI * 0.2;
        }

        // Hard perimeter clamp with momentum reflection (never gets stuck vibrating against walls)
        const hardMinX = 14 * sf;
        const hardMaxX = w - 14 * sf;
        const hardMinY = 14 * sf;
        const hardMaxY = h - 14 * sf;

        if (s.dragonHead.x < hardMinX) {
          s.dragonHead.x = hardMinX;
          if (Math.cos(s.dragonHead.angle) < 0) {
            s.dragonHead.angle = Math.PI - s.dragonHead.angle;
            s.targetAngle = s.dragonHead.angle;
            spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 2);
          }
        } else if (s.dragonHead.x > hardMaxX) {
          s.dragonHead.x = hardMaxX;
          if (Math.cos(s.dragonHead.angle) > 0) {
            s.dragonHead.angle = Math.PI - s.dragonHead.angle;
            s.targetAngle = s.dragonHead.angle;
            spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 2);
          }
        }

        if (s.dragonHead.y < hardMinY) {
          s.dragonHead.y = hardMinY;
          if (Math.sin(s.dragonHead.angle) < 0) {
            s.dragonHead.angle = -s.dragonHead.angle;
            s.targetAngle = s.dragonHead.angle;
            spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 2);
          }
        } else if (s.dragonHead.y > hardMaxY) {
          s.dragonHead.y = hardMaxY;
          if (Math.sin(s.dragonHead.angle) > 0) {
            s.dragonHead.angle = -s.dragonHead.angle;
            s.targetAngle = s.dragonHead.angle;
            spawnSparks(s.dragonHead.x, s.dragonHead.y, '#f59e0b', 2);
          }
        }
      } else {
        // Supernova victory spiral
        s.supernovaTimer += 0.035 * dt;
        s.dragonHead.angle += 0.055 * dt;
        const speed = 5.8 * sf * dt;
        s.dragonHead.x += Math.cos(s.dragonHead.angle) * speed;
        s.dragonHead.y += Math.sin(s.dragonHead.angle) * speed;
        s.travelDistance += speed;

        // Loop inside arena
        if (s.dragonHead.x < 30) s.dragonHead.x = w - 30;
        if (s.dragonHead.x > w - 30) s.dragonHead.x = 30;
        if (s.dragonHead.y < 30) s.dragonHead.y = h - 30;
        if (s.dragonHead.y > h - 30) s.dragonHead.y = 30;
      }

      // 2. INVERSE KINEMATICS FOR DRAGON SPINE & SEGMENTS
      // Keeps physical vertebra anchors clean and uncorrupted by wave offsets
      let prevX = s.dragonHead.x;
      let prevY = s.dragonHead.y;

      for (let i = 0; i < s.segments.length; i++) {
        const seg = s.segments[i];
        const dx = prevX - seg.x;
        const dy = prevY - seg.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.0001) {
          seg.angle = Math.atan2(dy, dx);
          seg.x = prevX - Math.cos(seg.angle) * s.segmentDist;
          seg.y = prevY - Math.sin(seg.angle) * s.segmentDist;
        }

        prevX = seg.x;
        prevY = seg.y;
      }

      // Dragon breath / flame embers from tail
      if (Math.random() < (s.isBoosting ? 0.95 : 0.55) && s.segments.length > 0) {
        const tail = s.segments[s.segments.length - 1];
        s.particles.push({
          x: tail.x + (Math.random() - 0.5) * 6 * sf,
          y: tail.y + (Math.random() - 0.5) * 6 * sf,
          vx: -Math.cos(tail.angle) * ((s.isBoosting ? 4.0 : 1.7) + Math.random() * 2) * sf,
          vy: -Math.sin(tail.angle) * ((s.isBoosting ? 4.0 : 1.7) + Math.random() * 2) * sf,
          alpha: 0.95,
          color: s.isBoosting ? '#ef4444' : (Math.random() > 0.4 ? '#fde047' : '#f97316'),
          size: (s.isBoosting ? 3.8 : 2.2) * sf + Math.random() * 2.5 * sf,
        });
      }

      // 3. CHECK FOOD CONSUMPTION & COMBOS
      const now = Date.now();
      const eatDistance = 38 * sf;

      for (let i = s.foods.length - 1; i >= 0; i--) {
        const food = s.foods[i];
        const dist = Math.hypot(s.dragonHead.x - food.x, s.dragonHead.y - food.y);

        if (dist < eatDistance) {
          // Calculate combo
          let currentCombo = 1;
          if (now - s.lastEatTime < 3200) {
            currentCombo = Math.min(4, s.combo + 1);
          }
          s.combo = currentCombo;
          s.lastEatTime = now;
          setCombo(currentCombo);

          const gainedPoints = Math.round(food.points * (currentCombo > 1 ? 1 + (currentCombo - 1) * 0.25 : 1));
          const newScore = s.score + gainedPoints;
          const newCount = s.foodEatenCount + 1;

          s.score = newScore;
          s.foodEatenCount = newCount;
          setScore(newScore);
          setFoodEatenCount(newCount);
          setEatenTypes((prev) => [...prev, food.type]);

          // Dragon audio & haptics
          sound.playClick(soundEnabled);
          sound.playCount(soundEnabled);
          triggerHaptic([20, 30]);
          track('TAP_DRAGON', 1);
          track('TAP_CELESTIAL_PEARL', gainedPoints);

          // Add 2 segments to dragon body (grows longer!)
          const lastSeg = s.segments[s.segments.length - 1] || {
            x: s.dragonHead.x,
            y: s.dragonHead.y,
            angle: s.dragonHead.angle,
          };
          s.segments.push({
            x: lastSeg.x - Math.cos(lastSeg.angle) * s.segmentDist,
            y: lastSeg.y - Math.sin(lastSeg.angle) * s.segmentDist,
            angle: lastSeg.angle,
          });
          s.segments.push({
            x: lastSeg.x - Math.cos(lastSeg.angle) * s.segmentDist * 2,
            y: lastSeg.y - Math.sin(lastSeg.angle) * s.segmentDist * 2,
            angle: lastSeg.angle,
          });
          setDragonLength(s.segments.length);

          // Floating text & shockwave FX
          const foodColor = food.type === 'pearl' ? '#38bdf8' : food.type === 'loc' ? '#ef4444' : '#fbbf24';
          const textLabel = currentCombo > 1 ? `+${gainedPoints} (x${currentCombo}!)` : `+${gainedPoints} ${food.label}`;
          addFloatingText(food.x, food.y - 12, textLabel, foodColor);
          addShockwave(food.x, food.y, foodColor);
          spawnSparks(food.x, food.y, foodColor, 20);

          // Remove eaten food
          s.foods.splice(i, 1);

          // Check Supernova Victory Condition
          if (newCount >= targetFoodCount && !s.isSupernova) {
            s.isSupernova = true;
            setIsSupernova(true);
            sound.playFireworkBurst(soundEnabled);
            sound.playReward(soundEnabled);
            triggerHaptic([40, 80, 40, 80, 200]);

            // Grand Fireworks launch
            for (let k = 0; k < 60; k++) {
              spawnSparks(w / 2, h / 2, '#fde047', 40);
            }

            setTimeout(() => {
              setRewardRevealed(true);
              sound.playWin(soundEnabled);

              setTimeout(() => {
                onComplete(600);
              }, 2600);
            }, 1200);
          } else {
            // Respawn new food item to maintain food density
            if (s.foods.length < 5) {
              spawnFoods(1);
            }
          }
        }
      }

      // Combo expiration check
      if (s.combo > 1 && now - s.lastEatTime > 3200) {
        s.combo = 1;
        setCombo(1);
      }

      // 4. CANVAS RENDERING
      ctx.clearRect(0, 0, w, h);

      // Deep Palace Silk Grid Background
      ctx.fillStyle = '#070204';
      ctx.fillRect(0, 0, w, h);

      // Radial palace vignette
      const palaceGrad = ctx.createRadialGradient(w / 2, h / 2, 60 * sf, w / 2, h / 2, Math.max(w, h) * 0.75);
      palaceGrad.addColorStop(0, '#150308');
      palaceGrad.addColorStop(0.55, '#0a0104');
      palaceGrad.addColorStop(1, '#020002');
      ctx.fillStyle = palaceGrad;
      ctx.fillRect(0, 0, w, h);

      // Celestial Floating Starlight Embers
      const time = Date.now() * 0.001;
      for (let star = 0; star < 22; star++) {
        const sx = ((star * 73 + time * 12) % (w - 20)) + 10;
        const sy = ((star * 97 + Math.sin(time * 0.5 + star) * 30) % (h - 20)) + 10;
        const salpha = 0.25 + 0.25 * Math.sin(time * 2 + star);
        ctx.fillStyle = `rgba(251, 191, 36, ${salpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2 * sf, 0, Math.PI * 2);
        ctx.fill();
      }

      // Auspicious cloud mist (Vân Mây Cát Tường)
      const cloudTime = Date.now() * 0.0003;
      for (let c = 0; c < 3; c++) {
        const cx = ((c * 260 + cloudTime * 45) % (w + 200)) - 100;
        const cy = 80 + c * 120 + Math.sin(cloudTime + c) * 25;
        const cloudGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130 * sf);
        cloudGrad.addColorStop(0, 'rgba(185, 28, 28, 0.15)');
        cloudGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.05)');
        cloudGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 130 * sf, 0, Math.PI * 2);
        ctx.fill();
      }

      // Oriental Four Corner Golden Filigree Ornaments
      const cornerSize = 22 * sf;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.4;

      // Top-Left Corner
      ctx.beginPath();
      ctx.moveTo(10, 10 + cornerSize);
      ctx.lineTo(10, 10);
      ctx.lineTo(10 + cornerSize, 10);
      ctx.stroke();

      // Top-Right Corner
      ctx.beginPath();
      ctx.moveTo(w - 10, 10 + cornerSize);
      ctx.lineTo(w - 10, 10);
      ctx.lineTo(w - 10 - cornerSize, 10);
      ctx.stroke();

      // Bottom-Left Corner
      ctx.beginPath();
      ctx.moveTo(10, h - 10 - cornerSize);
      ctx.lineTo(10, h - 10);
      ctx.lineTo(10 + cornerSize, h - 10);
      ctx.stroke();

      // Bottom-Right Corner
      ctx.beginPath();
      ctx.moveTo(w - 10, h - 10 - cornerSize);
      ctx.lineTo(w - 10, h - 10);
      ctx.lineTo(w - 10 - cornerSize, h - 10);
      ctx.stroke();

      // Celestial Target Reticle (Chạm Dẫn Đường Thông Minh)
      if (s.pointerTarget && !s.isSupernova) {
        ctx.save();
        const pulse = Math.sin(Date.now() * 0.009) * 3 * sf;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(s.pointerTarget.x, s.pointerTarget.y, (16 + pulse) * sf, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.arc(s.pointerTarget.x, s.pointerTarget.y, 6 * sf, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(s.pointerTarget.x, s.pointerTarget.y, 2.5 * sf, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Shockwave Animations
      for (let i = s.shockwaves.length - 1; i >= 0; i--) {
        const sw = s.shockwaves[i];
        sw.radius += 2.5 * sf * dt;
        sw.alpha -= 0.035 * dt;
        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          s.shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Radial ambient lighting around dragon head
      const glowGrad = ctx.createRadialGradient(
        s.dragonHead.x,
        s.dragonHead.y,
        8 * sf,
        s.dragonHead.x,
        s.dragonHead.y,
        (s.isBoosting ? 260 : 210) * sf
      );
      glowGrad.addColorStop(0, s.isBoosting ? 'rgba(239, 68, 68, 0.45)' : 'rgba(251, 191, 36, 0.32)');
      glowGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.12)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Speed boost fiery aura
      if (s.isBoosting) {
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(s.dragonHead.x, s.dragonHead.y, (34 + Math.random() * 5) * sf, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= 0.022 * dt;

        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Foods (Mồi Săn)
      s.foods.forEach((food) => {
        food.pulse += 0.055 * dt;
        const scale = (1 + Math.sin(food.pulse) * 0.14) * sf;

        ctx.save();
        ctx.translate(food.x, food.y);
        ctx.scale(scale, scale);

        if (food.type === 'pearl') {
          // 1. Ngọc Rồng Thần Châu (+50 PTS)
          const haloGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 24);
          haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.65)');
          haloGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.2)');
          haloGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fill();

          const pearlGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 13);
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
          const locHalo = ctx.createRadialGradient(0, 0, 10, 0, 0, 26);
          locHalo.addColorStop(0, 'rgba(239, 68, 68, 0.65)');
          locHalo.addColorStop(0.7, 'rgba(245, 158, 11, 0.25)');
          locHalo.addColorStop(1, 'transparent');
          ctx.fillStyle = locHalo;
          ctx.beginPath();
          ctx.arc(0, 0, 26, 0, Math.PI * 2);
          ctx.fill();

          const locGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 14);
          locGrad.addColorStop(0, '#ef4444');
          locGrad.addColorStop(0.75, '#991b1b');
          locGrad.addColorStop(1, '#450a0a');
          ctx.fillStyle = locGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px "Playfair Display", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('LỘC', 0, 1);
        } else {
          // 3. Kim Nguyên Bảo (+80 PTS)
          const ingotHalo = ctx.createRadialGradient(0, 0, 8, 0, 0, 25);
          ingotHalo.addColorStop(0, 'rgba(250, 204, 21, 0.65)');
          ingotHalo.addColorStop(0.7, 'rgba(217, 119, 6, 0.25)');
          ingotHalo.addColorStop(1, 'transparent');
          ctx.fillStyle = ingotHalo;
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.ellipse(0, 4.5, 13, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          const topGrad = ctx.createRadialGradient(0, -3, 2, 0, -2, 11);
          topGrad.addColorStop(0, '#fef08a');
          topGrad.addColorStop(0.5, '#eab308');
          topGrad.addColorStop(1, '#a16207');
          ctx.fillStyle = topGrad;
          ctx.beginPath();
          ctx.ellipse(0, -1, 10, 6.5, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef9c3';
          ctx.beginPath();
          ctx.ellipse(0, -3, 5.5, 3.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 5. DRAW DRAGON TAIL (High-definition Tail Sprite or Royal Feather Tuft)
      if (s.segments.length > 0) {
        const lastIdx = s.segments.length - 1;
        const tail = s.segments[lastIdx];
        const envelope = Math.sin((lastIdx / s.segments.length) * Math.PI);
        const wave = Math.sin(s.travelDistance * 0.055 - lastIdx * 0.36) * (3.0 * sf * envelope);
        const waveAngle = tail.angle + Math.PI / 2;
        const tailDrawX = tail.x + Math.cos(waveAngle) * wave;
        const tailDrawY = tail.y + Math.sin(waveAngle) * wave;

        ctx.save();
        ctx.translate(tailDrawX, tailDrawY);
        ctx.rotate(tail.angle);

        if (tailSpriteRef.current && tailSpriteRef.current.complete) {
          // Tail sprite: 1000 x 525 (ratio 1.90)
          const tailW = 82 * sf;
          const tailH = (tailW * 525) / 1000;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 16 * sf;
          ctx.drawImage(tailSpriteRef.current, -tailW * 0.88, -tailH / 2, tailW, tailH);
        } else {
          // Procedural fallback
          const tailGlow = ctx.createRadialGradient(0, 0, 4, -20, 0, 36);
          tailGlow.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
          tailGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.65)');
          tailGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = tailGlow;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-15 * sf, -16 * sf, -36 * sf, -12 * sf);
          ctx.quadraticCurveTo(-22 * sf, -4 * sf, 0, 0);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-20 * sf, 0, -44 * sf, 0);
          ctx.quadraticCurveTo(-20 * sf, 4 * sf, 0, 0);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-15 * sf, 16 * sf, -36 * sf, 12 * sf);
          ctx.quadraticCurveTo(-22 * sf, 4 * sf, 0, 0);
          ctx.fill();
        }

        ctx.restore();
      }

      // 6. DRAW SERPENTINE DRAGON BODY (Continuous Muscular Overlapping Scales & Flame Spine)
      for (let i = s.segments.length - 1; i >= 0; i--) {
        const seg = s.segments[i];
        const t = i / Math.max(1, s.segments.length);
        // Taper smoothly: 20px near neck down to 10px at tail tip (scaled by sf)
        const radius = (20 * (1 - t * 0.48) + 4) * sf;

        // Visual serpentine undulation wave - smooth sine traveling wave driven by travel distance!
        const envelope = Math.sin((i / s.segments.length) * Math.PI);
        const wave = Math.sin(s.travelDistance * 0.055 - i * 0.36) * (3.0 * sf * envelope);
        const waveAngle = seg.angle + Math.PI / 2;
        const drawX = seg.x + Math.cos(waveAngle) * wave;
        const drawY = seg.y + Math.sin(waveAngle) * wave;

        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(seg.angle);

        // Ambient glowing aura
        ctx.shadowColor = s.isBoosting ? '#ef4444' : 'rgba(251, 191, 36, 0.45)';
        ctx.shadowBlur = (s.isBoosting ? 15 : 7) * sf;

        // Base Scale Body Gradient: Liquid 24K Gold to deep lacquer amber
        const scaleGrad = ctx.createRadialGradient(0, -radius * 0.25, 2, 0, 0, radius);
        scaleGrad.addColorStop(0, '#fffbeb');
        scaleGrad.addColorStop(0.32, '#fbbf24');
        scaleGrad.addColorStop(0.72, '#b45309');
        scaleGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = scaleGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Elegant Oriental Shingle Scales (Vảy Rồng Cung Đình)
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
        ctx.lineWidth = 1.4 * sf;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.86, -Math.PI * 0.6, Math.PI * 0.6);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
        ctx.lineWidth = 1.0 * sf;
        ctx.beginPath();
        ctx.arc(-radius * 0.35, 0, radius * 0.6, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.stroke();

        // Undulating Dorsal Flame Fin (Vây Lưng Rồng Lửa)
        const finWave = Math.sin(s.travelDistance * 0.075 - i * 0.38) * 3.4 * sf;
        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.5, -radius * 0.85);
        ctx.quadraticCurveTo(0, -radius * 1.4 - finWave, radius * 0.5, -radius * 0.85);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-radius * 0.5, radius * 0.85);
        ctx.quadraticCurveTo(0, radius * 1.4 + finWave, radius * 0.5, radius * 0.85);
        ctx.fill();

        // Ruby Dragon Spine Ridge (Sống Lưng Long Khí)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.45, 2.2 * sf, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 7. DRAW DRAGON HEAD (High-definition Imperial Head Sprite or Majestic Procedural)
      ctx.save();
      ctx.translate(s.dragonHead.x, s.dragonHead.y);
      ctx.rotate(s.dragonHead.angle);

      if (headSpriteRef.current && headSpriteRef.current.complete) {
        // High-definition Imperial Dragon Head Sprite
        // Clean sprite ratio: 819w x 778h (ratio: 1.053)
        const headW = 86 * sf;
        const headH = (headW * 778) / 819;
        ctx.shadowColor = s.isBoosting ? '#ef4444' : '#fbbf24';
        ctx.shadowBlur = (s.isBoosting ? 24 : 14) * sf;

        // Snout is to the right (+X), fiery mane streams to the left (-X)
        ctx.drawImage(headSpriteRef.current, -headW * 0.65, -headH / 2, headW, headH);
      } else {
        // Fallback procedural head
        const headGrad = ctx.createRadialGradient(4, 0, 3, 0, 0, 22 * sf);
        headGrad.addColorStop(0, '#fffbeb');
        headGrad.addColorStop(0.3, '#fde047');
        headGrad.addColorStop(0.7, '#d97706');
        headGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.ellipse(4 * sf, 0, 20 * sf, 14 * sf, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(8 * sf, -6 * sf, 4.5 * sf, 0, Math.PI * 2);
        ctx.arc(8 * sf, 6 * sf, 4.5 * sf, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 8. DRAW FLOATING TEXTS (Score floaters & Combos)
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.alpha -= 0.024 * dt;
        ft.scale = Math.max(1, ft.scale - 0.008 * dt);

        if (ft.alpha <= 0) {
          s.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = `bold ${Math.round(12 * sf)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      // Request next frame
      animationFrameId = requestAnimationFrame(render);
    };

    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [resetGame, soundEnabled, spawnFoods, track]);

  // Touch and pointer handlers: Unified Mobile Hybrid Controls with Pointer Events & Multi-touch Boost
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}

    activePointersRef.current.add(e.pointerId);
    if (activePointersRef.current.size >= 2) {
      startBoost();
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    stateRef.current.pointerTarget = { x, y };
    stateRef.current.isPointerDown = true;
    setHasInteracted(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (stateRef.current.isPointerDown || e.buttons > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      stateRef.current.pointerTarget = { x, y };
      setHasInteracted(true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {}

    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2 && isBoosting) {
      stopBoost();
    }

    if (activePointersRef.current.size === 0) {
      stateRef.current.isPointerDown = false;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2 && isBoosting) {
      stopBoost();
    }
    if (activePointersRef.current.size === 0) {
      stateRef.current.isPointerDown = false;
      stateRef.current.pointerTarget = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center select-none py-0 sm:py-1 px-1 sm:px-3 touch-none overscroll-none"
    >
      {/* 1. ROYAL INTEGRATED HUD BAR (Zero-Scroll & Mobile Optimized) */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-4 py-1.5 sm:py-2 mb-1.5 sm:mb-2 rounded-2xl bg-[#0c1017]/90 border border-[#d4af37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Left: Imperial Score Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#1a070a] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#d4af37]/40 shadow-inner">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#fbbf24] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8.5px] sm:text-[9px] font-sans uppercase tracking-wider text-neutral-400 leading-none">
                Điểm Lộc
              </span>
              <span className="font-serif-editorial text-xs sm:text-base font-bold text-[#fef08a] leading-tight">
                {score} <span className="text-[8px] sm:text-[9px] font-mono-num text-[#d4af37]">PTS</span>
              </span>
            </div>
          </div>

          {/* Combo Multiplier pill */}
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white text-[9px] sm:text-[10px] font-bold shadow-[0_0_10px_#ef4444]"
            >
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200 animate-bounce" />
              <span>x{combo}</span>
            </motion.div>
          )}
        </div>

        {/* Center: Long Khí 12 Bảo Ngọc Meter */}
        <div className="flex-1 max-w-[190px] sm:max-w-sm flex flex-col items-center justify-center px-1">
          <div className="w-full flex items-center justify-between text-[9.5px] sm:text-[11px] font-sans font-semibold text-neutral-300 mb-0.5 sm:mb-1">
            <span className="flex items-center gap-1 text-[#f5e6c8] truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-ping" />
              <span className="hidden xs:inline">Long Khí:</span>
            </span>
            <span className="font-mono-num font-bold text-[#fbbf24]">
              {foodEatenCount}/{targetFoodCount}
            </span>
          </div>

          {/* 12 Jewel Slots Bar */}
          <div className="w-full grid grid-cols-12 gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-md sm:rounded-lg bg-black/60 border border-[#d4af37]/30 shadow-inner">
            {Array.from({ length: targetFoodCount }).map((_, index) => {
              const isCollected = index < foodEatenCount;
              const type = eatenTypes[index] || 'pearl';

              return (
                <div
                  key={index}
                  className={`h-2 sm:h-3 rounded-[2px] sm:rounded-sm transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                    isCollected
                      ? type === 'pearl'
                        ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
                        : type === 'loc'
                        ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                        : 'bg-amber-400 shadow-[0_0_8px_#facc15]'
                      : 'bg-neutral-800/80 border border-neutral-700/50'
                  }`}
                  title={isCollected ? `Bảo ngọc #${index + 1}` : 'Chưa thu thập'}
                >
                  {isCollected && (
                    <motion.div
                      initial={{ scale: 1.5, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full bg-white/30"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Mode Switcher & Replay Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dragon Length Pill */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#121624] border border-[#d4af37]/30 text-[10.5px] font-sans text-neutral-300">
            <span className="text-neutral-400">Thân:</span>
            <span className="font-mono-num font-bold text-[#fbbf24]">{dragonLength} đốt</span>
          </div>

          {/* Mode Switch Button */}
          <button
            onClick={() => {
              const nextMode = controlMode === 'hybrid' ? 'joystick' : controlMode === 'joystick' ? 'dpad' : 'hybrid';
              setControlMode(nextMode);
              sound.playClick(soundEnabled);
            }}
            className="px-2 sm:px-2.5 py-1 rounded-xl bg-[#121624] border border-[#d4af37]/40 text-[10px] sm:text-xs font-sans font-medium text-[#f5e6c8] flex items-center gap-1 hover:border-[#d4af37] active:scale-95 transition-all shadow-md"
            title="Đổi cách điều khiển"
          >
            {controlMode === 'hybrid' && '👆 Vuốt Chạm'}
            {controlMode === 'joystick' && '🕹️ Cần Gạt'}
            {controlMode === 'dpad' && '⌨️ Phím Ảo'}
          </button>

          {/* Replay Button */}
          <button
            onClick={resetGame}
            title="Chơi lại từ đầu"
            className="p-1 sm:p-2 rounded-xl bg-[#121624] border border-[#d4af37]/40 text-[#fbbf24] hover:text-white hover:border-[#d4af37] active:scale-90 transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN CANVAS ARENA (Mobile Responsive Height & Touch First) */}
      <div className="relative w-full max-w-4xl h-[calc(100dvh-150px)] sm:h-[min(570px,calc(100dvh-190px))] max-h-[620px] min-h-[380px] rounded-2xl border-2 border-[#d4af37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-center bg-black touch-none overscroll-none select-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="w-full h-full cursor-crosshair touch-none select-none"
        />

        {/* Mobile Left Thumb: 360° Virtual Joystick (Available in joystick and hybrid modes) */}
        {(controlMode === 'joystick' || controlMode === 'hybrid') && !isSupernova && (
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
            className="absolute bottom-3 left-3 z-20 w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-black/70 backdrop-blur-md border-2 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center touch-none select-none active:border-amber-300"
            title="Cần gạt ảo 360 độ"
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
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-300 border-2 border-amber-100 shadow-[0_0_15px_#fbbf24] flex items-center justify-center pointer-events-none"
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 animate-pulse" />
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
            onTouchStart={(e) => {
              e.stopPropagation();
              startBoost();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              stopBoost();
            }}
            className={`absolute bottom-3 right-3 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all touch-none select-none shadow-[0_0_25px_rgba(239,68,68,0.55)] active:scale-95 ${
              isBoosting
                ? 'bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-300 border-white scale-105 shadow-[0_0_35px_#f59e0b]'
                : 'bg-gradient-to-tr from-red-950/95 via-amber-950/85 to-black/95 border-amber-400/70'
            }`}
            title="Nhấn giữ để tăng tốc bứt phá"
          >
            <Zap className={`w-5 h-5 sm:w-7 sm:h-7 ${isBoosting ? 'text-white animate-bounce' : 'text-amber-400'}`} />
            <span className="text-[8.5px] sm:text-[10px] font-sans font-bold text-amber-200 tracking-tighter uppercase mt-0.5">
              TĂNG TỐC
            </span>
          </button>
        )}

        {/* Desktop / Optional D-Pad */}
        {controlMode === 'dpad' && !isSupernova && (
          <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center gap-1 bg-black/75 backdrop-blur-md p-2 rounded-2xl border border-amber-500/40 shadow-xl pointer-events-auto">
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

        {/* Floating Guide Pill (Auto-fades on Interaction) */}
        {!hasInteracted && foodEatenCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-black/85 border border-[#d4af37]/70 shadow-[0_0_20px_rgba(212,175,55,0.45)] backdrop-blur-md pointer-events-none text-center max-w-[92%]"
          >
            <span className="font-serif-editorial text-[10.5px] sm:text-xs font-bold text-[#fef08a] tracking-wide whitespace-nowrap">
              ✦ Vuốt ngón tay hoặc dùng cần gạt để dẫn đường Thần Long ✦
            </span>
          </motion.div>
        )}

        {/* Supernova Celebration & Đại Lộc Reward Modal (Sắc Chỉ Hoàng Kim) */}
        <AnimatePresence>
          {rewardRevealed && (
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="absolute z-40 mx-auto w-[92%] max-w-[350px] sm:max-w-md p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#1c060a] via-[#100305] to-[#080203] border-2 border-[#d4af37] shadow-[0_25px_60px_rgba(212,175,55,0.7)] text-center backdrop-blur-2xl"
            >
              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fde047] text-[10px] font-sans font-bold uppercase tracking-widest mb-2.5 sm:mb-3">
                <Award className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>✦ THẦN LONG KHAI XUÂN ✦</span>
              </div>

              {/* Title */}
              <h3 className="font-serif-editorial text-xl sm:text-2xl text-[#fef08a] font-bold">
                Sắc Chỉ Đại Lộc Hoàng Kim
              </h3>
              <p className="text-xs text-neutral-300 font-sans mt-1">
                Thần Long đã hấp thu trọn vẹn 12 Bảo Ngọc Long Khí
              </p>

              {/* Voucher Value */}
              <div className="my-3 sm:my-4 py-2 px-3 rounded-xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-red-950/60 border border-[#d4af37]/40">
                <span className="text-[9.5px] sm:text-[10px] font-sans uppercase tracking-wider text-[#d4af37] block">
                  Đại Lộc Khai Xuân
                </span>
                <p className="text-2xl sm:text-4xl font-serif-editorial text-white font-extrabold mt-0.5 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                  1.000.000 VNĐ
                </p>
              </div>

              {/* Reward points badge */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-sans text-emerald-400 font-medium">
                <Check className="w-4 h-4" />
                <span>+600 Điểm Phúc Lộc Hoàng Gia</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. FOOTER LEGEND & CONTROLS HINT */}
      <div className="mt-1.5 sm:mt-2 w-full max-w-4xl flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-2 text-[10px] sm:text-[11.5px] text-neutral-400 font-sans">
        {/* Food types legend */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-[0_0_6px_#38bdf8]" />
            Thần Châu: <strong className="text-neutral-200">+50</strong>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_6px_#ef4444]" />
            Chữ LỘC: <strong className="text-neutral-200">+60</strong>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block shadow-[0_0_6px_#facc15]" />
            Kim Bảo: <strong className="text-neutral-200">+80</strong>
          </span>
        </div>

        {/* Keyboard hints for desktop */}
        <div className="hidden sm:flex items-center gap-1 text-[#d4af37]/90 font-mono-num text-[10.5px]">
          <span>Phím (↑ ↓ ← →) hoặc WASD</span>
          <span>•</span>
          <span>Space / Shift tăng tốc</span>
        </div>
      </div>
    </div>
  );
};
