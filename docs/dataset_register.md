# ForgeWatch AI: Dataset Register

This register details the four industrial datasets utilized across the independent student research studies in ForgeWatch AI.

---

## Dataset 1: AI4I 2020 Predictive Maintenance Dataset

- **Official Source:** [UCI Machine Learning Repository (ID 601)](https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset)
- **Domain:** CNC Milling Machine Synthetic Telemetry
- **Observations:** 10,000 synthetic records
- **Feature Dimensionality:** 6 operational sensor features (`Type`, `Air temperature [K]`, `Process temperature [K]`, `Rotational speed [rpm]`, `Torque [Nm]`, `Tool wear [min]`)
- **Assigned Student:** Student 1 (Lead: Logistic Regression)
- **Nature & Scientific Limitation:** Fully synthetic dataset generated from a physical simulation. Does not represent real telemetry from an active manufacturing facility.
- **Excluded Attributes:** `UDI`, `Product ID` (identifiers), and failure mode flags (`TWF`, `HDF`, `PWF`, `OSF`, `RNF`) to avoid direct outcome leakage.

---

## Dataset 2: APS Failure at Scania Trucks

- **Official Source:** [UCI Machine Learning Repository (ID 421)](https://archive.ics.uci.edu/dataset/421/aps+failure+at+scania+trucks) / IDA 2016 Challenge
- **Domain:** Heavy Commercial Transport Air Pressure System (APS)
- **Observations:** 60,000 train records, 16,000 test records
- **Feature Dimensionality:** 171 anonymized attributes (single-value counters, histograms, sensor telemetry)
- **Assigned Student:** Student 2 (Lead: Decision Tree Classifier)
- **Missingness Profile:** Substantial missing values encoded as `"na"` strings (ranging from <1% to >80% per attribute).
- **Domain Semantics:**
  - Class `pos`: The truck suffered a failure specifically localized in the Air Pressure System.
  - Class `neg`: The truck experienced a failure in a component UNRELATED to the APS (does **not** denote a healthy truck).
- **Asymmetric Maintenance Cost:**
  $$\text{Cost} = 10 \times \text{FP} + 500 \times \text{FN}$$

---

## Dataset 3: Condition Monitoring of Hydraulic Systems

- **Official Source:** [UCI Machine Learning Repository (ID 447)](https://archive.ics.uci.edu/dataset/447/condition+monitoring+of+hydraulic+systems)
- **Domain:** Industrial Hydraulic Test Rig
- **Observations:** 2,205 load cycles (each cycle is 60 seconds of continuous operation)
- **Raw Telemetry Structure:**
  - 6 Pressure sensors (`PS1` to `PS6`) sampled at 100 Hz (6,000 values/cycle)
  - 1 Motor electrical power sensor (`EPS1`) sampled at 100 Hz
  - 2 Volume flow rate sensors (`FS1`, `FS2`) sampled at 10 Hz (600 values/cycle)
  - 4 Temperature sensors (`TS1` to `TS4`) sampled at 1 Hz (60 values/cycle)
  - 1 Vibration sensor (`VS1`) sampled at 1 Hz
  - 3 Efficiency virtual sensors (`CE`, `CP`, `SE`) sampled at 1 Hz
- **Annotation File:** `profile.txt` providing cycle-wise condition indicators:
  - Cooler condition: 3 (close to total failure), 20 (reduced efficiency), 100 (full efficiency)
  - Valve condition, Pump leakage, Hydraulic accumulator state, Stable operation flag
- **Assigned Student:** Student 3 (Lead: Random Forest Classifier)
- **Processing Approach:** Feature engineering per cycle (statistical moments, peak-to-peak amplitude, energy).

---

## Dataset 4: MetroPT-3 (Operational Transit Compressor)

- **Official Source:** [UCI Machine Learning Repository (ID 791)](https://archive.ics.uci.edu/dataset/791/metropt+3)
- **Domain:** Urban Metro Train Air Production Unit (Compressor)
- **Observations:** >1.5 Million timestamped records collected from February to August 2020 at 1 Hz.
- **Sensors:** Pressure channels (`TP2`, `TP3`, `H1`, `DV_pressure`, `Reservoirs`), Motor current, Oil level, Temperature.
- **Assigned Student:** Student 4 (Lead: HistGradientBoosting Classifier)
- **Methodology Protocol:**
  - Maintenance logs dictate failure intervals (e.g., compressor air leakage in May/July 2020).
  - Time-series window aggregation (e.g. 5-minute rolling statistics).
  - Chronological holdout to test generalization to future failure events without temporal data leakage.
