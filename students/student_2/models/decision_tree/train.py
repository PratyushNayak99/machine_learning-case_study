"""
Decision Tree training module for Student 2: Scania APS Trucks.
Primary algorithm lead for Student 2.
Focuses on tree depth, cost-complexity pruning, and class balancing.
"""

from typing import Tuple, Dict, Any
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.pipeline import Pipeline
from students.student_2.preprocessing.feature_engineering import get_scania_preprocessor


def train_decision_tree(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    max_depth: int = 8,
    min_samples_split: int = 20,
    min_samples_leaf: int = 10,
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    preprocessor = get_scania_preprocessor(scale=False)
    classifier = DecisionTreeClassifier(
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        class_weight=class_weight,
        random_state=random_state
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    
    metadata = {
        "model_name": "Decision Tree",
        "lead_student": "student_2",
        "hyperparameters": {
            "max_depth": max_depth,
            "min_samples_split": min_samples_split,
            "min_samples_leaf": min_samples_leaf,
            "class_weight": class_weight
        }
    }
    
    return pipeline, metadata
