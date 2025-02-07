import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/schema/user.schema';
import { ConfigService } from '@nestjs/config';
// import { User } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.debug('JWT Payload:', payload);

    const { id, email } = payload;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      this.logger.error(`User not found for email: ${email}`);
      throw new UnauthorizedException('User not found');
    }

    this.logger.debug('User found:', user);
    return user;
  }
}
