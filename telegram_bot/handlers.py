import logging
from datetime import datetime, timedelta
from telegram import Update, ParseMode, InlineKeyboardButton, InlineKeyboardMarkup
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.constants import ParseMode
from telegram.ext import CallbackContext, ConversationHandler

import api
import keyboards
import localization

# Configure logging
logger = logging.getLogger(__name__)

# Conversation states
MAIN_MENU, ORDER_MENU, CHAT_MENU, ASSISTANT_MENU, LANGUAGE_MENU = range(5)

def _get_lang(context: CallbackContext) -> str:
    """Safely get user's language code, defaulting to 'en'."""
    return context.user_data.get("user", {}).get("languageCode", "en")

async def start(update: Update, context: CallbackContext) -> int:
    """Handle the /start command."""
    user = update.effective_user
    telegram_id = str(user.id)

    api_response = await api.api_client.get_user_by_telegram(telegram_id)

    if api_response and "id" in api_response:
        context.user_data["user"] = api_response
        context.user_data["token"] = api_response.get("token")
        lang_code = _get_lang(context)

        await update.message.reply_text(
            get_text('welcome_back', lang_code, name=api_response['name']),
            reply_markup=keyboards.get_main_menu_keyboard(lang_code)
        )
    else:
        # Default to 'en' for unregistered users, or try to get from TG user object
        lang_code = user.language_code if user.language_code in ['en', 'uk'] else 'en'
        await update.message.reply_text(
            get_text('register_prompt', lang_code),
            reply_markup=keyboards.get_unregistered_user_keyboard(telegram_id, lang_code)
        )

    return MAIN_MENU

async def my_orders(update: Update, context: CallbackContext) -> int:
    """Show user's orders."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    token = context.user_data.get("token")
    if not token:
        await query.edit_message_text(get_text('auth_error', lang_code))
        return MAIN_MENU

    orders = await api.api_client.get_orders(token)

    if not orders:
        await query.edit_message_text(
            text=get_text('no_orders', lang_code),
            reply_markup=keyboards.get_back_to_main_menu_keyboard(lang_code)
        )
        return MAIN_MENU

    await query.edit_message_text(
        text=get_text('your_orders', lang_code),
        reply_markup=keyboards.get_orders_keyboard(orders, lang_code)
    )

    return ORDER_MENU

async def view_order(update: Update, context: CallbackContext) -> int:
    """Show details of a specific order."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    order_id = query.data.split('_')[1]
    token = context.user_data.get("token")
    user_id = context.user_data.get("user", {}).get("id")

    if not token or not user_id:
        await query.edit_message_text(get_text('auth_error', lang_code))
        return MAIN_MENU

    order = await api.api_client.get_order_details(order_id, token)

    if not order:
        await query.edit_message_text(
            text=get_text('order_not_found', lang_code),
            reply_markup=keyboards.get_back_to_orders_keyboard(lang_code)
        )
        return ORDER_MENU

    deadline = datetime.fromisoformat(order['deadline'].replace('Z', '+00:00'))
    deadline_str = deadline.strftime("%d %b %Y, %H:%M %Z")
    time_left = deadline - datetime.utcnow()
    deadline_warning = ""
    if timedelta(0) < time_left < timedelta(days=1):
        deadline_warning = get_text('deadline_approaching', lang_code) + "\n"
    elif time_left < timedelta(0):
        deadline_warning = get_text('deadline_passed', lang_code) + "\n"

    user_role = "client" if order["client"]["id"] == user_id else "performer"
    other_party_role_key = "order_performer" if user_role == "client" else "order_client"
    other_party = order["performer"] if user_role == "client" else order["client"]

    message = (
        f"{get_text('order_details_title', lang_code, id=order['id'])}\n\n"
        f"{get_text('order_service', lang_code, title=order['title'])}\n"
        f"{get_text('order_status', lang_code, status=order['status'].replace('_', ' ').title())}\n"
        f"{deadline_warning}{get_text('order_deadline', lang_code, deadline=deadline_str)}\n"
        f"{get_text(other_party_role_key, lang_code, name=other_party['name'])}\n"
    )

    await query.edit_message_text(
        text=message,
        reply_markup=keyboards.get_order_detail_keyboard(order, user_id, lang_code),
        parse_mode=ParseMode.MARKDOWN
    )

    return ORDER_MENU

async def chat_list(update: Update, context: CallbackContext) -> int:
    """Show list of chats."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    token = context.user_data.get("token")
    user_id = context.user_data.get("user", {}).get("id")

    if not token or not user_id:
        await query.edit_message_text(get_text('auth_error', lang_code))
        return MAIN_MENU

    orders = await api.api_client.get_orders(token)

    if not orders:
        await query.edit_message_text(
            text=get_text('no_chats', lang_code),
            reply_markup=keyboards.get_back_to_main_menu_keyboard(lang_code)
        )
        return MAIN_MENU

    chat_buttons = []
    for order in orders:
        other_party = order.get("performer") if order["client"]["id"] == user_id else order.get("client")
        if not other_party:
            continue

        chat_buttons.append([
            InlineKeyboardButton(
                f"💬 {order['title']} with {other_party['name']}",
                callback_data=f"chat_{order['id']}"
            )
        ])

    if not chat_buttons:
        await query.edit_message_text(
            text=get_text('no_chats', lang_code),
            reply_markup=keyboards.get_back_to_main_menu_keyboard(lang_code)
        )
        return MAIN_MENU

    chat_buttons.append([InlineKeyboardButton(get_text('back_to_main_menu_button', lang_code), callback_data='back_to_main')])

    await query.edit_message_text(
        text=get_text('your_conversations', lang_code),
        reply_markup=InlineKeyboardMarkup(chat_buttons)
    )

    return CHAT_MENU

async def view_chat(update: Update, context: CallbackContext) -> int:
    """Display the chat for a specific order."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    order_id = query.data.split('_')[1]
    token = context.user_data.get("token")
    user = context.user_data.get("user")

    if not token or not user:
        await query.edit_message_text(get_text('auth_error', lang_code))
        return MAIN_MENU

    order_details = await api.api_client.get_order_details(order_id, token)
    if not order_details:
        await query.edit_message_text(
            get_text('order_not_found', lang_code),
            reply_markup=keyboards.get_back_to_main_menu_keyboard(lang_code)
        )
        return CHAT_MENU

    messages_data = await api.api_client.get_messages(order_id, token)

    context.user_data["current_chat_order_id"] = order_id

    client_name = order_details["client"]["name"]
    performer_name = order_details.get("performer", {}).get("name", "N/A")

    chat_display = get_text('chat_title', lang_code, title=order_details['title']) + "\n\n"
    if not messages_data:
        chat_display += get_text('no_messages', lang_code)
    else:
        for msg in messages_data[-10:]:
            sender_name = client_name if msg["senderId"] == order_details["client"]["id"] else performer_name
            timestamp = datetime.fromisoformat(msg['createdAt'].replace('Z', '+00:00')).strftime("%d %b, %H:%M")
            chat_display += f"*{sender_name}* ({timestamp}):\n_{msg['content']}_\n\n"

    await query.edit_message_text(
        text=chat_display,
        reply_markup=keyboards.get_chat_view_keyboard(order_id, lang_code),
        parse_mode=ParseMode.MARKDOWN
    )

    return CHAT_MENU

async def send_message_prompt(update: Update, context: CallbackContext) -> int:
    """Prompt user to type their message."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    order_id = query.data.split('_')[2]
    context.user_data["message_for_order"] = order_id

    await query.edit_message_text(
        text=get_text('send_message_prompt', lang_code, id=order_id)
    )

    return CHAT_MENU

async def handle_message(update: Update, context: CallbackContext) -> int:
    """Handle and send a text message for a chat."""
    order_id = context.user_data.get("message_for_order")
    token = context.user_data.get("token")
    message_text = update.message.text
    lang_code = _get_lang(context)

    if not order_id or not token:
        await update.message.reply_text(get_text('auth_error', lang_code), reply_markup=keyboards.get_main_menu_keyboard(lang_code))
        return MAIN_MENU

    api_response = await api.api_client.post_message(order_id, message_text, token)

    if api_response:
        await update.message.reply_text(
            get_text('message_sent_success', lang_code),
            reply_markup=keyboards.get_back_to_chat_keyboard(order_id, lang_code)
        )
    else:
        await update.message.reply_text(
            get_text('message_sent_fail', lang_code),
            reply_markup=keyboards.get_back_to_chat_keyboard(order_id, lang_code)
        )

    if "message_for_order" in context.user_data:
        del context.user_data["message_for_order"]

    return CHAT_MENU

async def handle_order_action(update: Update, context: CallbackContext) -> int:
    """Handle order actions by calling the API."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    parts = query.data.split('_')
    action, order_id = parts[0], parts[1]

    token = context.user_data.get("token")
    if not token:
        await query.edit_message_text(get_text('auth_error', lang_code))
        return MAIN_MENU

    status_map = {"complete": "completed", "revision": "revision", "start": "in_progress"}
    new_status = status_map.get(action)

    if not new_status:
        await query.edit_message_text("Invalid action.")
        return ORDER_MENU

    api_response = await api.api_client.update_order_status(order_id, new_status, token)

    message = get_text('order_status_updated', lang_code, status=new_status.replace('_', ' ')) if api_response else get_text('order_status_fail', lang_code)

    order = await api.api_client.get_order_details(order_id, token)
    user_id = context.user_data.get("user", {}).get("id")

    await query.edit_message_text(
        text=message,
        reply_markup=keyboards.get_order_detail_keyboard(order, user_id, lang_code),
        parse_mode=ParseMode.MARKDOWN
    )

    return ORDER_MENU

async def start_assistant(update: Update, context: CallbackContext) -> int:
    """Start the AI assistant conversation."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    await query.edit_message_text(
        text=get_text('assistant_welcome', lang_code),
        parse_mode=ParseMode.MARKDOWN
    )

    return ASSISTANT_MENU

async def handle_assistant_message(update: Update, context: CallbackContext) -> int:
    """Handle messages sent to the AI assistant."""
    user_message = update.message.text
    session_id = str(update.effective_user.id)
    lang_code = _get_lang(context)

    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")

    api_response = await api.api_client.get_assistant_reply(user_message, session_id)

    if api_response and "reply" in api_response:
        assistant_reply = api_response["reply"]
    else:
        assistant_reply = get_text('assistant_connect_fail', lang_code)

    await update.message.reply_text(
        assistant_reply,
        reply_markup=keyboards.get_assistant_keyboard(lang_code),
        parse_mode=ParseMode.MARKDOWN
    )

    return ASSISTANT_MENU

async def language_command(update: Update, context: CallbackContext) -> int:
    """Handle the /language command."""
    lang_code = _get_lang(context)
    await update.message.reply_text(
        text=get_text('choose_language', lang_code),
        reply_markup=keyboards.get_language_choice_keyboard()
    )
    return LANGUAGE_MENU

async def change_language(update: Update, context: CallbackContext) -> int:
    """Display language selection options via a button press."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    await query.edit_message_text(
        text=get_text('choose_language', lang_code),
        reply_markup=keyboards.get_language_choice_keyboard()
    )
    return LANGUAGE_MENU

async def set_language(update: Update, context: CallbackContext) -> int:
    """Set the user's chosen language."""
    query = update.callback_query
    await query.answer()

    new_lang_code = query.data.split('_')[-1] # e.g., 'en' from 'set_lang_en'
    token = context.user_data.get("token")

    if not token:
        await query.edit_message_text(get_text('auth_error', new_lang_code))
        return MAIN_MENU

    api_response = await api.api_client.update_language(new_lang_code, token)

    if api_response:
        # Update language in context
        context.user_data["user"]["languageCode"] = new_lang_code
        await query.edit_message_text(
            get_text('language_changed', new_lang_code),
            reply_markup=keyboards.get_main_menu_keyboard(new_lang_code)
        )
    else:
        await query.edit_message_text(
            "Failed to update language. Please try again.",
            reply_markup=keyboards.get_main_menu_keyboard(_get_lang(context))
        )

    return MAIN_MENU

async def back_to_main(update: Update, context: CallbackContext) -> int:
    """Return to the main menu."""
    query = update.callback_query
    await query.answer()
    lang_code = _get_lang(context)

    await query.edit_message_text(
        text=get_text('main_menu', lang_code),
        reply_markup=keyboards.get_main_menu_keyboard(lang_code)
    )

    return MAIN_MENU

async def help_command(update: Update, context: CallbackContext) -> None:
    """Send a message when the command /help is issued."""
    lang_code = _get_lang(context)
    await update.message.reply_text(get_text('help_command_text', lang_code))

async def cancel(update: Update, context: CallbackContext) -> int:
    """Cancel conversation."""
    lang_code = _get_lang(context)
    await update.message.reply_text(get_text('cancel_operation', lang_code))
    return ConversationHandler.END

async def error_handler(update: object, context: CallbackContext) -> None:
    """Log errors caused by updates."""
    logger.error(f'Update "{update}" caused error "{context.error}"')