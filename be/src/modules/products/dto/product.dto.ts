import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class ProductDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'ID is required' })
    id: number;

    @ApiProperty({ example: 'Product Name' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({ example: 99.99 })
    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    price: number;

    @ApiProperty({ example: false })
    @IsBoolean({ message: 'In stock must be a boolean' })
    inStock: boolean;

    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsUrl({}, { message: 'Image URL must be a valid URL' })
    imgURL?: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'Category IDDs are required' })
    @IsNumber({}, { message: 'Category IDs must be a number' })
    @IsArray({ message: 'Category IDs must be an array' })
    categoryIds: number[];
}