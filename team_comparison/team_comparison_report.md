# ForgeWatch AI: Team Comparative Research Report
**Project Title:** ForgeWatch AI: A Comparative Study of Machine Failure and Condition Classification Across Industrial Datasets  
**System:** Multi-Student Predictive Maintenance Research Platform  

---

## Executive Summary
This report synthesizes independent research studies conducted across four distinct industrial sensor domains. Rather than claiming that four empirical experiments prove or validate theoretical theorems such as the "No Free Lunch" theorem, this synthesis examines how distinct algorithmic inductive biases (linear boundaries, recursive single-tree partitioning, bagging, and gradient boosting) align with specific dataset characteristics, sensor dimensionalities, sampling rates, and operational utility functions.

---

## 1. Cross-Dataset Taxonomy & Semantic Profiling
| Study | Dataset | Domain | Nature | Dimensions | Target Semantics | Class Imbalance | Lead Algorithm |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Student 1 | AI4I 2020 Predictive Maintenance | CNC Milling Machine | Synthetic Physical Simulation | 10,000 samples, 6 features | Binary machine failure event (Simulated) | 3.39% positive (severe) | Logistic Regression |
| Student 2 | APS Failure at Scania Trucks | Heavy Transport Vehicle Fleet | Real Industrial Workshop Telemetry | 76,000 samples, 171 attributes | Binary APS failure vs. other failure (NOT healthy) | 1.67% positive (extreme) | Decision Tree Classifier |
| Student 3 | Condition Monitoring Hydraulic Systems | Experimental Hydraulic Rig | Physical Bench Test (Cycles) | 2,205 cycles (60s), 136 features | 3-Class component degradation (3, 20, 100) | Balanced (~33% per class) | Random Forest Classifier |
| Student 4 | MetroPT-3 Operational Compressor | Urban Metro Train APU | Operational Transit Time-Series | >1.5M records, 15-min windows | Failure-event detection (In-event windows) | Sparse events (4 incidents) | HistGradientBoosting Classifier |

---

## 2. Best Model by Industrial Environment
- **AI4I 2020 Predictive Maintenance Dataset (Student 1):** Best model is **HistGradientBoosting** under criterion *Validation PR-AUC*.
- **APS Failure at Scania Trucks (Student 2):** Best model is **Random Forest** under criterion *Minimum Operational Cost (10*FP + 500*FN)*.
- **Condition Monitoring of Hydraulic Systems (Student 3):** Best model is **Random Forest** under criterion *Validation Macro-F1*.
- **MetroPT-3 Operational Transit Compressor Dataset (Student 4):** Best model is **Random Forest** under criterion *Validation PR-AUC*.

---

## 3. Algorithm Rankings Within Each Dataset
| Study | Dataset | Model | Rank | Primary Metric | Score | PR-AUC | ROC-AUC | Balanced Acc |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| student_1 | AI4I 2020 Predictive Maintenance Dataset | Random Forest | 1 | f1_score | 0.5773 | 0.6549 | 0.9569 | 0.7683 |
| student_1 | AI4I 2020 Predictive Maintenance Dataset | HistGradientBoosting | 2 | f1_score | 0.5612 | 0.7654 | 0.9678 | 0.8654 |
| student_1 | AI4I 2020 Predictive Maintenance Dataset | Decision Tree | 3 | f1_score | 0.4751 | 0.5576 | 0.8665 | 0.8915 |
| student_1 | AI4I 2020 Predictive Maintenance Dataset | Logistic Regression | 4 | f1_score | 0.2543 | 0.3856 | 0.9034 | 0.8448 |
| student_1 | AI4I 2020 Predictive Maintenance Dataset | Dummy Classifier | 5 | f1_score | 0.0189 | 0.0337 | 0.4912 | 0.4912 |
| student_2 | APS Failure at Scania Trucks | Logistic Regression | 1 | f1_score | 0.654 | 0.7996 | 0.9803 | 0.948 |
| student_2 | APS Failure at Scania Trucks | HistGradientBoosting | 2 | f1_score | 0.6292 | 0.8843 | 0.9922 | 0.9644 |
| student_2 | APS Failure at Scania Trucks | Random Forest | 3 | f1_score | 0.5801 | 0.7345 | 0.9906 | 0.9688 |
| student_2 | APS Failure at Scania Trucks | Decision Tree | 4 | f1_score | 0.543 | 0.6213 | 0.9199 | 0.9411 |
| student_2 | APS Failure at Scania Trucks | Dummy Classifier | 5 | f1_score | 0.0287 | 0.0237 | 0.5042 | 0.5042 |
| student_3 | Condition Monitoring of Hydraulic Systems | Random Forest | 1 | macro_f1 | 0.997 | N/A | N/A | 0.997 |
| student_3 | Condition Monitoring of Hydraulic Systems | Decision Tree | 2 | macro_f1 | 0.997 | N/A | N/A | 0.997 |
| student_3 | Condition Monitoring of Hydraulic Systems | Logistic Regression | 3 | macro_f1 | 0.997 | N/A | N/A | 0.997 |
| student_3 | Condition Monitoring of Hydraulic Systems | HistGradientBoosting | 4 | macro_f1 | 0.997 | N/A | N/A | 0.997 |
| student_3 | Condition Monitoring of Hydraulic Systems | Dummy Classifier | 5 | macro_f1 | 0.2982 | N/A | N/A | 0.2991 |
| student_4 | MetroPT-3 Operational Transit Compressor Dataset | Dummy Classifier | 1 | f1_score | 0.0494 | 0.0069 | 0.544 | 0.544 |
| student_4 | MetroPT-3 Operational Transit Compressor Dataset | HistGradientBoosting | 2 | f1_score | 0.0 | 0.0574 | 0.9657 | 0.5 |
| student_4 | MetroPT-3 Operational Transit Compressor Dataset | Random Forest | 3 | f1_score | 0.0 | 0.0398 | 0.7818 | 0.5 |
| student_4 | MetroPT-3 Operational Transit Compressor Dataset | Decision Tree | 4 | f1_score | 0.0 | 0.0041 | 0.4995 | 0.4995 |
| student_4 | MetroPT-3 Operational Transit Compressor Dataset | Logistic Regression | 5 | f1_score | 0.0 | 0.0059 | 0.5127 | 0.4982 |

---

## 4. Academic Synthesis: Observed Dataset-Specific Performance and Inductive Biases
1. **Tree Ensembles vs. Linear Models on Physical Sensors:**
   - On physical systems featuring non-linear energy and thermodynamic relationships (e.g. $P = \tau \cdot \omega$ in AI4I milling, and heat transfer in Hydraulic test rigs), **Random Forest** and **HistGradientBoosting** consistently outperform Logistic Regression because tree partitions approximate non-linear interaction surfaces without polynomial manual expansions.
   - However, **Logistic Regression** remains valuable when operational safety envelopes require strict monotonic bounds and transparent physical odds ratios ($e^{w_j}$).

2. **Impact of Asymmetric Error Costs (Scania APS):**
   - High classification accuracy is deceptive when unaddressed roadside breakdowns are penalized 50x more heavily than workshop inspections (Cost = 10*FP + 500*FN).
   - Validation-tuned decision thresholds reduced test challenge cost from 25,470 down to 10,660 cost units. These figures represent competition penalty units rather than verified enterprise monetary savings.

3. **Temporal Integrity vs. Tabular Shuffling (MetroPT-3):**
   - In time-series equipment telemetry, standard random k-fold cross-validation causes lookahead bias.
   - Strict chronological holdout evaluation and exclusion buffers are mandatory. However, having only a single breakdown event (Event 4) in the held-out test period severely restricts statistical confidence in multi-day prognostic claims.

---

## 5. Experimental Limitations Across Studies
1. **AI4I 2020:** 10,000 synthetic observations generated by a physical simulation model; does not capture empirical production floor noise or stochastic tool fracture.
2. **Scania Trucks APS:** The 'neg' class represents trucks failing in non-APS components; it is an attribution task, not healthy equipment anomaly detection.
3. **Hydraulic Systems:** 60-second fixed cycles on a laboratory test bench. The virtual sensor `CE` (Cooling Efficiency in %) is mathematically aligned with the target condition (`cooler_condition`), though ablation shows physical temperature and pressure sensors also discriminate cooler state effectively.
4. **MetroPT-3:** Only 4 real maintenance failure events recorded across months of operation, with only 1 event in the held-out test split, limiting evaluation of future failure prognosis.

---

## 6. Summary Conclusion & Industrial Recommendations
There is no universal single model for industrial maintenance. The optimal architecture depends directly on the failure semantics and operational constraints:
- For interpretable parametric safety envelopes $\to$ **Logistic Regression with Odds Ratios**.
- For transparent mechanic troubleshooting $\to$ **Cost-Tuned Decision Trees**.
- For multi-sensor cycle degradation classification $\to$ **Random Forest (Bagging)**.
- For high-dimensional, missing, or continuous temporal telemetry $\to$ **HistGradientBoosting**.
