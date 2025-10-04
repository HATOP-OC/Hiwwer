from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
import os
from dotenv import load_dotenv
import localization

load_dotenv()
WEBAPP_URL = os.getenv("WEBAPP_URL", "").rstrip('/')

def get_main_menu_keyboard(lang_code: str) -> InlineKeyboardMarkup:
    """Returns the main menu keyboard."""
    keyboard = [
        [InlineKeyboardButton(localization.get_text('open_marketplace', lang_code), web_app=WebAppInfo(url=WEBAPP_URL))],
        [InlineKeyboardButton(localization.get_text('my_orders', lang_code), callback_data='my_orders')],
        [InlineKeyboardButton(localization.get_text('messages', lang_code), callback_data='messages')],
        [InlineKeyboardButton(localization.get_text('assistant', lang_code), callback_data='assistant')],
        [InlineKeyboardButton("📋 " + localization.get_text('commands_menu', lang_code), callback_data='commands_menu')],
        [InlineKeyboardButton("🌐 " + localization.get_text('change_language', lang_code), callback_data='change_language')],
        [InlineKeyboardButton("ℹ️ " + localization.get_text('about_bot', lang_code), callback_data='about')],
    ]
    return InlineKeyboardMarkup(keyboard)

def get_commands_menu_keyboard(lang_code: str) -> InlineKeyboardMarkup:
    """Returns the commands menu keyboard."""
    keyboard = [
        [InlineKeyboardButton("/start - " + localization.get_text('start_command', lang_code), callback_data='cmd_start')],
        [InlineKeyboardButton("/help - " + localization.get_text('help_command', lang_code), callback_data='cmd_help')],
        [InlineKeyboardButton("/language - " + localization.get_text('language_command', lang_code), callback_data='cmd_language')],
        [InlineKeyboardButton("/link - " + localization.get_text('link_command', lang_code), callback_data='cmd_link')],
        [InlineKeyboardButton("⬅️ " + localization.get_text('back_to_main', lang_code), callback_data='back_to_main')],
    ]
    return InlineKeyboardMarkup(keyboard)

def get_unregistered_user_keyboard(telegram_id: str, lang_code: str) -> InlineKeyboardMarkup:
    """Returns the keyboard for unregistered users."""
    keyboard = [
        [InlineKeyboardButton(localization.get_text('register_button', lang_code), web_app=WebAppInfo(url=WEBAPP_URL))],
        [InlineKeyboardButton("🌐 " + localization.get_text('change_language', lang_code), callback_data='change_language')],
        [InlineKeyboardButton("ℹ️ " + localization.get_text('about_bot', lang_code), callback_data='about')],
    ]
    return InlineKeyboardMarkup(keyboard)

def get_orders_keyboard(orders: list, lang_code: str) -> InlineKeyboardMarkup:
    """Returns the keyboard for the order list view."""
    order_buttons = []
    for order in orders:
        status_emoji = {
            "pending": "⏳", "in_progress": "🔄", "revision": "🔍",
            "completed": "✅", "canceled": "❌", "disputed": "⚖️"
        }.get(order["status"], "📄")

        order_buttons.append([
            InlineKeyboardButton(
                f"{status_emoji} {order['title']} (#{order['id']})",
                callback_data=f"order_{order['id']}"
            )
        ])

    order_buttons.append([InlineKeyboardButton(localization.get_text('back_to_main_menu_button', lang_code), callback_data='back_to_main')])
    return InlineKeyboardMarkup(order_buttons)

def get_order_detail_keyboard(order: dict, user_id: str, lang_code: str) -> InlineKeyboardMarkup:
    """Returns the keyboard for the detailed order view."""
    order_id = order['id']
    user_role = "client" if order["client"]["id"] == user_id else "performer"
    other_party = order["performer"] if user_role == "client" else order["client"]

    keyboard = [[InlineKeyboardButton(localization.get_text('chat_with_button', lang_code, name=other_party['name']), callback_data=f"chat_{order_id}")]]

    if order["status"] == "in_progress" and user_role == "performer":
        keyboard.append([InlineKeyboardButton(localization.get_text('complete_order_button', lang_code), callback_data=f"complete_{order_id}")])
    elif order["status"] == "in_progress" and user_role == "client":
        keyboard.append([InlineKeyboardButton(localization.get_text('request_revision_button', lang_code), callback_data=f"revision_{order_id}")])
    elif order["status"] == "pending" and user_role == "performer":
        keyboard.append([InlineKeyboardButton(localization.get_text('start_working_button', lang_code), callback_data=f"start_{order_id}")])

    keyboard.append([InlineKeyboardButton(localization.get_text('back_to_orders_button', lang_code), callback_data='my_orders')])
    return InlineKeyboardMarkup(keyboard)

def get_chat_view_keyboard(order_id: str, lang_code: str) -> InlineKeyboardMarkup:
    """Returns the keyboard for the chat view."""
    keyboard = [
        [InlineKeyboardButton(localization.get_text('send_message_button', lang_code), callback_data=f"send_msg_{order_id}")],
        [InlineKeyboardButton(localization.get_text('refresh_chat_button', lang_code), callback_data=f"chat_{order_id}")],
        [InlineKeyboardButton(localization.get_text('view_order_button', lang_code), callback_data=f"order_{order_id}")],
        [InlineKeyboardButton(localization.get_text('back_to_chats_button', lang_code), callback_data='messages')]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_assistant_keyboard(lang_code: str) -> InlineKeyboardMarkup:
    """Returns the keyboard for the AI assistant view."""
    return InlineKeyboardMarkup([[InlineKeyboardButton(localization.get_text('back_to_main_menu_button', lang_code), callback_data='back_to_main')]])

def get_back_to_main_menu_keyboard(lang_code: str) -> InlineKeyboardMarkup:
    """Returns a simple keyboard to go back to the main menu."""
    return InlineKeyboardMarkup([[InlineKeyboardButton(localization.get_text('back_to_main_menu_button', lang_code), callback_data='back_to_main')]])

def get_back_to_chat_keyboard(order_id: str, lang_code: str) -> InlineKeyboardMarkup:
    """Returns a keyboard to go back to the chat."""
    return InlineKeyboardMarkup([[InlineKeyboardButton(localization.get_text('back_to_chat_button', lang_code), callback_data=f"chat_{order_id}")]])

def get_back_to_orders_keyboard(lang_code: str) -> InlineKeyboardMarkup:
    """Returns a keyboard to go back to the orders list."""
    return InlineKeyboardMarkup([[InlineKeyboardButton(localization.get_text('back_to_orders_button', lang_code), callback_data='my_orders')]])

def get_language_choice_keyboard() -> InlineKeyboardMarkup:
    """Returns a keyboard for choosing a language."""
    keyboard = [
        [InlineKeyboardButton("🇬🇧 English", callback_data='set_lang_en')],
        [InlineKeyboardButton("🇺🇦 Українська", callback_data='set_lang_uk')],
    ]
    return InlineKeyboardMarkup(keyboard)