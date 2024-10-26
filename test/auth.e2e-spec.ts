import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { SignUpAuthDto } from '../src/auth/dto/signup.auth.dto';
import { AccessLevel } from '../src/user/common utils/AccessLevel.enum';
import { LoginAuthDto } from '../src/auth/dto/login.auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const signUpDto: SignUpAuthDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        confirmPassword: 'password',
        access_level:AccessLevel.ADMIN
      };

      const result = { message: 'User created successfully' };
      jest.spyOn(authService, 'signUp').mockResolvedValue(result);

      expect(await authController.signUp(signUpDto)).toEqual(result);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw an error if sign up fails', async () => {
      const signUpDto: SignUpAuthDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        confirmPassword: 'password',
        access_level:AccessLevel.ADMIN
      };

      jest.spyOn(authService, 'signUp').mockRejectedValue(new Error('Email already in use.'));

      await expect(authController.signUp(signUpDto)).rejects.toThrow('Email already in use.');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const loginDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'password',
      };

      const result = {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        message: 'Successfully signed in',
      };
      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.signIn(loginDto)).toEqual(result);
      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error if sign in fails', async () => {
      const loginDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(authService, 'signIn').mockRejectedValue(new Error('Invalid email or password'));

      await expect(authController.signIn(loginDto)).rejects.toThrow('Invalid email or password');
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', async () => {
      const refreshToken = 'someValidRefreshToken';
      const result = {
        message: 'Tokens refreshed successfully',
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
      };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      expect(await authController.refreshToken(refreshToken)).toEqual(result);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
    });

    it('should throw an error if refresh token is invalid', async () => {
      const refreshToken = 'invalidToken';

      jest.spyOn(authService, 'refreshToken').mockRejectedValue(new Error('Invalid or expired refresh token'));

      await expect(authController.refreshToken(refreshToken)).rejects.toThrow('Invalid or expired refresh token');
    });
  });
});
