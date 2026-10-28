export interface ModelPrediction {
  name: string;
  prediction: number; // 0 for OK, 1 for Failure
  probability: number; // 0.0 to 1.0
}

export type VerdictType = "ok" | "warn" | "fail";

export interface ConsensusResult {
  verdict: VerdictType;
  verdictLabel: string;
  colorVar: string;
  numFailures: number;
  totalModels: number;
  agreementText: string;
  averageProbability: number;
  hasDisagreement: boolean;
  majorityIsFailure: boolean | null; // true if >2 fail, false if <2 fail, null if 2-2 tie
  modelDisagrees: boolean[]; // whether model[i] disagrees with the majority
}

/**
 * Calculates consensus across model predictions:
 * - A model is counted as failing when its `prediction === 1`.
 * - Verdict rules:
 *   - "fail" ("Failure likely"): numFailures >= 3
 *   - "ok" ("Normal operation"): numFailures === 0 AND avgProbability < 0.3
 *   - "warn" ("Models disagree"): all other cases (1 or 2 failures, or 0 failures with elevated avg >= 0.3)
 */
export function calculateConsensus(models: ModelPrediction[]): ConsensusResult {
  const total = models.length;
  if (total === 0) {
    return {
      verdict: "ok",
      verdictLabel: "Normal operation",
      colorVar: "var(--teal)",
      numFailures: 0,
      totalModels: 0,
      agreementText: "0 of 0 models agree",
      averageProbability: 0,
      hasDisagreement: false,
      majorityIsFailure: null,
      modelDisagrees: [],
    };
  }

  // Multiclass branch (Hydraulic rig: 100 = full efficiency, 20 = reduced, 3 = total failure)
  const isMulticlass = models.some((m) => [3, 20, 100].includes(m.prediction));
  if (isMulticlass) {
    const counts: Record<number, number> = { 100: 0, 20: 0, 3: 0 };
    models.forEach((m) => {
      if (counts[m.prediction] !== undefined) counts[m.prediction]++;
    });

    let majClass = 100;
    let maxCount = -1;
    for (const [clsStr, cnt] of Object.entries(counts)) {
      const cls = Number(clsStr);
      if (cnt > maxCount) {
        maxCount = cnt;
        majClass = cls;
      }
    }

    const topClasses = Object.entries(counts).filter(([_, cnt]) => cnt === maxCount);
    const isTie = topClasses.length > 1;
    const avgProbability = models.reduce((acc, m) => acc + m.probability, 0) / total;

    let verdict: VerdictType;
    let verdictLabel: string;
    let colorVar: string;

    if (isTie || maxCount < 3) {
      verdict = "warn";
      verdictLabel = "Models disagree";
      colorVar = "var(--amber)";
    } else if (majClass === 100) {
      verdict = "ok";
      verdictLabel = "100 · Full efficiency";
      colorVar = "var(--teal)";
    } else if (majClass === 20) {
      verdict = "warn";
      verdictLabel = "20 · Reduced efficiency";
      colorVar = "var(--amber)";
    } else {
      verdict = "fail";
      verdictLabel = "3 · Total failure";
      colorVar = "var(--red)";
    }

    const agreementText = `${maxCount} of ${total} models agree`;
    const modelDisagrees = models.map((m) => isTie || m.prediction !== majClass);
    const hasDisagreement = verdict === "warn" || maxCount < total;

    return {
      verdict,
      verdictLabel,
      colorVar,
      numFailures: counts[3] + counts[20],
      totalModels: total,
      agreementText,
      averageProbability: avgProbability,
      hasDisagreement,
      majorityIsFailure: isTie ? null : majClass !== 100,
      modelDisagrees,
    };
  }

  const failures = models.map((m) => m.prediction === 1);
  const numFailures = failures.filter(Boolean).length;
  const avgProbability = models.reduce((acc, m) => acc + m.probability, 0) / total;

  let verdict: VerdictType;
  let verdictLabel: string;
  let colorVar: string;

  if (numFailures >= 3) {
    verdict = "fail";
    verdictLabel = "Failure likely";
    colorVar = "var(--red)";
  } else if (numFailures === 0 && avgProbability < 0.3) {
    verdict = "ok";
    verdictLabel = "Normal operation";
    colorVar = "var(--teal)";
  } else {
    verdict = "warn";
    verdictLabel = "Models disagree";
    colorVar = "var(--amber)";
  }

  // Majority determination:
  // If > total/2 fail, majority is failure.
  // If < total/2 fail, majority is normal (OK).
  // If exactly tied (e.g. 2 vs 2 for 4 models), majorityIsFailure is null.
  const majorityIsFailure: boolean | null =
    numFailures > total / 2 ? true : numFailures < total / 2 ? false : null;

  const agreementCount = Math.max(numFailures, total - numFailures);
  const agreementText = `${agreementCount} of ${total} models agree`;

  const modelDisagrees = failures.map((isFail) => {
    if (majorityIsFailure === null) return true; // In a 2-2 tie, all models are in disagreement
    return isFail !== majorityIsFailure;
  });

  const hasDisagreement = verdict === "warn" || numFailures > 0 && numFailures < total;

  return {
    verdict,
    verdictLabel,
    colorVar,
    numFailures,
    totalModels: total,
    agreementText,
    averageProbability: avgProbability,
    hasDisagreement,
    majorityIsFailure,
    modelDisagrees,
  };
}
