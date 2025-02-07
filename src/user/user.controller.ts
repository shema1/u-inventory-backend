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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { InviteUserDto } from 'src/dto/user/invite-user.dto';

// @UseGuards(AuthGuard('AzureAD'))
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
    return this.userService.checkUser({ ...user });
  }

  @UseGuards(AuthGuard())
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/byStatus')
  async getbyStatus(@Query('status') status: string): Promise<User[]> {
    if (!status) {
      throw new HttpException('Status is required', HttpStatus.BAD_REQUEST);
    }
    const users = await this.userService.getUsersByStatus(status);

    return users;
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
    console.log('createUserDto', createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Post('/invite')
  async inviteUser(@Body() inviteUserDto: InviteUserDto): Promise<User> {
    const existingUser = await this.userService.getUserByEmail(
      inviteUserDto.email,
    );

    if (existingUser) {
      throw new HttpException(
        'Користувач вже запрошений.',
        HttpStatus.CONFLICT,
      );
    }

    return this.userService.createUser({ ...inviteUserDto, status: 'invited' });
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
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
