# Hiwwer - Маркетплейс цифрових послуг

## Огляд проекту

Hiwwer - це маркетплейс для купівлі та продажу цифрових послуг, який включає як веб-інтерфейс, так і інтеграцію з Telegram ботом.

## Технології

Цей проект побудований з використанням:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- PostgreSQL
- Python (Telegram бот)

## Як запустити проект

Для запуску проекту виконайте наступні кроки:

```sh
# Крок 1: Клонування репозиторію
git clone <URL_РЕПОЗИТОРІЮ>

# Крок 2: Перейдіть до директорії проекту
cd digi-hub-telegram-sales

# Крок 3: Встановіть залежності
npm install
pip install -r telegram_bot/requirements.txt

# Крок 4: Налаштуйте середовище
# Створіть файл .env у корені проекту
# Створіть файл telegram_bot/.env для налаштувань бота

# Крок 5: Запустіть базу даних
./start-db.sh

# Крок 6: Запустіть фронтенд
./start-frontend.sh

# Крок 7: Запустіть Telegram бота
./start-bot.sh
```

## Розгортання та налаштування середовища розробки

1. Створіть файл `.env` в корені проєкту зі змінними:

```properties
# URL бекенду (має включати префікс /v1)
VITE_API_BASE_URL=https://<your-codespace>-3000.app.github.dev/v1
``` 

2. Для серверної частини створіть `server/.env` із:

```properties
PORT=3000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:pass@localhost:5432/hiwwer_db
ADMIN_CREDENTIALS="admin@hiwwer.com:password123:Administrator"
```

## Структура бази даних

Проект використовує PostgreSQL для зберігання даних. Основні таблиці включають:

- users - користувачі системи (клієнти, виконавці, адміністратори)
- services - послуги, що надаються виконавцями
- orders - замовлення між клієнтами та виконавцями
- messages - повідомлення в чатах замовлень
- reviews - відгуки про виконані роботи

## Telegram бот

Бот надає можливість:
- Переглядати свої замовлення
- Спілкуватися з клієнтами/виконавцями
- Змінювати статуси замовлень
- Відкривати веб-інтерфейс безпосередньо в Telegram

## Компоненти проекту

- `/src` - фронтенд на React/TypeScript
- `/database` - схема бази даних
- `/telegram_bot` - Telegram бот на Python
- `/api_docs` - документація до API


