#!/usr/bin/env bash
# Скрипт для запуску React фронтенду з Vite
set -euo pipefail

echo "===== Запуск фронтенду Hiwwer ====="

# Перевірка наявності Node.js та npm
if ! command -v node &> /dev/null; then
    echo "ПОМИЛКА: Node.js не встановлено. Встановіть Node.js для продовження."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "ПОМИЛКА: npm не встановлено. Встановіть npm для продовження."
    exit 1
fi

# Встановлення залежностей
if [ ! -d "node_modules" ]; then
    echo "Встановлення залежностей..."
    npm install
fi

# Перевірка наявності .env файлу
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Створення .env файлу з .env.example..."
        cp .env.example .env
        echo "ПОПЕРЕДЖЕННЯ: Перевірте та оновіть налаштування в .env файлі"
    else
        echo "ПОПЕРЕДЖЕННЯ: .env файл не знайдено. Створіть його для правильного налаштування."
    fi
fi

# Запуск dev сервера
echo "Запуск Vite dev сервера..."
echo "Фронтенд буде доступний за адресою: http://localhost:5173"

# Експорт змінних оточення для Vite
export VITE_APP_NAME="Hiwwer"
export VITE_API_URL="http://localhost:8000"

npm run dev
