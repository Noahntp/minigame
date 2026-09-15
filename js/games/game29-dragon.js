import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game29Dragon extends BaseGame {
  constructor() {
    super({
      id: 'game-29',
      name: 'Rồng Vàng Săn Lộc',
      icon: '🐉',
      season: 'Tết',
      defaultPrize: {
        icon: '🐉',
        title: 'Đại Lộc Kim Long 2 Triệu',
        desc: 'Thần Long Trao Lộc: Nhận Ngay 2.000.000 VNĐ Khấu Trừ Khi Đăng Ký Dịch Vụ Mắt Bão',
        code: 'KIMLONG2026',
        expiry: 'HSD: 31/03/2026'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-dragon">
        <!-- Celestial Oriental Clouds -->
        <div class="dragon-clouds">
          <svg class="cloud-svg" viewBox="0 0 100 50">
            <path d="M20,40 C10,40 5,30 15,20 C15,10 30,5 45,15 C55,5 75,5 85,18 C95,18 100,28 90,40 Z" fill="none" stroke="#ffd700" stroke-width="2"/>
            <circle cx="50" cy="25" r="4" fill="#ffd700"/>
          </svg>
          <svg class="cloud-svg" viewBox="0 0 100 50">
            <path d="M20,40 C10,40 5,30 15,20 C15,10 30,5 45,15 C55,5 75,5 85,18 C95,18 100,28 90,40 Z" fill="none" stroke="#ffd700" stroke-width="2"/>
          </svg>
        </div>

        <div class="game-instruction-badge tet-badge">
          <span class="pulse-dot"></span>
          <span>Chạm vào Thần Long Hoàng Kim để khai xuân đắc LỘC!</span>
        </div>

        <!-- Imperial Golden Dragon Showcase -->
        <div class="dragon-arena">
          <div class="dragon-svg-wrapper" id="dragon-actor" title="Chạm vào Rồng Vàng!">
            <svg class="dragon-svg-main" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="dragonGoldGrad" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stop-color="#fff59d" />
                  <stop offset="40%" stop-color="#ffd600" />
                  <stop offset="75%" stop-color="#ff9100" />
                  <stop offset="100%" stop-color="#b26a00" />
                </radialGradient>
              </defs>
              <!-- Celestial Coiled Body -->
              <path d="M40,160 C10,120 20,60 70,40 C130,20 180,60 170,120 C160,170 100,180 60,160" 
                    fill="none" stroke="url(#dragonGoldGrad)" stroke-width="28" stroke-linecap="round"/>
              <!-- Spine Dorsal Fins -->
              <path d="M45,150 L35,140 M60,110 L50,100 M90,50 L85,38 M130,45 L135,32 M165,80 L178,75 M168,125 L182,128" 
                    stroke="#ff1744" stroke-width="5" stroke-linecap="round"/>
              <!-- Dragon Head -->
              <path d="M120,50 C140,40 170,45 180,65 C185,75 175,90 155,90 C140,90 125,75 120,50 Z" fill="url(#dragonGoldGrad)"/>
              <!-- Antlers / Horns -->
              <path d="M150,45 L165,15 L160,12 M160,25 L175,20" stroke="#ffd700" stroke-width="4" fill="none" stroke-linecap="round"/>
              <!-- Glowing Dragon Eye -->
              <circle cx="160" cy="62" r="5" fill="#ff1744" stroke="#ffffff" stroke-width="1.5"/>
              <!-- Whiskers -->
              <path d="M175,75 Q195,85 185,110" stroke="#ffd700" stroke-width="3" fill="none"/>
              <path d="M170,80 Q190,95 180,120" stroke="#ffd700" stroke-width="2" fill="none"/>
              <!-- Sacred Dragon Pearl (Thần Châu) -->
              <circle cx="95" cy="115" r="18" fill="radial-gradient(circle, #ffffff, #00e5ff)" stroke="#ffd700" stroke-width="3"/>
              <circle cx="95" cy="115" r="14" fill="#00e5ff" opacity="0.8"/>
            </svg>
          </div>

          <!-- Mystical Calligraphy "LỘC" -->
          <div class="golden-loc-glyph hidden" id="golden-loc">
            <div class="loc-calligraphy-seal">
              <span class="loc-text">LỘC</span>
            </div>
            <div class="loc-subtext">ĐẠI CÁT ĐẠI LỢI • VẠN SỰ NHƯ Ý</div>
          </div>
        </div>

        <!-- Pinterest-style Animated Finger Guide -->
        <div class="finger-guide-prompt" id="finger-guide" style="margin-top: 10px;">
          <div class="finger-guide-bubble">Thức tỉnh Thần Long! 👆</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>🐉 Rồng Thiêng Ban Lộc • Đón May Mắn Cả Năm</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const dragon = this.container.querySelector('#dragon-actor');
    if (dragon) {
      dragon.addEventListener('click', () => {
        if (this.isBusy) return;
        this.awakenDragon();
      });
    }
  }

  awakenDragon() {
    if (!this.canPlay()) return;
    this.isBusy = true;
    const dragon = this.container.querySelector('#dragon-actor');
    const locGlyph = this.container.querySelector('#golden-loc');
    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    sound.playDragonRoar();
    dragon.classList.add('dragon-awakened');

    setTimeout(() => {
      dragon.classList.add('dragon-swooping');
      sound.playMagicChime();
    }, 400);

    setTimeout(() => {
      locGlyph.classList.remove('hidden');
      locGlyph.classList.add('loc-manifest');
      sound.playWinFanfare();

      const stage = this.container.querySelector('.game-stage');
      if (stage) stage.classList.add('shake-screen');

      const rect = locGlyph.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      if (this.context && this.context.particles) {
        this.context.particles.burstGold(x, y, 60);
      }
    }, 1500);

    setTimeout(() => {
      this.triggerReward();
    }, 2800);
  }
}
