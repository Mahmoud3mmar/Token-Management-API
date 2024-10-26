import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';


@Controller('token-blacklist')
export class TokenBlacklistController {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

}
