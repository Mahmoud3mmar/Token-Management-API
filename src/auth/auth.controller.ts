import {
  Controller,
 
  Post,
  Body,

} from '@nestjs/common';
import { AuthService } from './auth.service';

import {

  ApiTags,
} from '@nestjs/swagger';
import { SignUpAuthDto } from './dto/signup.auth.dto';


@ApiTags('Authentication') // Swagger tag to group endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
   async signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }






}
