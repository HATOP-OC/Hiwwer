import os
import logging
from dotenv import load_dotenv

from telegram import BotCommand, MenuButtonCommands
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    ConversationHandler,
    ContextTypes,
    filters,
)

import handlers
import api

# Load environment variables
load_dotenv()

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

def main() -> None:
    """Start the bot."""
    token = os.getenv("TG_API")
    if not token:
        logger.error("No TG_API token provided! Set the environment variable.")
        return

    async def post_init(application):
        logger.info("Hiwwer Bot started...")
        
        try:
            # Set default commands (without language code - for all users)
            commands_default = [
                BotCommand("start", "Start the bot and show main menu"),
                BotCommand("help", "Show help information"),
                BotCommand("language", "Change language settings"),
                BotCommand("link", "Link your Telegram account"),
                BotCommand("cancel", "Cancel current operation"),
            ]
            await application.bot.set_my_commands(commands_default)
            
            # Set bot commands for English
            commands_en = [
                BotCommand("start", "Start the bot and show main menu"),
                BotCommand("help", "Show help information"),
                BotCommand("language", "Change language settings"),
                BotCommand("link", "Link your Telegram account"),
                BotCommand("cancel", "Cancel current operation"),
            ]
            await application.bot.set_my_commands(commands_en, language_code="en")
            
            # Set bot commands for Ukrainian
            commands_uk = [
                BotCommand("start", "Запустити бота та показати головне меню"),
                BotCommand("help", "Показати довідкову інформацію"),
                BotCommand("language", "Змінити мовні налаштування"),
                BotCommand("link", "Прив'язати Telegram акаунт"),
                BotCommand("cancel", "Скасувати поточну операцію"),
            ]
            await application.bot.set_my_commands(commands_uk, language_code="uk")
            
            # Set default menu button to show commands
            await application.bot.set_chat_menu_button(menu_button=MenuButtonCommands())
            
            logger.info("Bot commands menu and menu button set up successfully")
        except Exception as e:
            logger.error(f"Failed to set bot commands: {e}")

    async def post_shutdown(application):
        logger.info("Shutting down bot...")
        await api.api_client.close()

    application = (
        Application.builder()
        .token(token)
        .post_init(post_init)
        .post_shutdown(post_shutdown)
        .build()
    )

    # Setup conversation handler with states
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', handlers.start)],
        states={
            handlers.MAIN_MENU: [
                CallbackQueryHandler(handlers.my_orders, pattern='^my_orders$'),
                CallbackQueryHandler(handlers.chat_list, pattern='^messages$'),
                CallbackQueryHandler(handlers.start_assistant, pattern='^assistant$'),
                CallbackQueryHandler(handlers.change_language, pattern='^change_language$'),
                CallbackQueryHandler(handlers.handle_help_callback, pattern='^help$'),
                CallbackQueryHandler(handlers.handle_about_callback, pattern='^about$'),
                CallbackQueryHandler(handlers.handle_commands_menu_callback, pattern='^commands_menu$'),
            ],
            handlers.ORDER_MENU: [
                CallbackQueryHandler(handlers.view_order, pattern='^order_'),
                CallbackQueryHandler(handlers.handle_order_action, pattern='^(complete|revision|start)_'),
                CallbackQueryHandler(handlers.view_chat, pattern='^chat_'),
                CallbackQueryHandler(handlers.back_to_main, pattern='^back_to_main$'),
                CallbackQueryHandler(handlers.my_orders, pattern='^my_orders$'),
            ],
            handlers.CHAT_MENU: [
                CallbackQueryHandler(handlers.view_chat, pattern='^chat_'),
                CallbackQueryHandler(handlers.send_message_prompt, pattern='^send_msg_'),
                CallbackQueryHandler(handlers.view_order, pattern='^order_'),
                CallbackQueryHandler(handlers.chat_list, pattern='^messages$'),
                CallbackQueryHandler(handlers.back_to_main, pattern='^back_to_main$'),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handlers.handle_message),
            ],
            handlers.ASSISTANT_MENU: [
                CallbackQueryHandler(handlers.back_to_main, pattern='^back_to_main$'),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handlers.handle_assistant_message),
            ],
            handlers.LANGUAGE_MENU: [
                CallbackQueryHandler(handlers.set_language, pattern='^set_lang_'),
                CallbackQueryHandler(handlers.back_to_main, pattern='^back_to_main$'),
            ],
            handlers.COMMANDS_MENU: [
                CallbackQueryHandler(handlers.handle_command_callback, pattern='^cmd_'),
                CallbackQueryHandler(handlers.back_to_main, pattern='^back_to_main$'),
            ],
        },
        fallbacks=[CommandHandler('cancel', handlers.cancel), CommandHandler('start', handlers.start)],
        per_user=True,
        per_message=False,
        allow_reentry=True
    )

    application.add_handler(conv_handler)

    # Add standalone command handlers
    application.add_handler(CommandHandler('help', handlers.help_command))
    application.add_handler(CommandHandler('language', handlers.language_command))
    application.add_handler(CommandHandler('link', handlers.link_account))

    # Add error handler
    application.add_error_handler(handlers.error_handler)

    # Start the Bot
    application.run_polling()


if __name__ == '__main__':
    main()