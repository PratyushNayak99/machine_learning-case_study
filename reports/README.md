# ForgeWatch AI: Comprehensive Industrial Research Reports Directory

Welcome to the central repository reports hub for **ForgeWatch AI: A Comparative Study of Machine Failure and Condition Classification Across Industrial Datasets**.

This directory houses complete, self-contained, reproducible research reports, clean dedicated figure assets, tabular benchmark metrics, and machine-readable JSON manifests for each of the four independent student studies and the overarching cross-study executive synthesis.

---

## 1. Directory Structure & Navigation

The `reports/` folder is organized into dedicated subfolders for each student research domain and the cross-study team summary:

```
reports/
├── README.md                                    <- Master directory overview and research index (This file)
│
├── student_1_ai4i_milling/                      <- Student 1: CNC Milling Machine Failure Classification
│   ├── README.md                                <- Comprehensive Research Report (AI4I 2020)
│   ├── model_comparison.csv                     <- Benchmark metrics comparison table (CSV)
│   ├── metrics.json                             <- Complete machine-readable metrics manifest (JSON)
│   └── figures/                                 <- High-resolution dedicated figures
│       ├── model_comparison_bar.png             <- Test Accuracy, Balanced Acc, F1, PR-AUC, ROC-AUC comparison
│       ├── confusion_matrix_best.png            <- Confusion matrix for HistGradientBoosting (Best)
│       ├── confusion_matrix_logistic_regression.png <- Confusion matrix for Logistic Regression (Lead)
│       ├── roc_curve_best.png                   <- ROC curve with AUC metric
│       ├── pr_curve_best.png                    <- Precision-Recall curve with prevalence baseline
│       └── logistic_regression_coefficients.png <- Standardized feature coefficients / odds ratio chart
│
├── student_2_scania_trucks/                     <- Student 2: Scania APS Fleet Cost-Sensitive Classification
│   ├── README.md                                <- Comprehensive Research Report (Scania APS)
│   ├── model_comparison.csv                     <- Benchmark metrics comparison table (CSV)
│   ├── metrics.json                             <- Complete machine-readable metrics manifest (JSON)
│   └── figures/                                 <- High-resolution dedicated figures
│       ├── model_cost_comparison_bar.png        <- Challenge cost comparison (Default vs Tuned threshold)
│       ├── model_metrics_comparison_bar.png     <- Test Accuracy, Recall, Precision, F1, PR-AUC, ROC-AUC
│       ├── confusion_matrix_best.png            <- Confusion matrix for Cost-Tuned Random Forest (Best)
│       ├── confusion_matrix_decision_tree.png   <- Confusion matrix for Decision Tree (Lead)
│       ├── cost_curve_decision_tree.png         <- Operational cost curve across threshold sweeps
│       ├── roc_curve_best.png                   <- ROC curve with AUC metric
│       └── pr_curve_best.png                    <- Precision-Recall curve with prevalence baseline
│
├── student_3_hydraulic_systems/                 <- Student 3: Multi-Sensor Hydraulic Condition Monitoring
│   ├── README.md                                <- Comprehensive Research Report (Hydraulic Systems)
│   ├── model_comparison.csv                     <- Benchmark metrics comparison table (CSV)
│   ├── metrics.json                             <- Complete machine-readable metrics manifest (JSON)
│   └── figures/                                 <- High-resolution dedicated figures
│       ├── model_comparison_bar.png             <- Accuracy, Macro-F1, Balanced Acc, and Per-Class Recall
│       ├── feature_ablation_comparison.png      <- Controlled ablation: Full vs No-CE vs Pure Physical sensors
│       ├── confusion_matrix_best.png            <- 3-Class confusion matrix for Random Forest (Best & Lead)
│       ├── confusion_matrix_random_forest.png   <- Lead model confusion matrix
│       ├── sensor_modality_importance.png       <- Aggregated sensor subsystem Gini importance
│       └── top_cycle_features.png               <- Top 15 engineered statistical moment features
│
├── student_4_metropt_compressor/                <- Student 4: MetroPT-3 Operational Rail APU Event Detection
│   ├── README.md                                <- Comprehensive Research Report (MetroPT-3)
│   ├── model_comparison.csv                     <- Benchmark metrics comparison table (CSV)
│   ├── metrics.json                             <- Complete machine-readable metrics manifest (JSON)
│   └── figures/                                 <- High-resolution dedicated figures
│       ├── model_comparison_bar.png             <- Comparison of ROC-AUC and scaled PR-AUC across models
│       ├── threshold_sensitivity_curve.png      <- Operational threshold vs Recall, Precision, and F1 trade-off
│       ├── confusion_matrix_best.png            <- Confusion matrix for HistGradientBoosting (Best & Lead)
│       ├── confusion_matrix_hist_gradient_boosting.png <- Lead model confusion matrix
│       ├── roc_curve_best.png                   <- ROC curve with AUC metric
│       └── pr_curve_best.png                    <- Precision-Recall curve with prevalence baseline
│
└── cross_study_summary/                         <- Cross-Study Executive Research Synthesis
    ├── README.md                                <- Master comparative report & inductive bias synthesis
    ├── comparison_results.csv                   <- Full 20-model comparative results table (CSV)
    ├── comparison_results.json                  <- Structured cross-study manifest (JSON)
    └── figures/                                 <- Cross-study comparative figures
        ├── benchmark_relative_improvement.png   <- Supervised learning gain over dummy baseline (%)
        └── cross_dataset_performance_matrix.png <- Master visual benchmark matrix across all 4 datasets
```

---

## 2. Master Research Summary Matrix

| Study & Subfolder | Industrial Dataset | Physical Domain | Nature of Telemetry | Target Semantics | Imbalance | Student Lead | Selected Best Model | Selection Metric | Best Score |
|---|---|---|---|---|---|---|---|---|---|
| [**Student 1**](student_1_ai4i_milling/README.md) | **AI4I 2020** (UCI 601) | CNC Milling Machine | Synthetic Physical Simulation (10k rows) | Binary machine failure event | 3.39% positive | Logistic Regression | **HistGradientBoosting** | Validation PR-AUC | **0.7654 PR-AUC** (Acc: 95.93%) |
| [**Student 2**](student_2_scania_trucks/README.md) | **Scania Trucks APS** (UCI 421) | Commercial Transport Fleet | Real Workshop Telemetry (76k trucks) | APS failure vs. other failure | 1.67% positive | Decision Tree | **Random Forest (Tuned)** | Minimum Cost ($10\text{FP}+500\text{FN}$) | **10,660 units** (Acc: 96.71%) |
| [**Student 3**](student_3_hydraulic_systems/README.md) | **Hydraulic Systems** (UCI 447) | Multi-Sensor Hydraulic Rig | Physical Cyclic Bench Test (2,205 cycles) | 3-Class cooler condition (3, 20, 100) | Balanced (~33% each) | Random Forest | **Random Forest** | Validation Macro-F1 | **0.9970 Macro-F1** (Acc: 99.70%) |
| [**Student 4**](student_4_metropt_compressor/README.md) | **MetroPT-3** (UCI 791) | Urban Passenger Train APU | Continuous Operational Time-Series (>1.5M rows) | Window-level failure event detection | 0.41% positive | HistGradientBoosting | **HistGradientBoosting** | Validation PR-AUC & ROC-AUC | **0.9657 ROC-AUC** (Acc: 99.59%) |
| [**Cross-Study**](cross_study_summary/README.md) | **All 4 Datasets** | Comparative Industrial Synthesis | Multi-Domain Synthesis | Cross-Dataset Benchmark | Heterogeneous | Collaborative Team | **Domain Specific** | Multi-Criteria Utility | **+731% to +2171% Gain** |

---

## 3. Quick Reference: Model Performance Overview by Student

### Study 1: AI4I 2020 CNC Milling Machine
- **Objective:** Classify whether a milling machine is experiencing an active breakdown from 6 operational features.
- **Top Model:** **HistGradientBoosting** (PR-AUC: 0.7654, ROC-AUC: 0.9678, Accuracy: 95.93%, Recall: 76.47%, Precision: 44.32%).
- **Why Best:** Captures non-linear electro-mechanical boundaries ($P = \tau \cdot \omega$) and torque-speed stress envelopes without manual polynomial feature engineering.
- [Read Complete Student 1 Report $\to$](student_1_ai4i_milling/README.md)

### Study 2: Scania Trucks Air Pressure System (APS)
- **Objective:** Classify whether a broken truck's failure was localized in the Air Pressure System under asymmetric maintenance penalties ($10\text{FP} + 500\text{FN}$).
- **Top Model:** **Random Forest with Cost-Tuned Threshold ($\tau = 0.1585$)** (Test Challenge Cost: 10,660 cost units, Accuracy: 96.71%, Recall: 97.07%, ROC-AUC: 0.9906).
- **Why Best:** Bagging 100 deep trees reduces probability variance; lowering the threshold from 0.50 to 0.1585 slashes false negatives from 50 to 11, saving 58.1% of fleet challenge costs.
- [Read Complete Student 2 Report $\to$](student_2_scania_trucks/README.md)

### Study 3: Hydraulic Test Rig Condition Monitoring
- **Objective:** Classify 3-grade cooler health degradation (Total Failure `3`, Reduced `20`, Full `100`) across 60-second operational cycles.
- **Top Model:** **Random Forest** (Accuracy: 99.70%, Macro-F1: 0.9970, Balanced Acc: 99.70%, 100% recall on full efficiency and total failure).
- **Why Best:** Averaging decorrelated trees cancels transient acoustic and pressure noise; controlled ablation proved that physical temperature probes alone achieve 99.40% Macro-F1 even without virtual proxy calculations.
- [Read Complete Student 3 Report $\to$](student_3_hydraulic_systems/README.md)

### Study 4: MetroPT-3 Operational Rail Compressor
- **Objective:** Detect active compressor air leakages in 15-minute sliding windows under strict chronological holdout.
- **Top Model:** **HistGradientBoosting** (ROC-AUC: 0.9657, PR-AUC: 0.0574, Accuracy: 99.59%).
- **Why Best:** Outstanding ranking discrimination (ROC-AUC 0.9657); threshold calibration ($\tau = 0.01 - 0.02$) recovers up to 60% of failure event windows despite extreme event sparsity (0.41% prevalence) and seasonal summer thermal drift in Lisbon.
- [Read Complete Student 4 Report $\to$](student_4_metropt_compressor/README.md)

### Cross-Study Synthesis & Inductive Bias Analysis
- **Objective:** Evaluate how linear models, single decision trees, bagging ensembles, and boosting algorithms align with sensor realities and operational utility functions.
- [Read Cross-Study Executive Synthesis $\to$](cross_study_summary/README.md)
