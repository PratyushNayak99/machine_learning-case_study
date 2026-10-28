"""
Unit and integration tests for Student 2 (Scania APS Trucks) pipeline and models.
"""

import os
import json
import joblib
import pandas as pd
import pytest

from students.student_2.preprocessing.clean_data import clean_scania_data
from students.student_2.preprocessing.split_data import split_scania_data
from students.student_2.models.decision_tree.train import train_decision_tree
from students.student_2.models.logistic_regression.train import train_logistic_regression
from students.student_2.models.dummy_baseline.train import train_dummy_baseline
from shared.metrics.cost_matrix import compute_scania_cost, optimize_threshold_for_cost

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STUDENT_2_DIR = os.path.join(BASE_DIR, "students", "student_2")


def test_student_2_target_encoding_and_missingness_pruning():
    raw_train = os.path.join(STUDENT_2_DIR, "dataset", "raw", "aps_failure_training_set.csv")
    assert os.path.exists(raw_train), "Raw Scania training file must exist"
    
    # Load sample to verify cleaning logic
    df = pd.read_csv(raw_train, skiprows=20, na_values="na", nrows=100)
    X, y, dropped = clean_scania_data(df, missing_threshold=0.75)
    
    assert y.isin([0, 1]).all(), "Target must be encoded to 0 and 1"
    assert "class" not in X.columns, "Target must be separated from features"
    assert isinstance(dropped, list)


def test_student_2_cost_optimization_logic():
    # Synthetic test to verify threshold search minimizes cost
    y_true = [0] * 100 + [1] * 10
    # True positives have prob ~0.6, false positives have prob ~0.4
    y_prob = [0.1] * 80 + [0.4] * 20 + [0.6] * 10
    
    best_th, min_cost, curve = optimize_threshold_for_cost(
        y_true, y_prob, cost_fp=10.0, cost_fn=500.0
    )
    assert 0.0 < best_th < 1.0
    assert min_cost < (500.0 * 10)  # Must be cheaper than classifying all as negative


def test_student_2_decision_tree_train_and_predict():
    raw_train = os.path.join(STUDENT_2_DIR, "dataset", "raw", "aps_failure_training_set.csv")
    df = pd.read_csv(raw_train, skiprows=20, na_values="na", nrows=200)
    X, y, dropped = clean_scania_data(df, missing_threshold=0.75)
    
    dt, meta = train_decision_tree(X, y, max_depth=4)
    preds = dt.predict(X.head(10))
    probs = dt.predict_proba(X.head(10))
    
    assert len(preds) == 10
    assert probs.shape == (10, 2)
    assert meta["model_name"] == "Decision Tree"
