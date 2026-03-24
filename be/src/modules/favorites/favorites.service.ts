import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) {}

    getFavorites(userId: number) {
        return this.prisma.favourite.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });
    }

    async addFavorite(userId: number, dto: FavoriteDto) {
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const existing = await this.prisma.favourite.findUnique({
            where: { userId_productId: { userId, productId: dto.productId } },
        });

        if (existing) {
            throw new ConflictException('Product is already in favorites');
        }

        return this.prisma.favourite.create({
            data: { userId, productId: dto.productId },
            include: { product: true },
        });
    }

    async removeFavorite(userId: number, productId: number) {
        const favourite = await this.prisma.favourite.findUnique({
            where: { userId_productId: { userId, productId } },
        });

        if (!favourite) {
            throw new NotFoundException('Favorite not found');
        }

        return this.prisma.favourite.delete({
            where: { userId_productId: { userId, productId } },
        });
    }
}
