"""
Target isolation and leakage prevention for Student 3: Condition Monitoring of Hydraulic Systems.
"""

from typing import Tuple
import os
import pandas as pd
import numpy as np


def clean_hydraulic_targets(profile_path: str) -> Tuple[pd.Series, pd.DataFrame]:
    """
    Extracts cooler_condition as the primary target and isolates it from other profile annotations.
    Column 0: Cooler condition (3, 20, 100)
    Column 1: Valve condition
    Column 2: Internal pump leakage
    Column 3: Hydraulic accumulator
    Column 4: Stable flag
    """
    profile_df = pd.read_csv(profile_path, sep=r"\s+", header=None)
    profile_df.columns = [
        "cooler_condition",
        "valve_condition",
        "internal_pump_leakage",
        "hydraulic_accumulator",
        "stable_flag"
    ]
    
    y = profile_df["cooler_condition"].copy()
    
    # Store auxiliary diagnostics separately (NOT to be used as predictive inputs!)
    aux_annotations = profile_df.drop(columns=["cooler_condition"]).copy()
    
    return y, aux_annotations
