import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';
import { RedisController } from './redis.controller';

@Module({
  controllers: [RedisController],

  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD, // Optional
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService], // Export the service for use in other modules
})
export class RedisModule {}
