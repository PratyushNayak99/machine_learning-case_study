"""
Central Model and Study Registry for ForgeWatch AI.
Manages lazy artifact loading, study status, and cached inference pipelines.
"""

from typing import Dict, Any, Optional
import os
import json
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
STUDENTS_DIR = os.path.join(BASE_DIR, "students")
TEAM_DIR = os.path.join(BASE_DIR, "team_comparison")

STUDY_SPECS = {
    "student_1": {
        "study_id": "student_1",
        "dataset_name": "AI4I 2020 Predictive Maintenance",
        "domain": "CNC Milling Machine (Synthetic Simulation)",
        "lead_algorithm": "Logistic Regression",
        "student_owner": "Student 1",
        "target_column": "Machine failure",
        "target_type": "binary",
        "target_classes": {
            "0": "No Failure (Nominal Operation)",
            "1": "Machine Failure"
        },
        "sample_records": 10000,
        "features_count": 6
    },
    "student_2": {
        "study_id": "student_2",
        "dataset_name": "APS Failure at Scania Trucks",
        "domain": "Heavy Commercial Transport Fleet (APS)",
        "lead_algorithm": "Decision Tree Classifier",
        "student_owner": "Student 2",
        "target_column": "class",
        "target_type": "binary_cost_sensitive",
        "target_classes": {
            "0": "Failure UNRELATED to APS (Truck is NOT healthy)",
            "1": "APS Component Failure"
        },
        "sample_records": 76000,
        "features_count": 170
    },
    "student_3": {
        "study_id": "student_3",
        "dataset_name": "Condition Monitoring of Hydraulic Systems",
        "domain": "Industrial Hydraulic Test Rig",
        "lead_algorithm": "Random Forest Classifier",
        "student_owner": "Student 3",
        "target_column": "cooler_condition",
        "target_type": "multiclass",
        "target_classes": {
            "3": "Close to Total Failure (0% efficiency)",
            "20": "Reduced Cooling Efficiency",
            "100": "Full Cooling Efficiency"
        },
        "sample_records": 2205,
        "features_count": 136
    },
    "student_4": {
        "study_id": "student_4",
        "dataset_name": "MetroPT-3 Operational Compressor",
        "domain": "Urban Metro Train Air Production Unit",
        "lead_algorithm": "HistGradientBoosting Classifier",
        "student_owner": "Student 4",
        "target_column": "failure_event",
        "target_type": "binary_event_detection",
        "target_classes": {
            "0": "Nominal Operation",
            "1": "Active Failure Event Window"
        },
        "sample_records": 1516948,
        "features_count": 75
    }
}

# In-memory artifact cache
_ARTIFACT_CACHE: Dict[str, Any] = {}


def get_all_studies_status() -> Dict[str, Any]:
    """
    Returns registration metadata and real execution status for all four studies.
    """
    result = {}
    for s_id, spec in STUDY_SPECS.items():
        artifact_file = os.path.join(STUDENTS_DIR, s_id, "artifacts", "best_model.joblib")
        metrics_file = os.path.join(STUDENTS_DIR, s_id, "reports", "metrics.json")
        is_complete = os.path.exists(artifact_file) and os.path.exists(metrics_file)
        
        result[s_id] = {
            **spec,
            "status": "completed" if is_complete else "pending",
            "has_artifacts": os.path.exists(artifact_file),
            "has_metrics": os.path.exists(metrics_file)
        }
    return result


def load_study_artifact(student_id: str) -> Any:
    """
    Loads saved model pipeline from disk on-demand with caching.
    """
    if student_id not in STUDY_SPECS:
        raise ValueError(f"Unknown study ID: '{student_id}'")
        
    if student_id in _ARTIFACT_CACHE:
        return _ARTIFACT_CACHE[student_id]
        
    artifact_path = os.path.join(STUDENTS_DIR, student_id, "artifacts", "best_model.joblib")
    if not os.path.exists(artifact_path):
        raise FileNotFoundError(
            f"Model artifacts for '{student_id}' have not been generated yet. "
            f"Run python -m students.{student_id}.run_study first."
        )
        
    artifact = joblib.load(artifact_path)
    _ARTIFACT_CACHE[student_id] = artifact
    return artifact


def get_study_metrics(student_id: str) -> Dict[str, Any]:
    """
    Loads metrics.json for a study.
    """
    metrics_path = os.path.join(STUDENTS_DIR, student_id, "reports", "metrics.json")
    if not os.path.exists(metrics_path):
        raise FileNotFoundError(f"Metrics report for '{student_id}' not found.")
    with open(metrics_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_team_comparison_data() -> Dict[str, Any]:
    """
    Loads comparison_results.json.
    """
    json_path = os.path.join(TEAM_DIR, "comparison_results.json")
    if not os.path.exists(json_path):
        raise FileNotFoundError("Team comparison has not been generated yet.")
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)
