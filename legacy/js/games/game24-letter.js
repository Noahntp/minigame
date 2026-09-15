import { BaseGame } from './base-game.js';
import { sound } from '../audio.js';

export class Game24Letter extends BaseGame {
  constructor() {
    super({
      id: 'game-24',
      name: 'Mở Thư Tình',
      icon: '💌',
      season: '14.2 Valentine',
      defaultPrize: {
        icon: '💌',
        title: 'Lời Yêu Ngọt Ngào',
        desc: 'Voucher Giảm 35% Bữa Tối Lãng Mạn & Trà Chiều Dành Cho 2 Người',
        code: 'SWEETLOVE142',
        expiry: 'HSD: 28/02/2026'
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="game-stage stage-letter">
        <div class="candlelight-ambient"></div>

        <div class="game-instruction-badge">
          <span class="pulse-dot"></span>
          <span>Chạm vào con dấu sáp để mở bức thư tình bí mật!</span>
        </div>

        <!-- 3D Antique Envelope Presentation -->
        <div class="envelope-container" id="envelope-wrapper">
          <div class="envelope" id="envelope">
            <!-- 3D Flap -->
            <div class="envelope-flap" id="envelope-flap"></div>

            <!-- Wax Seal Stamp -->
            <div class="wax-seal" id="wax-seal" title="Chạm mở con dấu!">
              <div class="seal-crest">💌</div>
            </div>

            <!-- Letter Sliding Out -->
            <div class="love-letter" id="love-letter">
              <div class="letter-heading">Gửi Người Tôi Yêu Quý,</div>
              <div class="letter-body">
                "Giữa biển người mênh mông, mỗi cuộc gặp gỡ đều là một phép màu. Chúc bạn luôn rạng rỡ, hạnh phúc và nhận trọn vẹn yêu thương!"
              </div>
              <div class="letter-stamp">
                <span class="stamp-icon">✨</span>
                <span class="stamp-text">ƯU ĐẶC BIỆT 14/2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pinterest-style Animated Finger Guide -->
        <div class="finger-guide-prompt" id="finger-guide" style="margin-top: 15px;">
          <div class="finger-guide-bubble">Bấm mở thư tình! 👆</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>💌 Valentine 14.2 • Gửi Trọn Yêu Thương & Ngọt Ngào</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const wrapper = this.container.querySelector('#envelope-wrapper');
    if (!wrapper) return;
    wrapper.addEventListener('click', () => {
      if (this.isBusy) return;
      this.openLetter();
    });
  }

  openLetter() {
    if (!this.canPlay()) return;
    this.isBusy = true;
    sound.playClick();

    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    const envelope = this.container.querySelector('#envelope');
    const seal = this.container.querySelector('#wax-seal');
    const flap = this.container.querySelector('#envelope-flap');
    const letter = this.container.querySelector('#love-letter');

    // 1. Crack wax seal
    seal.classList.add('seal-cracked');

    // 2. Open flap with sound
    setTimeout(() => {
      flap.classList.add('flap-open');
      sound.playMagicChime();
    }, 280);

    // 3. Slide letter out & burst hearts
    setTimeout(() => {
      letter.classList.add('letter-slide-out');
      sound.playHeartbeat(1.6);

      const rect = envelope.getBoundingClientRect();
      if (this.context && this.context.particles) {
        this.context.particles.burstHearts(rect.left + rect.width / 2, rect.top, 40);
      }
    }, 600);

    // 4. Trigger reward
    setTimeout(() => {
      this.triggerReward();
    }, 1600);
  }
}
