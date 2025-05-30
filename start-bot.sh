#!/usr/bin/env bash
# Скрипт для запуска Telegram-бота проекта DigiHub
set -euo pipefail

cd "$(dirname "$0")"/telegram_bot

echo "Устанавливаю зависимости бота..."
pip install -r requirements.txt

echo "Загружаю переменные окружения..."
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Запускаю Telegram-бота..."
python3 bot.py
