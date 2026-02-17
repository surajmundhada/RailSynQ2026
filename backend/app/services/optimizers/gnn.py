from __future__ import annotations

from typing import Any, Dict, List

import torch

from .base import OptimizerBackend, to_response


class SimpleGnnScorer(OptimizerBackend):
    """Lightweight placeholder GNN-like scorer using PyTorch tensors.

    This is a stub that aggregates simplistic node/edge features to produce a bias
    score per train. It does not implement a full GNN architecture but keeps
    the integration points ready for future expansion.
    """

    def optimize(self, request: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        trains: List[str] = context.get("candidate_trains", [])
        base_weights: Dict[str, float] = context.get("train_weights", {})
        # edge list: (u_index, v_index)
        edges: List[tuple[int, int]] = context.get("graph_edges", [])

        if not trains:
            return to_response([], ["GNN: no candidates"])

        num_nodes = len(trains)
        idx = {t: i for i, t in enumerate(trains)}

        node_feat = torch.zeros((num_nodes, 2), dtype=torch.float32)
        for t, i in idx.items():
            w = float(base_weights.get(t, 0.0))
            node_feat[i, 0] = w
            node_feat[i, 1] = 1.0  # bias term

        if edges:
            adj = torch.zeros((num_nodes, num_nodes), dtype=torch.float32)
            for u, v in edges:
                if 0 <= u < num_nodes and 0 <= v < num_nodes and u != v:
                    adj[u, v] = 1.0
                    adj[v, u] = 1.0
            agg = torch.matmul(adj, node_feat) / torch.clamp(adj.sum(dim=1, keepdim=True), min=1.0)
        else:
            agg = node_feat.clone()

        # Simple linear layer stand-in
        W = torch.tensor([[0.8, 0.2], [0.3, 0.1]], dtype=torch.float32)
        out = torch.matmul(agg, W).sum(dim=1)
        scores = torch.tanh(out)

        recommendations: List[Dict[str, Any]] = []
        for t, i in idx.items():
            s = float(scores[i].item())
            recommendations.append({
                "train_id": t,
                "action": "give_precedence" if s >= 0 else "hold_for_clearance",
                "reason": f"GNN bias score={s:.2f}",
                "priority_score": float(max(0.0, min(1.0, (s + 1.0) / 2.0))),
            })

        recommendations.sort(key=lambda r: r.get("priority_score", 0), reverse=True)
        return to_response(recommendations[:5], ["GNN: simple neighborhood aggregation over weights"])


