"""
Model evaluation and cost optimization module for Student 2: Scania APS Trucks.
Evaluates classifiers using asymmetric operational challenge cost (10*FP + 500*FN).
"""

from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np
from shared.metrics.classification import evaluate_binary_classification
from shared.metrics.cost_matrix import compute_scania_cost, optimize_threshold_for_cost


def evaluate_all_scania_models(
    models: Dict[str, Any],
    X_val: pd.DataFrame,
    y_val: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series,
    cost_fp: float = 10.0,
    cost_fn: float = 500.0
) -> Dict[str, Any]:
    """
    Evaluates models, tunes decision threshold on validation data to minimize operational cost,
    and applies tuned threshold to official test data.
    """
    results = {
        "validation": {},
        "test": {},
        "cost_analysis": {},
        "summary_table": []
    }
    
    for model_name, pipeline in models.items():
        # Validation probabilities
        if hasattr(pipeline, "predict_proba"):
            val_probs = pipeline.predict_proba(X_val)[:, 1]
            test_probs = pipeline.predict_proba(X_test)[:, 1]
            
            # Find optimal threshold on validation set
            best_th, val_min_cost, val_curve = optimize_threshold_for_cost(
                y_val.values, val_probs, cost_fp=cost_fp, cost_fn=cost_fn
            )
            
            # Default 0.5 predictions
            val_preds_default = (val_probs >= 0.5).astype(int)
            test_preds_default = (test_probs >= 0.5).astype(int)
            
            # Cost-optimized predictions using tuned threshold
            test_preds_tuned = (test_probs >= best_th).astype(int)
            
            val_cost_tuned = val_min_cost
            test_cost_default = compute_scania_cost(y_test.values, test_preds_default, cost_fp, cost_fn)
            test_cost_tuned = compute_scania_cost(y_test.values, test_preds_tuned, cost_fp, cost_fn)
            
        else:
            best_th = 0.5
            val_preds_default = pipeline.predict(X_val)
            test_preds_default = pipeline.predict(X_test)
            test_preds_tuned = test_preds_default
            val_probs = None
            test_probs = None
            val_curve = None
            val_cost_tuned = compute_scania_cost(y_val.values, val_preds_default, cost_fp, cost_fn)["total_cost"]
            test_cost_default = compute_scania_cost(y_test.values, test_preds_default, cost_fp, cost_fn)
            test_cost_tuned = test_cost_default

        val_metrics = evaluate_binary_classification(y_val.values, val_preds_default, val_probs)
        test_metrics_default = evaluate_binary_classification(y_test.values, test_preds_default, test_probs)
        test_metrics_tuned = evaluate_binary_classification(y_test.values, test_preds_tuned, test_probs)
        
        results["validation"][model_name] = {
            **val_metrics,
            "optimal_threshold": round(best_th, 4),
            "val_min_cost": val_cost_tuned
        }
        
        results["test"][model_name] = {
            **test_metrics_tuned,
            "default_0_5_metrics": test_metrics_default,
            "tuned_threshold": round(best_th, 4),
            "cost_default_0_5": test_cost_default["total_cost"],
            "cost_tuned": test_cost_tuned["total_cost"],
            "cost_details": test_cost_tuned
        }
        
        results["cost_analysis"][model_name] = {
            "optimal_threshold": round(best_th, 4),
            "val_cost_curve": val_curve,
            "test_cost_tuned": test_cost_tuned,
            "test_cost_default": test_cost_default
        }
        
        results["summary_table"].append({
            "model": model_name,
            "optimal_threshold": round(best_th, 4),
            "val_cost": val_cost_tuned,
            "val_f1": val_metrics["f1_score"],
            "test_cost_tuned (cost units)": test_cost_tuned["total_cost"],
            "test_cost_default (cost units)": test_cost_default["total_cost"],
            "test_fp": test_cost_tuned["fp_count"],
            "test_fn": test_cost_tuned["fn_count"],
            "test_precision": test_metrics_tuned["precision"],
            "test_recall": test_metrics_tuned["recall"],
            "test_f1": test_metrics_tuned["f1_score"],
            "test_pr_auc": test_metrics_tuned["pr_auc"] if test_metrics_tuned["pr_auc"] is not None else 0.0,
            "test_roc_auc": test_metrics_tuned["roc_auc"] if test_metrics_tuned["roc_auc"] is not None else 0.0
        })

    return results
