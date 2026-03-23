import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
    schema: "src/config/prisma/schema.prisma",
    migrations: {
        path: "src/config/prisma/migrations",
    },
    datasource: {
        url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/dom19",
    },
});