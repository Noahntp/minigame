import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game25Tree extends BaseGame {
  constructor() {
    super({
      id: 'game-25',
      name: 'Cây Thông May Mắn',
      icon: '🎄',
      season: 'Noel',
      defaultPrize: {
        icon: '🎄',
        title: 'Lộc Vàng Giáng Sinh',
        desc: 'Voucher Giảm 45% Dịch Vụ Cloud Server & Tên Miền Quốc Tế',
        code: 'XMASNOEL45',
        expiry: 'HSD: 15/01/2027'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-tree">
        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Chạm vào ngôi sao vàng trên đỉnh để thắp sáng cây thông!</span>
        </div>

        <!-- Grand Decorated Christmas Tree -->
        <div class="tree-wrapper">
          <!-- Top Golden Star with Flare -->
          <div class="top-star" id="tree-star" title="Chạm vào ngôi sao!">
            <svg class="star-svg" viewBox="0 0 100 100">
              <defs>
                <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="30%" stop-color="#fff59d" />
                  <stop offset="70%" stop-color="#ffd600" />
                  <stop offset="100%" stop-color="#ff9100" />
                </radialGradient>
              </defs>
              <!-- 8-point Bethlehem Star -->
              <polygon points="50,0 58,35 95,25 68,50 95,75 58,65 50,100 42,65 5,75 32,50 5,25 42,35" fill="url(#starGrad)"/>
              <circle cx="50" cy="50" r="10" fill="#ffffff" opacity="0.9"/>
            </svg>
          </div>

          <!-- Tree SVG with Snow & Baubles -->
          <div class="tree-svg-container" id="tree-tiers">
            <svg class="tree-svg-main" viewBox="0 0 240 280">
              <defs>
                <linearGradient id="pineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#2e7d32" />
                  <stop offset="50%" stop-color="#1b5e20" />
                  <stop offset="100%" stop-color="#0a3610" />
                </linearGradient>
                <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#5d4037" />
                  <stop offset="50%" stop-color="#3e2723" />
                  <stop offset="100%" stop-color="#271612" />
                </linearGradient>
              </defs>

              <!-- Trunk -->
              <rect x="105" y="240" width="30" height="36" rx="4" fill="url(#trunkGrad)"/>

              <!-- Tier 3 (Bottom) -->
              <polygon points="120,130 10,240 230,240" fill="url(#pineGrad)"/>
              <path d="M10,240 Q120,225 230,240 L215,250 Q120,235 25,250 Z" fill="#ffffff" opacity="0.85"/>

              <!-- Tier 2 (Middle) -->
              <polygon points="120,70 35,160 205,160" fill="url(#pineGrad)"/>
              <path d="M35,160 Q120,145 205,160 L195,170 Q120,155 45,170 Z" fill="#ffffff" opacity="0.85"/>

              <!-- Tier 1 (Top) -->
              <polygon points="120,15 60,95 180,95" fill="url(#pineGrad)"/>
              <path d="M60,95 Q120,80 180,95 L170,105 Q120,90 70,105 Z" fill="#ffffff" opacity="0.85"/>

              <!-- Garland String Lights -->
              <path d="M70,80 Q120,105 170,80" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="4,4" fill="none"/>
              <path d="M50,140 Q120,175 190,140" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="5,5" fill="none"/>
              <path d="M30,210 Q120,250 210,210" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="6,6" fill="none"/>

              <!-- Shiny Glass Baubles -->
              <circle cx="100" cy="85" r="7" fill="#ff1744" stroke="#ffd700" stroke-width="1"/>
              <circle cx="140" cy="85" r="7" fill="#ffd700" stroke="#fff" stroke-width="1"/>
              <circle cx="75" cy="145" r="9" fill="#00e5ff" stroke="#fff" stroke-width="1"/>
              <circle cx="120" cy="155" r="9" fill="#ff007f" stroke="#ffd700" stroke-width="1"/>
              <circle cx="165" cy="145" r="9" fill="#ffd700" stroke="#fff" stroke-width="1"/>
              <circle cx="55" cy="215" r="10" fill="#ffd700" stroke="#fff" stroke-width="1.5"/>
              <circle cx="95" cy="225" r="10" fill="#ff1744" stroke="#ffd700" stroke-width="1.5"/>
              <circle cx="145" cy="225" r="10" fill="#76ff03" stroke="#fff" stroke-width="1.5"/>
              <circle cx="185" cy="215" r="10" fill="#d500f9" stroke="#ffd700" stroke-width="1.5"/>
            </svg>
          </div>

          <!-- Dropped Present Under Tree -->
          <div class="tree-present hidden" id="tree-present">
            <svg class="present-vector-box" viewBox="0 0 100 100">
              <rect x="15" y="35" width="70" height="55" rx="8" fill="#d32f2f" stroke="#ffd700" stroke-width="2"/>
              <rect x="10" y="25" width="80" height="15" rx="4" fill="#b71c1c" stroke="#ffd700" stroke-width="2"/>
              <!-- Gold Ribbons -->
              <rect x="44" y="25" width="12" height="65" fill="#ffd700"/>
              <rect x="15" y="55" width="70" height="12" fill="#ffd700"/>
              <!-- Bow on top -->
              <path d="M35,15 C45,5 45,25 50,25 C55,25 55,5 65,15 C70,25 50,25 50,25 Z" fill="#ffd700" stroke="#fff" stroke-width="1"/>
            </svg>
            <div class="present-label">QUÀ TẶNG GIÁNG SINH!</div>
          </div>
        </div>

        <!-- Pinterest-style Animated Finger Guide -->
        <div class="finger-guide-prompt" id="finger-guide" style="margin-top: 10px;">
          <div class="finger-guide-bubble">Chạm ngôi sao đỉnh cây! 👆</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>🎄 Giáng Sinh Diệu Kỳ • Thắp Sáng Cây Thông Rinh Lộc</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const star = this.container.querySelector('#tree-star');
    const tree = this.container.querySelector('.pine-tree-figure');
    const handleTap = () => {
      if (this.isBusy) return;
      this.lightUpTree();
    };
    if (star) {
      star.addEventListener('click', handleTap);
    }
    if (tree) {
      tree.addEventListener('click', handleTap);
    }

    if (this.context && this.context.particles) {
      this.context.particles.addSnowflakes(25);
    }
  }

  lightUpTree() {
    if (!this.canPlay()) return;
    this.isBusy = true;
    sound.playBell();

    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    const star = this.container.querySelector('#tree-star');
    const tiers = this.container.querySelector('#tree-tiers');
    const present = this.container.querySelector('#tree-present');

    star.classList.add('star-super-glow');

    setTimeout(() => {
      sound.playSleighBells();
      tiers.classList.add('tree-lit-up');
    }, 300);

    setTimeout(() => {
      present.classList.remove('hidden');
      present.classList.add('present-drop');
      sound.playMagicChime();

      const rect = present.getBoundingClientRect();
      if (this.context && this.context.particles) {
        this.context.particles.burstHearts(rect.left + rect.width / 2, rect.top, 30);
      }
    }, 900);

    setTimeout(() => {
      this.triggerReward();
    }, 1800);
  }

  unbindEvents() {
    if (this.context && this.context.particles) {
      this.context.particles.clear();
    }
  }
}
