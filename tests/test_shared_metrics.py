"""
Unit tests for ForgeWatch AI shared metrics and validation utilities.
"""

import numpy as np
import pandas as pd
import pytest
from shared.data_validation.validator import (
    validate_schema,
    profile_missingness,
    check_target_distribution,
    check_leakage_columns,
    DataValidationError
)
from shared.metrics.classification import (
    evaluate_binary_classification,
    evaluate_multiclass_classification
)
from shared.metrics.cost_matrix import (
    compute_scania_cost,
    optimize_threshold_for_cost
)


def test_validate_schema():
    df = pd.DataFrame({"col_a": [1, 2], "col_b": ["x", "y"]})
    report = validate_schema(df, expected_columns=["col_a", "col_b"])
    assert report["is_valid"] is True
    assert report["missing_columns"] == []
    assert report["row_count"] == 2


def test_leakage_detector():
    df = pd.DataFrame({"temp": [300, 305], "failure_flag": [0, 1]})
    with pytest.raises(DataValidationError):
        check_leakage_columns(df, forbidden_cols=["failure_flag", "other"])


def test_binary_metrics():
    y_true = np.array([0, 0, 1, 1])
    y_pred = np.array([0, 1, 0, 1])
    y_prob = np.array([0.1, 0.7, 0.2, 0.9])
    
    metrics = evaluate_binary_classification(y_true, y_pred, y_prob)
    assert metrics["confusion_matrix"]["tp"] == 1
    assert metrics["confusion_matrix"]["fp"] == 1
    assert metrics["confusion_matrix"]["fn"] == 1
    assert metrics["confusion_matrix"]["tn"] == 1
    assert metrics["accuracy"] == 0.5
    assert metrics["roc_auc"] is not None
    assert metrics["pr_auc"] is not None


def test_multiclass_metrics():
    y_true = np.array([3, 20, 100, 3, 20, 100])
    y_pred = np.array([3, 20, 100, 3, 20, 20])
    metrics = evaluate_multiclass_classification(y_true, y_pred)
    assert metrics["accuracy"] == round(5/6, 4)
    assert "3" in metrics["per_class"]
    assert "20" in metrics["per_class"]
    assert "100" in metrics["per_class"]


def test_scania_cost_computation():
    y_true = np.array([0, 0, 1, 1])
    y_pred = np.array([0, 1, 0, 1])
    cost_info = compute_scania_cost(y_true, y_pred, cost_fp=10, cost_fn=500)
    # 1 FP * 10 + 1 FN * 500 = 510
    assert cost_info["total_cost"] == 510.0
    assert cost_info["fp_count"] == 1
    assert cost_info["fn_count"] == 1
