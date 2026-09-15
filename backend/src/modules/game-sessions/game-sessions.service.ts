import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StartSessionDto, CompleteSessionDto } from './dto/game-session.dto';
import axios from 'axios';

const MOCK_REWARDS = [
  { id: 'rw-01', name: '10 Points Thưởng', type: 'POINT', value: 10, code: 'POINT10', description: 'Cộng trực tiếp 10 điểm thưởng VIP' },
  { id: 'rw-02', name: '30 Points Thưởng', type: 'POINT', value: 30, code: 'POINT30', description: 'Cộng trực tiếp 30 điểm thưởng VIP' },
  { id: 'rw-03', name: '50 Points Thưởng', type: 'POINT', value: 50, code: 'POINT50', description: 'Cộng trực tiếp 50 điểm thưởng VIP' },
  { id: 'rw-04', name: '100 Points Thần Tài', type: 'POINT', value: 100, code: 'POINT100', description: 'Cộng trực tiếp 100 điểm thưởng VIP' },
  { id: 'rw-05', name: 'Voucher Ưu Đãi 20K', type: 'VOUCHER', value: 20000, code: 'VOUCHER20K', description: 'Giảm 20.000 VNĐ hóa đơn dịch vụ' },
  { id: 'rw-06', name: 'Voucher Hoàng Kim 50K', type: 'VOUCHER', value: 50000, code: 'VOUCHER50K', description: 'Giảm 50.000 VNĐ hóa đơn dịch vụ' },
  { id: 'rw-07', name: 'Quà Tặng Đặc Biệt', type: 'GIFT', value: 200000, code: 'SPECIALGIFT', description: 'Quà tặng hiện vật lưu niệm độc quyền' },
  { id: 'rw-08', name: 'Jackpot Khai Xuân 2026', type: 'SPECIAL', value: 1000000, code: 'JACKPOT2026', description: 'Giải đặc biệt may mắn năm mới' },
];

@Injectable()
export class GameSessionsService {
  // In-memory session tracking when running without Postgres daemon
  private memorySessions = new Map<string, any>();
  private memoryHistories: any[] = [];
  private gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:5000';

  constructor(private readonly prisma: PrismaService) {}

  async startSession(gameSlugOrId: string, dto: StartSessionDto) {
    const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const session = {
      id: sessionId,
      gameId: gameSlugOrId,
      userId: dto.userId || 'guest_user',
      status: 'STARTED',
      score: 0,
      startedAt: new Date().toISOString(),
      clientMetadata: dto.clientMetadata || {},
    };

    this.memorySessions.set(sessionId, session);

    return {
      sessionId: session.id,
      gameId: session.gameId,
      status: session.status,
      startedAt: session.startedAt,
      token: 'gtok_' + Buffer.from(sessionId).toString('base64'),
    };
  }

  async completeSession(gameSlugOrId: string, dto: CompleteSessionDto) {
    const session = this.memorySessions.get(dto.sessionId);
    if (!session) {
      throw new NotFoundException('Game session không tồn tại hoặc đã hết hạn.');
    }

    if (session.status === 'COMPLETED') {
      throw new ConflictException({
        message: 'Game session này đã được hoàn thành trước đó. Không thể gửi kết quả trùng lặp.',
        errorCode: 'DUPLICATE_COMPLETION',
      });
    }

    // 1. Validate with C# Game Service if reachable
    let verifiedScore = dto.clientScore || 0;
    let verifiedByGameService = false;
    let calculatedReward = null;

    try {
      const resp = await axios.post(`${this.gameServiceUrl}/internal/game/validate`, {
        gameId: gameSlugOrId,
        sessionId: dto.sessionId,
        score: dto.clientScore,
        gameplayEvents: dto.gameplayEvents,
      }, { timeout: 1500 });

      if (resp.data && resp.data.valid) {
        verifiedByGameService = true;
        verifiedScore = resp.data.validatedScore ?? verifiedScore;
        calculatedReward = resp.data.reward;
      }
    } catch {
      // Fallback internal validation if C# Game Service is offline or starting up
      verifiedByGameService = false;
      verifiedScore = Math.max(0, Math.min(dto.clientScore || 50, 1000));
    }

    // 2. Select Reward on Server (Never let frontend choose!)
    if (!calculatedReward) {
      const randIdx = Math.floor(Math.random() * MOCK_REWARDS.length);
      calculatedReward = MOCK_REWARDS[randIdx];
    }

    // 3. Mark session as completed
    session.status = 'COMPLETED';
    session.finishedAt = new Date().toISOString();
    session.score = verifiedScore;

    // 4. Save to history
    const historyEntry = {
      id: 'hist_' + Date.now(),
      gameSlug: gameSlugOrId,
      gameName: gameSlugOrId,
      score: verifiedScore,
      rewardSummary: `${calculatedReward.name} (${calculatedReward.code})`,
      playedAt: new Date().toISOString(),
    };
    this.memoryHistories.unshift(historyEntry);

    return {
      sessionId: session.id,
      status: 'COMPLETED',
      score: verifiedScore,
      verifiedByGameService,
      reward: calculatedReward,
      finishedAt: session.finishedAt,
    };
  }

  async getHistory() {
    return this.memoryHistories.slice(0, 20);
  }
}
