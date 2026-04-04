import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { UserDto } from './dto/user.dto';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Put('/me')
    @UseGuards(UserGuard)
    @ApiResponse({ status: 200, description: 'The user has been successfully edited' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    editUserProfile(@Req() req: { user: AuthenticatedUser }, @Body() updateData: UserDto) {
        const id = req.user.id;
        return this.userService.editUserProfile(id, updateData);
    }

    @Get('/me')
    @UseGuards(UserGuard)
    @ApiResponse({ status: 200, description: 'The user has been successfully retrieved' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    getUserProfile(@Req() req: { user: AuthenticatedUser }) {
        const id = req.user.id;
        return this.userService.getUserProfile(id);
    }

}
