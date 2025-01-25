import { Module } from '@nestjs/common';
import { InvitedUsersController } from './invited-users.controller';
import { InvitedUsersService } from './invited-users.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvitedUser,
  InvitedUserSchema,
} from 'src/schemas/invited-user.schema';

@Module({
  controllers: [InvitedUsersController],
  providers: [InvitedUsersService],
  imports: [
    MongooseModule.forFeature([
      { name: InvitedUser.name, schema: InvitedUserSchema },
    ]),
  ],
})
export class InvitedUsersModule {}
