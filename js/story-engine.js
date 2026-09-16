/**
 * StoryEngine - Hệ thống Cốt Truyện Nhập Vai & Dẫn Chuyện Mini Game
 * Vũ trụ: "Biên Niên Sử Vận May - Cuộc Phiêu Lưu Tầm Bảo Tứ Quý"
 * Linh vật dẫn đường: Bé Mây ☁️ (Sứ Giả Mắt Bão)
 */

import { sound } from './audio.js';

export const STORIES = {
  'game-21': {
    chapterId: 'chap-1',
    chapterName: 'Chương I: Vương Quốc Trái Tim',
    season: 'Valentine 14.2',
    title: 'Hồi Sinh Trái Tim Thần Nữ',
    npc: 'Bé Mây ☁️',
    dialogue: 'Hỡi Nhà Du Hành! Lâu đài Pha Lê đang bị bóng tối giá lạnh bao phủ, Trái Tim Thần Nữ bị đóng băng khiến tình yêu thế gian nguội lạnh. Bạn hãy chạm liên tục để truyền hơi ấm thần thánh hồi sinh ngọn lửa tình yêu!',
    questGoal: 'Nạp đầy 100% Năng Lượng Tình Yêu',
    epilogue: 'Trái Tim Thần Nữ đã đập rộn ràng trở lại! Đôi cánh thiên thần dang rộng tỏa sáng muôn nơi. Thần Nữ trao tặng bạn Món Quà Định Mệnh mang lại may mắn trọn đời!'
  },
  'game-24': {
    chapterId: 'chap-1',
    chapterName: 'Chương I: Vương Quốc Trái Tim',
    season: 'Valentine 14.2',
    title: 'Bí Mật Phong Thư Của Thần Cupid',
    npc: 'Bé Mây ☁️',
    dialogue: 'Giữa thư viện hoàng gia đã ngủ yên ngàn năm, Thần Cupid đã phong ấn một bức mật thư bằng con dấu sáp ma thuật cổ. Lời tiên tri định mệnh chỉ thức tỉnh khi con dấu bị phá vỡ bởi người hữu duyên!',
    questGoal: 'Phá vỡ triện sáp đỏ giải mã phong thư tình',
    epilogue: 'Triện sáp đã vỡ tan! Mật thư hé lộ những lời chúc ngọt ngào nhất thế gian cùng phần quà thượng hạng dành riêng cho bạn và người thương!'
  },
  'game-22': {
    chapterId: 'chap-2',
    chapterName: 'Chương II: Đền Thánh Sắc Đẹp',
    season: '8.3 & 20.10',
    title: 'Tam Đại Bảo Dược Nữ Thần',
    npc: 'Bé Mây ☁️',
    dialogue: 'Chào mừng bạn đến Thánh Đường Nhan Sắc! Nơi đây cất giữ 3 bảo vật vĩnh cửu của Thần Vệ Nữ: Son Velvet Ruby quyền quý, Nước Hoa Rose Élite say đắm và Serum Kim Cương hồi xuân. Linh cảm của bạn chọn báu vật nào?',
    questGoal: 'Chọn 1 trong 3 bảo vật để đón luồng sáng God Rays',
    epilogue: 'Luồng sáng Thiên Khải bừng nở! Bảo vật bạn chọn đã hòa quyện cùng vận khí thanh xuân, mang lại món quà tôn vinh vẻ đẹp kiêu sa!'
  },
  'game-23': {
    chapterId: 'chap-2',
    chapterName: 'Chương II: Đền Thánh Sắc Đẹp',
    season: '8.3 & 20.10',
    title: 'Đóa Hoa Tiên Nở Rộ',
    npc: 'Bé Mây ☁️',
    dialogue: 'Vườn ươm tiên cảnh trăm năm mới nở một lần! Trong 3 đóa hoa tiên kia có chứa giọt sương bất tử. Bạn hãy tự tay hái đóa hoa rung động tâm can nhất để kích hoạt phép màu bung nở toàn đất trời!',
    questGoal: 'Hái đóa hoa tiên để mở khóa Đóa Hoa Khổng Lồ',
    epilogue: 'Hương hoa ngạt ngào lan tỏa khắp không gian! Tiên hoa hiển linh tán thưởng tâm hồn thuần khiết của bạn bằng gói quà ngập tràn phúc lộc!'
  },
  'game-25': {
    chapterId: 'chap-3',
    chapterName: 'Chương III: Miền Cực Quang Băng Tuyết',
    season: 'Giáng Sinh Noel',
    title: 'Ngọn Hải Đăng Cây Thông Tuyết',
    npc: 'Bé Mây ☁️',
    dialogue: 'Đêm đông Bắc Cực bão tuyết mịt mù, ngọn hải đăng Cây Thông Cổ Thụ Alaska bị mất đi nguồn sáng khiến cỗ xe quà tặng không thể định vị. Hãy chạm vào Ngôi Sao Bethlehem trên đỉnh để thắp sáng toàn bộ cây thông!',
    questGoal: 'Truyền năng lượng vào Ngôi Sao Vàng đỉnh cây',
    epilogue: 'Kỳ tích xuất hiện! Toàn bộ cây thông bừng sáng hào quang muôn màu, xua tan màn đêm giá lạnh và làm rơi chiếc rương báu vật Giáng Sinh xuống chân bạn!'
  },
  'game-26': {
    chapterId: 'chap-3',
    chapterName: 'Chương III: Miền Cực Quang Băng Tuyết',
    season: 'Giáng Sinh Noel',
    title: 'Hiệu Lệnh Chuông Vàng Santa',
    npc: 'Bé Mây ☁️',
    dialogue: 'Ông Già Noel đang cưỡi cỗ xe 8 tuần lộc bay giữa dải Cực Quang tím biếc, nhưng sương mù che khuất nhân gian! Hãy rung hồi chuông đồng thánh thót để dẫn lối cỗ xe thần bay đến toạ độ của bạn!',
    questGoal: 'Rung chuông vàng cổ triệu hồi cỗ xe bay',
    epilogue: 'Keng! Tiếng chuông ngân vang vạn dặm! Santa lướt qua vầng trăng bạc và ném thẳng rương quà hoàng kim về phía bạn. Điều ước Giáng Sinh đã thành hiện thực!'
  },
  'game-27': {
    chapterId: 'chap-3',
    chapterName: 'Chương III: Miền Cực Quang Băng Tuyết',
    season: 'Giáng Sinh Noel',
    title: 'Thu Thập Băng Tinh Thời Gian',
    npc: 'Bé Mây ☁️',
    dialogue: 'Cơn lốc xoáy thời gian sắp đóng lại trong 15 giây! Những bông tuyết chứa mảnh vỡ ký ức vàng son đang rơi xuống. Hãy nhanh tay đóng băng thật nhiều hoa tuyết Lam, Vàng và Kim Cương để tích lũy điểm năng lượng!',
    questGoal: 'Bắt thật nhiều hoa tuyết trong 15 giây kịch tính',
    epilogue: 'Phản xạ thần sầu! Bạn đã cứu vớt đủ số lượng Băng Tinh ma thuật, được vinh danh là Thủ Lĩnh Băng Giá và nhận phần thưởng xứng tầm anh hùng!'
  },
  'game-28': {
    chapterId: 'chap-4',
    chapterName: 'Chương IV: Thiên Cung Khai Xuân',
    season: 'Tết Nguyên Đán',
    title: 'Bí Tàng Tứ Phúc Khai Xuân',
    npc: 'Bé Mây ☁️',
    dialogue: 'Thời khắc đầu năm mới, Thiên Đình mở kho báu Tứ Đại Phúc Tinh: PHÚC (An Khang), LỘC (Phú Quý), THỌ (Bình An), TÀI (Tấn Tới). Hãy vận dụng linh giác chọn phong bao may mắn nhất của đời mình!',
    questGoal: 'Chọn phong bao lì xì hoàng gia đón phúc lộc',
    epilogue: 'Càn khôn mở hội! Phong bao phát sáng làm tuôn trào thác lũ tiền vàng 3D và kim nguyên bảo. Chúc bạn một năm mới tấn tài tấn lộc, vạn sự hanh thông!'
  },
  'game-29': {
    chapterId: 'chap-4',
    chapterName: 'Chương IV: Thiên Cung Khai Xuân',
    season: 'Tết Giáp Thìn',
    title: 'Thần Long Thức Tỉnh & Bảo Châu',
    npc: 'Bé Mây ☁️',
    dialogue: 'Kim Long ngàn năm đang say giấc trên biển mây ngũ sắc. Trên miệng Người ngậm viên Thần Châu tích tụ linh khí đất trời. Hãy chạm vào thân rồng để đánh thức Thần Long giáng trần ban chữ LỘC đại cát!',
    questGoal: 'Chạm vào thân Rồng Vàng đánh thức linh thú',
    epilogue: 'Tiếng rồng gầm rung chuyển đất trời! Kim Long uốn lượn thăng thiên, hóa giải viên Thần Châu thành Triện ngọc thư pháp chữ LỘC nạm vàng ròng trao tay bạn!'
  },
  'game-30': {
    chapterId: 'chap-4',
    chapterName: 'Chương IV: Thiên Cung Khai Xuân',
    season: 'Tết / Năm Mới',
    title: 'Pháo Lệnh Khai Thiên Lập Địa',
    npc: 'Bé Mây ☁️',
    dialogue: 'Đêm Giao Thừa thiêng liêng đã điểm! Giàn pháo thần công 5 nòng chạm khắc vảy rồng đang đợi người hữu công châm ngòi hỏa pháo để xua tan xui xẻo năm cũ, khai phóng vận hội hoàng kim năm mới!',
    questGoal: 'Châm ngòi nổ đại bác khai pháo đón xuân',
    epilogue: 'Đoành! Loạt pháo lệnh xé toạc màn đêm, nở bung muôn đóa hoa cúc lửa và liễu rủ vàng óng. Bạn đã khai mở Giải Đặc Biệt Hoàng Kim năm 2026!'
  }
};

class StoryEngine {
  constructor() {
    this.currentStory = null;
  }

  getStory(gameId) {
    return STORIES[gameId] || null;
  }

  /**
   * Hiển thị hộp thoại Story Dialogue Box phong cách RPG / Visual Novel
   */
  showStoryDialogue(gameId, container, onStartQuest) {
    const story = this.getStory(gameId);
    if (!story || (typeof window !== 'undefined' && window.location.search.includes('skipStory=true'))) {
      if (onStartQuest) onStartQuest();
      return;
    }

    // Remove existing dialogue if present
    const existing = container.querySelector('.story-dialogue-overlay');
    if (existing) existing.remove();

    sound.playMagicChime();

    const overlay = document.createElement('div');
    overlay.className = 'story-dialogue-overlay';
    overlay.innerHTML = `
      <div class="story-dialogue-card">
        <button class="story-card-close-btn" id="btn-close-story" title="Đóng">&times;</button>
        <div class="story-chapter-tag">
          <span>${story.chapterName}</span>
          <span class="story-tag-dot">•</span>
          <span>${story.season}</span>
        </div>

        <div class="story-npc-row">
          <div class="npc-avatar-box">
            <div class="npc-avatar-inner">☁️</div>
            <div class="npc-status-dot"></div>
          </div>
          <div class="npc-info-col">
            <div class="npc-name">${story.npc}</div>
            <div class="npc-title">Sứ Giả Không Gian Mắt Bão</div>
          </div>
        </div>

        <h3 class="story-quest-title">⚔️ ${story.title}</h3>

        <div class="story-dialogue-bubble">
          <p class="story-dialogue-text">"${story.dialogue}"</p>
        </div>

        <div class="story-quest-badge">
          <span class="quest-icon">🎯</span>
          <span class="quest-text"><strong>Mục tiêu:</strong> ${story.questGoal}</span>
        </div>

        <div class="story-action-row">
          <button class="btn-story-detail" id="btn-view-lore">
            <span>📖 Đọc Biên Niên Sử</span>
          </button>
          <button class="btn-story-start" id="btn-start-quest">
            <span>CHƠI NGAY ⚔️</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(overlay);

    const dismissDialogue = () => {
      sound.playClick();
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
        if (onStartQuest) onStartQuest();
      }, 250);
    };

    const startBtn = overlay.querySelector('#btn-start-quest');
    const viewLoreBtn = overlay.querySelector('#btn-view-lore');
    const closeBtn = overlay.querySelector('#btn-close-story');

    if (startBtn) startBtn.addEventListener('click', dismissDialogue);
    if (closeBtn) closeBtn.addEventListener('click', dismissDialogue);

    // Clicking overlay backdrop dismisses
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        dismissDialogue();
      }
    });

    if (viewLoreBtn) {
      viewLoreBtn.addEventListener('click', () => {
        sound.playClick();
        this.openLoreModal(gameId);
      });
    }
  }

  /**
   * Mở Modal toàn văn "Biên Niên Sử Vận May - Cuộc Phiêu Lưu Tứ Quý"
   */
  openLoreModal(focusGameId = 'game-21') {
    let modal = document.querySelector('#story-lore-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'story-lore-modal';
      modal.className = 'story-lore-modal-container hidden';
      document.body.appendChild(modal);
    }

    const chapters = [
      {
        id: 'chap-1',
        name: 'Chương I: Vương Quốc Trái Tim',
        icon: '💖',
        season: 'Mùa Yêu Thương (Valentine 14.2)',
        desc: 'Nơi cất giữ ngọn lửa tình yêu vĩnh cửu của thế gian, bị giam cầm trong lâu đài băng giá.',
        games: ['game-21', 'game-24']
      },
      {
        id: 'chap-2',
        name: 'Chương II: Đền Thánh Sắc Đẹp',
        icon: '💄',
        season: 'Mùa Tôn Vinh Phái Đẹp (8.3 & 20.10)',
        desc: 'Vùng đất của sự thanh xuân bất diệt, nơi hội tụ 3 bảo dược thượng hạng và hoa tiên nghìn năm.',
        games: ['game-22', 'game-23']
      },
      {
        id: 'chap-3',
        name: 'Chương III: Miền Cực Quang Băng Tuyết',
        icon: '🎄',
        season: 'Mùa Giáng Sinh Huyền Ảo (Noel)',
        desc: 'Băng qua dải Cực quang uốn lượn sắc tím Bắc cực, thắp sáng hải đăng tuyết và cứu lấy cỗ xe Santa.',
        games: ['game-25', 'game-26', 'game-27']
      },
      {
        id: 'chap-4',
        name: 'Chương IV: Thiên Cung Khai Xuân',
        icon: '🧧',
        season: 'Mùa Tết Nguyên Đán & Khai Xuân',
        desc: 'Thiên cung mở hội nghênh đón năm Giáp Thìn, đánh thức Thần Long ngậm Thần Châu chữ LỘC.',
        games: ['game-28', 'game-29', 'game-30']
      }
    ];

    modal.innerHTML = `
      <div class="story-lore-modal-backdrop"></div>
      <div class="story-lore-modal-sheet">
        <div class="lore-modal-header">
          <div class="lore-header-left">
            <span class="lore-book-icon">📜</span>
            <div>
              <h2>Biên Niên Sử Vận May</h2>
              <p>Cuộc Phiêu Lưu Tầm Bảo Tứ Quý • Đồng Hành Cùng Bé Mây ☁️</p>
            </div>
          </div>
          <button class="lore-close-btn" id="lore-close-btn">✕</button>
        </div>

        <div class="lore-modal-body">
          <div class="lore-intro-card">
            <p>
              Hỡi <strong>Nhà Du Hành Vận Mệnh</strong>! Thế giới ưu đãi Mắt Bão được bảo hộ bởi 4 đại cõi giới linh thiêng. 
              Mỗi mùa lễ hội, các vị Thần Bảo Hộ lại phong ấn 10 nguồn phúc khí thượng cổ dưới hình dạng các thử thách. 
              Hãy hoàn thành sứ mệnh của từng cõi để thu thập trọn vẹn 10 Cổ Vật Thần Kỳ!
            </p>
          </div>

          <div class="lore-chapters-list">
            ${chapters.map(chap => `
              <div class="lore-chapter-box">
                <div class="chapter-box-header">
                  <div class="chapter-icon-badge">${chap.icon}</div>
                  <div class="chapter-title-group">
                    <h3>${chap.name}</h3>
                    <span class="chapter-season">${chap.season}</span>
                  </div>
                </div>
                <p class="chapter-desc">${chap.desc}</p>
                <div class="chapter-quests-grid">
                  ${chap.games.map(gId => {
                    const st = STORIES[gId];
                    const isFocus = gId === focusGameId;
                    return `
                      <div class="quest-card ${isFocus ? 'focused-quest' : ''}">
                        <div class="quest-card-top">
                          <span class="quest-num">${gId.toUpperCase()}</span>
                          <span class="quest-title">${st.title}</span>
                        </div>
                        <p class="quest-lore-text">"${st.dialogue}"</p>
                        <div class="quest-card-footer">
                          <span class="quest-goal-tag">🎯 ${st.questGoal}</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lore-modal-footer">
          <button class="btn-primary-glow" id="lore-confirm-btn" style="width: 100%;">
            <span>SẴN SÀNG CHINH PHỤC CÁC CÕI GIỚI ⚔️</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    const closeBtn = modal.querySelector('#lore-close-btn');
    const confirmBtn = modal.querySelector('#lore-confirm-btn');
    const backdrop = modal.querySelector('.story-lore-modal-backdrop');

    const closeModal = () => {
      sound.playClick();
      modal.classList.add('hidden');
    };

    closeBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
  }
}

export const storyEngine = new StoryEngine();
