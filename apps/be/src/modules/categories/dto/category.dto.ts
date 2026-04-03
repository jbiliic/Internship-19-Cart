import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CategoryDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'ID is required' })
    @IsNumber({}, { message: 'ID must be a number' })
    id: number;

    @ApiProperty({ example: 'Shoes' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;
}