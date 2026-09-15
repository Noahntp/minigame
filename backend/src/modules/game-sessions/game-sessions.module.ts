import { Module } from '@nestjs/common';
import { GameSessionsService } from './game-sessions.service';
import { GameSessionsController } from './game-sessions.controller';

@Module({
  providers: [GameSessionsService],
  controllers: [GameSessionsController],
  exports: [GameSessionsService],
})
export class GameSessionsModule {}
