import { ApiProperty } from "@nestjs/swagger";
import { Order } from "@prisma/client";
import { IsDecimal, IsEnum, IsIBAN, IsNotEmpty, IsNumber } from "class-validator";
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