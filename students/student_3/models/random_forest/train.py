"""
Random Forest training module for Student 3: Condition Monitoring of Hydraulic Systems.
Primary algorithm lead for Student 3.
Evaluates multi-class condition degradation and maps sensor importance by modality.
"""

from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer


def train_random_forest(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    n_estimators: int = 100,
    max_depth: int = 12,
    min_samples_split: int = 5,
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("classifier", RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            class_weight=class_weight,
            random_state=random_state,
            n_jobs=-1
        ))
    ])
    
    pipeline.fit(X_train, y_train)
    
    feature_names = X_train.columns.tolist()
    importances = pipeline.named_steps["classifier"].feature_importances_
    
    # Aggregate importance by physical sensor modality
    modalities = {
        "Thermal (TS1-TS4)": 0.0,
        "Pressure (PS1-PS6)": 0.0,
        "Motor Power (EPS1)": 0.0,
        "Volume Flow (FS1-FS2)": 0.0,
        "Vibration (VS1)": 0.0,
        "Virtual Efficiency (CE, CP, SE)": 0.0
    }
    
    for feat, imp in zip(feature_names, importances):
        prefix = feat.split("_")[0]
        if prefix.startswith("TS"):
            modalities["Thermal (TS1-TS4)"] += imp
        elif prefix.startswith("PS"):
            modalities["Pressure (PS1-PS6)"] += imp
        elif prefix == "EPS1":
            modalities["Motor Power (EPS1)"] += imp
        elif prefix.startswith("FS"):
            modalities["Volume Flow (FS1-FS2)"] += imp
        elif prefix == "VS1":
            modalities["Vibration (VS1)"] += imp
        elif prefix in ["CE", "CP", "SE"]:
            modalities["Virtual Efficiency (CE, CP, SE)"] += imp

    metadata = {
        "model_name": "Random Forest",
        "lead_student": "student_3",
        "hyperparameters": {
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "min_samples_split": min_samples_split,
            "class_weight": class_weight
        },
        "feature_importances": {feat: round(float(imp), 4) for feat, imp in zip(feature_names, importances)},
        "modality_importances": {mod: round(float(val), 4) for mod, val in modalities.items()}
    }
    
    return pipeline, metadata
