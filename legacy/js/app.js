import { sound } from './audio.js';
import { ParticleEngine } from './particles.js';
import { RewardsManager } from './rewards.js';
import { GamificationManager } from './gamification.js';

// Import all 10 games
import { Game21Heart } from './games/game21-heart.js';
import { Game22Beauty } from './games/game22-beauty.js';
import { Game23Flower } from './games/game23-flower.js';
import { Game24Letter } from './games/game24-letter.js';
import { Game25Tree } from './games/game25-tree.js';
import { Game26Santa } from './games/game26-santa.js';
import { Game27Snow } from './games/game27-snow.js';
import { Game28Lixi } from './games/game28-lixi.js';
import { Game29Dragon } from './games/game29-dragon.js';
import { Game30Firework } from './games/game30-firework.js';

class MinigameHubApp {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.particles = new ParticleEngine(this.canvas);
    this.rewards = new RewardsManager(this.particles);
    this.gamification = new GamificationManager(this.rewards);

    this.context = {
      sound: sound,
      particles: this.particles,
      rewards: this.rewards,
      gamification: this.gamification
    };

    // Instantiate 10 games
    this.games = [
      new Game21Heart(),
      new Game22Beauty(),
      new Game23Flower(),
      new Game24Letter(),
      new Game25Tree(),
      new Game26Santa(),
      new Game27Snow(),
      new Game28Lixi(),
      new Game29Dragon(),
      new Game30Firework()
    ];

    this.activeGame = null;
    this.currentFilter = 'all';

    this.initUI();
    this.bindControls();

    // Launch default game (Game 21: Trái Tim May Mắn)
    this.selectGame(this.games[0].id);
  }

  initUI() {
    this.renderGameSelector();
    this.updateSoundBtn();
  }

  renderGameSelector() {
    const listEl = document.getElementById('game-selector-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const filteredGames = this.games.filter(g => {
      if (this.currentFilter === 'all') return true;
      if (this.currentFilter === 'valentine') return g.season.includes('Valentine') || g.season.includes('14.2');
      if (this.currentFilter === 'women') return g.season.includes('8.3') || g.season.includes('20.10');
      if (this.currentFilter === 'noel') return g.season.includes('Noel') || g.season.includes('Giáng sinh');
      if (this.currentFilter === 'tet') return g.season.includes('Tết');
      return true;
    });

    const getGameType = (g) => {
      if (g.id === 'game-27') return 'ARCADE';
      if (g.id === 'game-22' || g.id === 'game-28') return 'GACHA';
      if (g.id === 'game-30') return 'KHAI XUÂN';
      return '1-TAP';
    };

    filteredGames.forEach((g) => {
      const card = document.createElement('div');
      const isActive = this.activeGame && this.activeGame.id === g.id;
      card.className = `game-nav-card ${isActive ? 'active' : ''}`;
      card.dataset.id = g.id;
      card.innerHTML = `
        <div class="nav-card-icon">${g.icon}</div>
        <div class="nav-card-info">
          <div class="nav-card-num">
            <span>#${g.id.replace('game-', '')}</span>
            <span class="nav-card-type-tag">${getGameType(g)}</span>
          </div>
          <div class="nav-card-title">${g.name}</div>
          <div class="nav-card-season">${g.season}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        sound.playClick();
        this.selectGame(g.id);
      });

      listEl.appendChild(card);
    });
  }

  selectGame(gameId) {
    const targetGame = this.games.find(g => g.id === gameId);
    if (!targetGame) return;

    if (this.activeGame) {
      this.activeGame.unmount();
    }
    this.particles.clear();

    this.activeGame = targetGame;

    const stageContainer = document.getElementById('active-game-container');
    if (stageContainer) {
      this.activeGame.mount(stageContainer, this.context);
    }

    const allCards = document.querySelectorAll('.game-nav-card');
    allCards.forEach(c => {
      if (c.dataset.id === gameId) c.classList.add('active');
      else c.classList.remove('active');
    });

    // Update iPhone Dynamic Island
    const islandStatus = document.getElementById('island-status');
    if (islandStatus) {
      islandStatus.style.display = 'block';
      islandStatus.textContent = `${targetGame.icon} ${targetGame.name}`;
    }

    this.updateConfigDrawer();
  }

  bindControls() {
    // 1. Season filter tabs
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.dataset.filter;
        sound.playClick();
        this.renderGameSelector();
      });
    });

    // 2. Sound Toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        this.updateSoundBtn();
        if (!isMuted) sound.playClick();
      });
    }

    // 3. View Mode Toggle (Mobile Frame vs Fullscreen)
    const viewBtn = document.getElementById('btn-toggle-view');
    const stageWrapper = document.getElementById('stage-frame-wrapper');
    if (viewBtn && stageWrapper) {
      viewBtn.addEventListener('click', () => {
        sound.playClick();
        stageWrapper.classList.toggle('full-screen-mode');
        const isFull = stageWrapper.classList.contains('full-screen-mode');
        viewBtn.innerHTML = isFull 
          ? '<span>📱 Khung Mobile</span>' 
          : '<span>🖥️ Toàn Màn Hình</span>';
        setTimeout(() => this.particles.resize(), 100);
      });
    }

    // 4. Replay Button
    const replayBtn = document.getElementById('btn-header-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        sound.playClick();
        if (this.activeGame) this.activeGame.reset();
      });
    }

    // 5. Dev Config Drawer Toggle
    const configBtn = document.getElementById('btn-open-config');
    const configDrawer = document.getElementById('config-drawer');
    const configClose = document.getElementById('config-close-btn');
    if (configBtn && configDrawer) {
      configBtn.addEventListener('click', () => {
        sound.playClick();
        configDrawer.classList.toggle('open');
      });
    }
    if (configClose && configDrawer) {
      configClose.addEventListener('click', () => {
        configDrawer.classList.remove('open');
      });
    }

    // 6. Apply Custom Prize from Drawer
    const applyBtn = document.getElementById('btn-apply-config');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        if (!this.activeGame) return;
        const codeInput = document.getElementById('cfg-voucher-code');
        const titleInput = document.getElementById('cfg-prize-title');
        const descInput = document.getElementById('cfg-prize-desc');

        this.activeGame.defaultPrize = {
          ...this.activeGame.defaultPrize,
          code: codeInput.value || this.activeGame.defaultPrize.code,
          title: titleInput.value || this.activeGame.defaultPrize.title,
          desc: descInput.value || this.activeGame.defaultPrize.desc
        };
        sound.playCoin();
        this.rewards.showToast('Đã lưu cấu hình phần thưởng!');
        if (configDrawer) configDrawer.classList.remove('open');
      });
    }

    // 7. Test Reward Popup directly
    const testRewardBtn = document.getElementById('btn-test-reward');
    if (testRewardBtn) {
      testRewardBtn.addEventListener('click', () => {
        if (this.activeGame) {
          this.activeGame.triggerReward();
        }
      });
    }
  }

  updateSoundBtn() {
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (!soundBtn) return;
    if (sound.isMuted) {
      soundBtn.classList.add('sound-muted');
      soundBtn.innerHTML = '<span>🔇 Đang Tắt Âm</span>';
    } else {
      soundBtn.classList.remove('sound-muted');
      soundBtn.innerHTML = `
        <div class="sound-wave-icon">
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
        </div>
        <span>Âm Thanh: Bật</span>
      `;
    }
  }

  updateConfigDrawer() {
    if (!this.activeGame) return;
    const codeInput = document.getElementById('cfg-voucher-code');
    const titleInput = document.getElementById('cfg-prize-title');
    const descInput = document.getElementById('cfg-prize-desc');

    if (codeInput) codeInput.value = this.activeGame.defaultPrize.code;
    if (titleInput) titleInput.value = this.activeGame.defaultPrize.title;
    if (descInput) descInput.value = this.activeGame.defaultPrize.desc;
  }
}

// Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MinigameHubApp();
});
