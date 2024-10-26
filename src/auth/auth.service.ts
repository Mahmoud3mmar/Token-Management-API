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

import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpAuthDto } from './dto/signup.auth.dto';

import { MailService } from 'src/global services/Email.Service';
import { AccessLevel } from 'src/user/common utils/AccessLevel.enum';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

}
