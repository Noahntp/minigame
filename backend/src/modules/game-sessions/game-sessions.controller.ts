import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { GameSessionsService } from './game-sessions.service';
import { StartSessionDto, CompleteSessionDto } from './dto/game-session.dto';

@Controller('mini-games')
export class GameSessionsController {
  constructor(private readonly sessionsService: GameSessionsService) {}

  @Post(':id/start')
  async startSession(@Param('id') id: string, @Body() dto: StartSessionDto) {
    return this.sessionsService.startSession(id, dto);
  }

  @Post(':id/complete')
  async completeSession(@Param('id') id: string, @Body() dto: CompleteSessionDto) {
    return this.sessionsService.completeSession(id, dto);
  }

  @Get('history')
  async getHistory() {
    return this.sessionsService.getHistory();
  }
}
