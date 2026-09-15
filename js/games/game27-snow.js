import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game27Snow extends BaseGame {
  constructor() {
    super({
      id: 'game-27',
      name: 'Hứng Tuyết Nhận Điểm',
      icon: '❄️',
      season: 'Noel',
      defaultPrize: {
        icon: '❄️',
        title: 'Vua Hứng Tuyết Giáng Sinh',
        desc: 'Voucher Giảm 40% Toàn Bộ Đơn Hàng Dịch Vụ Dịp Cuối Năm',
        code: 'SNOWKING40',
        expiry: 'HSD: 15/01/2027'
      }
    });
    this.score = 0;
    this.timeLeft = 15;
    this.gameTimer = null;
    this.spawnTimer = null;
    this.isPlaying = false;
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-snow-game">
        <div class="snow-frost-vignette"></div>

        <!-- Dashboard Score Bar -->
        <div class="snow-stats-bar">
          <div class="stat-badge time-badge">
            <span class="stat-icon">⏱️</span>
            <span class="stat-val" id="snow-timer">15s</span>
          </div>
          <div class="stat-badge score-badge">
            <span class="stat-icon">⭐</span>
            <span class="stat-val" id="snow-score">0</span>
            <span class="stat-unit" style="font-size: 0.8rem; color: #fff;">Điểm</span>
          </div>
        </div>

        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Chạm nhanh hoa tuyết đang rơi để đóng băng tích điểm!</span>
        </div>

        <!-- Playfield Area where snowflakes fall -->
        <div class="snow-playfield" id="snow-playfield">
          <!-- Start Button Overlay -->
          <div class="snow-start-overlay" id="snow-start-overlay">
            <div class="snow-start-card">
              <div class="start-icon" style="font-size: 4rem;">❄️</div>
              <h3 style="font-size: 1.4rem; font-family: var(--font-heading); color: #00f0ff;">Thử Thách Bắt Tuyết</h3>
              <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.4;">Chạm càng nhiều hoa tuyết trong 15s để nhận voucher giảm giá lên đến 50%!</p>
              <button class="btn-primary-glow" id="btn-start-snow" style="margin-top: 10px;">
                <span>BẮT ĐẦU NGAY</span>
              </button>
            </div>
          </div>

          <!-- Pinterest-style Animated Finger Guide -->
          <div class="finger-guide-prompt hidden" id="finger-guide" style="position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 25;">
            <div class="finger-guide-bubble">Chạm bắt hoa tuyết! 👆</div>
            <div class="finger-icon">👆</div>
          </div>
        </div>

        <div class="game-footer-tip">
          <span>❄️ Tuyết Lam = +10đ • Tuyết Vàng = +20đ • Kim Cương Băng = +50đ</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const startBtn = this.container.querySelector('#btn-start-snow');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
  }

  startGame() {
    if (!this.canPlay()) return;
    this.score = 0;
    this.timeLeft = 15;
    this.isPlaying = true;
    this.isBusy = false;

    const overlay = this.container.querySelector('#snow-start-overlay');
    if (overlay) overlay.classList.add('hidden');

    const guide = this.container.querySelector('#finger-guide');
    if (guide) {
      guide.classList.remove('hidden');
      setTimeout(() => guide.classList.add('hidden'), 3500);
    }

    const scoreEl = this.container.querySelector('#snow-score');
    const timerEl = this.container.querySelector('#snow-timer');
    if (scoreEl) scoreEl.textContent = '0';
    if (timerEl) timerEl.textContent = '15s';

    sound.playClick();

    this.gameTimer = setInterval(() => {
      this.timeLeft--;
      if (timerEl) timerEl.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    this.spawnTimer = setInterval(() => {
      if (this.isPlaying) {
        this.spawnSnowflake();
      }
    }, 400);
  }

  spawnSnowflake() {
    const playfield = this.container.querySelector('#snow-playfield');
    if (!playfield) return;

    const flake = document.createElement('div');
    const rand = Math.random();

    let points = 10;
    let className = 'snow-flake normal';
    let strokeColor = '#00f0ff';

    if (rand > 0.85) {
      points = 50;
      className = 'snow-flake diamond';
      strokeColor = '#ffffff';
    } else if (rand > 0.6) {
      points = 20;
      className = 'snow-flake gold';
      strokeColor = '#ffd700';
    }

    flake.className = className;
    flake.innerHTML = `
      <svg class="flake-svg" viewBox="0 0 60 60">
        <!-- Geometric 6-fold Snowflake -->
        <line x1="30" y1="5" x2="30" y2="55" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round"/>
        <line x1="8" y1="18" x2="52" y2="42" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round"/>
        <line x1="8" y1="42" x2="52" y2="18" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round"/>
        <!-- Branch V-shapes -->
        <path d="M23,12 L30,19 L37,12" stroke="${strokeColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M23,48 L30,41 L37,48" stroke="${strokeColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="30" cy="30" r="5" fill="${strokeColor}"/>
      </svg>
    `;

    const playfieldWidth = playfield.clientWidth || 340;
    const startX = 20 + Math.random() * (playfieldWidth - 70);
    const fallDuration = 2.4 + Math.random() * 1.6;

    flake.style.left = `${startX}px`;
    flake.style.top = '-50px';
    flake.style.animationDuration = `${fallDuration}s`;

    const catchFlake = (e) => {
      e.stopPropagation();
      if (!this.isPlaying) return;

      sound.playFreeze();
      this.score += points;

      const scoreEl = this.container.querySelector('#snow-score');
      if (scoreEl) scoreEl.textContent = this.score;

      flake.classList.add('flake-frozen');
      flake.innerHTML = `<span class="frozen-points">+${points}</span>`;

      setTimeout(() => {
        if (flake.parentElement) flake.remove();
      }, 500);
    };

    flake.addEventListener('pointerdown', catchFlake);
    playfield.appendChild(flake);

    setTimeout(() => {
      if (flake.parentElement) flake.remove();
    }, fallDuration * 1000);
  }

  endGame() {
    this.isPlaying = false;
    clearInterval(this.gameTimer);
    clearInterval(this.spawnTimer);

    sound.playWinFanfare();

    const playfield = this.container.querySelector('#snow-playfield');
    if (playfield) {
      const flakes = playfield.querySelectorAll('.snow-flake');
      flakes.forEach(f => f.remove());
    }

    setTimeout(() => {
      let discount = '30%';
      let voucher = 'SNOW30';
      if (this.score >= 120) {
        discount = '50%';
        voucher = 'SNOWMASTER50';
      } else if (this.score >= 70) {
        discount = '40%';
        voucher = 'SNOWPRO40';
      }

      this.triggerReward({
        icon: '❄️',
        title: `Điểm Số: ${this.score} Điểm!`,
        desc: `Tuyệt vời! Bạn vừa giành được Voucher Giáng Sinh giảm ${discount}`,
        code: voucher,
        expiry: 'HSD: Đến hết Tết Dương Lịch'
      });
    }, 600);
  }

  unbindEvents() {
    this.isPlaying = false;
    clearInterval(this.gameTimer);
    clearInterval(this.spawnTimer);
  }
}
