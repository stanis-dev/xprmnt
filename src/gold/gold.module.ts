import { Module } from '@nestjs/common';
import { GoldService } from './gold.service';
import { GoldController } from './gold.controller';
import { MonstersService } from 'src/monsters/monsters.service';
import { MongooseModule } from '@nestjs/mongoose';
import Monster, { MonsterSchema } from 'src/monsters/entities/monster.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Monster.name,
        schema: MonsterSchema,
      },
    ]),
  ],
  providers: [GoldService, MonstersService],
  controllers: [GoldController],
})
export class GoldModule {}
