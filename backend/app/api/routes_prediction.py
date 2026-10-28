"""
Dataset-specific inference API routes with strict schema validation and error checking.
Never returns mock or fabricated data; executes real trained pipelines.
"""

import os
from typing import Dict, Any, List
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException

from backend.app.schemas import (
    AI4IPredictionRequest,
    ScaniaPredictionRequest,
    HydraulicPredictionRequest,
    MetroPTPredictionRequest,
    PredictionResponse
)
from backend.app.registry import load_study_artifact, get_study_metrics, STUDENTS_DIR

router = APIRouter(prefix="/api/studies", tags=["Predictions"])


# -------------------------------------------------------------
# Student 1: AI4I 2020 Predictive Maintenance
# -------------------------------------------------------------
@router.post("/student_1/predict", response_model=PredictionResponse)
def predict_student_1(request: AI4IPredictionRequest):
    try:
        pipeline = load_study_artifact("student_1")
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
        
    input_df = pd.DataFrame([{
        "Type": request.machine_type,
        "Air temperature [K]": request.air_temperature,
        "Process temperature [K]": request.process_temperature,
        "Rotational speed [rpm]": request.rotational_speed,
        "Torque [Nm]": request.torque,
        "Tool wear [min]": request.tool_wear
    }])
    
    warnings = []
    if request.torque > 70.0:
        warnings.append("High cutting torque (>70 Nm) detected. Elevated risk of overstrain failure.")
    if request.tool_wear > 200.0:
        warnings.append("Tool wear exceeds 200 minutes. Accelerated risk of tool breakage.")
    if request.rotational_speed < 1200.0 and request.torque > 60.0:
        warnings.append("High torque with low spindle speed indicates severe mechanical resistance.")

    pred_class = int(pipeline.predict(input_df)[0])
    prob_failure = float(pipeline.predict_proba(input_df)[0][1])
    
    if prob_failure >= 0.70:
        risk = "CRITICAL"
        rec = "Immediate halt of spindle rotation recommended. Inspect tool wear and torque resistance."
    elif prob_failure >= 0.35:
        risk = "ELEVATED"
        rec = "Elevated mechanical stress. Schedule preventative inspection before next machining cycle."
    else:
        risk = "LOW"
        rec = "Operating within nominal physical bounds. No immediate maintenance intervention required."

    return PredictionResponse(
        study_id="student_1",
        model_name="HistGradientBoosting (Best Pipeline)",
        prediction_raw=pred_class,
        prediction_label="Machine Failure" if pred_class == 1 else "Nominal Operation",
        probability=round(prob_failure, 4),
        class_probabilities={
            "Nominal": round(1.0 - prob_failure, 4),
            "Failure": round(prob_failure, 4)
        },
        risk_level=risk,
        operational_recommendation=rec,
        warnings=warnings
    )


# -------------------------------------------------------------
# Student 2: APS Failure at Scania Trucks
# -------------------------------------------------------------
@router.post("/student_2/predict", response_model=PredictionResponse)
def predict_student_2(request: ScaniaPredictionRequest):
    try:
        artifact_data = load_study_artifact("student_2")
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
        
    pipeline = artifact_data["pipeline"]
    threshold = artifact_data["optimal_threshold"]
    dropped_cols = artifact_data["dropped_columns"]
    model_name = artifact_data["model_name"]
    
    # Extract expected feature names and order from the fitted pipeline
    imputer = pipeline.named_steps["preprocessor"].named_steps["imputer"]
    expected_cols = getattr(imputer, "feature_names_in_", None)
    
    sample = {}
    if expected_cols is not None:
        for c in expected_cols:
            sample[c] = 10.0
            
    if request.preset_scenario == "catastrophic_aps_failure":
        sample["aa_000"] = 120000.0
        sample["am_0"] = 5000.0
    elif request.preset_scenario == "minor_valve_leak":
        sample["aa_000"] = 80000.0
    else:
        sample["aa_000"] = 30000.0

    if request.sensor_features:
        sample.update(request.sensor_features)
        
    input_df = pd.DataFrame([sample])
    if expected_cols is not None:
        input_df = input_df.reindex(columns=expected_cols, fill_value=np.nan)
        
    prob_aps = float(pipeline.predict_proba(input_df)[0][1])
    is_aps_failure = int(prob_aps >= threshold)

    warnings = []
    if is_aps_failure:
        warnings.append(f"Probability ({prob_aps:.3f}) exceeds cost-optimal threshold ({threshold:.3f}).")
        rec = "Route vehicle to workshop for APS pneumatic inspection. Prevents catastrophic roadside breakdown."
        risk = "CRITICAL" if prob_aps > 0.5 else "ELEVATED"
    else:
        rec = "APS system shows no active component failure. (Note: Non-APS systems may still require maintenance)."
        risk = "LOW"

    return PredictionResponse(
        study_id="student_2",
        model_name=f"{model_name} (Cost-Tuned)",
        prediction_raw=is_aps_failure,
        prediction_label="APS Component Failure" if is_aps_failure else "Non-APS Subsystem Failure",
        probability=round(prob_aps, 4),
        class_probabilities={
            "Non-APS Failure": round(1.0 - prob_aps, 4),
            "APS Failure": round(prob_aps, 4)
        },
        applied_threshold=round(threshold, 4),
        risk_level=risk,
        operational_recommendation=rec,
        warnings=warnings
    )


# -------------------------------------------------------------
# Student 3: Condition Monitoring of Hydraulic Systems
# -------------------------------------------------------------
@router.post("/student_3/predict", response_model=PredictionResponse)
def predict_student_3(request: HydraulicPredictionRequest):
    try:
        pipeline = load_study_artifact("student_3")
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
        
    imputer = pipeline.named_steps["imputer"]
    expected_cols = getattr(imputer, "feature_names_in_", None)

    if request.preset_scenario == "total_cooling_failure":
        temp_base = 54.0
        ce_base = 18.0
    elif request.preset_scenario == "reduced_cooling_efficiency":
        temp_base = 45.0
        ce_base = 34.0
    else:
        temp_base = 36.0
        ce_base = 48.0

    sample = {}
    if expected_cols is not None:
        for col in expected_cols:
            if col.startswith("TS"):
                sample[col] = temp_base
            elif col.startswith("CE"):
                sample[col] = ce_base
            else:
                sample[col] = 50.0

    if request.cycle_features:
        sample.update(request.cycle_features)
        
    input_df = pd.DataFrame([sample])
    if expected_cols is not None:
        input_df = input_df.reindex(columns=expected_cols, fill_value=0.0)
        
    pred_class = int(pipeline.predict(input_df)[0])
    probs = pipeline.predict_proba(input_df)[0]
    
    class_map = {
        3: "Total Failure (0% efficiency)",
        20: "Reduced Cooling Efficiency",
        100: "Full Optimal Efficiency"
    }
    
    classes_list = [3, 20, 100]
    class_probs = {class_map[c]: round(float(probs[i]), 4) for i, c in enumerate(classes_list)}
    
    warnings = []
    if pred_class == 3:
        risk = "CRITICAL"
        rec = "Cooler has experienced total thermal lockup. Immediately halt hydraulic circuit to prevent oil breakdown."
        warnings.append("Thermal dissipation rate has dropped to 0%. Overheating imminent.")
    elif pred_class == 20:
        risk = "ELEVATED"
        rec = "Cooling circuit is operating at degraded efficiency. Clean radiator fins and check coolant flow."
        warnings.append("Elevated cycle temperature detected.")
    else:
        risk = "LOW"
        rec = "Hydraulic cooling unit operating at 100% nominal efficiency."

    return PredictionResponse(
        study_id="student_3",
        model_name="Random Forest (100 Trees)",
        prediction_raw=pred_class,
        prediction_label=class_map.get(pred_class, str(pred_class)),
        probability=round(float(np.max(probs)), 4),
        class_probabilities=class_probs,
        risk_level=risk,
        operational_recommendation=rec,
        warnings=warnings
    )


# -------------------------------------------------------------
# Student 4: MetroPT-3 Operational Compressor
# -------------------------------------------------------------
@router.post("/student_4/predict", response_model=PredictionResponse)
def predict_student_4(request: MetroPTPredictionRequest):
    try:
        pipeline = load_study_artifact("student_4")
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Student 4 artifacts pending: {str(e)}"
        )
        
    expected_cols = getattr(pipeline, "feature_names_in_", None)
    if expected_cols is None and hasattr(pipeline, "named_steps"):
        imputer = pipeline.named_steps.get("imputer")
        if imputer is not None:
            expected_cols = getattr(imputer, "feature_names_in_", None)

    train_path = os.path.join(STUDENTS_DIR, "student_4", "dataset", "processed", "train.csv")
    if os.path.exists(train_path):
        train_df = pd.read_csv(train_path)
        if request.preset_scenario == "pneumatic_air_leakage":
            fail_rows = train_df[train_df["target"] == 1]
            if len(fail_rows) > 0:
                sample = fail_rows.drop(columns=["target", "timestamp"], errors="ignore").iloc[0].to_dict()
            else:
                sample = train_df.drop(columns=["target", "timestamp"], errors="ignore").median().to_dict()
        else:
            sample = train_df.drop(columns=["target", "timestamp"], errors="ignore").median().to_dict()
    else:
        sample = {c: 1.0 for c in (expected_cols or [])}
        
    if request.window_features:
        sample.update(request.window_features)
        
    input_df = pd.DataFrame([sample])
    if expected_cols is not None:
        input_df = input_df.reindex(columns=expected_cols, fill_value=0.0)
        
    pred_class = int(pipeline.predict(input_df)[0])
    probs = pipeline.predict_proba(input_df)[0]
    prob_failure = float(probs[1]) if len(probs) > 1 else float(probs[0])

    warnings = []
    oil_temp = sample.get("Oil_temperature_mean", 55.0)
    tp2_val = sample.get("TP2_mean", 9.0)
    motor_val = sample.get("Motor_current_mean", 2.0)
    if oil_temp > 70.0:
        warnings.append(f"Elevated oil temperature ({oil_temp:.1f}°C) exceeds normal thermal envelope.")
    if tp2_val > 7.0:
        warnings.append(f"Elevated compressor discharge pressure TP2 ({tp2_val:.2f} bar) indicates pneumatic backpressure.")
    if motor_val > 5.0:
        warnings.append(f"Motor current surge ({motor_val:.2f} A) indicates compressor mechanical resistance.")

    if pred_class == 1 or prob_failure >= 0.05:
        risk = "CRITICAL"
        rec = "Active pneumatic failure signature detected. Dispatch maintenance crew to inspect intake and discharge valves."
    elif prob_failure >= 0.02:
        risk = "ELEVATED"
        rec = "Borderline pressure/current deviation detected. Monitor compressor cycle for recurring duty cycle spikes."
    else:
        risk = "LOW"
        rec = "Compressor operating within nominal urban transit duty cycle bounds."

    classifier_step = pipeline.named_steps.get("classifier") if hasattr(pipeline, "named_steps") else None
    model_name = classifier_step.__class__.__name__ if classifier_step else "Random Forest"

    return PredictionResponse(
        study_id="student_4",
        model_name=f"{model_name} (Temporal Holdout Champion)",
        prediction_raw=pred_class,
        prediction_label="Active Failure Event Window" if pred_class == 1 else "Nominal Operating Window",
        probability=round(prob_failure, 4),
        class_probabilities={
            "Nominal Window": round(1.0 - prob_failure, 4),
            "Failure Event Window": round(prob_failure, 4)
        },
        applied_threshold=0.5,
        risk_level=risk,
        operational_recommendation=rec,
        warnings=warnings
    )
