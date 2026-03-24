import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIBAN, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({ example: 'RO12345678901234567890' })
    @IsNotEmpty({ message: 'IBAN is required' })
    @IsIBAN({ message: 'Invalid IBAN format' })
    IBAN: string;

    @ApiProperty({ example: '123 Main St' })
    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    address: string;

    @ApiProperty({ example: 'Some County' })
    @IsNotEmpty({ message: 'County is required' })
    @IsString({ message: 'County must be a string' })
    county: string;

    @ApiProperty({ example: 'Some City' })
    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @ApiProperty({ example: 12345 })
    @IsNotEmpty({ message: 'Zip code is required' })
    @IsNumber({}, { message: 'Zip code must be a number' })
    zipCode: number;
}