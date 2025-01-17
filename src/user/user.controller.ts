import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }
}
