import { Controller, Get, Put, Param, Query, Body } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async findAll() {
    return this.rewardsService.findAll();
  }

  @Get('drop-rates')
  async getDropRates(@Query('gameId') gameId?: string) {
    return this.rewardsService.getDropRates(gameId || 'lucky-heart');
  }

  @Put('drop-rates')
  async updateDropRates(
    @Body() body: { gameId?: string; rates: { rewardId: string; weight: number }[] }
  ) {
    const gameId = body.gameId || 'lucky-heart';
    return this.rewardsService.updateDropRates(gameId, body.rates || []);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rewardsService.findOne(id);
  }
}
