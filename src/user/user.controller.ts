import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('AzureAD'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getCurrentUser(@Req() req: any): Promise<any> {
    const email = req.user.email;

    if (!email) {
      throw new HttpException(
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const existingUser = await this.userService.getUserByEmail(email);

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return existingUser;
  }

  @Get('checkUser')
  login(@Req() req: any): Promise<any> {
    const user = req.user;
    return this.userService.checkUser(user);
  }

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: Partial<User>): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    const deletedUser = await this.userService.deleteUser(id);
    if (!deletedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return deletedUser;
  }
}
