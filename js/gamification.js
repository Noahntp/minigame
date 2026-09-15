import { sound } from './audio.js';

/**
 * GamificationManager - Handles Player HUD, Turns, Missions, Rules, and Prize History
 * Inspired by top-tier Pinterest & Dribbble e-commerce gamification UX.
 */
export class GamificationManager {
  constructor(rewardsManager) {
    this.rewardsManager = rewardsManager;
    this.turns = parseInt(localStorage.getItem('minigame_user_turns') || '3', 10);
    this.coins = parseInt(localStorage.getItem('minigame_user_coins') || '1888', 10);
    this.prizes = JSON.parse(localStorage.getItem('minigame_user_prizes') || '[]');
    this.missions = [
      { id: 'm1', title: 'Điểm danh ngày mới', reward: 1, type: 'turns', claimed: false, icon: '📅' },
      { id: 'm2', title: 'Khám phá ưu đãi Cloud Mắt Bão', reward: 2, type: 'turns', claimed: false, icon: '🌐' },
      { id: 'm3', title: 'Chia sẻ trò chơi cho bạn bè', reward: 1, type: 'turns', claimed: false, icon: '🚀' },
      { id: 'm4', title: 'Đăng ký nhận bản tin khuyến mãi', reward: 500, type: 'coins', claimed: false, icon: '📩' }
    ];

    this.initUI();
    this.updateHUD();
  }

  save() {
    localStorage.setItem('minigame_user_turns', this.turns.toString());
    localStorage.setItem('minigame_user_coins', this.coins.toString());
    localStorage.setItem('minigame_user_prizes', JSON.stringify(this.prizes));
  }

  consumeTurn() {
    if (this.turns > 0) {
      this.turns--;
      this.save();
      this.updateHUD();
      return true;
    }
    // If out of turns, open missions drawer
    sound.playClick();
    this.openMissionsModal();
    this.rewardsManager.showToast('Bạn đã hết lượt chơi! Hoàn thành nhiệm vụ để nhận thêm nhé.');
    return false;
  }

  addTurn(amount = 1) {
    this.turns += amount;
    this.save();
    this.updateHUD();
    sound.playCoin();
    this.rewardsManager.showToast(`+${amount} Lượt chơi mới đã được cộng vào tài khoản!`);
  }

  addPrize(prize) {
    const record = {
      ...prize,
      wonAt: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      id: 'pz_' + Date.now()
    };
    this.prizes.unshift(record);
    this.coins += 200;
    this.save();
    this.updateHUD();
  }

  updateHUD() {
    const turnsEl = document.getElementById('hud-turns-count');
    const coinsEl = document.getElementById('hud-coins-count');
    const prizesBadge = document.getElementById('hud-prizes-badge');

    if (turnsEl) turnsEl.textContent = this.turns;
    if (coinsEl) coinsEl.textContent = this.coins.toLocaleString();
    if (prizesBadge) prizesBadge.textContent = this.prizes.length;
  }

  initUI() {
    // 1. Rules Modal
    this.createRulesModal();
    // 2. My Prizes History Modal
    this.createPrizesModal();
    // 3. Missions Drawer Modal
    this.createMissionsModal();

    // Attach HUD button listeners
    const btnStory = document.getElementById('hud-btn-story');
    const btnRules = document.getElementById('hud-btn-rules');
    const btnPrizes = document.getElementById('hud-btn-prizes');
    const btnMissions = document.getElementById('hud-btn-missions');
    const btnAddTurn = document.getElementById('hud-btn-add-turn');

    if (btnStory) btnStory.addEventListener('click', () => {
      sound.playClick();
      // Pass the current active game ID if available
      const activeGameEl = document.querySelector('.game-nav-card.active');
      const gameId = activeGameEl ? activeGameEl.dataset.gameId : 'game-21';
      import('./story-engine.js').then(({ storyEngine }) => {
        storyEngine.openLoreModal(gameId);
      });
    });
    if (btnRules) btnRules.addEventListener('click', () => this.openRulesModal());
    if (btnPrizes) btnPrizes.addEventListener('click', () => this.openPrizesModal());
    if (btnMissions) btnMissions.addEventListener('click', () => this.openMissionsModal());
    if (btnAddTurn) btnAddTurn.addEventListener('click', () => this.openMissionsModal());
  }

  createRulesModal() {
    let el = document.getElementById('rules-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'rules-modal';
      el.className = 'g-modal-backdrop hidden';
      el.innerHTML = `
        <div class="g-modal-card">
          <button class="g-modal-close" id="rules-modal-close">&times;</button>
          <div class="g-modal-header">
            <span class="g-modal-icon">📜</span>
            <h3>Thể Lệ Trò Chơi</h3>
          </div>
          <div class="g-modal-body">
            <div class="rules-step">
              <span class="step-num">1</span>
              <div>
                <strong>Lượt chơi mỗi ngày:</strong> Mỗi tài khoản được tặng miễn phí <strong>3 lượt chơi/ngày</strong> vào lúc 00:00.
              </div>
            </div>
            <div class="rules-step">
              <span class="step-num">2</span>
              <div>
                <strong>Cơ chế trúng quà:</strong> Tương tác với mini game theo đúng chủ đề mùa lễ hội để mở phong bao, hộp quà hoặc hoa lộc.
              </div>
            </div>
            <div class="rules-step">
              <span class="step-num">3</span>
              <div>
                <strong>Nhận thêm lượt:</strong> Tham gia làm nhiệm vụ tại mục <strong>"Nhiệm Vụ"</strong> để rinh thêm tới 10 lượt chơi/ngày.
              </div>
            </div>
            <div class="rules-step">
              <span class="step-num">4</span>
              <div>
                <strong>Sử dụng Voucher:</strong> Mã quà tặng được lưu tự động vào <strong>"Túi Quà"</strong>. Có thể sao chép và áp dụng ngay khi thanh toán dịch vụ Mắt Bão.
              </div>
            </div>
          </div>
          <button class="btn-primary-glow" id="rules-btn-gotit" style="width: 100%; margin-top: 14px;">
            <span>Đã Hiểu - Chơi Ngay!</span>
          </button>
        </div>
      `;
      document.body.appendChild(el);

      document.getElementById('rules-modal-close').addEventListener('click', () => this.closeModal(el));
      document.getElementById('rules-btn-gotit').addEventListener('click', () => this.closeModal(el));
      el.addEventListener('click', (e) => { if (e.target === el) this.closeModal(el); });
    }
  }

  createPrizesModal() {
    let el = document.getElementById('prizes-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'prizes-modal';
      el.className = 'g-modal-backdrop hidden';
      el.innerHTML = `
        <div class="g-modal-card prizes-card">
          <button class="g-modal-close" id="prizes-modal-close">&times;</button>
          <div class="g-modal-header">
            <span class="g-modal-icon">🎁</span>
            <h3>Túi Quà Của Tôi</h3>
          </div>
          <div class="prizes-list-container" id="prizes-list-container">
            <!-- Populated on open -->
          </div>
        </div>
      `;
      document.body.appendChild(el);

      document.getElementById('prizes-modal-close').addEventListener('click', () => this.closeModal(el));
      el.addEventListener('click', (e) => { if (e.target === el) this.closeModal(el); });
    }
  }

  createMissionsModal() {
    let el = document.getElementById('missions-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'missions-modal';
      el.className = 'g-modal-backdrop hidden';
      el.innerHTML = `
        <div class="g-modal-card missions-card">
          <button class="g-modal-close" id="missions-modal-close">&times;</button>
          <div class="g-modal-header">
            <span class="g-modal-icon">🎯</span>
            <h3>Nhiệm Vụ Nhận Lượt Chơi</h3>
          </div>
          <div class="missions-list" id="missions-list">
            <!-- Rendered dynamically -->
          </div>
        </div>
      `;
      document.body.appendChild(el);

      document.getElementById('missions-modal-close').addEventListener('click', () => this.closeModal(el));
      el.addEventListener('click', (e) => { if (e.target === el) this.closeModal(el); });
    }
  }

  openRulesModal() {
    sound.playClick();
    const el = document.getElementById('rules-modal');
    if (el) {
      el.classList.remove('hidden');
      setTimeout(() => el.classList.add('visible'), 10);
    }
  }

  openPrizesModal() {
    sound.playClick();
    const el = document.getElementById('prizes-modal');
    const container = document.getElementById('prizes-list-container');
    if (!el || !container) return;

    if (this.prizes.length === 0) {
      container.innerHTML = `
        <div class="prizes-empty-state">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">🎁</div>
          <h4>Chưa có phần thưởng nào</h4>
          <p>Hãy tham gia chơi ngay các mini game để nhận mã voucher cực hấp dẫn!</p>
        </div>
      `;
    } else {
      container.innerHTML = this.prizes.map(p => `
        <div class="prize-history-item">
          <div class="prize-item-icon">${p.icon || '🎁'}</div>
          <div class="prize-item-content">
            <div class="prize-item-title">${p.title}</div>
            <div class="prize-item-code">Mã: <strong>${p.code}</strong></div>
            <div class="prize-item-date">${p.wonAt} • ${p.expiry || 'HSD: 30 ngày'}</div>
          </div>
          <button class="btn-copy-mini" data-code="${p.code}">Sao chép</button>
        </div>
      `).join('');

      container.querySelectorAll('.btn-copy-mini').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.dataset.code;
          navigator.clipboard.writeText(code);
          sound.playCoin();
          this.rewardsManager.showToast(`Đã sao chép mã: ${code}`);
        });
      });
    }

    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('visible'), 10);
  }

  openMissionsModal() {
    sound.playClick();
    const el = document.getElementById('missions-modal');
    const list = document.getElementById('missions-list');
    if (!el || !list) return;

    list.innerHTML = this.missions.map(m => `
      <div class="mission-item ${m.claimed ? 'claimed' : ''}">
        <div class="mission-icon">${m.icon}</div>
        <div class="mission-info">
          <div class="mission-title">${m.title}</div>
          <div class="mission-reward">Phần thưởng: +${m.reward} ${m.type === 'turns' ? 'Lượt chơi 🎟️' : 'Xu 🪙'}</div>
        </div>
        <button class="btn-claim-mission" data-id="${m.id}" ${m.claimed ? 'disabled' : ''}>
          ${m.claimed ? 'Đã Nhận' : 'Nhận Ngay'}
        </button>
      </div>
    `).join('');

    list.querySelectorAll('.btn-claim-mission').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const target = this.missions.find(m => m.id === id);
        if (target && !target.claimed) {
          target.claimed = true;
          if (target.type === 'turns') {
            this.addTurn(target.reward);
          } else {
            this.coins += target.reward;
            this.save();
            this.updateHUD();
            sound.playCoin();
            this.rewardsManager.showToast(`+${target.reward} Xu đã được cộng vào tài khoản!`);
          }
          this.openMissionsModal();
        }
      });
    });

    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('visible'), 10);
  }

  closeModal(el) {
    sound.playClick();
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('hidden'), 250);
  }
}
