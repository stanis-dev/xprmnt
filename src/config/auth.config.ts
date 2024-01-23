import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { EnvVar } from '../utils/config';
import { Type } from 'class-transformer';

export default class AuthConfig {
  @EnvVar('API_KEY')
  @IsString()
  @IsNotEmpty()
  public readonly apiKey!: string;

  @EnvVar('API_HEADER_NAME')
  @IsString()
  @IsNotEmpty()
  public readonly apiHeaderName: string;

  @EnvVar('UNAUTHENTICATED_RATE_LIMIT')
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  public readonly unathenticatedRateLimit: number = 1;
}
