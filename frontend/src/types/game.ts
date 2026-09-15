export type GameStatus = 
  | 'IDLE' 
  | 'INTRO' 
  | 'READY' 
  | 'PLAYING' 
  | 'PAUSED'
  | 'RESULT' 
  | 'REWARD_REVEAL' 
  | 'COMPLETED' 
  | 'ERROR';

export type RewardType = 'POINT' | 'VOUCHER' | 'GIFT' | 'SPECIAL';

export interface MiniGame {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  season: 'Valentine' | 'Phái Đẹp' | 'Giáng Sinh' | 'Tết Cổ Truyền';
  tag: string;
  index: string; // '01' - '10'
  theme: {
    primary: string;
    accent: string;
    bgGradient: string;
  };
  playLimitPerDay: number;
  active: boolean;
}

export interface GameSession {
  id: string;
  userId?: string;
  gameId: string;
  status: 'STARTED' | 'PLAYING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  score: number;
  startedAt: string;
  finishedAt?: string;
}

export interface GameResult {
  id: string;
  sessionId: string;
  score: number;
  isWin: boolean;
  verifiedByGameService: boolean;
  metadata?: Record<string, unknown>;
}

export interface Reward {
  id: string;
  name: string;
  type: RewardType;
  value: number;
  code: string;
  rarity?: string;
  description?: string;
  expiry?: string;
}

export interface GamePlayHistory {
  id: string;
  gameSlug: string;
  gameName: string;
  score: number;
  rewardSummary?: string;
  playedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errorCode?: string;
}

export interface DropRateItem {
  rewardId: string;
  name: string;
  type: string;
  value: number;
  rarity: string;
  weight: number;
  probabilityPercent: number;
}

export interface DropRateConfig {
  gameId: string;
  totalWeight: number;
  items: DropRateItem[];
}
