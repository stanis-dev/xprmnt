import { Module } from '@nestjs/common';
import { ConfigModule, getConfigToken } from './utils/config';
import AppConfig from './config/app.config';
import MongoConfig from './config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MonstersModule } from './monsters/monsters.module';
import { AuthModule, HeaderAuthGuard } from './auth';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { GoldModule } from './gold/gold.module';

@Module({
  imports: [
    ConfigModule.forRoot([AppConfig, MongoConfig]),
    AuthModule,
    MongooseModule.forRootAsync({
      inject: [getConfigToken(MongoConfig)],
      useFactory: (mongoConfig: MongoConfig) => ({
        uri: mongoConfig.mongoUri,
      }),
    }),
    MonstersModule,
    UsersModule,
    GoldModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: HeaderAuthGuard,
    },
  ],
})
export class AppModule {}
