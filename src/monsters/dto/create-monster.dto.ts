import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  MONSTER_GENDERS,
  MONSTER_NATIONALITIES,
  MonsterGender,
  MonsterName,
  MonsterNationality,
  MonsterProperties,
  MonsterTitle,
} from '../entities/monster.entity';
import { Type } from 'class-transformer';

class MonsterNameDto implements MonsterName {
  @IsString()
  first: string;

  @IsString()
  last: string;

  @IsString()
  title: MonsterTitle;
}

export class CreateMonsterDto implements MonsterProperties {
  @ValidateNested()
  @Type(() => MonsterNameDto)
  name: MonsterName;

  @IsIn(MONSTER_GENDERS)
  gender: MonsterGender;

  @IsString()
  description: string;

  @IsArray()
  @IsIn(MONSTER_NATIONALITIES, { each: true })
  nationality: MonsterNationality[];

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsInt()
  speed = 100;

  @IsNumber()
  @IsInt()
  health = 100;

  @IsString()
  secretNotes: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  monsterPassword: string;
}
