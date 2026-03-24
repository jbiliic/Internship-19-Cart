import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    getUserProfile(id: number) {
        const userProfile = this.prisma.user.findFirst({
            where: { id },
        });
        if (!userProfile) {
            throw new Error('User not found');
        }
        return userProfile;
    }

    editUserProfile(id: number, updateData: UserDto) {
        const user = this.prisma.user.findFirst({
            where: { id },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
}