"""
Data partitioning script for Student 1: AI4I 2020.
Creates stratified Train (70%), Val (15%), Test (15%) splits.
"""

import os
from typing import Tuple
import pandas as pd
from sklearn.model_selection import train_test_split
from students.student_1.preprocessing.clean_data import clean_ai4i_data

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DATA_PATH = os.path.join(BASE_DIR, "dataset", "raw", "ai4i2020.csv")
PROCESSED_DIR = os.path.join(BASE_DIR, "dataset", "processed")


def split_ai4i_data(
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, pd.Series]:
    """
    Partitions the AI4I dataset into stratified Train (70%), Val (15%), and Test (15%) subsets.
    Saves clean CSV files to processed/ directory.
    """
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    df = pd.read_csv(RAW_DATA_PATH)
    X, y = clean_ai4i_data(df)
    
    # 70% Train, 30% Temp (Val + Test)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, random_state=random_state, stratify=y
    )
    
    # Split Temp into 50/50 -> 15% Val, 15% Test
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=random_state, stratify=y_temp
    )
    
    # Save partitions
    X_train.assign(target=y_train).to_csv(os.path.join(PROCESSED_DIR, "train.csv"), index=False)
    X_val.assign(target=y_val).to_csv(os.path.join(PROCESSED_DIR, "val.csv"), index=False)
    X_test.assign(target=y_test).to_csv(os.path.join(PROCESSED_DIR, "test.csv"), index=False)
    
    print(f"[Student 1] Partitions saved: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")
    return X_train, X_val, X_test, y_train, y_val, y_test


if __name__ == "__main__":
    split_ai4i_data()
