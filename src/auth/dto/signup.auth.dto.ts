import { IsEmail, IsNotEmpty, IsString, Matches, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccessLevel } from '../../user/common utils/AccessLevel.enum';

export class SignUpAuthDto {


  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @ApiProperty({ example: 'SecurePass123!', description: 'Password chosen by the user' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Password confirmation' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsEnum(AccessLevel, { message: 'Access level must be a valid enum value' }) // Correct usage of IsEnum
  access_level: AccessLevel; // Ensure type is set to the enum type

}

