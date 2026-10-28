"""
Random Forest training module for Student 2: Scania APS Trucks.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from students.student_2.preprocessing.feature_engineering import get_scania_preprocessor


def train_random_forest(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    n_estimators: int = 100,
    max_depth: int = 12,
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    preprocessor = get_scania_preprocessor(scale=False)
    classifier = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        class_weight=class_weight,
        random_state=random_state,
        n_jobs=-1
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    
    metadata = {
        "model_name": "Random Forest",
        "lead_student": "student_3",
        "hyperparameters": {
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "class_weight": class_weight
        }
    }
    
    return pipeline, metadata
