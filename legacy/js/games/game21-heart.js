import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game21Heart extends BaseGame {
  constructor() {
    super({
      id: 'game-21',
      name: 'Trái Tim May Mắn',
      icon: '💖',
      season: '14.2 Valentine',
      defaultPrize: {
        icon: '💖',
        title: 'Voucher Tình Yêu 14/2',
        desc: 'Giảm 50% Gói Dịch Vụ Cặp Đôi & Quà Tặng Socola Thượng Hạng',
        code: 'VALENTINE50',
        expiry: 'HSD: 28/02/2026'
      }
    });
    this.loveEnergy = 0;
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-valentine">
        <!-- Floating Romantic Bokeh Orbs -->
        <div class="valentine-backdrop">
          <div class="bokeh-orb orb-1"></div>
          <div class="bokeh-orb orb-2"></div>
          <div class="bokeh-orb orb-3"></div>
        </div>

        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Chạm vào trái tim để nạp đầy năng lượng tình yêu!</span>
        </div>

        <!-- Love Energy Meter -->
        <div class="love-meter-container">
          <div class="love-meter-header">
            <span>💖 NĂNG LƯỢNG TÌNH YÊU</span>
            <span id="love-percent-text">${this.loveEnergy}%</span>
          </div>
          <div class="love-meter-bar-track">
            <div class="love-meter-bar-fill" id="love-meter-fill" style="width: ${this.loveEnergy}%;"></div>
          </div>
        </div>

        <!-- 3D Heart Centerpiece with Finger Guide and Angel Wings -->
        <div class="heart-stage-wrapper">
          <!-- Golden Neon Angel Wings -->
          <div class="angel-wings-container">
            <svg class="wings-svg" viewBox="0 0 320 180">
              <defs>
                <linearGradient id="wingGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fff5cc" />
                  <stop offset="40%" stop-color="#ffd700" />
                  <stop offset="80%" stop-color="#ff8f00" />
                  <stop offset="100%" stop-color="#b26a00" />
                </linearGradient>
              </defs>
              <!-- Left Angel Wing -->
              <path d="M140,90 C120,40 70,20 10,45 C25,75 55,90 90,95 C60,110 30,120 15,135 C55,135 95,120 120,105 C130,120 115,145 95,160 C125,150 140,125 145,100 Z" 
                    fill="url(#wingGoldGrad)" stroke="#ffffff" stroke-width="1.5" opacity="0.95"/>
              <!-- Right Angel Wing -->
              <path d="M180,90 C200,40 250,20 310,45 C295,75 265,90 230,95 C260,110 290,120 305,135 C265,135 225,120 200,105 C190,120 205,145 225,160 C195,150 180,125 175,100 Z" 
                    fill="url(#wingGoldGrad)" stroke="#ffffff" stroke-width="1.5" opacity="0.95"/>
            </svg>
          </div>

          <div class="heart-halo" id="heart-halo"></div>
          
          <div class="heart-box" id="interactive-heart" title="Chạm liên tục để nạp năng lượng!">
            <div class="heart-crown">👑</div>
            <svg class="svg-heart" viewBox="0 0 200 180">
              <defs>
                <radialGradient id="heart3DGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stop-color="#ff8da1" />
                  <stop offset="35%" stop-color="#ff0055" />
                  <stop offset="70%" stop-color="#b80038" />
                  <stop offset="100%" stop-color="#540019" />
                </radialGradient>
                <linearGradient id="heartGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fff099" />
                  <stop offset="50%" stop-color="#ffb703" />
                  <stop offset="100%" stop-color="#d48b00" />
                </linearGradient>
                <filter id="heartShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feColorMatrix type="matrix" values="1 0 0 0 1   0 0 0 0 0.1   0 0 0 0 0.4  0 0 0 0.8 0"/>
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path d="M100,165 C20,110 0,65 0,38 C0,15 18,0 42,0 C65,0 85,15 100,32 C115,15 135,0 158,0 C182,0 200,15 200,38 C200,65 180,110 100,165 Z" 
                    fill="none" stroke="url(#heartGoldRim)" stroke-width="4" filter="url(#heartShadow)" opacity="0.8"/>

              <path d="M100,160 C25,108 6,66 6,40 C6,18 22,5 44,5 C65,5 84,18 100,34 C116,18 135,5 156,5 C178,5 194,18 194,40 C194,66 175,108 100,160 Z" 
                    fill="url(#heart3DGrad)"/>

              <path d="M44,14 C28,14 16,24 16,40 C16,56 28,84 62,112 C52,90 42,65 42,46 C42,28 50,20 60,18 C54,15 49,14 44,14 Z" 
                    fill="#ffffff" opacity="0.45"/>
              
              <circle cx="150" cy="35" r="3" fill="#ffffff" opacity="0.8"/>
              <circle cx="165" cy="55" r="2" fill="#ffd700" opacity="0.9"/>
            </svg>
            
            <div class="heart-core-icon">
              <span class="beating-emoji">✨</span>
            </div>
          </div>

          <div class="shockwave-ring" id="shockwave-ring"></div>

          <!-- Pinterest-style Animated Finger Guide -->
          <div class="finger-guide-prompt" id="finger-guide">
            <div class="finger-guide-bubble">Chạm liên tục! 👆</div>
            <div class="finger-icon">👆</div>
          </div>
        </div>

        <div class="game-footer-tip">
          <span>❤️ Mùa Yêu Thương 14.2 • Chạm Ngay Rinh Lộc</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const heart = this.container.querySelector('#interactive-heart');
    if (!heart) return;
    heart.addEventListener('click', (e) => this.handleHeartClick(e));
  }

  handleHeartClick(e) {
    if (this.isBusy) return;

    // Check turns on first tap
    if (this.loveEnergy === 0) {
      if (!this.canPlay()) return;
    }

    const heart = this.container.querySelector('#interactive-heart');
    const halo = this.container.querySelector('#heart-halo');
    const ring = this.container.querySelector('#shockwave-ring');
    const guide = this.container.querySelector('#finger-guide');
    const fill = this.container.querySelector('#love-meter-fill');
    const percentText = this.container.querySelector('#love-percent-text');

    if (guide) guide.style.display = 'none';

    this.loveEnergy += 35;
    if (this.loveEnergy > 100) this.loveEnergy = 100;

    if (fill) fill.style.width = `${this.loveEnergy}%`;
    if (percentText) percentText.textContent = `${this.loveEnergy}%`;

    sound.playHeartbeat(1.2 + (this.loveEnergy / 100) * 1.5);
    heart.classList.add('heart-rapid-beat');

    const rect = heart.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (this.context && this.context.particles) {
      this.context.particles.burstHearts(x, y, 12);
    }

    if (this.loveEnergy < 100) {
      setTimeout(() => {
        heart.classList.remove('heart-rapid-beat');
      }, 300);
      return;
    }

    // 100% Climax!
    this.isBusy = true;
    halo.classList.add('halo-flare');
    if (ring) ring.classList.add('shockwave-active');

    setTimeout(() => {
      sound.playHeartbeat(2.8);
      sound.playMagicChime();

      if (this.context && this.context.particles) {
        this.context.particles.burstHearts(x, y, 65);
      }

      const stage = this.container.querySelector('.game-stage');
      if (stage) stage.classList.add('shake-screen');

      heart.classList.add('heart-explode');

      setTimeout(() => {
        this.triggerReward();
      }, 750);
    }, 400);
  }

  reset() {
    this.loveEnergy = 0;
    super.reset();
  }
}
