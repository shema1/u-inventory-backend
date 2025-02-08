import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; userInfo: any }> {
    const { firstName, lastName, email, password } = signUpDto;

    const existingUser = await this.userService.getUserByEmail(email);
    console.log('existingUser', existingUser);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      status: existingUser?.status === 'invited' ? 'active' : 'pending',
    });

    const userObject = user.toJSON();

    const userData = {
      id: userObject.id,
      email: userObject.email,
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      status: userObject.status,
      role: userObject.role,
      createdAt: userObject.createdAt,
      invitedAt: userObject.invitedAt,
    };

    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    return { token, userInfo: userData };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; userInfo: any }> {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password ');
    }

    const userWithPassword = await this.userModel
      .findOne({ email })
      .select('+password');

    const isPasswordMatched = await bcrypt.compare(
      password,
      userWithPassword.password || '',
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password 2');
    }

    let updatedUser = user;
    console.log('updatedUser1', updatedUser);
    if (user.status === 'invited') {
      updatedUser = await this.userService.updateUser(user.id.toString(), {
        status: 'active',
      });
    }
    console.log('updatedUser2', updatedUser);
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      status: updatedUser.status,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      invitedAt: updatedUser.invitedAt,
    };

    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
    };
    const token = this.jwtService.sign(payload);

    return { token, userInfo: userData };
  }
}
