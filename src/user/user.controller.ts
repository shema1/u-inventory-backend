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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('me')
  // @UseGuards(AuthGuard('AzureAD')) // Використання стратегії 'AzureAD'
  // async getCurrentUser(@Req() req: Request): Promise<User> {
  //     // payload отримується через стратегію
  //     const userPayload = req.user;

  //     if (!userPayload) {
  //         throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
  //     }

  //     // Отримання userId із payload (можливо, це буде `sub` або інший унікальний ідентифікатор)
  //     const userId = userPayload.sub;

  //     const user = await this.userService.getUserById(userId);
  //     if (!user) {
  //         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //     }

  //     return user;
  // }

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
