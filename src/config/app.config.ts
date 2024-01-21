import { Type } from 'class-transformer';
import { IsByteLength, IsNumber, IsString } from 'class-validator';
import { EnvVar } from '../utils/config';

export default class AppConfig {
  @EnvVar('PORT')
  @Type(() => Number)
  @IsNumber()
  public readonly port: number = 3000;

  @EnvVar('CRYPTO_SECRET_KEY')
  @IsString()
  @IsByteLength(16)
  public readonly cryptoSecretKey: string;
}
