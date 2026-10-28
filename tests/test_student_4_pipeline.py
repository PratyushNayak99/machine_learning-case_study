"""
Unit and integration tests for Student 4 (MetroPT-3) pipeline and models.
"""

import os
import json
import joblib
import pandas as pd
import pytest

from students.student_4.preprocessing.feature_engineering import FAILURE_EVENTS, assign_event_label
from students.student_4.preprocessing.clean_data import clean_metropt_windows
from students.student_4.models.gradient_boosting.train import train_gradient_boosting
from students.student_4.models.dummy_baseline.train import train_dummy_baseline

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STUDENT_4_DIR = os.path.join(BASE_DIR, "students", "student_4")


def test_student_4_failure_events_specification():
    assert len(FAILURE_EVENTS) == 4
    for ev in FAILURE_EVENTS:
        assert ev["start"] < ev["end"]
        assert ev["type"] == "Air leak"


def test_student_4_assign_event_label_protocol():
    # Inside event 1 (2020-04-18)
    t1 = pd.Timestamp("2020-04-18 10:00:00")
    t2 = pd.Timestamp("2020-04-18 10:15:00")
    assert assign_event_label(t1, t2) == 1
    
    # Within 6h buffer before event 1
    t3 = pd.Timestamp("2020-04-17 21:00:00")
    t4 = pd.Timestamp("2020-04-17 21:15:00")
    assert assign_event_label(t3, t4) == -1
    
    # Safely nominal
    t5 = pd.Timestamp("2020-02-15 12:00:00")
    t6 = pd.Timestamp("2020-02-15 12:15:00")
    assert assign_event_label(t5, t6) == 0


def test_student_4_clean_windows():
    df = pd.DataFrame({
        "timestamp": pd.date_range("2020-01-01", periods=6, freq="15min"),
        "feat_1": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
        "event_label": [0, 0, -1, 1, 0, -1]
    })
    X, y, excl = clean_metropt_windows(df)
    assert len(X) == 4
    assert excl == 2
    assert "event_label" not in X.columns
    assert "timestamp" not in X.columns


def test_student_4_artifacts_exist():
    best_model_path = os.path.join(STUDENT_4_DIR, "artifacts", "best_model.joblib")
    metrics_path = os.path.join(STUDENT_4_DIR, "reports", "metrics.json")
    
    assert os.path.exists(best_model_path)
    assert os.path.exists(metrics_path)
    
    with open(metrics_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        assert data["study_id"] == "student_4"
        assert len(data["models"]) == 5
