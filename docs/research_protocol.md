# ForgeWatch AI: Common Research Protocol

## 1. Problem Statement & Research Question

**Research Question:**
*How do different machine learning algorithm families (linear, single-tree, ensemble bagging, and gradient boosted trees) perform when detecting or classifying equipment failure and degraded operating conditions across distinct industrial sensor datasets?*

### Fundamental Semantic Distinctions
In industrial analytics, failure terminology must be used with precision:
- **Failure Classification:** Categorizing an observed record or time window into a nominal state vs. an active/recorded failure state.
- **Component-Condition Classification:** Multi-grade assessment of the health, wear, or degradation stage of a physical component (e.g., 100% efficiency vs. 20% vs. 3%).
- **Failure-Event Detection:** Detecting the onset or occurrence of a bounded physical failure event from telemetry.
- **Future Failure Prediction:** Forecasting that a failure will occur within a specified future lead-time horizon ($t + \Delta t$) before any actual breakdown.

No model in this project shall be designated as predicting future failure unless its evaluation design strictly establishes a valid pre-failure forecast horizon.

---

## 2. Experimental Controls & Reproducibility Standards

### Random Seed Standardization
- Global seed: `RANDOM_STATE = 42`
- Applied consistently across:
  - Dataset splitting (`train_test_split`, `StratifiedKFold`, `TimeSeriesSplit`)
  - Model initialization (`LogisticRegression`, `DecisionTreeClassifier`, `RandomForestClassifier`, `HistGradientBoostingClassifier`, `DummyClassifier`)
  - Subsampling, permutations, and cross-validation folds.

### Data Leakage Prevention Rules
1. **Fit Preprocessing Strictly on Training Data:** Imputers, scalers, and categorical encoders must be fitted exclusively on the training partition (`fit_transform`) and applied to validation and test partitions with `transform` only.
2. **Outcome-Related Leakage Prohibition:** Any sensor feature or metadata attribute directly resulting from the target failure mode (e.g., specific failure mode flags in AI4I: `TWF`, `HDF`, `PWF`, `OSF`, `RNF`) must be strictly excluded from input feature matrices.
3. **Identifier Exclusion:** Non-predictive unique identifiers (`UDI`, `Product ID`, cycle indices) must not be passed into classifiers.
4. **Temporal Integrity (Time Series):** When splitting time series or cycle data, shuffling is prohibited. A strict chronological or cycle-isolated split must be maintained to avoid lookahead bias.

---

## 3. Model Families & Lead Ownership

Every student implements all five algorithms on their assigned dataset:
1. **DummyClassifier (Benchmark):** Establishes minimal non-trivial baseline performance using stratified or most frequent class strategies.
2. **Logistic Regression (L1/L2/ElasticNet):** Linear boundary baseline requiring scaled features, interpretable via odds ratios.
3. **Decision Tree Classifier:** Non-linear recursive partitioning baseline with depth/complexity pruning.
4. **Random Forest Classifier:** Bagged tree ensemble assessing non-linear feature interactions and out-of-bag error.
5. **HistGradientBoosting Classifier:** Gradient-boosted decision trees using histogram binning with native handling of missing values.

### Lead Allocation
- **Student 1 Lead:** Logistic Regression
- **Student 2 Lead:** Decision Tree Classifier
- **Student 3 Lead:** Random Forest Classifier
- **Student 4 Lead:** HistGradientBoosting Classifier

---

## 4. Evaluation Metrics Protocol

### Binary Classification Tasks (AI4I, Scania APS, MetroPT-3)
- **Positive Prevalence:** True positive rate in the ground truth partition.
- **Precision:** $\frac{\text{TP}}{\text{TP} + \text{FP}}$
- **Recall (Sensitivity):** $\frac{\text{TP}}{\text{TP} + \text{FN}}$
- **F1-Score:** $2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$
- **PR-AUC (Average Precision):** Primary metric under severe class imbalance.
- **ROC-AUC:** Area under receiver operating characteristic.
- **Balanced Accuracy:** $\frac{\text{Recall} + \text{Specificity}}{2}$
- **Confusion Matrix:** Explicit count of TN, FP, FN, TP.
- **Operational Cost Metric (Scania APS):**
  $$\text{Total Cost} = 10 \times \text{FP} + 500 \times \text{FN}$$
  Decision thresholds must be calibrated on validation data to minimize this specific cost function.

### Multi-Class Condition Classification (Hydraulic Systems)
- **Macro-Averaged F1:** Unweighted mean of F1 across all condition states.
- **Weighted-Averaged F1:** Class-size weighted F1.
- **Balanced Accuracy:** Mean recall across all condition categories.
- **Per-Class Precision & Recall:** Granular diagnostics for each degradation level.
- **Multi-Class Confusion Matrix:** Visualizing which adjacent degradation stages are confused.

---

## 5. Artifact Versioning & Deliverables

Each student repository folder produces:
- `dataset/schema.json`: Formal feature descriptions, data types, physical units.
- `reports/data_quality_report.md`: Missingness, outliers, cardinality, sanity checks.
- `reports/eda_report.md`: Distributional insights and correlation analysis.
- `reports/model_comparison.csv`: Tabular benchmark comparing all 5 algorithms.
- `reports/metrics.json`: Machine-readable evaluation metrics for backend and team comparison.
- `reports/error_analysis.md`: Detailed failure mode diagnostics, false alarms, and missed failures.
- `reports/final_study.md`: Complete academic study writeup.
- `artifacts/best_model.joblib`: Serialized inference pipeline (preprocessing + model).
