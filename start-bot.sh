#!/usr/bin/env bash
# Скрипт для запуску Telegram бота
set -euo pipefail

echo "===== Запуск Telegram бота Hiwwer ====="

# Перехід до папки з ботом
cd telegram_bot

# Перевірка наявності Python
if ! command -v python3 &> /dev/null; then
    echo "ПОМИЛКА: Python3 не встановлено. Встановіть Python3 для продовження."
    exit 1
fi

# Перевірка наявності pip
if ! command -v pip3 &> /dev/null; then
    echo "ПОМИЛКА: pip3 не встановлено. Встановіть pip3 для продовження."
    exit 1
fi

# Створення віртуального оточення (якщо не існує)
if [ ! -d "venv" ]; then
    echo "Створення віртуального оточення Python..."
    python3 -m venv venv
fi

# Активація віртуального оточення
echo "Активація віртуального оточення..."
source venv/bin/activate

# Встановлення залежностей
echo "Встановлення Python залежностей..."
pip install -r requirements.txt

# Перевірка наявності .env файлу
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Створення .env файлу з .env.example..."
        cp .env.example .env
        echo "ПОПЕРЕДЖЕННЯ: Налаштуйте TG_API в .env файлі!"
    else
        echo "ПОМИЛКА: .env.example файл не знайдено. Створіть .env файл з налаштуваннями бота."
        exit 1
    fi
fi

# Перевірка наявності токена бота
if ! grep -q "TG_API=" .env || grep -q "TG_API=$" .env; then
    echo "ПОПЕРЕДЖЕННЯ: TG_API не налаштовано в .env файлі!"
    echo "Отримайте токен від @BotFather в Telegram та додайте його до .env файлу"
fi

# Запуск бота
echo "Запуск Telegram бота..."
python main.py
