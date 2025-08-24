# Database Migration Guide

This project uses TypeORM migrations for database schema management.

## Quick Setup (Fresh Database)

For a fresh database setup, simply run:

```bash
npm run setup
```

This will:
1. Install dependencies
2. Build the project
3. Run all migrations
4. Seed initial data

## Manual Migration Commands

### Run Migrations
```bash
npm run migration:run
```

### Create New Migration
```bash
npm run migration:create src/migrations/YourMigrationName
```

### Generate Migration from Entity Changes
```bash
npm run migration:generate src/migrations/YourMigrationName
```

### Revert Last Migration
```bash
npm run migration:revert
```

### Show Migration Status
```bash
npm run migration:show
```

### Seed Database
```bash
npm run seed
```

## Migration Files

All migrations are located in `src/migrations/` and follow TypeORM's migration interface:

- `001_initial_schema.ts` - Creates all base tables (users, biodata, favorites, profile_views)
- `002_add_biodata_approval_system.ts` - Adds the two-column approval system for biodata

## Default Accounts

After seeding, these accounts will be available:

| Role | Email | Mobile | Password |
|------|-------|--------|----------|
| Super Admin | razibmahmud50@gmail.com | 01700000000 | 123456 |
| Admin | admin@example.com | 01900000000 | 123456 |
| User | user@example.com | 01800000000 | 123456 |

## Database Configuration

Update your `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=Finder
```

## Important Notes

- **Synchronize is disabled** in production mode to prevent accidental schema changes
- Always create migrations for schema changes instead of relying on synchronize
- Test migrations on a copy of production data before applying to production
- Keep migration files in version control
- Never modify existing migration files that have been run in production

## Troubleshooting

### Migration Table Not Found
If you get "relation 'migrations' does not exist", run:
```bash
npm run migration:run
```

### Connection Issues
1. Ensure PostgreSQL is running
2. Check your `.env` file credentials
3. Verify the database exists: `CREATE DATABASE "Finder";`

### Schema Sync Issues
If you need to sync with existing database:
1. Backup your data
2. Drop and recreate the database
3. Run `npm run setup`