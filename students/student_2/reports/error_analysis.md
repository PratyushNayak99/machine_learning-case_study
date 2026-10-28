# Error Analysis Report: APS Failure at Scania Trucks
**Study Owner:** Student 2  
**Best Selected Model:** Random Forest  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Test Confusion Matrix Breakdown
- **True Negatives (TN):** 15,109 (Correctly identified nominal/alternative cases)
- **False Positives (FP):** 516 (False alarms resulting in unnecessary inspection)
- **False Negatives (FN):** 11 (Missed failures resulting in operational risk/breakdown)
- **True Positives (TP):** 364 (Successfully detected failure/degraded events)

---

## 2. Operational Diagnostics & Failure Patterns
### Asymmetric Error Impact
On the 16,000 official test records (with 375 true APS failures):
- Under default 0.5 threshold: Cost was 25,470 cost units.
- Under tuned threshold (0.1585): Cost reduced to **10,660 cost units**.
- Missed failures (FN): **11** (each incurring 500 cost units = 5,500 cost units).
- False alarms (FP): **516** (each incurring 10 cost units = 5,160 cost units).

### Lead Model Analysis (Decision Tree)
- Single Decision Trees provide complete path interpretability for mechanics (e.g., if sensor `aa_000` > threshold and `am_0` > threshold, inspect APS valve).
- However, single trees are sensitive to variance in high-dimensional continuous features.
- Tuning the threshold on the tree probabilities allows shifting the operating point to minimize roadside breakdowns without complex model ensembles.

