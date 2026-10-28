"""
Data validation script for Student 2: APS Failure at Scania Trucks.
"""

import os
import json
import pandas as pd
from shared.data_validation.validator import (
    validate_schema,
    profile_missingness,
    check_target_distribution
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SCHEMA_PATH = os.path.join(BASE_DIR, "dataset", "schema.json")
TRAIN_DATA_PATH = os.path.join(BASE_DIR, "dataset", "raw", "aps_failure_training_set.csv")


def validate_scania_data() -> dict:
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = json.load(f)
        
    df = pd.read_csv(TRAIN_DATA_PATH, skiprows=20, na_values="na")
    
    missingness = profile_missingness(df)
    target_dist = check_target_distribution(df, schema["target_column"])
    
    return {
        "missingness": missingness,
        "target_dist": target_dist,
        "row_count": len(df),
        "column_count": len(df.columns)
    }


if __name__ == "__main__":
    res = validate_scania_data()
    print("Row count:", res["row_count"])
    print("Col count:", res["column_count"])
    print("Target distribution:", res["target_dist"]["class_counts"])
    print("Top 5 missing columns:\n", res["missingness"].head(5))
