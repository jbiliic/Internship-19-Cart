// be/prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import { expand } from "dotenv-expand";

const myEnv = dotenv.config();
expand(myEnv);

export default defineConfig({
    schema: "src/config/prisma/schema.prisma",
    migrations: {
        path: "src/config/prisma/migrations",
    },
    // This is where Migrate 7 looks for the connection now:
    datasource: {
        url: process.env.DATABASE_URL!,
    },
});