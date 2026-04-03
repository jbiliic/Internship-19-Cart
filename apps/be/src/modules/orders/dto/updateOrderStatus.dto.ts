import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
    @ApiProperty({
        enum: OrderStatus,
        example: OrderStatus.SHIPPED,
        description: 'The new status for the order'
    })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}