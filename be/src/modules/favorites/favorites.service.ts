import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) { }

    async getFavorites(userId: number): Promise<ProductDto[]> {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });

        return favorites.map(fav => ({
            id: fav.product.id,
            name: fav.product.name,
            size: fav.product.size,
            color: fav.product.color,
            price: fav.product.price.toNumber(),
            imageURL: fav.product.imgURL,
        })) as ProductDto[];
    }

    async addFavorite(userId: number, productId: number) {
        try {
            return await this.prisma.favorite.create({
                data: {
                    userId,
                    productId,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('This product is already in your favorites.');
            }
            throw error;
        }
    }

    async removeFavorite(userId: number, productId: number) {
        const deleted = await this.prisma.favorite.deleteMany({
            where: {
                userId,
                productId,
            },
        });

        if (deleted.count === 0) {
            throw new NotFoundException('Favorite not found.');
        }
    }
}