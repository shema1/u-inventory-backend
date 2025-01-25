import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type InvitedUserDocument = HydratedDocument<InvitedUser>;

export type InvitedUserStatus = 'pending' | 'active';

@Schema()
export class InvitedUser {
  @Prop({ type: SchemaTypes.ObjectId, default: () => new Types.ObjectId() })
  id: Types.ObjectId;
  @Prop({ required: true })
  email: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  status: InvitedUserStatus;
}

export const InvitedUserSchema = SchemaFactory.createForClass(InvitedUser);
