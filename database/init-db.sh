#!/bin/bash

# Initialize Database from Schema
# This script drops the existing database and recreates it from schema.sql

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Database Initialization Script${NC}"
echo "This will DROP and RECREATE the database!"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL is not set${NC}"
    echo "Please set DATABASE_URL environment variable"
    exit 1
fi

# Extract database name from URL
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$DB_NAME" ]; then
    echo -e "${RED}Error: Could not extract database name from DATABASE_URL${NC}"
    exit 1
fi

echo "Database: $DB_NAME"
echo ""

# Confirm before proceeding
read -p "Are you sure you want to DROP and RECREATE the database? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo -e "${YELLOW}Operation cancelled${NC}"
    exit 0
fi

echo -e "${YELLOW}Dropping database...${NC}"
# Drop database using docker exec
docker exec -i hiwwer-postgres psql -U hiwwer_user -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo -e "${YELLOW}Creating database...${NC}"
docker exec -i hiwwer-postgres psql -U hiwwer_user -d postgres -c "CREATE DATABASE $DB_NAME;"

echo -e "${YELLOW}Applying schema...${NC}"
docker exec -i hiwwer-postgres psql -U hiwwer_user -d $DB_NAME < database/schema.sql

echo -e "${GREEN}✓ Database initialized successfully!${NC}"
echo ""
echo "You can now start the application."