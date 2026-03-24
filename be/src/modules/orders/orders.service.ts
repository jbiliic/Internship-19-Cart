import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { OrderStatus, Product, Size } from '@prisma/client';
import { OrderProductDto } from './dto/orderProduct.dto';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    async getMyOrders(userId: number): Promise<OrderDto[]> {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders.map((order) => {
            const total = order.products.reduce((acc, op) => {
                return acc + op.price.toNumber() * op.quantity;
            }, 0);

            return {
                id: order.id,
                totalPrice: Number(total.toFixed(2)),
                status: order.status,
                products: order.products.map((op) => ({
                    id: op.product.id,
                    name: op.product.name,
                    imgURL: op.product.imgURL,
                    price: op.price.toNumber(),
                    color: op.product.color,
                    size: op.selectedSize,

                })),
            } as OrderDto;
        });
    }

    async createOrder(
        userId: number,
        items: OrderProductDto[]
    ): Promise<OrderDto> {
        if (items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        if (items.some(item => item.quantity <= 0)) {
            throw new Error('Quantity must be greater than zero');
        }

        const productIds = items.map((item) => item.productId);
        const productsFromDb = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        const newOrder = await this.prisma.order.create({
            data: {
                userId,
                products: {
                    create: items.map((item) => {
                        const product = productsFromDb.find((p) => p.id === item.productId);
                        if (!product) {
                            throw new Error(`Product with ID ${item.productId} not found`);
                        }

                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            price: product.price,
                            selectedSize: item.selectedSize as Size,
                        };
                    }),
                },
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const total = newOrder.products.reduce((acc, op) => {
            return acc + (op.price.toNumber() * op.quantity);
        }, 0);

        return {
            id: newOrder.id,
            totalPrice: Number(total.toFixed(2)),
            products: newOrder.products.map((op) => ({
                id: op.product.id,
                name: op.product.name,
                imgURL: op.product.imgURL,
                price: op.price.toNumber(),
                color: op.product.color,
                size: op.selectedSize,
            })),
        };
    }

    async getAllOrders(): Promise<OrderDto[]> {
        const orders = await this.prisma.order.findMany({
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders.map((order) => {
            const total = order.products.reduce((acc, op) => {
                return acc + op.price.toNumber() * op.quantity;
            }, 0);

            return {
                id: order.id,
                totalPrice: Number(total.toFixed(2)),
                products: order.products.map((op) => ({
                    id: op.product.id,
                    name: op.product.name,
                    imgURL: op.product.imgURL,
                    price: op.price.toNumber(),
                    color: op.product.color,
                    size: op.selectedSize,
                })),
            };
        });
    }

    async changeOrderStatus(orderId: number, status: OrderStatus) {
        if (!Object.values(OrderStatus).includes(status)) {
            throw new Error('Invalid order status');
        }

        return await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
} 