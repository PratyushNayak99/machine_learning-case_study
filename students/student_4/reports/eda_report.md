# Exploratory Data Analysis Report: MetroPT-3 Operational Compressor
**Study Owner:** Student 4 (Lead: HistGradientBoosting Classifier)  
**System:** ForgeWatch AI Academic Platform  

---

## 1. Domain Setting & Telemetry Specifications
Data originates from an operational urban metro train Air Production Unit (compressor) in Porto, Portugal, recorded at 1 Hz from February through August 2020.
Sensors capture pneumatic pressures (`TP2`, `TP3`, `H1`, `DV_pressure`, `Reservoirs`), motor electrical current, oil level, and valve solenoid states.

---

## 2. Event Labeling Protocol & Buffer Zones
Rather than fabricating row-level labels, continuous sensor streams were divided into 15-minute non-overlapping windows. Windows were labeled according to the four documented maintenance failure incidents:
- **Positive Windows:** Operating intervals overlapping an active breakdown event.
- **Negative Windows:** Nominal operation outside breakdown intervals.
- **Buffer Exclusion:** Windows within $\pm 6$ hours of failure events were excluded to eliminate ambiguous transitional states.

---

## 3. Chronological Evaluation Design
To avoid temporal lookahead bias, data was split strictly along chronological boundaries:
- Train: Feb - May 2020 (contains Failure Events 1 and 2).
- Validation: June 2020 (contains Failure Event 3).
- Test: July - August 2020 (contains Failure Event 4).
