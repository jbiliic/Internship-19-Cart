import { ApiProperty } from "@nestjs/swagger";
import { ProductDto } from "./product.dto";

export class PaginatedProductsDto {
    @ApiProperty({ type: [ProductDto] })
    data: ProductDto[];

    @ApiProperty({ example: 100 })
    total: number;

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 10 })
    limit: number;

    @ApiProperty({ example: true })
    hasNextPage: boolean;

    @ApiProperty({ example: false })
    hasPreviousPage: boolean;
}