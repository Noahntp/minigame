import axios from 'axios';
import type { ApiResponse, GamePlayHistory, MiniGame, Reward } from '../types/game';
import { MINI_GAMES } from '../data/games';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async getGames(): Promise<MiniGame[]> {
    try {
      const res = await client.get<ApiResponse<MiniGame[]>>('/mini-games');
      if (res.data?.success && res.data.data?.length) {
        return res.data.data;
      }
    } catch {
      // Graceful fallback to static data
    }
    return MINI_GAMES;
  },

  async getGameBySlug(slug: string): Promise<MiniGame | undefined> {
    try {
      const res = await client.get<ApiResponse<MiniGame>>(`/mini-games/${slug}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    return MINI_GAMES.find((g) => g.slug === slug || g.id === slug);
  },

  async startSession(gameId: string, userId?: string) {
    try {
      const res = await client.post<ApiResponse<{
        sessionId: string;
        gameId: string;
        status: string;
        startedAt: string;
        token: string;
      }>>(`/mini-games/${gameId}/start`, {
        userId: userId || 'user_demo_vip',
        clientMetadata: {
          userAgent: navigator.userAgent,
          screen: `${window.innerWidth}x${window.innerHeight}`,
        },
      });
      if (res.data?.success) {
        return res.data.data;
      }
    } catch {
      // Fallback local session
    }
    return {
      sessionId: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      gameId,
      status: 'STARTED',
      startedAt: new Date().toISOString(),
      token: 'local_token_offline',
    };
  },

  async completeSession(
    gameId: string,
    sessionId: string,
    score: number,
    gameplayEvents: any[] = []
  ) {
    try {
      const res = await client.post<ApiResponse<{
        sessionId: string;
        status: string;
        score: number;
        verifiedByGameService: boolean;
        reward: Reward;
        finishedAt: string;
      }>>(`/mini-games/${gameId}/complete`, {
        sessionId,
        clientScore: score,
        gameplayEvents,
      });
      if (res.data?.success) {
        return res.data.data;
      }
    } catch {
      // Fallback offline reward calculation
    }

    const fallbackRewards: Reward[] = [
      { id: 'rw-01', name: '10 Points Thưởng VIP', type: 'POINT', value: 10, code: `PT10-${Math.floor(1000 + Math.random() * 9000)}`, description: 'Cộng trực tiếp 10 điểm thưởng VIP' },
      { id: 'rw-02', name: '30 Points Thưởng VIP', type: 'POINT', value: 30, code: `PT30-${Math.floor(1000 + Math.random() * 9000)}`, description: 'Cộng trực tiếp 30 điểm thưởng VIP' },
      { id: 'rw-05', name: 'Voucher Ưu Đãi 20K', type: 'VOUCHER', value: 20000, code: `VC20K-${Math.floor(1000 + Math.random() * 9000)}`, description: 'Giảm 20.000 VNĐ cho đơn hàng tiếp theo' },
      { id: 'rw-06', name: 'Voucher Hoàng Kim 50K', type: 'VOUCHER', value: 50000, code: `VC50K-${Math.floor(1000 + Math.random() * 9000)}`, description: 'Giảm 50.000 VNĐ cho đơn hàng tiếp theo' },
    ];
    const pickedReward = fallbackRewards[Math.floor(Math.random() * fallbackRewards.length)];

    return {
      sessionId,
      status: 'COMPLETED',
      score,
      verifiedByGameService: false,
      reward: pickedReward,
      finishedAt: new Date().toISOString(),
    };
  },

  async getHistory(): Promise<GamePlayHistory[]> {
    try {
      const res = await client.get<ApiResponse<GamePlayHistory[]>>('/game-history');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }

    const stored = localStorage.getItem('minigame_local_history');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }

    return [
      {
        id: 'hist-1',
        gameSlug: 'lucky-heart',
        gameName: 'Trái Tim May Mắn',
        score: 320,
        rewardSummary: 'Voucher Hoàng Kim 50K (VC50K-9812)',
        playedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'hist-2',
        gameSlug: 'golden-dragon',
        gameName: 'Rồng Vàng Săn Lộc',
        score: 650,
        rewardSummary: '30 Points Thưởng VIP (PT30-4123)',
        playedAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  },

  async getRewards(): Promise<Reward[]> {
    try {
      const res = await client.get<ApiResponse<Reward[]>>('/rewards');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    return [
      { id: 'rw-01', name: '10 Points Thưởng VIP', type: 'POINT', value: 10, code: 'POINT10', description: 'Cộng trực tiếp 10 điểm thưởng VIP vào ví' },
      { id: 'rw-02', name: '30 Points Thưởng VIP', type: 'POINT', value: 30, code: 'POINT30', description: 'Cộng trực tiếp 30 điểm thưởng VIP vào ví' },
      { id: 'rw-03', name: '50 Points Thưởng VIP', type: 'POINT', value: 50, code: 'POINT50', description: 'Cộng trực tiếp 50 điểm thưởng VIP vào ví' },
      { id: 'rw-04', name: '100 Points Thần Tài', type: 'POINT', value: 100, code: 'POINT100', description: 'Cộng trực tiếp 100 điểm thưởng VIP' },
      { id: 'rw-05', name: 'Voucher Ưu Đãi 20K', type: 'VOUCHER', value: 20000, code: 'VOUCHER20K', description: 'Giảm 20.000 VNĐ cho đơn hàng tiếp theo' },
      { id: 'rw-06', name: 'Voucher Hoàng Kim 50K', type: 'VOUCHER', value: 50000, code: 'VOUCHER50K', description: 'Giảm 50.000 VNĐ cho đơn hàng tiếp theo' },
      { id: 'rw-07', name: 'Quà Tặng Đặc Biệt', type: 'GIFT', value: 200000, code: 'SPECIALGIFT', description: 'Quà tặng hiện vật lưu niệm độc quyền' },
      { id: 'rw-08', name: 'Jackpot Khai Xuân 2026', type: 'SPECIAL', value: 1000000, code: 'JACKPOT2026', description: 'Giải đặc biệt may mắn năm mới 1.000.000 VNĐ' },
    ];
  },

  async getDropRates(gameId = 'lucky-heart'): Promise<import('../types/game').DropRateConfig> {
    try {
      const res = await client.get<ApiResponse<import('../types/game').DropRateConfig>>('/rewards/drop-rates', {
        params: { gameId },
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    return {
      gameId,
      totalWeight: 100,
      items: [
        { rewardId: 'rw-01', name: '10 Points Thưởng VIP', type: 'POINT', value: 10, rarity: 'Common', weight: 35, probabilityPercent: 35 },
        { rewardId: 'rw-02', name: '30 Points Thưởng VIP', type: 'POINT', value: 30, rarity: 'Common', weight: 25, probabilityPercent: 25 },
        { rewardId: 'rw-03', name: '50 Points Thưởng VIP', type: 'POINT', value: 50, rarity: 'Rare', weight: 15, probabilityPercent: 15 },
        { rewardId: 'rw-05', name: 'Voucher Ưu Đãi 20K', type: 'VOUCHER', value: 20000, rarity: 'Rare', weight: 12, probabilityPercent: 12 },
        { rewardId: 'rw-06', name: 'Voucher Hoàng Kim 50K', type: 'VOUCHER', value: 50000, rarity: 'Epic', weight: 8, probabilityPercent: 8 },
        { rewardId: 'rw-07', name: 'Quà Tặng Đặc Biệt', type: 'GIFT', value: 200000, rarity: 'Epic', weight: 4, probabilityPercent: 4 },
        { rewardId: 'rw-08', name: 'Jackpot Khai Xuân 2026', type: 'SPECIAL', value: 1000000, rarity: 'Legendary', weight: 1, probabilityPercent: 1 },
      ],
    };
  },

  async updateDropRates(gameId: string, rates: { rewardId: string; weight: number }[]) {
    try {
      const res = await client.put<ApiResponse<import('../types/game').DropRateConfig>>('/rewards/drop-rates', {
        gameId,
        rates,
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    return this.getDropRates(gameId);
  },
};
