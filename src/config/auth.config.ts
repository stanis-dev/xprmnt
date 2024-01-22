import { IsNotEmpty, IsString } from 'class-validator';
import { EnvVar } from '../utils/config';

export default class AuthConfig {
  @EnvVar('API_KEY')
  @IsString()
  @IsNotEmpty()
  public readonly apiKey!: string;
}
