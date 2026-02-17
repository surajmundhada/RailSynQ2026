from __future__ import annotations

import math
import random
from typing import Any, Dict, List, Tuple

from .base import OptimizerBackend, to_response


class QuboInspiredOptimizer(OptimizerBackend):
    """QUBO-inspired binary decision model with simple simulated annealing.

    Decision variable x_i ∈ {0,1} per candidate train i:
      x_i = 1 → give_precedence; x_i = 0 → hold_for_clearance

    Objective (informal):
      minimize  -Σ w_i x_i  +  λ Σ_{(i,j) conflict} x_i x_j
    where w_i encodes utility (delay, congestion, platform conflict) and
    pairwise penalties penalize simultaneous precedence for conflicting trains.
    """

    def optimize(self, request: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        candidates: List[str] = context.get("candidate_trains", [])
        weights: Dict[str, float] = context.get("train_weights", {})
        conflicts: List[Tuple[str, str]] = context.get("pairwise_conflicts", [])

        if not candidates:
            return to_response([], ["QUBO: no candidates"])

        # Build index for quick lookups
        index_of: Dict[str, int] = {t: i for i, t in enumerate(candidates)}
        w: List[float] = [float(weights.get(t, 0.0)) for t in candidates]
        pairs: List[Tuple[int, int]] = []
        for a, b in conflicts:
            if a in index_of and b in index_of and a != b:
                i, j = index_of[a], index_of[b]
                if i > j:
                    i, j = j, i
                pairs.append((i, j))

        # Hyperparameters
        lambda_pair = float(request.get("qubo_lambda_pair", 0.7))
        max_steps = int(request.get("qubo_max_steps", 500))
        temperature = float(request.get("qubo_init_temp", 1.0))
        cooling_rate = float(request.get("qubo_cooling", 0.995))

        # Initialize with greedy by positive weight
        x: List[int] = [1 if wi > 0 else 0 for wi in w]

        def energy(assign: List[int]) -> float:
            # E = -Σ w_i x_i + λ Σ x_i x_j over conflict pairs
            linear = -sum(wi * xi for wi, xi in zip(w, assign))
            quad = 0.0
            for i, j in pairs:
                quad += assign[i] * assign[j]
            return linear + lambda_pair * quad

        def delta_energy(assign: List[int], k: int) -> float:
            # Compute change in energy if we flip x_k
            xk = assign[k]
            new_xk = 1 - xk
            delta_linear = -w[k] * (new_xk - xk)
            delta_quad = 0.0
            for i, j in pairs:
                if i == k:
                    delta_quad += (new_xk - xk) * assign[j]
                elif j == k:
                    delta_quad += (new_xk - xk) * assign[i]
            return delta_linear + lambda_pair * delta_quad

        best_x = list(x)
        best_e = energy(x)

        for _ in range(max_steps):
            k = random.randrange(len(x))
            dE = delta_energy(x, k)
            if dE < 0 or random.random() < math.exp(-dE / max(1e-6, temperature)):
                x[k] = 1 - x[k]
                e = best_e + dE
                if e < best_e:
                    best_e = e
                    best_x = list(x)
            temperature *= cooling_rate

        recommendations: List[Dict[str, Any]] = []
        explanations: List[str] = [
            "QUBO-inspired SA: minimize -Σ w_i x_i + λ Σ_{conflict} x_i x_j",
            f"lambda_pair={lambda_pair}, steps={max_steps}",
        ]
        for i, train_id in enumerate(candidates):
            action = "give_precedence" if best_x[i] == 1 else "hold_for_clearance"
            recommendations.append({
                "train_id": train_id,
                "action": action,
                "reason": f"QUBO weight={w[i]:.2f}",
                "priority_score": float(max(0.0, min(1.0, (w[i] + 1.0) / 2.0))),
            })

        recommendations.sort(key=lambda r: r.get("priority_score", 0), reverse=True)
        return to_response(recommendations[:5], explanations)


