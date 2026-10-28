"""
Unit tests for ForgeWatch AI team comparison engine.
"""

import os
import json
import pytest
from team_comparison.compare_students import load_all_student_metrics, generate_team_comparison

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
TEAM_DIR = os.path.join(BASE_DIR, "team_comparison")


def test_load_all_student_metrics():
    studies = load_all_student_metrics()
    assert "student_1" in studies
    assert "student_2" in studies
    assert "student_3" in studies
    assert "student_4" in studies
    
    # Students 1, 2, 3 must be complete
    assert studies["student_1"].get("status") != "pending"
    assert studies["student_2"].get("status") != "pending"
    assert studies["student_3"].get("status") != "pending"


def test_team_comparison_outputs_exist():
    generate_team_comparison()
    csv_path = os.path.join(TEAM_DIR, "comparison_results.csv")
    json_path = os.path.join(TEAM_DIR, "comparison_results.json")
    report_path = os.path.join(TEAM_DIR, "team_comparison_report.md")
    
    assert os.path.exists(csv_path), "comparison_results.csv must exist"
    assert os.path.exists(json_path), "comparison_results.json must exist"
    assert os.path.exists(report_path), "team_comparison_report.md must exist"
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        assert "completed_studies" in data
        assert len(data["completed_studies"]) >= 3
