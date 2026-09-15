import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game26Santa extends BaseGame {
  constructor() {
    super({
      id: 'game-26',
      name: 'Ông Già Noel Tặng Quà',
      icon: '🎅',
      season: 'Giáng sinh',
      defaultPrize: {
        icon: '🎅',
        title: 'Món Quà Từ Ông Già Noel',
        desc: 'Voucher Trị Giá 500.000 VNĐ Áp Dụng Mọi Hóa Đơn Dịch Vụ',
        code: 'SANTA500K',
        expiry: 'HSD: 31/01/2027'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-santa">
        <!-- Northern Lights Aurora Borealis -->
        <div class="aurora-sky"></div>

        <!-- Night Moon -->
        <div class="santa-sky">
          <svg class="full-moon-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#fff9c4"/>
            <circle cx="35" cy="35" r="10" fill="#fff59d" opacity="0.6"/>
            <circle cx="65" cy="55" r="14" fill="#fff59d" opacity="0.6"/>
            <circle cx="45" cy="70" r="8" fill="#fff59d" opacity="0.6"/>
          </svg>
        </div>

        <!-- Flying Santa Sleigh across screen -->
        <div class="santa-sleigh hidden" id="santa-sleigh">
          <svg class="sleigh-svg" viewBox="0 0 240 80">
            <!-- Reindeer Silhouettes -->
            <path d="M190,40 Q205,30 215,35 L220,30 L225,32 L220,38 L225,50 L220,50 L215,44 L205,48 L200,60 L195,60 L198,46 L190,46 Z" fill="#ffffff"/>
            <path d="M155,42 Q170,32 180,37 L185,32 L190,34 L185,40 L190,52 L185,52 L180,46 L170,50 L165,62 L160,62 L163,48 L155,48 Z" fill="#ffffff"/>
            <!-- Sleigh Body & Santa -->
            <path d="M20,60 C60,60 85,55 95,45 L100,50 C80,68 40,68 15,62 Z" fill="#ffd700"/>
            <path d="M30,40 C35,25 65,25 75,40 C85,55 45,55 30,40 Z" fill="#d32f2f"/>
            <!-- Santa Beard & Hat -->
            <circle cx="55" cy="26" r="10" fill="#d32f2f"/>
            <path d="M48,28 Q55,40 62,28 Z" fill="#ffffff"/>
            <!-- Golden Magic Trail -->
            <circle cx="10" cy="50" r="3" fill="#ffd700"/>
            <circle cx="0" cy="52" r="2" fill="#ffffff"/>
          </svg>
        </div>

        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Bấm rung chuông vàng để gọi Santa trao quà!</span>
        </div>

        <!-- Golden Bell to Ring -->
        <div class="bell-hanger" id="bell-hanger">
          <svg class="golden-bell-svg" id="golden-bell" viewBox="0 0 140 140" title="Chạm rung chuông!">
            <defs>
              <linearGradient id="bellGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff59d" />
                <stop offset="40%" stop-color="#ffd600" />
                <stop offset="80%" stop-color="#ff8f00" />
                <stop offset="100%" stop-color="#b26a00" />
              </linearGradient>
            </defs>
            <!-- Wood Support & Ribbon -->
            <rect x="35" y="6" width="70" height="12" rx="4" fill="#5d4037" stroke="#3e2723" stroke-width="2"/>
            <path d="M50,18 C60,25 80,25 90,18 L95,30 C80,28 60,28 45,30 Z" fill="#d32f2f"/>
            <!-- Bell Dome Body -->
            <path d="M70,25 C45,25 35,65 25,95 C20,105 30,112 70,112 C110,112 120,105 115,95 C105,65 95,25 70,25 Z" 
                  fill="url(#bellGold)" stroke="#ffffff" stroke-width="2"/>
            <!-- Clapper -->
            <circle cx="70" cy="116" r="12" fill="#ff8f00" stroke="#ffd700" stroke-width="2"/>
          </svg>

          <button class="btn-ring-bell" id="btn-ring-bell">
            <span>Rung Chuông Ngay 🔔</span>
          </button>
        </div>

        <!-- Thrown Gift Box (Zooms to camera) -->
        <div class="thrown-gift-box hidden" id="thrown-gift">
          <svg class="gift-box-vector" viewBox="0 0 100 100">
            <rect x="15" y="35" width="70" height="55" rx="8" fill="#d32f2f" stroke="#ffd700" stroke-width="3"/>
            <rect x="10" y="25" width="80" height="15" rx="4" fill="#b71c1c" stroke="#ffd700" stroke-width="3"/>
            <rect x="44" y="25" width="12" height="65" fill="#ffd700"/>
            <rect x="15" y="55" width="70" height="12" fill="#ffd700"/>
            <circle cx="50" cy="25" r="10" fill="#ffd700"/>
          </svg>
          <div class="gift-banner">SANTA TẶNG QUÀ BẠN!</div>
        </div>

        <!-- Pinterest-style Animated Finger Guide -->
        <div class="finger-guide-prompt" id="finger-guide">
          <div class="finger-guide-bubble">Rung chuông vàng! 👆</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>🔔 Chuông Ngân Rực Rỡ • Đón Nhận Phép Màu Giáng Sinh</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const bellBtn = this.container.querySelector('#btn-ring-bell');
    const bell = this.container.querySelector('#golden-bell');

    const triggerRing = () => {
      if (this.isBusy) return;
      this.ringBellAndSummonSanta();
    };

    if (bellBtn) bellBtn.addEventListener('click', triggerRing);
    if (bell) bell.addEventListener('click', triggerRing);

    if (this.context && this.context.particles) {
      this.context.particles.addSnowflakes(25);
    }
  }

  ringBellAndSummonSanta() {
    if (!this.canPlay()) return;
    this.isBusy = true;
    sound.playBell();

    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    const bell = this.container.querySelector('#golden-bell');
    const sleigh = this.container.querySelector('#santa-sleigh');
    const thrownGift = this.container.querySelector('#thrown-gift');

    bell.classList.add('bell-swinging');

    setTimeout(() => {
      sound.playSleighBells();
      sleigh.classList.remove('hidden');
      sleigh.classList.add('sleigh-fly-across');
    }, 400);

    setTimeout(() => {
      thrownGift.classList.remove('hidden');
      thrownGift.classList.add('gift-zoom-in');
      sound.playMagicChime();

      if (this.context && this.context.particles) {
        this.context.particles.burstConfetti(55);
      }
    }, 1400);

    setTimeout(() => {
      this.triggerReward();
    }, 2400);
  }

  unbindEvents() {
    if (this.context && this.context.particles) {
      this.context.particles.clear();
    }
  }
}
