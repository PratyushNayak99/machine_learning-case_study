# Student 2 Research Study: APS Failure at Scania Trucks

- **Owner:** Student 2
- **Lead Algorithm:** Decision Tree Classifier
- **Dataset:** APS Failure at Scania Trucks (UCI ID 421 / IDA 2016 Challenge)
- **Target:** `class` (Binary: `neg` = Failure unrelated to APS, `pos` = APS failure)
- **Cost Formulation:** $\text{Cost} = 10 \times \text{FP} + 500 \times \text{FN}$

## How to Reproduce
From project root:
```bash
python -m students.student_2.run_study
```
