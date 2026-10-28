# Data Quality Report: APS Failure at Scania Trucks
**Study Owner:** Student 2  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Dataset Dimensions & Schema Validation
- **Total Records:** 60,000
- **Total Attributes:** 171
- **Schema Conformity:** Valid
- **Missing Columns:** 0
- **Extra Columns:** 0

---

## 2. Missingness Profile (Top Attributes)
|  | missing_count | missing_percentage |
| --- | --- | --- |
| br_000 | 49264.0 | 82.11 |
| bq_000 | 48722.0 | 81.2 |
| bp_000 | 47740.0 | 79.57 |
| bo_000 | 46333.0 | 77.22 |
| ab_000 | 46329.0 | 77.22 |
| cr_000 | 46329.0 | 77.22 |
| bn_000 | 44009.0 | 73.35 |
| bm_000 | 39549.0 | 65.92 |
| bl_000 | 27277.0 | 45.46 |
| bk_000 | 23034.0 | 38.39 |
| ad_000 | 14861.0 | 24.77 |
| cg_000 | 14861.0 | 24.77 |
| ch_000 | 14861.0 | 24.77 |
| cf_000 | 14861.0 | 24.77 |
| co_000 | 14861.0 | 24.77 |

---

## 3. Target Distribution & Class Prevalence
- **Target Variable:** `class`
- **Unique Classes:** 2

|  | Count | Prevalence (%) |
| --- | --- | --- |
| neg | 59000.0 | 98.333 |
| pos | 1000.0 | 1.667 |

---

## 4. Quality Assessment & Data Cleaning Decisions
- Zero-variance or severely incomplete attributes handled based on training data thresholds.
- Data types verified and standardized for scikit-learn estimator pipelines.
- Non-predictive unique identifiers removed from predictor matrices.
