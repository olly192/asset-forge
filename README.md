# Asset Forge

## Creating a Docker image
1. Clone the repository
```bash
git clone https://github.com/olly192/asset-forge.git
```
2. Change directory to the repository
```bash
cd asset-forge
```
3. Install the required packages
```bash
bun install
```
4. Build the application
```bash
bun run build
```
5. Build the Docker image
```bash
docker build -t olly192:asset-forge .
```
6. Run the Docker compose file
```bash
docker compose up -d
```

## Setting Up the Production Database
```bash
bunx prisma migrate diff \
--from-empty
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql
bunx primsa migrate deploy
```

## TODO
- Bookings
- Recurring bookings
