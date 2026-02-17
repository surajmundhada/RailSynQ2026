from __future__ import annotations

from typing import Any, Dict

from .base import OptimizerBackend, to_response
from .gnn import SimpleGnnScorer
from .subqubo import QuboInspiredOptimizer
from .milp import MilpOptimizer


class HybridOptimizer(OptimizerBackend):
    """Two-stage hybrid: GNN biases weights → MILP/QUBO final decision.

    - Stage 1: run GNN scorer to get bias scores b_i.
    - Stage 2: adjust train_weights' w_i' = α w_i + (1-α) b_i.
    - Stage 3: choose solver (MILP by default; QUBO if requested).
    """

    def optimize(self, request: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        alpha = float(request.get("hybrid_alpha", 0.7))
        solver_kind = str(request.get("hybrid_solver", "milp")).lower()

        # Stage 1: GNN scorer
        gnn = SimpleGnnScorer()
        gnn_res = gnn.optimize(request, context)
        bias_by_train = {r["train_id"]: float((r.get("priority_score") or 0.5) * 2.0 - 1.0) for r in gnn_res.get("recommendations", [])}

        # Stage 2: reweight
        base_weights = dict(context.get("train_weights", {}))
        for t in list(base_weights.keys()):
            b = bias_by_train.get(t, 0.0)
            base_weights[t] = float(alpha * base_weights[t] + (1.0 - alpha) * b)

        hybrid_context = dict(context)
        hybrid_context["train_weights"] = base_weights

        # Stage 3: final solver(s)
        explanations = ["Hybrid: GNN-bias + final MILP/QUBO", f"alpha={alpha}"] + gnn_res.get("explanations", [])

        if solver_kind in ("both", "ensemble", "all"):
            milp = MilpOptimizer().optimize(request, hybrid_context)
            qubo = QuboInspiredOptimizer().optimize(request, hybrid_context)
            explanations += milp.get("explanations", []) + qubo.get("explanations", [])

            # Ensemble: combine by max priority_score; break ties preferring MILP
            by_id: dict[str, dict] = {}
            for res in (milp, qubo):
                for r in res.get("recommendations", []):
                    t = r.get("train_id")
                    if not t:
                        continue
                    cur = by_id.get(t)
                    if cur is None or (r.get("priority_score", 0) or 0) > (cur.get("priority_score", 0) or 0):
                        by_id[t] = r
                    elif (r.get("priority_score", 0) or 0) == (cur.get("priority_score", 0) or 0):
                        # tie: prefer MILP if present
                        if res is milp:
                            by_id[t] = r
            combined = list(by_id.values())
            combined.sort(key=lambda r: r.get("priority_score", 0) or 0, reverse=True)
            return to_response(combined[:5], explanations)

        # Single solver path
        if solver_kind == "qubo":
            final_res = QuboInspiredOptimizer().optimize(request, hybrid_context)
        else:
            final_res = MilpOptimizer().optimize(request, hybrid_context)
        explanations += final_res.get("explanations", [])
        return to_response(final_res.get("recommendations", []), explanations)


