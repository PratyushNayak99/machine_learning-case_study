"""
Model evaluation module for Student 3: Condition Monitoring of Hydraulic Systems.
Evaluates multi-class condition models across validation and test partitions.
"""

from typing import Dict, Any
import pandas as pd
from shared.metrics.classification import evaluate_multiclass_classification


def evaluate_all_hydraulic_models(
    models: Dict[str, Any],
    X_val: pd.DataFrame,
    y_val: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series
) -> Dict[str, Any]:
    results = {
        "validation": {},
        "test": {},
        "summary_table": []
    }
    
    class_names = ["Total Failure (3)", "Reduced Efficiency (20)", "Full Efficiency (100)"]
    
    for model_name, pipeline in models.items():
        # Validation
        y_val_pred = pipeline.predict(X_val)
        y_val_prob = pipeline.predict_proba(X_val) if hasattr(pipeline, "predict_proba") else None
        val_metrics = evaluate_multiclass_classification(y_val.values, y_val_pred, y_val_prob, class_names=class_names)
        results["validation"][model_name] = val_metrics
        
        # Test
        y_test_pred = pipeline.predict(X_test)
        y_test_prob = pipeline.predict_proba(X_test) if hasattr(pipeline, "predict_proba") else None
        test_metrics = evaluate_multiclass_classification(y_test.values, y_test_pred, y_test_prob, class_names=class_names)
        results["test"][model_name] = test_metrics
        
        results["summary_table"].append({
            "model": model_name,
            "val_macro_f1": val_metrics["macro_f1"],
            "val_balanced_acc": val_metrics["balanced_accuracy"],
            "test_accuracy": test_metrics["accuracy"],
            "test_macro_f1": test_metrics["macro_f1"],
            "test_weighted_f1": test_metrics["weighted_f1"],
            "test_balanced_acc": test_metrics["balanced_accuracy"],
            "test_recall_failure_3": test_metrics["per_class"]["Total Failure (3)"]["recall"],
            "test_recall_reduced_20": test_metrics["per_class"]["Reduced Efficiency (20)"]["recall"],
            "test_recall_optimal_100": test_metrics["per_class"]["Full Efficiency (100)"]["recall"]
        })
        
    return results
