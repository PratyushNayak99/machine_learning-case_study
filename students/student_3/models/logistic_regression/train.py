"""
Multinomial Logistic Regression training module for Student 3: Condition Monitoring of Hydraulic Systems.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer


def train_logistic_regression(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    C: float = 1.0,
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(
            C=C,
            class_weight=class_weight,
            solver="lbfgs",
            max_iter=1000,
            random_state=random_state
        ))
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
