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
    this.logger.log('MonstersService constructor: --------' + Monster.name);
    try {
      const monster = new this.monsterModel(createMonsterDto);
      await monster.save();

      return { message: 'Monster created successfully' };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }

      return new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return await Monster.find();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      return await Monster.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateMonsterDto: UpdateMonsterDto) {
    try {
      return await Monster.findByIdAndUpdate(id, updateMonsterDto, {
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
      return await Monster.findByIdAndDelete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
