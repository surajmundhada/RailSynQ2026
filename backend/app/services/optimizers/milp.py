from __future__ import annotations

from typing import Any, Dict, List, Tuple

from ortools.linear_solver import pywraplp

from .base import OptimizerBackend, to_response


class MilpOptimizer(OptimizerBackend):
    """MILP using OR-Tools for precedence/platform selection with simple constraints.

    Binary y_i: give precedence to train i.
    Maximize Σ w_i y_i subject to:
      - For each conflict pair (i,j), y_i + y_j ≤ 1 (avoid simultaneous precedence)
    """

    def optimize(self, request: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        candidates: List[str] = context.get("candidate_trains", [])
        weights: Dict[str, float] = context.get("train_weights", {})
        conflicts: List[Tuple[str, str]] = context.get("pairwise_conflicts", [])

        if not candidates:
            return to_response([], ["MILP: no candidates"])

        solver = pywraplp.Solver.CreateSolver("CBC")
        if solver is None:
            return to_response([], ["MILP: solver unavailable"])

        vars_by_train: Dict[str, pywraplp.Variable] = {}
        for t in candidates:
            vars_by_train[t] = solver.BoolVar(f"y_{t}")

        # Objective
        objective = solver.Objective()
        for t in candidates:
            objective.SetCoefficient(vars_by_train[t], float(weights.get(t, 0.0)))
        objective.SetMaximization()

        # Conflict constraints
        for a, b in conflicts:
            if a in vars_by_train and b in vars_by_train and a != b:
                ct = solver.Constraint(-solver.infinity(), 1, f"conf_{a}_{b}")
                ct.SetCoefficient(vars_by_train[a], 1)
                ct.SetCoefficient(vars_by_train[b], 1)

        # Optional: limit number of precedence trains
        k_limit = int(request.get("milp_max_precedence", 5))
        if k_limit > 0:
            ct = solver.Constraint(-solver.infinity(), k_limit, "limit_precedence")
            for t in candidates:
                ct.SetCoefficient(vars_by_train[t], 1)

        status = solver.Solve()
        if status not in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
            return to_response([], ["MILP: infeasible or no solution"])

        recommendations: List[Dict[str, Any]] = []
        explanations: List[str] = ["MILP: maximize weighted precedence under conflict constraints"]
        for t in candidates:
            val = vars_by_train[t].solution_value()
            action = "give_precedence" if val >= 0.5 else "hold_for_clearance"
            score = float(max(0.0, min(1.0, (weights.get(t, 0.0) + 1.0) / 2.0)))
            recommendations.append({
                "train_id": t,
                "action": action,
                "reason": "MILP decision",
                "priority_score": score,
            })

        recommendations.sort(key=lambda r: r.get("priority_score", 0), reverse=True)
        return to_response(recommendations[:5], explanations)


