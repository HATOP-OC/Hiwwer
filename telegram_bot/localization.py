import json
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class Localization:
    """
    Handles loading and retrieving translated strings.
    """
    def __init__(self, locale_dir: str, default_lang: str = 'en'):
        self.locale_dir = locale_dir
        self.default_lang = default_lang
        self.translations = self._load_translations()

    def _load_translations(self) -> Dict[str, Dict[str, Any]]:
        """
        Loads all .json translation files from the specified directory.
        """
        translations = {}
        if not os.path.exists(self.locale_dir):
            logger.error(f"Locale directory not found: {self.locale_dir}")
            return {}

        for filename in os.listdir(self.locale_dir):
            if filename.endswith('.json'):
                lang_code = filename.split('.')[0]
                filepath = os.path.join(self.locale_dir, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        translations[lang_code] = json.load(f)
                        logger.info(f"Loaded translations for '{lang_code}' from {filename}")
                except (json.JSONDecodeError, IOError) as e:
                    logger.error(f"Failed to load translation file {filepath}: {e}")

        return translations

    def get_text(self, key: str, lang_code: str, **kwargs: Any) -> str:
        """
        Retrieves a translated string for a given key and language.

        Args:
            key: The key for the desired string (e.g., 'welcome_message').
            lang_code: The language code (e.g., 'en', 'uk').
            **kwargs: Placeholder values to format into the string.

        Returns:
            The translated and formatted string. Falls back to the default
            language if the key or language is not found.
        """
        # Fallback to default language if the requested language doesn't exist
        lang_dict = self.translations.get(lang_code)
        if not lang_dict:
            logger.warning(f"Language '{lang_code}' not found. Falling back to '{self.default_lang}'.")
            lang_dict = self.translations.get(self.default_lang, {})

        # Get the text, falling back to the default language if the key is missing
        text = lang_dict.get(key)
        if text is None:
            logger.warning(f"Key '{key}' not found for language '{lang_code}'. Falling back to default language.")
            text = self.translations.get(self.default_lang, {}).get(key, key) # Return the key itself as a final fallback

        # Format the string with any provided keyword arguments
        try:
            return text.format(**kwargs)
        except KeyError as e:
            logger.error(f"Missing placeholder in translation for key '{key}' in lang '{lang_code}': {e}")
            return text # Return unformatted text on error

# Initialize the localization service
# The path is relative to the project root where the bot is run
locale_path = os.path.join(os.path.dirname(__file__), 'locales')
translator = Localization(locale_path, default_lang='en')

# Expose a simple function for easy access
def get_text(key: str, lang_code: str, **kwargs: Any) -> str:
    # Ensure lang_code is not None and is a string
    safe_lang_code = lang_code if isinstance(lang_code, str) else 'en'
    return translator.get_text(key, safe_lang_code, **kwargs)