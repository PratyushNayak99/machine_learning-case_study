"""
Data partitioning for Student 3: Condition Monitoring of Hydraulic Systems.
Aggregates cycle features and creates stratified Train (70%), Val (15%), Test (15%) splits.
"""

import os
from typing import Tuple
import pandas as pd
from sklearn.model_selection import train_test_split
from students.student_3.preprocessing.feature_engineering import build_cycle_feature_matrix
from students.student_3.preprocessing.clean_data import clean_hydraulic_targets

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DIR = os.path.join(BASE_DIR, "dataset", "raw")
PROFILE_PATH = os.path.join(RAW_DIR, "profile.txt")
PROCESSED_DIR = os.path.join(BASE_DIR, "dataset", "processed")
CACHED_FEATS_PATH = os.path.join(PROCESSED_DIR, "hydraulic_cycle_features.csv")


def split_hydraulic_data(
    random_state: int = 42,
    force_rebuild: bool = False
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, pd.Series]:
    """
    Constructs or loads cycle feature matrix and creates stratified splits.
    """
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    
    if os.path.exists(CACHED_FEATS_PATH) and not force_rebuild:
        print("[Student 3] Loading pre-extracted cycle features from cache...")
        X = pd.read_csv(CACHED_FEATS_PATH)
    else:
        print("[Student 3] Extracting statistical features across 17 sensor cycles (this may take ~10 seconds)...")
        X = build_cycle_feature_matrix(RAW_DIR)
        X.to_csv(CACHED_FEATS_PATH, index=False)
        print(f"[Student 3] Cycle feature matrix saved to {CACHED_FEATS_PATH} (Shape: {X.shape})")
        
    y, _ = clean_hydraulic_targets(PROFILE_PATH)
    
    # 70% Train, 30% Temp
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, random_state=random_state, stratify=y
    )
    
    # 15% Val, 15% Test
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=random_state, stratify=y_temp
    )
    
    # Save partitions
    X_train.assign(target=y_train).to_csv(os.path.join(PROCESSED_DIR, "train.csv"), index=False)
    X_val.assign(target=y_val).to_csv(os.path.join(PROCESSED_DIR, "val.csv"), index=False)
    X_test.assign(target=y_test).to_csv(os.path.join(PROCESSED_DIR, "test.csv"), index=False)
    
    print(f"[Student 3] Hydraulic partitions ready: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")
    return X_train, X_val, X_test, y_train, y_val, y_test


if __name__ == "__main__":
    split_hydraulic_data()
