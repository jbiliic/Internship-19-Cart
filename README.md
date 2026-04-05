# DOM19 E-commerce Monorepo

Full-stack e-commerce application built as a monorepo with:

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: React + TypeScript + Vite
- Orchestration: Turborepo workspaces
- Containerization: Docker + Docker Compose

## Project Structure

- `apps/be`: NestJS API, Prisma schema/migrations/seed
- `apps/fe`: React storefront/admin frontend
- `docker-compose.yaml`: DB + backend + frontend services
- `Dockerfile`: multi-stage build for backend and frontend runtime images

## Requirements

- Node.js 22+
- npm 11+
- Docker (optional, but recommended for PostgreSQL and full stack)

## Environment Setup

1. Create your local environment file:

```bash
cp .env.example .env
```

2. Fill in values in `.env`.

Required variables:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `JWT_SECRET_KEY`
- `CORS_ORIGIN` (can be a comma-separated list)
- `DATABASE_URL`

Example `DATABASE_URL` for local Docker Postgres (port `5433`):

```env
DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5433/POSTGRES_DB
```

## Quick Start (Local Dev)

1. Install dependencies (root + workspaces):

```bash
npm install
```

2. Start PostgreSQL only:

```bash
docker compose up -d db
```

3. Run migrations and seed data:

```bash
cd apps/be
npx prisma migrate deploy
npx prisma db seed
cd ../..
```

4. Start backend + frontend in dev mode:

```bash
npm run dev
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend API + Swagger: http://localhost:3000/api

## Run Entire Stack With Docker

```bash
docker compose up --build
```

Services:

- Frontend (nginx): http://localhost:5173
- Backend (NestJS): http://localhost:3000
- PostgreSQL: localhost:5433

On container startup, backend runs Prisma migrations and seeding automatically.

## Scripts (Root)

- `npm run dev`: run all workspace dev tasks via Turborepo
- `npm run build`: build all workspaces
- `npm run start:be`: start backend dev server only
- `npm run start:fe`: start frontend dev server only
- `npm run start`: run backend + frontend concurrently

## Backend Useful Commands

Run from `apps/be`:

```bash
npm run test
npm run test:cov
npm run lint
```

Prisma examples:

```bash
npx prisma migrate dev --name your_migration_name
npx prisma db seed
```

## Seeded Test Accounts

After `npx prisma db seed`, these users are created:

- Admin: `admin@gmail.com` / `admin1`
- User: `user@gmail.com` / `user12`

## Notes

- Backend applies global prefix `/api`.
- Frontend Vite dev server proxies `/api` to `http://localhost:3000`.
- Swagger UI is served at `/api`.
