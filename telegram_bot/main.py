import os
import logging
from dotenv import load_dotenv

from telegram.ext import (
    Updater,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    Filters,
    ConversationHandler,
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

    updater = Updater(token)
    dispatcher = updater.dispatcher

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
                MessageHandler(Filters.text & ~Filters.command, handlers.handle_message),
            ],
            handlers.ASSISTANT_MENU: [
                CallbackQueryHandler(handlers.back_to_main, pattern='^back_to_main$'),
                MessageHandler(Filters.text & ~Filters.command, handlers.handle_assistant_message),
            ],
            handlers.LANGUAGE_MENU: [
                CallbackQueryHandler(handlers.set_language, pattern='^set_lang_'),
                CallbackQueryHandler(handlers.back_to_main, pattern='^back_to_main$'),
            ],
        },
        fallbacks=[CommandHandler('cancel', handlers.cancel), CommandHandler('start', handlers.start)],
        per_user=True,
        # Allow re-entry into the conversation
        allow_reentry=True
    )

    dispatcher.add_handler(conv_handler)

    # Add standalone command handlers
    dispatcher.add_handler(CommandHandler('help', handlers.help_command))
    dispatcher.add_handler(CommandHandler('language', handlers.language_command))

    # Add error handler
    dispatcher.add_error_handler(handlers.error_handler)

    # Start the Bot
    updater.start_polling()
    logger.info("Hiwwer Bot started...")

    # Run the bot until you press Ctrl-C
    updater.idle()

    # Clean up resources
    # This part is not strictly necessary for polling, but good practice
    # For a webhook based bot, this would be more complex.
    # We need to run the close method of our api_client
    import asyncio
    loop = asyncio.get_event_loop()
<<<<<<< HEAD
    loop.run_until_complete(api_client.close())
=======
    loop.run_until_complete(api.api_client.close())
>>>>>>> aaa1955 (feat: Add main bot functionality with conversation handling and command integration)


if __name__ == '__main__':
    main()