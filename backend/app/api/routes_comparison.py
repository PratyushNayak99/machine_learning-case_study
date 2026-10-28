"""
Team-level comparative analysis API routes.
"""

from fastapi import APIRouter, HTTPException
from backend.app.registry import get_team_comparison_data

router = APIRouter(prefix="/api/team-comparison", tags=["Team Comparison"])


@router.get("")
def get_team_comparison():
    """
    Returns aggregated cross-dataset algorithm rankings, relative baseline improvements,
    and dataset taxonomies.
    """
    try:
        return get_team_comparison_data()
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Team comparison has not been synthesized yet. Run python -m team_comparison.compare_students."
        )
