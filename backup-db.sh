#!/bin/bash

# Скрипт для створення автоматичних бекапів бази даних
# Використання: ./backup-db.sh [manual|auto]

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функція для виводу кольорових повідомлень
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Перевірка, чи встановлено необхідні утиліти
check_requirements() {
    log_info "Перевірка необхідних утиліт..."
    
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump не встановлено. Встановіть PostgreSQL client tools."
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl не встановлено. Встановіть curl."
        exit 1
    fi
    
    log_info "Всі необхідні утиліти встановлені."
}

# Завантаження змінних середовища
load_env() {
    log_info "Завантаження конфігурації..."
    
    if [ -f "server/.env" ]; then
        source server/.env
    elif [ -f ".env" ]; then
        source .env
    else
        log_warn "Файл .env не знайдено. Використовуються значення за замовчуванням."
    fi
    
    # Значення за замовчуванням
    DATABASE_URL=${DATABASE_URL:-"postgresql://hiwwer_user:hiwwer_password@localhost:5432/hiwwer_db"}
    BACKUP_DIR=${BACKUP_DIR:-"./server/backups"}
    MAX_BACKUPS=${MAX_BACKUPS:-10}
}

# Створення директорії для бекапів
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        log_info "Створення директорії для бекапів: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

# Функція для створення бекапу через API
create_backup_via_api() {
    log_info "Створення бекапу через API..."
    
    # Отримуємо токен адміністратора (якщо потрібно)
    local token=""
    if [ ! -z "$ADMIN_TOKEN" ]; then
        token="$ADMIN_TOKEN"
    else
        log_warn "ADMIN_TOKEN не встановлено. Спробуємо створити бекап без токена."
    fi
    
    # Викликаємо API endpoint
    local response=$(curl -s -X POST "http://localhost:3000/v1/admin/database/backup" \
        -H "Content-Type: application/json" \
        ${token:+-H "Authorization: Bearer $token"} \
        -w "HTTP_CODE:%{http_code}")
    
    local http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
    local body=$(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')
    
    if [ "$http_code" = "200" ]; then
        local filename=$(echo "$body" | grep -o '"filename":"[^"]*"' | cut -d'"' -f4)
        log_info "Бекап створено успішно: $filename"
        return 0
    else
        log_error "Помилка створення бекапу через API (HTTP $http_code): $body"
        return 1
    fi
}

# Функція для створення бекапу напряму
create_backup_direct() {
    log_info "Створення бекапу напряму..."
    
    # Парсимо DATABASE_URL
    local db_url="$DATABASE_URL"
    local username=$(echo "$db_url" | sed 's|.*://\([^:]*\):.*|\1|')
    local password=$(echo "$db_url" | sed 's|.*://[^:]*:\([^@]*\)@.*|\1|')
    local host=$(echo "$db_url" | sed 's|.*@\([^:]*\):.*|\1|')
    local port=$(echo "$db_url" | sed 's|.*:\([0-9]*\)/.*|\1|')
    local dbname=$(echo "$db_url" | sed 's|.*/\([^?]*\).*|\1|')
    
    # Створюємо ім'я файлу з часовою міткою
    local timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
    local filename="backup_${timestamp}.sql"
    local filepath="$BACKUP_DIR/$filename"
    
    log_info "Створення бекапу: $filename"
    
    # Експортуємо пароль для pg_dump
    export PGPASSWORD="$password"
    
    # Створюємо бекап
    if pg_dump -h "$host" -p "$port" -U "$username" -d "$dbname" \
        --clean --create --if-exists > "$filepath"; then
        log_info "Бекап створено успішно: $filepath"
        
        # Показуємо розмір файлу
        local size=$(du -h "$filepath" | cut -f1)
        log_info "Розмір бекапу: $size"
        
        # Очищуємо пароль
        unset PGPASSWORD
        
        return 0
    else
        log_error "Помилка створення бекапу"
        unset PGPASSWORD
        return 1
    fi
}

# Функція для очищення старих бекапів
cleanup_old_backups() {
    log_info "Очищення старих бекапів (залишаємо останні $MAX_BACKUPS)..."
    
    # Знаходимо всі файли бекапів та сортуємо їх за датою (найновіші перші)
    local backup_files=$(ls -t "$BACKUP_DIR"/backup_*.sql 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)))
    
    if [ ! -z "$backup_files" ]; then
        echo "$backup_files" | while read -r file; do
            log_info "Видаляємо старий бекап: $(basename "$file")"
            rm -f "$file"
        done
    else
        log_info "Немає старих бекапів для видалення."
    fi
}

# Функція для показу статистики бекапів
show_backup_stats() {
    log_info "Статистика бекапів:"
    
    local backup_count=$(ls -1 "$BACKUP_DIR"/backup_*.sql 2>/dev/null | wc -l)
    local total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    
    echo "  Кількість бекапів: $backup_count"
    echo "  Загальний розмір: ${total_size:-0}"
    
    if [ $backup_count -gt 0 ]; then
        echo "  Останні бекапи:"
        ls -lt "$BACKUP_DIR"/backup_*.sql 2>/dev/null | head -5 | while read -r line; do
            local filename=$(echo "$line" | awk '{print $9}')
            local date=$(echo "$line" | awk '{print $6, $7, $8}')
            local size=$(echo "$line" | awk '{print $5}')
            echo "    $(basename "$filename") - $date ($size bytes)"
        done
    fi
}

# Головна функція
main() {
    local mode=${1:-"manual"}
    
    log_info "Запуск скрипту бекапу (режим: $mode)"
    
    check_requirements
    load_env
    create_backup_dir
    
    # Створюємо бекап
    if [ "$mode" = "api" ]; then
        create_backup_via_api
    else
        create_backup_direct
    fi
    
    # Очищуємо старі бекапи
    cleanup_old_backups
    
    # Показуємо статистику
    show_backup_stats
    
    log_info "Скрипт бекапу завершено успішно!"
}

# Обробка сигналів
trap 'log_error "Скрипт перервано користувачем"; exit 130' INT TERM

# Перевірка аргументів
case "${1:-manual}" in
    manual|auto|api)
        main "$1"
        ;;
    --help|-h)
        echo "Використання: $0 [manual|auto|api]"
        echo ""
        echo "Режими:"
        echo "  manual  - Ручне створення бекапу (за замовчуванням)"
        echo "  auto    - Автоматичне створення бекапу (для cron)"
        echo "  api     - Створення бекапу через API"
        echo ""
        echo "Змінні середовища:"
        echo "  DATABASE_URL    - URL підключення до бази даних"
        echo "  BACKUP_DIR      - Директорія для зберігання бекапів"
        echo "  MAX_BACKUPS     - Максимальна кількість бекапів для зберігання"
        echo "  ADMIN_TOKEN     - Токен адміністратора для API режиму"
        ;;
    *)
        log_error "Невідомий режим: $1"
        echo "Використайте $0 --help для допомоги"
        exit 1
        ;;
esac
