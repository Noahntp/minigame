import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

export const REWARDS_CATALOG = [
  { id: 'rw-01', name: '10 Points Thưởng VIP', type: 'POINT', value: 10, code: 'POINT10', description: 'Cộng trực tiếp 10 điểm thưởng VIP' },
  { id: 'rw-02', name: '30 Points Thưởng VIP', type: 'POINT', value: 30, code: 'POINT30', description: 'Cộng trực tiếp 30 điểm thưởng VIP' },
  { id: 'rw-03', name: '50 Points Thưởng VIP', type: 'POINT', value: 50, code: 'POINT50', description: 'Cộng trực tiếp 50 điểm thưởng VIP' },
  { id: 'rw-04', name: '100 Points Thần Tài', type: 'POINT', value: 100, code: 'POINT100', description: 'Cộng trực tiếp 100 điểm thưởng VIP' },
  { id: 'rw-05', name: 'Voucher Ưu Đãi 20K', type: 'VOUCHER', value: 20000, code: 'VOUCHER20K', description: 'Giảm 20.000 VNĐ hóa đơn dịch vụ' },
  { id: 'rw-06', name: 'Voucher Hoàng Kim 50K', type: 'VOUCHER', value: 50000, code: 'VOUCHER50K', description: 'Giảm 50.000 VNĐ hóa đơn dịch vụ' },
  { id: 'rw-07', name: 'Quà Tặng Đặc Biệt', type: 'GIFT', value: 200000, code: 'SPECIALGIFT', description: 'Quà tặng hiện vật lưu niệm độc quyền' },
  { id: 'rw-08', name: 'Jackpot Khai Xuân 2026', type: 'SPECIAL', value: 1000000, code: 'JACKPOT2026', description: 'Giải đặc biệt may mắn năm mới' },
];

@Injectable()
export class RewardsService {
  private gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:5000';

  async findAll() {
    return REWARDS_CATALOG;
  }

  async findOne(id: string) {
    const reward = REWARDS_CATALOG.find(r => r.id === id || r.code === id);
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return reward;
  }

  async getDropRates(gameId: string = 'lucky-heart') {
    try {
      const resp = await axios.get(`${this.gameServiceUrl}/internal/game/drop-rates`, {
        params: { gameId },
        timeout: 2000,
      });
      return resp.data;
    } catch {
      // Fallback
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
    }
  }

  async updateDropRates(gameId: string, rates: { rewardId: string; weight: number }[]) {
    try {
      const resp = await axios.post(`${this.gameServiceUrl}/internal/game/drop-rates`, {
        gameId,
        rates,
      }, { timeout: 2500 });
      return resp.data;
    } catch {
      return this.getDropRates(gameId);
    }
  }
}
