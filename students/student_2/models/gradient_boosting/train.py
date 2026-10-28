"""
HistGradientBoosting training module for Student 2: Scania APS Trucks.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.pipeline import Pipeline
from students.student_2.preprocessing.feature_engineering import get_scania_preprocessor


def train_gradient_boosting(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    max_iter: int = 100,
    learning_rate: float = 0.1,
    max_depth: int = 6,
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    preprocessor = get_scania_preprocessor(scale=False)
    classifier = HistGradientBoostingClassifier(
        max_iter=max_iter,
        learning_rate=learning_rate,
        max_depth=max_depth,
        class_weight="balanced",
        random_state=random_state
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    
    metadata = {
        "model_name": "HistGradientBoosting",
        "lead_student": "student_4",
        "hyperparameters": {
            "max_iter": max_iter,
            "learning_rate": learning_rate,
            "max_depth": max_depth,
            "class_weight": "balanced"
        }
    }
    
    return pipeline, metadata
