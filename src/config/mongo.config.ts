import { IsNotEmpty, IsString } from 'class-validator';
import { EnvVar } from 'src/utils/config';

export default class MongoConfig {
  @EnvVar('MONGO_HOST')
  @IsString()
  @IsNotEmpty()
  private readonly mongoHost: string;

  @EnvVar('MONGO_USER')
  @IsString()
  @IsNotEmpty()
  private readonly mongoUser: string;

  @EnvVar('MONGO_PASSWORD')
  @IsString()
  @IsNotEmpty()
  private readonly mongoPassword: string;

  public get mongoUri(): string {
    return `mongodb+srv://${this.mongoUser}:${encodeURIComponent(this.mongoPassword)}@${this.mongoHost}/elixir?retryWrites=true&w=majority`;
  }
}
