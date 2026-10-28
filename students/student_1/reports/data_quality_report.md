# Data Quality Report: AI4I 2020 Predictive Maintenance
**Study Owner:** Student 1  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Dataset Dimensions & Schema Validation
- **Total Records:** 10,000
- **Total Attributes:** 14
- **Schema Conformity:** Valid
- **Missing Columns:** 0
- **Extra Columns:** 0

---

## 2. Missingness Profile (Top Attributes)
|  | missing_count | missing_percentage |
| --- | --- | --- |
| UDI | 0.0 | 0.0 |
| Product ID | 0.0 | 0.0 |
| Type | 0.0 | 0.0 |
| Air temperature [K] | 0.0 | 0.0 |
| Process temperature [K] | 0.0 | 0.0 |
| Rotational speed [rpm] | 0.0 | 0.0 |
| Torque [Nm] | 0.0 | 0.0 |
| Tool wear [min] | 0.0 | 0.0 |
| Machine failure | 0.0 | 0.0 |
| TWF | 0.0 | 0.0 |
| HDF | 0.0 | 0.0 |
| PWF | 0.0 | 0.0 |
| OSF | 0.0 | 0.0 |
| RNF | 0.0 | 0.0 |

---

## 3. Target Distribution & Class Prevalence
- **Target Variable:** `Machine failure`
- **Unique Classes:** 2

|  | Count | Prevalence (%) |
| --- | --- | --- |
| 0 | 9661.0 | 96.61 |
| 1 | 339.0 | 3.39 |

---

## 4. Quality Assessment & Data Cleaning Decisions
- Zero-variance or severely incomplete attributes handled based on training data thresholds.
- Data types verified and standardized for scikit-learn estimator pipelines.
- Non-predictive unique identifiers removed from predictor matrices.
