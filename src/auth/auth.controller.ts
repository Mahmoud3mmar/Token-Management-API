import {
  Controller,
 
  Post,
  Body,
  Query,

} from '@nestjs/common';
import { AuthService } from './auth.service';

import {

  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpAuthDto } from './dto/signup.auth.dto';
import { LoginAuthDto } from './dto/login.auth.dto';


@ApiTags('Authentication') // Swagger tag to group endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Signup' }) // Operation summary
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
   async signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }



  @Post('signin')
  @ApiOperation({ summary: 'User Signin' }) // Operation summary
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  async signIn(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.signIn(loginAuthDto);
  }


  
  @Post('refresh/token')
  @ApiOperation({ summary: 'Refresh Token' }) // Operation summary
  @ApiQuery({ name: 'refreshToken', required: true, description: 'The refresh token to be used.' }) // Query parameter
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
