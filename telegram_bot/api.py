import os
import logging
import aiohttp
from typing import Dict, Any, Optional

# Configure logging
logger = logging.getLogger(__name__)

class APIClient:
    """A client for interacting with the Hiwwer backend API."""

    def __init__(self, base_url: str):
        if not base_url:
            raise ValueError("API base URL is required.")
        self.base_url = base_url
        self._session = aiohttp.ClientSession()

    async def close(self):
        """Close the underlying aiohttp session."""
        await self._session.close()

    async def _request(self, method: str, endpoint: str, token: Optional[str] = None, json: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """
        Performs an asynchronous API request.

        Args:
            method: HTTP method (e.g., 'GET', 'POST').
            endpoint: API endpoint path.
            token: Optional JWT token for authentication.
            json: Optional JSON payload for the request.

        Returns:
            The JSON response from the API as a dictionary, or None if an error occurs.
        """
        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        url = f"{self.base_url}{endpoint}"
        logger.info(f"Making API request: {method} {url}")

        try:
            async with self._session.request(method, url, headers=headers, json=json) as response:
                response.raise_for_status()
                return await response.json()
        except aiohttp.ClientResponseError as e:
            logger.error(f"API request failed with status {e.status}: {e.message}")
            return None
        except aiohttp.ClientError as e:
            logger.error(f"API request failed: {e}")
            return None

    async def get_user_by_telegram(self, telegram_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a user's data by their Telegram ID."""
        return await self._request("GET", f"/users/by-telegram/{telegram_id}")

    async def get_orders(self, token: str) -> Optional[list]:
        """Fetch all orders for the authenticated user."""
        return await self._request("GET", "/orders", token=token)

    async def get_order_details(self, order_id: str, token: str) -> Optional[Dict[str, Any]]:
        """Fetch the details of a specific order."""
        return await self._request("GET", f"/orders/{order_id}", token=token)

    async def get_messages(self, order_id: str, token: str) -> Optional[list]:
        """Fetch messages for a specific order."""
        return await self._request("GET", f"/orders/{order_id}/messages", token=token)

    async def post_message(self, order_id: str, content: str, token: str) -> Optional[Dict[str, Any]]:
        """Post a new message to an order's chat."""
        return await self._request("POST", f"/orders/{order_id}/messages", token=token, json={"content": content})

    async def update_order_status(self, order_id: str, status: str, token: str) -> Optional[Dict[str, Any]]:
        """Update the status of an order."""
        return await self._request("PATCH", f"/orders/{order_id}", token=token, json={"status": status})

    async def update_language(self, language_code: str, token: str) -> Optional[Dict[str, Any]]:
        """Update the user's language preference."""
        return await self._request("PATCH", "/users/profile/language", token=token, json={"languageCode": language_code})

    async def get_assistant_reply(self, message: str, session_id: str) -> Optional[Dict[str, Any]]:
        """Get a reply from the AI assistant."""
        return await self._request("POST", "/assistant", json={"message": message, "sessionId": session_id})

    async def link_telegram_account(self, code: str, telegram_id: str, telegram_username: Optional[str], chat_id: str) -> Optional[Dict[str, Any]]:
        """Link a Telegram account to a web user account using a linking code."""
        payload = {
            "code": code,
            "telegramId": telegram_id,
            "telegramUsername": telegram_username,
            "chatId": chat_id,
        }
        return await self._request("POST", "/auth/link-telegram-account", json=payload)

# Singleton instance of the API client
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:8080/v1")
api_client = APIClient(BACKEND_API_URL)