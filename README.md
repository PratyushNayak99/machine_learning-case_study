# ForgeWatch AI: A Comparative Study of Machine Failure and Condition Classification Across Industrial Datasets

[![Test Suite](https://img.shields.io/badge/pytest-28%20passed-emerald.svg)](tests/)
[![Python](https://img.shields.io/badge/python-3.12-blue.svg)](requirements.txt)
[![Frontend](https://img.shields.io/badge/Next.js-15.5-cyan.svg)](frontend/)
[![Architecture](https://img.shields.io/badge/FastAPI-0.115-teal.svg)](backend/)
[![Academic Compliance](https://img.shields.io/badge/Reproducibility-Seed%2042%20Fixed-purple.svg)](docs/research_protocol.md)

**ForgeWatch AI** is an academic multi-student machine learning research platform that investigates how different machine-learning algorithm families perform when detecting or classifying equipment failure and degraded operating conditions across contrasting industrial sensor datasets.

Four students independently implement, train, benchmark, and evaluate five algorithm families on separate real-world or simulated industrial datasets. The platform combines these independent studies into a rigorous cross-study synthesis accompanied by a production-grade FastAPI backend and a Next.js interactive frontend.

---

## 1. Team Allocation & Study Register

| Student | Assigned Dataset | Domain & Sensor Modality | Lead Algorithm | Best Validated Model | Key Metric & Test Result |
|---|---|---|---|---|---|
| **Student 1** | **AI4I 2020 Predictive Maintenance** (UCI 601) | Subtractive CNC Machining (Thermal, Speed, Torque, Wear) | **Logistic Regression** | **HistGradientBoosting** | PR-AUC: **0.7654** (vs LR: 0.3856) |
| **Student 2** | **APS Failure at Scania Trucks** (UCI 421 / IDA 2016) | Heavy Commercial Fleet Air Pressure Systems (171 attributes) | **Decision Tree Classifier** | **Random Forest (Cost-Tuned)** | Total Challenge Cost: **10,660 cost units** (Threshold: 0.1585) |
| **Student 3** | **Condition Monitoring of Hydraulic Systems** (UCI 447) | Multi-Rate Fluid Power Bench Test (136 cycle moments) | **Random Forest Classifier** | **Random Forest** | Macro-F1: **0.9970** (Pure physical: 0.9940) |
| **Student 4** | **MetroPT-3 Operational Compressor** (UCI 791) | Urban Passenger Rail Auxiliary Power Unit (15-min windows) | **HistGradientBoosting** | **HistGradientBoosting** | ROC-AUC: **0.9657** (In-event holdout) |

> **Note on Model Responsibility:** Every student implemented, benchmarked, and evaluated **all five algorithm families** (`DummyClassifier`, `LogisticRegression`, `DecisionTreeClassifier`, `RandomForestClassifier`, and `HistGradientBoostingClassifier`). Each student acts as the subject matter lead for their designated paradigm in the academic presentation and defense.

---

## 2. Research Question & Academic Methodology

### Core Problem Statement
> **"How do different machine-learning algorithms perform when detecting or classifying equipment failure and degraded operating conditions across different industrial sensor datasets?"**

### Scientific Distinctions & Target Taxonomy
The project maintains strict semantic distinctions across all code, evaluations, and user interfaces:
- **Failure Classification (Student 1):** Determining whether a given continuous machining condition triggers an active machine failure event (AI4I). Outcome diagnostic failure flags (`TWF`, `HDF`, `PWF`, `OSF`, `RNF`) are **strictly excluded** from features to prevent circular target leakage.
- **Component-Fault Attribution (Student 2):** Attributing vehicle breakdown specifically to the Air Pressure System (`pos`) versus non-APS subsystems (`neg`). In Scania telemetry, the `neg` label **does not indicate a healthy truck**; it represents a truck requiring shop service for a non-pneumatic defect.
- **Component-Condition Classification (Student 3):** Tracking discrete stages of multi-rate physical cooler degradation (`3` = Total Failure, `20` = Reduced Efficiency, `100` = Full Efficiency).
- **Failure-Event Detection (Student 4):** Identifying whether a 15-minute operational window coincides with a documented compressor breakdown event during chronological transit operation. This constitutes **in-event failure detection**, not multi-day prognostic remaining useful life (RUL).

### Asymmetric Challenge Cost Optimization
For Scania APS (Student 2), evaluation incorporates the official industrial challenge cost function:
$$\text{Cost} = 10 \times \text{FP} + 500 \times \text{FN}$$
A standard 0.5 decision threshold results in high challenge penalties (25,470 cost units) due to unflagged roadside breakdowns. By optimizing the decision threshold on validation data to **$\tau^* = 0.1585$**, the test challenge cost is reduced to **10,660 cost units**. These represent competition benchmark penalty units rather than verified enterprise currency savings.

---

## 3. Repository Architecture

```text
/home/pratyush/machine_learning/
├── backend/                             # Production FastAPI service
│   └── app/
│       ├── main.py                      # Application entrypoint & CORS
│       ├── schemas.py                   # Pydantic data contracts
│       ├── registry.py                  # Model artifact & metrics cache loader
│       └── api/
│           ├── routes_studies.py        # /api/studies metadata & metrics
│           ├── routes_comparison.py     # /api/team-comparison synthesis
│           └── routes_prediction.py     # /api/studies/{id}/predict pipelines
│
├── frontend/                            # Next.js 15+ App Router interactive UI
│   ├── app/
│   │   ├── page.tsx                     # Overview & executive dashboard
│   │   ├── layout.tsx                   # Dark industrial layout & navigation
│   │   ├── map/page.tsx                 # Fullscreen isometric plant map
│   │   ├── studies/[id]/page.tsx        # Dynamic student research dashboards
│   │   ├── predict/page.tsx             # Interactive live Prediction Studio
│   │   ├── comparison/page.tsx          # Team-level comparative synthesis
│   │   └── models/page.tsx              # Model Lab: theory, math & tradeoffs
│   ├── components/
│   │   ├── Navigation.tsx               # Top branding & active route bar
│   │   ├── PlantMap.tsx                 # Isometric conceptual plant map
│   │   └── ConfusionMatrix.tsx          # Interactive SVG/table error heatmap
│   └── lib/api.ts                       # Typed frontend API client
│
├── students/                            # Four independent reproducible studies
│   ├── student_1/                       # AI4I 2020 Predictive Maintenance (UCI 601)
│   ├── student_2/                       # APS Failure at Scania Trucks (UCI 421)
│   ├── student_3/                       # Condition Monitoring of Hydraulics (UCI 447)
│   └── student_4/                       # MetroPT-3 Operational Compressor (UCI 791)
│       └── [Each contains: dataset/, preprocessing/, models/, evaluation/, artifacts/, reports/]
│
├── shared/                              # Shared scientific utilities
│   ├── data_validation/validator.py     # Schema, missingness & leakage detector
│   ├── metrics/classification.py        # Binary & multiclass evaluation suite
│   ├── metrics/cost_matrix.py           # Scania asymmetric cost optimizer
│   ├── plotting/curves.py               # Confusion matrices, ROC/PR & cost curves
│   └── reporting/report_builder.py      # Resilient Markdown & JSON generators
│
├── team_comparison/                     # Team-level synthesis & aggregation
│   ├── compare_students.py              # Automated comparison aggregator
│   ├── comparison_results.json          # Machine-readable cross-study benchmark
│   └── team_comparison_report.md        # Comprehensive academic synthesis
│
├── docs/                                # Formal research documentation
│   ├── research_protocol.md             # Experimental controls & seed 42
│   ├── dataset_register.md              # Provenance & official UCI source links
│   ├── target_definitions.md            # Target definitions & formulas
│   ├── team_work_allocation.md          # Ownership & model assignments
│   └── presentation_outline.md          # 10-slide team defense presentation
│
├── tests/                               # Comprehensive automated test suite (28 tests)
│   ├── test_backend_api.py              # FastAPI endpoint contracts & predictions
│   ├── test_shared_metrics.py           # Validator & cost functions
│   ├── test_student_1_pipeline.py       # AI4I leakage & training checks
│   ├── test_student_2_pipeline.py       # Scania cost optimization checks
│   ├── test_student_3_pipeline.py       # Hydraulic feature extraction checks
│   ├── test_student_4_pipeline.py       # MetroPT windowing & holdout checks
│   └── test_team_comparison.py          # Cross-study aggregation checks
│
├── pytest.ini                           # Pytest configuration
├── requirements.txt                     # Locked Python dependencies
└── README.md                            # Root documentation
```

---

## 4. Quickstart & Execution Guide

### Prerequisites
- Python 3.12+
- Node.js 18+ and npm

### Environment Setup
```bash
cd /home/pratyush/machine_learning

# Create virtual environment and install dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Reproducing Student Studies & Training Models
Each study can be reproduced independently:
```bash
# Student 1: AI4I 2020 Study
python -m students.student_1.run_study

# Student 2: Scania APS Trucks Study
python -m students.student_2.run_study

# Student 3: Hydraulic Condition Monitoring Study
python -m students.student_3.run_study

# Student 4: MetroPT-3 Transit Compressor Study
python -m students.student_4.run_study
```

### Running Cross-Study Comparison
```bash
python -m team_comparison.compare_students
```

### Running Full Test Suite
```bash
MPLCONFIGDIR=/tmp/matplotlib pytest -v tests/
```
All 28 tests will pass across data validation, cost optimization, model inference, and API routes.

---

## 5. Running the Application

### 1. Launch FastAPI Backend
```bash
source .venv/bin/activate
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Launch Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:3000`

---

## 6. Frontend Navigation & Features

- **Conceptual Plant Map (`/map`):** Interactive isometric SVG uniting four disparate equipment archetypes (CNC Milling Cell, Fleet Depot, Hydraulic Rig, Metro Compressor). Clicking any archetype opens telemetry channels, key performance indicators, and links to the underlying study.
- **Study Workspaces (`/studies/[id]`):** In-depth review of each student's independent study, featuring lead algorithm spotlight, 5-model benchmark comparison table, interactive confusion matrix heatmap, empirical error analysis, and academic limitations.
- **Team Comparison Dashboard (`/comparison`):** Cross-dataset taxonomy matrix, algorithmic tradeoff synthesis, and plant engineering selection guide illustrating how inductive biases align with specific sensor topologies.
- **Model Theory Lab (`/models`):** Mathematical foundations, loss formulations, inductive biases, and hyperparameter tuning protocols for all five algorithm families.

---

## 7. Key Findings & Cross-Dataset Tradeoff Synthesis

1. **Observed Algorithmic Tradeoffs:** Logistic Regression provides transparent physical odds ratios ($e^{w} \approx 2.45$ for torque); Decision Trees offer white-box dispatch rules; Random Forests minimize variance across multi-rate cycles (0.9970 Macro-F1 with CE, 0.9940 with pure physical sensors); HistGradientBoosting optimizes non-linear boundaries in continuous streaming data (0.7654 PR-AUC).
2. **Economic Utility vs. Statistical Metric:** In industrial predictive maintenance, symmetric metrics (Accuracy, ROC-AUC) fail when false negatives cause roadside vehicle stranding. Asymmetric threshold tuning is mandatory.
3. **Feature Engineering & Ablation:** In multi-rate sensor systems (Hydraulics), extracting cycle moments yields exceptional accuracy; ablation proves physical thermal sensors (`TS1-4`) and loop pressure (`PS5-6`) retain >99% Macro-F1 even without virtual efficiency (`CE`).
4. **Data Integrity & Scientific Transparency:** Simulated data (AI4I) must be acknowledged as synthetic physics; component attribution labels (Scania) must not be conflated with healthy baseline equipment; and window-level detection on sparse time series (MetroPT, single test event) must not be misrepresented as multi-day future prognostic prediction.

---

## 8. Authors & Academic Integrity

Developed for **ForgeWatch AI: A Comparative Study of Machine Failure and Condition Classification Across Industrial Datasets**.

- **Student 1:** AI4I 2020 Study • Logistic Regression Lead
- **Student 2:** Scania Trucks APS Study • Decision Tree Lead
- **Student 3:** Hydraulic Systems Study • Random Forest Lead
- **Student 4:** MetroPT-3 Transit Compressor Study • HistGradientBoosting Lead

*All code, preprocessing pipelines, model checkpoints, and evaluation figures are fully reproducible using the fixed seed `42`.*
