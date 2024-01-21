import { Module } from '@nestjs/common';
import { ConfigModule, getConfigToken } from './utils/config';
import AppConfig from './config/app.config';
import MongoConfig from './config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot([AppConfig, MongoConfig]),
    MongooseModule.forRootAsync({
      inject: [getConfigToken(MongoConfig)],
      useFactory: (mongoConfig: MongoConfig) => ({
        uri: mongoConfig.mongoUri,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
