"""
Data splitting and partitioning for Student 2: Scania APS Trucks.
Partitions official training data into Train (80%) and Validation (20%) with stratification,
and links official held-out Test set (16,000 records).
"""

import os
from typing import Tuple, List
import pandas as pd
from sklearn.model_selection import train_test_split
from students.student_2.preprocessing.clean_data import clean_scania_data

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DIR = os.path.join(BASE_DIR, "dataset", "raw")
TRAIN_RAW = os.path.join(RAW_DIR, "aps_failure_training_set.csv")
TEST_RAW = os.path.join(RAW_DIR, "aps_failure_test_set.csv")
PROCESSED_DIR = os.path.join(BASE_DIR, "dataset", "processed")


def split_scania_data(
    random_state: int = 42,
    missing_threshold: float = 0.75,
    sample_fraction: float = 1.0
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, pd.Series, List[str]]:
    """
    Cleans and partitions Scania data.
    Returns X_train, X_val, X_test, y_train, y_val, y_test, and dropped_columns.
    """
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    
    print("[Student 2] Loading raw training data (60,000 records)...")
    train_df = pd.read_csv(TRAIN_RAW, skiprows=20, na_values="na")
    
    if sample_fraction < 1.0:
        train_df = train_df.sample(frac=sample_fraction, random_state=random_state)
        
    X_full_train, y_full_train, dropped_cols = clean_scania_data(train_df, missing_threshold=missing_threshold)
    print(f"[Student 2] Dropped {len(dropped_cols)} attributes exceeding {missing_threshold*100}% missingness.")
    
    # Stratified 80/20 train/val split
    X_train, X_val, y_train, y_val = train_test_split(
        X_full_train, y_full_train, test_size=0.20, random_state=random_state, stratify=y_full_train
    )
    
    print("[Student 2] Loading raw test data (16,000 records)...")
    test_df = pd.read_csv(TEST_RAW, skiprows=20, na_values="na")
    X_test, y_test, _ = clean_scania_data(test_df, drop_cols=dropped_cols)
    
    print(f"[Student 2] Partitions ready: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")
    return X_train, X_val, X_test, y_train, y_val, y_test, dropped_cols


if __name__ == "__main__":
    split_scania_data()
