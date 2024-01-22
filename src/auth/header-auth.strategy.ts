import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-header-strategy';
import { InjectConfig } from '../utils/config';
import AuthConfig from '../config/auth.config';

@Injectable()
export default class HeaderAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectConfig(AuthConfig) private readonly authConfig: AuthConfig,
  ) {
    super({ header: 'x-elixir-api-key' });
  }

  validate(token: string) {
    if (token !== this.authConfig.apiKey) {
      throw new UnauthorizedException();
    } else {
      return true;
    }
  }
}
