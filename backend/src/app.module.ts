import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { MiniGamesModule } from './modules/mini-games/mini-games.module';
import { GameSessionsModule } from './modules/game-sessions/game-sessions.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { GameHistoryModule } from './modules/game-history/game-history.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    MiniGamesModule,
    GameSessionsModule,
    RewardsModule,
    GameHistoryModule,
  ],
})
export class AppModule {}
