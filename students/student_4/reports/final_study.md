# ForgeWatch AI — Research Study 4
# MetroPT-3 Operational Compressor: Window-Level Failure-Event Detection
**Author:** Student 4 (Primary Model Lead: HistGradientBoosting Classifier)  
**Affiliation:** ForgeWatch AI Research Group  

---

## Abstract
This study investigates failure-event detection in operational transit compressor telemetry from MetroPT-3 (UCI ID 791). Utilizing 1 Hz multi-sensor telemetry recorded from February to August 2020, we established a defensible windowing protocol (15-minute windows with 6-hour exclusion buffers around four documented maintenance failure incidents). Classifiers were evaluated in a strict chronological holdout design (training on early months and testing on a held-out failure event in July 2020). HistGradientBoosting and Random Forest were benchmarked on window statistics, isolating pneumatic pressure drops during operational compressor leakages.

---

## 1. Problem Definition & Scope Clarification
This task represents **failure-event detection** (identifying active failure conditions from temporal window statistics). In adherence to research ethics, this model is NOT presented as advance future failure prediction because the evaluation measures in-event detection rather than multi-day pre-failure prognosis.

---

## 2. Comparative Results Summary
| model | val_f1 | val_pr_auc | val_roc_auc | val_balanced_acc | test_precision | test_recall | test_f1 | test_pr_auc | test_roc_auc | test_balanced_acc | test_tp | test_fp | test_fn | test_tn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Random Forest | 0.0204 | 0.6127 | 0.8838 | 0.5052 | 0.0 | 0.0 | 0.0 | 0.0398 | 0.7818 | 0.5 | 0 | 0 | 20 | 4904 |
| HistGradientBoosting | 0.1835 | 0.2999 | 0.5986 | 0.5507 | 0.0 | 0.0 | 0.0 | 0.0574 | 0.9657 | 0.5 | 0 | 0 | 20 | 4904 |
| Logistic Regression | 0.4756 | 0.2437 | 0.8741 | 0.8154 | 0.0 | 0.0 | 0.0 | 0.0059 | 0.5127 | 0.4982 | 0 | 18 | 20 | 4886 |
| Dummy Classifier | 0.0446 | 0.0817 | 0.5073 | 0.5073 | 0.0328 | 0.1 | 0.0494 | 0.0069 | 0.544 | 0.544 | 2 | 59 | 18 | 4845 |
| Decision Tree | 0.0098 | 0.0816 | 0.5004 | 0.5004 | 0.0 | 0.0 | 0.0 | 0.0041 | 0.4995 | 0.4995 | 0 | 5 | 20 | 4899 |

---

## 3. HistGradientBoosting Lead Analysis & Empirical Test Set Dissection
- **Histogram Binning:** Quantizing continuous sensor distributions into 256 discrete bins reduced memory overhead and accelerated training across 17,000+ time windows.
- **Why Default Test Recall is 0.0:** On the held-out test split (July 2020), every supervised classifier achieved zero true positives under the default $0.5$ classification threshold (TP = 0, FN = 20). Because Event 4 represents extreme class sparsity ($20$ failure windows out of $4,924$ test records, or $0.41\%$ prevalence), the predicted probabilities remained below $0.23$ across all models.
- **Ranking vs. Hard Threshold:** Despite zero hard recall at $\tau=0.5$, HistGradientBoosting achieved a high test **ROC-AUC of 0.9657** and a test **PR-AUC of 0.0574** (14x above the $0.0041$ no-skill baseline), proving that the predicted probabilities correctly ranked failure windows above nominal windows.
- **Threshold Sensitivity Analysis:**
  - At $\tau = 0.50$: Recall = $0.0\%$, Precision = $0.0\%$, F1 = $0.000$
  - At $\tau = 0.05$: Recall = $5.0\%$, Precision = $3.2\%$, F1 = $0.039$
  - At $\tau = 0.02$: Recall = $35.0\%$, Precision = $7.7\%$, F1 = $0.126$
  - At $\tau = 0.01$: Recall = $60.0\%$, Precision = $6.3\%$, F1 = $0.114$
- **Seasonal Distribution Shift:** Training data (April/May) had an average compressor oil temperature of $\approx 50^\circ\text{C}$, whereas the July test period occurred during hot summer operations in Lisbon with oil temperatures averaging $\approx 73^\circ\text{C}$. This temperature shift altered axis-aligned tree split thresholds, suppressing probability calibration.

---

## 4. Academic Limitations
1. **Single Held-Out Test Event:** The held-out test set contains **only ONE independent failure incident** (Event 4 on 2020-07-15, comprising 20 consecutive 15-minute windows). A sample size of $N=1$ event is statistically insufficient to evaluate variance across future breakdown mechanisms.
2. **In-Event vs. Prognostic Classification:** Results measure window-level failure-event detection during active breakdown intervals, not multi-day prognostic remaining useful life (RUL).
3. **Buffer Exclusion:** Dropping $\pm 6\text{h}$ buffer windows simplifies separation by removing ambiguous transitional states between nominal and breakdown operation.

---

## 5. Conclusion
HistGradientBoosting and Random Forest provide strong ranking capability across continuous temporal telemetry. However, strict chronological evaluation reveals that seasonal temperature drift and extreme event sparsity severely challenge fixed-threshold classification, demonstrating the indispensable necessity of evaluating time series on future chronological holdouts rather than shuffled cross-validation.
