import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Validate } from 'class-validator';
import { ValidateTokenDto } from './dto/validate.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    @Throttle({
        default: {
            ttl: 60000,
            limit: 5
        }
    })
    @ApiOkResponse({ description: 'User logged in successfully' })
    logIn(@Body() logInDto: LogInDto) {
        return this.authService.logIn(logInDto);
    }

    @Post('/register')
    @Throttle({
        default: {
            ttl: 60000,
            limit: 5
        }
    })
    @ApiOkResponse({ description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('/validate')
    @ApiOkResponse({ type: ValidateTokenDto })
    async validateToken(@Headers('Authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }
        console.log('Received token:', authHeader);
        const token = authHeader.split(' ')[1];
        console.log('Extracted token:', token);

        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }
        return this.authService.validateAndRefreshToken(token);
    }
}
