"""
Chronological data partitioning for Student 4: MetroPT-3.
Enforces strict time boundaries to evaluate generalization to future failure incidents.
"""

from typing import Tuple
import os
import pandas as pd
from students.student_4.preprocessing.clean_data import clean_metropt_windows

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROCESSED_DIR = os.path.join(BASE_DIR, "dataset", "processed")


def split_metropt_chronological(
    windows_df: pd.DataFrame,
    train_end: str = "2020-05-31 23:59:59",
    val_end: str = "2020-06-30 23:59:59"
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, pd.Series]:
    """
    Splits window dataframe chronologically:
    - Train: up to train_end (contains Event 1 & 2)
    - Val: train_end to val_end (contains Event 3)
    - Test: after val_end (contains Event 4)
    """
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    
    t_col = "timestamp"
    train_mask = windows_df[t_col] <= pd.Timestamp(train_end)
    val_mask = (windows_df[t_col] > pd.Timestamp(train_end)) & (windows_df[t_col] <= pd.Timestamp(val_end))
    test_mask = windows_df[t_col] > pd.Timestamp(val_end)
    
    train_win = windows_df[train_mask]
    val_win = windows_df[val_mask]
    test_win = windows_df[test_mask]
    
    X_train, y_train, excl_train = clean_metropt_windows(train_win)
    X_val, y_val, excl_val = clean_metropt_windows(val_win)
    X_test, y_test, excl_test = clean_metropt_windows(test_win)
    
    # Save processed splits
    X_train.assign(target=y_train).to_csv(os.path.join(PROCESSED_DIR, "train.csv"), index=False)
    X_val.assign(target=y_val).to_csv(os.path.join(PROCESSED_DIR, "val.csv"), index=False)
    X_test.assign(target=y_test).to_csv(os.path.join(PROCESSED_DIR, "test.csv"), index=False)
    
    print(f"[Student 4] Chronological splits ready:")
    print(f"  Train ({len(X_train)} windows, {int(y_train.sum())} failure windows, {excl_train} buffer windows excluded)")
    print(f"  Val   ({len(X_val)} windows, {int(y_val.sum())} failure windows, {excl_val} buffer windows excluded)")
    print(f"  Test  ({len(X_test)} windows, {int(y_test.sum())} failure windows, {excl_test} buffer windows excluded)")
    
    return X_train, X_val, X_test, y_train, y_val, y_test
