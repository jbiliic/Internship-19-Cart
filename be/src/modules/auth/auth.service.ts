import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LogInDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { AuthenticatedUser } from 'src/common/auth/interfaces/authenticatedUser.interface';
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
            throw new Error('Invalid email or password');
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
            access_token: token
        };
    }

    async register(object: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: object.email },
        });

        if (existingUser) {
            throw new Error('Email already in use');
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
}
