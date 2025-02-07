import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Role } from '../../roles/schema/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId, default: () => new Types.ObjectId() })
  id: Types.ObjectId;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop({
    enum: ['active', 'invited', 'pending', 'banned'],
    default: 'invited',
  })
  status: 'active' | 'invited' | 'pending' | 'banned';
  @Prop({ type: SchemaTypes.ObjectId, ref: Role.name, required: true })
  role: Role;
  @Prop({ type: Date, default: null })
  createdAt: Date;
  @Prop({ type: Date, default: null })
  invitedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
