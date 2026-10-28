# Exploratory Data Analysis Report: APS Failure at Scania Trucks
**Study Owner:** Student 2 (Lead: Decision Tree Classifier)  
**System:** ForgeWatch AI Academic Platform  

---

## 1. Domain Context & Target Semantics
- **Target Variable:** `class`
  - `pos`: The heavy vehicle suffered a breakdown specifically attributable to the Air Pressure System (APS).
  - `neg`: The vehicle suffered a failure in an *unrelated* subsystem (e.g. electrical, braking, engine cooling).
  - **Critical Domain Caveat:** The `neg` label does NOT denote a healthy or defect-free truck.

---

## 2. High-Dimensional Sensor Profile & Missingness
- **Total Features:** 170 anonymized attributes comprising sensor counters, histogram bins, and cumulative operating metrics.
- **Missingness Profile:** Missing values were encoded as `"na"`. Several attributes exhibited >75% missingness:
  - Dropped attributes: `['ab_000', 'bo_000', 'bp_000', 'bq_000', 'br_000', 'cr_000']`
- Median imputation combined with missingness indicators was deployed to retain pattern clues where absence of a sensor measurement indicates component disconnection.

---

## 3. Asymmetric Maintenance Cost Economics
Standard accuracy is dangerously deceptive on Scania:
$$\text{Total Challenge Cost} = 10 \times \text{FP} + 500 \times \text{FN}$$
- A False Positive incurs 10 cost units (unnecessary diagnostic inspection).
- A False Negative incurs 500 cost units (unaddressed APS failure causing roadside vehicle breakdown).
- Minimizing operational challenge cost requires sweeping the decision threshold downward from 0.5 to maximize recall of true APS failures.
