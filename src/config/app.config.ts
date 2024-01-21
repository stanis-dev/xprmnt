import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { EnvVar } from '../utils/config';

export default class AppConfig {
  @EnvVar('PORT')
  @Type(() => Number)
  @IsNumber()
  public readonly port: number = 3000;
}
