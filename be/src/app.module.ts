import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        UserModule,
        FavoritesModule,
        AuthModule,
        OrdersModule,
        CategoriesModule,
        ProductsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({
                path: '*',
                method: RequestMethod.ALL
            });
    }
}
