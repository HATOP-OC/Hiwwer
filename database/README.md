# Database Schema Documentation

## Overview
This directory contains the database schema and migrations for the Hiwwer platform.

## Files

### schema.sql
The complete database schema including:
- All table definitions
- Indexes
- Triggers and functions
- Initial seed data for categories, tags, and policies

**Usage:**
```bash
# Create a fresh database from schema
psql $DATABASE_URL -f database/schema.sql
```

### Migrations
Migration files are numbered sequentially and should be applied in order:

1. **001_add_is_performer.sql** - Adds `is_performer` field to users table
2. **002_add_policies_table.sql** - Creates policies table for Terms of Service and Privacy Policy
3. **003_insert_policies_data.sql** - Inserts initial policy content

**Apply migrations:**
```bash
# Apply a specific migration
psql $DATABASE_URL -f database/migrations/001_add_is_performer.sql

# Or using Docker
docker exec -i hiwwer-postgres psql -U hiwwer_user -d hiwwer_db -f /path/to/migration.sql
```

## Schema Updates

When making schema changes:

1. Create a new migration file in `migrations/` directory
2. Apply the migration to your development database
3. Update `schema.sql` to reflect the current state
4. Test the schema by creating a fresh database:
   ```bash
   # Drop and recreate test database
   psql $DATABASE_URL -c "DROP DATABASE IF EXISTS hiwwer_test;"
   psql $DATABASE_URL -c "CREATE DATABASE hiwwer_test;"
   psql postgresql://user:pass@host/hiwwer_test -f database/schema.sql
   ```

## Current Schema

### Main Tables
- **users** - User accounts (clients, performers, admins)
- **services** - Services offered by performers
- **orders** - Client orders and bookings
- **messages** - Chat messages between users
- **reviews** - Service reviews and ratings
- **payments** - Payment transactions
- **disputes** - Dispute resolution system
- **notifications** - User notifications
- **policies** - Terms of Service and Privacy Policy (multilingual)

### Supporting Tables
- **service_categories** - Service categorization
- **tags** - Service tags
- **service_tags** - Many-to-many relationship
- **service_images** - Service image gallery
- **order_attachments** - Order file attachments
- **order_additional_options** - Optional service add-ons
- **order_status_history** - Order status tracking
- **message_attachments** - Chat file attachments
- **dispute_messages** - Dispute chat messages
- **dispute_message_attachments** - Dispute file attachments
- **websocket_connections** - Active WebSocket connections
- **ai_chat_history** - AI assistant chat logs
- **telegram_linking_codes** - Telegram account linking
- **admin_settings** - System configuration

## Policy Management

The `policies` table stores multilingual content for legal pages:
- Terms of Service (`terms-of-service`)
- Privacy Policy (`privacy-policy`)

Each policy has:
- `slug` - URL-friendly identifier
- `language_code` - Language (en, uk)
- `title` - Display title
- `content` - Plain text content
- `content_markdown` - Markdown formatted content

**Query policies:**
```sql
-- Get Terms of Service in Ukrainian
SELECT * FROM policies 
WHERE slug = 'terms-of-service' AND language_code = 'uk';

-- Get all policies
SELECT slug, language_code, title 
FROM policies 
ORDER BY slug, language_code;
```

## Backup and Restore

**Backup:**
```bash
# Full database backup
pg_dump $DATABASE_URL > backup.sql

# Schema only
pg_dump --schema-only $DATABASE_URL > schema_backup.sql

# Data only
pg_dump --data-only $DATABASE_URL > data_backup.sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup.sql
```

## Notes

- All tables use UUID for primary keys
- Timestamps use `TIMESTAMP WITH TIME ZONE`
- Foreign keys have `ON DELETE CASCADE` where appropriate
- Indexes are created for frequently queried columns
- Triggers automatically update `updated_at` columns
