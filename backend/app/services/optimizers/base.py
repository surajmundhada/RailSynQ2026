from __future__ import annotations

from typing import Any, Dict, List


class OptimizerBackend:
    def optimize(self, request: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError


def to_response(recommendations: List[Dict[str, Any]], explanations: List[str]) -> Dict[str, Any]:
    return {
        "recommendations": recommendations,
        "explanations": explanations,
    }


