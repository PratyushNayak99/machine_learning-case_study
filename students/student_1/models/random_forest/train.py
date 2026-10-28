"""
Random Forest training module for Student 1: AI4I 2020.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from students.student_1.preprocessing.feature_engineering import get_ai4i_preprocessor


def train_random_forest(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    n_estimators: int = 100,
    max_depth: int = 10,
    min_samples_split: int = 5,
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    preprocessor = get_ai4i_preprocessor()
    classifier = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        class_weight=class_weight,
        random_state=random_state,
        n_jobs=-1
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    
    ohe_cats = pipeline.named_steps["preprocessor"].named_transformers_["cat"].get_feature_names_out(["Type"]).tolist()
    num_feats = [
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]"
    ]
    feature_names = ohe_cats + num_feats
    importances = pipeline.named_steps["classifier"].feature_importances_
    
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
        "feature_names": feature_names
    }
    
    return pipeline, metadata
