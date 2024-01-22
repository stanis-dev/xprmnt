import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import HeaderAuthStrategy from './header-auth.strategy';

@Module({
  imports: [PassportModule],
  providers: [HeaderAuthStrategy],
})
export default class AuthModule {}
