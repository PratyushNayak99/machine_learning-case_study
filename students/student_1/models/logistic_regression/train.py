"""
Logistic Regression training module for Student 1: AI4I 2020.
Primary algorithm lead for Student 1.
"""

from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from students.student_1.preprocessing.feature_engineering import get_ai4i_preprocessor


def train_logistic_regression(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    C: float = 1.0,
    penalty: str = "l2",
    class_weight: str = "balanced",
    random_state: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    """
    Trains a Logistic Regression pipeline with feature scaling and one-hot encoding.
    Returns the fitted pipeline and model metadata (including coefficients and odds ratios).
    """
    preprocessor = get_ai4i_preprocessor()
    classifier = LogisticRegression(
        C=C,
        penalty=penalty,
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
    
    # Extract feature names after transformation
    ohe_cats = pipeline.named_steps["preprocessor"].named_transformers_["cat"].get_feature_names_out(["Type"]).tolist()
    num_feats = [
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]"
    ]
    feature_names = ohe_cats + num_feats
    coefficients = pipeline.named_steps["classifier"].coef_[0]
    intercept = float(pipeline.named_steps["classifier"].intercept_[0])
    odds_ratios = np.exp(coefficients)
    
    metadata = {
        "model_name": "Logistic Regression",
        "lead_student": "student_1",
        "hyperparameters": {
            "C": C,
            "penalty": penalty,
            "class_weight": class_weight,
            "solver": "lbfgs"
        },
        "intercept": round(intercept, 4),
        "coefficients": {feat: round(float(c), 4) for feat, c in zip(feature_names, coefficients)},
        "odds_ratios": {feat: round(float(or_), 4) for feat, or_ in zip(feature_names, odds_ratios)},
        "feature_names": feature_names
    }
    
    return pipeline, metadata
