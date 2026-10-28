import { calculateConsensus, type ModelPrediction } from "../lib/consensus";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("=== Running Consensus Logic Test Suite ===");

// 1. 0 fail with low avg (< 0.3)
const case1: ModelPrediction[] = [
  { name: "M1", prediction: 0, probability: 0.05 },
  { name: "M2", prediction: 0, probability: 0.08 },
  { name: "M3", prediction: 0, probability: 0.12 },
  { name: "M4", prediction: 0, probability: 0.07 },
];
const res1 = calculateConsensus(case1);
assert(res1.verdict === "ok", "Case 1: 0 fail with low avg (< 0.3) must have verdict 'ok'");
assert(res1.verdictLabel === "Normal operation", "Case 1: verdictLabel must be 'Normal operation'");
assert(res1.agreementText === "4 of 4 models agree", "Case 1: agreementText must be '4 of 4 models agree'");
assert(res1.modelDisagrees.every(d => !d), "Case 1: No model should be marked as disagreeing");

// 2. 0 fail with elevated avg (0.35)
const case2: ModelPrediction[] = [
  { name: "M1", prediction: 0, probability: 0.35 },
  { name: "M2", prediction: 0, probability: 0.35 },
  { name: "M3", prediction: 0, probability: 0.35 },
  { name: "M4", prediction: 0, probability: 0.35 },
];
const res2 = calculateConsensus(case2);
assert(res2.verdict === "warn", "Case 2: 0 fail with avg 0.35 must have verdict 'warn' (elevated uncertainty)");
assert(res2.verdictLabel === "Models disagree", "Case 2: verdictLabel must be 'Models disagree'");

// 3. 1 fail (3-vs-1 split, 1 failure detected)
const case3: ModelPrediction[] = [
  { name: "Logistic Regression", prediction: 0, probability: 0.15 },
  { name: "Decision Tree", prediction: 0, probability: 0.10 },
  { name: "Random Forest", prediction: 1, probability: 0.65 },
  { name: "HistGradientBoosting", prediction: 0, probability: 0.12 },
];
const res3 = calculateConsensus(case3);
assert(res3.verdict === "warn", "Case 3: 1 fail (3-vs-1 split) must have verdict 'warn', NEVER 'ok'");
assert(res3.verdictLabel === "Models disagree", "Case 3: verdictLabel must be 'Models disagree'");
assert(res3.agreementText === "3 of 4 models agree", "Case 3: agreementText must be '3 of 4 models agree'");
assert(res3.modelDisagrees[2] === true, "Case 3: Random Forest (minority failure) must be marked as disagreeing");
assert(res3.modelDisagrees[0] === false && res3.modelDisagrees[1] === false && res3.modelDisagrees[3] === false, "Case 3: Majority models must not be marked as disagreeing");

// 4. 2 fail (2-vs-2 split)
const case4: ModelPrediction[] = [
  { name: "Logistic Regression", prediction: 0, probability: 0.20 },
  { name: "Decision Tree", prediction: 1, probability: 0.85 },
  { name: "Random Forest", prediction: 0, probability: 0.22 },
  { name: "HistGradientBoosting", prediction: 1, probability: 0.78 },
];
const res4 = calculateConsensus(case4);
assert(res4.verdict === "warn", "Case 4: 2 fail (2-vs-2 split) must have verdict 'warn'");
assert(res4.verdictLabel === "Models disagree", "Case 4: verdictLabel must be 'Models disagree'");
assert(res4.agreementText === "2 of 4 models agree", "Case 4: agreementText must be '2 of 4 models agree'");

// 5. 3 fail (3-vs-1 failure majority)
const case5: ModelPrediction[] = [
  { name: "Logistic Regression", prediction: 1, probability: 0.75 },
  { name: "Decision Tree", prediction: 1, probability: 0.90 },
  { name: "Random Forest", prediction: 0, probability: 0.25 },
  { name: "HistGradientBoosting", prediction: 1, probability: 0.82 },
];
const res5 = calculateConsensus(case5);
assert(res5.verdict === "fail", "Case 5: 3 fail must have verdict 'fail'");
assert(res5.verdictLabel === "Failure likely", "Case 5: verdictLabel must be 'Failure likely'");
assert(res5.agreementText === "3 of 4 models agree", "Case 5: agreementText must be '3 of 4 models agree'");
assert(res5.modelDisagrees[2] === true, "Case 5: Random Forest (minority OK) must be marked as disagreeing");

// 6. 4 fail (unanimous failure)
const case6: ModelPrediction[] = [
  { name: "Logistic Regression", prediction: 1, probability: 0.92 },
  { name: "Decision Tree", prediction: 1, probability: 0.95 },
  { name: "Random Forest", prediction: 1, probability: 0.88 },
  { name: "HistGradientBoosting", prediction: 1, probability: 0.96 },
];
const res6 = calculateConsensus(case6);
assert(res6.verdict === "fail", "Case 6: 4 fail must have verdict 'fail'");
assert(res6.verdictLabel === "Failure likely", "Case 6: verdictLabel must be 'Failure likely'");
assert(res6.agreementText === "4 of 4 models agree", "Case 6: agreementText must be '4 of 4 models agree'");
assert(res6.modelDisagrees.every(d => !d), "Case 6: All models agree");

// 7. Multiclass unanimous 100 (Optimal cooler efficiency)
const case7: ModelPrediction[] = [
  { name: "M1", prediction: 100, probability: 0.95 },
  { name: "M2", prediction: 100, probability: 0.92 },
  { name: "M3", prediction: 100, probability: 0.96 },
  { name: "M4", prediction: 100, probability: 0.94 },
];
const res7 = calculateConsensus(case7);
assert(res7.verdict === "ok", "Case 7: 100 unanimous must have verdict 'ok'");
assert(res7.verdictLabel === "100 · Full efficiency", "Case 7: verdictLabel must be '100 · Full efficiency'");
assert(res7.agreementText === "4 of 4 models agree", "Case 7: agreementText must be '4 of 4 models agree'");

// 8. Multiclass unanimous 20 (Reduced cooler efficiency)
const case8: ModelPrediction[] = [
  { name: "M1", prediction: 20, probability: 0.88 },
  { name: "M2", prediction: 20, probability: 0.85 },
  { name: "M3", prediction: 20, probability: 0.89 },
  { name: "M4", prediction: 20, probability: 0.91 },
];
const res8 = calculateConsensus(case8);
assert(res8.verdict === "warn", "Case 8: 20 unanimous must have verdict 'warn'");
assert(res8.verdictLabel === "20 · Reduced efficiency", "Case 8: verdictLabel must be '20 · Reduced efficiency'");

// 9. Multiclass unanimous 3 (Total cooler failure)
const case9: ModelPrediction[] = [
  { name: "M1", prediction: 3, probability: 0.96 },
  { name: "M2", prediction: 3, probability: 0.98 },
  { name: "M3", prediction: 3, probability: 0.94 },
  { name: "M4", prediction: 3, probability: 0.97 },
];
const res9 = calculateConsensus(case9);
assert(res9.verdict === "fail", "Case 9: 3 unanimous must have verdict 'fail'");
assert(res9.verdictLabel === "3 · Total failure", "Case 9: verdictLabel must be '3 · Total failure'");

// 10. Multiclass split tie (2 vs 2)
const case10: ModelPrediction[] = [
  { name: "M1", prediction: 20, probability: 0.70 },
  { name: "M2", prediction: 20, probability: 0.72 },
  { name: "M3", prediction: 3, probability: 0.80 },
  { name: "M4", prediction: 3, probability: 0.85 },
];
const res10 = calculateConsensus(case10);
assert(res10.verdict === "warn", "Case 10: 2 vs 2 split must have verdict 'warn'");
assert(res10.verdictLabel === "Models disagree", "Case 10: verdictLabel must be 'Models disagree'");
assert(res10.agreementText === "2 of 4 models agree", "Case 10: agreementText must be '2 of 4 models agree'");

console.log("=== All Consensus Test Cases (Binary & Multiclass) Passed Successfully! ===");

