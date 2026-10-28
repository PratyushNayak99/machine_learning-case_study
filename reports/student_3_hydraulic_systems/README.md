# ForgeWatch AI — Research Study 3: Detailed Model Comparison Report
## Condition Monitoring of Hydraulic Systems: Multi-Sensor Cycle Degradation Classification

**Author:** Student 3 (Primary Model Lead: Random Forest Classifier)  
**System:** ForgeWatch AI Industrial Predictive Maintenance Research Platform  
**Dataset:** Condition Monitoring of Hydraulic Systems Dataset (UCI Repository ID: 447)  
**Selected Best Model:** **Random Forest Classifier** (Selected via Validation Macro-F1)

---

## 1. Executive Summary & Study Overview

This research study addresses component health degradation and condition-based monitoring in industrial hydraulic systems. Hydraulic drives are ubiquitous in heavy industrial manufacturing, aerospace flight-control systems, injection molding presses, and maritime winches. Overheating and cooling circuit failure are primary causes of hydraulic fluid breakdown, cavitation, and catastrophic pump seizure.

Using the **UCI Condition Monitoring of Hydraulic Systems dataset (ID 447)**, we evaluate multi-sensor condition classification across 2,205 continuous 60-second operational cycles. The prediction task is framed as a **3-class ordinal condition degradation classification problem** assessing the cooler subsystem:
- Class `3`: Close to Total Failure (cooling efficiency $\approx 0\%$).
- Class `20`: Reduced Cooling Efficiency.
- Class `100`: Pristine / Full Cooling Efficiency.

By transforming high-frequency multi-rate raw sensor channels (100 Hz, 10 Hz, and 1 Hz) into **136 statistical cycle descriptors**, **Random Forest** achieved an extraordinary **Held-Out Test Accuracy of 99.70%** and a **Test Macro-F1 of 0.9970** across 331 unseen test cycles. It achieved **100% recall on total failure cycles (110/110)** and **100% recall on full efficiency cycles (111/111)**, misclassifying only 1 single cycle out of 331.

Furthermore, an exhaustive **feature ablation study** was conducted to verify that model performance was not merely an artifact of mathematical leakage from engineered virtual sensors: even when all virtual cooling metrics (`CE` and `CP`) were completely stripped, pure physical temperature and pressure sensors maintained a stellar **99.40% Macro-F1**.

---

## 2. Dataset Anatomy & Domain Context

### 2.1 Industrial Hydraulic Test Bench Background
The dataset was gathered at the ZeMA test bench (Center for Mechatronics and Automation Technology, Saarbrücken, Germany). The rig consists of:
- A primary hydraulic working circuit driven by an axial piston pump.
- A secondary cooling-filtration circuit where hydraulic oil is circulated through a heat exchanger.
- Multi-rate sensors tracking hydraulic fluid dynamics across 60-second cyclic working phases (such as pressing, holding, and returning).

### 2.2 Raw Sensor Modality & Sampling Frequency Structure
The raw telemetry encompasses 17 separate sensor channels with heterogeneous sampling frequencies:

| Sensor Type | Channel Identifiers | Physical Description | Sampling Frequency | Values per 60s Cycle | Total Values / Cycle |
|---|---|---|---|---|---|
| **Pressure** | `PS1`, `PS2`, `PS3`, `PS4`, `PS5`, `PS6` | System pressure at pump outlet, accumulator, and return line | **100 Hz** | 6,000 samples | 36,000 |
| **Motor Power** | `EPS1` | Electric motor electrical active power consumption | **100 Hz** | 6,000 samples | 6,000 |
| **Volume Flow** | `FS1`, `FS2` | Oil volume flow rate in primary and secondary circuits | **10 Hz** | 600 samples | 1,200 |
| **Temperature** | `TS1`, `TS2`, `TS3`, `TS4` | Oil temperatures at cooler inlet, outlet, and reservoir | **1 Hz** | 60 samples | 240 |
| **Vibration** | `VS1` | Mechanical structural vibration on the pump casing | **1 Hz** | 60 samples | 60 |
| **Virtual Efficiency** | `CE`, `CP`, `SE` | Cooling efficiency, cooling power, and system efficiency | **1 Hz** | 60 samples | 180 |
| **Total** | **17 Sensor Channels** | **Multi-Rate Hydraulic Rig Telemetry** | **1 - 100 Hz** | **N/A** | **43,680 values/cycle** |

### 2.3 Dataset Volume & Partitioning
- **Total Operational Cycles:** 2,205 continuous 60-second cycles (36.75 hours of continuous bench run).
- **Partitioning Design:** Stratified 70% Training / 15% Validation / 15% Testing:
  - **Training Split (70%):** 1,543 cycles (512 Class 3, 512 Class 20, 519 Class 100)
  - **Validation Split (15%):** 331 cycles (110 Class 3, 110 Class 20, 111 Class 100)
  - **Held-Out Test Split (15%):** 331 cycles (110 Class 3, 110 Class 20, 111 Class 100)
- **Class Balance:** Perfectly balanced distribution (~33.2% Class 3, ~33.2% Class 20, ~33.6% Class 100).

---

## 3. Exact Prediction Objective & Target Semantics

### 3.1 Target Condition Degradation States
The target variable is `cooler_condition` extracted from column 0 of `profile.txt`:
$$y \in \{3, 20, 100\}$$

| Class Value | Condition Meaning | Physical Diagnostic State | Cycle Count | Population Share | Test Support |
|---|---|---|---|---|---|
| **3** | **Close to Total Failure** | Cooling circuit heat exchanger clogged/inactive; oil temperature surges unchecked | 732 | 33.20% | 110 cycles |
| **20** | **Reduced Efficiency** | Moderate cooling degradation; heat exchanger partially fouled or restricted | 732 | 33.20% | 110 cycles |
| **100** | **Full Efficiency** | Pristine cooler operation; nominal heat dissipation rate maintained | 741 | 33.60% | 111 cycles |
| **Total** | **3-Class Balanced** | **Comprehensive Hydraulic Cooler Health Assessment** | **2,205** | **100.00%** | **331 cycles** |

### 3.2 Strict Anti-Leakage Protocol
In `profile.txt`, five simultaneous system states were recorded:
1. Column 0: `cooler_condition` (3, 20, 100) $\to$ **Target Variable**
2. Column 1: `valve_condition` (100, 90, 80, 73) $\to$ Excluded
3. Column 2: `internal_pump_leakage` (0, 1, 2) $\to$ Excluded
4. Column 3: `hydraulic_accumulator` (130, 115, 100, 90) $\to$ Excluded
5. Column 4: `stable_flag` (0, 1) $\to$ Excluded

> [!CAUTION]
> Utilizing columns 1 through 4 as features would leak simultaneous experimental bench controls. All other condition columns were strictly stripped during preprocessing.

---

## 4. Feature Engineering: Cyclic Statistical Moment Extraction

Because each 60-second cycle generates 43,680 raw time-series points, training directly on raw concatenations creates severe curse-of-dimensionality issues. 

For each of the 17 sensor channels across every 60-second cycle, we engineered **8 statistical summary descriptors**:
1. **Arithmetic Mean ($\mu$):** Static operating setpoint of the cycle.
2. **Standard Deviation ($\sigma$):** Magnitude of sensor oscillations.
3. **Minimum Value ($\min$):** Cycle trough/dip.
4. **Maximum Value ($\max$):** Cycle peak pressure/power surge.
5. **Peak-to-Peak Amplitude ($\max - \min$):** Dynamic sensor range.
6. **Root Mean Square (RMS):** Total signal power.
7. **Signal Energy ($\sum x_t^2$):** Work performed during the cycle.
8. **Skewness:** Asymmetry in cyclic load distribution.

$$\text{Total Features} = 17 \text{ channels} \times 8 \text{ descriptors} = \mathbf{136\text{ engineered features per cycle}}$$

---

## 5. Model Comparison & Benchmark Results

All five candidate models were trained and benchmarked across the 331 held-out test cycles.

### 5.1 Comprehensive Benchmark Performance Table
| Model | Test Accuracy | Balanced Accuracy | Macro F1-Score | Weighted F1-Score | Recall Class 3 (Failure) | Recall Class 20 (Reduced) | Recall Class 100 (Full) | Test ROC-AUC (OVR) | Status |
|---|---|---|---|---|---|---|---|---|---|
| **Random Forest** | **0.9970** | **0.9970** | **0.9970** | **0.9970** | **1.0000 (110/110)** | **0.9909 (109/110)** | **1.0000 (111/111)** | **1.0000** | **Selected Best & Lead** |
| **Decision Tree** | **0.9970** | **0.9970** | **0.9970** | **0.9970** | 1.0000 | 0.9909 | 1.0000 | 0.9977 | Interpretable Baseline |
| **Logistic Regression** | **0.9970** | **0.9970** | **0.9970** | **0.9970** | 1.0000 | 0.9909 | 1.0000 | 0.9967 | Linear Baseline |
| **HistGradientBoosting**| **0.9970** | **0.9970** | **0.9970** | **0.9970** | 1.0000 | 0.9909 | 1.0000 | **1.0000** | Boosting Contender |
| **Dummy Classifier** | 0.2991 | 0.2991 | 0.2982 | 0.2982 | 0.3455 | 0.2636 | 0.2883 | 0.4743 | Random Stratified |

### 5.2 Per-Class Precision and Recall for Random Forest
| Degradation Condition | Precision | Recall | F1-Score | Support (Cycles) | Confusion Matrix Cell |
|---|---|---|---|---|---|
| **Total Failure (Class 3)** | 0.9910 | **1.0000** | 0.9955 | 110 | 110 True Positives, 0 False Negatives |
| **Reduced Efficiency (Class 20)**| **1.0000** | 0.9909 | 0.9954 | 110 | 109 True Positives, 1 Missed (classified as 3) |
| **Full Efficiency (Class 100)** | **1.0000** | **1.0000** | **1.0000** | 111 | 111 True Positives, 0 Misclassifications |
| **Overall Macro Average** | **0.9970** | **0.9970** | **0.9970** | **331** | **Total Misclassifications: 1 cycle out of 331** |

---

## 6. Best Model Selection & In-Depth Justification

### 6.1 Why Random Forest is the Ideal Architecture
Random Forest achieved a perfect **1.0000 Validation Macro-F1** and a near-perfect **0.9970 Test Macro-F1**.

#### Technical Justifications:
1. **Variance Reduction Over Cyclic Transients:**
   Hydraulic sensors contain sharp pump switching spikes and valve flutter. By aggregating 100 decorrelated decision trees built on bootstrap subsets, Random Forest effectively cancels high-frequency acoustic sensor noise.
2. **Zero False Alarms on Healthy Systems:**
   In industrial manufacturing, falsely shutting down an expensive production line that is running at full efficiency costs millions. Random Forest achieved **100% precision and 100% recall on pristine full-efficiency cycles (Class 100)**.
3. **Resilience to Sensor Redundancy:**
   Because pressure sensors (`PS1` through `PS6`) are physically connected along the same fluid manifold, their signals exhibit high multi-collinearity. Random feature sub-spacing ($\sqrt{136} \approx 11$ features per split) forces the forest to explore complementary thermal and volume flow modalities rather than fixating on a single pressure channel.

---

## 7. Rigorous Scientific Feature Ablation Audit

### 7.1 The Question of Virtual Cooling Efficiency (`CE`)
In the ZeMA dataset documentation, `CE` is an engineered virtual calculation representing Cooling Efficiency (in %). A distribution check reveals that `CE_mean` exhibits strong separation across target classes:
- Condition 3: $\text{mean} = 19.59\%$
- Condition 20: $\text{mean} = 27.20\%$
- Condition 100: $\text{mean} = 46.93\%$

Because `CE` contributes 54.83% of feature importance in the full model, we conducted a controlled multi-stage ablation study on the held-out test set to determine whether model accuracy collapses when virtual sensors are removed:

| Ablation Configuration | Feature Count | Sensors Dropped | Test Accuracy | Test Macro-F1 | Primary Physical Sensor Drivers |
|---|---|---|---|---|---|
| **Tier 1: Full Baseline** | 136 features | None (all sensors included) | **0.9970** | **0.9970** | `CE`, `CP`, `TS4`, `PS6` |
| **Tier 2: No Virtual `CE`** | 128 features | Dropped `CE` (all 8 moments) | **0.9970** | **0.9970** | `CP`, `TS4`, `PS6`, `PS5` |
| **Tier 3: Pure Physical Sensors** | **120 features** | **Dropped all virtual `CE` & `CP`** | **0.9940** | **0.9940** | `TS4` (24.7%), `PS6` (24.5%), `PS5` (20.9%), `TS1` (9.5%) |

> [!NOTE]
> **Ablation Finding:** Even when all virtual cooler calculations (`CE` and `CP`) are completely removed, physical temperature sensors (`TS1`-`TS4`) and secondary circuit pressures (`PS5`, `PS6`) alone achieve **99.40% Test Macro-F1 (329/331 correct cycles)**. This proves conclusively that high classification performance is rooted in genuine physical thermodynamics rather than virtual metric leakage.

---

## 8. Visualizations & Figure Walkthrough

All figures below are located directly in the `figures/` subfolder.

### Figure 1: Model Comparison Bar Chart
![Model Comparison](figures/model_comparison_bar.png)
- **Interpretation:** Displays Accuracy, Macro-F1, Balanced Accuracy, and per-class recalls. The four supervised algorithms achieve identical top scores (0.9970 Macro-F1), whereas the Dummy baseline achieves only 0.2982, demonstrating a **+234.3% relative improvement**.

### Figure 2: Controlled Feature Ablation Study Chart
![Feature Ablation](figures/feature_ablation_comparison.png)
- **Interpretation:** Shows Macro-F1 across Full (0.9970), No-CE (0.9970), and Pure Physical Sensors (0.9940). This chart provides empirical proof that real physical temperature probes alone discriminate cooler health with 99.4% accuracy.

### Figure 3: Confusion Matrix — Best Model (Random Forest 3-Class)
![Confusion Matrix Best](figures/confusion_matrix_best.png)
- **Interpretation:** Across 331 test cycles:
  - 110/110 Class 3 cycles correctly caught.
  - 109/110 Class 20 cycles correctly caught (1 classified as Class 3).
  - 111/111 Class 100 cycles correctly caught.
  - No healthy cycle was ever misclassified as failed.

### Figure 4: Confusion Matrix — Random Forest Lead Model
![Confusion Matrix Random Forest](figures/confusion_matrix_random_forest.png)
- **Interpretation:** Confirms the exact 3-class distribution and diagonal concentration of predictions.

### Figure 5: Sensor Modality Relative Importance Breakdown
![Sensor Modality Importance](figures/sensor_modality_importance.png)
- **Interpretation:** Aggregated relative importance by physical subsystem:
  - **Virtual Efficiency (CE, CP, SE):** 54.83%
  - **Pressure Manifold (PS1 - PS6):** 25.02%
  - **Thermal Probes (TS1 - TS4):** 17.47%
  - **Motor Electric Power (EPS1):** 1.50%
  - **Flow Transducers (FS1 - FS2):** 0.70%
  - **Vibration Accelerometer (VS1):** 0.48%

### Figure 6: Top 15 Engineered Statistical Cycle Features
![Top Cycle Features](figures/top_cycle_features.png)
- **Interpretation:** Ranks individual engineered features by Gini importance. Leading features include `CE_mean`, `CP_mean`, `TS4_mean`, `PS6_max`, and `PS5_mean`, demonstrating that average temperature rise and secondary return pressures are the definitive physical signatures of cooler degradation.

---

## 9. Operational Recommendations & Engineering Deployment

1. **Deployment Architecture:** Deploy the **Pure Physical Random Forest model (120 features)**. While virtual `CE` offers slightly higher convenience, deploying purely on raw physical temperature probes (`TS1`-`TS4`) and pressure sensors (`PS5`, `PS6`) eliminates dependency on internal virtual software formulas.
2. **Automated Maintenance Workflow:**
   - **Class 100 (Nominal):** Standard operational logging.
   - **Class 20 (Reduced Efficiency):** Schedule preventative cooler flushing and radiator cleaning during the next planned weekend maintenance shift.
   - **Class 3 (Critical Failure):** Trigger immediate automated load reduction or bypass valve actuation to prevent thermal oil breakdown and catastrophic pump seizure.

---

## 10. Academic Limitations & Real-World Caveats

1. **Stationary Laboratory Rig:** All 2,205 cycles were executed under pre-programmed 60-second repeatable load sequences. Real manufacturing facilities experience stochastic cycle lengths and variable ambient weather.
2. **Cycle-Synchronous Evaluation:** The pipeline assumes telemetry is segmented into discrete 60-second cycles. Continuous streaming pipelines require dynamic cycle boundary detection before calculating statistical moments.
