"""
Dummy baseline classifier for Student 1: AI4I 2020.
Provides minimal non-trivial baseline benchmark.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.pipeline import Pipeline
from students.student_1.preprocessing.feature_engineering import get_ai4i_preprocessor


def train_dummy_baseline(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    strategy: str = "stratified",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    preprocessor = get_ai4i_preprocessor()
    classifier = DummyClassifier(strategy=strategy, random_state=random_state)
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    
    metadata = {
        "model_name": "Dummy Baseline",
        "lead_student": "benchmark",
        "hyperparameters": {
            "strategy": strategy
        }
    }
    
    return pipeline, metadata
