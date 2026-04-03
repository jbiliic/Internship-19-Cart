import { ApiProperty } from "@nestjs/swagger";
import { Size } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, Min } from "class-validator";

export class OrderProductDto {
    @ApiProperty({
        description: 'The unique ID of the product',
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    productId: number;

    @ApiProperty({
        description: 'Number of items to order',
        example: 2,
        minimum: 1
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({
        description: 'The specific size selected by the user',
        enum: Size,
        example: Size.M
    })
    @IsNotEmpty()
    @IsEnum(Size)
    selectedSize: Size;
}