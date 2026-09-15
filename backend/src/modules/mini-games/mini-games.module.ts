import { Module } from '@nestjs/common';
import { MiniGamesService } from './mini-games.service';
import { MiniGamesController } from './mini-games.controller';

@Module({
  providers: [MiniGamesService],
  controllers: [MiniGamesController],
  exports: [MiniGamesService],
})
export class MiniGamesModule {}
