"""
Study registry and metrics API routes.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from backend.app.schemas import StudyMetadata
from backend.app.registry import get_all_studies_status, get_study_metrics

router = APIRouter(prefix="/api/studies", tags=["Studies"])


@router.get("", response_model=List[StudyMetadata])
def list_studies():
    """
    Returns list of all student studies with their real execution status and metadata.
    """
    statuses = get_all_studies_status()
    return list(statuses.values())


@router.get("/{student_id}/metadata", response_model=StudyMetadata)
def get_study_metadata(student_id: str):
    """
    Returns detailed metadata for a specific study.
    """
    statuses = get_all_studies_status()
    if student_id not in statuses:
        raise HTTPException(status_code=404, detail=f"Study '{student_id}' does not exist.")
    return statuses[student_id]


@router.get("/{student_id}/metrics")
def get_metrics(student_id: str):
    """
    Returns full evaluation metrics, confusion matrices, and model comparison table.
    """
    try:
        return get_study_metrics(student_id)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Study '{student_id}' evaluation results are pending execution."
        )
