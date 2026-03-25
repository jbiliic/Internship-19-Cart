import { PrismaClient, Size, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🚀 Započinjem punjenje baze podataka s hashiranim lozinkama...');

    // 1. Definiranje "Salt Rounds" za bcrypt
    const saltRounds = 10;

    // 2. Čišćenje baze podataka
    await prisma.orderProduct.deleteMany();
    await prisma.order.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // 3. Kreiranje kategorija (isto kao prije)
    const catMen = await prisma.category.create({ data: { name: 'Muškarci' } });
    const catWomen = await prisma.category.create({ data: { name: 'Žene' } });

    // 4. Kreiranje proizvoda
    const p1 = await prisma.product.create({
        data: {
            name: 'Klasična Bijela Majica',
            price: 19.99,
            color: 'Bijela',
            size: [Size.S, Size.M, Size.L],
            imgURL: 'https://example.com/white-tshirt.jpg',
            categories: { create: [{ category: { connect: { id: catMen.id } } }] }
        }
    });

    // 5. Kreiranje korisnika s HASHIRANIM lozinkama
    console.log('🔐 Hashiranje lozinki i kreiranje korisnika...');

    const adminPassword = await bcrypt.hash('AdminLozinka123!', saltRounds);
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@trgovina.hr',
            name: 'Ana Administrator',
            isAdmin: true,
            password: adminPassword, // Spremljen hash
            IBAN: 'HR1234567890123456789',
            address: 'Ilica 1',
            county: 'Grad Zagreb',
            city: 'Zagreb',
            zipCode: 10000,
        }
    });

    const userPassword = await bcrypt.hash('KupacLozinka456!', saltRounds);
    const customer1 = await prisma.user.create({
        data: {
            email: 'ivan.kupac@example.com',
            name: 'Ivan Horvat',
            isAdmin: false,
            password: userPassword, // Spremljen hash
            IBAN: 'HR9876543210987654321',
            address: 'Vukovarska 100',
            county: 'Splitsko-dalmatinska',
            city: 'Split',
            zipCode: 21000,
        }
    });

    // 6. Kreiranje testne narudžbe da baza ima smisla
    console.log('📦 Dodavanje testne narudžbe...');
    await prisma.order.create({
        data: {
            userId: customer1.id,
            status: OrderStatus.PENDING,
            products: {
                create: [
                    {
                        productId: p1.id,
                        quantity: 1,
                        price: p1.price,
                        selectedSize: Size.M
                    }
                ]
            }
        }
    });

    console.log('✅ Baza je uspješno popunjena (lozinke su sigurne)!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });