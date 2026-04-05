import { PrismaClient, Size, OrderStatus, Product } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🚀 Započinjem punjenje baze podataka...');

    const saltRounds = 10;

    // 1. ČIŠĆENJE BAZE PODATAKA (Redoslijed je ključan zbog stranih ključeva)
    console.log('🧹 Čišćenje postojećih podataka...');
    await prisma.orderProduct.deleteMany();
    await prisma.order.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Samo za PostgreSQL
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;

    // 2. KREIRANJE KATEGORIJA
    console.log('📂 Kreiranje kategorija...');
    const categoriesData = [
        { name: "Footwear" }, { name: "T-shirts" }, { name: "Hoodies" },
        { name: "Pants" }, { name: "Jeans" }, { name: "Men" },
        { name: "Women" }, { name: "Winter" }, { name: "Summer" },
        { name: "Jackets" }, { name: "Dresses" }, { name: "Accessories" },
        { name: "Sportswear" }, { name: "Underwear" }, { name: "Shirts" }
    ];

    // Koristimo mapiranje kako bismo osigurali da ID-ovi odgovaraju poretku (1-15)
    for (const cat of categoriesData) {
        await prisma.category.create({ data: cat });
    }

    // 3. KREIRANJE KORISNIKA
    console.log('🔐 Kreiranje korisnika...');
    const adminPassword = await bcrypt.hash('admin1', saltRounds);
    const userPassword = await bcrypt.hash('user12', saltRounds);

    const admin = await prisma.user.create({
        data: {
            email: "admin@gmail.com",
            password: adminPassword,
            name: "Administrator",
            isAdmin: true,
            IBAN: "HR41 2340 0001 1100 2200 33",
            address: "Upravna ulica 1",
            county: "Grad Zagreb",
            city: "Zagreb",
            zipCode: 10000
        }
    });

    const regularUser = await prisma.user.create({
        data: {
            email: "user@gmail.com",
            password: userPassword,
            name: "Standard User",
            isAdmin: false,
            IBAN: "HR41 2360 0002 2200 3300 44",
            address: "Korisnička cesta 10",
            county: "Splitsko-dalmatinska",
            city: "Split",
            zipCode: 21000
        }
    });

    // 4. DEFINIRANJE PROIZVODA (40 komada)
    console.log('👕 Kreiranje 40 proizvoda...');
    const rawProducts = [
        { "name": "Classic White Tee", "color": "White", "price": 19.99, "imgURL": "https://imgs.search.brave.com/6FO9Y-dns72nk-Dz5EWDnRy3giY3z7bN4LKuKwzSKfQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM2/NjU5NjY0Mi9waG90/by9mcmllbmRseS15/b3VuZy1tYW4taW4t/d2hpdGUtdC1zaGly/dC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9RVBseUVVdGkz/aHJuZlRpRzV0RmFB/U3BqSUxTbkh2QWEt/bzhQcFU3bFktdz0", "inStock": true, "categoryIds": [2, 9, 6], "sizes": ["S", "M", "L", "XL"] },
        { "name": "Slim Fit Blue Jeans", "color": "Blue", "price": 59.50, "imgURL": "https://imgs.search.brave.com/b7wbBb29k198p-pdgibqYtlnoCHa39YlD3isJWrfGA4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjQv/NTY5Lzk1NS9zbWFs/bC9ibHVlLWplYW5z/LWRlbmltLXBhbnRz/LWNvbXBvc2l0aW9u/LW1vZGVybi13b21l/bi1zLWFuZC1tZW4t/cy1mYXNoaW9uLXBh/bnRzLXRleHR1cmUt/aXNvbGF0ZWQtb24t/d2hpdGUtYmFja2dy/b3VuZC1waG90by5q/cGc", "inStock": true, "categoryIds": [5, 6], "sizes": ["M", "L"] },
        { "name": "Oversized Black Hoodie", "color": "Black", "price": 45.00, "imgURL": "https://imgs.search.brave.com/7IKsRJXdt1I4XhyXszHzZjGiAQq25PvtdN9QVsfONSw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDkv/MjMxLzY5Ny9zbWFs/bC9ibGFjay1ob29k/aWUtYXJyYW5nZWQt/ZmxhdC1vbi1hLXN1/cmZhY2UtZnJlZS1w/aG90by5qcGc", "inStock": true, "categoryIds": [3, 8, 7], "sizes": ["M", "L", "XL"] },
        { "name": "Leather Chelsea Boots", "color": "Brown", "price": 120.00, "imgURL": "https://imgs.search.brave.com/XO56qdELOGQKV28AOF02Qb4RBMEujrCh7QshzIg8OzE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pdGFs/aWFuc2hvZXNjb21w/YW55LmNvbS9jZG4v/c2hvcC9wcm9kdWN0/cy81My0zLnBuZz92/PTE3NjM3OTg0MDIm/d2lkdGg9NTIx", "inStock": false, "categoryIds": [1, 8], "sizes": ["M", "L"] },
        { "name": "Floral Summer Dress", "color": "Multicolor", "price": 35.00, "imgURL": "https://imgs.search.brave.com/sA3u43FKDJ5wQUEYLjSCdXfrVyML_RCDOlQ-Fd_rNos/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vRmFu/dGFzbG9vay1TdW1t/ZXItU2hvcnQtU2xl/ZXZlLU1pZGktRHJl/c3Nlcy1mb3ItV29t/ZW4tQ2FzdWFsLUZs/b3JhbC1ULVNoaXJ0/LURyZXNzZXMtRmxv/d3ktQmVhY2gtU3Vu/ZHJlc3Mtd2l0aC1Q/b2NrZXRzX2M2OTY2/OGY1LTYyZDctNDU4/YS05ZTJhLWYwNWQ1/NmM5NTc3Yy5mOTM1/M2QzNWMwZWU0MGVl/YzA3ZTg2ZWVkYzA3/YTQ4ZC5qcGVnP29k/bkhlaWdodD04NjQm/b2RuV2lkdGg9NTc2/Jm9kbkJnPUZGRkZG/Rg", "inStock": true, "categoryIds": [11, 9, 7], "sizes": ["XS", "S", "M"] },
        { "name": "Running Performance Shoes", "color": "Neon Green", "price": 89.99, "imgURL": "https://imgs.search.brave.com/hdIM_Zeh6sOyXoIeXYdjGDk2BfJ0z3zNeDaG6XHLrnw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDcv/MTQ4LzM3Ni9zbWFs/bC9wYWlycy1vZi1i/bHVlLXNwb3J0LXNo/b2VzLWZvci1ydW5u/aW5nLW9uLWlzb2xh/dGVkLXdoaXRlLWJh/Y2tncm91bmQtcGhv/dG8uanBn", "inStock": true, "categoryIds": [1, 13], "sizes": ["M", "L"] },
        { "name": "Winter Puffer Jacket", "color": "Navy", "price": 150.00, "imgURL": "https://imgs.search.brave.com/ij1ItZRxQVIRV7BRu-a29SXxH3Cj_vGtBn5Xk7mQX0U/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFzTkZsZnhTYkwu/anBn", "inStock": true, "categoryIds": [10, 8, 6], "sizes": ["L", "XL", "XXL"] },
        { "name": "Casual Chino Pants", "color": "Beige", "price": 49.00, "imgURL": "https://imgs.search.brave.com/Nov-fOXvc3Djkm_VqpZu6k5Ie1XkXjvLCcOX_2G0paM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5ncS5jb20vcGhv/dG9zLzY2N2RjNjQ2/YmYyZjNhMjQxOWIx/MzcwYi8zOjQvd183/NDgsY19saW1pdC9E/aWNraWVzLUdRUi1D/aGlub3MtMDQ5Ny5q/cGc", "inStock": true, "categoryIds": [4, 6], "sizes": ["M", "L"] },
        { "name": "Cotton Polo Shirt", "color": "Red", "price": 29.99, "imgURL": "https://imgs.search.brave.com/QzLc_jYHTrBkr2C3omIiSB9hffJJeaAlrJjfEMeJWAg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFGOVBYZDZQUUwu/anBn", "inStock": true, "categoryIds": [15, 6], "sizes": ["S", "M", "L"] },
        { "name": "Silk Scarf", "color": "Yellow", "price": 25.00, "imgURL": "https://imgs.search.brave.com/SIOGSby7KAhhL1ZfOcrvtG6gKsu96ucSfUJyFjnpKko/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTgv/Mjk0LzY5NS9zbWFs/bC9sdXh1cmlvdXMt/c2lsay1zY2FyZi13/aXRoLWZsb3JhbC1w/YXR0ZXJuLWZsb3dp/bmctb24tYmxhY2st/YmFja2dyb3VuZC1w/aG90by5qcGc", "inStock": true, "categoryIds": [12, 7], "sizes": ["ONE_SIZE"] },
        { "name": "Denim Jacket", "color": "Light Blue", "price": 75.00, "imgURL": "https://imgs.search.brave.com/WExkBk2iMujHVaSz48oI64fZzdhLvgOqYUDoEAy0mLY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nbGFtb3VyLmNv/bS9waG90b3MvNjdi/Zjk4OGMwZDUxZDgw/YzBhZGNkYjAxLzM6/NC93Xzc0OCxjX2xp/bWl0L1VudGl0bGVk/JTIwZGVzaWduJTIw/KDMpLVBob3Rvcm9v/bS5wbmc", "inStock": false, "categoryIds": [10, 5], "sizes": ["M", "L"] },
        { "name": "Basic Cotton Socks", "color": "Grey", "price": 9.99, "imgURL": "https://imgs.search.brave.com/lXV7JNdoV5Uc9v2HgLBXPtucf733-SKg0JIlSP-e2ek/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vTmV2/RU5ELVdvbWVuLXMt/Ni1QYWlycy1QZXJm/b3JtYW5jZS1DdXNo/aW9uZWQtMTAwLUNv/dHRvbi1SdW5uaW5n/LVNwb3J0cy1UaGlu/LUxpZ2h0LVdlaWdo/dC1BbmtsZS1CcmVh/dGhhYmxlLVNvY2tz/LUNvbWZvcnQtTG93/LUN1dC1RdWFydGVy/LUF0aGxldGljLVNv/Y2tfYzJlZjAxYzkt/ODRiZS00NWM1LThm/YmMtNzFhZjc4NzVi/M2Q1LmYxZjUwZjE0/YTViZTkxMmY3YjA3/MzcyYWQ1ZmQyNWQ4/LmpwZWc_b2RuSGVp/Z2h0PTg2NCZvZG5X/aWR0aD01NzYmb2Ru/Qmc9RkZGRkZG", "inStock": true, "categoryIds": [12, 6, 7], "sizes": ["M", "L"] },
        { "name": "Graphic Print T-Shirt", "color": "Charcoal", "price": 22.00, "imgURL": "https://imgs.search.brave.com/5v0YaVoajbbpyFmF8K7Ifo6Zk8HFJtIKs63IIwCXy3c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFrVUFKQ1BvRUwu/anBn", "inStock": true, "categoryIds": [2, 6], "sizes": ["S", "M", "L", "XL"] },
        { "name": "Wool Blend Overcoat", "color": "Camel", "price": 199.00, "imgURL": "https://imgs.search.brave.com/d_q4C8a95nDe37uzq9aTcUZq2DrkxQ0hZyui1uOYax8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzcxSmJ5amJIVUhM/LmpwZw", "inStock": true, "categoryIds": [10, 8, 7], "sizes": ["S", "M", "L"] },
        { "name": "Yoga Leggings", "color": "Purple", "price": 40.00, "imgURL": "https://imgs.search.brave.com/XtxyuKFhaSRNrMmbSENkwOGg5JW2yX-K6eEWciucIUA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL3ZhZGVyLXBy/b2QuczMuYW1hem9u/YXdzLmNvbS8xNzU2/MzA4MTE2LWFtYWRh/LWJvbml0YS1sZWdn/aW5ncy1iZXN0LXlv/Z2EtbGVnZ2luZ3Mt/NjhhZjIxNDRhYzUw/Yy5wbmc_Y3JvcD0w/LjY1OHh3OjAuNzQ2/eGg7MC4xNTN4dyww/LjI1NHhoJnJlc2l6/ZT05ODA6Kg", "inStock": true, "categoryIds": [13, 7], "sizes": ["XS", "S", "M", "L"] },
        { "name": "Linen Button-Down", "color": "White", "price": 55.00, "imgURL": "https://imgs.search.brave.com/dzOv9ly5ROgUczkAR3-mGhUASOxKlv7g1EftvJoDaQA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFpS3B0WXZjeEwu/anBn", "inStock": true, "categoryIds": [15, 9, 6], "sizes": ["M", "L", "XL"] },
        { "name": "Knitted Beanie", "color": "Dark Green", "price": 15.00, "imgURL": "https://imgs.search.brave.com/X4hWJjMiFgvBDZTmQ5F9ayb0GXFaET0xmJU-ysx3D24/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTgv/MTgyLzA5NS9zbWFs/bC9jb3p5LWtuaXR0/ZWQtYmVhbmllLWhh/dC1pbi13YXJtLXRv/bmVzLWRpc3BsYXll/ZC1vbi1hLWxpZ2h0/LXN1cmZhY2Utd2l0/aC1hLXNvZnQtYmFj/a2dyb3VuZC1waG90/by5qcGc", "inStock": true, "categoryIds": [12, 8], "sizes": ["ONE_SIZE"] },
        { "name": "Leather Belt", "color": "Black", "price": 30.00, "imgURL": "https://imgs.search.brave.com/2MyCRkg6UiC-1LHgsfedOo9kQYEnTPQX2abGtGSonfk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9idXls/ZWF0aGVyb25saW5l/LmNvbS9tb2R1bGVz/L3ByZXN0YWJsb2cv/dmlld3MvaW1nL2dy/aWQtZm9yLTEtNy91/cC1pbWcvdGh1bWJf/MTIuanBnP2YxYjYw/ZWY3M2Q2NDVlZjA5/YTVkOTNkMTZhMWVi/MzRk", "inStock": true, "categoryIds": [12, 6], "sizes": ["M", "L"] },
        { "name": "Cargo Shorts", "color": "Olive", "price": 38.00, "imgURL": "https://imgs.search.brave.com/siCCYT4sJRvJoAbLgyxpFg79rHsWPUIkba4JswjgPKI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL3ZhZGVyLXBy/b2QuczMuYW1hem9u/YXdzLmNvbS8xNzUz/NDUwODgxLW1obC1i/ZXN0Y2FyZ29zaG9y/dHMtbWFja3dlbGRv/bi02OTgtNjg4Mzg5/NjIzMzFiYy5qcGc_/Y3JvcD0xeHc6MXho/O2NlbnRlcix0b3Am/cmVzaXplPTk4MDoq", "inStock": true, "categoryIds": [4, 9, 6], "sizes": ["M", "L"] },
        { "name": "Evening Gown", "color": "Emerald", "price": 250.00, "imgURL": "https://imgs.search.brave.com/n5TVqM27pIypRDMUnZRiXlxst_Bt4GoW7OYSAuqUK70/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9ibGFj/ay13b21hbi1ldmVu/aW5nLWdvd24tYmVh/dXRpZnVsLXdlYXJp/bmctYmx1ZS1kcmVz/cy1saWdodC1iYWNr/Z3JvdW5kLTMyMjE5/MjI4LmpwZw", "inStock": false, "categoryIds": [11, 7], "sizes": ["S", "M"] },
        { "name": "Canvas Sneakers", "color": "White", "price": 45.00, "imgURL": "https://imgs.search.brave.com/hyROkXOloeBYwPH-ZV884nnoKzxK__vHPOYjMqYQokw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE1/NTQ1MzIwNS9waG90/by9ibGFjay1zbmVh/a2Vycy5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9QjU2SjE3/X3FpSmhpdGRPUG5V/RWUyU3N3dzgtU1dy/ZDVFb3NUeDFoRGJt/cz0", "inStock": true, "categoryIds": [1, 9], "sizes": ["M", "L"] },
        { "name": "Rain Jacket", "color": "Yellow", "price": 65.00, "imgURL": "https://imgs.search.brave.com/sZgVxFXX8tgH4LwJlfGKDtft_RvIvMdkur6zDsVSUus/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tYXJt/b3QuaW1naXgubmV0/LzJjYTc5NmQ0LTIy/YjgtM2Q4OS1iMzI0/LTNiOTA1MmFjMWMw/NC8yY2E3OTZkNC0y/MmI4LTNkODktYjMy/NC0zYjkwNTJhYzFj/MDQuanBnP2F1dG89/Zm9ybWF0LGNvbXBy/ZXNzJnNvcnQ9MSZ3/PTUyNw", "inStock": true, "categoryIds": [10, 8], "sizes": ["M", "L", "XL"] },
        { "name": "V-Neck T-Shirt", "color": "Bordeaux", "price": 18.00, "imgURL": "https://imgs.search.brave.com/Ubrk4T1f1P0AVFibo8kSkYQkIJWwEjlY37jSE-eZ8v8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL3ZhZGVyLXBy/b2QuczMuYW1hem9u/YXdzLmNvbS8xNzEw/MzU4OTUzLU0xMTMw/Ul8wMF9iMV9zMV9h/MV8xX203NS5qcGc_/Y3JvcD0xLjAweHc6/MC42Njh4aDswLDAu/MTEyeGgmcmVzaXpl/PTk4MDoq", "inStock": true, "categoryIds": [2, 7], "sizes": ["S", "M", "L"] },
        { "name": "Sweatpants", "color": "Light Grey", "price": 35.00, "imgURL": "https://imgs.search.brave.com/K0SSj2oKWr614JjzYSSONIGEcDQTOlMP5Q3ZpKHJSmg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lZGlr/dGVkLmNvbS9jZG4v/c2hvcC9maWxlcy9F/ZGlrdGVkX0xvb2ti/b29rXzExXzI0XzIw/MjU4NzA2Ny5qcGc_/dj0xNzY1ODk4NDc2/JndpZHRoPTYwMA", "inStock": true, "categoryIds": [4, 13, 6], "sizes": ["M", "L", "XL"] },
        { "name": "Formal Blazer", "color": "Black", "price": 110.00, "imgURL": "https://imgs.search.brave.com/OsNNMF6mwCo3gHQ4zOATe_rVrYsQK_IebhRDYhlb2pw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jYW50/YWJpbHNob3AuY29t/L2Nkbi9zaG9wL2Zp/bGVzL01CWkYwMDE3/MUFfRkFXTl8yLmpw/Zz92PTE3NTk0NzEw/NzQmd2lkdGg9NTMz", "inStock": true, "categoryIds": [10, 6], "sizes": ["L", "XL"] },
        { "name": "Swim Shorts", "color": "Blue Pattern", "price": 28.00, "imgURL": "https://imgs.search.brave.com/1pdXg4PIPGs3CsgKyLfMQ8YEPQlhtcGllgqWXVbCg9A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFhY0I0cUdXdEwu/anBn", "inStock": true, "categoryIds": [9, 13, 6], "sizes": ["S", "M", "L"] },
        { "name": "Striped Jumper", "color": "Blue/White", "price": 42.00, "imgURL": "https://imgs.search.brave.com/gilS-8-zkAHSdc7fceMY5qc8XM3tIBbfYugIGGP-cOI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Yy1hbmQtYS5jb20v/aW1nL3Byb2R1Y3Qv/cV9hdXRvOmdvb2Qs/Yl9yZ2I6RkFGQUZB/LGNfc2NhbGUsd18y/NjIvdjE3NjEwNTI3/NTYvcHJvZHVjdGlt/YWdlcy8yMjQ0ODI4/LTItMDEuanBn", "inStock": true, "categoryIds": [3, 8, 7], "sizes": ["S", "M", "L"] },
        { "name": "Leather Gloves", "color": "Black", "price": 45.00, "imgURL": "https://imgs.search.brave.com/xHZa75qML5fX9PpPYKv8p4X6Vkii2aTHdEuHqxbKv7o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE4/ODk3OTAzOS9waG90/by9yZWQtbGVhdGhl/ci1nbG92ZXMuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPTZO/TVV3bS12Q0k1eks3/R0VPekg0U1N3Z3g1/czAxQzB5aDdhbXJU/amktN1E9", "inStock": true, "categoryIds": [12, 8], "sizes": ["M", "L"] },
        { "name": "Cocktail Dress", "color": "Red", "price": 85.00, "imgURL": "https://imgs.search.brave.com/kM_rJyDAGiHwJJYpEsPDctYkvbr5iYQwXYtz0irRoE8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYwLzY5/LzNlLzYwNjkzZTk1/MjI3YmQyZTI1NWM1/YTQ1NjQ4M2M2OWZl/LmpwZw", "inStock": true, "categoryIds": [11, 7], "sizes": ["XS", "S", "M"] },
        { "name": "Sports Bra", "color": "Black", "price": 32.00, "imgURL": "https://imgs.search.brave.com/gIGYT31_VVKEadHt1KqXchDuCSAMoIbEJ5ETjWznvtc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzEzMjA5MzgwL3Iv/aWwvYWIzMDk4LzEw/NjM1MTM0MjQvaWxf/MzAweDMwMC4xMDYz/NTEzNDI0XzQ1bnou/anBn", "inStock": true, "categoryIds": [13, 14, 7], "sizes": ["S", "M", "L"] },
        { "name": "Hiking Boots", "color": "Sand", "price": 140.00, "imgURL": "https://imgs.search.brave.com/T4oLHvxsTW5I4jf5f0EGiR0snF6e0k4oK0cd-8F-f8Y/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzEv/OTYyLzU1Ni9zbWFs/bC9hLXBhaXItb2Yt/aGlraW5nLWJvb3Rz/LW9uLWEtbW91bnRh/aW4tcGhvdG8uanBn", "inStock": true, "categoryIds": [1, 8], "sizes": ["M", "L"] },
        { "name": "Corduroy Pants", "color": "Tan", "price": 55.00, "imgURL": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [4, 8, 6], "sizes": ["M", "L"] },
        { "name": "Basic Tank Top", "color": "White", "price": 12.00, "imgURL": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [2, 9, 7], "sizes": ["XS", "S", "M", "L"] },
        { "name": "Zip-up Fleece", "color": "Forest Green", "price": 50.00, "imgURL": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [3, 8], "sizes": ["M", "L", "XL"] },
        { "name": "A-Line Skirt", "color": "Navy", "price": 39.00, "imgURL": "https://images.unsplash.com/photo-1582142306616-21805562d989?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [4, 7], "sizes": ["S", "M", "L"] },
        { "name": "Oxford Shirt", "color": "Light Blue", "price": 48.00, "imgURL": "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [15, 6], "sizes": ["M", "L", "XL", "XXL"] },
        { "name": "Sunglasses", "color": "Tortoise", "price": 80.00, "imgURL": "https://images.unsplash.com/photo-1511499767070-6058c3e58ac2?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [12, 9], "sizes": ["ONE_SIZE"] },
        { "name": "Ankle Socks (5-pack)", "color": "White", "price": 15.00, "imgURL": "https://images.unsplash.com/photo-1566433539591-584b1b0ca97f?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [12, 14], "sizes": ["M", "L"] },
        { "name": "Windbreaker", "color": "Silver", "price": 70.00, "imgURL": "https://images.unsplash.com/photo-1516904918416-2425226e271c?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [10, 13], "sizes": ["S", "M", "L"] },
        { "name": "Boxer Briefs", "color": "Black", "price": 22.00, "imgURL": "https://images.unsplash.com/photo-1607345366471-441729a8a27d?auto=format&fit=crop&w=500&q=60", "inStock": true, "categoryIds": [14, 6], "sizes": ["M", "L", "XL"] }
    ];

    // Mapiranje u bazu
    const createdProducts: Product[] = [];
    for (const p of rawProducts) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                color: p.color,
                price: p.price,
                imgURL: p.imgURL,
                inStock: p.inStock,
                size: p.sizes as Size[], // Direktno castanje u enum
                categories: {
                    create: p.categoryIds.map(id => ({
                        category: { connect: { id: id } }
                    }))
                }
            }
        });
        createdProducts.push(product);
    }

    // 5. KREIRANJE 4 NARUDŽBE
    console.log('📦 Kreiranje testnih narudžbi...');
    const orderStatuses = [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

    for (let i = 0; i < 4; i++) {
        // Izračun ukupne cijene na temelju proizvoda koji se dodaju ispod
        const firstProductPrice = createdProducts[i].price.toNumber() * 1;
        const secondProductPrice = createdProducts[i + 10].price.toNumber() * 2;
        const calculatedTotal = firstProductPrice + secondProductPrice;

        await prisma.order.create({
            data: {
                userId: regularUser.id,
                status: orderStatuses[i],
                IBAN: regularUser.IBAN,
                address: regularUser.address,
                county: regularUser.county,
                city: regularUser.city,
                zipCode: regularUser.zipCode,
                totalPrice: calculatedTotal, // Dodano polje za ukupnu cijenu
                products: {
                    create: [
                        {
                            productId: createdProducts[i].id,
                            quantity: 1,
                            price: createdProducts[i].price,
                            selectedSize: createdProducts[i].size[0],
                        },
                        {
                            productId: createdProducts[i + 10].id,
                            quantity: 2,
                            price: createdProducts[i + 10].price,
                            selectedSize: createdProducts[i + 10].size[0]
                        }
                    ]
                }
            }
        });
    }

    console.log('✅ Baza podataka je uspješno popunjena!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });