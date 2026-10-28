"""
Data cleaning and leakage prevention for Student 1: AI4I 2020.
"""

from typing import Tuple
import pandas as pd
from shared.data_validation.validator import check_leakage_columns


def clean_ai4i_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Cleans raw AI4I dataframe by isolating predictive features and target,
    explicitly dropping identifiers and failure-mode leakage flags.
    """
    target_col = "Machine failure"
    if target_col not in df.columns:
        raise ValueError(f"Target '{target_col}' missing from dataframe.")
    
    y = df[target_col].copy()
    
    # Exclude forbidden leakage columns
    leakage_cols = ["TWF", "HDF", "PWF", "OSF", "RNF"]
    id_cols = ["UDI", "Product ID"]
    
    drop_cols = [target_col] + leakage_cols + id_cols
    X = df.drop(columns=[c for c in drop_cols if c in df.columns]).copy()
    
    # Double check that no leakage flags remain
    check_leakage_columns(X, leakage_cols + id_cols)
    
    return X, y
