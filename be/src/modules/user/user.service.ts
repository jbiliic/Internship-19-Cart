import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async getUserProfile(id: number) {
        const userProfile = await this.prisma.user.findFirst({
            where: { id },
        });
        if (!userProfile) {
            throw new Error('User not found');
        }
        return {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            IBAN: userProfile.IBAN,
            address: userProfile.address,
            county: userProfile.county,
            city: userProfile.city,
            zipCode: userProfile.zipCode
        } as UserDto;
    }

    async editUserProfile(id: number, updateData: UserDto) {
        const user = await this.prisma.user.findFirst({
            where: { id },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
}