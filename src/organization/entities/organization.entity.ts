import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true}) // Set strictPopulate here
export class Organization extends Document {

  @Prop({ required: true })
  name: string;



  @Prop({ required: true})
  description: string;


  
 // Ensure that organization_members references User schema
 @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: User.name }], default: [] })
 organization_members: User[];
}

export const organizationSchema = SchemaFactory.createForClass(Organization);
