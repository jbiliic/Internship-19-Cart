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

export class GetProductsQueryDto {
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

    @ApiPropertyOptional({ example: true, type: Boolean })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (normalized === 'true') return true;
            if (normalized === 'false') return false;
        }
        return value;
    })
    @IsBoolean()
    inStock?: boolean;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    page?: number;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    limit?: number;
}