# Data Quality Report: MetroPT-3 Operational Compressor
**Study Owner:** Student 4  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Dataset Dimensions & Schema Validation
- **Total Records:** 17,085
- **Total Attributes:** 75
- **Schema Conformity:** Valid
- **Missing Columns:** 0
- **Extra Columns:** 0

---

## 2. Missingness Profile (Top Attributes)
|  | missing_count | missing_percentage |
| --- | --- | --- |
| TP2_mean | 0.0 | 0.0 |
| TP2_std | 0.0 | 0.0 |
| TP2_min | 0.0 | 0.0 |
| TP2_max | 0.0 | 0.0 |
| TP3_mean | 0.0 | 0.0 |
| TP3_std | 0.0 | 0.0 |
| TP3_min | 0.0 | 0.0 |
| TP3_max | 0.0 | 0.0 |
| H1_mean | 0.0 | 0.0 |
| H1_std | 0.0 | 0.0 |
| H1_min | 0.0 | 0.0 |
| H1_max | 0.0 | 0.0 |
| DV_pressure_mean | 0.0 | 0.0 |
| DV_pressure_std | 0.0 | 0.0 |
| DV_pressure_min | 0.0 | 0.0 |

---

## 3. Target Distribution & Class Prevalence
- **Target Variable:** `failure_event`
- **Unique Classes:** 2

|  | Count | Prevalence (%) |
| --- | --- | --- |
| Nominal (0) | 16579.0 | 98.0 |
| Failure Event (1) | 339.0 | 2.0 |

---

## 4. Quality Assessment & Data Cleaning Decisions
- Zero-variance or severely incomplete attributes handled based on training data thresholds.
- Data types verified and standardized for scikit-learn estimator pipelines.
- Non-predictive unique identifiers removed from predictor matrices.
