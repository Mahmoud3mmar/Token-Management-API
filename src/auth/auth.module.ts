import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from '../global services/Email.Service';
import { TokenBlacklistModule } from '../token-blacklist/token-blacklist.module';
import { AccessTokenStrategy } from './accessToken.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
      
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({}),
    TokenBlacklistModule, // Import TokenBlacklistModule to provide TokenBlacklistService

  ],
  providers: [
    AuthService,
    MailService,
    JwtService,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ],
  controllers: [AuthController],
  exports:[AuthService]

})
export class AuthModule {}
