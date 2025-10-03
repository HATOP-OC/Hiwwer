import os
import logging
from dotenv import load_dotenv

from telegram import Update
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

    # Add error handler
    application.add_error_handler(handlers.error_handler)

    # Start the Bot
    application.run_polling()


if __name__ == '__main__':
    main()