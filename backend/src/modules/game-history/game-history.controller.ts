import { Controller, Get } from '@nestjs/common';
import { GameSessionsService } from '../game-sessions/game-sessions.service';

@Controller('game-history')
export class GameHistoryController {
  constructor(private readonly sessionsService: GameSessionsService) {}

  @Get()
  async getHistory() {
    return this.sessionsService.getHistory();
  }
}
