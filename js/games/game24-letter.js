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
          <span>Chạm vào con dấu sáp đỏ để mở bức thư tình hoàng gia!</span>
        </div>

        <!-- 3D Antique Envelope Presentation matching iStock motion -->
        <div class="envelope-container" id="envelope-wrapper">
          <div class="envelope-assembly" id="envelope-assembly">
            <!-- 1. Open Envelope Back (with silk lining, clipped top when closed) -->
            <img
              src="assets/anime_envelope_back.png"
              alt="Envelope Back"
              class="envelope-layer-back"
              id="layer-back"
            />

            <!-- 2. Letter Paper nestled inside pocket -->
            <div class="love-letter-pocket-sheet" id="love-letter">
              <img
                src="assets/anime_unfolded_letter.png"
                alt="Bức Thư Tình Trải Rộng"
                class="parchment-bg-img"
              />
              <div class="parchment-content-overlay">
                <div style="text-align:center; padding-top:2px;">
                  <span style="font-weight:bold; font-size:0.72rem; color:#5c1328; text-transform:uppercase; letter-spacing:1px;">💌 Thư Tình Trao Duyên 💌</span>
                  <div style="font-size:0.58rem; color:#78350f; font-family:monospace; font-weight:600; margin-top:1px;">14.02.2026</div>
                </div>
                <div style="text-align:center; padding: 2px 6px; margin: auto 0;">
                  <div style="font-weight:bold; font-size:0.76rem; color:#3b0718; margin-bottom:2px;">Gửi Người Thương Quý Nơi Phương Xa,</div>
                  <div style="font-style:italic; font-size:0.68rem; color:#260510; line-height:1.36;">
                    "Giữa vạn dặm hồng trần tìm một ánh mắt,<br />
                    dẫu ngàn trùng phong ba lòng vẫn vẹn nguyên.<br />
                    Chúc bạn vạn sự an nhiên, tình duyên viên mãn<br />
                    và đong đầy hạnh phúc!"
                  </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(136,19,55,0.2); padding-top:2px; font-size:0.6rem; color:#5c1328; font-weight:bold;">
                  <span>Mắt Bão MiniGame Atelier</span>
                  <span>Vĩnh Kết Đồng Tâm 💕</span>
                </div>
              </div>
            </div>

            <!-- 3. Front Pocket with Pink Bow -->
            <img
              src="assets/anime_envelope_front.png"
              alt="Envelope Front Pocket"
              class="envelope-layer-front"
            />

            <!-- 4. Downward Flap with Gold Filigree (3D Flips UP on open) -->
            <div class="envelope-flap-down" id="envelope-flap">
              <img
                src="assets/anime_flap_closed_down.png"
                alt="Flap Closed"
                class="flap-down-img"
              />
            </div>

            <!-- 5. Wax Seal on Flap -->
            <div class="wax-seal-target" id="wax-seal" title="Chạm mở con dấu!">
              <div class="wax-seal-pulse-ring" id="seal-ring"></div>
              <img src="assets/anime_wax_seal_standalone.png" alt="Ruby Wax Seal" style="width:100%;height:100%;object-fit:contain;" />
            </div>

            <!-- 6. Emerged Voucher Badge -->
            <div class="voucher-emerge-card" id="voucher-card">
              <div style="font-size:0.68rem; text-transform:uppercase; letter-spacing:1px; color:#fde047; font-weight:bold; margin-bottom:2px;">
                ✨ Voucher Tiệc Tối Lãng Mạn ✨
              </div>
              <div style="font-size:1rem; font-weight:900; color:#fff; text-shadow:0 0 10px rgba(245,158,11,0.8);">
                500.000 VNĐ
              </div>
              <div style="font-size:0.68rem; color:#fda4af; margin-top:2px; font-family:monospace;">
                Mã: SWEETLOVE142 • +560 PTS
              </div>
            </div>
          </div>
        </div>

        <!-- Finger Guide Prompt -->
        <div class="finger-guide-prompt" id="finger-guide" style="margin-top: 15px;">
          <div class="finger-guide-bubble">Chạm mở con dấu sáp! 💌</div>
          <div class="finger-icon">👆</div>
        </div>

        <div class="game-footer-tip">
          <span>💌 Valentine 14.2 • Bức Thư Tình Hoàng Gia Trao Trọn Yêu Thương</span>
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

    const stage = this.container.querySelector('.stage-letter');
    if (stage) stage.classList.add('letter-stage-opened');

    const guide = this.container.querySelector('#finger-guide');
    if (guide) guide.style.display = 'none';

    const assembly = this.container.querySelector('#envelope-assembly');
    const seal = this.container.querySelector('#wax-seal');
    const ring = this.container.querySelector('#seal-ring');
    const letter = this.container.querySelector('#love-letter');
    const voucherCard = this.container.querySelector('#voucher-card');

    if (ring) ring.style.display = 'none';

    // 1. Phá vỡ con dấu sáp (Wax crack audio & vibration)
    sound.playWaxSealCrack();
    if (seal) seal.classList.add('seal-cracked');

    // 2. Mở nắp phong thư lật lên 3D (iStock motion step 1)
    setTimeout(() => {
      if (assembly) assembly.classList.add('assembly-open');
    }, 120);

    // 3. Mở lá thư tình trồi lên từ trong lòng bao thư (iStock motion step 2)
    setTimeout(() => {
      sound.playParchmentUnfold();
      if (letter) {
        letter.classList.add('letter-unfolded-active');
      }

      const rect = this.container.getBoundingClientRect();
      if (this.context && this.context.particles) {
        this.context.particles.burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
      }
    }, 450);

    // 4. Hiện Voucher phần thưởng sau 6s đọc thư trọn vẹn
    setTimeout(() => {
      sound.playReward();
      if (voucherCard) {
        voucherCard.classList.add('voucher-emerge-active');
      }
    }, 6000);

    // 5. Hoàn thành và trao giải sau 14s
    setTimeout(() => {
      this.triggerReward();
    }, 14000);
  }
}
