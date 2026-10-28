"""
Dummy baseline classifier for Student 3: Condition Monitoring of Hydraulic Systems.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.pipeline import Pipeline


def train_dummy_baseline(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    strategy: str = "stratified",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    pipeline = Pipeline(steps=[
        ("classifier", DummyClassifier(strategy=strategy, random_state=random_state))
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
