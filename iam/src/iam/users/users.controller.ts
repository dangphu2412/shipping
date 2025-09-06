import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { VerifyUserIdentity } from '../auth/identify.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @VerifyUserIdentity
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
