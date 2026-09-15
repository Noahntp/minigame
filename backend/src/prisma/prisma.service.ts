import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Optional connect for PostgreSQL if DATABASE_URL is available
    try {
      if (process.env.DATABASE_URL) {
        await this.$connect();
      }
    } catch (err) {
      console.warn('[PrismaService] Running without active database connection; mock/fallback service will be used:', err.message);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {}
  }
}
