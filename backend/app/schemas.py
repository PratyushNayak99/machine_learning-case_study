"""
Pydantic schemas and API data contracts for ForgeWatch AI.
"""

from typing import Dict, Any, List, Optional, Literal
from pydantic import BaseModel, Field


# Health Schema
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    completed_studies: List[str]
    pending_studies: List[str]


# Study Metadata Schema
class StudyMetadata(BaseModel):
    study_id: str
    dataset_name: str
    domain: str
    lead_algorithm: str
    student_owner: str
    target_column: str
    target_type: str
    target_classes: Dict[str, str]
    status: str
    sample_records: int
    features_count: int


# Inference Request Schemas
class AI4IPredictionRequest(BaseModel):
    machine_type: Literal["L", "M", "H"] = Field(..., description="Machine quality type: L (Low), M (Medium), H (High)")
    air_temperature: float = Field(300.0, ge=290.0, le=320.0, description="Air temperature in Kelvin [K]")
    process_temperature: float = Field(310.0, ge=300.0, le=330.0, description="Process temperature in Kelvin [K]")
    rotational_speed: float = Field(1500.0, ge=500.0, le=3500.0, description="Rotational speed in RPM")
    torque: float = Field(40.0, ge=1.0, le=120.0, description="Torque in Nm")
    tool_wear: float = Field(100.0, ge=0.0, le=400.0, description="Cumulative tool wear in minutes")


class ScaniaPredictionRequest(BaseModel):
    preset_scenario: Optional[Literal["nominal_truck", "minor_valve_leak", "catastrophic_aps_failure"]] = Field(
        None, description="Select a verified industrial scenario preset"
    )
    sensor_features: Optional[Dict[str, float]] = Field(
        None, description="Dictionary of 170 anonymized sensor values (aa_000, etc.)"
    )


class HydraulicPredictionRequest(BaseModel):
    preset_scenario: Optional[Literal["pristine_cooler", "reduced_cooling_efficiency", "total_cooling_failure"]] = Field(
        None, description="Select an experimental test-rig preset"
    )
    cycle_features: Optional[Dict[str, float]] = Field(
        None, description="Dictionary of 136 cycle statistical moments (TS1_mean, etc.)"
    )


class MetroPTPredictionRequest(BaseModel):
    preset_scenario: Optional[Literal["nominal_transit_cycle", "pneumatic_air_leakage"]] = Field(
        None, description="Select a transit compressor window preset"
    )
    window_features: Optional[Dict[str, float]] = Field(
        None, description="Dictionary of window statistical moments"
    )


# Inference Response Schemas
class PredictionResponse(BaseModel):
    study_id: str
    model_name: str
    prediction_raw: Any
    prediction_label: str
    probability: Optional[float] = None
    class_probabilities: Optional[Dict[str, float]] = None
    applied_threshold: Optional[float] = None
    risk_level: Literal["LOW", "ELEVATED", "CRITICAL"]
    operational_recommendation: str
    warnings: List[str] = []
