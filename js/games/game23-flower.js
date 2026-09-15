import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game23Flower extends BaseGame {
  constructor() {
    super({
      id: 'game-23',
      name: 'Hái Hoa Nhận Quà',
      icon: '💐',
      season: '8.3 / 20.10',
      defaultPrize: {
        icon: '💐',
        title: 'Hoa Tươi Đắc Lộc',
        desc: 'Voucher Giảm 40% Đơn Hàng Hoa Tươi & Quà Tặng Người Phụ Nữ Yêu Thương',
        code: 'FLOWERLOVE',
        expiry: 'HSD: 30 ngày'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-flower">
        <div class="garden-glow-ambience"></div>

        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Chạm vào đóa hoa ngát hương để đón nhận quà tặng!</span>
        </div>

        <!-- Botanical Flower Garden Bed -->
        <div class="garden-bed" id="garden-bed">
          <!-- Flower 1: Red Velvet Rose -->
          <div class="flower-item" data-flower="rose">
            <div class="flower-bloom">
              <svg class="flower-svg" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="roseGrad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#ff4081" />
                    <stop offset="50%" stop-color="#e91e63" />
                    <stop offset="100%" stop-color="#880e4f" />
                  </radialGradient>
                </defs>
                <!-- Outer Petals -->
                <circle cx="50" cy="50" r="38" fill="url(#roseGrad)"/>
                <path d="M20,40 C30,15 70,15 80,40 C90,65 50,85 50,85 C50,85 10,65 20,40 Z" fill="#c2185b" opacity="0.8"/>
                <path d="M30,35 C40,20 60,20 70,35 C75,55 50,70 50,70 C50,70 25,55 30,35 Z" fill="#ad1457"/>
                <circle cx="50" cy="45" r="14" fill="#880e4f"/>
                <circle cx="50" cy="44" r="5" fill="#ffd700"/>
              </svg>
            </div>
            <!-- Stem with leaves -->
            <svg class="flower-stem-svg" viewBox="0 0 30 100">
              <path d="M15,0 Q18,50 15,100" stroke="#2e7d32" stroke-width="5" fill="none"/>
              <path d="M17,35 Q30,25 28,45 Q20,45 16,38" fill="#4caf50"/>
              <path d="M13,60 Q0,50 2,70 Q10,70 14,63" fill="#388e3c"/>
            </svg>
            <div class="flower-label">Hoa Hồng Đỏ</div>
          </div>

          <!-- Flower 2: Royal Peony / Lotus -->
          <div class="flower-item featured-flower" data-flower="peony">
            <div class="flower-bloom">
              <svg class="flower-svg" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="peonyGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fff0f5" />
                    <stop offset="40%" stop-color="#ff80ab" />
                    <stop offset="85%" stop-color="#f50057" />
                    <stop offset="100%" stop-color="#880e4f" />
                  </radialGradient>
                </defs>
                <!-- Multilayered Petals -->
                <circle cx="50" cy="50" r="42" fill="url(#peonyGrad)" opacity="0.9"/>
                <circle cx="50" cy="50" r="32" fill="#ff4081" opacity="0.85"/>
                <circle cx="50" cy="50" r="22" fill="#f50057"/>
                <!-- Golden Stamen Core -->
                <circle cx="50" cy="50" r="10" fill="#ffd700"/>
                <circle cx="50" cy="50" r="4" fill="#ffffff"/>
              </svg>
            </div>
            <svg class="flower-stem-svg" viewBox="0 0 30 100">
              <path d="M15,0 Q12,50 15,100" stroke="#1b5e20" stroke-width="6" fill="none"/>
              <path d="M16,40 Q28,30 26,50 Q18,50 15,43" fill="#4caf50"/>
            </svg>
            <div class="flower-label">Mẫu Đơn Quý</div>
          </div>

          <!-- Flower 3: Golden Tulip -->
          <div class="flower-item" data-flower="tulip">
            <div class="flower-bloom">
              <svg class="flower-svg" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="tulipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fff59d" />
                    <stop offset="40%" stop-color="#ffd600" />
                    <stop offset="100%" stop-color="#ff6d00" />
                  </linearGradient>
                </defs>
                <path d="M25,65 C15,35 30,15 50,30 C70,15 85,35 75,65 C65,85 35,85 25,65 Z" fill="url(#tulipGrad)"/>
                <path d="M40,35 C45,25 55,25 60,35 C65,55 50,65 50,65 C50,65 35,55 40,35 Z" fill="#ffab00"/>
              </svg>
            </div>
            <svg class="flower-stem-svg" viewBox="0 0 30 100">
              <path d="M15,0 Q16,50 15,100" stroke="#2e7d32" stroke-width="5" fill="none"/>
              <path d="M12,50 Q-2,38 0,60 Q10,60 13,53" fill="#43a047"/>
            </svg>
            <div class="flower-label">Hoa Tulip</div>
          </div>
        </div>

        <!-- Center Bloom Spotlight Modal Effect -->
        <div class="flower-pluck-spotlight hidden" id="pluck-spotlight">
          <div class="giant-bloom" id="giant-bloom">
            <svg class="giant-bloom-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="55" fill="url(#peonyGrad)"/>
              <circle cx="60" cy="60" r="35" fill="#ff4081"/>
              <circle cx="60" cy="60" r="18" fill="#ffd700"/>
              <text x="60" y="68" font-size="24" text-anchor="middle">🎁</text>
            </svg>
          </div>
          <div class="bloom-text">ĐÓA HOA NỞ RỘ - RINH VOUCHER!</div>
        </div>

        <!-- Pinterest-style Animated Finger Guide -->
        <div class="finger-guide-prompt" id="finger-guide">
          <div class="finger-guide-bubble">Chạm đóa hoa! 👆</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>💐 Hương Sắc Rạng Ngời • 100% Trúng Thưởng Dịp 8/3</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const flowers = this.container.querySelectorAll('.flower-item');
    flowers.forEach(fl => {
      fl.addEventListener('click', () => {
        if (this.isBusy) return;
        this.pluckFlower(fl);
      });
    });
  }

  pluckFlower(flowerEl) {
    if (!this.canPlay()) return;
    this.isBusy = true;
    sound.playFlowerBloom();

    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    const flowerType = flowerEl.dataset.flower;
    const label = flowerEl.querySelector('.flower-label').textContent;

    flowerEl.classList.add('flower-plucked');

    const rect = flowerEl.getBoundingClientRect();
    if (this.context && this.context.particles) {
      this.context.particles.burstPetals(rect.left + rect.width / 2, rect.top, 30);
    }

    setTimeout(() => {
      const spotlight = this.container.querySelector('#pluck-spotlight');
      const giantBloom = this.container.querySelector('#giant-bloom');

      spotlight.classList.remove('hidden');
      spotlight.classList.add('active');
      giantBloom.classList.add('bloom-expand');

      if (this.context && this.context.particles) {
        this.context.particles.burstPetals(window.innerWidth / 2, window.innerHeight * 0.45, 55);
      }

      setTimeout(() => {
        this.triggerReward({
          icon: '💐',
          title: `Đóa ${label} Phú Quý`,
          desc: `Bạn vừa hái được bông hoa mang lại sắc đẹp rạng rỡ và lộc may mắn đầu năm!`,
          code: `FLOWER_${flowerType.toUpperCase()}`,
          expiry: 'HSD: 30 ngày'
        });
      }, 1200);
    }, 450);
  }
}
