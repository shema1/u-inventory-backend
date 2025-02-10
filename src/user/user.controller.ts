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
import { User } from 'src/user/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { InviteUserDto } from 'src/user/dto/invite-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserIdParam } from './dto/user-id.param.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';

// Add interface to extend Express Request
interface RequestWithUser extends Request {
  user: {
    email: string;
  };
}

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user data',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'User not authenticated' })
  async getCurrentUser(@Req() req: RequestWithUser): Promise<User> {
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

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: [UserResponseDto], // Array of users
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/byStatus')
  @ApiOperation({ summary: 'Get users by status' })
  @ApiQuery({
    name: 'status',
    enum: ['active', 'invited', 'pending', 'banned'],
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns users with specified status',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Status is required' })
  async getbyStatus(@Query('status') status: string): Promise<User[]> {
    if (!status) {
      throw new HttpException('Status is required', HttpStatus.BAD_REQUEST);
    }
    const users = await this.userService.getUsersByStatus(status);

    return users;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns user data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param() params: UserIdParam): Promise<User> {
    const user = await this.userService.getUserById(params.id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // @Post()
  // @ApiOperation({ summary: 'Create new user' })
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({
  //   status: 201,
  //   description: 'User created successfully',
  //   type: UserResponseDto,
  // })
  // async createUser(@Body() createUserDto: Partial<User>): Promise<User> {
  //   return this.userService.createUser(createUserDto);
  // }

  @Post('/invite')
  @ApiOperation({ summary: 'Invite new user' })
  @ApiBody({ type: InviteUserDto })
  @ApiResponse({
    status: 201,
    description: 'User invited successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already invited' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async inviteUser(@Body() inviteUserDto: InviteUserDto): Promise<User> {
    const existingUser = await this.userService.getUserByEmail(
      inviteUserDto.email,
    );

    if (existingUser) {
      throw new HttpException('User is already invited', HttpStatus.CONFLICT);
    }

    return this.userService.inviteUser(inviteUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Get('fetch-html')
  async fetchHtml(@Query('url') url: string): Promise<string> {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.get(url);
      return response.data; // Повертаємо HTML-код
    } catch {
      throw new HttpException(
        'Failed to fetch HTML',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
