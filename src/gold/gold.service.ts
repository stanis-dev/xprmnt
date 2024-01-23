import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Monster, { MonsterDocument } from 'src/monsters/entities/monster.entity';
import { MonstersService } from 'src/monsters/monsters.service';

const MAX_GOLD_UPDATE_RETRIES = 3;
const GOLD_UPDATE_RETRY_DELAY = 1000;

@Injectable()
export class GoldService {
  logger = new Logger(GoldService.name);
  constructor(
    private readonly monstersService: MonstersService,
    @InjectModel(Monster.name) private readonly monsterModel: typeof Monster,
  ) {}

  async depositGold(monsterId: string, amount: number, tries = 0) {
    this.logger.log(`Depositing ${amount} gold for monster ${monsterId}`);

    try {
      const monster = await this.monstersService.findOne(monsterId);
      if (!monster) {
        throw new NotFoundException('Monster not found');
      }

      if (monster.isLocked) {
        // poor man's lock & retry logic, rxjs would be more robust, but time is limited
        // would also be nice to have a lock release mechanism to avoid stale locks
        // also, later realised this is a complete overkill considering the requirements ¯\_(ツ)_/¯
        if (tries >= MAX_GOLD_UPDATE_RETRIES) {
          this.logger.error(
            `Monster ${monsterId} is locked, max retries reached`,
          );

          return new ConflictException(
            'Could not withdraw gold, please try again later',
          );
        }

        this.logger.log(`Monster ${monsterId} is locked, retrying in 1 second`);

        setTimeout(
          () => this.withdrawGold(monsterId, amount, tries + 1),
          GOLD_UPDATE_RETRY_DELAY * tries,
        );

        return;
      }

      monster.goldBalance += amount;
      await monster.save();
    } catch (error) {
      throw error;
    }
  }

  async withdrawGold(monsterId: string, amount: number, tries = 0) {
    this.logger.log(`Withdrawing ${amount} gold for monster ${monsterId}`);

    let monster: MonsterDocument | null = null;

    try {
      monster = await this.monsterModel.findById(monsterId);
      if (!monster) {
        throw new NotFoundException('Monster not found');
      }

      if (monster.goldBalance - amount < 0) {
        throw new ConflictException('Not enough gold');
      }

      if (monster.isLocked) {
        // poor man's lock & retry logic, rxjs would be more robust, but time is limited
        // would also be nice to have a lock release mechanism to avoid stale locks
        // also, later realised this is a complete overkill considering the requirements ¯\_(ツ)_/¯
        if (tries >= MAX_GOLD_UPDATE_RETRIES) {
          this.logger.error(
            `Monster ${monsterId} is locked, max retries reached`,
          );

          return new ConflictException(
            'Could not withdraw gold, please try again later',
          );
        }

        this.logger.log(`Monster ${monsterId} is locked, retrying in 1 second`);

        setTimeout(
          () => this.withdrawGold(monsterId, amount, tries + 1),
          GOLD_UPDATE_RETRY_DELAY * tries,
        );

        return;
      }

      monster.goldBalance -= amount;
      await monster.save();
    } catch (error) {
      // hopefully it's a handled error that bubbles up here
      throw error;
    }

    return 'gold has been withdrawn';
  }
}
