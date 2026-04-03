import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIBAN, IsNotEmpty, IsNumber } from 'class-validator';

export class UserDto {

    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'DE12345678901234567890' })
    @IsNotEmpty()
    @IsIBAN()
    IBAN: string;

    @ApiProperty({ example: '123 Main St' })
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: 'Example County' })
    @IsNotEmpty()
    county: string;

    @ApiProperty({ example: 'Example City' })
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: '12345' })
    @IsNotEmpty()
    @IsNumber()
    zipCode: number;
}