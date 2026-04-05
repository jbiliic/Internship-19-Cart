import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
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
        if (orders.length === 0) {
            throw new Error('No orders found for this user');
        }

        return orders.map((order) => {
            const total = order.products.reduce((acc, op) => {
                return acc + op.price.toNumber() * op.quantity;
            }, 0);

            return {
                id: order.id,
                totalPrice: Number(total.toFixed(2)),
                status: order.status,
                IBAN: order.IBAN,
                address: order.address,
                county: order.county,
                city: order.city,
                zipCode: order.zipCode,
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

    async createOrder(userId: number, items: OrderProductDto[]): Promise<OrderDto> {
        if (items.length === 0) throw new BadRequestException('Order must be at least one item');
        if (items.some(item => item.quantity <= 0)) throw new BadRequestException('Quantity must be > 0');

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const productIds = items.map(item => item.productId);
        const productsFromDb = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        items = items.reduce((acc, item) => {
            const existing = acc.find(i => i.productId === item.productId && i.selectedSize === item.selectedSize);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, [] as OrderProductDto[]);

        for (const item of items) {
            const product = productsFromDb.find(p => p.id === item.productId);

            if (!product) {
                throw new NotFoundException(`Product ID ${item.productId} not found`);
            }
            if (!product.size.includes(item.selectedSize)) {
                throw new BadRequestException(
                    `Size ${item.selectedSize} is not available for ${product.name}`
                );
            }
        }

        const totalcost = items.reduce((acc, item) => {
            const product = productsFromDb.find(p => p.id === item.productId);
            return acc + (product!.price.toNumber() * item.quantity);
        }, 0);

        const newOrder = await this.prisma.order.create({
            data: {
                userId,
                IBAN: user.IBAN,
                address: user.address,
                county: user.county,
                city: user.city,
                zipCode: user.zipCode,
                totalPrice: Number(totalcost.toFixed(2)),
                products: {
                    create: items.map((item) => {
                        const product = productsFromDb.find(p => p.id === item.productId);
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            price: product!.price,
                            selectedSize: item.selectedSize,
                        };
                    }),
                },
            },
            include: {
                products: { include: { product: true } },
            },
        });
        return {
            id: newOrder.id,
            totalPrice: newOrder.totalPrice,
            status: newOrder.status,
            IBAN: newOrder.IBAN,
            address: newOrder.address,
            county: newOrder.county,
            city: newOrder.city,
            zipCode: newOrder.zipCode,
            products: newOrder.products.map(op => ({
                id: op.product.id,
                name: op.product.name,
                imgURL: op.product.imgURL,
                price: op.price.toNumber(),
                color: op.product.color,
                size: op.selectedSize,
                quantity: op.quantity,
            })),
        };
    }

    async getAllOrders(status?: OrderStatus, id?: number): Promise<OrderDto[]> {
        const orders = await this.prisma.order.findMany({
            where: {
                status,
                id
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (orders.length === 0) {
            throw new Error('No orders found');
        }

        return orders.map((order) => {
            return {
                id: order.id,
                totalPrice: order.totalPrice,
                status: order.status,
                IBAN: order.IBAN,
                address: order.address,
                county: order.county,
                city: order.city,
                zipCode: order.zipCode,
                products: order.products.map((op) => ({
                    id: op.product.id,
                    name: op.product.name,
                    imgURL: op.product.imgURL,
                    price: op.price.toNumber(),
                    color: op.product.color,
                    size: op.selectedSize,
                    quantity: op.quantity,
                })),
            }
        }
        );
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