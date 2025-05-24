"""
LLM provider implementations for generating responses to adversarial prompts.
Now includes Claude support for both generation and safety evaluation.
"""

from __future__ import annotations
import os
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    def __init__(self, model_name: str, temperature: float = 0.7):
        self.model_name = model_name
        self.temperature = temperature

    @abstractmethod
    def generate_response(self, prompt: str) -> str:
        """Generate a response to the given prompt."""
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI API provider for GPT models."""

    def __init__(self, model_name: str = "gpt-3.5-turbo", temperature: float = 0.7):
        super().__init__(model_name, temperature)
        self.api_key = os.getenv("OPEN_AI_KEY")
        if not self.api_key:
            raise ValueError("OPEN_AI_KEY environment variable not set")

    def generate_response(self, prompt: str) -> str:
        """Generate response using OpenAI API."""
        try:
            import openai
            openai.api_key = self.api_key

            completion = openai.ChatCompletion.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            raise RuntimeError(f"OpenAI API error: {e}")


# class GeminiProvider(LLMProvider):
#     """Google Gemini API provider."""

#     def __init__(self, model_name: str = "gemini-pro", temperature: float = 0.7):
#         super().__init__(model_name, temperature)
#         self.api_key = os.getenv("GOOGLE_API_KEY")
#         if not self.api_key:
#             raise ValueError("GOOGLE_API_KEY environment variable not set")

#     def generate_response(self, prompt: str) -> str:
#         """Generate response using Gemini API."""
#         try:
#             import google.generativeai as genai
#             genai.configure(api_key=self.api_key)

#             model = genai.GenerativeModel(self.model_name)
#             resp = model.generate_content(
#                 prompt,
#                 generation_config={"temperature": self.temperature}
#             )
#             return resp.text
#         except Exception as e:
#             raise RuntimeError(f"Gemini API error: {e}")


class ClaudeProvider(LLMProvider):
    """Anthropic Claude API provider."""

    def __init__(self, model_name: str = "claude-3-5-haiku-20241022", temperature: float = 0.7):
        super().__init__(model_name, temperature)
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")

    def generate_response(self, prompt: str) -> str:
        """Generate response using Claude API."""
        try:
            import anthropic

            client = anthropic.Anthropic(api_key=self.api_key)

            response = client.messages.create(
                model=self.model_name,
                max_tokens=4000,
                temperature=self.temperature,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            return response.content[0].text if response.content else ""
        except Exception as e:
            raise RuntimeError(f"Claude API error: {e}")
