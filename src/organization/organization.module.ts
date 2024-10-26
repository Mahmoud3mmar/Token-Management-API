import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization, organizationSchema } from './entities/organization.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: organizationSchema },{ name: User.name, schema: UserSchema }]),
    UserModule, // Include UserModule here
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
