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
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    email: updateData.email,
                    name: updateData.name,
                    IBAN: updateData.IBAN,
                    address: updateData.address,
                    county: updateData.county,
                    city: updateData.city,
                    zipCode: updateData.zipCode
                },
            });
            return {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                IBAN: updatedUser.IBAN,
                address: updatedUser.address,
                county: updatedUser.county,
                city: updatedUser.city,
                zipCode: updatedUser.zipCode
            } as UserDto;
        } catch (error) {
            throw new Error('User not found');
        }
    }
}