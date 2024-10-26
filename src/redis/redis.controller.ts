import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards ,Request,
} from '@nestjs/common';
import { RedisService } from './redis.service';

import { RevokeRefreshTokenDto } from './dto/revoke-refresh-token.dto';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('revoke')
  async revokeRefreshToken(
    @Body() revokeTokenDto: RevokeRefreshTokenDto,
    @Request() req: any, // You can specify a more specific type based on your setup
  ) {
    const { refresh_token } = revokeTokenDto;

    // Call the service method to revoke the token
    const response = await this.redisService.revokeRefreshToken(refresh_token);

    return response; // Return the response
  }

  
}
