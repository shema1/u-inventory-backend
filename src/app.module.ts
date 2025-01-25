import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AzureADStrategy } from './strategy/azuread.strategy';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './item/item.module';
import { InvitedUsersModule } from './invited-users/invited-users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://user:asdfg@cluster0.lzofa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ItemModule,
    InvitedUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AzureADStrategy],
})
export class AppModule {}
