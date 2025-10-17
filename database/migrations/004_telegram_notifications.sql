-- Додаємо поле telegram_sent до таблиці notifications
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS telegram_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS telegram_sent_at TIMESTAMPTZ;

-- Додаємо індекс для швидкого пошуку непрочитаних сповіщень, які потрібно відправити в Telegram
CREATE INDEX IF NOT EXISTS idx_notifications_telegram_pending 
ON notifications(user_id, telegram_sent, created_at)
WHERE telegram_sent = FALSE;

-- Додаємо коментарі
COMMENT ON COLUMN notifications.telegram_sent IS 'Чи було сповіщення відправлено в Telegram';
COMMENT ON COLUMN notifications.telegram_sent_at IS 'Час відправки сповіщення в Telegram';
