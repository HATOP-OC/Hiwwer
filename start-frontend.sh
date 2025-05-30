#!/usr/bin/env bash
# Скрипт для запуска фронтенд-сервера проекта DigiHub
set -euo pipefail

cd "$(dirname "$0")"

echo "Устанавливаю фронтенд-зависимости..."
npm install

echo "Запускаю фронтенд-сервер..."
npm run dev
