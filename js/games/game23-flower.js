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
        <!-- Enchanted Glasshouse Conservatory Atmospheric Layers -->
        <div class="greenhouse-ambient-glow"></div>
        <div class="greenhouse-light-shafts"></div>

        <!-- Floating Golden Firefly Motes -->
        <div class="garden-fireflies-layer">
          <div class="firefly-mote firefly-1"></div>
          <div class="firefly-mote firefly-2"></div>
          <div class="firefly-mote firefly-3"></div>
          <div class="firefly-mote firefly-4"></div>
          <div class="firefly-mote firefly-5"></div>
          <div class="firefly-mote firefly-6"></div>
        </div>

        <!-- Gentle Floating Petals -->
        <div class="floating-petals-layer">
          <div class="falling-petal petal-1">🌸</div>
          <div class="falling-petal petal-2">🌹</div>
          <div class="falling-petal petal-3">✨</div>
          <div class="falling-petal petal-4">🌸</div>
        </div>

        <!-- Top Instruction Badge -->
        <div class="game-instruction-badge flower-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Chạm vào nụ hoa để chứng kiến đóa hoa bừng nở tuyệt mỹ!</span>
        </div>

        <!-- Interactive Guidance Floating Callout -->
        <div class="flower-guide-callout" id="finger-guide">
          <div class="flower-guide-bubble">✨ Chọn nụ hoa ngát hương! ✨</div>
          <div class="flower-guide-pointer">👇</div>
        </div>

        <!-- Royal Botanical Showcase: 3 Masterpiece Flower Buds -->
        <div class="garden-bed" id="garden-bed">
          <!-- Flower 1: Royal Velvet Rose -->
          <div class="flower-item" data-flower="rose" data-bud="assets/flower_rose_bud.jpg" data-bloom="assets/flower_rose.jpg">
            <div class="flower-aura-glow rose-glow"></div>
            <div class="flower-bloom-frame">
              <img src="assets/flower_rose_bud.jpg" alt="Hồng Đỏ Nhung" class="flower-botanical-img bud-img" />
              <div class="flower-glass-shimmer"></div>
            </div>
            <!-- Pedestal with Golden Foliage -->
            <div class="flower-pedestal">
              <div class="pedestal-calyx">
                <svg viewBox="0 0 60 26" class="calyx-svg">
                  <path d="M12,24 Q30,12 48,24 Q30,2 12,24 Z" fill="url(#leafGradRose)"/>
                </svg>
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="leafGradRose" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#4ade80"/>
                      <stop offset="100%" stop-color="#15803d"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="pedestal-stem-pillar"></div>
              <div class="pedestal-golden-plinth"></div>
            </div>
            <div class="flower-label-card">
              <span class="flower-title">Hồng Đỏ Nhung</span>
              <span class="flower-tag">👑 Quý Phái</span>
            </div>
          </div>

          <!-- Flower 2: Imperial Pink Peony (Pixabay 41710 Featured Centerpiece) -->
          <div class="flower-item featured-flower" data-flower="peony" data-bud="assets/flower_peony_bud.jpg" data-opening="assets/flower_peony_opening.jpg" data-bloom="assets/flower_peony.jpg">
            <div class="royal-crown-halo">👑</div>
            <div class="flower-aura-glow peony-glow"></div>
            <div class="flower-bloom-frame featured-frame">
              <img src="assets/flower_peony_bud.jpg" alt="Mẫu Đơn Quý" class="flower-botanical-img bud-img" />
              <div class="flower-glass-shimmer"></div>
            </div>
            <!-- Center Featured Pedestal -->
            <div class="flower-pedestal featured-pedestal">
              <div class="pedestal-calyx">
                <svg viewBox="0 0 64 28" class="calyx-svg">
                  <path d="M10,26 Q32,10 54,26 Q32,0 10,26 Z" fill="url(#leafGradPeony)"/>
                </svg>
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="leafGradPeony" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#f472b6"/>
                      <stop offset="50%" stop-color="#4ade80"/>
                      <stop offset="100%" stop-color="#166534"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="pedestal-stem-pillar featured-stem"></div>
              <div class="pedestal-golden-plinth featured-plinth"></div>
            </div>
            <div class="flower-label-card featured-label">
              <span class="flower-title">Mẫu Đơn Cung Đình</span>
              <span class="flower-tag gold-tag">✨ Vương Giả</span>
            </div>
          </div>

          <!-- Flower 3: Golden Sunlight Tulip -->
          <div class="flower-item" data-flower="tulip" data-bud="assets/flower_tulip_bud.jpg" data-bloom="assets/flower_tulip.jpg">
            <div class="flower-aura-glow tulip-glow"></div>
            <div class="flower-bloom-frame">
              <img src="assets/flower_tulip_bud.jpg" alt="Hoa Tulip" class="flower-botanical-img bud-img" />
              <div class="flower-glass-shimmer"></div>
            </div>
            <!-- Pedestal with Golden Foliage -->
            <div class="flower-pedestal">
              <div class="pedestal-calyx">
                <svg viewBox="0 0 60 26" class="calyx-svg">
                  <path d="M12,24 Q30,12 48,24 Q30,2 12,24 Z" fill="url(#leafGradTulip)"/>
                </svg>
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="leafGradTulip" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fde047"/>
                      <stop offset="50%" stop-color="#22c55e"/>
                      <stop offset="100%" stop-color="#15803d"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="pedestal-stem-pillar"></div>
              <div class="pedestal-golden-plinth"></div>
            </div>
            <div class="flower-label-card">
              <span class="flower-title">Tulip Hoàng Kim</span>
              <span class="flower-tag">🌟 May Mắn</span>
            </div>
          </div>
        </div>

        <!-- Center Bloom Spotlight Modal Effect (Pixabay 41710 Time-Lapse) -->
        <div class="flower-pluck-spotlight hidden" id="pluck-spotlight">
          <div class="giant-bloom-wrapper" id="giant-bloom">
            <div class="spotlight-rays"></div>
            <div class="spotlight-shockwave"></div>
            <div class="giant-bloom-photo-disc">
              <img id="giant-bloom-img" src="assets/flower_peony.jpg" alt="Bloom" class="giant-photo" />
              <div class="bloom-unfurl-sheen" id="bloom-sheen"></div>
            </div>
          </div>
          <div class="bloom-status-banner" id="bloom-status">✨ Đang hé mở từng lớp cánh hoa... ✨</div>
          <div class="bloom-congrats-text hidden" id="bloom-congrats">💐 ĐÓA HOA BỪNG NỞ • TẶNG VOUCHER NÀNG YÊU! 💐</div>
        </div>

        <!-- Footer Seasonal Promo Banner -->
        <div class="game-footer-tip flower-footer-tip">
          <span>💐 Hương Sắc Rạng Ngời • 100% Trúng Thưởng Dịp 8/3 & 20/10</span>
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
    const budImg = flowerEl.dataset.bud || 'assets/flower_peony_bud.jpg';
    const openingImg = flowerEl.dataset.opening || flowerEl.dataset.bloom;
    const bloomImg = flowerEl.dataset.bloom || 'assets/flower_peony.jpg';
    const titleEl = flowerEl.querySelector('.flower-title');
    const label = titleEl ? titleEl.textContent : 'Hoa Quý';

    flowerEl.classList.add('flower-plucked');

    const rect = flowerEl.getBoundingClientRect();
    if (this.context && this.context.particles) {
      this.context.particles.burstPetals(rect.left + rect.width / 2, rect.top, 25);
    }

    const spotlight = this.container.querySelector('#pluck-spotlight');
    const giantBloom = this.container.querySelector('#giant-bloom');
    const giantImg = this.container.querySelector('#giant-bloom-img');
    const statusBanner = this.container.querySelector('#bloom-status');
    const congratsBanner = this.container.querySelector('#bloom-congrats');

    // Phase 1: Show Bud awakening in center (1.3s để nụ cựa mình)
    if (giantImg) giantImg.src = budImg;
    spotlight.classList.remove('hidden');
    spotlight.classList.add('active');
    giantBloom.classList.add('bloom-expand');

    // Phase 2: Time-lapse unfurl to opening state (2.2s để cánh từ từ bung xòe)
    setTimeout(() => {
      if (giantImg) giantImg.src = openingImg;
      sound.playFlowerBloom();
      if (statusBanner) statusBanner.textContent = '🌸 Từng lớp cánh hoa đang hé mở rạng rỡ...';

      if (this.context && this.context.particles) {
        this.context.particles.burstPetals(window.innerWidth / 2, window.innerHeight * 0.45, 40);
      }

      // Phase 3: Full bloom & Golden core radiance (Hoa bừng nở viên mãn)
      setTimeout(() => {
        if (giantImg) giantImg.src = bloomImg;
        giantBloom.classList.add('bloom-full-pulse');

        if (statusBanner) statusBanner.classList.add('hidden');
        if (congratsBanner) congratsBanner.classList.remove('hidden');

        if (this.context && this.context.particles) {
          this.context.particles.burstPetals(window.innerWidth / 2, window.innerHeight * 0.45, 65);
        }

        // Phase 4: Trigger Reward sau khi hoa bừng nở trọn vẹn
        setTimeout(() => {
          this.triggerReward({
            icon: '💐',
            title: `Đóa ${label} Bừng Nở`,
            desc: `Bạn vừa đón nhận đóa hoa tuyệt mỹ cùng Voucher Ưu Đãi Hoàng Gia dành tặng người phụ nữ yêu thương!`,
            code: `FLOWER_${flowerType.toUpperCase()}`,
            expiry: 'HSD: 30 ngày'
          });
        }, 2200);
      }, 2200);
    }, 1300);
  }
}
