import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetProductsQueryDto } from './dto/getProducts.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductDto } from './dto/product.dto';
import { SingleProductDto } from './dto/singleProduct.dto';
import { PaginatedProductsDto } from './dto/paginatedProduct.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOkResponse({
        description: 'List of products',
        type: PaginatedProductsDto,
    })
    getAllProducts(@Query() query: GetProductsQueryDto) {
        return this.productsService.getProducts(query);
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Product details',
        type: SingleProductDto,
    })
    getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.getProductById(id);
    }

    @Delete(':id')
    @ApiOkResponse({
        description: 'Product deleted',
    })
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.deleteProduct(id);
    }

    @Post()
    @ApiOkResponse({
        description: 'Product created',
        type: SingleProductDto,
    })
    createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    @Patch(':id')
    @ApiOkResponse({
        description: 'Product updated',
        type: SingleProductDto,
    })
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateProductDto
    ) {
        return this.productsService.updateProduct(id, body);
    }
}
