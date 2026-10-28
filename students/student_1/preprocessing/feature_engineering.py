"""
Feature engineering and preprocessing pipeline construction for Student 1: AI4I 2020.
"""

from typing import List, Tuple
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder


def get_ai4i_preprocessor(
    categorical_features: List[str] = ["Type"],
    numerical_features: List[str] = [
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]"
    ]
) -> ColumnTransformer:
    """
    Creates a scikit-learn ColumnTransformer configured for AI4I telemetry.
    Applies OneHotEncoder to categorical features and StandardScaler to numeric features.
    """
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                categorical_features
            ),
            (
                "num",
                StandardScaler(),
                numerical_features
            )
        ],
        remainder="drop"
    )
    return preprocessor
