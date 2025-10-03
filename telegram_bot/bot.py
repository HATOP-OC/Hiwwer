#!/usr/bin/env python3
"""
Hiwwer Telegram Bot - Integration for digital services marketplace
"""
import os
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union

from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    filters,
    ContextTypes,
    ConversationHandler,
)
from telegram.constants import ParseMode

# Load environment variables from .env file
load_dotenv()
web_app_url = os.getenv('WEBAPP_URL', 'http://localhost:8080')

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

# Constants for conversation states
MAIN_MENU, ORDER_MENU, CHAT_MENU = range(3)

# Mock data - in a real implementation, this would be fetched from the API
mock_orders = {
    "123456": {
        "id": "123456",
        "title": "Logo Design",
        "status": "in_progress",
        "deadline": datetime.now() + timedelta(days=2),
        "client": {"id": "c1", "name": "John Client", "telegram_id": "12345"},
        "performer": {"id": "p1", "name": "Alice Designer", "telegram_id": "67890"},
    },
    "654321": {
        "id": "654321",
        "title": "Website Development",
        "status": "pending",
        "deadline": datetime.now() + timedelta(days=5),
        "client": {"id": "c2", "name": "Bob Client", "telegram_id": "23456"},
        "performer": {"id": "p2", "name": "Charlie Developer", "telegram_id": "78901"},
    }
}

mock_chats = {
    "123456": [
        {"sender_id": "c1", "sender_name": "John Client", "text": "How is the logo coming along?", "timestamp": datetime.now() - timedelta(hours=2)},
        {"sender_id": "p1", "sender_name": "Alice Designer", "text": "Great! I'll send a draft soon.", "timestamp": datetime.now() - timedelta(hours=1)},
    ],
    "654321": [
        {"sender_id": "c2", "sender_name": "Bob Client", "text": "When can we start the project?", "timestamp": datetime.now() - timedelta(days=1)},
        {"sender_id": "p2", "sender_name": "Charlie Developer", "text": "I'll review your requirements today.", "timestamp": datetime.now() - timedelta(hours=12)},
    ]
}

# User session storage
user_data = {}


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    
    # In a real implementation, check if user exists in the database
    # and link their Telegram account if needed
    
    keyboard = [
        [InlineKeyboardButton("Открыть маркетплейс", web_app=WebAppInfo(url=web_app_url))],
        [InlineKeyboardButton("Мои заказы", callback_data='my_orders')],
        [InlineKeyboardButton("Сообщения", callback_data='messages')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f'Hello {user.first_name}! Welcome to Hiwwer Bot.\n\n'
        f'I can help you manage your orders and communicate with clients/performers.',
        reply_markup=reply_markup
    )
    
    return MAIN_MENU


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    help_text = (
        "Hiwwer Bot Commands:\n\n"
        "/start - Start the bot and show main menu\n"
        "/myorders - View your orders\n"
        "/chat - Access your conversations\n"
        "/help - Show this help message\n"
    )
    await update.message.reply_text(help_text)


async def my_orders(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Show user's orders."""
    query = update.callback_query
    await query.answer()
    
    # In a real implementation, fetch user orders from API
    # For now, use mock data based on user's role
    
    user_telegram_id = str(update.effective_user.id)
    
    # Find orders where user is either client or performer
    user_orders = []
    for order_id, order in mock_orders.items():
        if (order["client"]["telegram_id"] == user_telegram_id or 
            order["performer"]["telegram_id"] == user_telegram_id):
            user_orders.append(order)
    
    if not user_orders:
        await query.edit_message_text(
            text="You don't have any orders yet.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Back to Main Menu", callback_data='back_to_main')]
            ])
        )
        return MAIN_MENU
    
    order_buttons = []
    for order in user_orders:
        status_emoji = {
            "pending": "⏳",
            "in_progress": "🔄",
            "revision": "🔍",
            "completed": "✅",
            "canceled": "❌"
        }.get(order["status"], "⏳")
        
        order_buttons.append([
            InlineKeyboardButton(
                f"{status_emoji} {order['title']} (#{order['id']})",
                callback_data=f"order_{order['id']}"
            )
        ])
    
    order_buttons.append([InlineKeyboardButton("Back to Main Menu", callback_data='back_to_main')])
    
    await query.edit_message_text(
        text="Your orders:",
        reply_markup=InlineKeyboardMarkup(order_buttons)
    )
    
    return ORDER_MENU


async def view_order(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Show details of a specific order."""
    query = update.callback_query
    await query.answer()
    
    order_id = query.data.split('_')[1]
    order = mock_orders.get(order_id)
    
    if not order:
        await query.edit_message_text(
            text="Order not found.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Back to Orders", callback_data='my_orders')]
            ])
        )
        return ORDER_MENU
    
    # Format deadline
    deadline_str = order["deadline"].strftime("%d %b %Y, %H:%M")
    
    # Check if deadline is approaching (within 24 hours)
    time_left = order["deadline"] - datetime.now()
    deadline_warning = ""
    if time_left < timedelta(days=1) and time_left > timedelta(0):
        deadline_warning = "⚠️ Deadline approaching!\n"
    elif time_left < timedelta(0):
        deadline_warning = "⚠️ Deadline has passed!\n"
    
    # Determine if user is client or performer
    user_telegram_id = str(update.effective_user.id)
    user_role = "client" if order["client"]["telegram_id"] == user_telegram_id else "performer"
    other_party = order["performer"] if user_role == "client" else order["client"]
    
    # Order details message
    message = (
        f"*Order #{order['id']}*\n"
        f"*Service:* {order['title']}\n"
        f"*Status:* {order['status'].replace('_', ' ').title()}\n"
        f"{deadline_warning}*Deadline:* {deadline_str}\n"
        f"*{other_party['name']}* is your {'performer' if user_role == 'client' else 'client'}\n\n"
    )
    
    # Action buttons based on order status and user role
    keyboard = []
    
    # Chat button for all orders
    keyboard.append([InlineKeyboardButton("Chat", callback_data=f"chat_{order_id}")])
    
    # Status-specific buttons
    if order["status"] == "in_progress" and user_role == "performer":
        keyboard.append([InlineKeyboardButton("Mark as Complete", callback_data=f"complete_{order_id}")])
    elif order["status"] == "in_progress" and user_role == "client":
        keyboard.append([InlineKeyboardButton("Request Revision", callback_data=f"revision_{order_id}")])
    elif order["status"] == "pending" and user_role == "performer":
        keyboard.append([InlineKeyboardButton("Start Working", callback_data=f"start_{order_id}")])
    
    keyboard.append([InlineKeyboardButton("Back to Orders", callback_data='my_orders')])
    
    await query.edit_message_text(
        text=message,
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode=ParseMode.MARKDOWN
    )
    
    return ORDER_MENU


async def chat_list(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Show list of chats."""
    query = update.callback_query
    await query.answer()
    
    # In a real implementation, fetch user chats from API
    user_telegram_id = str(update.effective_user.id)
    
    # Find chats where user is either client or performer
    user_chats = []
    for order_id, order in mock_orders.items():
        if (order["client"]["telegram_id"] == user_telegram_id or 
            order["performer"]["telegram_id"] == user_telegram_id):
            chat_preview = mock_chats.get(order_id, [])
            latest_message = chat_preview[-1]["text"] if chat_preview else "No messages yet"
            user_chats.append({
                "order_id": order_id,
                "title": order["title"],
                "with": order["performer"]["name"] if order["client"]["telegram_id"] == user_telegram_id else order["client"]["name"],
                "latest_message": latest_message[:30] + "..." if len(latest_message) > 30 else latest_message
            })
    
    if not user_chats:
        await query.edit_message_text(
            text="You don't have any chats yet.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Back to Main Menu", callback_data='back_to_main')]
            ])
        )
        return MAIN_MENU
    
    chat_buttons = []
    for chat in user_chats:
        chat_buttons.append([
            InlineKeyboardButton(
                f"{chat['title']} with {chat['with']}",
                callback_data=f"chat_{chat['order_id']}"
            )
        ])
    
    chat_buttons.append([InlineKeyboardButton("Back to Main Menu", callback_data='back_to_main')])
    
    await query.edit_message_text(
        text="Your conversations:",
        reply_markup=InlineKeyboardMarkup(chat_buttons)
    )
    
    return CHAT_MENU


async def view_chat(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Show chat for a specific order."""
    query = update.callback_query
    await query.answer()
    
    order_id = query.data.split('_')[1]
    order = mock_orders.get(order_id)
    chat = mock_chats.get(order_id, [])
    
    if not order:
        await query.edit_message_text(
            text="Chat not found.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Back to Chats", callback_data='messages')]
            ])
        )
        return CHAT_MENU
    
    # Store the current chat in user context
    user_data[update.effective_user.id] = {"current_chat": order_id}
    
    # Format chat messages
    message = f"*Chat for {order['title']} (#{order_id})*\n\n"
    
    if not chat:
        message += "No messages yet. Send a message to start the conversation."
    else:
        # Show last 5 messages
        for msg in chat[-5:]:
            timestamp = msg["timestamp"].strftime("%H:%M")
            message += f"*{msg['sender_name']}* ({timestamp}):\n{msg['text']}\n\n"
    
    keyboard = [
        [InlineKeyboardButton("Send Message", callback_data=f"send_msg_{order_id}")],
        [InlineKeyboardButton("View Order", callback_data=f"order_{order_id}")],
        [InlineKeyboardButton("Back to Chats", callback_data='messages')]
    ]
    
    await query.edit_message_text(
        text=message,
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode=ParseMode.MARKDOWN
    )
    
    return CHAT_MENU


async def send_message_prompt(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Prompt user to send a message."""
    query = update.callback_query
    await query.answer()
    
    order_id = query.data.split('_')[2]
    
    await query.edit_message_text(
        text=f"Please type your message for order #{order_id}. I'll deliver it to the other party.",
    )
    
    # Store the target order ID in context
    context.user_data["message_for_order"] = order_id
    
    return CHAT_MENU


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle incoming messages for chats."""
    order_id = context.user_data.get("message_for_order")
    
    if not order_id or order_id not in mock_orders:
        await update.message.reply_text(
            "I'm not sure which conversation this message is for. Please use the menu to select a chat first.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Main Menu", callback_data='back_to_main')]
            ])
        )
        return MAIN_MENU
    
    # In a real implementation, send message to API
    message_text = update.message.text
    user = update.effective_user
    order = mock_orders[order_id]
    
    # Determine if user is client or performer
    user_telegram_id = str(user.id)
    user_role = "client" if order["client"]["telegram_id"] == user_telegram_id else "performer"
    user_id = order["client"]["id"] if user_role == "client" else order["performer"]["id"]
    
    # Add message to mock chat
    if order_id not in mock_chats:
        mock_chats[order_id] = []
    
    mock_chats[order_id].append({
        "sender_id": user_id,
        "sender_name": user.first_name,
        "text": message_text,
        "timestamp": datetime.now()
    })
    
    # Confirm message sent and provide navigation options
    keyboard = [
        [InlineKeyboardButton("Back to Chat", callback_data=f"chat_{order_id}")],
        [InlineKeyboardButton("Back to Main Menu", callback_data='back_to_main')]
    ]
    
    await update.message.reply_text(
        "Message sent! The other party will be notified.",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
    
    # In a real implementation, send a notification to the other party
    other_party = order["performer"] if user_role == "client" else order["client"]
    logger.info(f"Notification would be sent to {other_party['name']} (Telegram ID: {other_party['telegram_id']})")
    
    # Clear the message context
    if "message_for_order" in context.user_data:
        del context.user_data["message_for_order"]
    
    return MAIN_MENU


async def back_to_main(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Return to main menu."""
    query = update.callback_query
    await query.answer()
    
    keyboard = [
        [InlineKeyboardButton("Открыть маркетплейс", web_app=WebAppInfo(url=web_app_url))],
        [InlineKeyboardButton("Мои заказы", callback_data='my_orders')],
        [InlineKeyboardButton("Сообщения", callback_data='messages')],
    ]
    
    await query.edit_message_text(
        text="Hiwwer Bot Main Menu",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
    
    return MAIN_MENU


async def handle_order_action(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle order actions like complete, revision, etc."""
    query = update.callback_query
    await query.answer()
    
    # Extract action and order_id from callback data
    # Format: action_order_id (e.g., complete_123456)
    parts = query.data.split('_')
    action = parts[0]
    order_id = parts[1]
    
    if order_id not in mock_orders:
        await query.edit_message_text(
            text="Order not found.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Back to Orders", callback_data='my_orders')]
            ])
        )
        return ORDER_MENU
    
    # Handle different actions
    if action == "complete":
        mock_orders[order_id]["status"] = "completed"
        message = f"Order #{order_id} has been marked as complete."
    elif action == "revision":
        mock_orders[order_id]["status"] = "revision"
        message = f"A revision has been requested for order #{order_id}."
    elif action == "start":
        mock_orders[order_id]["status"] = "in_progress"
        message = f"You've started working on order #{order_id}."
    else:
        message = "Invalid action."
    
    # In a real implementation, update order status via API
    # and send notifications to the other party
    
    keyboard = [
        [InlineKeyboardButton("View Order", callback_data=f"order_{order_id}")],
        [InlineKeyboardButton("Back to Orders", callback_data='my_orders')]
    ]
    
    await query.edit_message_text(
        text=message,
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
    
    return ORDER_MENU


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancel conversation."""
    await update.message.reply_text('Operation canceled.')
    return ConversationHandler.END


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log errors caused by updates."""
    logger.error(f'Update "{update}" caused error "{context.error}"')


def main() -> None:
    """Start the bot."""
    # Get the API key from environment
    token = os.environ.get("TG_API")
    if not token:
        logger.error("No token provided! Set the TG_API environment variable.")
        return
    
    # Create application
    application = Application.builder().token(token).build()
    
    # Set up conversation handler
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            MAIN_MENU: [
                CallbackQueryHandler(my_orders, pattern='^my_orders$'),
                CallbackQueryHandler(chat_list, pattern='^messages$'),
            ],
            ORDER_MENU: [
                CallbackQueryHandler(view_order, pattern='^order_'),
                CallbackQueryHandler(back_to_main, pattern='^back_to_main$'),
                CallbackQueryHandler(handle_order_action, pattern='^(complete|revision|start)_'),
                CallbackQueryHandler(view_chat, pattern='^chat_'),
            ],
            CHAT_MENU: [
                CallbackQueryHandler(view_chat, pattern='^chat_'),
                CallbackQueryHandler(back_to_main, pattern='^back_to_main$'),
                CallbackQueryHandler(send_message_prompt, pattern='^send_msg_'),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message),
            ],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )
    
    application.add_handler(conv_handler)
    
    # Add standalone command handlers
    application.add_handler(CommandHandler('help', help_command))
    
    # Add error handler
    application.add_error_handler(error_handler)
    
    # Start the Bot
    logger.info("Bot started. Press Ctrl+C to stop.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()

