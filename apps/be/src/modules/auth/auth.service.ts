import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LogInDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

    async logIn(object: LogInDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: object.email },
        });

        if (!user) {
            throw new BadRequestException('Invalid email or password');
        }
        const isPasswordMatching = await bcrypt.compare(object.password, user.password);

        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            id: user.id,
            isAdmin: user.isAdmin
        } as AuthenticatedUser;

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            isAdmin: user.isAdmin,
        };
    }

    async register(object: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: object.email },
        });

        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(object.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: object.email,
                password: hashedPassword,
                name: object.name,
                IBAN: object.IBAN,
                address: object.address,
                county: object.county,
                city: object.city,
                zipCode: object.zipCode,
            },
        });

        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            IBAN: newUser.IBAN,
            address: newUser.address,
            county: newUser.county,
            city: newUser.city,
            zipCode: newUser.zipCode,
        };
    }

    async validateAndRefreshToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilExpiration = decoded.exp - currentTime;

            let newToken: string | undefined = undefined;

            if (timeUntilExpiration < 600) {
                const payload = {
                    id: user.id,
                    isAdmin: user.isAdmin,
                };
                newToken = this.jwtService.sign(payload);
            }
            return {
                isAdmin: user.isAdmin,
                ...(newToken && { token: newToken }),
            };

        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
