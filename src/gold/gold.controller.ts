import { Controller, Logger, Param, Put, Query } from '@nestjs/common';
import { GoldService } from './gold.service';
import { Roles } from 'src/auth/roles.decorator';
import { PutGoldDto } from './dto/put.gold';

@Controller('monsters/:monsterId/gold')
export class GoldController {
  logger = new Logger(GoldController.name);

  constructor(private goldService: GoldService) {}

  @Put('deposit')
  @Roles('elixir-ceo')
  async deposit(
    @Param('monsterId') monsterId: string,
    @Query() params: PutGoldDto,
  ) {
    return this.goldService.depositGold(monsterId, params.amount);
  }

  @Put('withdraw')
  @Roles('bmike')
  async withdraw(
    @Param('monsterId') monsterId: string,
    @Query() params: PutGoldDto,
  ) {
    return this.goldService.withdrawGold(monsterId, params.amount);
  }
}
