import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsBoolean,
    IsArray,
    IsEnum,
    IsUrl,
    IsInt,
    Min,
    IsNotEmpty,
    MinLength
} from "class-validator";
import { Size } from "@prisma/client";
import { Type, Transform } from "class-transformer";

export class CreateProductDto {
    @ApiProperty({ example: "Classic Hoodie" })
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @ApiProperty({ example: "Red" })
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({ example: 45.99 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01, { message: 'Price must be at least 0.01' })
    @Type(() => Number)
    price: number;

    @ApiProperty({ example: "https://example.com/images/hoodie.jpg" })
    @IsNotEmpty()
    @IsUrl()
    imgURL: string;

    @ApiProperty({ example: true })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    inStock: boolean;

    @ApiProperty({
        example: [1, 2],
        description: 'Array of category IDs to link'
    })
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    categoryIds: number[];

    @ApiProperty({
        enum: Size,
        isArray: true,
        example: [Size.L, Size.XL]
    })
    @IsArray()
    @IsEnum(Size, { each: true })
    sizes: Size[];
}