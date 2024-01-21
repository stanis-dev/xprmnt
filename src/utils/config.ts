import {
  DynamicModule,
  Global,
  Module,
  Provider,
  Type,
  applyDecorators,
} from '@nestjs/common';
import { Expose, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { config as dotenv } from 'dotenv';

dotenv();

const TOKEN_PREFIX = 'elixir-config:';

export type Config = object;
const configs = new Set<Type<Config>>();

/**
 * Returns the DI token for a config object.
 * @param config
 */
export function getConfigToken(config: Type<Config>): string {
  return `${TOKEN_PREFIX}${config.name}`;
}

function createConfigProvider(config: Type<Config>): Provider<Config> {
  return {
    provide: getConfigToken(config),
    useFactory: () => {
      const instance = plainToInstance(config, process.env, {
        groups: ['env_vars'],
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
      const err = validateSync(instance);
      if (err.length) {
        throw new Error(
          `Invalid config: ${err.map((e) => e.toString()).join(', ')}`,
        );
      }
      return instance;
    },
    inject: [],
  };
}

export const EnvVar = (name: string) =>
  applyDecorators(Expose({ name, groups: ['env_vars'] }) as PropertyDecorator);

function createProviders(): Provider<Config>[] {
  return [...configs.values()].map(createConfigProvider);
}

@Global()
@Module({})
export class ConfigModule {
  /**
   * Initialize the config module. Additional not initiated by @InjectConfig providers can be passed as an argument.
   * @param staticConfigs
   */
  static forRoot(staticConfigs: Type<Config>[] = []): DynamicModule {
    staticConfigs.forEach((config) => configs.add(config));

    const providers = createProviders();

    return {
      module: ConfigModule,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
