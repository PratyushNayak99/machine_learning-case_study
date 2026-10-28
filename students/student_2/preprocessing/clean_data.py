"""
Data cleaning and high-missingness filtering for Student 2: Scania APS Trucks.
"""

from typing import Tuple, List, Optional
import pandas as pd
import numpy as np


def clean_scania_data(
    df: pd.DataFrame,
    drop_cols: Optional[List[str]] = None,
    missing_threshold: float = 0.75
) -> Tuple[pd.DataFrame, pd.Series, List[str]]:
    """
    Cleans raw Scania APS dataframe:
    - Encodes target: 'neg' -> 0, 'pos' -> 1
    - Identifies and drops features with missingness > missing_threshold (if drop_cols not provided)
    - Returns X, y, and the list of dropped high-missingness columns.
    """
    target_col = "class"
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' missing from Scania dataframe.")
        
    y = df[target_col].map({"neg": 0, "pos": 1}).astype(int)
    X = df.drop(columns=[target_col]).copy()
    
    if drop_cols is None:
        # Determine columns with missingness exceeding threshold on training data
        null_ratios = X.isnull().mean()
        drop_cols = null_ratios[null_ratios > missing_threshold].index.tolist()
        
    X_cleaned = X.drop(columns=[c for c in drop_cols if c in X.columns])
    
    return X_cleaned, y, drop_cols
