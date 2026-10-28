# ForgeWatch AI: Team Work Allocation & Responsibilities

This document defines the team organization, student dataset ownership, primary algorithm lead assignments, and collaborative responsibilities for ForgeWatch AI.

---

## 1. Team Organization Matrix

| Student Identifier | Assigned Study & Dataset | Dataset Profile | Primary Model Lead | Shared Infrastructure Responsibility |
|---|---|---|---|---|
| **Student 1** | **AI4I 2020 Predictive Maintenance** | Simulated CNC Milling Machine (10k rows, 6 features) | **Logistic Regression** | Common Data Validation & Preprocessing Framework |
| **Student 2** | **APS Failure at Scania Trucks** | Heavy Transport Vehicle Fleet (60k train / 16k test, 171 attributes) | **Decision Tree Classifier** | Evaluation Metrics & Cost-Matrix Utilities |
| **Student 3** | **Condition Monitoring of Hydraulic Systems** | Experimental Multi-Sensor Test Rig (2,205 cycles, multi-frequency sensors) | **Random Forest Classifier** | Plotting, Visualizations & Heatmap Generators |
| **Student 4** | **MetroPT-3 Urban Transit Compressor** | Continuous Operational Telemetry (>1.5M timestamped records) | **HistGradientBoosting Classifier** | Reporting Engines & Cross-Study Synthesis |

---

## 2. Individual Student Ownership Boundaries

Each student strictly maintains an independent, end-to-end reproducible research workspace under `students/student_{N}/`:

1. **Dataset Acquisition (`dataset/`):** Scripted downloading and schema definitions.
2. **Preprocessing Pipeline (`preprocessing/`):**
   - Data validation and missing value profiling.
   - Leakage elimination and feature encoding/scaling.
   - Dataset-appropriate partition generation (Stratified vs. Chronological).
3. **Model Implementations (`models/`):**
   - All students must implement and benchmark all 5 models:
     - `dummy_baseline/train.py`
     - `logistic_regression/train.py`
     - `decision_tree/train.py`
     - `random_forest/train.py`
     - `gradient_boosting/train.py`
4. **Evaluation & Artifacts (`evaluation/`, `artifacts/`):**
   - Metrics generation on validation and held-out test data.
   - Calibration curves, ROC curves, PR curves, confusion matrices.
   - Serialization of `best_model.joblib` and full fitted pipeline.
5. **Academic Reporting (`reports/`):**
   - `data_quality_report.md`
   - `eda_report.md`
   - `model_comparison.csv`
   - `metrics.json`
   - `error_analysis.md`
   - `final_study.md`
6. **Automated Unit Testing (`tests/`):**
   - Unit tests validating pipeline execution, schema contracts, and leakage absence.

---

## 3. Primary Algorithm Lead Responsibilities

While every student implements all models, each student acts as the team subject-matter expert for their designated lead algorithm:

- **Student 1 (Logistic Regression Lead):**
  - Explains linear classification theory, log-odds formulation, L1/L2 regularization effects.
  - Details the mathematical necessity of feature scaling for gradient/L-BFGS optimization.
  - Presents coefficient odds-ratio interpretations and linear boundary limitations on industrial sensors.

- **Student 2 (Decision Tree Lead):**
  - Explains recursive binary splitting, Gini impurity, entropy, and cost-complexity pruning ($\alpha$).
  - Evaluates single-tree interpretability vs. instability and variance on high-dimensional data.
  - Analyzes threshold adjustment for asymmetric cost optimization ($10 \text{FP} + 500 \text{FN}$).

- **Student 3 (Random Forest Lead):**
  - Explains bagging theory, bootstrap aggregation, and random feature subspace selection.
  - Analyzes out-of-bag (OOB) error estimates and variance reduction over single trees.
  - Conducts Gini and permutation feature importance analysis across physical sensor categories.

- **Student 4 (HistGradientBoosting Lead):**
  - Explains histogram-based gradient boosted decision trees (binned numerical features).
  - Details loss minimization via gradient descent in function space and native handling of missing values.
  - Assesses computational efficiency and accuracy on large-scale temporal feature matrices.

---

## 4. Collaborative Deliverables

- **Team Comparison Module (`team_comparison/`):**
  Jointly maintained module reading saved student `metrics.json` files to generate cross-study rankings, relative baseline improvements, and synthesis reports.
- **FastAPI Backend (`backend/`):**
  Shared service routing API requests to individual student model artifacts.
- **Frontend Platform (`frontend/`):**
  Shared Next.js web application showcasing individual study dashboards, the conceptual isometric plant map, live prediction studios, and comparative research findings.
