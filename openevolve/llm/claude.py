import asyncio
import logging
import os
from typing import Any, Dict, List, Optional
import json

import anthropic

from openevolve.config import LLMConfig
from openevolve.llm.base import LLMInterface

logger = logging.getLogger(__name__)


class ClaudeLLM(LLMInterface):
    """LLM interface using the Anthropic API"""

    def __init__(
        self,
        config: LLMConfig,
        model: Optional[str] = None,
    ):
        self.config = config
        # Use the provided model name or default to a common Claude model
        self.model = model or "claude-3-5-sonnet-20240620"

        chosen_api_key: Optional[str] = None
        key_source: str = "None"

        # Attempt to get API key from LLMConfig first
        if hasattr(self.config, 'anthropic_api_key') and self.config.anthropic_api_key:
            chosen_api_key = self.config.anthropic_api_key
            key_source = "LLMConfig (e.g., from YAML)"
            logger.info("Using Anthropic API key from LLMConfig.")

        # If not found in LLMConfig, try environment variable
        if not chosen_api_key:
            env_api_key = os.environ.get("ANTHROPIC_API_KEY")
            if env_api_key:
                chosen_api_key = env_api_key
                key_source = "environment variable ANTHROPIC_API_KEY"
                logger.info("Using Anthropic API key from environment variable ANTHROPIC_API_KEY.")
            else:
                logger.error(
                    "Anthropic API key not found in LLMConfig (anthropic_api_key field) "
                    "or in ANTHROPIC_API_KEY environment variable."
                )
                raise ValueError(
                    "Anthropic API key not provided in config or environment variable."
                )

        # At this point, chosen_api_key should be set.
        # You can add a print or logger.debug here to verify the key before it's used:
        # logger.debug(f"Final Anthropic API key to be used (from {key_source}): '{chosen_api_key}'")
        # print(f"DEBUG: Final Anthropic API key from {key_source}: '{chosen_api_key}'")
        print(f"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print(f"DEBUG OPENEVOLVE: Attempting to initialize Anthropic client in ClaudeLLM.")
        print(f"DEBUG OPENEVOLVE: Key source: {key_source}")
        print(f"DEBUG OPENEVOLVE: API Key being used: '[{chosen_api_key}]'") # Print with brackets to see whitespace
        print(f"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")


        try:
            self.client = anthropic.Anthropic(api_key=chosen_api_key)
            logger.info(
                f"Successfully initialized Anthropic client for model: {self.model} "
                f"using API key obtained from {key_source}."
            )
        except Exception as e:
            logger.error(
                f"Failed to initialize Anthropic client using API key from {key_source}. Error: {e}"
            )
            raise

    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from a prompt"""
        # Claude API uses messages format, so convert prompt
        messages = [{"role": "user", "content": prompt}]
        return await self.generate_with_context(
            system_message=self.config.system_message,
            messages=messages,
            **kwargs,
        )

    async def generate_with_context(
        self, system_message: str, messages: List[Dict[str, str]], **kwargs
    ) -> str:
        """Generate text using a system message and conversational context"""
        # Prepare messages for Claude API
        # Claude API expects system message separately or as a system role message
        # Let's use the system parameter for clarity

        # Set up generation parameters
        params = {
            "model": self.model,
            "messages": messages,
            "temperature": kwargs.get("temperature", self.config.temperature),
            "top_p": kwargs.get("top_p", self.config.top_p),
            "max_tokens": kwargs.get("max_tokens", self.config.max_tokens),
            "system": system_message, # Claude uses a dedicated system parameter
        }

        # Attempt the API call with retries
        retries = kwargs.get("retries", self.config.retries)
        retry_delay = kwargs.get("retry_delay", self.config.retry_delay)
        timeout = kwargs.get("timeout", self.config.timeout)

        for attempt in range(retries + 1):
            try:
                # Use asyncio to run the blocking API call in a thread pool
                loop = asyncio.get_event_loop()

                # Ensure client is not None (should be initialized in __init__)
                if self.client is None:
                    logger.error("Anthropic client is not initialized.")
                    raise RuntimeError("Anthropic client not initialized before use.")

                # <<< START DEBUG >>>
                print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                print(f"DEBUG OPENEVOLVE: About to call Claude API. Attempt {attempt + 1}/{retries + 1}")
                print(f"DEBUG OPENEVOLVE: Parameters for client.messages.create():")
                print(json.dumps(params, indent=2))
                print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                if os.environ.get("PAUSE_BEFORE_API_CALL") == "true": # Add a condition for pausing
                    input("Press Enter to continue with API call or Ctrl+C to abort...")
                # <<< END DEBUG >>>

                response = await loop.run_in_executor(
                    None, lambda: self.client.messages.create(**params)
                )

                # Extract the response content
                # Claude's response structure is different from OpenAI
                # It returns a Message object with content as a list of ContentBlock
                # We expect text content here.
                if response.content and response.content[0].type == 'text':
                     return response.content[0].text
                else:
                     logger.error("Unexpected response format from Claude API")
                     raise ValueError("Unexpected response format from Claude API")

            except anthropic.APIConnectionError as e: # More specific error handling
                logger.warning(f"Anthropic API connection error: {e}. Attempt {attempt + 1}/{retries + 1}")
                if attempt >= retries: raise
                await asyncio.sleep(retry_delay)
            except anthropic.RateLimitError as e: # More specific error handling
                logger.warning(f"Anthropic API rate limit error: {e}. Attempt {attempt + 1}/{retries + 1}. Retrying after delay...")
                if attempt >= retries: raise
                # Consider longer delay for rate limits if appropriate
                await asyncio.sleep(kwargs.get("rate_limit_delay", retry_delay * 2))
            except anthropic.APIStatusError as e: # Catches 401, 403, 429, 500 series etc.
                logger.error(f"Anthropic API status error: {e.status_code} - {e.response.text}. Attempt {attempt + 1}/{retries + 1}")
                # If it's an authentication error, retrying won't help.
                if isinstance(e, anthropic.AuthenticationError):
                    logger.error("AuthenticationError with Anthropic API. Check your API key.")
                    raise  # Re-raise immediately for auth errors
                if attempt >= retries: raise
                await asyncio.sleep(retry_delay)
            except asyncio.TimeoutError: # This is for the asyncio.wait_for if we were using it directly around run_in_executor
                logger.warning(f"Asyncio TimeoutError during Anthropic call on attempt {attempt + 1}/{retries + 1}. Retrying...")
                if attempt >= retries: raise
                await asyncio.sleep(retry_delay)
            except Exception as e: # General catch-all for other unexpected errors
                logger.error(
                    f"Unexpected error during Anthropic call on attempt {attempt + 1}/{retries + 1}: {type(e).__name__} - {str(e)}. Retrying..."
                )
                if attempt >= retries: raise
                await asyncio.sleep(retry_delay)

        # Should not be reached if all retries fail and an exception is raised.
        # Adding a fallback return or raise to satisfy linters/type checkers if necessary.
        raise RuntimeError("All retry attempts to call Anthropic API failed.")
