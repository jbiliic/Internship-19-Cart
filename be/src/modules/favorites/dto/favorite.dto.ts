import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class FavoriteDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    productId: number;
}
