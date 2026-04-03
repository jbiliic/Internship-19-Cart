import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCategories(): Promise<CategoryDto[]> {
        const categories = await this.prisma.category.findMany();

        return categories.map(c => ({
            id: c.id,
            name: c.name,
        })) as CategoryDto[];
    }

    async createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
        const { name } = dto;
        const category = await this.prisma.category.create({
            data: { name },
        });

        return {
            id: category.id,
            name: category.name,
        } as CategoryDto;
    }

    async deleteCategory(id: number): Promise<void> {
        try {
            await this.prisma.category.delete({
                where: { id },
            });
        } catch (error) {
            throw new Error('Category not found');
        }
    }
}
