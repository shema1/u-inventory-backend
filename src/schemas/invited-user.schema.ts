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
  @Prop({ type: Date, default: Date.now }) // Додавання поля часу створення
  createdAt: Date;
}

export const InvitedUserSchema = SchemaFactory.createForClass(InvitedUser);

InvitedUserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id; // Клонування _id в id
    delete ret._id; // Видалення _id
    delete ret.__v; // Видалення __v
  },
});
