#!/usr/bin/env bash
# Запуск PostgreSQL и применение схемы
set -euo pipefail

cd "$(dirname "$0")"

# Удаление старого контейнера, если он существует
if docker ps -a --format '{{.Names}}' | grep -q '^digihub-db$'; then
  echo "Удаляю старый контейнер digihub-db..."
  docker rm -f digihub-db
fi

# Запуск контейнера PostgreSQL
echo "Запускаю контейнер PostgreSQL..."
docker run --name digihub-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=digihub -p 5432:5432 -d postgres:13

echo "Ожидание PostgreSQL..."
start_time=$(date +%s)
while ! docker exec digihub-db pg_isready -U postgres > /dev/null 2>&1; do
  # таймаут 30 секунд
  if [ $(( $(date +%s) - start_time )) -gt 30 ]; then
    echo "ERROR: Не удалось запустить Postgres за 30 секунд"
    echo "Статус контейнера:" 
    docker ps -a --filter "name=digihub-db" --format "{{.Names}}\t{{.Status}}"
    echo "Логи контейнера:" 
    docker logs digihub-db
    exit 1
  fi
  sleep 1
done

echo "Применяю схему базы данных внутри контейнера PostgreSQL..."
docker exec -i digihub-db psql -U postgres -d digihub < database/schema.sql

echo "База данных готова."
echo "Порты контейнера digihub-db:"
docker ps --filter "name=digihub-db" --format "table {{.Names}}\t{{.Ports}}"
