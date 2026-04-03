import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { type AuthenticatedUser } from 'src/common/auth/interfaces/authenticatedUser.interface';
import { OrderStatus, Size } from '@prisma/client';
import { OrderProductDto } from './dto/orderProduct.dto';
import { UserGuard } from 'src/common/auth/guards/user.guard';
import { AdminGuard } from 'src/common/auth/guards/admin.guard';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }


    @Get('my')
    @ApiOkResponse({
        description: 'The orders have been successfully retrieved.',
        type: OrderDto,
        isArray: true,
    })
    @UseGuards(UserGuard)
    getMyOrders(@Req() req: AuthenticatedUser) {
        const userId = req.id;
        return this.ordersService.getMyOrders(userId);
    }

    @Post()
    @ApiOkResponse({
        description: 'The order has been successfully created.'
    })
    @ApiBody({ type: [OrderProductDto] })
    @UseGuards(UserGuard)
    createOrder(
        @Req() req: { user: AuthenticatedUser },
        @Body() body: OrderProductDto[]
    ) {
        const userId = req.user.id;
        console.log('Creating order for user ID:', userId);
        return this.ordersService.createOrder(userId, body);
    }

    @Get()
    @ApiOkResponse({
        description: 'The orders have been successfully retrieved.',
        type: OrderDto,
        isArray: true,
    })
    @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
    @ApiQuery({ name: 'id', required: false, type: Number })
    @UseGuards(UserGuard, AdminGuard)
    getAllOrders(
        @Query('status') status?: OrderStatus,
        @Query('id', new ParseIntPipe({ optional: true })) id?: number
    ) {
        return this.ordersService.getAllOrders(status, id);
    }

    @Patch(':id/status')
    @UseGuards(UserGuard, AdminGuard)
    @ApiOkResponse({
        description: 'The order status has been successfully changed.',
    })
    changeOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() statusDto: UpdateOrderStatusDto
    ) {
        return this.ordersService.changeOrderStatus(id, statusDto.status);
    }


}
