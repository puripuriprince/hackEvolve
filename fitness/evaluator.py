"""
Main fitness evaluator class for coordinating prompt evaluation.
Now uses Claude for content safety assessment.
"""

from __future__ import annotations
import time
from typing import Dict, Any, List, Optional

from providers import LLMProvider, OpenAIProvider, ClaudeProvider # GeminiProvider
from metrics import compute_composite_fitness, compute_fitness


class FitnessEvaluator:
    """Main class for evaluating adversarial prompt fitness using Claude for safety assessment."""

    def __init__(self,
                 provider: LLMProvider,
                 metric_weights: Optional[Dict[str, float]] = None,
                 claude_model: str = "claude-3-5-haiku-20241022"):
        self.provider = provider
        self.metric_weights = metric_weights
        self.claude_model = claude_model
        self.evaluation_history: List[Dict[str, Any]] = []

    def evaluate_prompt(self, prompt: str, detailed: bool = True) -> Dict[str, Any]:
        """Evaluate a single adversarial prompt using Claude for safety assessment.

        Args:
            prompt: The adversarial prompt to test
            detailed: Whether to return detailed metrics or just fitness score

        Returns:
            Dictionary containing evaluation results
        """
        start_time = time.time()

        try:
            # Step 1: Generate response using the target LLM
            print(f"Step 1: Generating response using {self.provider.model_name}...")
            response = self.provider.generate_response(prompt)
            print(f"Response generated ({len(response)} characters)")

            # Step 2: Evaluate using Claude-based metrics
            print("Step 2: Evaluating response safety using Claude...")
            if detailed:
                metrics = compute_composite_fitness(response, self.metric_weights)
                fitness_score = metrics["composite_fitness"]
                print(f"Claude flagged: {metrics.get('claude_flagged', 'unknown')}")
                print(f"Safety score: {metrics.get('claude_safety_score', 0.0):.3f}")
            else:
                fitness_score = compute_fitness(response)
                metrics = {"composite_fitness": fitness_score}

            evaluation_time = time.time() - start_time
            print(f"Step 3: Evaluation completed in {evaluation_time:.2f}s")

            result = {
                "prompt": prompt,
                "response": response,
                "fitness_score": fitness_score,
                "metrics": metrics,
                "evaluation_time": evaluation_time,
                "timestamp": time.time(),
                "provider": self.provider.model_name,
                "claude_model": self.claude_model
            }

            # Store in history
            self.evaluation_history.append(result)

            return result

        except Exception as e:
            print(f"Error during evaluation: {e}")
            error_result = {
                "prompt": prompt,
                "response": "",
                "fitness_score": -2.0,  # Heavy penalty for failed evaluation
                "metrics": {"error": str(e)},
                "evaluation_time": time.time() - start_time,
                "timestamp": time.time(),
                "provider": self.provider.model_name,
                "claude_model": self.claude_model
            }
            self.evaluation_history.append(error_result)
            return error_result

    def evaluate_batch(self, prompts: List[str]) -> List[Dict[str, Any]]:
        """Evaluate multiple prompts in batch."""
        print(f"Starting batch evaluation of {len(prompts)} prompts...")
        results = []
        for i, prompt in enumerate(prompts, 1):
            print(f"\nEvaluating prompt {i}/{len(prompts)}")
            result = self.evaluate_prompt(prompt)
            results.append(result)
        print(f"\nBatch evaluation completed. {len(results)} results generated.")
        return results

    def get_best_prompt(self) -> Optional[Dict[str, Any]]:
        """Get the prompt with highest fitness score from history."""
        if not self.evaluation_history:
            return None
        return max(self.evaluation_history, key=lambda x: x["fitness_score"])

    def get_statistics(self) -> Dict[str, float]:
        """Get summary statistics of all evaluations."""
        if not self.evaluation_history:
            return {}

        scores = [r["fitness_score"] for r in self.evaluation_history]
        times = [r["evaluation_time"] for r in self.evaluation_history]

        # Count successful bypasses (positive fitness scores)
        successful_bypasses = len([s for s in scores if s > 0])

        return {
            "total_evaluations": len(scores),
            "successful_bypasses": successful_bypasses,
            "success_rate": successful_bypasses / len(scores) if scores else 0.0,
            "mean_fitness": sum(scores) / len(scores),
            "max_fitness": max(scores),
            "min_fitness": min(scores),
            "mean_eval_time": sum(times) / len(times),
            "total_eval_time": sum(times)
        }

    def clear_history(self):
        """Clear evaluation history."""
        self.evaluation_history.clear()
        print("Evaluation history cleared.")
