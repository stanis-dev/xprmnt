import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MonstersService } from './monsters.service';
import { CreateMonsterDto } from './dto/create-monster.dto';
import { UpdateMonsterDto } from './dto/update-monster.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth';
import { User } from 'src/users/users.service';

// Ideally augmentation would be done dinamically through a decorator
type AugmentedRequest = Request & { user?: User };

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Post()
  @Roles('bmike')
  create(@Body() createMonsterDto: CreateMonsterDto) {
    return this.monstersService.create(createMonsterDto);
  }

  @Get()
  @Public()
  findAll(@Req() req: AugmentedRequest) {
    return this.monstersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AugmentedRequest) {
    return this.monstersService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonsterDto: UpdateMonsterDto) {
    return this.monstersService.update(id, updateMonsterDto);
  }

  @Delete(':id')
  @Roles('bmike')
  remove(@Param('id') id: string) {
    return this.monstersService.remove(id);
  }
}
