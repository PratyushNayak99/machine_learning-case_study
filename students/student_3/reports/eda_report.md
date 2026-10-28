# Exploratory Data Analysis Report: Hydraulic Systems Condition Monitoring
**Study Owner:** Student 3 (Lead: Random Forest Classifier)  
**System:** ForgeWatch AI Academic Platform  

---

## 1. Experimental Setup & Sensor Architecture
The hydraulic test rig executes repetitive 60-second load cycles consisting of primary working operations and cooling phases.
- **High-Frequency (100 Hz):** 6 Pressure sensors (`PS1` to `PS6`) capturing dynamic pressure pulsations; motor electrical power (`EPS1`).
- **Mid-Frequency (10 Hz):** 2 Volume flow rate sensors (`FS1`, `FS2`).
- **Low-Frequency (1 Hz):** 4 Temperature sensors (`TS1` to `TS4`), vibration (`VS1`), and virtual cooling efficiency factor (`CE`).

---

## 2. Target Semantics & Degradation Levels
- **Primary Target:** `cooler_condition`
  - `3`: Near total cooling failure (~33.2% of cycles).
  - `20`: Reduced cooling efficiency (~33.2% of cycles).
  - `100`: Full optimal cooling efficiency (~33.6% of cycles).
- The class distribution is well balanced across the 2,205 cycles.

---

## 3. Physical Feature Extraction
Raw signals were condensed into 136 cycle-level statistical features (mean, standard deviation, peak-to-peak amplitude, energy, skewness).
Thermal sensors (`TS1`-`TS4`) and cooling efficiency factor (`CE`) exhibit immediate, massive divergence when the cooler degrades from 100% to 20% and 3%, allowing tree ensembles to separate degradation regimes cleanly.
