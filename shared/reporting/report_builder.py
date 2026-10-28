"""
Standardized markdown and JSON report builder for ForgeWatch AI studies.
"""

from typing import Dict, Any, List
import json
import os
import pandas as pd


def df_to_markdown(df: pd.DataFrame, index: bool = True) -> str:
    """
    Converts DataFrame to GFM Markdown table safely with or without tabulate.
    """
    try:
        return df.to_markdown(index=index)
    except Exception:
        headers = ([df.index.name or ""] if index else []) + [str(c) for c in df.columns]
        lines = ["| " + " | ".join(headers) + " |"]
        lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
        for idx, row in df.iterrows():
            row_vals = ([str(idx)] if index else []) + [str(val) for val in row.values]
            lines.append("| " + " | ".join(row_vals) + " |")
        return "\n".join(lines)


def save_metrics_json(metrics: Dict[str, Any], output_path: str) -> None:
    """
    Saves evaluation metrics dictionary to structured JSON file.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)


def generate_data_quality_report(
    student_id: str,
    dataset_name: str,
    schema_info: Dict[str, Any],
    missingness_df: pd.DataFrame,
    target_info: Dict[str, Any],
    output_path: str
) -> None:
    """
    Generates a structured Data Quality Report in Markdown.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    missing_table = df_to_markdown(missingness_df.head(15), index=True)
    target_table = pd.DataFrame([target_info["class_counts"]]).T
    target_table.columns = ["Count"]
    
    prev_map = target_info.get("class_prevalence_pct", {})
    target_table["Prevalence (%)"] = [prev_map.get(k, prev_map.get(str(k), "N/A")) for k in target_table.index]
    target_md = df_to_markdown(target_table, index=True)
    
    content = f"""# Data Quality Report: {dataset_name}
**Study Owner:** {student_id.replace('_', ' ').title()}  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Dataset Dimensions & Schema Validation
- **Total Records:** {schema_info.get('row_count', 'N/A'):,}
- **Total Attributes:** {schema_info.get('column_count', 'N/A')}
- **Schema Conformity:** {"Valid" if schema_info.get('is_valid') else "Mismatches Detected"}
- **Missing Columns:** {len(schema_info.get('missing_columns', []))}
- **Extra Columns:** {len(schema_info.get('extra_columns', []))}

---

## 2. Missingness Profile (Top Attributes)
{missing_table}

---

## 3. Target Distribution & Class Prevalence
- **Target Variable:** `{target_info['target_column']}`
- **Unique Classes:** {target_info['unique_classes']}

{target_md}

---

## 4. Quality Assessment & Data Cleaning Decisions
- Zero-variance or severely incomplete attributes handled based on training data thresholds.
- Data types verified and standardized for scikit-learn estimator pipelines.
- Non-predictive unique identifiers removed from predictor matrices.
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)


def generate_error_analysis_report(
    student_id: str,
    dataset_name: str,
    best_model_name: str,
    cm_dict: Dict[str, int],
    analysis_text: str,
    output_path: str
) -> None:
    """
    Generates an Error Analysis Report in Markdown.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    content = f"""# Error Analysis Report: {dataset_name}
**Study Owner:** {student_id.replace('_', ' ').title()}  
**Best Selected Model:** {best_model_name}  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Test Confusion Matrix Breakdown
- **True Negatives (TN):** {cm_dict.get('tn', 'N/A'):,} (Correctly identified nominal/alternative cases)
- **False Positives (FP):** {cm_dict.get('fp', 'N/A'):,} (False alarms resulting in unnecessary inspection)
- **False Negatives (FN):** {cm_dict.get('fn', 'N/A'):,} (Missed failures resulting in operational risk/breakdown)
- **True Positives (TP):** {cm_dict.get('tp', 'N/A'):,} (Successfully detected failure/degraded events)

---

## 2. Operational Diagnostics & Failure Patterns
{analysis_text}
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
