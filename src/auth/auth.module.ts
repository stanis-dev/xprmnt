import { PassportModule } from '@nestjs/passport';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import HeaderAuthStrategy from './header-auth.strategy';
import AuthConfig from 'src/config/auth.config';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { InjectConfig } from 'src/utils/config';

@Module({
  imports: [PassportModule],
  providers: [HeaderAuthStrategy, AuthConfig],
  exports: [],
})
export default class AuthModule {
  constructor(
    @InjectConfig(AuthConfig) private readonly authConfig: AuthConfig,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware(this.authConfig))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
