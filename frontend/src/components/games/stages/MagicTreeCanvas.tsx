import React, { useEffect, useRef } from 'react';

interface MagicTreeCanvasProps {
  isActive: boolean;
  energyLevel?: number;
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  life: number;
  maxLife: number;
  isStar?: boolean;
}

export const MagicTreeCanvas: React.FC<MagicTreeCanvasProps> = ({
  isActive,
  energyLevel = 0,
  width = 400,
  height = 460,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const particles: Particle[] = [];

    const colors = [
      '#FFFBEB', // White gold
      '#FEF08A', // Pale bright yellow
      '#FACC15', // Vibrant gold
      '#FDE047', // Stardust yellow
      '#67E8F9', // Cyan sparkle
      '#FFFFFF', // Pure white
    ];

    const spawnSpiralParticles = (waveProgress: number) => {
      // 3D conical helix parameters matching the Christmas tree shape
      const topY = height * 0.12;
      const treeHeight = height * 0.72;
      const baseRadius = width * 0.40;
      const loops = 4.2;

      // Spawn a burst of stardust points around the traveling wave
      const count = isActive ? (10 + energyLevel * 4) : (2 + energyLevel);
      for (let i = 0; i < count; i++) {
        // t goes from 0 (top star) to 1 (base presents)
        const tOffset = (Math.random() - 0.5) * 0.12;
        const t = Math.max(0, Math.min(1, waveProgress + tOffset));

        const angle = t * loops * Math.PI * 2 + time * 3.5;
        const r = baseRadius * Math.pow(t, 0.92) + (Math.random() - 0.5) * 18;

        const centerX = width * 0.5;
        const x = centerX + Math.cos(angle) * r;
        const y = topY + t * treeHeight + (Math.random() - 0.5) * 10;
        const z = Math.sin(angle); // Depth factor (-1 to +1)

        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 0.6 - 0.2,
          size: (1.5 + Math.random() * 3.2) * (z > 0 ? 1.2 : 0.75),
          alpha: 0.1,
          maxAlpha: z > 0 ? 0.95 : 0.45,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 30 + Math.random() * 25,
          isStar: Math.random() > 0.65,
        });
      }
    };

    const drawSparkleStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = size * 2.5;

      // 4-point sparkle star
      context.beginPath();
      context.moveTo(cx, cy - size);
      context.quadraticCurveTo(cx, cy, cx + size, cy);
      context.quadraticCurveTo(cx, cy, cx, cy + size);
      context.quadraticCurveTo(cx, cy, cx - size, cy);
      context.quadraticCurveTo(cx, cy, cx, cy - size);
      context.closePath();
      context.fill();

      // Center bright core
      context.fillStyle = '#ffffff';
      context.beginPath();
      context.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
      context.fill();

      context.restore();
    };

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Continuous spiral stardust wave: traveling up and down the tree
      const waveCycle = (time * 0.6) % 1;
      // Invert so wave travels gracefully from base up to the star
      const waveProgress = 1 - waveCycle;

      spawnSpiralParticles(waveProgress);

      // Extra sparkles around top star when active
      if (isActive && Math.random() > 0.3) {
        particles.push({
          x: width * 0.5 + (Math.random() - 0.5) * 24,
          y: height * 0.1 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: 2 + Math.random() * 4,
          alpha: 0.1,
          maxAlpha: 1.0,
          color: '#FFFBEB',
          life: 0,
          maxLife: 40,
          isStar: true,
        });
      }

      // Update & render all particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in then fade out
        const halfLife = p.maxLife * 0.4;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * p.maxAlpha;
        } else {
          p.alpha = (1 - (p.life - halfLife) / (p.maxLife - halfLife)) * p.maxAlpha;
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        if (p.isStar) {
          drawSparkleStar(ctx, p.x, p.y, p.size * 1.8, p.color, p.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size * 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full pointer-events-none z-30 mix-blend-screen"
    />
  );
};
