import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/common/auth/guards/user.guard';
import { AuthenticatedUser } from 'src/common/auth/interfaces/authenticatedUser.interface';
import { FavoritesService } from './favorites.service';
import { FavoriteDto } from './dto/favorite.dto';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(UserGuard)
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Returns all favorites for the current user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    getFavorites(@Req() req: { user: AuthenticatedUser }) {
        return this.favoritesService.getFavorites(req.user.id);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Product added to favorites' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    @ApiResponse({ status: 409, description: 'Product is already in favorites.' })
    addFavorite(@Req() req: { user: AuthenticatedUser }, @Body() dto: FavoriteDto) {
        return this.favoritesService.addFavorite(req.user.id, dto);
    }

    @Delete(':productId')
    @ApiResponse({ status: 200, description: 'Product removed from favorites' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Favorite not found.' })
    removeFavorite(
        @Req() req: { user: AuthenticatedUser },
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        return this.favoritesService.removeFavorite(req.user.id, productId);
    }
}
