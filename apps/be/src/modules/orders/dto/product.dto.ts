import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";
import { Size } from "@prisma/client";

export class ProductDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({ example: "Example Product" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: "https://example.com/image.jpg" })
    @IsNotEmpty()
    @IsUrl()
    imgURL: string;

    @ApiProperty({ example: 19.99 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ example: "Example Product" })
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({ example: "Example Product" })
    @IsNotEmpty()
    @IsEnum(Size)
    size: Size;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}