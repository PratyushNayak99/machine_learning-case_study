# Exploratory Data Analysis Report: AI4I 2020 Predictive Maintenance
**Study Owner:** Student 1 (Lead: Logistic Regression)  
**System:** ForgeWatch AI Academic Platform  

---

## 1. Physical Parameter Distributions
The AI4I 2020 dataset models a milling machine process using 6 core operating features:
- `Type`: Quality variant of the component (Low [L: 60%], Medium [M: 30%], High [H: 10%]).
- `Air temperature [K]`: Ambient room temperature, centered around 300 K ($\sigma \approx 2$ K).
- `Process temperature [K]`: Internal cutting temperature, generated as air temperature + 10 K plus friction heating.
- `Rotational speed [rpm]`: Spindle speed, inversely correlated with cutting torque.
- `Torque [Nm]`: Resistance torque, normally distributed around 40 Nm.
- `Tool wear [min]`: Cumulative tool usage time; failure risk accelerates as wear surpasses 200 minutes.

---

## 2. Target Imbalance Analysis
- **Total Records:** 10,000 synthetic observations.
- **Failures:** 339 records (3.39% prevalence).
- **Nominal Operations:** 9,661 records (96.61% prevalence).

Under this ~28:1 class imbalance, naïve accuracy is fundamentally deceptive (a model predicting zero failures achieves 96.61% accuracy). Precision-Recall AUC (PR-AUC) and balanced F1-score are therefore the principal evaluation criteria.

---

## 3. Correlation & Leakage Safeguards
Outcome failure mode flags (`TWF`, `HDF`, `PWF`, `OSF`, `RNF`) represent post-failure diagnostics. Retaining them as predictors would produce artificial 100% precision with zero generalization capacity. They were strictly stripped before feature scaling.
