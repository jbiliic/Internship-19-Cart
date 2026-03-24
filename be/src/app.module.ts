import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UserModule, FavoritesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
