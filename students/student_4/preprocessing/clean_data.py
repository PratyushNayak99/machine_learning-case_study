"""
Data cleaning and exclusion of ambiguous transition windows for Student 4: MetroPT-3.
"""

from typing import Tuple
import pandas as pd


def clean_metropt_windows(windows_df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series, int]:
    """
    Filters out uncertain buffer windows (event_label == -1) to prevent label noise.
    Returns:
    - X: Predictive window feature matrix
    - y: Binary failure event indicator (0 = Nominal, 1 = Failure)
    - num_excluded: Number of ambiguous transition windows removed
    """
    total_windows = len(windows_df)
    valid_mask = windows_df["event_label"] != -1
    clean_df = windows_df[valid_mask].copy()
    num_excluded = total_windows - len(clean_df)
    
    y = clean_df["event_label"].astype(int)
    
    # Exclude timestamp and label columns from feature matrix
    feature_cols = [c for c in clean_df.columns if c not in ["timestamp", "event_label"]]
    X = clean_df[feature_cols].copy()
    
    return X, y, num_excluded
