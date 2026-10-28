"""
Integration tests for ForgeWatch AI FastAPI Backend API.
"""

from fastapi.testclient import TestClient
import pytest
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ForgeWatch AI Backend"
    assert "student_1" in data["completed_studies"]
    assert "student_2" in data["completed_studies"]
    assert "student_3" in data["completed_studies"]


def test_list_studies():
    response = client.get("/api/studies")
    assert response.status_code == 200
    studies = response.json()
    assert len(studies) == 4
    study_ids = [s["study_id"] for s in studies]
    assert "student_1" in study_ids
    assert "student_2" in study_ids
    assert "student_3" in study_ids
    assert "student_4" in study_ids


def test_study_metadata_and_metrics():
    # Student 1 Metadata
    res_meta = client.get("/api/studies/student_1/metadata")
    assert res_meta.status_code == 200
    assert res_meta.json()["lead_algorithm"] == "Logistic Regression"
    
    # Student 1 Metrics
    res_metrics = client.get("/api/studies/student_1/metrics")
    assert res_metrics.status_code == 200
    assert "models" in res_metrics.json()
    assert "Logistic Regression" in res_metrics.json()["models"]


def test_team_comparison_endpoint():
    response = client.get("/api/team-comparison")
    assert response.status_code == 200
    data = response.json()
    assert "completed_studies" in data
    assert "algorithm_rankings" in data
    assert "dataset_taxonomies" in data


def test_predict_student_1_ai4i():
    payload = {
        "machine_type": "M",
        "air_temperature": 300.0,
        "process_temperature": 310.0,
        "rotational_speed": 1400.0,
        "torque": 45.0,
        "tool_wear": 50.0
    }
    response = client.post("/api/studies/student_1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["study_id"] == "student_1"
    assert data["prediction_raw"] in [0, 1]
    assert "probability" in data
    assert data["risk_level"] in ["LOW", "ELEVATED", "CRITICAL"]


def test_predict_student_2_scania():
    payload = {
        "preset_scenario": "catastrophic_aps_failure"
    }
    response = client.post("/api/studies/student_2/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["study_id"] == "student_2"
    assert data["prediction_raw"] in [0, 1]
    assert data["applied_threshold"] is not None


def test_predict_student_3_hydraulic():
    payload = {
        "preset_scenario": "total_cooling_failure"
    }
    response = client.post("/api/studies/student_3/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["study_id"] == "student_3"
    assert data["prediction_raw"] in [3, 20, 100]
    assert "class_probabilities" in data


def test_predict_student_4_metropt():
    payload = {
        "preset_scenario": "pneumatic_air_leakage"
    }
    response = client.post("/api/studies/student_4/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["study_id"] == "student_4"
    assert data["prediction_raw"] in [0, 1]
    assert "probability" in data
    assert data["risk_level"] in ["LOW", "ELEVATED", "CRITICAL"]
    assert len(data["operational_recommendation"]) > 0
