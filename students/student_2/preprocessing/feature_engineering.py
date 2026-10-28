"""
Feature engineering and missingness imputation for Student 2: Scania APS Trucks.
"""

from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler


def get_scania_preprocessor(scale: bool = False) -> Pipeline:
    """
    Constructs an imputation pipeline for Scania high-dimensional attributes.
    Uses median imputation and attaches missingness indicator columns.
    """
    steps = [
        ("imputer", SimpleImputer(strategy="median", add_indicator=True))
    ]
    if scale:
        steps.append(("scaler", StandardScaler()))
        
    return Pipeline(steps=steps)
