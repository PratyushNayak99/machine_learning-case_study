# ForgeWatch AI — Research Study 3
# Condition Monitoring of Hydraulic Systems: Multi-Sensor Cycle Classification
**Author:** Student 3 (Primary Model Lead: Random Forest Classifier)  
**Affiliation:** ForgeWatch AI Research Group  

---

## Abstract
This study investigates component-condition classification on the UCI Condition Monitoring of Hydraulic Systems dataset (ID 447). Telemetry across 2,205 60-second multi-rate sensor cycles (100 Hz pressure, 10 Hz flow, 1 Hz temperature/vibration) was transformed into 136 statistical cycle descriptors. The task evaluates 3-class cooler condition (`3` = failure, `20` = reduced, `100` = full efficiency). Models were trained on a 70% stratified training split and validated on 15% validation and 15% test splits. Random Forest and HistGradientBoosting achieved near-flawless Macro-F1 (0.9970), with thermal and cooling efficiency sensors dominating feature importance.

---

## 1. Research Objective & Component Degradation
Classifying component degradation stage across physical operating cycles enables preventative condition-based maintenance before catastrophic hydraulic lockup.

---

## 2. Comparative Results Summary
| model | val_macro_f1 | val_balanced_acc | test_accuracy | test_macro_f1 | test_weighted_f1 | test_balanced_acc | test_recall_failure_3 | test_recall_reduced_20 | test_recall_optimal_100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Random Forest | 1.0 | 1.0 | 0.997 | 0.997 | 0.997 | 0.997 | 1.0 | 0.9909 | 1.0 |
| Decision Tree | 1.0 | 1.0 | 0.997 | 0.997 | 0.997 | 0.997 | 1.0 | 0.9909 | 1.0 |
| Logistic Regression | 1.0 | 1.0 | 0.997 | 0.997 | 0.997 | 0.997 | 1.0 | 0.9909 | 1.0 |
| HistGradientBoosting | 1.0 | 1.0 | 0.997 | 0.997 | 0.997 | 0.997 | 1.0 | 0.9909 | 1.0 |
| Dummy Classifier | 0.326 | 0.3262 | 0.2991 | 0.2982 | 0.2982 | 0.2991 | 0.3455 | 0.2636 | 0.2883 |

---

## 3. Random Forest Lead Analysis & Sensor Modality Importance
- **Bagged Ensemble Variance Reduction:** Averaging 100 decorrelated decision trees effectively suppresses sensor high-frequency noise.
- **Physical Modality Contribution:**
|  | Relative Importance |
| --- | --- |
| Thermal (TS1-TS4) | 0.1747 |
| Pressure (PS1-PS6) | 0.2502 |
| Motor Power (EPS1) | 0.015 |
| Volume Flow (FS1-FS2) | 0.007 |
| Vibration (VS1) | 0.0048 |
| Virtual Efficiency (CE, CP, SE) | 0.5483 |

## 4. Feature Ablation Audit: Investigating the Virtual Cooling Efficiency (CE) Feature
As part of the scientific audit, we investigated the relationship between the engineered virtual sensor `CE` (Cooling Efficiency in %) and the target condition `cooler_condition` (`3`, `20`, `100`):
- In the ZeMA documentation, `CE` is an estimated virtual efficiency metric calculated from temperature and volume flow.
- A distribution check confirms `CE_mean` exhibits strong separation across target classes: condition 3 has mean $19.59\%$, condition 20 has mean $27.20\%$, and condition 100 has mean $46.93\%$.

To verify whether model performance is solely an artifact of `CE` proxy leakage, we conducted a controlled ablation re-evaluation across held-out test cycles:

| Model / Sensor Configuration | Features | Test Accuracy | Test Macro-F1 | Primary Sensor Drivers |
| --- | --- | --- | --- | --- |
| **Random Forest (Full Baseline)** | 136 features (incl. `CE`) | **0.9970** | **0.9970** | `CE`, `CP`, `TS4`, `PS6` |
| **Random Forest (Ablation: No `CE`)** | 128 features (dropped `CE`) | **0.9970** | **0.9970** | `CP`, `TS4`, `PS6`, `PS5` |
| **Random Forest (Ablation: Pure Physical)** | 120 features (dropped `CE` & `CP`) | **0.9940** | **0.9940** | `TS4` (24.7%), `PS6` (24.5%), `PS5` (20.9%), `TS1` (9.5%) |
| **Decision Tree (Pure Physical)** | 120 features (no virtual `CE`/`CP`) | **0.9940** | **0.9940** | `TS4_mean`, `PS6_max` |
| **HistGradientBoosting (Pure Physical)** | 120 features (no virtual `CE`/`CP`) | **0.9940** | **0.9940** | Temperature & secondary circuit pressure |

**Ablation Finding:** Even when all virtual cooler calculations (`CE` and `CP`) are completely removed, physical temperature probes (`TS1`-`TS4`) and secondary circuit pressures (`PS5`, `PS6`) achieve **0.9940 Macro-F1** (329/331 correct test cycles). This confirms that high classification accuracy is rooted in physical thermodynamics rather than reliance on virtual sensor `CE`.

---

## 5. Academic Limitations
1. **Stationary Cyclic Regime:** Sensor cycles are tightly controlled 60-second bench-test cycles under fixed load profiles, lacking stochastic real-world factory disruptions.
2. **Synchronous Annotation:** Conditions are labeled cycle-by-cycle rather than continuous real-time forecasting.
3. **Virtual Sensor Artifacts:** While pure physical sensors achieve 0.9940 Macro-F1, deploying models on `CE` without understanding its virtual derivation can create unwarranted confidence if the internal calculation assumes sensor health.

---

## 6. Conclusion
Cycle-level statistical aggregation provides an exceptionally rich representation for multi-class condition classification. Tree ensembles (Random Forest & HistGradientBoosting) achieve top classification performance by isolating thermal dissipation characteristics, retaining >99% Macro-F1 even when all virtual sensor calculations are ablated.
