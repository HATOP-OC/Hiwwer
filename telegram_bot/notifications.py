import logging
from typing import Dict, Any, Optional
from telegram import Bot
from telegram.constants import ParseMode
from telegram.error import TelegramError

logger = logging.getLogger(__name__)

# Emoji для різних типів сповіщень
NOTIFICATION_EMOJIS = {
    'message': '💬',
    'new_order': '🛒',
    'status_change': '🔄',
    'deadline': '⏰',
    'payment': '💰',
    'review': '⭐',
    'dispute': '⚠️',
}

async def send_telegram_notification(
    bot: Bot,
    chat_id: str,
    notification_type: str,
    content: str,
    related_id: Optional[str] = None
) -> bool:
    """
    Надсилає сповіщення користувачу в Telegram.
    
    Args:
        bot: Екземпляр Telegram бота
        chat_id: ID чату користувача в Telegram
        notification_type: Тип сповіщення (message, new_order, status_change, etc.)
        content: Текст сповіщення
        related_id: ID пов'язаного об'єкта (замовлення, диспуту тощо)
        
    Returns:
        True якщо сповіщення успішно відправлено, False якщо ні
    """
    try:
        emoji = NOTIFICATION_EMOJIS.get(notification_type, '🔔')
        
        # Форматуємо повідомлення
        message = f"{emoji} <b>Сповіщення</b>\n\n{content}"
        
        # Додаємо посилання якщо є related_id
        if related_id and notification_type in ['message', 'new_order', 'status_change']:
            message += f"\n\n<a href='https://your-domain.com/orders/{related_id}'>Переглянути замовлення</a>"
        elif related_id and notification_type == 'review':
            message += f"\n\n<a href='https://your-domain.com/profile'>Переглянути профіль</a>"
        
        await bot.send_message(
            chat_id=chat_id,
            text=message,
            parse_mode=ParseMode.HTML,
            disable_web_page_preview=True
        )
        
        logger.info(f"Notification sent to chat_id={chat_id}, type={notification_type}")
        return True
        
    except TelegramError as e:
        logger.error(f"Failed to send Telegram notification to chat_id={chat_id}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error sending notification to chat_id={chat_id}: {e}")
        return False


async def format_notification_message(notification: Dict[str, Any]) -> str:
    """
    Форматує об'єкт сповіщення в текстове повідомлення.
    
    Args:
        notification: Словник з даними сповіщення
        
    Returns:
        Відформатований текст сповіщення
    """
    notification_type = notification.get('type', 'unknown')
    content = notification.get('content', 'Нове сповіщення')
    
    emoji = NOTIFICATION_EMOJIS.get(notification_type, '🔔')
    
    return f"{emoji} {content}"
