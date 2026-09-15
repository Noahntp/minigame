import { Module } from '@nestjs/common';
import { GameHistoryController } from './game-history.controller';
import { GameSessionsModule } from '../game-sessions/game-sessions.module';

@Module({
  imports: [GameSessionsModule],
  controllers: [GameHistoryController],
})
export class GameHistoryModule {}
