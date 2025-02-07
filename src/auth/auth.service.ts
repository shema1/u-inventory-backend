import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      createdAt: user.createdAt,
      invitedAt: user.invitedAt,
    };

    const token = this.jwtService.sign(userData);

    return { token, ...userData };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    console.log('loginDto', loginDto);
    const { email, password } = loginDto;

    console.log(
      "ConfigService.get<string>('JWT_SECRET'),",
      this.configService.get<string>('JWT_EXPIRES'),
    );
    const user = await this.userModel.findOne({ email }).select('+password');
    console.log('1', user);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log('2');

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      createdAt: user.createdAt,
      invitedAt: user.invitedAt,
    };
    const token = this.jwtService.sign(userData);

    return { token, ...userData };
  }
}
