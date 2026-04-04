FROM node:22-alpine AS base
WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package.json package-lock.json ./
COPY apps/be/package.json apps/be/package.json
COPY apps/fe/package.json apps/fe/package.json

RUN npm ci

FROM base AS be-build
COPY . .

RUN cd apps/be && npx prisma generate
RUN npm run --workspace be build
RUN ls /app/apps/be/dist/

FROM node:22-alpine AS be-runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=be-build /app/node_modules ./node_modules
COPY --from=be-build /app/package.json ./package.json
COPY --from=be-build /app/package-lock.json ./package-lock.json
COPY --from=be-build /app/apps/be/package.json ./apps/be/package.json
COPY --from=be-build /app/apps/be/dist ./apps/be/dist
COPY --from=be-build /app/apps/be/src/config/prisma ./apps/be/src/config/prisma
COPY --from=be-build /app/apps/be/prisma.config.ts ./apps/be/prisma.config.ts

EXPOSE 3000

CMD ["sh", "-c", "cd apps/be && npx prisma migrate deploy && npx prisma db seed && node dist/src/main"]

FROM base AS fe-build
COPY . .

RUN npm run --workspace fe build

FROM nginx:1.27-alpine AS fe-runtime
COPY apps/fe/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=fe-build /app/apps/fe/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]