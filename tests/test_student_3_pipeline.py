"""
Unit and integration tests for Student 3 (Hydraulic Systems) pipeline and models.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
import pytest

from students.student_3.preprocessing.clean_data import clean_hydraulic_targets
from students.student_3.preprocessing.feature_engineering import extract_cycle_features_from_array
from students.student_3.models.random_forest.train import train_random_forest
from students.student_3.models.decision_tree.train import train_decision_tree
from students.student_3.models.dummy_baseline.train import train_dummy_baseline

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STUDENT_3_DIR = os.path.join(BASE_DIR, "students", "student_3")


def test_student_3_clean_targets():
    profile_path = os.path.join(STUDENT_3_DIR, "dataset", "raw", "profile.txt")
    assert os.path.exists(profile_path), "Raw profile.txt must exist"
    
    y, aux = clean_hydraulic_targets(profile_path)
    assert len(y) == 2205
    assert set(y.unique()) == {3, 20, 100}
    assert "cooler_condition" not in aux.columns


def test_student_3_cycle_feature_extraction():
    # 5 cycles of 60 seconds at 10 Hz = 5 x 600 points
    arr = np.random.normal(loc=50.0, scale=5.0, size=(5, 600))
    feats = extract_cycle_features_from_array(arr, "TEST_SENSOR")
    
    assert len(feats) == 5
    assert feats.shape[1] == 8
    assert "TEST_SENSOR_mean" in feats.columns
    assert "TEST_SENSOR_peak_to_peak" in feats.columns
    assert not feats.isnull().any().any(), "Features must not contain NaNs"


def test_student_3_models_train_and_predict():
    # Synthetic multi-class dataset
    X = pd.DataFrame(np.random.randn(60, 10), columns=[f"f_{i}" for i in range(10)])
    y = pd.Series([3] * 20 + [20] * 20 + [100] * 20)
    
    rf, meta_rf = train_random_forest(X, y, n_estimators=10, max_depth=4)
    dt, meta_dt = train_decision_tree(X, y, max_depth=4)
    dm, meta_dm = train_dummy_baseline(X, y)
    
    for name, model in [("RF", rf), ("DT", dt), ("DM", dm)]:
        preds = model.predict(X.head(5))
        assert len(preds) == 5
        assert set(preds).issubset({3, 20, 100})
