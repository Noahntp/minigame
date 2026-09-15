/**
 * ParticleEngine - High Performance 2D Canvas VFX System
 * Supports Hearts, Petals, Snow, Gold Coins, Fireworks, Sparkles, and Confetti.
 */
export class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.fireworks = [];
    this.animId = null;
    this.isRunning = false;

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  clear() {
    this.particles = [];
    this.fireworks = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      this.update();
      this.render();
      if (this.isRunning) {
        this.animId = requestAnimationFrame(loop);
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.clear();
  }

  // --- Particle Generators ---

  // 1. Burst of Floating Hearts (Valentine)
  burstHearts(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      const colors = ['#ff2a6d', '#ff598f', '#fd1d59', '#ff94b9', '#ffc2d1', '#ffd700'];
      this.particles.push({
        type: 'heart',
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 12 + Math.random() * 18,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: (Math.random() - 0.5) * 0.8,
        vRot: (Math.random() - 0.5) * 0.05,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.015,
        gravity: 0.06
      });
    }
    this.start();
  }

  // 2. Blooming Petals (8.3 / 20.10)
  burstPetals(x, y, count = 40) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;
      const colors = ['#ff758c', '#ff7eb3', '#fbc2eb', '#fad0c4', '#ffa07a', '#ffe4e1'];
      this.particles.push({
        type: 'petal',
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 10 + Math.random() * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.08,
        alpha: 1,
        decay: 0.008 + Math.random() * 0.012,
        swaySpeed: 0.03 + Math.random() * 0.04,
        swayAmp: 0.8 + Math.random() * 1.5,
        swayPhase: Math.random() * Math.PI * 2,
        gravity: 0.04
      });
    }
    this.start();
  }

  // 3. Falling Snowflakes (Noel)
  addSnowflakes(count = 25) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'snow',
        x: Math.random() * this.width,
        y: -10 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 1 + Math.random() * 2,
        size: 3 + Math.random() * 6,
        color: '#ffffff',
        alpha: 0.6 + Math.random() * 0.4,
        decay: 0,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayAmp: 0.5 + Math.random() * 1,
        isLooping: true
      });
    }
    this.start();
  }

  // 4. Gold Coins & Ingots Rain (Tết)
  burstGold(x, y, count = 45) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * 120 + 210) * (Math.PI / 180); // upward fountain
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        type: Math.random() > 0.3 ? 'coin' : 'ingot',
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 14 + Math.random() * 12,
        scaleX: 1,
        scaleSpeed: 0.1 + Math.random() * 0.15,
        rotation: (Math.random() - 0.5) * 0.5,
        vRot: (Math.random() - 0.5) * 0.1,
        alpha: 1,
        decay: 0.008 + Math.random() * 0.01,
        gravity: 0.22
      });
    }
    this.start();
  }

  // 5. Firework Rocket & Multi-stage Blast (Tết / New Year)
  launchFirework(startX, targetX, targetY, colorSet) {
    const defaultPalettes = [
      ['#ff0055', '#ff5500', '#ffd700', '#ffffff'],
      ['#00f0ff', '#7000ff', '#ff00aa', '#ffffff'],
      ['#00ff66', '#00e5ff', '#ffff00', '#ffffff'],
      ['#ffaa00', '#ff0033', '#ffffff', '#ffd700']
    ];
    const colors = colorSet || defaultPalettes[Math.floor(Math.random() * defaultPalettes.length)];

    this.fireworks.push({
      x: startX || this.width * (0.3 + Math.random() * 0.4),
      y: this.height,
      targetY: targetY || this.height * (0.2 + Math.random() * 0.3),
      vx: (targetX - startX) * 0.02 || (Math.random() - 0.5) * 1.5,
      vy: -10 - Math.random() * 4,
      colors: colors,
      trail: []
    });
    this.start();
  }

  // Explode firework at (x, y)
  explodeFirework(x, y, colors) {
    const count = 75;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3,
        color: color,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.015,
        gravity: 0.08,
        friction: 0.96
      });
    }
  }

  // 6. Celebratory Confetti (Winners)
  burstConfetti(count = 70) {
    const colors = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ffd700'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      this.particles.push({
        type: 'confetti',
        x: this.width / 2,
        y: this.height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        width: 8 + Math.random() * 8,
        height: 12 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        scaleX: 1,
        scaleSpeed: 0.08 + Math.random() * 0.1,
        alpha: 1,
        decay: 0.007 + Math.random() * 0.009,
        gravity: 0.15
      });
    }
    this.start();
  }

  // --- Engine Loop & Renderers ---

  update() {
    // 1. Update Rockets
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.trail.push({ x: fw.x, y: fw.y, alpha: 1 });
      if (fw.trail.length > 8) fw.trail.shift();

      if (fw.y <= fw.targetY || fw.vy >= 0) {
        this.explodeFirework(fw.x, fw.y, fw.colors);
        this.fireworks.splice(i, 1);
      }
    }

    // 2. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'snow') {
        p.swayPhase += p.swaySpeed;
        p.x += Math.sin(p.swayPhase) * p.swayAmp + p.vx;
        p.y += p.vy;
        if (p.y > this.height) {
          if (p.isLooping) {
            p.y = -10;
            p.x = Math.random() * this.width;
          } else {
            this.particles.splice(i, 1);
          }
        }
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      if (p.friction) {
        p.vx *= p.friction;
        p.vy *= p.friction;
      }
      p.rotation = (p.rotation || 0) + (p.vRot || 0);

      if (p.scaleX !== undefined) {
        p.scaleX = Math.cos(Date.now() * 0.005 * (p.scaleSpeed * 10));
      }

      if (p.decay) {
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    if (this.particles.length === 0 && this.fireworks.length === 0) {
      this.stop();
    }
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Firework Rockets
    this.ctx.save();
    for (const fw of this.fireworks) {
      for (const t of fw.trail) {
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 230, 150, ${t.alpha})`;
        this.ctx.fill();
        t.alpha -= 0.1;
      }
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, 3.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#ffd700';
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
    }
    this.ctx.restore();

    // 2. Render Particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'heart') {
        this.renderHeart(p);
      } else if (p.type === 'petal') {
        this.renderPetal(p);
      } else if (p.type === 'snow') {
        this.renderSnow(p);
      } else if (p.type === 'coin') {
        this.renderCoin(p);
      } else if (p.type === 'ingot') {
        this.renderIngot(p);
      } else if (p.type === 'spark') {
        this.renderSpark(p);
      } else if (p.type === 'confetti') {
        this.renderConfetti(p);
      }

      this.ctx.restore();
    }
  }

  renderHeart(p) {
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.fillStyle = p.color;
    this.ctx.shadowColor = p.color;
    this.ctx.shadowBlur = 8;

    const s = p.size / 30;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(-15 * s, -15 * s, -30 * s, 5 * s, 0, 30 * s);
    this.ctx.bezierCurveTo(30 * s, 5 * s, 15 * s, -15 * s, 0, 0);
    this.ctx.fill();
  }

  renderPetal(p) {
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.fillStyle = p.color;
    this.ctx.shadowColor = '#ffb6c1';
    this.ctx.shadowBlur = 4;

    const s = p.size;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, s * 0.4, s, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderSnow(p) {
    this.ctx.translate(p.x, p.y);
    this.ctx.fillStyle = p.color;
    this.ctx.shadowColor = '#80d4ff';
    this.ctx.shadowBlur = 6;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderCoin(p) {
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(Math.abs(p.scaleX || 1), 1);

    const r = p.size;
    // Outer rim
    const grad = this.ctx.createLinearGradient(-r, -r, r, r);
    grad.addColorStop(0, '#ffe57f');
    grad.addColorStop(0.5, '#ffb300');
    grad.addColorStop(1, '#ff8f00');

    this.ctx.fillStyle = grad;
    this.ctx.shadowColor = '#ffb300';
    this.ctx.shadowBlur = 6;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, r, 0, Math.PI * 2);
    this.ctx.fill();

    // Inner square (traditional Chinese/Vietnamese coin)
    this.ctx.fillStyle = '#b26a00';
    const sq = r * 0.45;
    this.ctx.fillRect(-sq / 2, -sq / 2, sq, sq);
  }

  renderIngot(p) {
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    const s = p.size;

    const grad = this.ctx.createLinearGradient(-s, 0, s, 0);
    grad.addColorStop(0, '#ffd54f');
    grad.addColorStop(0.5, '#fff176');
    grad.addColorStop(1, '#ffb300');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, s * 0.8, s * 0.4, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(0, -s * 0.2, s * 0.35, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffe082';
    this.ctx.fill();
  }

  renderSpark(p) {
    this.ctx.translate(p.x, p.y);
    this.ctx.fillStyle = p.color;
    this.ctx.shadowColor = p.color;
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderConfetti(p) {
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(p.scaleX || 1, 1);
    this.ctx.fillStyle = p.color;
    this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
  }
}
