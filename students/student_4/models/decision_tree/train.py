"""
Decision Tree training module for Student 4: MetroPT-3.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer


def train_decision_tree(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    max_depth: int = 6,
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("classifier", DecisionTreeClassifier(
            max_depth=max_depth,
            class_weight=class_weight,
            random_state=random_state
        ))
    ])
    
    pipeline.fit(X_train, y_train)
    
    metadata = {
        "model_name": "Decision Tree",
        "lead_student": "student_2",
        "hyperparameters": {
            "max_depth": max_depth,
            "class_weight": class_weight
        }
    }
    
    return pipeline, metadata
