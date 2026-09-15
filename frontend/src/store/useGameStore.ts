import { create } from 'zustand';
import type { Reward } from '../types/game';

interface GameState {
  soundEnabled: boolean;
  userPoints: number;
  activeSessionId: string | null;
  currentScore: number;
  currentReward: Reward | null;
  wonVouchers: Reward[];
  history: import('../types/game').GamePlayHistory[];
  
  toggleSound: () => void;
  setUserPoints: (points: number) => void;
  addPoints: (points: number) => void;
  setActiveSession: (sessionId: string | null) => void;
  setCurrentScore: (score: number) => void;
  setCurrentReward: (reward: Reward | null) => void;
  addWonVoucher: (reward: Reward) => void;
  addHistoryItem: (item: import('../types/game').GamePlayHistory) => void;
  resetSession: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  soundEnabled: localStorage.getItem('minigame_sound') !== 'false',
  userPoints: parseInt(localStorage.getItem('minigame_user_points') || '250', 10),
  activeSessionId: null,
  currentScore: 0,
  currentReward: null,
  wonVouchers: JSON.parse(localStorage.getItem('minigame_won_vouchers') || '[]'),
  history: JSON.parse(localStorage.getItem('minigame_play_history') || '[]'),

  toggleSound: () => {
    set((state) => {
      const next = !state.soundEnabled;
      localStorage.setItem('minigame_sound', String(next));
      return { soundEnabled: next };
    });
  },

  setUserPoints: (points: number) => {
    localStorage.setItem('minigame_user_points', String(points));
    set({ userPoints: points });
  },

  addPoints: (amount: number) => {
    set((state) => {
      const updated = state.userPoints + amount;
      localStorage.setItem('minigame_user_points', String(updated));
      return { userPoints: updated };
    });
  },

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
  
  setCurrentScore: (score) => set({ currentScore: score }),

  setCurrentReward: (reward) => set({ currentReward: reward }),

  addWonVoucher: (reward) => {
    set((state) => {
      const updated = [reward, ...state.wonVouchers];
      localStorage.setItem('minigame_won_vouchers', JSON.stringify(updated));
      return { wonVouchers: updated };
    });
  },

  addHistoryItem: (item) => {
    set((state) => {
      const updated = [item, ...state.history];
      localStorage.setItem('minigame_play_history', JSON.stringify(updated));
      return { history: updated };
    });
  },

  resetSession: () => set({
    activeSessionId: null,
    currentScore: 0,
    currentReward: null,
  }),
}));
