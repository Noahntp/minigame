import { sound } from './audio.js';

/**
 * RewardsManager - Manages prize distribution and reward modal UI
 */
export class RewardsManager {
  constructor(particleEngine) {
    this.particles = particleEngine;
    this.modalEl = null;
    this.onReplayCallback = null;
    this.initModal();
  }

  initModal() {
    let el = document.getElementById('reward-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'reward-modal';
      el.className = 'reward-modal-backdrop hidden';
      el.innerHTML = `
        <div class="reward-card" id="reward-card">
          <div class="reward-glow-ring"></div>
          <button class="reward-close-btn" id="reward-close-btn" title="Đóng">&times;</button>
          
          <div class="reward-badge-wrapper">
            <div class="reward-icon-bubble" id="reward-icon">🎁</div>
            <div class="reward-sparkle-halo"></div>
          </div>

          <h2 class="reward-congrats" id="reward-title">Chúc Mừng Bạn!</h2>
          <p class="reward-subtitle" id="reward-desc">Bạn vừa nhận được phần thưởng đặc biệt</p>

          <!-- Story Epilogue Callout -->
          <div class="reward-epilogue-box hidden" id="reward-epilogue-box">
            <div class="epilogue-badge">🌟 HOÀN THÀNH SỨ MỆNH TỨ QUÝ 🌟</div>
            <p class="epilogue-text" id="reward-epilogue-text"></p>
          </div>

          <div class="reward-voucher-box">
            <div class="voucher-label">✨ MÃ ƯU ĐÃI VIP CHÍNH THỨC ✨</div>
            <div class="voucher-code-wrapper">
              <span class="voucher-code" id="voucher-code">LUCKY2026</span>
              <button class="btn-copy" id="btn-copy-code" title="Sao chép mã">
                <span class="copy-icon">📋</span>
                <span class="copy-text">Sao chép</span>
              </button>
            </div>
            <div class="voucher-barcode">
              <div class="barcode-line thick"></div>
              <div class="barcode-line thin"></div>
              <div class="barcode-line"></div>
              <div class="barcode-line thick"></div>
              <div class="barcode-line thin"></div>
              <div class="barcode-line"></div>
              <div class="barcode-line thick"></div>
              <div class="barcode-line"></div>
              <div class="barcode-line thin"></div>
              <div class="barcode-line thick"></div>
              <div class="barcode-line"></div>
              <div class="barcode-line thin"></div>
              <div class="barcode-line thick"></div>
            </div>
            <div class="voucher-expiry" id="voucher-expiry">Hạn sử dụng: 30 ngày kể từ hôm nay</div>
          </div>

          <div class="reward-actions">
            <button class="btn-primary-glow" id="btn-use-now">
              <span>Sử Dụng Ngay</span>
              <span class="arrow-icon">➔</span>
            </button>
            <button class="btn-secondary-replay" id="btn-replay">
              <span>🔄 Chơi Lại</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(el);
    }
    this.modalEl = el;

    // Attach event listeners
    document.getElementById('reward-close-btn').addEventListener('click', () => this.hide());
    document.getElementById('btn-replay').addEventListener('click', () => {
      this.hide();
      if (this.onReplayCallback) this.onReplayCallback();
    });
    document.getElementById('btn-copy-code').addEventListener('click', () => this.copyVoucherCode());
    document.getElementById('btn-use-now').addEventListener('click', () => {
      this.copyVoucherCode();
      this.showToast('Đã lưu mã ưu đãi! Chúc mừng bạn.');
    });

    // Close on backdrop tap
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.hide();
      }
    });
  }

  show(prize, onReplay) {
    this.onReplayCallback = onReplay;

    const iconEl = document.getElementById('reward-icon');
    const titleEl = document.getElementById('reward-title');
    const descEl = document.getElementById('reward-desc');
    const codeEl = document.getElementById('voucher-code');
    const expiryEl = document.getElementById('voucher-expiry');
    const epilogueBox = document.getElementById('reward-epilogue-box');
    const epilogueText = document.getElementById('reward-epilogue-text');

    iconEl.textContent = prize.icon || '🎁';
    titleEl.textContent = prize.title || 'Chúc Mừng Bạn!';
    descEl.textContent = prize.desc || 'Bạn nhận được phần quà may mắn';
    codeEl.textContent = prize.code || 'MATBAO2026';
    if (prize.expiry) expiryEl.textContent = prize.expiry;

    if (epilogueBox && epilogueText) {
      if (prize.epilogue) {
        epilogueText.textContent = `"${prize.epilogue}"`;
        epilogueBox.classList.remove('hidden');
      } else {
        epilogueBox.classList.add('hidden');
      }
    }

    this.modalEl.classList.remove('hidden');
    this.modalEl.classList.add('visible');

    // Trigger celebration sounds & particles
    sound.playWinFanfare();
    if (this.particles) {
      this.particles.burstConfetti(80);
    }
  }

  hide() {
    this.modalEl.classList.remove('visible');
    setTimeout(() => {
      this.modalEl.classList.add('hidden');
    }, 300);
  }

  copyVoucherCode() {
    const code = document.getElementById('voucher-code').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.showToast(`Đã sao chép mã: ${code}`);
      }).catch(() => {
        this.fallbackCopy(code);
      });
    } else {
      this.fallbackCopy(code);
    }
  }

  fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    this.showToast(`Đã sao chép mã: ${text}`);
  }

  showToast(message) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    sound.playClick();
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }
}
