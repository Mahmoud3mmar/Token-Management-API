import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { AccessLevel } from '../common utils/AccessLevel.enum';

// future proof if there is any other types of user i wanted to inherit from user with different roles
@Schema({ timestamps: true, discriminatorKey: 'access_level' })
export class User extends Document {
  

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ nullable: true })
  refreshToken?: string;

  @Prop({ enum: AccessLevel, default: AccessLevel.MEMBER, required: true })
  access_level: AccessLevel;


}

export const UserSchema = SchemaFactory.createForClass(User);
