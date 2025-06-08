#!/usr/bin/env bash
# Скрипт для запуску та налаштування бази даних PostgreSQL
set -euo pipefail

echo "===== Запуск PostgreSQL бази даних ====="

# Перевірка наявності Docker
if ! command -v docker &> /dev/null; then
    echo "ПОМИЛКА: Docker не встановлено. Встановіть Docker для продовження."
    exit 1
fi

# Зупинка та видалення існуючого контейнера (якщо існує)
if docker ps -a --format 'table {{.Names}}' | grep -q '^hiwwer-postgres$'; then
    echo "Зупинка існуючого контейнера PostgreSQL..."
    docker stop hiwwer-postgres || true
    docker rm hiwwer-postgres || true
fi

# Запуск нового контейнера PostgreSQL
echo "Запуск нового контейнера PostgreSQL..."
docker run -d \
    --name hiwwer-postgres \
    -e POSTGRES_DB=hiwwer_db \
    -e POSTGRES_USER=hiwwer_user \
    -e POSTGRES_PASSWORD=hiwwer_password \
    -p 5432:5432 \
    -v hiwwer_postgres_data:/var/lib/postgresql/data \
    postgres:15

# Очікування запуску бази даних
echo "Очікування запуску PostgreSQL..."
sleep 10

# Перевірка підключення до бази даних
echo "Перевірка підключення до бази даних..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec hiwwer-postgres pg_isready -U hiwwer_user -d hiwwer_db > /dev/null 2>&1; then
        echo "PostgreSQL готова до роботи!"
        break
    fi
    
    echo "Спроба $attempt/$max_attempts: очікування готовності PostgreSQL..."
    sleep 2
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    echo "ПОМИЛКА: PostgreSQL не запустилася протягом очікуваного часу"
    exit 1
fi

# Імпорт схеми, якщо її ще не застосовано
if docker exec hiwwer-postgres psql -U hiwwer_user -d hiwwer_db -tAc "SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='users'" | grep -q 1; then
  echo "Схема вже застосована, пропускаємо імпорт." 
else
  if [ -f "database/schema.sql" ]; then
    echo "Застосування схеми бази даних..."
    docker exec -i hiwwer-postgres psql -U hiwwer_user -d hiwwer_db < database/schema.sql
    echo "Схема бази даних успішно застосована!"
  else
    echo "ПОПЕРЕДЖЕННЯ: Файл schema.sql не знайдено в папці database/"
  fi
fi

echo "===== База даних PostgreSQL готова до роботи ====="
echo "Підключення: postgresql://hiwwer_user:hiwwer_password@localhost:5432/hiwwer_db"
