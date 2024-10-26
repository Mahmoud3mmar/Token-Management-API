import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; // Import ObjectId here

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpAuthDto } from './dto/signup.auth.dto';
import { LoginAuthDto } from './dto/login.auth.dto';

import { MailService } from '../global services/Email.Service';
import { TokenBlacklistService } from '../token-blacklist/token-blacklist.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly TokenBlacklistService: TokenBlacklistService, // Inject TokenBlacklistService

    ) {}

  async signUp(signUpAuthDto: SignUpAuthDto): Promise<{ message: string }> {
    const { name, email, password, confirmPassword } = signUpAuthDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    try {
      // Check for existing user
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        throw new ConflictException('User with this email already exists.');
      }

      // Hash the password
      // const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });

      // Save user to database
      await user.save();

      return {
        message: 'Signup successful!',
      };
    } catch (error) {
      // Log the error to help diagnose the issue
      console.error('Error during signup:', error);

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error; // Propagate known exceptions
      }

      // Handle any unexpected errors
      throw new InternalServerErrorException('Failed to sign up user', error);
    }
  }
  async signIn(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ access_token: string; refresh_token: string; message: string }> {
    const { email, password } = loginAuthDto;

    try {
      // Validate the user credentials
      const user = await this.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }


      // Invalidate the previous refresh token
      await this.invalidateOldRefreshToken(user._id.toString());

      // Generate new access and refresh tokens
      const tokens = await this.generateTokens(
        user._id.toString(),
        user.email,
        user.access_level,
      );

      // Update the user's record with the new refresh token
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        message: 'Successfully signed in',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw known authentication errors
      }

      // Log unexpected errors for diagnostics
      console.error('Sign in error:', error);

      // Handle unexpected errors
      throw new InternalServerErrorException('Failed to sign in user');
    }
  }


  
  async invalidateOldRefreshToken(userId: string): Promise<void> {
    // Fetch the user and check if there is an existing refresh token
    const user = await this.userModel.findById(userId);

    if (user && user.refreshToken) {
      // Invalidate the old refresh token
      user.refreshToken = null;
      await user.save();
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    // Validate user existence and password
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw new UnauthorizedException('Please check your login credentials');
  }


  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '5h' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    // Update the user's refresh token in the database
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }



  
  async refreshToken(
    refreshToken: string,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const userId = decoded.sub;
      // Check if the refresh token is in a blacklist
      const isTokenBlacklisted = await this.TokenBlacklistService.isTokenBlacklisted(refreshToken);
      if (isTokenBlacklisted) {
        throw new UnauthorizedException('Refresh token has been invalidated');
      }
  
      // Generate new tokens
      const newAccessToken = this.jwtService.sign(
        { userId },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '5h' },
      );
      const newRefreshToken = this.jwtService.sign(
        { userId },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      );
  
      // Update the user's record with the new refresh token in the database
      await this.userModel.findByIdAndUpdate(userId, {
        refreshToken: newRefreshToken,
      });
  
      return {
        message: 'Tokens refreshed successfully',
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  
}
