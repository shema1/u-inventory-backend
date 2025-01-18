import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MicorsoftUserDocument = HydratedDocument<MicorsoftUser>;

@Schema()
export class MicorsoftUser {
  @Prop()
  given_name: string;
  @Prop()
  family_name: string;
  @Prop()
  email: string;
}

export const MicorsoftUserSchema = SchemaFactory.createForClass(MicorsoftUser);
