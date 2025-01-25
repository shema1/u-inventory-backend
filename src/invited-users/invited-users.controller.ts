import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InvitedUser } from 'src/schemas/invited-user.schema';
import { InvitedUsersService } from './invited-users.service';

@Controller('invited-users')
export class InvitedUsersController {
  constructor(private readonly invitedUserService: InvitedUsersService) {}

  @Post()
  async create(
    @Body() createUserDto: Partial<InvitedUser>,
  ): Promise<InvitedUser> {
    return this.invitedUserService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<InvitedUser[]> {
    return this.invitedUserService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<InvitedUser> {
    return this.invitedUserService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<InvitedUser>,
  ): Promise<InvitedUser> {
    return this.invitedUserService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.invitedUserService.delete(id);
  }
}
