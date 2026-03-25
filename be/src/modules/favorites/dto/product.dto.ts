import { ApiProperty } from "@nestjs/swagger";
import { Size } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsString, IsUrl, isURL } from "class-validator";

export class ProductDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Example Product" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: "M" })
    @IsNotEmpty()
    @IsEnum(Size, { each: true })
    size: Size[];

    @ApiProperty({ example: "Red" })
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({ example: 19.99 })
    @IsNotEmpty()
    @IsDecimal()
    price: number;

    @ApiProperty({ example: "https://example.com/image.jpg" })
    @IsNotEmpty()
    @IsUrl()
    imageURL: string;
}