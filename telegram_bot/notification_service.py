import os
import logging
import asyncio
import aiohttp
from typing import Optional, Callable
from telegram import Bot

logger = logging.getLogger(__name__)

class NotificationService:
    """
    Сервіс для отримання та обробки сповіщень з бекенду.
    Використовує long polling для отримання нових сповіщень.
    """
    
    def __init__(self, bot: Bot, backend_url: str):
        self.bot = bot
        self.backend_url = backend_url
        self.running = False
        self._task: Optional[asyncio.Task] = None
        
    async def start(self):
        """Запускає сервіс отримання сповіщень"""
        if self.running:
            logger.warning("Notification service is already running")
            return
            
        self.running = True
        self._task = asyncio.create_task(self._poll_notifications())
        logger.info("Notification service started")
        
    async def stop(self):
        """Зупиняє сервіс отримання сповіщень"""
        self.running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Notification service stopped")
        
    async def _poll_notifications(self):
        """
        Періодично перевіряє нові сповіщення на бекенді.
        В ідеалі потрібно використовувати WebSocket або Server-Sent Events.
        """
        async with aiohttp.ClientSession() as session:
            while self.running:
                try:
                    # Отримуємо список непрочитаних сповіщень
                    async with session.get(
                        f"{self.backend_url}/notifications/pending-telegram",
                        timeout=aiohttp.ClientTimeout(total=30)
                    ) as response:
                        if response.status == 200:
                            notifications = await response.json()
                            
                            # Обробляємо кожне сповіщення
                            for notification in notifications:
                                await self._process_notification(notification)
                                
                except asyncio.CancelledError:
                    break
                except Exception as e:
                    logger.error(f"Error polling notifications: {e}")
                    
                # Чекаємо перед наступною перевіркою (5 секунд)
                await asyncio.sleep(5)
                
    async def _process_notification(self, notification: dict):
        """Обробляє одне сповіщення та відправляє його користувачу"""
        try:
            user_id = notification.get('userId')
            notification_id = notification.get('id')
            notification_type = notification.get('type')
            content = notification.get('content')
            related_id = notification.get('relatedId')
            
            # Отримуємо chat_id користувача з бази даних
            chat_id = await self._get_user_chat_id(user_id)
            
            if not chat_id:
                logger.warning(f"No chat_id found for user {user_id}")
                return
                
            # Імпортуємо функцію відправки сповіщень
            from notifications import send_telegram_notification
            
            # Відправляємо сповіщення в Telegram
            success = await send_telegram_notification(
                bot=self.bot,
                chat_id=chat_id,
                notification_type=notification_type,
                content=content,
                related_id=related_id
            )
            
            if success:
                # Відмічаємо сповіщення як відправлене в Telegram
                await self._mark_notification_sent(notification_id)
                
        except Exception as e:
            logger.error(f"Error processing notification {notification.get('id')}: {e}")
            
    async def _get_user_chat_id(self, user_id: str) -> Optional[str]:
        """Отримує chat_id користувача з бази даних через API"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.backend_url}/users/{user_id}/telegram-chat",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get('chatId')
        except Exception as e:
            logger.error(f"Error getting chat_id for user {user_id}: {e}")
        return None
        
    async def _mark_notification_sent(self, notification_id: str):
        """Відмічає сповіщення як відправлене в Telegram"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.patch(
                    f"{self.backend_url}/notifications/{notification_id}/telegram-sent",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        logger.info(f"Notification {notification_id} marked as sent")
        except Exception as e:
            logger.error(f"Error marking notification {notification_id} as sent: {e}")
