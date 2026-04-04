import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { AdminGuard } from '../../common/auth/guards/admin.guard';
import { CreateCategoryDto } from './dto/createCategory.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOkResponse({
        description: 'List of all categories',
        type: CategoryDto,
        isArray: true,
    })
    @UseGuards(UserGuard)
    getAllCategories() {
        return this.categoriesService.getAllCategories();
    }

    @Post()
    @ApiOkResponse({
        description: 'Category created successfully',
        type: CategoryDto,
    })
    @UseGuards(UserGuard, AdminGuard)
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.createCategory(dto);
    }

    @Delete('/:id')
    @ApiOkResponse({
        description: 'Category deleted successfully',
    })
    @UseGuards(UserGuard, AdminGuard)
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.deleteCategory(id);
    }
}
