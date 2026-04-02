import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards, ParseArrayPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetProductsQueryDto } from './dto/getProducts.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductDto } from './dto/product.dto';
import { SingleProductDto } from './dto/singleProduct.dto';
import { PaginatedProductsDto } from './dto/paginatedProduct.dto';
import { AuthenticatedUser } from 'src/common/auth/interfaces/authenticatedUser.interface';
import { UserGuard } from 'src/common/auth/guards/user.guard';
import { AdminGuard } from 'src/common/auth/guards/admin.guard';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOkResponse({
        description: 'List of products',
        type: PaginatedProductsDto,
    })
    @UseGuards(UserGuard)
    getAllProducts(@Query() query: GetProductsQueryDto, @Req() req: { user: AuthenticatedUser }) {
        console.log('Received query parameters:', query);

        const id = req.user.id;
        console.log('Authenticated user ID:', id);
        return this.productsService.getProducts(query, id);
    }

    @Get('cart')
    @ApiOkResponse({
        description: 'Fetched cart products by IDs',
        type: [SingleProductDto],
        isArray: true,
    })
    @UseGuards(UserGuard)
    getProductsByIds(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],) {
        return this.productsService.getProductsByIds(ids);
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Product details',
        type: SingleProductDto,
    })
    @UseGuards(UserGuard)
    getProductById(@Param('id', ParseIntPipe) id: number, @Req() req: { user: AuthenticatedUser }) {
        const userId = req.user.id;
        return this.productsService.getProductById(id, userId);
    }

    @Delete(':id')
    @ApiOkResponse({
        description: 'Product deleted',
    })
    @UseGuards(UserGuard, AdminGuard)
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.deleteProduct(id);
    }

    @Post()
    @ApiOkResponse({
        description: 'Product created',
        type: SingleProductDto,
    })
    @UseGuards(UserGuard, AdminGuard)
    createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    @Patch(':id')
    @ApiOkResponse({
        description: 'Product updated',
        type: SingleProductDto,
    })
    @UseGuards(UserGuard, AdminGuard)
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateProductDto
    ) {
        return this.productsService.updateProduct(id, body);
    }

    @Get('random/:count')
    @ApiOkResponse({
        description: 'Random products',
        type: [ProductDto],
    })
    @UseGuards(UserGuard)
    getRandomProducts(@Param('count', ParseIntPipe) count: number) {
        return this.productsService.getRandomProducts(count);
    }
}