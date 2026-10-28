"""
Unit and integration tests for Student 1 (AI4I 2020) pipeline and models.
"""

import os
import json
import joblib
import pandas as pd
import pytest

from students.student_1.preprocessing.clean_data import clean_ai4i_data
from students.student_1.preprocessing.split_data import split_ai4i_data
from students.student_1.models.logistic_regression.train import train_logistic_regression
from students.student_1.models.decision_tree.train import train_decision_tree
from students.student_1.models.random_forest.train import train_random_forest
from students.student_1.models.gradient_boosting.train import train_gradient_boosting
from students.student_1.models.dummy_baseline.train import train_dummy_baseline

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STUDENT_1_DIR = os.path.join(BASE_DIR, "students", "student_1")


def test_student_1_data_leakage_prevention():
    raw_path = os.path.join(STUDENT_1_DIR, "dataset", "raw", "ai4i2020.csv")
    assert os.path.exists(raw_path), "Raw AI4I dataset must exist."
    raw_df = pd.read_csv(raw_path)
    X, y = clean_ai4i_data(raw_df)
    
    # Must NOT contain leakage columns
    forbidden = ["TWF", "HDF", "PWF", "OSF", "RNF", "UDI", "Product ID", "Machine failure"]
    for col in forbidden:
        assert col not in X.columns, f"Forbidden column '{col}' leaked into feature matrix!"


def test_student_1_split_stratification():
    X_train, X_val, X_test, y_train, y_val, y_test = split_ai4i_data(random_state=42)
    assert len(X_train) == 7000
    assert len(X_val) == 1500
    assert len(X_test) == 1500
    
    # Check prevalence consistency
    prev_train = y_train.mean()
    prev_test = y_test.mean()
    assert abs(prev_train - prev_test) < 0.01


def test_student_1_all_models_train_and_predict():
    X_train, X_val, X_test, y_train, y_val, y_test = split_ai4i_data(random_state=42)
    sample_record = X_test.head(5)
    
    # Train each model
    lr, _ = train_logistic_regression(X_train, y_train)
    dt, _ = train_decision_tree(X_train, y_train)
    rf, _ = train_random_forest(X_train, y_train)
    gb, _ = train_gradient_boosting(X_train, y_train)
    dm, _ = train_dummy_baseline(X_train, y_train)
    
    for name, model in [("LR", lr), ("DT", dt), ("RF", rf), ("GB", gb), ("DM", dm)]:
        preds = model.predict(sample_record)
        assert len(preds) == 5, f"{name} prediction length mismatch"
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(sample_record)
            assert probs.shape == (5, 2), f"{name} probability shape mismatch"


def test_student_1_artifacts_and_metrics_exist():
    best_model_path = os.path.join(STUDENT_1_DIR, "artifacts", "best_model.joblib")
    metrics_path = os.path.join(STUDENT_1_DIR, "reports", "metrics.json")
    comparison_csv = os.path.join(STUDENT_1_DIR, "reports", "model_comparison.csv")
    
    assert os.path.exists(best_model_path), "best_model.joblib must exist"
    assert os.path.exists(metrics_path), "metrics.json must exist"
    assert os.path.exists(comparison_csv), "model_comparison.csv must exist"
    
    # Test loading serialized model
    model = joblib.load(best_model_path)
    assert hasattr(model, "predict")
    
    with open(metrics_path, "r", encoding="utf-8") as f:
        metrics = json.load(f)
        assert metrics["study_id"] == "student_1"
        assert "models" in metrics
        assert len(metrics["models"]) == 5
