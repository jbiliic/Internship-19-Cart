import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GetProductsDto } from './dto/getProducts.dto';
import { ProductDto } from './dto/product.dto';
import { SingleProductDto } from './dto/singleProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async getProducts(getProductsDto: GetProductsDto): Promise<ProductDto[]> {
        const { categoryId, minPrice, maxPrice, search, sortBy, sortOrder, inStock } = getProductsDto;
        const products = await this.prisma.product.findMany({
            where: {
                categories: categoryId ? { some: { categoryId } } : undefined,
                price: {
                    gte: minPrice ?? undefined,
                    lte: maxPrice ?? undefined,
                },
                name: search ? { contains: search, mode: 'insensitive' } : undefined,
                inStock: inStock !== undefined ? inStock : undefined,
            },
            include: {
                categories: {
                    select: {
                        categoryId: true,
                    },
                },
            },
            orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined,
        });

        return products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price.toNumber(),
            color: p.color,
            imgURL: p.imgURL,
            inStock: p.inStock,
            categoryIds: p.categories.map(c => c.categoryId),
        })) as ProductDto[];
    }

    async getProductById(id: number): Promise<SingleProductDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                categories: {
                    select: {
                        categoryId: true,
                    },
                },
            },
        });
        if (!product) {
            throw new BadRequestException('Product not found');
        }
        return {
            id: product.id,
            name: product.name,
            price: product.price.toNumber(),
            color: product.color,
            imgURL: product.imgURL,
            inStock: product.inStock,
            categoryIds: product.categories.map(c => c.categoryId),
            sizes: product.size,
        } as SingleProductDto;
    }

    async createProduct(productDto: CreateProductDto): Promise<SingleProductDto> {
        const { name, price, color, inStock, imgURL, categoryIds, sizes } = productDto;

        const categories = await this.prisma.category.findMany({
            where: { id: { in: categoryIds } },
        });
        if (categories.length !== categoryIds.length) {
            throw new BadRequestException('One or more categories not found');
        }
        const newProduct = await this.prisma.product.create({
            data: {
                name,
                price,
                color,
                inStock,
                imgURL,
                size: sizes,
                categories: {
                    create: categoryIds.map(categoryId => ({
                        category: { connect: { id: categoryId } },
                    })),
                },
            },
            include: {
                categories: {
                    select: {
                        categoryId: true,
                    },
                },
            },
        });

        return {
            id: newProduct.id,
            name: newProduct.name,
            price: newProduct.price.toNumber(),
            color: newProduct.color,
            imgURL: newProduct.imgURL,
            inStock: newProduct.inStock,
            categoryIds: newProduct.categories.map(c => c.categoryId),
            sizes: newProduct.size,
        } as SingleProductDto;
    }

    async updateProduct(id: number, productDto: CreateProductDto): Promise<SingleProductDto> {
        const { name, price, color, inStock, imgURL, categoryIds, sizes } = productDto;

        const categories = await this.prisma.category.findMany({
            where: { id: { in: categoryIds } },
        });
        if (categories.length !== categoryIds.length) {
            throw new BadRequestException('One or more categories not found');
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                name,
                price: price,
                color,
                inStock,
                imgURL,
                size: sizes,
                categories: {
                    deleteMany: {},
                    create: categoryIds.map((categoryId) => ({
                        categoryId: categoryId,
                    })),
                },
            },
            include: {
                categories: true,
            },
        });

        return {
            id: updatedProduct.id,
            name: updatedProduct.name,
            price: updatedProduct.price.toNumber(),
            color: updatedProduct.color,
            imgURL: updatedProduct.imgURL,
            inStock: updatedProduct.inStock,
            categoryIds: updatedProduct.categories.map((c) => c.categoryId),
            sizes: updatedProduct.size,
        } as SingleProductDto;
    }

    async deleteProduct(id: number): Promise<void> {
        try {
            await this.prisma.product.delete({
                where: { id },
            });
        } catch (error) {
            throw new BadRequestException('Product not found');
        }
    }
}
