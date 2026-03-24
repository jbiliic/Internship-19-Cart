import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Min, MinLength } from "class-validator";

export class LogInDto {

    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}