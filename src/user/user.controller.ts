import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';


@ApiTags('user')
@ApiBearerAuth() // Indicates that the endpoint requires a Bearer token for authorization
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}