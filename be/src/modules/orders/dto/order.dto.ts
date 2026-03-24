import { ApiProperty } from "@nestjs/swagger";
import { Order } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ProductDto } from "./product.dto";
import { OrderStatus } from "@prisma/client";

export class OrderDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    products: ProductDto[];

    @ApiProperty({ example: 39.98 })
    @IsNotEmpty()
    @IsNumber()
    totalPrice: number;

    @ApiProperty({ example: "PENDING" })
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}