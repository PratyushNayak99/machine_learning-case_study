# Data Quality Report: Condition Monitoring of Hydraulic Systems
**Study Owner:** Student 3  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Dataset Dimensions & Schema Validation
- **Total Records:** 2,205
- **Total Attributes:** 136
- **Schema Conformity:** Valid
- **Missing Columns:** 0
- **Extra Columns:** 0

---

## 2. Missingness Profile (Top Attributes)
|  | missing_count | missing_percentage |
| --- | --- | --- |
| PS1_mean | 0.0 | 0.0 |
| PS1_std | 0.0 | 0.0 |
| PS1_min | 0.0 | 0.0 |
| PS1_max | 0.0 | 0.0 |
| PS1_median | 0.0 | 0.0 |
| PS1_peak_to_peak | 0.0 | 0.0 |
| PS1_rms | 0.0 | 0.0 |
| PS1_skew | 0.0 | 0.0 |
| PS2_mean | 0.0 | 0.0 |
| PS2_std | 0.0 | 0.0 |
| PS2_min | 0.0 | 0.0 |
| PS2_max | 0.0 | 0.0 |
| PS2_median | 0.0 | 0.0 |
| PS2_peak_to_peak | 0.0 | 0.0 |
| PS2_rms | 0.0 | 0.0 |

---

## 3. Target Distribution & Class Prevalence
- **Target Variable:** `cooler_condition`
- **Unique Classes:** 3

|  | Count | Prevalence (%) |
| --- | --- | --- |
| 100 | 741.0 | 33.605 |
| 3 | 732.0 | 33.197 |
| 20 | 732.0 | 33.197 |

---

## 4. Quality Assessment & Data Cleaning Decisions
- Zero-variance or severely incomplete attributes handled based on training data thresholds.
- Data types verified and standardized for scikit-learn estimator pipelines.
- Non-predictive unique identifiers removed from predictor matrices.
