# Student 1 Research Study: AI4I 2020 Predictive Maintenance

- **Owner:** Student 1
- **Lead Algorithm:** Logistic Regression
- **Dataset:** AI4I 2020 Predictive Maintenance (UCI ID 601)
- **Target:** `Machine failure` (Binary: 0 = Nominal, 1 = Failure)

## Structure
- `dataset/`: Schema definition, acquisition scripts, raw and processed partitions.
- `preprocessing/`: Validation, leakage elimination, feature scaling, stratified splitting.
- `models/`: Five classifier implementations (Logistic Regression, Decision Tree, Random Forest, HistGradientBoosting, Dummy baseline).
- `evaluation/`: Validation and test metrics evaluation.
- `artifacts/`: Serialized models (`best_model.joblib`, `logistic_regression.joblib`).
- `reports/`: Data quality, EDA, error analysis, model comparison, and final academic report.

## How to Reproduce
From project root:
```bash
python -m students.student_1.run_study
```
