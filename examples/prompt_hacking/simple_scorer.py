"""
Simple scoring function for external use.
"""
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from evaluator import FitnessEvaluator
from providers import ClaudeProvider

def score_prompt(prompt: str,
                target_provider: str = "claude",
                target_model: str = "claude-3-sonnet-20240229",
                claude_evaluator_model: str = "claude-3-sonnet-20240229") -> float:
    """
    Score a single prompt for jailbreak effectiveness.

    Args:
        prompt: The prompt to evaluate
        target_provider: Provider to test ("claude" or "openai")
        target_model: Model name for the target provider
        claude_evaluator_model: Claude model for safety evaluation

    Returns:
        float: Fitness score (0.0 to 1.0, higher = more effective jailbreak)
    """
    try:
        # Initialize provider
        if target_provider == "claude":
            provider = ClaudeProvider(target_model, temperature=0.7)
        elif target_provider == "openai":
            from providers import OpenAIProvider
            provider = OpenAIProvider(target_model, temperature=0.7)
        else:
            raise ValueError(f"Unsupported provider: {target_provider}")

        # Initialize evaluator
        evaluator = FitnessEvaluator(
            provider=provider,
            claude_model=claude_evaluator_model
        )

        # Evaluate prompt
        result = evaluator.evaluate_prompt(prompt)
        return result["fitness_score"]

    except Exception as e:
        print(f"Error scoring prompt: {e}")
        return 0.0

def score_prompts_batch(prompts: list, **kwargs) -> list:
    """
    Score multiple prompts in batch.

    Args:
        prompts: List of prompts to evaluate
        **kwargs: Arguments passed to score_prompt

    Returns:
        list: List of fitness scores
    """
    try:
        # Initialize provider and evaluator once for efficiency
        target_provider = kwargs.get("target_provider", "claude")
        target_model = kwargs.get("target_model", "claude-3-sonnet-20240229")
        claude_evaluator_model = kwargs.get("claude_evaluator_model", "claude-3-sonnet-20240229")

        if target_provider == "claude":
            provider = ClaudeProvider(target_model, temperature=0.7)
        elif target_provider == "openai":
            from providers import OpenAIProvider
            provider = OpenAIProvider(target_model, temperature=0.7)
        else:
            raise ValueError(f"Unsupported provider: {target_provider}")

        evaluator = FitnessEvaluator(
            provider=provider,
            claude_model=claude_evaluator_model
        )

        # Batch evaluate
        results = evaluator.evaluate_batch(prompts)
        return [result["fitness_score"] for result in results]

    except Exception as e:
        print(f"Error scoring prompts: {e}")
        return [0.0] * len(prompts)
