"""
Data validation script for Student 1: AI4I 2020.
"""

import os
import json
import pandas as pd
from shared.data_validation.validator import (
    validate_schema,
    profile_missingness,
    check_target_distribution,
    check_leakage_columns
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SCHEMA_PATH = os.path.join(BASE_DIR, "dataset", "schema.json")
RAW_DATA_PATH = os.path.join(BASE_DIR, "dataset", "raw", "ai4i2020.csv")


def validate_ai4i_data() -> dict:
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = json.load(f)
        
    df = pd.read_csv(RAW_DATA_PATH)
    
    schema_report = validate_schema(df, schema["raw_features"])
    missingness = profile_missingness(df)
    target_dist = check_target_distribution(df, schema["target_column"])
    
    return {
        "schema_report": schema_report,
        "missingness": missingness,
        "target_dist": target_dist,
        "raw_df": df
    }


if __name__ == "__main__":
    res = validate_ai4i_data()
    print("Schema valid:", res["schema_report"]["is_valid"])
    print("Target distribution:", res["target_dist"]["class_counts"])
