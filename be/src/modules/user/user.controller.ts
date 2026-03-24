import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('/me')

    create() {
        return this.userService.create(createUserDto);
    }

    @Get('/me')
    findAll() {
        return this.userService.findAll();
    }

}
