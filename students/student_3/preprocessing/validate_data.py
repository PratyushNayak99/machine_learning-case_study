"""
Data validation for Student 3: Condition Monitoring of Hydraulic Systems.
"""

import os
import json
import pandas as pd
from shared.data_validation.validator import check_target_distribution

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROFILE_PATH = os.path.join(BASE_DIR, "dataset", "raw", "profile.txt")


def validate_hydraulic_data() -> dict:
    profile_df = pd.read_csv(PROFILE_PATH, sep=r"\s+", header=None)
    profile_df.columns = [
        "cooler_condition",
        "valve_condition",
        "internal_pump_leakage",
        "hydraulic_accumulator",
        "stable_flag"
    ]
    
    target_dist = check_target_distribution(profile_df, "cooler_condition")
    return {
        "total_cycles": len(profile_df),
        "target_dist": target_dist,
        "stable_cycles": int(profile_df["stable_flag"].sum())
    }


if __name__ == "__main__":
    res = validate_hydraulic_data()
    print("Total cycles:", res["total_cycles"])
    print("Target distribution:", res["target_dist"]["class_counts"])
    print("Stable cycles:", res["stable_cycles"])
