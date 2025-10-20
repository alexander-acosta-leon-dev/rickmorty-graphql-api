# Rick & Morty GraphQL API

A GraphQL API for querying Rick & Morty characters with filtering, caching, and database persistence.

## Features

- 🚀 **GraphQL API** with Apollo Server Express
- 🔍 **Filtering** by Status, Species, Gender, Name, and Origin
- 🗄️ **PostgreSQL Database** with Sequelize ORM
- ⚡ **Redis Caching** for improved performance
- 🛠️ **Database Migrations** for schema management
- 📊 **Request Logging** middleware
- 🐳 **Docker Support** for databases

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **GraphQL**: Apollo Server Express
- **Database**: PostgreSQL with Sequelize ORM
- **Cache**: Redis
- **Development**: ts-node-dev, ESLint, Prettier

## Quick Setup for Evaluators

### 🚀 **Fast Track Setup (5 minutes)**

```bash
# 1. Clone and install
git clone https://github.com/alexander-acosta-leon-dev/rickmorty-graphql-api.git
cd rickmorty-graphql-api
npm install

# 2. Copy environment file
cp .env.example .env
# Edit .env and set DATABASE_PASSWORD=root

# 3. Start databases with Docker
docker run --name rm-postgres-docker -e POSTGRES_PASSWORD=root -e POSTGRES_DB=rickmorty -p 5433:5432 -d postgres:13
docker run --name rm-redis -p 6379:6379 -d redis

# 4. Setup database
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# 5. Run tests
npm test

# 6. Start server
npm run dev
# Visit: http://localhost:4000/graphql
```

### ✅ **Verification Checklist**

- [ ] Server starts without errors
- [ ] Tests pass (6/6)
- [ ] GraphQL Playground accessible
- [ ] Character filtering works
- [ ] Cache logging appears in console

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd rickmorty-api
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Default values should work for local development
```

### 3. Start Databases

```bash
# Start PostgreSQL
docker run --name rm-postgres-docker -e POSTGRES_PASSWORD=root -e POSTGRES_DB=rickmorty -p 5433:5433 -d postgres

# Start Redis
docker run --name rm-redis -p 6379:6379 -d redis
```

### 4. Run Migrations and Seed Data

```bash
# Run database migrations
npx sequelize-cli db:migrate

# Seed with 15 Rick & Morty characters
npx sequelize-cli db:seed:all
```

### 5. Start Development Server

```bash
npm run dev
```

The GraphQL playground will be available at: `http://localhost:4000/graphql`

## Environment Variables

| Variable            | Description              | Default                  | Required |
| ------------------- | ------------------------ | ------------------------ | -------- |
| `PORT`              | Server port              | `4000`                   | No       |
| `DATABASE_HOST`     | PostgreSQL host          | `localhost`              | Yes      |
| `DATABASE_PORT`     | PostgreSQL port          | `5433`                   | Yes      |
| `DATABASE_USER`     | PostgreSQL username      | `postgres`               | Yes      |
| `DATABASE_PASSWORD` | PostgreSQL password      | -                        | Yes      |
| `DATABASE_NAME`     | PostgreSQL database name | `rickmorty`              | Yes      |
| `REDIS_URL`         | Redis connection URL     | `redis://localhost:6379` | Yes      |

## Database Schema

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────┐
│                characters               │
├─────────────────────────────────────────┤
│ id          INTEGER (PK, Auto-increment)│
│ name        VARCHAR                     │
│ status      VARCHAR                     │
│ species     VARCHAR                     │
│ gender      VARCHAR                     │
│ origin_name VARCHAR                     │
│ image       VARCHAR                     │
└─────────────────────────────────────────┘
```

### Field Descriptions

| Field         | Type    | Description                         | Example Values                |
| ------------- | ------- | ----------------------------------- | ----------------------------- |
| `id`          | INTEGER | Primary key, auto-increment         | 1, 2, 3                       |
| `name`        | VARCHAR | Character's full name               | "Rick Sanchez", "Morty Smith" |
| `status`      | VARCHAR | Character's life status             | "Alive", "Dead", "unknown"    |
| `species`     | VARCHAR | Character's species                 | "Human", "Alien"              |
| `gender`      | VARCHAR | Character's gender                  | "Male", "Female", "unknown"   |
| `origin_name` | VARCHAR | Name of character's origin location | "Earth C-137", "Abadango"     |
| `image`       | VARCHAR | URL to character's image            | "https://..."                 |

### Database Constraints

- **Primary Key**: `id` (auto-increment)
- **No Foreign Keys**: Single table design for simplicity
- **No Timestamps**: Disabled for this use case
- **All Fields Required**: No NULL values allowed

## Example GraphQL Queries

### Get All Characters

```graphql
query {
  characters {
    id
    name
    status
    species
    gender
    originName
    image
  }
}
```

### Filter by Status

```graphql
query {
  characters(filter: { status: "Alive" }) {
    name
    status
    species
  }
}
```

### Filter by Gender and Species

```graphql
query {
  characters(filter: { gender: "Male", species: "Human" }) {
    name
    gender
    species
    originName
  }
}
```

### Search by Name

```graphql
query {
  characters(filter: { name: "Rick" }) {
    name
    status
    originName
  }
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite with Jest
- `npx sequelize-cli db:migrate` - Run database migrations
- `npx sequelize-cli db:seed:all` - Seed database with characters
- `npx sequelize-cli db:seed:undo:all` - Remove seeded data

## Project Structure

```
src/
├── config/
│   └── env.ts                # Environment configuration
├── db/
│   └── sequelize.ts          # Database connection
├── graphql/
│   ├── schemas/
│   │   └── characterSchema.ts # GraphQL schema definitions
│   ├── resolvers/
│   │   └── characterResolver.ts # GraphQL resolvers with caching
│   └── index.ts              # GraphQL schema composition
├── middleware/
│   └── logger.ts             # Request logging middleware
├── migrations/               # Database migrations
├── models/
│   └── character.ts          # Sequelize models
├── seeders/                  # Database seeders
├── services/
│   ├── redisService.ts       # Redis connection and operations
│   ├── cronJob.ts            # Automated data synchronization
│   └── characterSyncService.ts # Rick & Morty API sync logic
├── tests/
│   ├── character.test.ts     # Comprehensive GraphQL tests
│   └── setup.ts              # Test environment configuration
├── utils/
│   └── logExecutionTime.ts   # Performance monitoring decorator
└── index.ts                  # Main server file
```

## Performance Features

- **Redis Caching**: Query results are cached for 5 minutes with automatic cache key generation
- **Request Logging**: All HTTP requests are logged with [INFO] structured format
- **Performance Monitoring**: GraphQL resolvers include execution time tracking with @LogExecutionTime decorator
- **Automated Data Sync**: Cron job runs every 12 hours to sync with external Rick & Morty API

### Cache Behavior

- Cache keys are generated from query filters (e.g., `characters:{"status":"Alive"}`)
- Cache misses are logged as `[INFO] Cache MISS - fetching from database`
- Cache hits retrieve data instantly without database queries
- Cache TTL: 5 minutes (300 seconds)

### Performance Monitoring

The API includes detailed performance logging:

```
Execution time for findCharacters: 8ms
[INFO] Cache MISS - fetching from database for: characters:{}
```

This helps monitor query performance and cache effectiveness.

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Tests will automatically:
# - Create test database (rickmorty_test)
# - Run comprehensive GraphQL query tests
# - Test all filtering options (status, species, gender, name)
# - Validate cache behavior and performance logging
```

### Test Database Setup

The test suite requires a separate test database:

```bash
# Create test database (automatically handled by tests)
docker exec -it rm-postgres-docker psql -U postgres -c "CREATE DATABASE rickmorty_test;"
```

### Test Coverage

- ✅ GraphQL character queries (all characters)
- ✅ Filtering by name, status, species, gender
- ✅ Empty result handling
- ✅ Cache behavior validation
- ✅ Performance monitoring integration

## Development

### Adding New Characters

To add more characters manually, modify the seeder file in `src/seeders/` and run:

```bash
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all
```

### Automated Data Synchronization

The API includes automated syncing with the external Rick & Morty API:

- **Schedule**: Runs every 12 hours automatically
- **Source**: [Rick and Morty API](https://rickandmortyapi.com/)
- **Logs**: `Cron job scheduled: runs every 12 hours`
- **Purpose**: Keeps character data up-to-date with the official API

### Cache Management

Cache keys are automatically generated based on query filters. Cache TTL is set to 5 minutes by default.

```bash
# Cache key examples:
# characters:{} - All characters
# characters:{"status":"Alive"} - Filtered by status
# characters:{"name":"Rick"} - Filtered by name
```

## Docker Commands

```bash
# View running containers
docker ps

# Stop databases
docker stop rm-postgres-docker rm-redis

# Remove containers
docker rm rm-postgres-docker rm-redis

# View logs
docker logs rm-postgres-docker
docker logs rm-redis
```
