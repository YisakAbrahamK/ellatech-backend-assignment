# Ellatech Backend Assignment

Inventory-focused REST API built with NestJS, TypeORM, PostgreSQL, and Swagger. It manages users, products, and stock-change transactions while keeping the codebase modular and testable. 

## Features at a Glance

- CRUD-lite flows for users and products
- Transaction logging (purchase vs sale) performed within DB transactions and row-level locks
- Request validation + auto-generated Swagger docs at `http://localhost:3000/api/doc`
- Health check endpoint with database connectivity monitoring
- Ready-to-run Docker Compose stack with hot reloading tuned for Windows/WSL

## Tech Stack

- NestJS 11
- TypeORM 0.3 + PostgreSQL
- Class-validator / class-transformer
- Swagger UI + DocumentBuilder
- Testing via Jest + Supertest

## Prerequisites

- Node.js 20+ and PNPM 9+ (see `package.json` scripts)
- PostgreSQL 14+ (local or via Docker)
- Optional: Docker Desktop for the provided compose workflow

## Quickstart

```bash
pnpm install
pnpm run start:dev
# visit http://localhost:3000/api and http://localhost:3000/api/doc
```

### Environment Variables

| Name          | Default     | Purpose         |
| ------------- | ----------- | --------------- |
| `PORT`        | `3000`      | API listen port |
| `DB_HOST`     | `localhost` | PostgreSQL host |
| `DB_PORT`     | `5432`      | PostgreSQL port |
| `DB_USER`     | `postgres`  | DB user         |
| `DB_PASSWORD` | `postgres`  | DB password     |
| `DB_NAME`     | `ellatech`  | DB schema name  |

Create a `.env` file (gitignored) to override these values before running locally or in CI.

### Useful Scripts

```bash
pnpm run start       # one-off dev server
pnpm run start:dev   # watch mode with polling (preferred locally)
pnpm run start:prod  # run the compiled dist build
pnpm run build       # tsc build output -> dist/
pnpm run lint        # eslint across src + test
pnpm run format      # prettier write
```

### Docker Workflow

```powershell
docker compose up -d --build
docker compose logs -f api
```

The compose file enables file-watcher polling (`CHOKIDAR_USEPOLLING`, `WATCHPACK_POLLING`) and mounts `node_modules` inside the container to keep hot reloads reliable on Windows bind mounts. Use `docker compose down -v` to reset local volumes if Postgres credentials change.

## Testing & Quality Gates

```bash
pnpm run test       # unit tests
pnpm run test:e2e   # end-to-end flow (Supertest)
pnpm run test:cov   # coverage summary
```

Validation is enforced globally through Nest’s `ValidationPipe` (whitelist + forbid non-whitelisted fields), so tests expect DTOs to be trimmed automatically.

## API Reference

All endpoints are prefixed with `/api`.

| Method | Path                                  | Description                                                                      |
| ------ | ------------------------------------- | -------------------------------------------------------------------------------- |
| `GET`  | `/api`                                | Returns API metadata including version, environment, and available endpoints.    |
| `GET`  | `/api/health`                         | Full system health check with database connectivity and uptime information.      |
| `POST` | `/api/users`                          | Create a user (`CreateUserDto`); rejects duplicate emails.                       |
| `GET`  | `/api/users`                          | List all users.                                                                  |
| `POST` | `/api/products`                       | Create a product with name, SKU, price, quantity.                                |
| `PUT`  | `/api/products/adjust`                | Atomically adjust stock. Positive delta records a `PURCHASE`, negative a `SALE`. |
| `GET`  | `/api/products/status/:productId`     | Fetch latest quantity + price data by UUID.                                      |
| `GET`  | `/api/transactions`                   | Reverse-chronological feed of all stock transactions.                            |

Use Swagger at `/api/doc` for interactive schemas, examples, and try-it-out tooling.

## Project Structure

```
src/
  app.module.ts          # Root wiring (Config, TypeORM, Swagger bootstrap)
  data-source.ts         # DataSource factory w/ Postgres defaults
  products/              # Product entity + service + controller + DTOs
  transactions/          # Transaction entity/service/controller
  users/                 # User entity/service/controller
  main.ts                # Nest bootstrap + validation + Swagger setup
test/
  app.e2e-spec.ts        # Supertest smoke of root endpoint
```

TypeORM `synchronize` is enabled for convenience.

## Troubleshooting

- **Hot reload misses changes in Docker** → Ensure Docker Desktop file-sharing includes the repo path and keep the polling env vars enabled.
- **`psql` cannot connect** → Confirm the Postgres service is running (`docker compose ps`) and credentials match `.env`.

## Next Steps / Ideas

- Hash user passwords before saving and omit them from responses.
- Add pagination & filters to `/transactions` (DTO already exists).

---

Maintained as part of the Ellatech interview assignment.
