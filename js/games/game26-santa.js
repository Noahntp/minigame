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

        <!-- Flying Anime Santa Sleigh across screen -->
        <div class="santa-sleigh hidden" id="santa-sleigh">
          <img src="assets/anime_santa_reindeer.png" class="sleigh-img" alt="Santa and Reindeer" />
        </div>

        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Bấm rung chuông vàng để gọi Santa trao quà!</span>
        </div>

        <!-- Golden Bell to Ring -->
        <div class="bell-hanger" id="bell-hanger">
          <div class="bell-wooden-beam"></div>
          <img src="assets/anime_golden_bell.png" class="golden-bell-img" id="golden-bell" alt="Chuông Vàng Noel" title="Chạm rung chuông!" />

          <button class="btn-ring-bell" id="btn-ring-bell">
            <span>Rung Chuông Ngay 🔔</span>
          </button>
        </div>

        <!-- Thrown Anime Gift Box (Zooms to camera) -->
        <div class="thrown-gift-box hidden" id="thrown-gift">
          <img src="assets/anime_gift_box.png" class="gift-box-img" alt="Hộp Quà May Mắn" />
          <div class="gift-banner">✨ SANTA TẶNG QUÀ BẠN! ✨</div>
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

    if (bellBtn) {
      bellBtn.addEventListener('click', triggerRing);
    }
    if (bell) {
      bell.addEventListener('click', triggerRing);
    }

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

      // Allow user to click directly on the glowing gift box to open reward
      thrownGift.style.cursor = 'pointer';
      thrownGift.style.pointerEvents = 'auto';
      thrownGift.onclick = () => {
        this.triggerReward();
      };
    }, 1400);

    setTimeout(() => {
      if (this.isBusy) {
        this.triggerReward();
      }
    }, 3800);
  }

  unbindEvents() {
    if (this.context && this.context.particles) {
      this.context.particles.clear();
    }
  }
}
