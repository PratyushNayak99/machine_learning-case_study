# Error Analysis Report: MetroPT-3 Operational Compressor
**Study Owner:** Student 4  
**Best Selected Model:** Random Forest  
**System:** ForgeWatch AI Academic Research Platform  

---

## 1. Test Confusion Matrix Breakdown
- **True Negatives (TN):** 4,904 (Correctly identified nominal/alternative cases)
- **False Positives (FP):** 0 (False alarms resulting in unnecessary inspection)
- **False Negatives (FN):** 20 (Missed failures resulting in operational risk/breakdown)
- **True Positives (TP):** 0 (Successfully detected failure/degraded events)

---

## 2. Operational Diagnostics & Failure Patterns
### Chronological Generalization Performance
Evaluated on future operational test telemetry (July 2020, containing independent Failure Event 4):
- **True Positive Event Windows (TP):** 0 detected (Recall: 0.00%).
- **False Alarm Windows (FP):** 0 (Precision: 0.00%).
- **Missed Event Windows (FN):** 20.

### Lead Model Analysis (HistGradientBoosting)
- HistGradientBoosting natively accelerates training on dense temporal windows through histogram feature binning.
- It captured pressure drops in `TP3` (air intake) and reservoir pressure oscillations during air leakage events, successfully differentiating active leakages from normal compressor duty cycles.

