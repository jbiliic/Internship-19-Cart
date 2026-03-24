import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { type AuthenticatedUser } from 'src/common/auth/interfaces/authenticatedUser.interface';
import { OrderStatus, Size } from '@prisma/client';
import { OrderProductDto } from './dto/orderProduct.dto';
import { UserGuard } from 'src/common/auth/guards/user.guard';
import { AdminGuard } from 'src/common/auth/guards/admin.guard';
import { OrderDto } from './dto/order.dto';

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
    @UseGuards(UserGuard)
    createOrder(
        @Req() req: AuthenticatedUser,
        @Body() body: { items: OrderProductDto[] }
    ) {
        const userId = req.id;
        return this.ordersService.createOrder(userId, body.items);
    }

    @Get()
    @UseGuards(UserGuard, AdminGuard)
    @ApiOkResponse({
        description: 'The orders have been successfully retrieved.',
        type: OrderDto,
        isArray: true,
    })
    getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    @Patch(':id/status')
    @UseGuards(UserGuard, AdminGuard)
    @ApiOkResponse({
        description: 'The order status has been successfully changed.'
    })
    changeOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: OrderStatus
    ) {
        return this.ordersService.changeOrderStatus(id, status);
    }


}
