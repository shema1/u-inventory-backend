import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import {
  MicorsoftUser,
  MicorsoftUserSchema,
} from 'src/schemas/micorsoftUser.schema';

import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MicorsoftUser.name, schema: MicorsoftUserSchema },
    ]),
    AuthModule,
    // PassportModule.register({
    //   defaultStrategy: 'AzureAD',
    // }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
