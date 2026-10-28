# Error Analysis Report: AI4I 2020 Predictive Maintenance
**Study Owner:** Student 1  
**Best Selected Model:** HistGradientBoosting  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Test Confusion Matrix Breakdown
- **True Negatives (TN):** 1,400 (Correctly identified nominal/alternative cases)
- **False Positives (FP):** 49 (False alarms resulting in unnecessary inspection)
- **False Negatives (FN):** 12 (Missed failures resulting in operational risk/breakdown)
- **True Positives (TP):** 39 (Successfully detected failure/degraded events)

---

## 2. Operational Diagnostics & Failure Patterns
### Failure Detection Performance
On the 1,500 held-out test records (containing 51 true failure cases):
- **HistGradientBoosting** detected **39** of 51 true failures (Recall: 76.47%).
- It incurred **49** false alarms (Precision: 44.32%).
- **12** failure incidents were missed.

### Lead Model Analysis (Logistic Regression)
- Logistic Regression achieved test F1 of 0.2543 and Recall of 86.27%.
- Because logistic regression fits a linear hyperplane in normalized sensor space, it struggles with the non-linear hyperbolic boundary between `Rotational speed [rpm]` and `Torque [Nm]` (Power = Torque $\times$ Speed), causing false negatives in high-torque/low-speed cutting regimes.
- Tree ensembles (Random Forest & HistGradientBoosting) successfully capture this non-linear interaction without manual polynomial feature engineering.

