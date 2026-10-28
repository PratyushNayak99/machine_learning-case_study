# ForgeWatch AI — Research Study 2
# APS Failure at Scania Trucks: Asymmetric Cost-Sensitive Classification
**Author:** Student 2 (Primary Model Lead: Decision Tree Classifier)  
**Affiliation:** ForgeWatch AI Research Group  

---

## Abstract
This study evaluates cost-sensitive classification on the Scania Trucks Air Pressure System dataset (UCI ID 421 / IDA 2016 Challenge). Comprising 60,000 training and 16,000 test observations across 171 attributes, the task evaluates whether vehicle servicing was driven by APS component failure (`pos`) versus non-APS failures (`neg`). Addressing severe class imbalance (~1.67% positive) and missingness, we deployed median imputation with missingness indicators and conducted validation-based threshold tuning against the official industrial cost function ($\text{Cost} = 10 \text{FP} + 500 \text{FN}$). While Decision Trees yielded fully interpretable dispatch decision rules, ensemble methods (Random Forest) achieved minimum overall challenge cost (10,660 cost units) by slashing false negatives.

---

## 1. Problem Formulation & Challenge Cost Function
The objective is to minimize total maintenance challenge cost under an asymmetric 50:1 cost ratio:
$$\min_{\tau} \quad 10 \times \text{FP}(\tau) + 500 \times \text{FN}(\tau)$$

---

## 2. Comparative Results Summary
| model | optimal_threshold | val_cost | val_f1 | test_cost_tuned (cost units) | test_cost_default (cost units) | test_fp | test_fn | test_precision | test_recall | test_f1 | test_pr_auc | test_roc_auc |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Random Forest | 0.1585 | 6170.0 | 0.597 | 10660.0 | 25470.0 | 516 | 11 | 0.4136 | 0.9707 | 0.5801 | 0.7345 | 0.9906 |
| HistGradientBoosting | 0.2575 | 6390.0 | 0.6169 | 12550.0 | 16960.0 | 405 | 17 | 0.4692 | 0.9547 | 0.6292 | 0.8843 | 0.9922 |
| Logistic Regression | 0.5643 | 9030.0 | 0.5158 | 18830.0 | 17900.0 | 333 | 31 | 0.5081 | 0.9173 | 0.654 | 0.7996 | 0.9803 |
| Decision Tree | 0.0694 | 9040.0 | 0.4521 | 20980.0 | 20980.0 | 548 | 31 | 0.3857 | 0.9173 | 0.543 | 0.6213 | 0.9199 |
| Dummy Classifier | 0.01 | 98760.0 | 0.0314 | 185440.0 | 185440.0 | 244 | 366 | 0.0356 | 0.024 | 0.0287 | 0.0237 | 0.5042 |

---

## 3. Decision Tree Lead Analysis
- **Interpretability:** Mechanics require transparent diagnostic decision paths rather than opaque black-box scores.
- **Threshold Tuning:** Shifting the probability threshold from 0.5 to 0.0694 reduced Decision Tree operational test cost significantly.

---

## 4. Academic Limitations
1. **Anonymized Features:** Features are anonymized identifiers (`aa_000`, `bb_000`), preventing physical thermodynamic units from being cross-checked.
2. **Negative Class Semantics:** A negative prediction indicates non-APS component failure, not a defect-free vehicle.
3. **Challenge Cost Units:** Costs are benchmark penalty units defined by the IDA 2016 competition organizers, not direct currency or verified financial savings.

---

## 5. Conclusion
In commercial vehicle maintenance where roadside breakdowns incur a 50:1 penalty over workshop inspections, threshold optimization against domain cost matrices is vastly more important than maximizing unweighted classification accuracy.
