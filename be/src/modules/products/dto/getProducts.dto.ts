import { ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsString,
    IsEnum,
    IsBoolean,
    IsPositive,
    Min
} from "class-validator";
import { Type, Transform } from "class-transformer";

export enum SortBy {
    PRICE = 'price',
    NAME = 'name'
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

export class GetProductsDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    categoryId?: number;

    @ApiPropertyOptional({ example: 10.00 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({ example: 100.00 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional({ example: 'Summer shirt' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: SortBy, default: SortBy.PRICE })
    @IsOptional()
    @IsEnum(SortBy)
    sortBy?: SortBy = SortBy.PRICE;

    @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.ASC;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    inStock?: boolean;
}