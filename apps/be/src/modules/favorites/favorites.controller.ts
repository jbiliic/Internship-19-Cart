import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { use } from 'passport';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { ProductDto } from './dto/product.dto';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Get()
    @UseGuards(UserGuard)
    @ApiOkResponse({
        description: 'The favorites have been successfully retrieved.',
        type: ProductDto,
        isArray: true,
    })
    getFavorites(@Req() req: { user: AuthenticatedUser }) {
        const userId = req.user.id;
        return this.favoritesService.getFavorites(userId);
    }

    @Post('/:id')
    @UseGuards(UserGuard)
    @ApiOkResponse({
        description: 'The favorite has been successfully added.'
    })
    addFavorite(@Req() req: { user: AuthenticatedUser }, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user.id;
        return this.favoritesService.addFavorite(userId, id);
    }

    @Delete('/:id')
    @UseGuards(UserGuard)
    @ApiOkResponse({
        description: 'The favorite has been successfully removed.'
    })
    removeFavorite(@Req() req: { user: AuthenticatedUser }, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user.id;
        return this.favoritesService.removeFavorite(userId, id);
    }

}
