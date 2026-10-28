"""
Model evaluation module for Student 1: AI4I 2020.
Evaluates all five classifiers on identical validation and test partitions.
"""

from typing import Dict, Any, List
import pandas as pd
from shared.metrics.classification import evaluate_binary_classification


def evaluate_all_ai4i_models(
    models: Dict[str, Any],
    X_val: pd.DataFrame,
    y_val: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series
) -> Dict[str, Any]:
    """
    Evaluates all trained pipelines on both validation and held-out test sets.
    """
    results = {
        "validation": {},
        "test": {},
        "summary_table": []
    }
    
    for model_name, pipeline in models.items():
        # Validation Evaluation
        y_val_pred = pipeline.predict(X_val)
        y_val_prob = pipeline.predict_proba(X_val) if hasattr(pipeline, "predict_proba") else None
        val_metrics = evaluate_binary_classification(y_val, y_val_pred, y_val_prob)
        results["validation"][model_name] = val_metrics
        
        # Test Evaluation
        y_test_pred = pipeline.predict(X_test)
        y_test_prob = pipeline.predict_proba(X_test) if hasattr(pipeline, "predict_proba") else None
        test_metrics = evaluate_binary_classification(y_test, y_test_pred, y_test_prob)
        results["test"][model_name] = test_metrics
        
        results["summary_table"].append({
            "model": model_name,
            "val_f1": val_metrics["f1_score"],
            "val_pr_auc": val_metrics["pr_auc"] if val_metrics["pr_auc"] is not None else 0.0,
            "val_roc_auc": val_metrics["roc_auc"] if val_metrics["roc_auc"] is not None else 0.0,
            "val_balanced_acc": val_metrics["balanced_accuracy"],
            "test_precision": test_metrics["precision"],
            "test_recall": test_metrics["recall"],
            "test_f1": test_metrics["f1_score"],
            "test_pr_auc": test_metrics["pr_auc"] if test_metrics["pr_auc"] is not None else 0.0,
            "test_roc_auc": test_metrics["roc_auc"] if test_metrics["roc_auc"] is not None else 0.0,
            "test_balanced_acc": test_metrics["balanced_accuracy"],
            "test_tp": test_metrics["confusion_matrix"]["tp"],
            "test_fp": test_metrics["confusion_matrix"]["fp"],
            "test_fn": test_metrics["confusion_matrix"]["fn"],
            "test_tn": test_metrics["confusion_matrix"]["tn"]
        })

    return results
