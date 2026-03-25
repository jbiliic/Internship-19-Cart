import { ApiProperty } from "@nestjs/swagger";
import {
    IsNumber,
    IsString,
    IsBoolean,
    IsEnum,
    IsUrl,
    IsArray,
    IsInt,
    IsPositive
} from "class-validator";
import { Size } from "@prisma/client";
import { Type } from "class-transformer";

export class SingleProductDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    id: number;

    @ApiProperty({ example: "Classic T-Shirt" })
    @IsString()
    name: string;

    @ApiProperty({ example: 29.99 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @ApiProperty({ example: "Navy Blue" })
    @IsString()
    color: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    inStock: boolean;

    @ApiProperty({
        enum: Size,
        isArray: true,
        example: [Size.M, Size.L]
    })
    @IsArray()
    @IsEnum(Size, { each: true })
    sizes: Size[];

    @ApiProperty({ example: "https://cdn.example.com/products/tshirt-navy.jpg" })
    @IsUrl()
    imgURL: string;

    @ApiProperty({ example: [1, 5], description: 'Array of category IDs' })
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    categoryIds: number[];
}