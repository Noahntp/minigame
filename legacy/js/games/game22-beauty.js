import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game22Beauty extends BaseGame {
  constructor() {
    super({
      id: 'game-22',
      name: 'Beauty Lucky Draw',
      icon: '💄',
      season: '8.3 / 20.10',
      defaultPrize: {
        icon: '💄',
        title: 'Voucher Nhan Sắc 8/3',
        desc: 'Tặng Bộ Mỹ Phẩm Cao Cấp Trị Giá 1.000.000 VNĐ',
        code: 'BEAUTY83',
        expiry: 'HSD: 31/03/2026'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-beauty">
        <div class="beauty-godrays"></div>

        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Chọn 1 trong 3 tuyệt tác mỹ phẩm để nhận ưu đãi!</span>
        </div>

        <!-- 3 Luxury Cosmetic Items -->
        <div class="cosmetics-podium">
          <!-- Item 1: Royal Velvet Lipstick -->
          <div class="cosmetic-card" data-item="lipstick" id="item-lipstick" title="Son Velvet Ruby">
            <div class="cosmetic-vector-box">
              <svg class="cosmetic-svg" viewBox="0 0 80 100">
                <defs>
                  <linearGradient id="goldCase" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fff099" />
                    <stop offset="40%" stop-color="#ffb703" />
                    <stop offset="80%" stop-color="#b26a00" />
                  </linearGradient>
                  <linearGradient id="rubyBullet" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff1744" />
                    <stop offset="60%" stop-color="#b70028" />
                    <stop offset="100%" stop-color="#660014" />
                  </linearGradient>
                </defs>
                <!-- Gold Casing Base -->
                <rect x="25" y="45" width="30" height="50" rx="4" fill="url(#goldCase)" stroke="#ffd700" stroke-width="1.5"/>
                <rect x="23" y="42" width="34" height="6" rx="2" fill="#ffd700"/>
                <!-- Inner Sleeve -->
                <rect x="28" y="25" width="24" height="20" fill="#222" stroke="url(#goldCase)" stroke-width="1"/>
                <!-- Lipstick Bullet (Angled) -->
                <path d="M30,25 L30,12 C30,4 42,0 48,15 L50,25 Z" fill="url(#rubyBullet)"/>
                <!-- Shine Streak -->
                <line x1="32" y1="48" x2="32" y2="90" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
              </svg>
            </div>
            <div class="cosmetic-name">Son Velvet</div>
            <div class="cosmetic-tag">Hoàng Gia</div>
          </div>

          <!-- Item 2: French Perfume Bottle -->
          <div class="cosmetic-card featured-center" data-item="perfume" id="item-perfume" title="Nước Hoa Rose Élite">
            <div class="cosmetic-vector-box">
              <svg class="cosmetic-svg" viewBox="0 0 80 100">
                <defs>
                  <radialGradient id="perfumeLiquid" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stop-color="#ffa0c0" />
                    <stop offset="60%" stop-color="#ff4081" />
                    <stop offset="100%" stop-color="#c51162" />
                  </radialGradient>
                </defs>
                <!-- Crystal Cap -->
                <polygon points="32,6 48,6 52,20 28,20" fill="#ffd700" stroke="#fff" stroke-width="1"/>
                <rect x="36" y="20" width="8" height="6" fill="#ffd700"/>
                <!-- Ribbon Bow -->
                <path d="M26,26 C36,23 38,30 40,26 C42,30 44,23 54,26" stroke="#222" stroke-width="3" fill="none"/>
                <!-- Glass Flacon Body -->
                <rect x="18" y="28" width="44" height="64" rx="8" fill="url(#perfumeLiquid)" stroke="#ffd700" stroke-width="2"/>
                <rect x="23" y="33" width="34" height="54" rx="5" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
                <!-- Label Emblem -->
                <rect x="26" y="48" width="28" height="24" rx="3" fill="#ffffff" opacity="0.9"/>
                <text x="40" y="63" font-size="8" font-family="serif" font-weight="bold" fill="#b70028" text-anchor="middle">ROSE</text>
              </svg>
            </div>
            <div class="cosmetic-name">Nước Hoa</div>
            <div class="cosmetic-tag">Rose Élite</div>
          </div>

          <!-- Item 3: Diamond Glow Serum -->
          <div class="cosmetic-card" data-item="serum" id="item-serum" title="Serum Diamond Glow">
            <div class="cosmetic-vector-box">
              <svg class="cosmetic-svg" viewBox="0 0 80 100">
                <defs>
                  <linearGradient id="serumLiquid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fff5cc" />
                    <stop offset="50%" stop-color="#ffb703" />
                    <stop offset="100%" stop-color="#d48b00" />
                  </linearGradient>
                </defs>
                <!-- Pipette Dropper Bulb -->
                <path d="M35,6 C35,2 45,2 45,6 L45,14 L35,14 Z" fill="#222"/>
                <rect x="32" y="14" width="16" height="8" rx="2" fill="#ffd700"/>
                <!-- Dropper Glass Tube -->
                <rect x="38" y="22" width="4" height="60" fill="rgba(255,255,255,0.7)"/>
                <!-- Bottle Body -->
                <rect x="22" y="26" width="36" height="68" rx="10" fill="url(#serumLiquid)" stroke="#ffffff" stroke-width="1.5"/>
                <!-- Glow Droplet -->
                <circle cx="40" cy="55" r="5" fill="#ffffff" opacity="0.8"/>
                <line x1="26" y1="35" x2="26" y2="85" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
              </svg>
            </div>
            <div class="cosmetic-name">Serum Sáng Da</div>
            <div class="cosmetic-tag">Diamond</div>
          </div>
        </div>

        <!-- Pinterest-style Animated Finger Guide -->
        <div class="finger-guide-prompt" id="finger-guide" style="margin-top: 15px;">
          <div class="finger-guide-bubble">Chạm chọn bảo vật! 👆</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>🌸 Tôn Vinh Phái Đẹp 8.3 & 20.10 • 100% Trúng Thưởng</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const cards = this.container.querySelectorAll('.cosmetic-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (this.isBusy) return;
        this.selectItem(card);
      });
    });
  }

  selectItem(selectedCard) {
    if (!this.canPlay()) return;
    this.isBusy = true;
    sound.playMagicChime();

    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    const allCards = this.container.querySelectorAll('.cosmetic-card');
    allCards.forEach(c => {
      if (c !== selectedCard) c.classList.add('dimmed-item');
    });

    selectedCard.classList.add('selected-glow');

    const rect = selectedCard.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (this.context && this.context.particles) {
      this.context.particles.burstPetals(x, y, 50);
    }

    const itemName = selectedCard.querySelector('.cosmetic-name').textContent;
    const itemTag = selectedCard.querySelector('.cosmetic-tag').textContent;

    setTimeout(() => {
      this.triggerReward({
        icon: '💄',
        title: `Trúng Quà: ${itemName} ${itemTag}`,
        desc: `Chúc mừng bạn đã nhận được sản phẩm chăm sóc sắc đẹp thượng hạng nhân dịp lễ hội!`,
        code: `BEAUTY_${selectedCard.dataset.item.toUpperCase()}`,
        expiry: 'HSD: 30 ngày kể từ hôm nay'
      });
    }, 1100);
  }
}
