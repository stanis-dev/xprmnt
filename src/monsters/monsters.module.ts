import { Module } from '@nestjs/common';
import { MonstersService } from './monsters.service';
import { MonstersController } from './monsters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import Monster, { MonsterSchema } from './entities/monster.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Monster.name,
        schema: MonsterSchema,
      },
    ]),
  ],
  controllers: [MonstersController],
  providers: [MonstersService],
})
export class MonstersModule {}
