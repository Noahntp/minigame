import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game30Firework extends BaseGame {
  constructor() {
    super({
      id: 'game-30',
      name: 'Pháo Hoa Tài Lộc',
      icon: '🎆',
      season: 'Tết / Năm mới',
      defaultPrize: {
        icon: '🎆',
        title: 'Giải Đặc Biệt: Khai Pháo Đại Cát',
        desc: 'Voucher Giảm 68% Toàn Bộ Dịch Vụ Mắt Bão Dịp Khai Xuân',
        code: 'KHAIPHAO68',
        expiry: 'HSD: 31/03/2026'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-firework">
        <!-- City Skyline Background -->
        <div class="skyline-city"></div>

        <div class="game-instruction-badge tet-badge">
          <span class="pulse-dot"></span>
          <span>Bấm nút KHAI PHÁO để thắp sáng bầu trời và rinh giải đặc biệt!</span>
        </div>

        <!-- Launch Station with Vector Rocket Battery -->
        <div class="firework-launch-station">
          <svg class="rocket-battery-svg" id="rocket-battery" viewBox="0 0 200 120">
            <defs>
              <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff1744" />
                <stop offset="50%" stop-color="#d50000" />
                <stop offset="100%" stop-color="#8b0000" />
              </linearGradient>
            </defs>
            <!-- Heavy Base Stand -->
            <rect x="20" y="90" width="160" height="25" rx="6" fill="#212121" stroke="#ffd700" stroke-width="2"/>
            <!-- Left Rocket Tube -->
            <g transform="rotate(-15 50 80)">
              <rect x="42" y="30" width="18" height="60" rx="3" fill="url(#rocketGrad)" stroke="#ffd700" stroke-width="1.5"/>
              <polygon points="51,10 40,30 62,30" fill="#ffd700"/>
            </g>
            <!-- Center Master Rocket Tube -->
            <rect x="90" y="20" width="22" height="70" rx="4" fill="url(#rocketGrad)" stroke="#ffd700" stroke-width="2"/>
            <polygon points="101,0 88,20 114,20" fill="#ffd700" stroke="#fff" stroke-width="1"/>
            <circle cx="101" cy="45" r="5" fill="#ffd700"/>
            <!-- Right Rocket Tube -->
            <g transform="rotate(15 150 80)">
              <rect x="140" y="30" width="18" height="60" rx="3" fill="url(#rocketGrad)" stroke="#ffd700" stroke-width="1.5"/>
              <polygon points="149,10 138,30 160,30" fill="#ffd700"/>
            </g>
          </svg>

          <!-- Burning Fuse Cord -->
          <div class="fuse-cord" id="fuse-cord">
            <div class="fuse-spark" id="fuse-spark"></div>
          </div>

          <button class="btn-detonate" id="btn-detonate">
            <span style="font-size: 1.5rem;">🧨</span>
            <span>KHAI PHÁO ĐÓN XUÂN</span>
          </button>

          <!-- Pinterest-style Animated Finger Guide -->
          <div class="finger-guide-prompt" id="finger-guide" style="margin-top: 15px;">
            <div class="finger-guide-bubble">Bấm khai pháo rinh lộc! 👆</div>
            <div class="finger-icon">👆</div>
          </div>
        </div>

        <!-- Grand Celebration Banner -->
        <div class="firework-banner hidden" id="firework-banner">
          <div class="banner-title">🎉 CHÚC MỪNG NĂM MỚI 2026 🎉</div>
          <div class="banner-sub">VẠN SỰ NHƯ Ý • TẤN TÀI TẤN LỘC • PHÁT ĐẠT AN KHANG</div>
        </div>

        <div class="game-footer-tip">
          <span>🎆 Pháo Nổ Rộn Ràng • Rước Lộc Khai Xuân • 100% Trúng Thưởng</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const detonateBtn = this.container.querySelector('#btn-detonate');
    if (detonateBtn) {
      detonateBtn.addEventListener('click', () => {
        if (this.isBusy) return;
        this.launchFireworks();
      });
    }
  }

  launchFireworks() {
    if (!this.canPlay()) return;
    this.isBusy = true;
    sound.playClick();

    const btn = this.container.querySelector('#btn-detonate');
    const spark = this.container.querySelector('#fuse-spark');
    const rockets = this.container.querySelector('#rocket-battery');
    const banner = this.container.querySelector('#firework-banner');
    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    btn.disabled = true;
    spark.classList.add('fuse-burning');

    // 1. Launch rockets
    setTimeout(() => {
      sound.playFirework();
      rockets.classList.add('rockets-launching');

      // Screen shake
      const stage = this.container.querySelector('.game-stage');
      if (stage) stage.classList.add('shake-screen');

      // Multiple firework rockets
      if (this.context && this.context.particles) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.context.particles.launchFirework(w * 0.3, w * 0.35, h * 0.22, ['#ff0055', '#ffd700', '#ffffff']);
        setTimeout(() => {
          this.context.particles.launchFirework(w * 0.7, w * 0.65, h * 0.18, ['#00e5ff', '#7000ff', '#ff00aa', '#ffffff']);
        }, 180);
        setTimeout(() => {
          this.context.particles.launchFirework(w * 0.5, w * 0.5, h * 0.14, ['#ffd700', '#ff5500', '#00ff66', '#ffffff']);
        }, 360);
      }
    }, 450);

    // 2. Extra burst round
    setTimeout(() => {
      sound.playFirework();
      if (this.context && this.context.particles) {
        this.context.particles.burstConfetti(70);
      }
    }, 1100);

    // 3. Drop Banner
    setTimeout(() => {
      banner.classList.remove('hidden');
      banner.classList.add('banner-drop');
      sound.playWinFanfare();
    }, 1700);

    // 4. Open Jackpot Reward Modal
    setTimeout(() => {
      this.triggerReward();
    }, 2800);
  }
}
