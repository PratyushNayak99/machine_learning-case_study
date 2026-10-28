# ForgeWatch AI: Academic Presentation Outline

A structured presentation deck outline synthesizing the four independent student studies into a cohesive team defense.

---

## Slide 1: Title & Executive Overview
- **Project Title:** ForgeWatch AI: A Comparative Study of Machine Failure and Condition Classification Across Industrial Datasets
- **Team Members:** Student 1, Student 2, Student 3, Student 4
- **Problem Statement:** How do distinct machine learning paradigms (linear models, single trees, bagging ensembles, boosting ensembles) perform when deployed across real-world vs. synthetic, high-dimensional vs. compact, and continuous vs. cyclic industrial sensor datasets?

---

## Slide 2: Research Taxonomy & Conceptual Clarification
- Clear academic definitions distinguishing:
  - *Failure classification* (binary state at current record)
  - *Component condition classification* (multi-grade degradation assessment)
  - *Failure-event detection* (in-event window identification)
  - *Future failure prediction* (strictly reserved for validated advance warning horizons)
- Introduction of the "No Free Lunch" theorem in industrial predictive maintenance.

---

## Slide 3: Dataset Spectrum & Physical Environments
- Comparison matrix of the four industrial settings:
  1. Milling Machine (AI4I 2020) — Synthetic simulation, compact 6 features.
  2. Heavy Vehicle Fleet (Scania APS) — 171 anonymized attributes, extreme missingness, real operational breakdown logs.
  3. Hydraulic Test Rig — 2,205 continuous 60s sensor cycles, multi-frequency thermal, hydraulic, and electrical signals.
  4. Metro Transit Compressor (MetroPT-3) — >1.5M timestamped records, temporal continuity, maintenance-annotated event windows.

---

## Slide 4: Student 1 Study — AI4I 2020 Predictive Maintenance
- **Lead Focus:** Logistic Regression & Linear Decision Boundaries
- **Methodology:** Leakage prevention (dropping failure flags `TWF`, `HDF`, `PWF`, `OSF`, `RNF`), feature scaling, handling 3.4% imbalance.
- **Results:** Comparison across all 5 models (Dummy, Logistic Regression, Decision Tree, Random Forest, HistGradientBoosting).
- **Key Finding:** Tree ensembles capture torque/speed non-linear interaction boundaries that linear models miss, yet logistic regression provides directly interpretable odds ratios for operational safety limits.

---

## Slide 5: Student 2 Study — APS Failure at Scania Trucks
- **Lead Focus:** Decision Tree & Asymmetric Cost Optimization
- **Methodology:** Handling 171 high-dimensional features, missing value imputation with missingness indicators, and official challenge cost function ($\text{Cost} = 10 \text{FP} + 500 \text{FN}$).
- **Results:** Validation-based decision threshold sweep demonstrating cost minimization.
- **Key Finding:** Standard 0.5 threshold yields unacceptable catastrophic breakdowns (high FN cost); lowering the decision threshold drastically slashes total fleet maintenance expense.

---

## Slide 6: Student 3 Study — Hydraulic Systems Condition Monitoring
- **Lead Focus:** Random Forest & Multi-Sensor Cycle Engineering
- **Methodology:** Extracting statistical moments (mean, std, peak-to-peak, energy) from multi-rate sensor cycles (100 Hz to 1 Hz) for 3-class cooler condition (3, 20, 100).
- **Results:** Multi-class confusion matrix, Macro-F1, per-class recall.
- **Key Finding:** Thermal sensor features (`TS1` to `TS4`) and virtual cooling efficiency (`CE`) dominate Random Forest Gini importance, allowing near-perfect discrimination between full and degraded cooling states.

---

## Slide 7: Student 4 Study — MetroPT-3 Operational Telemetry
- **Lead Focus:** HistGradientBoosting & Time-Series Event Detection
- **Methodology:** Chronological split (no temporal leakage), windowed feature extraction, buffer zone isolation.
- **Results:** Event detection recall and precision under high-frequency noise.
- **Key Finding:** Histogram gradient boosting delivers superior training throughput on large temporal feature matrices while preserving event sensitivity without requiring synthetic oversampling.

---

## Slide 8: Team Comparative Synthesis
- Cross-dataset algorithm ranking matrix.
- Relative improvement over DummyClassifier baseline across all datasets.
- Operational trade-offs: Training latency vs. inference throughput vs. interpretability vs. resilience to missing values.
- Synthesis: Why no single algorithm is universally optimal across all predictive maintenance applications.

---

## Slide 9: Platform Demonstration (ForgeWatch AI)
- Live tour of the conceptual isometric plant map.
- Dataset-specific prediction studios with calibrated confidence scores and operational warnings.
- Real-time API integration powered by FastAPI and Next.js.

---

## Slide 10: Conclusions & Engineering Recommendations
- Summary of lessons learned.
- Future work: multi-task condition forecasting, streaming edge inference, active learning for sensor drift.
- Q&A.
