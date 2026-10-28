"""
Data validation utilities for ForgeWatch AI studies.
"""

from typing import Dict, List, Optional, Any
import pandas as pd
import numpy as np


class DataValidationError(Exception):
    """Raised when data validation checks fail."""
    pass


def validate_schema(
    df: pd.DataFrame,
    expected_columns: List[str],
    dtypes: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Validates that a dataframe contains all expected columns and conforms to data types.
    """
    missing_cols = [col for col in expected_columns if col not in df.columns]
    extra_cols = [col for col in df.columns if col not in expected_columns]
    
    report = {
        "is_valid": len(missing_cols) == 0,
        "row_count": len(df),
        "column_count": len(df.columns),
        "missing_columns": missing_cols,
        "extra_columns": extra_cols,
        "dtype_mismatches": {}
    }
    
    if dtypes:
        for col, expected_type in dtypes.items():
            if col in df.columns:
                actual_type = str(df[col].dtype)
                if expected_type not in actual_type:
                    report["dtype_mismatches"][col] = {
                        "expected": expected_type,
                        "actual": actual_type
                    }
                    report["is_valid"] = False

    return report


def profile_missingness(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes null counts and percentages for each column in a DataFrame.
    """
    null_counts = df.isnull().sum()
    null_pct = (null_counts / len(df)) * 100.0
    profile = pd.DataFrame({
        "missing_count": null_counts,
        "missing_percentage": null_pct.round(2)
    })
    return profile.sort_values(by="missing_percentage", ascending=False)


def check_target_distribution(df: pd.DataFrame, target_col: str) -> Dict[str, Any]:
    """
    Analyzes target distribution, class counts, and prevalence percentages.
    """
    if target_col not in df.columns:
        raise DataValidationError(f"Target column '{target_col}' not found in DataFrame.")
    
    value_counts = df[target_col].value_counts().to_dict()
    total = len(df)
    prevalence = {str(k): round((v / total) * 100.0, 3) for k, v in value_counts.items()}
    
    return {
        "target_column": target_col,
        "total_records": total,
        "unique_classes": len(value_counts),
        "class_counts": {str(k): int(v) for k, v in value_counts.items()},
        "class_prevalence_pct": prevalence
    }


def check_leakage_columns(df: pd.DataFrame, forbidden_cols: List[str]) -> List[str]:
    """
    Detects if any forbidden outcome-related or leaky columns are present in features.
    """
    leaked = [c for c in forbidden_cols if c in df.columns]
    if leaked:
        raise DataValidationError(f"Critical Data Leakage Detected: Features contain forbidden columns: {leaked}")
    return leaked
