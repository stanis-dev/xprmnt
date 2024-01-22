import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { CreateMonsterDto } from './dto/create-monster.dto';
import { UpdateMonsterDto } from './dto/update-monster.dto';
import Monster from './entities/monster.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.service';

@Injectable()
export class MonstersService {
  private readonly logger: LoggerService;

  constructor(
    @InjectModel(Monster.name) private readonly monsterModel: typeof Monster,
  ) {
    this.logger = new Logger(MonstersService.name);
  }

  async create(createMonsterDto: CreateMonsterDto) {
    this.logger.log('Creating a monster...');
    try {
      const monster = new this.monsterModel(createMonsterDto);
      await monster.save();

      return { message: 'Monster created successfully' };
    } catch (error) {
      this.logger.error(
        'Error creating a monster: ',
        error.message,
        error.stack,
      );

      return new BadRequestException(error.message);
    }
  }

  async findAll(user?: User) {
    try {
      const query = this.monsterModel.find();

      if (user?.role !== 'bmike') {
        return await query.exec();
      }

      query.select('+secretNotes');
      const monsters = await query.exec();

      monsters.forEach(async (monster) => {
        try {
          monster.decryptSecretNotes();
        } catch (error) {
          this.logger.error(
            'Error decrypting secret notes: ',
            monster.id,
            error.message,
            error.stack,
          );
        }
      });

      return monsters;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findOne(id: string, user?: User) {
    try {
      const query = this.monsterModel.findById(id);

      if (user?.role !== 'bmike') {
        const monster = await query.exec();
        if (!monster) {
          throw new NotFoundException('Monster not found');
        }
        return monster;
      }

      query.select('+secretNotes');
      const monster = await query.exec();
      if (!monster) {
        throw new NotFoundException('Monster not found');
      }

      monster.decryptSecretNotes();
      return monster;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateMonsterDto: UpdateMonsterDto) {
    try {
      return await this.monsterModel.findByIdAndUpdate(id, updateMonsterDto, {
        new: true,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }

      // TODO: detect and handle not found error
      return error.message;
    }
  }

  async remove(id: string) {
    try {
      await this.monsterModel.findByIdAndDelete(id);

      return { message: 'Monster deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
