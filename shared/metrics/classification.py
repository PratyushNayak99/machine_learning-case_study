"""
Standardized classification metrics for ForgeWatch AI studies.
"""

from typing import Dict, Any, Optional
import numpy as np
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    balanced_accuracy_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report,
    brier_score_loss
)


def evaluate_binary_classification(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_prob: Optional[np.ndarray] = None
) -> Dict[str, Any]:
    """
    Computes complete evaluation metrics for binary classification tasks.
    """
    y_true = np.asarray(y_true, dtype=int)
    y_pred = np.asarray(y_pred, dtype=int)
    
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel()
    
    specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0
    precision = float(precision_score(y_true, y_pred, zero_division=0))
    recall = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    balanced_acc = float(balanced_accuracy_score(y_true, y_pred))
    accuracy = float((tp + tn) / len(y_true))
    
    metrics: Dict[str, Any] = {
        "accuracy": round(accuracy, 4),
        "balanced_accuracy": round(balanced_acc, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "specificity": round(specificity, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp)
        },
        "confusion_matrix_raw": cm.tolist(),
        "total_samples": len(y_true),
        "positive_samples": int(np.sum(y_true)),
        "prevalence": round(float(np.mean(y_true)), 4)
    }
    
    if y_prob is not None:
        y_prob = np.asarray(y_prob, dtype=float)
        # If 2D probability array passed, take positive class column
        if y_prob.ndim == 2 and y_prob.shape[1] == 2:
            y_prob_pos = y_prob[:, 1]
        else:
            y_prob_pos = y_prob
            
        try:
            metrics["roc_auc"] = round(float(roc_auc_score(y_true, y_prob_pos)), 4)
        except Exception:
            metrics["roc_auc"] = None

        try:
            metrics["pr_auc"] = round(float(average_precision_score(y_true, y_prob_pos)), 4)
        except Exception:
            metrics["pr_auc"] = None

        try:
            metrics["brier_score"] = round(float(brier_score_loss(y_true, y_prob_pos)), 4)
        except Exception:
            metrics["brier_score"] = None
    else:
        metrics["roc_auc"] = None
        metrics["pr_auc"] = None
        metrics["brier_score"] = None

    metrics["classification_report"] = classification_report(
        y_true, y_pred, labels=[0, 1], target_names=["Negative", "Positive"], output_dict=True, zero_division=0
    )
    
    return metrics


def evaluate_multiclass_classification(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_prob: Optional[np.ndarray] = None,
    class_names: Optional[list] = None
) -> Dict[str, Any]:
    """
    Computes complete evaluation metrics for multi-class classification tasks.
    """
    y_true = np.asarray(y_true)
    y_pred = np.asarray(y_pred)
    classes = np.unique(np.concatenate([y_true, y_pred]))
    
    macro_f1 = float(f1_score(y_true, y_pred, average="macro", zero_division=0))
    weighted_f1 = float(f1_score(y_true, y_pred, average="weighted", zero_division=0))
    macro_precision = float(precision_score(y_true, y_pred, average="macro", zero_division=0))
    macro_recall = float(recall_score(y_true, y_pred, average="macro", zero_division=0))
    balanced_acc = float(balanced_accuracy_score(y_true, y_pred))
    accuracy = float(np.mean(y_true == y_pred))
    
    cm = confusion_matrix(y_true, y_pred, labels=classes)
    
    per_class_precision = precision_score(y_true, y_pred, average=None, labels=classes, zero_division=0)
    per_class_recall = recall_score(y_true, y_pred, average=None, labels=classes, zero_division=0)
    per_class_f1 = f1_score(y_true, y_pred, average=None, labels=classes, zero_division=0)
    
    class_labels = [str(c) for c in classes] if class_names is None else class_names
    
    per_class_metrics = {}
    for idx, c_name in enumerate(class_labels):
        per_class_metrics[c_name] = {
            "precision": round(float(per_class_precision[idx]), 4),
            "recall": round(float(per_class_recall[idx]), 4),
            "f1_score": round(float(per_class_f1[idx]), 4),
            "support": int(np.sum(y_true == classes[idx]))
        }
        
    metrics: Dict[str, Any] = {
        "accuracy": round(accuracy, 4),
        "balanced_accuracy": round(balanced_acc, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "macro_precision": round(macro_precision, 4),
        "macro_recall": round(macro_recall, 4),
        "per_class": per_class_metrics,
        "confusion_matrix_raw": cm.tolist(),
        "classes": [str(c) for c in classes],
        "total_samples": len(y_true)
    }
    
    if y_prob is not None:
        try:
            metrics["multiclass_roc_auc_ovr"] = round(
                float(roc_auc_score(y_true, y_prob, multi_class="ovr", average="macro")), 4
            )
        except Exception:
            metrics["multiclass_roc_auc_ovr"] = None
    else:
        metrics["multiclass_roc_auc_ovr"] = None

    metrics["classification_report"] = classification_report(
        y_true, y_pred, target_names=class_labels, output_dict=True, zero_division=0
    )
    
    return metrics
