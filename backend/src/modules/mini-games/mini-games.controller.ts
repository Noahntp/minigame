import { Controller, Get, Param } from '@nestjs/common';
import { MiniGamesService } from './mini-games.service';

@Controller('mini-games')
export class MiniGamesController {
  constructor(private readonly miniGamesService: MiniGamesService) {}

  @Get()
  async getAllGames() {
    return this.miniGamesService.findAll();
  }

  @Get(':slug')
  async getGameBySlug(@Param('slug') slug: string) {
    return this.miniGamesService.findBySlug(slug);
  }
}
