# ForgeWatch AI — Research Study 1: Detailed Model Comparison Report
## AI4I 2020 Predictive Maintenance: Milling Machine Failure Classification

**Author:** Student 1 (Primary Model Lead: Logistic Regression)  
**System:** ForgeWatch AI Industrial Predictive Maintenance Research Platform  
**Dataset:** AI4I 2020 Predictive Maintenance Dataset (UCI Repository ID: 601)  
**Selected Best Model:** **HistGradientBoosting Classifier** (Selected via Validation PR-AUC)

---

## 1. Executive Summary & Study Overview

This research study evaluates five foundational machine learning paradigms on the **AI4I 2020 Predictive Maintenance Dataset**, an industrial simulation benchmark capturing CNC milling machine operations. In manufacturing environments, unexpected machine tool failures cause costly unplanned downtime, defective workpieces, and tool breakage. Our objective is to classify whether a given milling operational record represents an active machine failure event (`Machine failure` $\in \{0, 1\}$).

The dataset features severe class imbalance, with only **3.39%** of observations representing machine failures (339 failure events out of 10,000 records). Because standard accuracy is highly deceptive in imbalanced industrial applications (a naive model predicting "no failure" achieves 96.61% accuracy while catching 0% of failures), we utilized **Precision-Recall AUC (PR-AUC)** on the held-out validation set as the primary model selection criterion.

Across all evaluated models, **HistGradientBoosting** achieved the highest overall detection capability with a **Test PR-AUC of 0.7654**, a **Test ROC-AUC of 0.9678**, and a **Test Recall of 76.47%** (catching 39 out of 51 test failures). In contrast, while **Logistic Regression** (the student lead algorithm) achieved high recall (86.27%), its linear hyperplane produced 251 false alarms (precision: 14.92%, PR-AUC: 0.3856) due to non-linear physical interactions between cutting torque and rotational speed. However, Logistic Regression uniquely provides transparent **odds ratios**, identifying cutting torque and tool wear as the primary operational stressors.

---

## 2. Dataset Anatomy & Domain Context

### 2.1 Domain Background
Computer Numerical Control (CNC) milling machines are automated tools used in precision subtractive manufacturing to cut away material from metal stock. Milling machines operate under varying speeds, feed rates, and cutting forces. Operational stressors include:
- **Thermal buildup:** Friction between the cutting tool and workpiece elevates process temperature relative to ambient air.
- **Overstrain & Torque load:** High cutting resistance or aggressive feed rates impose excessive mechanical torque on the spindle motor.
- **Tool degradation:** Progressive abrasion and chipping of the tool tip increase tool wear, eventually triggering mechanical breakage or chatter.

### 2.2 Dataset Origin & Scientific Limitations
- **Source:** [UCI Machine Learning Repository ID 601](https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset), donated by Stephan Matzka (2020).
- **Nature of Data:** **Fully Synthetic Physical Simulation**. The dataset was generated using a simulation model incorporating physical laws and stochastic distributions.
- **Scientific Limitation:** AI4I 2020 does **not** reflect real telemetry collected from physical accelerometers or thermocouples in an active manufacturing facility. While it realistically models electro-mechanical relationships (such as power $P = \tau \cdot \omega$), it lacks real-world sensor noise, electrical interference, sensor calibration drift, and unpredictable operator behaviors.

### 2.3 Dataset Volume & Partitioning
- **Total Records:** 10,000 observations
- **Data Splitting Protocol:** Stratified 70% Training / 15% Validation / 15% Testing:
  - **Training Split (70%):** 7,000 records (237 positive failures, 6,763 nominal)
  - **Validation Split (15%):** 1,500 records (51 positive failures, 1,449 nominal)
  - **Held-Out Test Split (15%):** 1,500 records (51 positive failures, 1,449 nominal)
- **Stratification:** Maintained an exact ~3.40% failure prevalence across all three splits to guarantee unbiased evaluation.

---

## 3. Exact Prediction Objective & Target Semantics

### 3.1 Mathematical Formulation
The learning problem is framed as a supervised binary classification task:
$$f: \mathcal{X} \to \{0, 1\}$$
where each input vector $\mathbf{x}_i \in \mathcal{X}$ contains operational sensor measurements, and $y_i$ is the ground-truth machine status:
- **$y = 0$ (Negative):** Nominal Operation — the machine is operating within allowable tolerances.
- **$y = 1$ (Positive):** Machine Failure — the machine experienced a failure incident requiring immediate stoppage and maintenance.

### 3.2 Target Distribution & Class Imbalance
| Target Value | Semantic Label | Total Count | Overall Prevalence | Test Set Count | Test Set Prevalence |
|---|---|---|---|---|---|
| **0** | Nominal (No Failure) | 9,661 | 96.61% | 1,449 | 96.60% |
| **1** | Machine Failure | 339 | 3.39% | 51 | 3.40% |
| **Total** | Full Population | 10,000 | 100.00% | 1,500 | 100.00% |

### 3.3 Strict Anti-Leakage Protocol
The raw AI4I dataset contains five auxiliary failure-mode columns:
1. `TWF` (Tool Wear Failure): Tool wear exceeds failure threshold (120-240 min).
2. `HDF` (Heat Dissipation Failure): Temperature difference $(\Delta T = T_{\text{process}} - T_{\text{air}}) < 8.6\text{ K}$ and speed $< 1380\text{ rpm}$.
3. `PWF` (Power Failure): Electric power $P = \tau \cdot \omega$ outside allowable envelope ($< 3500\text{ W}$ or $> 9000\text{ W}$).
4. `OSF` (Overstrain Failure): Product of tool wear and torque exceeds material limit.
5. `RNF` (Random Failure): Stochastic failure independent of process parameters ($p = 0.001$).

> [!CAUTION]
> **Data Leakage Prohibition:** In the original simulation, `Machine failure` is computed directly as the logical OR of these five flags:
> $$\text{Machine failure} = \text{TWF} \lor \text{HDF} \lor \text{PWF} \lor \text{OSF} \lor \text{RNF}$$
> Including any of these columns as model inputs constitutes **catastrophic target leakage** ($100\%$ collinearity). All five failure flags, along with arbitrary identifiers (`UDI`, `Product ID`), were strictly excluded from model feature sets.

---

## 4. Feature Inventory & Preprocessing Pipeline

### 4.1 Feature Specifications
The model inputs consist of 6 operational features (5 continuous sensors + 1 categorical product variant):

| Feature Name | Type | Physical Meaning | Engineering Units | Operational Range (Min - Max) | Mean $\pm$ Std |
|---|---|---|---|---|---|
| `Type` | Categorical | Machine variant quality grade (`L`, `M`, `H`) | Nominal | `L` (50%), `M` (30%), `H` (20%) | N/A |
| `Air temperature [K]` | Continuous | Ambient factory room temperature | Kelvin (K) | 295.3 - 304.5 K | 300.0 $\pm$ 2.0 K |
| `Process temperature [K]` | Continuous | Temperature generated during cutting action | Kelvin (K) | 305.7 - 313.8 K | 310.0 $\pm$ 1.5 K |
| `Rotational speed [rpm]` | Continuous | Spindle rotational velocity | Revolutions/min (rpm) | 1,168 - 2,886 rpm | 1,538.8 $\pm$ 179.3 rpm |
| `Torque [Nm]` | Continuous | Mechanical torque load on spindle | Newton-meters (Nm) | 3.8 - 76.6 Nm | 39.99 $\pm$ 9.97 Nm |
| `Tool wear [min]` | Continuous | Accumulated cutting time on tool insert | Minutes (min) | 0 - 253 min | 107.95 $\pm$ 63.65 min |

### 4.2 Preprocessing Transformation Architecture
To prevent data snooping, all transformers were fitted strictly on the training partition:
1. **Categorical Encoding:** `Type` was one-hot encoded using `OneHotEncoder(handle_unknown='ignore')` yielding binary indicators `Type_H`, `Type_L`, and `Type_M`.
2. **Feature Standardization:** For distance- and gradient-based models (Logistic Regression), numeric features were standardized using `StandardScaler` to have zero mean and unit variance ($\mu=0, \sigma=1$).
3. **Tree-Based Models:** Tree models (Decision Tree, Random Forest, HistGradientBoosting) received numerical features with native ordinal handling or scaling.

---

## 5. Model Comparison & Benchmark Results

All five candidate classifiers were trained on identical training sets and evaluated on the identical held-out test split (1,500 records, 51 positive failures).

### 5.1 Comprehensive Benchmark Performance Table
| Model | Test Accuracy | Balanced Accuracy | Test Precision | Test Recall | Test F1-Score | Validation PR-AUC | Test PR-AUC | Test ROC-AUC | TP | FP | FN | TN | Model Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **HistGradientBoosting** | **0.9593** | **0.8654** | 0.4432 | 0.7647 | **0.5612** | **0.7220** | **0.7654** | **0.9678** | 39 | 49 | 12 | 1400 | **Selected Best** |
| **Random Forest** | **0.9727** | 0.7683 | **0.6087** | 0.5490 | **0.5773** | 0.6220 | 0.6549 | 0.9569 | 28 | 18 | 23 | 1431 | Ensemble Contender |
| **Decision Tree** | 0.9367 | **0.8915** | 0.3308 | 0.8431 | 0.4751 | 0.3763 | 0.5576 | 0.8665 | 43 | 87 | 8 | 1362 | Interpretable Baseline |
| **Logistic Regression** | 0.8280 | 0.8448 | 0.1492 | **0.8627** | 0.2543 | 0.3829 | 0.3856 | 0.9034 | 44 | 251 | 7 | 1198 | **Student 1 Lead** |
| **Dummy Classifier** | 0.9307 | 0.4912 | 0.0182 | 0.0196 | 0.0189 | 0.0337 | 0.0337 | 0.4912 | 1 | 54 | 50 | 1395 | No-Skill Baseline |

### 5.2 Key Metric Definitions & Calculations
- **Accuracy:** Overall proportion of correct predictions:
  $$\text{Accuracy} = \frac{\text{TP} + \text{TN}}{\text{Total}} = \frac{39 + 1400}{1500} = 95.93\%$$
- **Balanced Accuracy:** Arithmetic mean of sensitivity and specificity (vital for severe imbalance):
  $$\text{Balanced Acc} = \frac{\text{Recall} + \text{Specificity}}{2} = \frac{0.7647 + (1400/1449)}{2} = \frac{0.7647 + 0.9662}{2} = 86.54\%$$
- **Precision:** Proportion of generated alarms that were true failures:
  $$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}} = \frac{39}{39 + 49} = 44.32\%$$
- **Recall (Sensitivity):** Proportion of actual machine breakdowns successfully caught:
  $$\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}} = \frac{39}{39 + 12} = 76.47\%$$
- **F1-Score:** Harmonic mean of precision and recall:
  $$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = 0.5612$$

---

## 6. Best Model Selection & In-Depth Justification

### 6.1 Why HistGradientBoosting is the Best Model
**HistGradientBoosting** was rigorously selected as the top model based on its superior **Validation PR-AUC (0.7220)** and verified on the held-out test partition (**Test PR-AUC: 0.7654**, **Test ROC-AUC: 0.9678**).

#### Core Technical Justifications:
1. **Capturing Non-Linear Electro-Mechanical Boundaries:**
   Milling physics is inherently non-linear. Machine failure modes depend on joint interactions:
   - Cutting power is the non-linear product of torque and speed: $P = \tau \times \frac{2\pi \omega}{60}$. A linear model assumes torque and speed act independently.
   - Overstrain failure occurs when $\text{Tool Wear} \times \text{Torque}$ exceeds a threshold.
   HistGradientBoosting builds an ensemble of shallow decision trees that naturally model these multiplicative, non-linear interaction surfaces via hierarchical axis-aligned partitions.
2. **Superior Precision-Recall Trade-off:**
   While Random Forest achieved higher raw precision (60.87%), it suffered an unacceptable false negative count of **23 missed breakdowns** (Recall: 54.90%). In an active manufacturing plant, missed machine breakdowns cause catastrophic spindle damage costing orders of magnitude more than an inspection. HistGradientBoosting caught **39 of 51 failures (76.47% recall)** while maintaining a solid 44.32% precision, yielding the best PR-AUC curve (0.7654 vs 0.6549 for RF).
3. **Histogram Binning & Generalization:**
   By discretizing continuous sensor values into 256 bins, HistGradientBoosting regularizes small sensor fluctuations, preventing overfitting to simulation artifacts.

### 6.2 Analysis of Student Lead Algorithm: Logistic Regression
Student 1 was assigned **Logistic Regression** as the lead algorithm.
- **Parametric Formulation:**
  $$P(y=1|\mathbf{x}) = \frac{1}{1 + \exp\left(-\left(\beta_0 + \sum_{j=1}^{p} \beta_j x_j\right)\right)}$$
- **Odds Ratio Interpretations:**
  Exponentiating the model coefficients ($\text{OR} = e^{\beta_j}$) provides direct, physically interpretable multipliers:
  - **Torque [Nm] ($\text{OR} = 12.3123$):** For every standard deviation increase in torque (~9.97 Nm), the odds of simulated machine failure increase by **1,231%**.
  - **Air Temperature [K] ($\text{OR} = 6.8036$):** Elevated ambient temperature heavily impairs cooling.
  - **Tool Wear [min] ($\text{OR} = 2.4975$):** Tool wear increases failure odds by ~250% per standard deviation.
- **Why Logistic Regression Fell Short in Overall Performance:**
  With `class_weight='balanced'`, Logistic Regression caught 44 failures (86.27% recall), but generated **251 false positives** (precision: only 14.92%). Because its decision boundary is strictly planar, it cannot create closed boundary regions around the non-linear operational failure envelopes.

---

## 7. Visualizations & Figure Walkthrough

All figures below are located directly in the `figures/` subfolder.

### Figure 1: Comprehensive Model Comparison Bar Chart
![Model Comparison](figures/model_comparison_bar.png)
- **Interpretation:** This bar chart compares all 5 candidate models across Test Accuracy, Balanced Accuracy, F1-Score, PR-AUC, and ROC-AUC. Notice that while all models display seemingly high raw accuracy (>82%), the PR-AUC and F1 bars expose the true ranking: HistGradientBoosting dominates in PR-AUC (0.7654), while the Dummy baseline collapses to near zero (0.0337).

### Figure 2: Confusion Matrix — Best Model (HistGradientBoosting)
![Confusion Matrix Best](figures/confusion_matrix_best.png)
- **Interpretation:** Out of 1,500 held-out test cycles:
  - **True Negatives:** 1,400 correctly classified nominal cycles.
  - **False Positives:** 49 false alarms.
  - **False Negatives:** 12 missed failures.
  - **True Positives:** 39 verified breakdowns caught.
  HistGradientBoosting balances strong failure coverage with an acceptable false alarm burden.

### Figure 3: Confusion Matrix — Lead Model (Logistic Regression)
![Confusion Matrix Logistic Regression](figures/confusion_matrix_logistic_regression.png)
- **Interpretation:** Logistic Regression captures 44 true positives (86.27% recall) but triggers 251 false alarms. In a workshop, 251 false alarms would lead to maintenance alert fatigue, validating why gradient boosted trees are preferred for dispatch.

### Figure 4: Receiver Operating Characteristic (ROC) Curve
![ROC Curve](figures/roc_curve_best.png)
- **Interpretation:** The ROC curve for HistGradientBoosting hugs the upper-left corner, achieving an outstanding **ROC-AUC of 0.9678**. This indicates that the probability ranking across the full population is highly accurate.

### Figure 5: Precision-Recall (PR) Curve
![PR Curve](figures/pr_curve_best.png)
- **Interpretation:** In 3.4% imbalanced data, the PR curve is the definitive metric. The red dashed line denotes the 0.034 no-skill prevalence baseline. HistGradientBoosting sustains high precision across a broad recall spectrum, achieving an **AUC of 0.7654** (22.5x higher than random chance).

### Figure 6: Logistic Regression Feature Impact & Absolute Coefficients
![Logistic Regression Coefficients](figures/logistic_regression_coefficients.png)
- **Interpretation:** Absolute standardized regression weights demonstrate that **Torque [Nm]** is by far the single most influential predictor, followed by **Rotational speed [rpm]**, **Air temperature [K]**, and **Tool wear [min]**.

---

## 8. Operational Recommendations & Deployment Strategy

1. **Recommended Model:** Deploy **HistGradientBoosting** in production CNC monitoring pipelines.
2. **Threshold Tuning for Workshop Utility:**
   The default classification threshold ($\tau = 0.50$) produces 39 TP and 49 FP. If an operator wants to eliminate more false alarms, shifting $\tau$ to $0.65$ boosts precision to 58% at the cost of catching 33 failures.
3. **Hybrid Diagnostic Architecture:**
   - Use **HistGradientBoosting** for real-time telemetry anomaly dispatch (high PR-AUC).
   - Use the **Logistic Regression Odds Ratio table** as an automated diagnostic explainer: when an alarm triggers, display which physical sensor exceeded nominal odds limits (e.g. "Spindle Torque exceeded 58 Nm, elevating failure odds by 12x").

---

## 9. Academic Limitations & Caveats

1. **Synthetic Data Artifact:** As established in Section 2.2, AI4I 2020 is derived from a mathematical simulation. Models trained on this dataset should not be directly transferred to physical factory machines without domain adaptation and transfer learning.
2. **Instantaneous Classification vs. Prognosis:** This study performs **instantaneous state classification** (detecting whether the machine is currently failing). It does not forecast failure hours in advance (Remaining Useful Life / RUL).
