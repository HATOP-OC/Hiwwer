#!/usr/bin/env bash
# filepath: /workspaces/digi-hub-telegram-sales/start-api.sh
# Скрипт для запуску API-сервера
set -euo pipefail

cd "$(dirname "$0")/server"
echo "===== Запуск API сервера ====="

# Встановити залежності, якщо потрібно
npm install

# Запуск у dev-режимі
npm run dev
