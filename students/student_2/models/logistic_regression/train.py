"""
Logistic Regression training module for Student 2: Scania APS Trucks.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from students.student_2.preprocessing.feature_engineering import get_scania_preprocessor


def train_logistic_regression(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    C: float = 0.1,
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    preprocessor = get_scania_preprocessor(scale=True)
    classifier = LogisticRegression(
        C=C,
        class_weight=class_weight,
        solver="lbfgs",
        max_iter=1000,
        random_state=random_state
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    
    metadata = {
        "model_name": "Logistic Regression",
        "lead_student": "student_1",
        "hyperparameters": {
            "C": C,
            "class_weight": class_weight,
            "max_iter": 1000
        }
    }
    
    return pipeline, metadata
