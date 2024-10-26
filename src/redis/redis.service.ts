import { Inject, Injectable } from '@nestjs/common';

import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis, // Inject the Redis client
  ) {}

  async revokeRefreshToken(refreshToken: string): Promise<{ message: string }> {
    // Set the refresh token in Redis with a short expiration time
    await this.redisClient.set(refreshToken, 'revoked', 'EX', 3600); // Token will expire in 1 hour

    return { message: 'Refresh token revoked successfully' };
  }


}