#!/usr/bin/env bash
# Єдиний скрипт для запуску всіх компонентів проекту Hiwwer
set -euo pipefail

cd "$(dirname "$0")"

echo "===== Запуск проекту Hiwwer ====="

# Надання прав на виконання скриптам
chmod +x start-db.sh start-frontend.sh start-bot.sh

# Функція для запуску компонента в фоновому режимі
run_component() {
  local script=$1
  local name=$2
  echo "===== Запуск $name ====="
  
  # Запускаємо скрипт в окремому терміналі і зберігаємо PID
  ./$script &
  local pid=$!
  echo "$name запущено з PID: $pid"
  
  # Чекаємо трохи, щоб скрипт встиг запуститися
  sleep 2
  
  # Перевіряємо, чи процес ще працює
  if ps -p $pid > /dev/null; then
    echo "$name успішно запущено."
  else
    echo "ПОМИЛКА: $name не вдалося запустити!"
    exit 1
  fi
}

# Перевірка чи контейнер БД вже існує і запущений
if docker ps --format '{{.Names}}' | grep -q '^hiwwer-postgres$'; then
  echo "PostgreSQL контейнер вже запущено. Пропускаємо ініціалізацію БД."
else
  # Запуск бази даних
  ./start-db.sh
fi

# Запуск компонентів у фоновому режимі
run_component "start-frontend.sh" "Frontend"
run_component "start-bot.sh" "Telegram Bot"

echo "===== Всі компоненти запущено ====="
echo "Натисніть Ctrl+C для зупинки всіх процесів"

# Очікуємо, поки користувач не натисне Ctrl+C
wait
