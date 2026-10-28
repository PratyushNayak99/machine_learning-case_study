"""
Operational cost matrix utilities for maintenance failure detection.
"""

from typing import Dict, Any, Tuple, Optional
import numpy as np
from sklearn.metrics import confusion_matrix


def compute_scania_cost(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    cost_fp: float = 10.0,
    cost_fn: float = 500.0
) -> Dict[str, Any]:
    """
    Computes total operational maintenance cost based on the official Scania Challenge cost formulation:
    Cost = (Cost_FP * FP) + (Cost_FN * FN)
    
    Default parameters:
    - Cost_FP = $10 (Unnecessary workshop inspection)
    - Cost_FN = $500 (Unaddressed failure leading to roadside breakdown)
    """
    y_true = np.asarray(y_true, dtype=int)
    y_pred = np.asarray(y_pred, dtype=int)
    
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel()
    
    total_cost = float((cost_fp * fp) + (cost_fn * fn))
    cost_per_sample = total_cost / len(y_true) if len(y_true) > 0 else 0.0
    
    # Theoretical worst-case cost (classifying all as negative)
    all_neg_cost = float(cost_fn * np.sum(y_true))
    savings_pct = ((all_neg_cost - total_cost) / all_neg_cost * 100.0) if all_neg_cost > 0 else 0.0
    
    return {
        "cost_fp_unit": cost_fp,
        "cost_fn_unit": cost_fn,
        "fp_count": int(fp),
        "fn_count": int(fn),
        "tp_count": int(tp),
        "tn_count": int(tn),
        "total_cost": total_cost,
        "cost_per_sample": round(cost_per_sample, 2),
        "all_negative_cost": all_neg_cost,
        "cost_savings_pct": round(savings_pct, 2)
    }


def optimize_threshold_for_cost(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    cost_fp: float = 10.0,
    cost_fn: float = 500.0,
    threshold_steps: int = 100
) -> Tuple[float, float, Dict[str, Any]]:
    """
    Sweeps probability thresholds to find the optimal decision boundary minimizing operational maintenance cost.
    
    Returns:
    - best_threshold: Threshold yielding minimum cost
    - min_cost: The minimum cost achieved
    - cost_curve: Dictionary of tested thresholds and corresponding costs
    """
    y_true = np.asarray(y_true, dtype=int)
    y_prob = np.asarray(y_prob, dtype=float)
    if y_prob.ndim == 2:
        y_prob = y_prob[:, 1]
        
    thresholds = np.linspace(0.01, 0.99, threshold_steps)
    costs = []
    
    best_threshold = 0.5
    min_cost = float("inf")
    best_cost_info = {}
    
    for th in thresholds:
        y_pred = (y_prob >= th).astype(int)
        cost_info = compute_scania_cost(y_true, y_pred, cost_fp=cost_fp, cost_fn=cost_fn)
        cost_val = cost_info["total_cost"]
        costs.append(cost_val)
        
        if cost_val < min_cost:
            min_cost = cost_val
            best_threshold = float(th)
            best_cost_info = cost_info

    curve_data = {
        "thresholds": [round(float(t), 4) for t in thresholds],
        "costs": [float(c) for c in costs],
        "best_threshold": round(best_threshold, 4),
        "min_cost": min_cost,
        "best_metrics": best_cost_info
    }
    
    return best_threshold, min_cost, curve_data
