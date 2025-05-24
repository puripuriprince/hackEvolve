"""
Fitness module for evaluating adversarial prompt effectiveness.

This module provides tools for scoring how well prompts can bypass
LLM security features, using Claude for content evaluation.
"""

from .evaluator import FitnessEvaluator
from .metrics import (
    claude_safety_check,
    perspective_toxicity,
    compute_composite_fitness
)
from .providers import LLMProvider, OpenAIProvider, ClaudeProvider #, GeminiProvider

__all__ = [
    'FitnessEvaluator',
    'claude_safety_check',
    'perspective_toxicity',
    'compute_composite_fitness',
    'LLMProvider',
    'OpenAIProvider',
    'GeminiProvider',
    'ClaudeProvider'
]
