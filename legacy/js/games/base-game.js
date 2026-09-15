import { sound } from '../audio.js';
import { storyEngine } from '../story-engine.js';

/**
 * BaseGame - Abstract class for all minigames
 */
export class BaseGame {
  constructor(config = {}) {
    this.id = config.id || 'game-base';
    this.name = config.name || 'Mini Game';
    this.icon = config.icon || '🎮';
    this.season = config.season || 'Tất cả';
    this.container = null;
    this.context = null; // Contains audio, particles, rewards
    this.isBusy = false;
    this.defaultPrize = config.defaultPrize || {
      icon: '🎁',
      title: 'Quà Tặng May Mắn',
      desc: 'Bạn nhận được voucher khuyến mãi độc quyền',
      code: 'MBPROMO',
      expiry: 'HSD: 30 ngày'
    };
  }

  mount(container, context) {
    this.container = container;
    this.context = context;
    this.isBusy = false;
    this.render();
    this.bindEvents();

    // Show Story RPG Dialogue on game entry
    storyEngine.showStoryDialogue(this.id, this.container, () => {
      // Ready to play after acknowledging story quest
    });
  }

  unmount() {
    this.unbindEvents();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  render() {
    // Child class implements this
  }

  bindEvents() {
    // Child class implements this
  }

  unbindEvents() {
    // Child class cleans up timers, event listeners if any
  }

  reset() {
    this.isBusy = false;
    this.render();
    this.bindEvents();
  }

  canPlay() {
    if (this.context && this.context.gamification) {
      return this.context.gamification.consumeTurn();
    }
    return true;
  }

  triggerReward(customPrize) {
    const basePrize = customPrize || this.defaultPrize;
    const story = storyEngine.getStory(this.id);
    const prize = {
      ...basePrize,
      epilogue: basePrize.epilogue || (story ? story.epilogue : '')
    };

    if (this.context && this.context.gamification) {
      this.context.gamification.addPrize(prize);
    }
    if (this.context && this.context.rewards) {
      this.context.rewards.show(prize, () => this.reset());
    }
  }
}
