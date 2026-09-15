import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game28Lixi extends BaseGame {
  constructor() {
    super({
      id: 'game-28',
      name: 'Lì Xì Phát Tài',
      icon: '🧧',
      season: 'Tết',
      defaultPrize: {
        icon: '🧧',
        title: 'Lì Xì Đại Cát 888K',
        desc: 'Chúc Mừng Năm Mới! Bạn nhận được Phong Bao Lì Xì 888.000 VNĐ Khấu Trừ Trực Tiếp',
        code: 'PHATTAI888',
        expiry: 'HSD: 28/02/2026'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-tet">
        <!-- Festive Red Silk Lanterns -->
        <div class="tet-lanterns">
          <svg class="lantern-svg" viewBox="0 0 50 70">
            <rect x="18" y="2" width="14" height="6" fill="#ffd700"/>
            <ellipse cx="25" cy="35" rx="20" ry="26" fill="#d50000" stroke="#ffd700" stroke-width="2"/>
            <line x1="25" y1="9" x2="25" y2="61" stroke="#ffd700" stroke-width="1.5"/>
            <rect x="18" y="61" width="14" height="4" fill="#ffd700"/>
            <!-- Tassel -->
            <line x1="25" y1="65" x2="25" y2="75" stroke="#ffd700" stroke-width="2"/>
          </svg>
          <div class="tet-branch-mai" style="font-size: 2rem;">🌸</div>
          <svg class="lantern-svg lantern-right" viewBox="0 0 50 70">
            <rect x="18" y="2" width="14" height="6" fill="#ffd700"/>
            <ellipse cx="25" cy="35" rx="20" ry="26" fill="#d50000" stroke="#ffd700" stroke-width="2"/>
            <line x1="25" y1="9" x2="25" y2="61" stroke="#ffd700" stroke-width="1.5"/>
            <rect x="18" y="61" width="14" height="4" fill="#ffd700"/>
            <line x1="25" y1="65" x2="25" y2="75" stroke="#ffd700" stroke-width="2"/>
          </svg>
        </div>

        <div class="game-instruction-badge tet-badge">
          <span class="pulse-dot"></span>
          <span>Chọn 1 phong bao lì xì đỏ thêu vàng để đón tài lộc!</span>
        </div>

        <!-- 4 Bao Lì Xì (Phúc - Lộc - Thọ - Tài) -->
        <div class="lixi-grid">
          <!-- Lixi 1: Phuc -->
          <div class="lixi-envelope" data-type="phuc" title="Bao Lì Xì Phúc">
            <div class="lixi-gold-emblem">🪙</div>
            <div class="lixi-calligraphy">PHÚC</div>
            <div class="lixi-tassel">❖ An Khang ❖</div>
          </div>

          <!-- Lixi 2: Loc -->
          <div class="lixi-envelope featured-lixi" data-type="loc" title="Bao Lì Xì Lộc">
            <div class="lixi-gold-emblem">✨</div>
            <div class="lixi-calligraphy">LỘC</div>
            <div class="lixi-tassel">❖ Phú Quý ❖</div>
          </div>

          <!-- Lixi 3: Tho -->
          <div class="lixi-envelope" data-type="tho" title="Bao Lì Xì Thọ">
            <div class="lixi-gold-emblem">🏮</div>
            <div class="lixi-calligraphy">THỌ</div>
            <div class="lixi-tassel">❖ Bình An ❖</div>
          </div>

          <!-- Lixi 4: Tai -->
          <div class="lixi-envelope" data-type="tai" title="Bao Lì Xì Tài">
            <div class="lixi-gold-emblem">💰</div>
            <div class="lixi-calligraphy">TÀI</div>
            <div class="lixi-tassel">❖ Tấn Tới ❖</div>
          </div>
        </div>

        <!-- Pinterest-style Animated Finger Guide -->
        <div class="finger-guide-prompt" id="finger-guide" style="margin-top: 10px;">
          <div class="finger-guide-bubble">Chọn phong bao lì xì! 👆</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>🧧 Tết Giáp Thìn • Khai Xuân Đắc Lộc • 100% Trúng Thưởng</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const lixis = this.container.querySelectorAll('.lixi-envelope');
    lixis.forEach(lixi => {
      lixi.addEventListener('click', () => {
        if (this.isBusy) return;
        this.openLixi(lixi);
      });
    });
  }

  openLixi(selectedLixi) {
    if (!this.canPlay()) return;
    this.isBusy = true;
    sound.playClick();

    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    const allLixis = this.container.querySelectorAll('.lixi-envelope');
    allLixis.forEach(el => {
      if (el !== selectedLixi) el.classList.add('lixi-dimmed');
    });

    selectedLixi.classList.add('lixi-shake-open');

    setTimeout(() => {
      selectedLixi.classList.add('lixi-unfolded');
      sound.playCoin();

      const rect = selectedLixi.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Burst of golden coins and ingots
      if (this.context && this.context.particles) {
        this.context.particles.burstGold(x, y, 65);
      }
    }, 450);

    setTimeout(() => {
      sound.playCoin();
    }, 850);

    const type = selectedLixi.dataset.type.toUpperCase();

    setTimeout(() => {
      this.triggerReward({
        icon: '🧧',
        title: `Lì Xì Chữ [${type}] - Đại Cát!`,
        desc: `Kính chúc gia chủ Vạn Sự Như Ý, Tấn Tài Tấn Lộc, Tiền Vào Như Nước Sông Đà!`,
        code: `LIXI_${type}_888K`,
        expiry: 'HSD: 28/02/2026'
      });
    }, 1500);
  }
}
