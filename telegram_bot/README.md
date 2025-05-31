
# Hiwwer Telegram Bot

This Telegram bot integrates with the Hiwwer digital services marketplace to provide real-time notifications, order management, and chat functionality.

## Features

- **User Authentication**: Link Telegram accounts with Hiwwer user accounts
- **Order Management**: View order details, status updates, and deadlines
- **Real-time Chat**: Communicate directly with clients or performers
- **Notifications**: Receive alerts for new orders, messages, status changes, and approaching deadlines
- **Actions**: Perform order-related actions like accepting orders, requesting revisions, or marking orders as complete

## Setup

1. Create a Telegram Bot via [@BotFather](https://t.me/botfather) and get your API token
2. Set the API token as an environment variable:
   ```
   export TG_API="your_token_here"
   ```
3. Install requirements:
   ```
   pip install -r requirements.txt
   ```
4. Run the bot:
   ```
   python bot.py
   ```

## Production Deployment

For production deployment:

1. Set up a proper webhook instead of using polling
2. Connect to Hiwwer's API for real-time data
3. Implement proper database storage instead of in-memory mock data
4. Add authentication and security measures
5. Use environment variables for all sensitive configuration

## Bot Commands

- `/start` - Start the bot and show main menu
- `/myorders` - View your orders
- `/chat` - Access your conversations
- `/help` - Show help message

## Integration with Hiwwer

The bot connects to Hiwwer's backend API to:
- Verify user identities
- Fetch order data
- Update order statuses
- Send and receive messages
- Create notifications

## Development

To extend the bot's functionality:
1. Add new command handlers in `main()`
2. Create new conversation states as needed
3. Implement new callback handlers for buttons
4. Add new API integrations in the respective functions
