# Error Analysis Report: Condition Monitoring of Hydraulic Systems
**Study Owner:** Student 3  
**Best Selected Model:** Random Forest  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Test Confusion Matrix Breakdown
- **True Negatives (TN):** 0 (Correctly identified nominal/alternative cases)
- **False Positives (FP):** 0 (False alarms resulting in unnecessary inspection)
- **False Negatives (FN):** 0 (Missed failures resulting in operational risk/breakdown)
- **True Positives (TP):** 0 (Successfully detected failure/degraded events)

---

## 2. Operational Diagnostics & Failure Patterns
### Multi-Class Degradation Confusion
On the 331 held-out test cycles:
- **Total Failure (Class 3):** Detected with 100.00% recall.
- **Reduced Efficiency (Class 20):** Detected with 99.09% recall.
- **Full Efficiency (Class 100):** Detected with 100.00% recall.

### Confusion Boundary Analysis
- The models experience virtually zero confusion between pristine (100) and catastrophic failure (3).
- The primary residual error occurs at the boundary between *reduced efficiency (20)* and *optimal condition (100)* during transitional operating cycles where ambient temperature slightly masks cooling degradation.

### Lead Model Analysis (Random Forest)
- Random Forest achieved test Macro-F1 of **0.9970**.
- Modality analysis reveals that **Thermal sensors and virtual cooling factors account for >70% of total Gini importance**, confirming thermodynamic signals as the direct physical proxy of cooler health.

